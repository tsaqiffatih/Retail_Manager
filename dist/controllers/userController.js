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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registeringEmployee = exports.registeringAdmin = exports.registeringOwner = exports.readAll = exports.readOne = exports.deleteUser = exports.editUser = exports.registerUser = exports.login = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = require("../helper/bcrypt");
const jsonWebToken_1 = require("../helper/jsonWebToken");
const employee_1 = __importDefault(require("../models/employee"));
const store_1 = __importDefault(require("../models/store"));
const sequelize_1 = require("sequelize");
const attendance_1 = __importDefault(require("../models/attendance"));
const payroll_1 = __importDefault(require("../models/payroll"));
// method for user login
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email) {
            throw { name: "Required", param: "Email" };
        }
        if (!password) {
            throw { name: "Required", param: "Password" };
        }
        const instance = yield user_1.default.findOne({ where: { email } });
        if (!instance) {
            throw { name: "login failed" };
        }
        const isValidPassword = (0, bcrypt_1.comparePassword)(password, instance.password);
        if (!isValidPassword) {
            throw { name: "login failed" };
        }
        const access_token = (0, jsonWebToken_1.createToken)({
            email: instance.email,
            username: instance.userName,
        });
        res.status(200).json({ access_token: access_token });
    }
    catch (error) {
        // console.log(error);
        next(error);
    }
});
exports.login = login;
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const role = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.role;
        if (role == "SUPER ADMIN") {
            yield (0, exports.registeringOwner)(req, res, next);
        }
        else if (role == "OWNER") {
            yield (0, exports.registeringAdmin)(req, res, next);
        }
        else if (role == "ADMIN" || role == "MANAGER") {
            yield (0, exports.registeringEmployee)(req, res, next);
        }
        else {
            throw { name: "forbidden" };
        }
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
const editUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const { id: userId } = req.params;
        const { userName, email, password } = req.body;
        const userRole = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.role;
        const requestUserId = (_b = req.userData) === null || _b === void 0 ? void 0 : _b.id;
        const requestStoreId = (_c = req.userData) === null || _c === void 0 ? void 0 : _c.storeId;
        const user = yield user_1.default.findByPk(userId, {
            include: [{ model: employee_1.default, include: [{ model: store_1.default }] }],
        });
        if (!user)
            throw { name: "Not Found", param: "User" };
        const storeOwnerId = (_e = (_d = user === null || user === void 0 ? void 0 : user.employee) === null || _d === void 0 ? void 0 : _d.store) === null || _e === void 0 ? void 0 : _e.OwnerId;
        const userStoreId = (_g = (_f = user === null || user === void 0 ? void 0 : user.employee) === null || _f === void 0 ? void 0 : _f.store) === null || _g === void 0 ? void 0 : _g.id;
        // Access Control
        if ((userRole === "OWNER" && requestUserId !== storeOwnerId && requestUserId !== user.id) ||
            ((userRole === "ADMIN" || userRole === "MANAGER") && requestStoreId !== userStoreId) ||
            (userRole === "EMPLOYEE" && requestUserId !== user.id)) {
            throw { name: "forbidden" };
        }
        // Optional fields update
        if (email)
            user.email = email;
        if (password)
            user.password = password;
        if (userName)
            user.userName = userName;
        if (!email && !password && !userName) {
            res.status(400).json({ message: "No fields to update found" });
        }
        yield user.save();
        const _h = user.get({ plain: true }), { password: _ } = _h, userResponse = __rest(_h, ["password"]);
        res.status(200).json({
            message: "Success update user data",
            data: userResponse,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editUser = editUser;
// ====> HARD DELETE <=====
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const userId = parseInt(req.params.id);
        // Mengambil data user beserta Employee terkait
        const user = yield user_1.default.findByPk(userId, {
            include: [
                {
                    model: employee_1.default,
                    required: true,
                    include: [
                        {
                            model: store_1.default,
                            required: true,
                        },
                    ],
                },
            ],
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userRole = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.role;
        const ownerId = (_b = req.userData) === null || _b === void 0 ? void 0 : _b.id;
        // Super Admin bisa langsung menghapus user role owner
        if (userRole === "SUPER ADMIN" && user.role === "OWNER") {
            yield user.destroy();
            return res.status(200).json({ message: "User deleted successfully" });
        }
        // Owner dapat menghapus user di store yang dimiliki
        if (userRole === "OWNER" &&
            user.role !== "OWNER" &&
            user.role !== "SUPER ADMIN") {
            // StoreId dari user yang ingin di hapus
            const userStoreId = user.employee.store.OwnerId; // Ambil OwnerId dari Store
            // cek,apakah user yang akan di hapus merupakan karyawan dari Owner atau bukan
            if (((_c = req.userData) === null || _c === void 0 ? void 0 : _c.id) !== userStoreId) {
                return res.status(403).json({ message: "Unauthorized Store" });
            }
            yield user.destroy();
            return res.status(200).json({ message: "User deleted successfully" });
        }
        // Admin dapat menghapus user role employee di store yang dikelola
        if (userRole === "ADMIN" ||
            (userRole === "MANAGER" && user.role !== "OWNER")) {
            if (((_d = req.userData) === null || _d === void 0 ? void 0 : _d.storeId) !== user.employee.StoreId) {
                return res.status(403).json({ message: "Unauthorized Store" });
            }
            yield user.destroy();
            return res.status(200).json({ message: "User deleted successfully" });
        }
        return res.status(403).json({ message: "Unauthorized Delete" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
/*
// ======> SOFT DELETE <======
// ======> TAMBAH KOLOM ISDELETED DI TABLE JIKA INGIN DIGUNAKAN <=====
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;

    // Verifikasi hak akses
    if (parseInt(userId) !== req.userData?.id) {
      throw { name: 'access_denied' };
    }

    // Temukan pengguna berdasarkan ID
    const user = await User.findByPk(userId);

    // Validasi jika pengguna tidak ditemukan
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Tandai pengguna sebagai dihapus (penghapusan logis)
    user.isDeleted = true;
    await user.save();

    // Kirim respons sukses
    res.status(200).json({ message: 'User successfully marked as deleted' });

  } catch (error) {
    next(error); // Serahkan ke middleware error handler
  }
};
*/
const readOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    try {
        const id = req.params.id;
        const user = yield user_1.default.findByPk(id, {
            attributes: { exclude: ["password", "role"] },
            include: {
                model: employee_1.default,
                include: [
                    {
                        model: store_1.default,
                    },
                    attendance_1.default,
                    payroll_1.default,
                ],
            },
        });
        if (!user) {
            throw { name: "Not Found", param: "User" };
        }
        if (user.userName == "superAdmin") {
            throw { name: "access_denied" };
        }
        if (((_a = req.userData) === null || _a === void 0 ? void 0 : _a.role) == "OWNER") {
            if (((_b = req.userData) === null || _b === void 0 ? void 0 : _b.id) !== ((_d = (_c = user === null || user === void 0 ? void 0 : user.employee) === null || _c === void 0 ? void 0 : _c.store) === null || _d === void 0 ? void 0 : _d.OwnerId)) {
                throw { name: "access_denied" };
            }
        }
        else if (((_e = req.userData) === null || _e === void 0 ? void 0 : _e.role) == "ADMIN" ||
            ((_f = req.userData) === null || _f === void 0 ? void 0 : _f.role) == "MANAGER") {
            if (((_g = user === null || user === void 0 ? void 0 : user.employee) === null || _g === void 0 ? void 0 : _g.StoreId) !== ((_h = req.userData) === null || _h === void 0 ? void 0 : _h.storeId)) {
                throw { name: "access_denied" };
            }
        }
        else if (((_j = req.userData) === null || _j === void 0 ? void 0 : _j.role) == "EMPLOYEE") {
            if (((_k = req.userData) === null || _k === void 0 ? void 0 : _k.id) !== user.id) {
                throw { name: "access_denied" };
            }
        }
        else {
            throw { name: "access_denied" };
        }
        res.status(200).json({ message: "success", data: user });
    }
    catch (error) {
        next(error);
    }
});
exports.readOne = readOne;
const readAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { search, page, limit, sortBy, order } = req.query;
        // Default values and parsing
        const sortField = sortBy || "userName";
        const sortOrder = order || "ASC";
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;
        // Get the current user's role and storeId if applicable
        const userRole = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.role;
        const userStoreId = (_b = req.userData) === null || _b === void 0 ? void 0 : _b.storeId;
        const userId = (_c = req.userData) === null || _c === void 0 ? void 0 : _c.id;
        // Build search condition
        let whereCondition = {};
        if (search) {
            whereCondition = Object.assign(Object.assign({}, whereCondition), { [sequelize_1.Op.or]: [
                    { userName: { [sequelize_1.Op.iLike]: `%${search}%` } },
                    { email: { [sequelize_1.Op.iLike]: `%${search}%` } },
                ] });
        }
        // Additional filtering based on role
        let whereRoleCondition = {};
        let isRequired = true;
        if (userRole === "OWNER") {
            whereRoleCondition = { OwnerId: userId };
        }
        else if (userRole === "ADMIN" || userRole === "MANAGER") {
            whereRoleCondition = { id: userStoreId };
        }
        else if (userRole === "SUPER ADMIN") {
            whereRoleCondition = {};
            isRequired = false;
        }
        else {
            throw { name: "access_denied" };
        }
        // Find and count users
        const { rows: users, count } = yield user_1.default.findAndCountAll({
            order: [[sortField, sortOrder]],
            limit: limitNumber,
            offset,
            attributes: { exclude: ["password", "role"] },
            where: whereCondition,
            include: [
                {
                    model: employee_1.default,
                    required: isRequired,
                    include: [
                        {
                            model: store_1.default,
                            where: whereRoleCondition,
                            required: isRequired,
                        },
                        {
                            model: attendance_1.default,
                        },
                        {
                            model: payroll_1.default,
                        },
                    ],
                },
            ],
        });
        // Respond with users and count
        res.status(200).json({
            message: "success",
            data: users,
            totalItems: count,
            totalPages: Math.ceil(count / limitNumber),
            currentPage: pageNumber,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.readAll = readAll;
// method for registering user role owner (AUTHORIZE FOR SUPER ADMIN)
const registeringOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const user = yield user_1.default.create({
            userName,
            email,
            password,
            role: "OWNER",
        });
        res
            .status(200)
            .json({ message: `New User with email: ${email}, have been registered` });
    }
    catch (error) {
        next(error);
    }
});
exports.registeringOwner = registeringOwner;
// method for registering user role admin (AUTHORIZE FOR OWNER)
const registeringAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { firstName, lastName, dateOfBirth, contact, education, address, position, salary, password, email, storeId, role, } = req.body;
        const userName = firstName + lastName;
        if (role == "SUPER ADMIN" || role == "OWNER") {
            throw { name: "invalid_role" };
        }
        const user = yield user_1.default.create({
            userName,
            email,
            password,
            role,
        });
        const userId = user.id;
        if (!storeId) {
            throw { name: "Required", param: "storeId" };
        }
        const store = yield store_1.default.findOne({ where: { id: storeId } });
        if (!store) {
            throw { name: "Not Found", param: "Store" };
        }
        const ownerId = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.id;
        if (store.OwnerId !== ownerId) {
            throw { name: "invalid_StoreId" };
        }
        const employee = yield employee_1.default.create({
            firstName,
            lastName,
            dateOfBirth,
            contact,
            education,
            address,
            position,
            salary,
            UserId: userId,
            StoreId: storeId,
        });
        res
            .status(200)
            .json({ message: `New User with email: ${email}, have been registered` });
    }
    catch (error) {
        next(error);
    }
});
exports.registeringAdmin = registeringAdmin;
// method for registering user role Employee (AUTHORIZE FOR ADMIN)
const registeringEmployee = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { firstName, lastName, dateOfBirth, contact, education, address, position, salary, password, email, } = req.body;
        const username = firstName + lastName;
        const user = yield user_1.default.create({
            userName: username,
            email,
            password,
            role: "EMPLOYEE",
        });
        const userId = user.id;
        const storeId = (_a = req.userData) === null || _a === void 0 ? void 0 : _a.storeId;
        const employee = yield employee_1.default.create({
            firstName,
            lastName,
            dateOfBirth,
            contact,
            education,
            address,
            position,
            salary,
            UserId: userId,
            StoreId: storeId,
        });
        res
            .status(200)
            .json({ message: `New User with email: ${email}, have been registered` });
    }
    catch (error) {
        // console.log(error);
        next(error);
    }
});
exports.registeringEmployee = registeringEmployee;
//# sourceMappingURL=userController.js.map