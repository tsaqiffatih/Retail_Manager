"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const auditMiddleware_1 = require("../middleware/auditMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authentication);
router.get("/:id", (0, auditMiddleware_1.auditMiddleware)("Employee"), employeeController_1.readOneEmployee);
router.patch("/:id", (0, auditMiddleware_1.auditMiddleware)("Employee"), employeeController_1.editEmployee);
exports.default = router;
//# sourceMappingURL=employeeRouter.js.map