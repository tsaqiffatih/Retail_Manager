import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Payroll from "../models/payroll";
import { Op } from "sequelize";
import Employee from "../models/employee";
import { authorizeUser } from "./attendanceController";
import { createDailyAttendance } from "../schedulers/attendanceScheduler";
import {
  createMonthlyPayroll,
  updatePayrollAmounts,
} from "../schedulers/payrollScheduler";
import Attendance from "../models/attendance";
import Store from "../models/store";

// Merekam data gaji untuk karyawan.
export const createPayroll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date, amount, status, EmployeeId } = req.body;

    if (!EmployeeId) {
      throw { name: "Required", param: "EmployeeId" };
    }

    await authorizeUser(req, EmployeeId);

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
// jika Employee data sesuai sama user yang sedangn login
// jika Manager/Admin data sesuai sama storeId nya
// jika Owner data yang store.OwnerId nya sama dengan dia
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
// GET /api/payrolls/report?startDate=2024-08-01&endDate=2024-08-31&status=PAID
// /*
export const generatePayrollReport = async (
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
    const validStatuses = ["PAID", "UNPAID"];
    if (status && !validStatuses.includes(status as string)) {
      return res
        .status(400)
        .json({
          message: "Invalid status value. Allowed values are PAID or UNPAID.",
        });
    }

    let whereCondition: any = {};

    // Filter by EmployeeId, only allow if the role is not EMPLOYEE
    if (EmployeeId && userRole !== "EMPLOYEE") {
      whereCondition.EmployeeId = EmployeeId;
    } else if (userRole === "EMPLOYEE") {
      whereCondition.EmployeeId = userId;
    }

    if (startDate && endDate) {
      whereCondition.date = {
        [Op.between]: [
          new Date(startDate as string),
          new Date(endDate as string),
        ],
      };
    }

    // Filter by status if provided
    if (status) {
      whereCondition.status = status as string;
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

    const {rows: payrollReport, count} = await Payroll.findAndCountAll({
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

    if (!payrollReport.length) {
      return res.status(404).json({ message: "No payroll records found" });
    }

    res.status(200).json({
      message: "Payroll report generated successfully",
      data: payrollReport,
      totalItems: count
    });
  } catch (error) {
    next(error);
  }
};
// */

/*
export const testingScheduler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("start testing schedule");

    // Mengukur waktu untuk createDailyAttendance
    console.time("createDailyAttendance");
    await createDailyAttendance();
    console.timeEnd("createDailyAttendance"); //38.861ms, 39.682ms
    console.log("success createDailyAttendance<<<<<<<<<<<<<");
    
    // Mengukur waktu untuk createMonthlyPayroll
    console.time("createMonthlyPayroll");
    await createMonthlyPayroll();
    console.timeEnd("createMonthlyPayroll"); //9.143ms, 11.998ms
    console.log("success createMonthlyPayroll<<<<<<<<<<<<<");

    // Mengukur waktu untuk updatePayrollAmounts
    console.time("updatePayrollAmounts");
    await updatePayrollAmounts();
    console.timeEnd("updatePayrollAmounts"); //68.89ms,119.871ms
    console.log("success updatePayrollAmounts<<<<<<<<<<<<<");

    const payrollData = await Payroll.findAll();
    const attendanceData = await Attendance.findAll();
    res
      .status(200)
      .json({
        message: "success",
        dataPayroll: payrollData,
        dataAttendance: attendanceData,
      });
  } catch (error) {
    console.log(error);
  }
};
*/
