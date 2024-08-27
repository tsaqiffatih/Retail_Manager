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
exports.authorizeRole = exports.authentication = void 0;
const jsonWebToken_1 = require("../helper/jsonWebToken");
const user_1 = __importDefault(require("../models/user"));
const employee_1 = __importDefault(require("../models/employee"));
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const access = req.headers.authorization;
        if (!access)
            throw { name: "invalid token" };
        const [bearer, token] = access.split(" ");
        if (bearer !== "Bearer" || !token)
            throw { name: "invalid token" };
        const verify = (0, jsonWebToken_1.verifyToken)(token);
        if (typeof verify === "string" || !('email' in verify))
            throw { name: "invalid token" };
        const user = yield user_1.default.findOne({
            where: { email: verify.email },
            include: [{
                    model: employee_1.default,
                    as: "employee",
                    attributes: ["StoreId"],
                }],
        });
        if (!user)
            throw { name: "invalid token" };
        req.userData = {
            id: user.id,
            email: user.email,
            role: user.role,
            storeId: user.employee ? user.employee.StoreId : null,
        };
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authentication = authentication;
const authorizeRole = (...requiredRoles) => {
    return (req, res, next) => {
        try {
            if (!req.userData || !requiredRoles.includes(req.userData.role)) {
                throw { name: "forbidden" };
            }
            next();
        }
        catch (error) {
            // console.log(error);
            next(error);
        }
    };
};
exports.authorizeRole = authorizeRole;
// export const authorizeStoreAccess = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const store = await Store.findByPk(req.params.id);
//     if (!store) {
//       return res.status(404).json({ message: "Store not found" });
//     }
//     const userRole = req.userData.role;
//     const userId = req.userData.id;
//     if (
//       userRole === "Super Admin" ||
//       userRole === "Owner" ||
//       userRole === "Manager" ||
//       (userRole === "Admin" && store.ManagerId === userId) ||
//       userId === store.ManagerId
//     ) {
//       next();
//     } else {
//       res
//         .status(403)
//         .json({ message: "You do not have access to this store" });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
//# sourceMappingURL=authMiddleware.js.map