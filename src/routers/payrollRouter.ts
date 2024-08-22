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

// Route untuk menghasilkan laporan gaji (opsional)
router.get("/report",authorizeRole("ADMIN","MANAGER", "OWNER","SUPER ADMIN"), generatePayrollReport);

// Route untuk memperbarui data gaji
router.patch("/:id", authorizeRole("ADMIN","MANAGER", "OWNER"),auditMiddleware("Payroll"), editPayroll);


export default router;
