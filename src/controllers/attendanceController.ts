import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Attendance, { StatusType } from "../models/attendance";
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
        where: { id: EmployeeId },
        include: [
          {
            model: Store,
          },
        ],
      },
    ],
  });

  console.log(user?.employee?.store?.id,"employee<<<<<<<");
  console.log(userId,"userLogin<<<<<<<");
  console.log(storeId,"userLoginStoreId<<<<<<<");
  
  if (userRole === "OWNER") {
    if (userId !== user?.employee?.store?.OwnerId) {
      throw { name: "access_denied" };
    }
  } else if (userRole === "ADMIN" || userRole === "MANAGER") {
    if (storeId !== user?.employee?.StoreId) {
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

    if (!EmployeeId) {
      throw {name: 'Required'}
    }

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
    const { startDate, endDate, EmployeeId, status } = req.query;

    // Get the current user's role and storeId if applicable
    const userRole = req.userData?.role;
    const userStoreId = req.userData?.storeId;
    const userId = req.userData?.id;

    // Validasi status
    const validStatuses: StatusType[] = ["Present", "Absent", "Sick", "Leave"];
    if (status && !validStatuses.includes(status as StatusType)) {
      return res.status(400).json({ message: "Invalid status value. Allowed values are Present, Absent, Sick, or Leave." });
    }

    let whereCondition: any = {};

    // Filter by EmployeeId
    if (EmployeeId) {
      whereCondition.EmployeeId = EmployeeId;
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      };
    }

    // Filter by status if provided
    if (status) {
      whereCondition.status = status as StatusType;
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

    const attendanceReport = await Attendance.findAll({
      where: whereCondition,
      order: [["date", "ASC"]],
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
          ],
        },
      ],
    });

    if (!attendanceReport.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.status(200).json({
      message: "Attendance report generated successfully",
      data: attendanceReport,
    });
  } catch (error) {
    next(error);
  }
};

