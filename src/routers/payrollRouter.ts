import { authentication, authorizeRole } from "./../middleware/authMiddleware";
import express from "express";
import {
  editPayroll,
  generatePayrollReport,
  readAllPayrolls,
  readOnePayroll,
} from "../controllers/payrollController";
import { auditMiddleware } from "../middleware/auditMiddleware";
const router = express.Router();

// router.get("/testing" ,testingScheduler)
router.use(authentication);

// Route untuk mengambil data gaji berdasarkan ID
// router.get("/:id", auditMiddleware("Payroll"), readOnePayroll);

// Route untuk memperbarui data gaji
router.patch("/:id", auditMiddleware("Payroll"), editPayroll);

// Route untuk mengambil semua data gaji dengan filter (opsional)
// router.get("/payrolls", readAllPayrolls);

// Route untuk menghasilkan laporan gaji (opsional)
// router.get("/payroll/report", generatePayrollReport);

export default router;
