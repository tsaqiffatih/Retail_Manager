"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const attendanceController_1 = require("../controllers/attendanceController");
const auditMiddleware_1 = require("../middleware/auditMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.authentication);
// Route untuk memperbarui status data absensi
router.patch("/:id", (0, auditMiddleware_1.auditMiddleware)("Attendance"), attendanceController_1.editAttendance);
// Route untuk menghasilkan laporan absensi
router.get("/report", (0, auditMiddleware_1.auditMiddleware)("Attendance"), attendanceController_1.generateAttendanceReport);
exports.default = router;
//# sourceMappingURL=attendanceRouter.js.map