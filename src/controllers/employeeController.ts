import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Employee from "../models/employee";
import Attendance from "../models/attendance";
import Payroll from "../models/payroll";
import Store from "../models/store";

// Mengambil detail satu karyawan berdasarkan ID.
export const readOneEmployee = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({
      where: { id },
      include: [Attendance, Payroll, Store],
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    next(error);
  }
};

// Mengedit detail karyawan.
export const editEmployee = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.update(updatedData);
    res
      .status(200)
      .json({ message: "Employee updated successfully", data: employee });
  } catch (error) {
    next(error);
  }
};
