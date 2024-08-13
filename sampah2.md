perbedaan antara:
import cron from 'node-cron';
import Payroll from '../models/payroll';
import Employee from '../models/employee';
import Attendance from '../models/attendance';
import { Op } from 'sequelize';

// Fungsi untuk membuat payroll otomatis setiap awal bulan
export const schedulePayrollCreation = () => {
  cron.schedule('0 0 1 * *', async () => {
    console.log('Running Payroll Creation Scheduler');
    const employees = await Employee.findAll();
    const payrolls = employees.map(employee => ({
      employeeId: employee.id,
      amount: employee.salary,
      status: 'UNPAID',
      date: new Date()
    }));
    await Payroll.bulkCreate(payrolls);
    console.log('Payroll records created for each employee at the beginning of the month');
  });
};

// Fungsi untuk mengupdate amount berdasarkan kehadiran karyawan setiap tanggal 28
export const schedulePayrollUpdate = () => {
  cron.schedule('0 0 28 * *', async () => {
    console.log('Running Payroll Update Scheduler');
    const payrolls = await Payroll.findAll({
      where: { status: 'UNPAID' },
      include: [{ model: Employee }]
    });

    for (const payroll of payrolls) {
      const attendances = await Attendance.findAll({
        where: {
          employeeId: payroll.employeeId,
          status: 'Absent',
          date: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        }
      });
      const absencePenalty = 50000 * attendances.length;
      payroll.amount -= absencePenalty;
      await payroll.save();
    }
    console.log('Payroll amounts updated based on attendance for each employee on the 28th of the month');
  });
};


dan :
import cron from "node-cron";
import { Op } from "sequelize";
import Employee from "../models/employee";
import Payroll from "../models/payroll";
import Attendance from "../models/attendance";

// Cron job untuk membuat record Payroll setiap awal bulan
export const schedulePayrollCreation = () => {
  cron.schedule("0 0 1 * *", async () => {
    try {
      const employees = await Employee.findAll();
      const today = new Date();
      const payrollDate = new Date(today.getFullYear(), today.getMonth(), 1);

      for (const employee of employees) {
        await Payroll.create({
          employeeId: employee.id,
          amount: employee.salary, // Ambil salary dari Employee
          status: "UNPAID",
          date: payrollDate,
        });
      }

      console.log("Payroll records created successfully!");
    } catch (error) {
      console.error("Error creating payroll records:", error);
    }
  });
};

// Cron job untuk mengupdate amount Payroll berdasarkan absen setiap tanggal 28
export const schedulePayrollUpdate = () => {
  cron.schedule("0 0 28 * *", async () => {
    try {
      const employees = await Employee.findAll();
      const startDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const endDate = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        28
      );

      for (const employee of employees) {
        const attendanceRecords = await Attendance.findAll({
          where: {
            employeeId: employee.id,
            status: "Absent",
            date: {
              [Op.gte]: startDate,
              [Op.lt]: endDate,
            },
          },
        });

        const absentPenalty = 50000 * attendanceRecords.length;
        const totalAmount = employee.salary - absentPenalty;

        await Payroll.update(
          { amount: totalAmount },
          {
            where: {
              employeeId: employee.id,
              status: "UNPAID",
              date: {
                [Op.gte]: startDate,
                [Op.lt]: new Date(
                  startDate.getFullYear(),
                  startDate.getMonth() + 1,
                  1
                ),
              },
            },
          }
        );
      }

      console.log("Payroll amounts updated successfully!");
    } catch (error) {
      console.error("Error updating payroll amounts:", error);
    }
  });
};

apa ya?