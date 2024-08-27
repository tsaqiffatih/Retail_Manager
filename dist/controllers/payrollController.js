"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePayrollReport = exports.editPayroll = void 0;
const payroll_1 = __importDefault(require("../models/payroll"));
const sequelize_1 = require("sequelize");
const employee_1 = __importDefault(require("../models/employee"));
const attendanceController_1 = require("./attendanceController");
const store_1 = __importDefault(require("../models/store"));
// Mengedit data gaji karyawan.
const editPayroll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { amount, status } = req.body;
        const payroll = yield payroll_1.default.findByPk(id);
        if (!payroll) {
            throw { name: "Not Found", param: "Payroll" };
        }
        yield (0, attendanceController_1.authorizeUser)(req, payroll.EmployeeId);
        if (amount)
            payroll.amount = amount;
        if (status)
            payroll.status = status;
        if (!amount && !status) {
            res.status(400).json({ message: "No fields to update found" });
        }
        yield payroll.save;
        res.status(200).json({
            message: "Payroll updated successfully",
            data: payroll,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editPayroll = editPayroll;
//Menghasilkan laporan gaji.
// data sesuai sama user yang sedangn login || data sesuai sama storeId nya
// GET /api/payrolls/report?startDate=2024-08-01&endDate=2024-08-31&status=PAID
// /*
const generatePayrollReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { startDate, endDate, EmployeeId, status } = req.query;
        // Get the current user's role and storeId if applicable
        const userRole = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.role;
        const userStoreId = (_b = req.userData) === null || _b === void 0 ? void 0 : _b.storeId;
        const userId = (_c = req.userData) === null || _c === void 0 ? void 0 : _c.id;
        // Validasi status
        const validStatuses = ["PAID", "UNPAID"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value. Allowed values are PAID or UNPAID.",
            });
        }
        let whereCondition = {};
        // Filter by EmployeeId, only allow if the role is not EMPLOYEE
        if (EmployeeId && userRole !== "EMPLOYEE") {
            whereCondition.EmployeeId = EmployeeId;
        }
        else if (userRole === "EMPLOYEE") {
            whereCondition.EmployeeId = userId;
        }
        if (startDate && endDate) {
            whereCondition.date = {
                [sequelize_1.Op.between]: [
                    new Date(startDate),
                    new Date(endDate),
                ],
            };
        }
        // Filter by status if provided
        if (status) {
            whereCondition.status = status;
        }
        // Additional filtering based on role
        let whereRoleCondition = {};
        let isRequired = true;
        if (userRole === "OWNER") {
            whereRoleCondition = { OwnerId: userId };
        }
        else if (userRole === "ADMIN" || userRole === "MANAGER") {
            whereRoleCondition = { id: userStoreId };
        }
        else {
            throw { name: "access_denied" };
        }
        const { rows: payrollReport, count } = yield payroll_1.default.findAndCountAll({
            where: whereCondition,
            order: [["date", "ASC"]],
            include: [
                {
                    model: employee_1.default,
                    required: isRequired,
                    include: [
                        {
                            model: store_1.default,
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
            totalItems: count,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.generatePayrollReport = generatePayrollReport;
// */
//# sourceMappingURL=payrollController.js.map