
userRouter.ts:
import express from "express";
import {
  deleteUser,
  editUser,
  login,
  readAll,
  readOne,
  registeringAdmin,
  registeringEmployee,
  registeringOwner,
  registerUser,
} from "../controllers/userController";
import { authentication, authorizeRole } from "../middleware/authMiddleware";
import { auditMiddleware } from "../middleware/auditMiddleware";

const router = express.Router();

router.post("/login", login);

router.use(authentication);

router.get("/:id", auditMiddleware("User"), readOne);
router.patch("/:id", auditMiddleware("User"), editUser);
router.get(
  "/",
  authorizeRole("OWNER", "SUPER ADMIN", "ADMIN", "MANAGER"),
  auditMiddleware("User"),
  readAll
);
router.post(
  "/register",
  authorizeRole("OWNER", "SUPER ADMIN", "ADMIN", "MANAGER"),
  auditMiddleware("User"),
  registerUser
);
router.delete(
  "/:id",
  authorizeRole("OWNER", "SUPER ADMIN", "ADMIN"),
  auditMiddleware("User"),
  deleteUser
);
 
export default router;


userController.ts:
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

    if (!email) {
      throw { name: "Required", param: "Email" };
    }

    if (!password) {
      throw { name: "Required", param: "Password" };
    }

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

    res.status(200).json({
      message: "Success update user data",
      data: userResponse,
    });
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
          { userName: { [Op.iLike]: %${search}% } },
          { email: { [Op.iLike]: %${search}% } },
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
      .json({ message: New User with email: ${email}, have been registered });
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
      .json({ message: New User with email: ${email}, have been registered });
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
      .json({ message: New User with email: ${email}, have been registered });
  } catch (error) {
    // console.log(error);
    next(error);
  }
};


berdasarkan router dan controller diatas. apakah userController.test.ts dibawah ini sudah benar?

import request from "supertest";
import app, { server } from "../app"; // Sesuaikan dengan path ke file utama aplikasi Anda
import sequelizeConnection from "../config/connection";
import { Sequelize } from "sequelize";
import { createToken } from "../helper/jsonWebToken"; // Sesuaikan dengan path ke file helper jsonWebToken

const deleteTestDatabase = async () => {
  const sequelize = new Sequelize(
    "postgres",
    process.env.DB_USERNAME as string,
    process.env.DB_PASSWORD,
    {
      host: "127.0.0.1",
      dialect: "postgres",
      logging: false,
    }
  );

  try {
    await sequelize.query("DROP DATABASE IF EXISTS database_test");
  } catch (error) {
    // console.log("Error deleting database:", error);
  } finally {
    // console.log("========== Test database deleted ==========");
    await sequelize.close();
  }
};


describe("User Controller Tests", () => {

   // Simulated payloads for different roles
  const superAdminPayload = { email: 'superAdmin@mail.com', username: 'superAdmin' };
  const ownerPayload = { email: 'owner1@mail.com', username: 'owner1Pass' };
  const adminPayload = { email: 'admin1@mail.com', username: 'admin1Pass' };
  const employeePayload = { email: 'employee1@mail.com', username: 'employee1Pass' };

  // Generate tokens for different roles
  const superAdminToken = createToken(superAdminPayload);
  const ownerToken = createToken(ownerPayload);
  const adminToken = createToken(adminPayload);
  const employeeToken = createToken(employeePayload);

  afterAll(async () => {
    await sequelizeConnection.close();
    server.close();
    await deleteTestDatabase();
  }, 15000);

  describe("POST /login", () => {
    test("success post /login", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "superAdmin@mail.com",
        password: "superAdminPass",
      });

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("data", expect.any(String));
    });

    test("fail post /login with wrong email", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "wrong@mail.com",
        password: "superAdminPass",
      });

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "email or password was wrong");
    });

    test("fail post /login with wrong password", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "superAdmin@mail.com",
        password: "wrongPass",
      });

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "email or password was wrong");
    });
  });

  describe("POST /register/owner", () => {
    test("success post", async () => {
      const response = await request(app)
        .post("/api/users/register/owner")
        .send({
          userName: "ownerTest",
          email: "ownerTest@mail.com",
          password: "ownerPass1",
        })
        .set("Authorization", Bearer ${superAdminToken});

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
    });

    test("fail post cause use existing userName ", async () => {
      const response = await request(app)
        .post("/api/users/register/owner")
        .send({
          userName: "ownerTest",
          email: "ownerTest@mail.com",
          password: "ownerPass1",
        })
        .set("Authorization", Bearer ${superAdminToken});

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "userName has been already exists");
    });

    test("fail post cause use existing email", async () => {
      const response = await request(app)
        .post("/api/users/register/owner")
        .send({
          userName: "ownerTest1",
          email: "ownerTest@mail.com",
          password: "ownerPass1",
        })
        .set("Authorization", Bearer ${superAdminToken});

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "email has been already exists");
    });

    test("fail post cause use bad password", async () => {
      const response = await request(app)
        .post("/api/users/register/owner")
        .send({
          userName: "ownerTest",
          email: "ownerTest@mail.com",
          password: "ownerPass",
        })
        .set("Authorization", Bearer ${superAdminToken});

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "Password must contain at least one number.");
    });
  });

  describe("POST /register-admin", () => {
    test("success post /register-admin", async () => {
      
      const response = await request(app)
        .post("/api/users/register/admin")
        .send({
          firstName: "admin",
          lastName: "Test",
          dateOfBirth: "1990-01-01",
          contact: "123456789",
          education: "Bachelor",
          address: "Admin Street",
          position: "MANAGER",
          salary: 500000,
          password: "adminPass1",
          email: "adminTest@mail.com",
          storeId: 1
        })
        .set("Authorization", Bearer ${ownerToken});

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
    });

    test("fail post /register-admin with existing userName", async () => {
      
      const response = await request(app)
        .post("/api/users/register/admin")
        .send({
          firstName: "admin",
          lastName: "Test",
          dateOfBirth: "1990-01-01",
          contact: "123456789",
          education: "Bachelor",
          address: "Admin Street",
          position: "Manager",
          salary: 5000,
          password: "adminPass1",
          email: "adminTest2@mail.com",
          storeId: 1
        })
        .set("Authorization", Bearer ${ownerToken});

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "userName has been already exists");
    });

    test("fail post /register-admin with existing email", async () => {
      const response = await request(app)
        .post("/api/users/register/admin")
        .send({
          firstName: "admin",
          lastName: "Test2",
          dateOfBirth: "1990-01-01",
          contact: "123456789",
          education: "Bachelor",
          address: "Admin Street",
          position: "Manager",
          salary: 5000,
          password: "adminPass1",
          email: "adminTest@mail.com",
          storeId: 1
        })
        .set("Authorization", Bearer ${ownerToken});

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "email has been already exists");
    });

    test("fail post cause authorize role ", async () => {
      const response = await request(app)
        .post("/api/users/register/admin")
        .send({
          firstName: "admin",
          lastName: "Test2",
          dateOfBirth: "1990-01-01",
          contact: "123456789",
          education: "Bachelor",
          address: "Admin Street",
          position: "Manager",
          salary: 5000,
          password: "adminPass1",
          email: "adminTest@mail.com",
          storeId: 1
        })
        .set("Authorization", Bearer ${employeeToken});

      const { body, status } = response;
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "Forbidden Access");
    });

  });

  describe("POST /register-employee", () => {
    test("success post /register-employee", async () => {
      const response = await request(app)
        .post("/api/users/register/employee")
        .send({
          firstName: "employee",
          lastName: "Test",
          dateOfBirth: "1995-05-05",
          contact: "987654321",
          education: "High School",
          address: "Employee Street",
          position: "Staff",
          salary: 3000,
          password: "employeePass1",
          email: "employeeTest@mail.com",
        })
        .set("Authorization", Bearer ${adminToken});

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
    });

    test("fail post cause existing email", async () => {
      
      const response = await request(app)
        .post("/api/users/register/employee")
        .send({
          firstName: "employee",
          lastName: "Test2",
          dateOfBirth: "1995-05-05",
          contact: "987654321",
          education: "High School",
          address: "Employee Street",
          position: "Staff",
          salary: 3000,
          password: "employeePass1",
          email: "employeeTest@mail.com", // email yang sama dengan sebelumnya
        })
        .set("Authorization", Bearer ${adminToken});

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "email has been already exists");
    });

    test("fail post cause existing username", async () => {
      
      const response = await request(app)
        .post("/api/users/register/employee")
        .send({
          firstName: "employee",
          lastName: "Test",
          dateOfBirth: "1995-05-05",
          contact: "987654321",
          education: "High School",
          address: "Employee Street",
          position: "Staff",
          salary: 3000,
          password: "employeePass1",
          email: "employee2Test@mail.com",
        })
        .set("Authorization", Bearer ${adminToken});

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "userName has been already exists");
    });
  });

  describe("PATCH /edit-user", () => {
    test("success patch /edit-user", async () => {
      
      const response = await request(app)
        .patch("/api/users/edit/user/1") // Sesuaikan dengan id yang ada di database
        .send({
          userName: "updatedName",
          email: "updated@mail.com",
          password: "updatedPass",
        })
        .set("Authorization", Bearer ${employeeToken});

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "Success update data");
    });

    test("fail patch /edit-user with unauthorized access", async () => {
      
      const response = await request(app)
        .patch("/api/users/edit-user/1") // Sesuaikan dengan id yang ada di database
        .send({
          userName: "updatedName",
          email: "updated@mail.com",
          password: "updatedPass",
        })
        .set("Authorization", Bearer 2029392948384932309102392220429); // Sesuaikan dengan token yang tidak valid

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "access_denied");
    });
  });
/*
  describe("DELETE /delete-user", () => {
    test("success delete /delete-user", async () => {
      
      const response = await request(app)
        .delete("/api/users/delete-user/1") // Sesuaikan dengan id yang ada di database
        .set("Authorization", Bearer ${superAdminToken});

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "User successfully deleted");
    });

    test("fail delete /delete-user with unauthorized access", async () => {
      
      const response = await request(app)
        .delete("/api/users/delete-user/1") // Sesuaikan dengan id yang ada di database
        .set("Authorization", Bearer ${employeeToken});

      const { body, status } = response;
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty(
        "message",
        "You do not have permission to delete this user"
      );
    });
  });
  */
});
