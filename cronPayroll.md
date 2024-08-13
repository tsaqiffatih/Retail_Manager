Pembuatan Payroll secara otomatis setiap awal bulan:
import cron from 'node-cron';
import { Payroll, Employee } from './models';

// Menjadwalkan tugas otomatis setiap awal bulan
cron.schedule('0 0 1 * *', async () => {
    try {
        const employees = await Employee.findAll();

        for (const employee of employees) {
            await Payroll.create({
                EmployeeId: employee.id,
                date: new Date(),  // Awal bulan
                amount: employee.salary,  // Mengambil data dari kolom Salary
                status: 'UNPAID'
            });
        }

        console.log('Payroll records created successfully.');
    } catch (error) {
        console.error('Error creating payroll records:', error);
    }
});


update amount di payroll setiap taggal 28. di update berdasarkan kehadiran:
// Menjadwalkan tugas untuk perhitungan gaji berdasarkan kehadiran
cron.schedule('0 0 28 * *', async () => { // Asumsi tanggal 28 sebagai 3 hari sebelum awal bulan
    try {
        const payrolls = await Payroll.findAll({ where: { status: 'UNPAID' } });

        for (const payroll of payrolls) {
            const attendance = await Attendance.findAll({
                where: { EmployeeId: payroll.EmployeeId, date: { /* Batas waktu kehadiran */ } }
            });

            let totalAmount = payroll.amount;

            // Hitung total amount berdasarkan kehadiran (contoh sederhana)
            attendance.forEach(record => {
                if (record.overtimeHours > 0) {
                    totalAmount += record.overtimeHours * record.overtimeRate;
                }
                // Tambahkan logika perhitungan lain jika diperlukan
            });

            payroll.amount = totalAmount;
            await payroll.save();
        }

        console.log('Payroll amounts updated based on attendance.');
    } catch (error) {
        console.error('Error updating payroll amounts:', error);
    }
});
