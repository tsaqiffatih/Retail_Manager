import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { comparePassword } from "../helper/bcrypt";
import { createToken } from "../helper/jsonWebToken";
import Employee from "../models/employee";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Store from "../models/store";
import { Op } from "sequelize";
import AuditLog from "../models/auditlog";
import { QueryParams } from "../interface";
import Attendance from "../models/attendance";
import Payroll from "../models/payroll";

// method for user login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const instance = await User.findOne({ where: { email } });
    if (!instance) {
      throw { name: "login failed" };
    }
    const isValidPassword = comparePassword(password, instance.password);
    if (!isValidPassword) {
      throw { name: "login failed" };
    }
    const access_token = createToken({
      email: instance.email,
      username: instance.userName,
    });
    res.status(200).json({ data: access_token });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

export const registerUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = req.userData?.role;

    if (role == "SUPER ADMIN") {
      await registeringOwner(req, res, next);
    } else if (role == "OWNER") {
      await registeringAdmin(req, res, next);
    } else if (role == "ADMIN" || role == "MANAGER") {
      await registeringEmployee(req, res, next);
    } else {
      throw { name: "forbidden" };
    }
  } catch (error) {
    next(error);
  }
};

// method for registering user role owner (AUTHORIZE FOR SUPER ADMIN)
export const registeringOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userName, email, password } = req.body;

    const user = await User.create({
      userName,
      email,
      password,
      role: "OWNER",
    });

    res
      .status(200)
      .json({ message: `New User with email: ${email}, have been registered` });
  } catch (error) {
    next(error);
  }
};

// method for registering user role admin (AUTHORIZE FOR OWNER)
export const registeringAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      contact,
      education,
      address,
      position,
      salary,
      password,
      email,
      storeId,
      role,
    } = req.body;

    const userName = firstName + lastName;

    const user = await User.create({
      userName: userName,
      email,
      password,
      role: role,
    });

    const userId = user.id;

    if (!storeId) {
      throw { name: "Required", param: "storeId" };
    }

    const store = await Store.findOne({ where: { id: storeId } });

    if (!store) {
      throw { name: "Not Found", param: "Store" };
    }

    const ownerId = req.userData?.id;

    if (store.OwnerId !== ownerId) {
      throw { name: "invalid_StoreId" };
    }

    const employee = await Employee.create({
      firstName,
      lastName,
      dateOfBirth,
      contact,
      education,
      address,
      position,
      salary,
      UserId: userId,
      StoreId: storeId,
    });

    res
      .status(200)
      .json({ message: `New User with email: ${email}, have been registered` });
  } catch (error) {
    next(error);
  }
};

// method for registering user role Employee (AUTHORIZE FOR ADMIN)
export const registeringEmployee = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      contact,
      education,
      address,
      position,
      salary,
      password,
      email,
    } = req.body;

    const username = firstName + lastName;

    const user = await User.create({
      userName: username,
      email,
      password,
      role: "EMPLOYEE",
    });

    const userId = user.id;
    const storeId = req.userData?.storeId;

    const employee = await Employee.create({
      firstName,
      lastName,
      dateOfBirth,
      contact,
      education,
      address,
      position,
      salary,
      UserId: userId,
      StoreId: storeId,
    });

    res
      .status(200)
      .json({ message: `New User with email: ${email}, have been registered` });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};

/*
===> masih rancu <===
export const editPutUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id
  } catch (error) {
    console.log(error);
    
  }
};
*/

export const editUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;

    if (parseInt(userId) != req.userData?.id) {
      throw { name: "access_denied" };
    }

    const user = await User.findByPk(userId);
    if (!user) throw { name: "Not Found", param: "User" };

    await user.update(req.body);

    res.status(200).json({ message: "Success update user data" });
  } catch (error) {
    next(error);
  }
};

// ====> HARD DELETE <=====
export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.id, 10); // Pastikan ID dalam format number

    // Mengambil data user beserta Employee terkait
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Employee,
          as: "employees",
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRole = req.userData?.role;
    const ownerId = req.userData?.id as number;

    // Super Admin bisa langsung menghapus user role owner
    if (userRole === "SUPER ADMIN" && user.role === "OWNER") {
      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    }

    const storesOwner = await Store.findAll({
      where: { OwnerId: ownerId },
    });

    // Owner dapat menghapus user di store yang dimiliki
    if (userRole === "OWNER" && user.role !== "OWNER") {
      const userStoreId = user.employee?.StoreId; // Ambil StoreId dari Employee
      const isOwnerOfStore = storesOwner.some(
        (store) => store.id === userStoreId
      );

      if (!isOwnerOfStore) {
        return res.status(403).json({ message: "Unauthorized Store" });
      }

      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    }

    // Admin dapat menghapus user role employee di store yang dikelola
    if (userRole === "ADMIN" && user.role !== "OWNER") {
      const adminStoreId = req.userData?.storeId; // storeId dari authMiddleware
      const userStoreId = user.employee?.StoreId; // Ambil StoreId dari Employee

      if (adminStoreId !== userStoreId) {
        return res.status(403).json({ message: "Unauthorized Store" });
      }

      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    }

    return res.status(403).json({ message: "Unauthorized Delete" });
  } catch (error) {
    next(error);
  }
};

/*
// ======> SOFT DELETE <======
// ======> TAMBAH KOLOM ISDELETED DI TABLE JIKA INGIN DIGUNAKAN <=====
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;

    // Verifikasi hak akses
    if (parseInt(userId) !== req.userData?.id) {
      throw { name: 'access_denied' };
    }

    // Temukan pengguna berdasarkan ID
    const user = await User.findByPk(userId);

    // Validasi jika pengguna tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Tandai pengguna sebagai dihapus (penghapusan logis)
    user.isDeleted = true;
    await user.save();

    // Kirim respons sukses
    res.status(200).json({ message: 'User successfully marked as deleted' });

  } catch (error) {
    next(error); // Serahkan ke middleware error handler
  }
};
*/

export const readOne = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

// buat apa?
/*
ngambil data User, tapi untuk apa ngambil data user ini? 
ya untuk ngambil data user yang ada di tokonya. 
role admin, ngambil data user dengan role employee dan manager dan admin yang StoreId nya sama dengan dia
 include data attendance, data employee, data payroll nya
role Owner, ngambil data user dengan role employee dan manager dan admin yang 
*/
