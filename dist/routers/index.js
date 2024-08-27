"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./userRouter"));
const storeRouter_1 = __importDefault(require("./storeRouter"));
const employeeRouter_1 = __importDefault(require("./employeeRouter"));
const payrollRouter_1 = __importDefault(require("./payrollRouter"));
const attendanceRouter_1 = __importDefault(require("./attendanceRouter"));
const router = express_1.default.Router();
router.use("/users", userRouter_1.default);
router.use("/stores", storeRouter_1.default);
router.use("/employees", employeeRouter_1.default);
router.use("/attendances", attendanceRouter_1.default);
router.use("/payrolls", payrollRouter_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map