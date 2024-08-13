import express from "express";
import { editEmployee, readOneEmployee } from "../controllers/employeeController";
import { auditMiddleware } from "../middleware/auditMiddleware";
import { authentication } from "../middleware/authMiddleware";
const router = express.Router();

router.use(authentication)

router.get("/:id", auditMiddleware("Employee"),readOneEmployee)
router.patch("/:id",auditMiddleware("Employee"), editEmployee)


export default router