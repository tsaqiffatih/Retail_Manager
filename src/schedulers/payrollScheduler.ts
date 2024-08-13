import cron from "node-cron";
import { Op } from "sequelize";
import Employee from "../models/employee";
import Payroll from "../models/payroll";
import Attendance from "../models/attendance";

// Cron job untuk membuat record Payroll setiap awal bulan
export const schedulePayrollCreation = () => {
  //   cron.schedule("*/2 * * * *", async () => { // Setiap 2 menit
  cron.schedule("0 0 1 * *", async () => {
    await createMonthlyPayroll()
  });
};

// Cron job untuk mengupdate amount Payroll berdasarkan absen setiap tanggal 28
export const schedulePayrollUpdate = () => {
  //   cron.schedule("* * * * *", async () => { // Setiap 1 menit
  cron.schedule("0 0 28 * *", async () => {
    await updatePayrollAmounts()
  });
};

export const createMonthlyPayroll = async () => {
  try {
    console.log("Running Payroll Creation");

    const employees = await Employee.findAll();
    const payrolldate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const payrolls = employees.map((employee) => ({
      EmployeeId: employee.id,
      amount: employee.salary,
      status: "UNPAID",
      date: payrolldate,
    }));

    await Payroll.bulkCreate(payrolls);
    console.log("Payroll records created successfully!");
  } catch (error) {
    console.error("Error creating payroll records:", error);
  }
};

export const updatePayrollAmounts = async () => {
  try {
    console.log("Running Payroll Update Scheduler");

    // Tentukan rentang tanggal untuk bulan ini
    const startDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    );

    // Ambil semua payroll yang belum dibayar untuk bulan ini
    const payrolls = await Payroll.findAll({
      where: {
        status: "UNPAID",
        date: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      include: [{ model: Employee }],
    });

    // Ambil absensi karyawan untuk bulan ini
    const attendanceRecords = await Attendance.findAll({
      where: {
        date: { [Op.gte]: startDate, [Op.lt]: endDate },
        status: "Absent",
      },
    });

    // Buat map untuk efisiensi dalam perhitungan penalti
    const attendanceMap: { [key: number]: number } = attendanceRecords.reduce(
      (map, record) => {
        if (!map[record.EmployeeId]) {
          map[record.EmployeeId] = 0;
        }
        map[record.EmployeeId]++;
        return map;
      },
      {} as { [key: number]: number }
    );

    // Update payroll untuk setiap karyawan berdasarkan absensi
    for (const payroll of payrolls) {
      const absencePenalty = 50000 * (attendanceMap[payroll.EmployeeId] || 0);
      const totalAmount = payroll.amount - absencePenalty;

      await Payroll.update(
        { amount: totalAmount },
        { where: { id: payroll.id } }
      );
    }

    console.log("Payroll amounts updated successfully!");
  } catch (error) {
    console.error("Error updating payroll amounts:", error);
  }
};

/*
 pr:
 => ganti zona waktu penyimpanan ke format UTC
 => cek scheduler udah berhasil atau belum
 => urutan cek scheduler nya:
    ==> scheduleAttendanceCreation(createDailyAttendance) -> schedulePayrollCreation(createMonthlyPayroll) -> schedulePayrollUpdate(updatePayrollAmounts)
 => kalau diatas sudah teratasi,lanjut lagi cek ke router yang lain di payroll dan attendance
 => kalau daitas sudah teratasi,lanjut lagi buat swagger untuk dokumentasi nya
*/