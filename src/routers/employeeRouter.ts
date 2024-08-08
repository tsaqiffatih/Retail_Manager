import express from "express";
import { editEmployee, readOneEmployee } from "../controllers/employeeController";
import { auditMiddleware } from "../middleware/auditMiddleware";
import { authentication } from "../middleware/authMiddleware";
const router = express.Router();

router.use(authentication)
router.use(auditMiddleware("Employee"));

router.get("/:id", readOneEmployee)
router.patch("/:id", editEmployee)


export default router