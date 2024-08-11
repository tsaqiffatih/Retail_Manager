import express from "express";
import { createAttendance, deleteAttendance, editAttendance, generateAttendanceReport } from "../controllers/attendanceController";
import { auditMiddleware } from "../middleware/auditMiddleware";
import { authentication } from "../middleware/authMiddleware";
const router = express.Router();

router.use(authentication)
router.use(auditMiddleware("Attendance"));

// router.get("/:id", )
// Route untuk membuat data absensi
router.post("/", createAttendance);

// Route untuk menghapus data absensi
router.delete("/:id", deleteAttendance);

// Route untuk memperbarui sebagian data absensi
router.patch("/:id", editAttendance);

// Route untuk menghasilkan laporan absensi
router.get("/report", generateAttendanceReport);

export default router