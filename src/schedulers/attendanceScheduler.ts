import cron from "node-cron";
import { Op } from "sequelize";
import Employee from "../models/employee";
import Attendance from "../models/attendance";

// Cron job untuk membuat record Attendance setiap hari kerja pada pukul 1 dini hari
export const scheduleAttendanceCreation = () => {
  cron.schedule("0 1 * * 1-5", async () => {
    // Setiap hari kerja (Senin sampai Jumat) pukul 1 dini hari
    await createDailyAttendance();
  });
};

export const createDailyAttendance = async () => {
  try {
    console.log("Running Attendance Creation Scheduler");

    const employees = await Employee.findAll();
    const currentDate = new Date();

    // Buat record attendance untuk setiap karyawan dengan status Absent
    const attendanceRecords = employees.map((employee) => ({
      EmployeeId: employee.id,
      date: currentDate, // Tanggal hari ini
    }));

    // Bulk create attendance records
    await Attendance.bulkCreate(attendanceRecords);
    console.log("Attendance records created successfully!");
  } catch (error) {
    console.error("Error creating attendance records:", error);
  }
};
