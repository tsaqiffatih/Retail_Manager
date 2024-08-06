import express from "express";
import {
  deleteUser,
  editUser,
  login,
  registeringAdmin,
  registeringEmployee,
  registeringOwner,
} from "../controllers/userController";
import { authentication, authorizeRole } from "../middleware/authMiddleware";

const router = express.Router();

// for user login
router.post("/login", login);

router.use(authentication)
// If the user is a super admin, they will register users with the role of owner.
// If the user is an owner, they will register users with the roles of admin or manager in their store, and include the employee data of the user.
// If the user is an admin or manager, they will register users with the role of employee in the store where they work.
router.post( "/register", authorizeRole("OWNER", "SUPER ADMIN", "ADMIN", "MANAGER"),registeringOwner );

router.patch( "/", editUser);
router.delete( "/",authorizeRole("OWNER", "SUPER ADMIN", "ADMIN"),deleteUser);

export default router;
