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
exports.updatePayrollAmounts = exports.createMonthlyPayroll = exports.schedulePayrollUpdate = exports.schedulePayrollCreation = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const employee_1 = __importDefault(require("../models/employee"));
const payroll_1 = __importDefault(require("../models/payroll"));
const attendance_1 = __importDefault(require("../models/attendance"));
// Cron job untuk membuat record Payroll setiap awal bulan
const schedulePayrollCreation = () => {
    //   cron.schedule("*/2 * * * *", async () => { // Setiap 2 menit
    node_cron_1.default.schedule("0 0 1 * *", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, exports.createMonthlyPayroll)();
    }));
};
exports.schedulePayrollCreation = schedulePayrollCreation;
// Cron job untuk mengupdate amount Payroll berdasarkan absen setiap tanggal 28
const schedulePayrollUpdate = () => {
    //   cron.schedule("* * * * *", async () => { // Setiap 1 menit
    node_cron_1.default.schedule("0 0 28 * *", () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, exports.updatePayrollAmounts)();
    }));
};
exports.schedulePayrollUpdate = schedulePayrollUpdate;
const createMonthlyPayroll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Running Payroll Creation");
        const employees = yield employee_1.default.findAll();
        const payrolldate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const payrolls = employees.map((employee) => ({
            EmployeeId: employee.id,
            amount: employee.salary,
            status: "UNPAID",
            date: payrolldate,
        }));
        yield payroll_1.default.bulkCreate(payrolls);
        console.log("Payroll records created successfully!");
    }
    catch (error) {
        console.error("Error creating payroll records:", error);
    }
});
exports.createMonthlyPayroll = createMonthlyPayroll;
const updatePayrollAmounts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Running Payroll Update Scheduler");
        // Tentukan rentang tanggal untuk bulan ini
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        // Ambil semua payroll yang belum dibayar untuk bulan ini
        const payrolls = yield payroll_1.default.findAll({
            where: {
                status: "UNPAID",
                date: { [sequelize_1.Op.gte]: startDate, [sequelize_1.Op.lt]: endDate },
            },
            include: [{ model: employee_1.default }],
        });
        // Ambil absensi karyawan untuk bulan ini
        const attendanceRecords = yield attendance_1.default.findAll({
            where: {
                date: { [sequelize_1.Op.gte]: startDate, [sequelize_1.Op.lt]: endDate },
                status: "Absent",
            },
        });
        // Buat map untuk efisiensi dalam perhitungan penalti
        const attendanceMap = attendanceRecords.reduce((map, record) => {
            if (!map[record.EmployeeId]) {
                map[record.EmployeeId] = 0;
            }
            map[record.EmployeeId]++;
            return map;
        }, {});
        // Update payroll untuk setiap karyawan berdasarkan absensi
        for (const payroll of payrolls) {
            const absencePenalty = 50000 * (attendanceMap[payroll.EmployeeId] || 0);
            const totalAmount = payroll.amount - absencePenalty;
            yield payroll_1.default.update({ amount: totalAmount }, { where: { id: payroll.id } });
        }
        console.log("Payroll amounts updated successfully!");
    }
    catch (error) {
        console.error("Error updating payroll amounts:", error);
    }
});
exports.updatePayrollAmounts = updatePayrollAmounts;
/*
 pr:
 => ganti zona waktu penyimpanan ke format UTC => gak perlu
 => cek scheduler udah berhasil atau belum
 => urutan cek scheduler nya:
    ==> scheduleAttendanceCreation(createDailyAttendance) -> schedulePayrollCreation(createMonthlyPayroll) -> schedulePayrollUpdate(updatePayrollAmounts)
 => kalau diatas sudah teratasi,lanjut lagi cek ke router yang lain di payroll dan attendance
 => kalau daitas sudah teratasi,lanjut lagi buat swagger untuk dokumentasi nya
*/ 
//# sourceMappingURL=payrollScheduler.js.map