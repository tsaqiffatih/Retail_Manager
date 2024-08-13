import { authorizeRole } from './../middleware/authMiddleware';
import express from "express";
import { createPayroll, deletePayroll, editPayroll, generatePayrollReport, readAllPayrolls, readOnePayroll } from "../controllers/payrollController";
import { auditMiddleware } from "../middleware/auditMiddleware";
const router = express.Router();


router.use(auditMiddleware("Store"));

// Route untuk membuat data gaji
router.post("/", authorizeRole('OWNER','ADMIN','MANAGER'),createPayroll);

// Route untuk mengambil data gaji berdasarkan ID
router.get("/:id", readOnePayroll);

// Route untuk memperbarui data gaji
router.patch("/:id", editPayroll); 

// Route untuk menghapus data gaji
router.delete("/:id", deletePayroll);

// Route untuk mengambil semua data gaji dengan filter (opsional)
// router.get("/payrolls", readAllPayrolls);

// Route untuk menghasilkan laporan gaji (opsional)
// router.get("/payroll/report", generatePayrollReport);

export default router