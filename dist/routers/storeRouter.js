"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const storeController_1 = require("../controllers/storeController");
const auditMiddleware_1 = require("../middleware/auditMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authentication);
router.get("/", (0, authMiddleware_1.authorizeRole)("OWNER", "ADMIN", "MANAGER"), (0, auditMiddleware_1.auditMiddleware)("Store"), storeController_1.readAll);
router.post("/", (0, authMiddleware_1.authorizeRole)("OWNER"), (0, auditMiddleware_1.auditMiddleware)("Store"), storeController_1.createStore);
router.get("/:id", (0, authMiddleware_1.authorizeRole)("OWNER", "ADMIN", "MANAGER"), (0, auditMiddleware_1.auditMiddleware)("Store"), storeController_1.readOneStore);
// delete store include employee and user,payroll,attendance who associated wiht employee
router.delete("/:storeId", (0, authMiddleware_1.authorizeRole)("OWNER"), (0, auditMiddleware_1.auditMiddleware)("Store"), storeController_1.destroyStore);
exports.default = router;
//# sourceMappingURL=storeRouter.js.map