import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Attendance from "../models/attendance";

export const createAttendance = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.userData?.id;
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
    const id = req.userData?.id;
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
    const id = req.userData?.id;
  } catch (error) {
    next(error);
  }
};

// kayak nya gak di butuhin deh karna udah di handle lewat include di employeeController
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

    

    res.status(200).json({data: attendances});
  } catch (error) {
    next(error)
  }
};
