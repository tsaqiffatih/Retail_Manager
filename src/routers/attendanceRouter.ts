import express from "express";
import {  } from "../controllers/attendanceController";
import { auditMiddleware } from "../middleware/auditMiddleware";
const router = express.Router();


router.use(auditMiddleware("Attendance"));

router.get("/:id", )

export default router