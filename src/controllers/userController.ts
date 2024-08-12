import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { comparePassword } from "../helper/bcrypt";
import { createToken } from "../helper/jsonWebToken";
import Employee from "../models/employee";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Store from "../models/store";
import { Op } from "sequelize";
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
    res.status(200).json({ access_token: access_token });
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

export const editUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const userRole = req.userData?.role;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Employee,
          include: [
            {
              model: Store,
            },
          ],
        },
      ],
    });
    if (!user) throw { name: "Not Found", param: "User" };

    if (userRole == "OWNER") {
      if (
        req.userData?.id === user?.employee?.store?.OwnerId ||
        req.userData?.id === user.id
      ) {
      } else {
        throw { name: "forbidden" };
      }
    } else if (userRole == "ADMIN" || userRole == "MANAGER") {
      if (req.userData?.storeId !== user?.employee?.store?.id) {
        throw { name: "forbidden" };
      }
    } else if (userRole == "EMPLOYEE") {
      if (req.userData?.id !== user?.id) {
        throw { name: "forbidden" };
      }
    } else {
      throw { name: "forbidden" };
    }

    await user.update(req.body);

    const userResponse = user.get({ plain: true });
    delete userResponse.password;

    res
      .status(200)
      .json({ message: "Success update user data", data: userResponse });
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
    const userId = parseInt(req.params.id);

    // Mengambil data user beserta Employee terkait
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Employee,
          required: true,
          include: [
            {
              model: Store,
              required: true,
            },
          ],
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

    // Owner dapat menghapus user di store yang dimiliki
    if (
      userRole === "OWNER" &&
      user.role !== "OWNER" &&
      user.role !== "SUPER ADMIN"
    ) {
      // StoreId dari user yang ingin di hapus
      const userStoreId = user.employee.store.OwnerId; // Ambil OwnerId dari Store
      // cek,apakah user yang akan di hapus merupakan karyawan dari Owner atau bukan

      if (req.userData?.id !== userStoreId) {
        return res.status(403).json({ message: "Unauthorized Store" });
      }

      await user.destroy();
      return res.status(200).json({ message: "User deleted successfully" });
    }

    // Admin dapat menghapus user role employee di store yang dikelola
    if (
      userRole === "ADMIN" ||
      (userRole === "MANAGER" && user.role !== "OWNER")
    ) {
      if (req.userData?.storeId !== user.employee.StoreId) {
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
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "role"] },
      include: {
        model: Employee,
        include: [
          {
            model: Store,
          },
          Attendance,
          Payroll,
        ],
      },
    });

    if (!user) {
      throw { name: "Not Found", param: "User" };
    }

    if (user.userName == "superAdmin") {
      throw { name: "access_denied" };
    }

    if (req.userData?.role == "OWNER") {
      if (req.userData?.id !== user?.employee?.store?.OwnerId) {
        throw { name: "access_denied" };
      }
    } else if (
      req.userData?.role == "ADMIN" ||
      req.userData?.role == "MANAGER"
    ) {
      if (user?.employee?.StoreId !== req.userData?.storeId) {
        throw { name: "access_denied" };
      }
    } else if (req.userData?.role == "EMPLOYEE") {
      if (req.userData?.id !== user.id) {
        throw { name: "access_denied" };
      }
    } else {
      throw { name: "access_denied" };
    }

    res.status(200).json({ message: "success", data: user });
  } catch (error) {
    next(error);
  }
};

export const readAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, page, limit, sortBy, order } = req.query;

    // Default values and parsing
    const sortField = (sortBy as string) || "userName";
    const sortOrder = (order as string) || "ASC";
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;
    const offset = (pageNumber - 1) * limitNumber;

    // Get the current user's role and storeId if applicable
    const userRole = req.userData?.role;
    const userStoreId = req.userData?.storeId;
    const userId = req.userData?.id;

    // Build search condition

    let whereCondition: any = {};

    if (search) {
      whereCondition = {
        ...whereCondition,
        [Op.or]: [
          { userName: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ],
      };
    }

    // Additional filtering based on role
    let whereRoleCondition: any = {};
    let isRequired: boolean = true;

    if (userRole === "OWNER") {
      whereRoleCondition = { OwnerId: userId };
    } else if (userRole === "ADMIN" || userRole === "MANAGER") {
      whereRoleCondition = { id: userStoreId };
    } else if (userRole === "SUPER ADMIN") {
      whereRoleCondition = {};
      isRequired = false;
    } else {
      throw { name: "access_denied" };
    }

    // Find and count users
    const { rows: users, count } = await User.findAndCountAll({
      order: [[sortField, sortOrder]],
      limit: limitNumber,
      offset,
      attributes: { exclude: ["password", "role"] },
      where: whereCondition,
      include: [
        {
          model: Employee,
          required: isRequired,
          include: [
            {
              model: Store,
              where: whereRoleCondition,
              required: isRequired,
            },
            {
              model: Attendance,
            },
            {
              model: Payroll,
            },
          ],
        },
      ],
    });

    // Respond with users and count
    res.status(200).json({
      message: "success",
      data: users,
      totalItems: count,
      totalPages: Math.ceil(count / limitNumber),
      currentPage: pageNumber,
    });
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

    if (role == "SUPER ADMIN" || role == "OWNER") {
      throw { name: "invalid_role" };
    }

    const user = await User.create({
      userName,
      email,
      password,
      role,
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
