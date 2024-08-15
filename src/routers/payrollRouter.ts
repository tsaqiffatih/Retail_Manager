import { authentication, authorizeRole } from "./../middleware/authMiddleware";
import express from "express";
import {
  editPayroll,
  generatePayrollReport,
} from "../controllers/payrollController";
import { auditMiddleware } from "../middleware/auditMiddleware";
const router = express.Router();

// router.get("/testing" ,testingScheduler)
router.use(authentication);

// Route untuk memperbarui data gaji
router.patch("/:id", auditMiddleware("Payroll"), editPayroll);

// Route untuk menghasilkan laporan gaji (opsional)
router.get("/report", generatePayrollReport);

export default router;
