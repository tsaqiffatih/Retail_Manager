import express from "express";
import { createPayroll, deletePayroll, editPayroll, generatePayrollReport, readAllPayrolls, readOnePayroll } from "../controllers/payrollController";
import { auditMiddleware } from "../middleware/auditMiddleware";
const router = express.Router();


router.use(auditMiddleware("Store"));

// Route untuk membuat data gaji
router.post("/payroll", createPayroll);

// Route untuk mengambil data gaji berdasarkan ID
router.get("/payroll/:id", readOnePayroll);

// Route untuk memperbarui data gaji
router.patch("/payroll/:id", editPayroll); // Menggunakan PATCH untuk update parsial

// Route untuk menghapus data gaji
router.delete("/payroll/:id", deletePayroll);

// Route untuk mengambil semua data gaji dengan filter (opsional)
// router.get("/payrolls", readAllPayrolls);

// Route untuk menghasilkan laporan gaji (opsional)
// router.get("/payroll/report", generatePayrollReport);

export default router