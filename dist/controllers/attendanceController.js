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
exports.generateAttendanceReport = exports.editAttendance = exports.authorizeUser = void 0;
const attendance_1 = __importDefault(require("../models/attendance"));
const sequelize_1 = require("sequelize");
const user_1 = __importDefault(require("../models/user"));
const employee_1 = __importDefault(require("../models/employee"));
const store_1 = __importDefault(require("../models/store"));
// function for authorization
const authorizeUser = (req, EmployeeId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const userRole = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.role;
    const userId = (_b = req.userData) === null || _b === void 0 ? void 0 : _b.id;
    const storeId = (_c = req.userData) === null || _c === void 0 ? void 0 : _c.storeId;
    const user = yield user_1.default.findOne({
        include: [
            {
                model: employee_1.default,
                where: { id: EmployeeId },
                include: [
                    {
                        model: store_1.default,
                    },
                ],
            },
        ],
    });
    if (userRole === "OWNER") {
        if (userId !== ((_e = (_d = user === null || user === void 0 ? void 0 : user.employee) === null || _d === void 0 ? void 0 : _d.store) === null || _e === void 0 ? void 0 : _e.OwnerId)) {
            throw { name: "access_denied" };
        }
    }
    else if (userRole === "ADMIN" || userRole === "MANAGER") {
        if (storeId !== ((_f = user === null || user === void 0 ? void 0 : user.employee) === null || _f === void 0 ? void 0 : _f.StoreId)) {
            throw { name: "access_denied" };
        }
    }
    else if (userRole === "EMPLOYEE") {
        if (userId !== (user === null || user === void 0 ? void 0 : user.id)) {
            throw { name: "access_denied" };
        }
    }
    else {
        throw { name: "access_denied" };
    }
});
exports.authorizeUser = authorizeUser;
const editAttendance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Validasi bahwa status merupakan salah satu dari nilai yang valid
        const validStatuses = ["Present", "Absent", "Sick", "Leave"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }
        const attendance = yield attendance_1.default.findByPk(id);
        if (!attendance) {
            throw { name: "Not Found", param: "Attendance" };
        }
        yield (0, exports.authorizeUser)(req, attendance.EmployeeId);
        attendance.status = status;
        yield attendance.save();
        res.status(200).json({
            message: "Attendance updated successfully",
            data: attendance,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editAttendance = editAttendance;
const generateAttendanceReport = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { startDate, endDate, EmployeeId, status } = req.query;
        // Get the current user's role and storeId if applicable
        const userRole = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.role;
        const userStoreId = (_b = req.userData) === null || _b === void 0 ? void 0 : _b.storeId;
        const userId = (_c = req.userData) === null || _c === void 0 ? void 0 : _c.id;
        // Validasi status
        const validStatuses = ["Present", "Absent", "Sick", "Leave"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value. Allowed values are Present, Absent, Sick, or Leave.",
            });
        }
        let whereCondition = {};
        // Filter by EmployeeId
        if (EmployeeId && userRole !== "EMPLOYEE") {
            whereCondition.EmployeeId = EmployeeId;
        }
        // Filter by date range if provided
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
        else if (userRole === "SUPER ADMIN") {
            whereRoleCondition = {};
            isRequired = false;
        }
        else if (userRole === "EMPLOYEE") {
            whereCondition.EmployeeId = userId;
        }
        else {
            throw { name: "access_denied" };
        }
        const attendanceReport = yield attendance_1.default.findAll({
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
        if (!attendanceReport.length) {
            return res.status(404).json({ message: "No attendance records found" });
        }
        res.status(200).json({
            message: "Attendance report generated successfully",
            data: attendanceReport,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.generateAttendanceReport = generateAttendanceReport;
//# sourceMappingURL=attendanceController.js.map