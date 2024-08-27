"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware_1 = require("./../middleware/authMiddleware");
const express_1 = __importDefault(require("express"));
const payrollController_1 = require("../controllers/payrollController");
const auditMiddleware_1 = require("../middleware/auditMiddleware");
const router = express_1.default.Router();
// router.get("/testing" ,testingScheduler)
router.use(authMiddleware_1.authentication);
// Route untuk menghasilkan laporan gaji (opsional)
router.get("/report", (0, authMiddleware_1.authorizeRole)("ADMIN", "MANAGER", "OWNER", "SUPER ADMIN"), payrollController_1.generatePayrollReport);
// Route untuk memperbarui data gaji
router.patch("/:id", (0, authMiddleware_1.authorizeRole)("ADMIN", "MANAGER", "OWNER"), (0, auditMiddleware_1.auditMiddleware)("Payroll"), payrollController_1.editPayroll);
exports.default = router;
//# sourceMappingURL=payrollRouter.js.map