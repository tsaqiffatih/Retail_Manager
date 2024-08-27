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
exports.editEmployee = exports.readOneEmployee = void 0;
const employee_1 = __importDefault(require("../models/employee"));
const attendance_1 = __importDefault(require("../models/attendance"));
const payroll_1 = __importDefault(require("../models/payroll"));
const store_1 = __importDefault(require("../models/store"));
const user_1 = __importDefault(require("../models/user"));
const attendanceController_1 = require("./attendanceController");
// Mengambil detail satu karyawan berdasarkan ID.
const readOneEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const employee = yield employee_1.default.findOne({
            where: { id },
            include: [
                { model: attendance_1.default },
                { model: payroll_1.default },
                { model: store_1.default },
                {
                    model: user_1.default,
                    attributes: { exclude: ["password", "role"] },
                },
            ],
        });
        if (!employee) {
            throw { name: "Not Found", param: "Employee" };
        }
        yield (0, attendanceController_1.authorizeUser)(req, employee.id);
        res.status(200).json({ message: "success", data: employee });
    }
    catch (error) {
        next(error);
    }
});
exports.readOneEmployee = readOneEmployee;
// Mengedit data detail Employee (yang merupakan data pelengkap entitas user).
const editEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const { firstName, lastName, dateOfBirth, contact, education, position, salary, } = req.body;
        // firstName lastName dateOfBirth contact education position salary
        const protectedFields = ["StoreId", "UserId"];
        for (const field of protectedFields) {
            if (field in updatedData) {
                throw { name: "protected_field", param: field };
            }
        }
        const employee = yield employee_1.default.findByPk(id);
        if (!employee) {
            throw { name: "Not Found", param: "Employee" };
        }
        yield (0, attendanceController_1.authorizeUser)(req, employee.id);
        if (firstName)
            employee.firstName = firstName;
        if (lastName)
            employee.lastName = lastName;
        if (dateOfBirth)
            employee.dateOfBirth = dateOfBirth;
        if (contact)
            employee.contact = contact;
        if (education)
            employee.education = education;
        if (position)
            employee.position = position;
        if (salary)
            employee.salary = salary;
        if (!firstName &&
            !lastName &&
            !dateOfBirth &&
            !contact &&
            !education &&
            !position &&
            !salary) {
            res.status(400).json({ message: "No fields to update found" });
        }
        yield employee.save();
        res.status(200).json({
            message: "Employee updated successfully",
            data: employee,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editEmployee = editEmployee;
//# sourceMappingURL=employeeController.js.map