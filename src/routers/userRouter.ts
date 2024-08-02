import express from "express";
import { editUser, login, registeringAdmin, registeringEmployee, registeringOwner } from "../controllers/userController";
import { authentication, authorizeRole } from "../middleware/authMiddleware";

const router = express.Router()

router.post("/login", login)
router.post("/register/owner",authentication, authorizeRole("SUPER ADMIN"),registeringOwner)
router.post("/register/admin",authentication, authorizeRole("OWNER"),registeringAdmin)
router.post("/register/employee",authentication, authorizeRole("OWNER", "ADMIN"),registeringEmployee)
router.patch("/",authentication,editUser)
router.delete("/", authentication, authorizeRole("OWNER", "SUPER ADMIN", "ADMIN"))

export default router