import express from "express";
import {
  createAttendance,
  deleteAttendance,
  editAttendance,
  generateAttendanceReport,
} from "../controllers/attendanceController";
import { auditMiddleware } from "../middleware/auditMiddleware";
import { authentication } from "../middleware/authMiddleware";
const router = express.Router();

router.use(authentication);

// Route untuk memperbarui sebagian data absensi
router.patch("/:id", auditMiddleware("Attendance"), editAttendance);

// Route untuk membuat data absensi
// router.post("/",auditMiddleware("Attendance"), createAttendance);

// Route untuk menghasilkan laporan absensi
// router.get("/report",auditMiddleware("Attendance"), generateAttendanceReport);

// Route untuk menghapus data absensi
// router.delete("/:id", deleteAttendance);

export default router;
