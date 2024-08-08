import express from "express";
import {  } from "../controllers/employeeController";
import { auditMiddleware } from "../middleware/auditMiddleware";
const router = express.Router();

router.use(auditMiddleware("Employee"));

router.get("/:id", )

export default router