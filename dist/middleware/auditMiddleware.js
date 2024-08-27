"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditMiddleware = void 0;
const auditlog_1 = __importDefault(require("../models/auditlog"));
const user_1 = __importDefault(require("../models/user"));
const employee_1 = __importDefault(require("../models/employee"));
const store_1 = __importDefault(require("../models/store"));
const payroll_1 = __importDefault(require("../models/payroll"));
const attendance_1 = __importDefault(require("../models/attendance"));
const auditMiddleware = (entityName) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const action = determineAction(req.method, req.params.id);
        const UserId = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.id;
        const timestamp = new Date();
        let previous_data = null;
        let new_data = null;
        if (req.params.id && isNaN(Number(req.params.id))) {
            return res.status(400).json({
                message: "Invalid ID parameter, it must be a number",
            });
        }
        if (action === "DELETE" || action === "UPDATE" || action === "READ ONE") {
            if (req.params.id) {
                previous_data = yield getPreviousData(entityName, req.params.id);
            }
        }
        res.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
            if (action === "CREATE" || action === "UPDATE") {
                new_data = req.body;
            }
            if (UserId) {
                yield auditlog_1.default.createLog({
                    action,
                    entity_name: entityName,
                    entity_id: req.params.id ? parseInt(req.params.id, 10) : undefined,
                    previous_data,
                    new_data,
                    timestamp,
                    UserId,
                });
            }
        }));
        next();
    });
};
exports.auditMiddleware = auditMiddleware;
const determineAction = (method, entityId) => {
    switch (method) {
        case "POST":
            return "CREATE";
        case "GET":
            return entityId ? "READ ONE" : "READ";
        case "DELETE":
            return "DELETE";
        case "PUT":
        case "PATCH":
            return "UPDATE";
        default:
            throw { name: "Invalid Action Type" };
    }
};
const getPreviousData = (entityName, entityId) => __awaiter(void 0, void 0, void 0, function* () {
    let previousData = null;
    switch (entityName) {
        case "User":
            previousData = yield user_1.default.findByPk(parseInt(entityId));
            break;
        case "Employee":
            previousData = yield employee_1.default.findByPk(parseInt(entityId));
            break;
        case "Store":
            previousData = yield store_1.default.findByPk(parseInt(entityId));
            break;
        case "Payroll":
            previousData = yield payroll_1.default.findByPk(parseInt(entityId));
            break;
        case "Attendance":
            previousData = yield attendance_1.default.findByPk(parseInt(entityId));
            break;
        default:
            throw new Error(`Entity ${entityName} not recognized`);
    }
    return previousData ? previousData.toJSON() : null;
});
//# sourceMappingURL=auditMiddleware.js.map