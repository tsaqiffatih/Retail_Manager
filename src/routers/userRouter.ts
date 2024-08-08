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
router.use(auditMiddleware("User"));

router.post("/login", login);

router.use(authentication);

router.get("/:id", readOne);
router.patch("/", editUser);
router.get(
  "/",
  authorizeRole("OWNER", "SUPER ADMIN", "ADMIN", "MANAGER"),
  readAll
);
router.post(
  "/register",
  authorizeRole("OWNER", "SUPER ADMIN", "ADMIN", "MANAGER"),
  registerUser
);
router.delete("/:id", authorizeRole("OWNER", "SUPER ADMIN", "ADMIN"), deleteUser);

export default router;
