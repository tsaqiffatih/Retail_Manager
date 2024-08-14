import express from "express";
import {
  deleteUser,
  editUser,
  login,
  readAll,
  readOne,
  registeringAdmin,
  registeringEmployee,
  registeringOwner,
  registerUser,
} from "../controllers/userController";
import { authentication, authorizeRole } from "../middleware/authMiddleware";
import { auditMiddleware } from "../middleware/auditMiddleware";

const router = express.Router();

router.post("/login", login);

router.use(authentication);

router.get("/:id", auditMiddleware("User"), readOne);
router.patch("/:id", auditMiddleware("User"), editUser);
router.get(
  "/",
  authorizeRole("OWNER", "SUPER ADMIN", "ADMIN", "MANAGER"),
  auditMiddleware("User"),
  readAll
);
router.post(
  "/register",
  authorizeRole("OWNER", "SUPER ADMIN", "ADMIN", "MANAGER"),
  auditMiddleware("User"),
  registerUser
);
router.delete(
  "/:id",
  authorizeRole("OWNER", "SUPER ADMIN", "ADMIN"),
  auditMiddleware("User"),
  deleteUser
);
 
export default router;
