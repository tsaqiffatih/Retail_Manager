import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Employee from "../models/employee";
import Attendance from "../models/attendance";
import Payroll from "../models/payroll";
import Store from "../models/store";
import User from "../models/user";
import { authorizeUser } from "./attendanceController";

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
      include: [
        { model: Attendance },
        { model: Payroll },
        { model: Store },
        {
          model: User,
          attributes: { exclude: ["password", "role"] },
        },
      ],
    });

    if (!employee) {
      throw { name: "Not Found", param: "Employee" };
    }

    await authorizeUser(req, employee.id);

    res.status(200).json({ message: "success", data: employee });
  } catch (error) {
    next(error);
  }
};

// Mengedit data detail Employee (yang merupakan data pelengkap entitas user).
export const editEmployee = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const {
      firstName,
      lastName,
      dateOfBirth,
      contact,
      education,
      position,
      salary,
    } = req.body;
    // firstName lastName dateOfBirth contact education position salary

    const protectedFields = ["StoreId", "UserId"];

    for (const field of protectedFields) {
      if (field in updatedData) {
        throw { name: "protected_field", param: field };
      }
    }

    const employee = await Employee.findByPk(id);
    if (!employee) {
      throw { name: "Not Found", param: "Employee" };
    }

    await authorizeUser(req, employee.id);

    if (firstName) employee.firstName = firstName;
    if (lastName) employee.lastName = lastName;
    if (dateOfBirth) employee.dateOfBirth = dateOfBirth;
    if (contact) employee.contact = contact;
    if (education) employee.education = education;
    if (position) employee.position = position;
    if (salary) employee.salary = salary;

    if (
      !firstName &&
      !lastName &&
      !dateOfBirth &&
      !contact &&
      !education &&
      !position &&
      !salary
    ) {
      res.status(400).json({ message: "No fields to update found" });
    }

    await employee.save();
    res.status(200).json({
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};
