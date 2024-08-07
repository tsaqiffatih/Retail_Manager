import express from "express";
import { getAttendanceByEmployee } from "../controllers/attendanceController";
const router = express.Router();

router.get("/:id", getAttendanceByEmployee)

export default router