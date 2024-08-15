import express from "express";
import {
  editAttendance,
  generateAttendanceReport,
} from "../controllers/attendanceController";
import { auditMiddleware } from "../middleware/auditMiddleware";
import { authentication } from "../middleware/authMiddleware";
const router = express.Router();

router.use(authentication);

// Route untuk memperbarui sebagian data absensi
router.patch("/:id", auditMiddleware("Attendance"), editAttendance);

// Route untuk menghasilkan laporan absensi
router.get("/report",auditMiddleware("Attendance"), generateAttendanceReport);

export default router;
