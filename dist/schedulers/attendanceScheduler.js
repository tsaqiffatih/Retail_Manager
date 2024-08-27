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
exports.createDailyAttendance = exports.scheduleAttendanceCreation = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const employee_1 = __importDefault(require("../models/employee"));
const attendance_1 = __importDefault(require("../models/attendance"));
// Cron job untuk membuat record Attendance setiap hari kerja pada pukul 1 dini hari
const scheduleAttendanceCreation = () => {
    node_cron_1.default.schedule("0 1 * * 1-5", () => __awaiter(void 0, void 0, void 0, function* () {
        // Setiap hari kerja (Senin sampai Jumat) pukul 1 dini hari
        yield (0, exports.createDailyAttendance)();
    }));
};
exports.scheduleAttendanceCreation = scheduleAttendanceCreation;
const createDailyAttendance = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Running Attendance Creation Scheduler");
        const employees = yield employee_1.default.findAll();
        const currentDate = new Date();
        // Buat record attendance untuk setiap karyawan dengan status Absent
        const attendanceRecords = employees.map((employee) => ({
            EmployeeId: employee.id,
            date: currentDate, // Tanggal hari ini
        }));
        // Bulk create attendance records
        yield attendance_1.default.bulkCreate(attendanceRecords);
        console.log("Attendance records created successfully!");
    }
    catch (error) {
        console.error("Error creating attendance records:", error);
    }
});
exports.createDailyAttendance = createDailyAttendance;
//# sourceMappingURL=attendanceScheduler.js.map