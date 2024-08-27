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
exports.editStore = exports.destroyStore = exports.readOneStore = exports.createStore = exports.readAll = void 0;
const store_1 = __importDefault(require("../models/store"));
const employee_1 = __importDefault(require("../models/employee"));
const payroll_1 = __importDefault(require("../models/payroll"));
const attendance_1 = __importDefault(require("../models/attendance"));
const user_1 = __importDefault(require("../models/user"));
const readAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const ownerId = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.userData) === null || _b === void 0 ? void 0 : _b.role;
        const sortBy = req.query.sortBy || "name";
        const order = (req.query.order || "ASC").toUpperCase();
        const limit = parseInt(req.query.limit || "10", 10);
        const page = parseInt(req.query.page || "1", 10);
        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({ message: "Invalid limit value." });
        }
        if (isNaN(page) || page <= 0) {
            return res.status(400).json({ message: "Invalid page value." });
        }
        const offset = (page - 1) * limit;
        const options = {
            order: [[sortBy, order]],
            limit: limit,
            offset: offset,
            include: [
                {
                    model: employee_1.default,
                    include: [
                        { model: payroll_1.default },
                        { model: attendance_1.default },
                        {
                            model: user_1.default,
                            attributes: { exclude: ["password"] },
                        },
                    ],
                },
            ],
            where: {},
        };
        if (userRole === "OWNER") {
            options.where = { OwnerId: ownerId };
        }
        else if (userRole === "ADMIN" || userRole === "MANAGER") {
            options.where = { id: (_c = req.userData) === null || _c === void 0 ? void 0 : _c.storeId };
        }
        const result = yield store_1.default.findAndCountAll(options);
        res.status(200).json({
            message: "success",
            data: result.rows,
            totalItems: result.count,
            totalPages: Math.ceil(result.count / limit),
            currentPage: page,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.readAll = readAll;
const createStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, location, category } = req.body;
        const ownerId = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.id;
        const store = yield store_1.default.create({
            name,
            location,
            category,
            OwnerId: ownerId,
        });
        res.status(200).json({ message: "success", data: store });
    }
    catch (error) {
        next(error);
    }
});
exports.createStore = createStore;
const readOneStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const storeId = req.params.id;
        const ownerId = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.id;
        const roleUser = (_b = req.userData) === null || _b === void 0 ? void 0 : _b.role;
        const userStoreId = (_c = req.userData) === null || _c === void 0 ? void 0 : _c.storeId;
        const store = yield store_1.default.findByPk(storeId, {
            include: [
                {
                    model: employee_1.default,
                    include: [{ model: attendance_1.default }, { model: payroll_1.default }],
                },
            ],
        });
        if (!store) {
            throw { name: "Not Found", param: "Store" };
        }
        if (roleUser == "OWNER") {
            if (store.OwnerId !== ownerId) {
                throw { name: "Unauthorized_Get_Store" };
            }
        }
        if (roleUser == "ADMIN" || roleUser == "MANAGER") {
            if (userStoreId !== store.id) {
                throw { name: "Unauthorized_Get_Store" };
            }
        }
        res.status(200).json({ message: "success", data: store });
    }
    catch (error) {
        next(error);
    }
});
exports.readOneStore = readOneStore;
// belum di coba
const destroyStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const storeId = req.params.storeId;
        const userId = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.id;
        const store = yield store_1.default.findByPk(storeId, {
            include: [
                {
                    model: employee_1.default,
                },
            ],
        });
        if (!store) {
            throw { name: "Not Found", param: "Store" };
        }
        if (store.OwnerId !== userId) {
            throw { name: "access_denied" };
        }
        const employeeUserIds = store.employees.map((emp) => emp.UserId);
        yield store.destroy();
        for (const userId of employeeUserIds) {
            const user = yield user_1.default.findByPk(userId);
            if (user) {
                yield user.destroy();
            }
        }
        res.status(200).json({
            message: "Store and related Users deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.destroyStore = destroyStore;
const editStore = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        const userId = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.id;
        const { name, location, category } = req.body;
        // name location category 
        const store = yield store_1.default.findByPk(id);
        if (!store)
            throw { name: "Not Found", param: "Store" };
        if (userId !== store.OwnerId) {
            throw { name: "access_denied" };
        }
        if (name)
            store.name = name;
        if (location)
            store.location = location;
        if (category)
            store.category = category;
        if (!name && !location && !category) {
            res.status(400).json({ message: "No fields to update found" });
        }
        yield store.save();
        res.status(200).json({
            message: "Success update store data",
            data: store,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editStore = editStore;
//# sourceMappingURL=storeController.js.map