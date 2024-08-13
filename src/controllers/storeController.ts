import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Store from "../models/store";
import Employee from "../models/employee";
import Payroll from "../models/payroll";
import Attendance from "../models/attendance";
import { Model, OrderItem } from "sequelize";
import User from "../models/user";

export const readAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const ownerId = req.userData?.id;
    const userRole = req.userData?.role;

    const sortBy = (req.query.sortBy as string) || "name";
    const order = ((req.query.order as string) || "ASC").toUpperCase();
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const page = parseInt((req.query.page as string) || "1", 10);

    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: "Invalid limit value." });
    }

    if (isNaN(page) || page <= 0) {
      return res.status(400).json({ message: "Invalid page value." });
    }

    const offset = (page - 1) * limit;

    const options = {
      order: [[sortBy, order]] as OrderItem[],
      limit: limit,
      offset: offset,
      include: [
        {
          model: Employee,
          include: [
            { model: Payroll },
            { model: Attendance },
            {
              model: User,
              attributes: { exclude: ["password"] },
            },
          ],
        },
      ],
      where: {},
    };

    if (userRole === "OWNER") {
      options.where = { OwnerId: ownerId };
    } else if (userRole === "ADMIN" || userRole === "MANAGER") {
      options.where = { id: req.userData?.storeId };
    }

    const result = await Store.findAndCountAll(options);

    res.status(200).json({
      message: "success",
      data: result.rows,
      totalItems: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

export const createStore = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, location, category } = req.body;
    const ownerId = req.userData?.id;

    const store = await Store.create({
      name,
      location,
      category,
      OwnerId: ownerId,
    });

    res.status(200).json({ message: "success", data: store });
  } catch (error) {
    next(error);
  }
};

export const readOneStore = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.params.id;
    const ownerId = req.userData?.id;
    const roleUser = req.userData?.role;
    const userStoreId = req.userData?.storeId;

    const store = await Store.findByPk(storeId, {
      include: [
        {
          model: Employee,
          include: [{ model: Attendance }, { model: Payroll }],
        },
      ],
    });

    if (!store) {
      throw { name: "Not Found", param: "Store" };
    }

    if (roleUser == "OWNER") {
      if (store.OwnerId !== ownerId) {
        throw { name: "Unauthorized_Get_Store" };
      }
    }

    if (roleUser == "ADMIN" || roleUser == "MANAGER") {
      if (userStoreId !== store.id) {
        throw { name: "Unauthorized_Get_Store" };
      }
    }

    res.status(200).json({ message: "success", data: store });
  } catch (error) {
    next(error);
  }
};

// belum di coba
export const destroyStore = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const storeId = req.params.id;
    const userId = req.userData?.id;

    const store = await Store.findByPk(storeId, {
      include: [
        {
          model: Employee,
        },
      ],
    });

    if (!store) {
      throw { name: "Not Found", param: "Store" };
    }

    if (store.OwnerId !== userId) {
      throw { name: "access_denied" };
    }

    const employeeUserIds = store.employees.map((emp) => emp.UserId);

    await store.destroy();

    for (const userId of employeeUserIds) {
      const user = await User.findByPk(userId);
      if (user) {
        await user.destroy();
      }
    }

    res.status(200).json({
      message: "Store and related Users deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const editStore = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const userId = req.userData?.id;

    const store = await Store.findByPk(id);

    if (!store) throw { name: "Not Found", param: "Store" };

    if (userId !== store.OwnerId) {
      throw { name: "access_denied" };
    }

    await store.update(req.body);

    res.status(200).json({
      message: "Success update store data",
      data: store,
    });
  } catch (error) {
    next(error);
  }
};
