import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import Payroll from "../models/payroll";
import { Op } from "sequelize";
import Employee from "../models/employee";
import { authorizeUser } from "./attendanceController";
import Store from "../models/store";

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

