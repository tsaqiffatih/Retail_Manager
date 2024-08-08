import express from "express";
import { authentication, authorizeRole } from "../middleware/authMiddleware";
import {
  createStore,
  destroyStore,
  readAll,
  readOneStore,
} from "../controllers/storeController";
import { auditMiddleware } from "../middleware/auditMiddleware";

const router = express.Router();

router.use(authentication)
router.use(auditMiddleware("Store"));

router.get("/", authorizeRole("OWNER", "ADMIN", "MANAGER"), readAll);
router.post("/", authorizeRole("OWNER"), createStore);
router.get("/:id", authorizeRole("OWNER", "ADMIN", "MANAGER"), readOneStore);

// delete store include employee and user who associated wiht employee
router.delete("/:id", authorizeRole("OWNER"), destroyStore);

export default router;
