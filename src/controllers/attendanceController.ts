import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Attendance from "../models/attendance";
import { Op } from "sequelize";
import User from "../models/user";
import Employee from "../models/employee";
import Store from "../models/store";

// Fungsi untuk otorisasi
export const authorizeUser = async (req: AuthenticatedRequest, EmployeeId: number) => {
  const userRole = req.userData?.role;
  const userId = req.userData?.id;
  const storeId = req.userData?.storeId;

  const user = await User.findOne({
    include: [
      {
        model: Employee,
        required: true,
        where: { id: EmployeeId },
        include: [
          {
            model: Store,
            required: true,
          },
        ],
      },
    ],
  });

  if (userRole === "OWNER") {
    if (userId !== user?.employee.store.id) {
      throw { name: "access_denied" };
    }
  } else if (userRole === "ADMIN" || userRole === "MANAGER") {
    if (storeId !== user?.employee.StoreId) {
      throw { name: "access_denied" };
    }
  } else if (userRole === "EMPLOYEE") {
    if (userId !== user?.id) {
      throw { name: "access_denied" };
    }
  } else {
    throw { name: "access_denied" };
  }
};

export const createAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, status, EmployeeId } = req.body;
    await authorizeUser(req, EmployeeId);

    const attendance = await Attendance.create({ date, status, EmployeeId });
    res.status(201).json({ message: "Attendance recorded successfully", data: attendance });
  } catch (error) {
    next(error);
  }
};

export const deleteAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    await authorizeUser(req, attendance.EmployeeId);
    await attendance.destroy();
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const editAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    await authorizeUser(req, attendance.EmployeeId);
    await attendance.update(updatedData);

    res.status(200).json({ message: "Attendance updated successfully", data: attendance });
  } catch (error) {
    next(error);
  }
};

export const generateAttendanceReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate, EmployeeId } = req.query;

    const attendanceReport = await Attendance.findAll({
      where: {
        EmployeeId,
        date: {
          [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
        },
      },
      order: [["date", "ASC"]],
    });

    if (!attendanceReport.length) {
      throw { name: "Not Found", param: "Attendance records" };
    }

    await authorizeUser(req, Number(EmployeeId));

    res.status(200).json({
      message: "Attendance report generated successfully",
      data: attendanceReport,
    });
  } catch (error) {
    next(error);
  }
};
