import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Payroll from "../models/payroll";
import { Op } from "sequelize";
import Employee from "../models/employee";
import { authorizeUser } from "./attendanceController";

// Merekam data gaji untuk karyawan.
export const createPayroll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, amount, status, EmployeeId } = req.body;

    if (!EmployeeId) {
      throw {name: 'Required', param: 'EmployeeId'}
    }

    await authorizeUser(req,EmployeeId)

    const payroll = await Payroll.create({ date, amount, status, EmployeeId });
    res.status(201).json({
      message: "Payroll recorded successfully",
      data: payroll,
    });
  } catch (error) {
    next(error);
  }
};

// Mengambil data gaji satu karyawan berdasarkan ID.
export const readOnePayroll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findOne({
      where: { id },
      include: [Employee],
    });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    await authorizeUser(req, payroll.EmployeeId);

    res.status(200).json({ message: "success", data: payroll });
  } catch (error) {
    next(error);
  }
};

// Mengedit data gaji karyawan.
export const editPayroll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const payroll = await Payroll.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    await authorizeUser(req, payroll.EmployeeId);

    await payroll.update(updatedData);
    res.status(200).json({
      message: "Payroll updated successfully",
      data: payroll,
    });
  } catch (error) {
    next(error);
  }
};

//   Menghapus data gaji karyawan.
export const deletePayroll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const payroll = await Payroll.findByPk(id);
    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    await authorizeUser(req, payroll.EmployeeId);

    await payroll.destroy();
    res.status(200).json({ message: "Payroll deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Mengambil semua data gaji, dengan opsi filter berdasarkan EmployeeId dan rentang tanggal.
// data sesuai sama user yang sedangn login || data sesuai sama storeId nya
// /*
export const readAllPayrolls = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { EmployeeId, startDate, endDate } = req.query;
    let whereCondition: any = {};

    if (EmployeeId) {
      whereCondition.EmployeeId = EmployeeId;
    }

    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [
          new Date(startDate as string),
          new Date(endDate as string),
        ],
      };
    }

    const payrolls = await Payroll.findAll({
      where: whereCondition,
      include: [Employee],
    });

    res.status(200).json({
      message: "Payrolls retrieved successfully",
      data: payrolls,
    });
  } catch (error) {
    next(error);
  }
};
// */

//Menghasilkan laporan gaji.
// data sesuai sama user yang sedangn login || data sesuai sama storeId nya
// /*
export const generatePayrollReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate, EmployeeId } = req.query;

    let whereCondition: any = {};
    if (EmployeeId) {
      whereCondition.EmployeeId = EmployeeId;
    }

    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [
          new Date(startDate as string),
          new Date(endDate as string),
        ],
      };
    }

    const payrollReport = await Payroll.findAll({
      where: whereCondition,
      order: [["date", "ASC"]],
      include: [Employee],
    });

    if (!payrollReport.length) {
      return res.status(404).json({ message: "No payroll records found" });
    }

    res.status(200).json({
      message: "Payroll report generated successfully",
      data: payrollReport,
    });
  } catch (error) {
    next(error);
  }
};
// */
