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

router.use(authentication);

router.get("/", authorizeRole("OWNER","ADMIN","MANAGER"), auditMiddleware("Store"), readAll);
router.post("/", authorizeRole("OWNER"), auditMiddleware("Store"), createStore);
router.get(
  "/:id",
  authorizeRole("OWNER", "ADMIN", "MANAGER"),
  auditMiddleware("Store"),
  readOneStore
);

// delete store include employee and user,payroll,attendance who associated wiht employee
router.delete("/:storeId", authorizeRole("OWNER"),auditMiddleware("Store"), destroyStore); 

export default router;
