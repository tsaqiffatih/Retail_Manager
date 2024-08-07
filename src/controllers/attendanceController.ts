import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Attendance from "../models/attendance";
import { Op } from "sequelize";

// Merekam kehadiran karyawan.
export const createAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.userData?.id;
    const { date, status, EmployeeId } = req.body;

    const attendance = await Attendance.create({ date, status, EmployeeId });
    res
      .status(201)
      .json({ message: "Attendance recorded successfully", data: attendance });
  } catch (error) {
    next(error);
  }
};

// Menghapus kehadiran karyawan.
export const deleteAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userData?.id;
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    await attendance.destroy();
    res.status(200).json({ message: "Attendance deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Mengedit kehadiran karyawan.
export const editAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userData?.id;
    const { id } = req.params;
    const updatedData = req.body;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    await attendance.update(updatedData);
    
    res.status(200).json({
      message: "Attendance updated successfully",
      data: attendance,
    });
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
          [Op.between]: [
            new Date(startDate as string),
            new Date(endDate as string),
          ],
        },
      },
      order: [["date", "ASC"]],
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

// kayak nya gak di butuhin deh karna udah di handle lewat include di user
export const getAttendanceByEmployee = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const attendances = await Attendance.findAll({
      where: { EmployeeId: id },
      include: "employee",
    });

    res.status(200).json({ data: attendances });
  } catch (error) {
    next(error);
  }
};
