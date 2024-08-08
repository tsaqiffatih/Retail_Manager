import express from "express";
import {  } from "../controllers/payrollController";
import { auditMiddleware } from "../middleware/auditMiddleware";
const router = express.Router();


router.use(auditMiddleware("Store"));

router.get("/:id", )

export default router