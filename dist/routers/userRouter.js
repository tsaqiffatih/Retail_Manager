"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const auditMiddleware_1 = require("../middleware/auditMiddleware");
const router = express_1.default.Router();
router.post("/login", userController_1.login);
router.use(authMiddleware_1.authentication);
router.get("/:id", (0, auditMiddleware_1.auditMiddleware)("User"), userController_1.readOne);
router.patch("/:id", (0, auditMiddleware_1.auditMiddleware)("User"), userController_1.editUser);
router.get("/", (0, authMiddleware_1.authorizeRole)("OWNER", "SUPER ADMIN", "ADMIN", "MANAGER"), (0, auditMiddleware_1.auditMiddleware)("User"), userController_1.readAll);
router.post("/register", (0, authMiddleware_1.authorizeRole)("OWNER", "SUPER ADMIN", "ADMIN", "MANAGER"), (0, auditMiddleware_1.auditMiddleware)("User"), userController_1.registerUser);
router.delete("/:id", (0, authMiddleware_1.authorizeRole)("OWNER", "SUPER ADMIN", "ADMIN"), (0, auditMiddleware_1.auditMiddleware)("User"), userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRouter.js.map