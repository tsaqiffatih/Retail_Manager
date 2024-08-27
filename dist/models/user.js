"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const sequelize_typescript_1 = require("sequelize-typescript");
const employee_1 = __importDefault(require("./employee"));
const store_1 = __importDefault(require("./store"));
const auditlog_1 = __importDefault(require("./auditlog"));
const bcrypt_1 = require("../helper/bcrypt");
const isStrongPassword_1 = require("../helper/isStrongPassword");
let User = class User extends sequelize_typescript_1.Model {
    static validateAndHashPassword(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, isStrongPassword_1.isStrongPassword)(user.password);
            user.password = yield (0, bcrypt_1.hashAsyncPassword)(user.password);
        });
    }
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: {
            name: "Unique_Name_Constraint",
            msg: "userName has been already exists",
        },
    }),
    __metadata("design:type", String)
], User.prototype, "userName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        unique: {
            name: "Unique_Email_Constraint",
            msg: "email has been already exists",
        },
        validate: {
            isEmail: { msg: "Invalid Email Type" },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [7, 255],
                msg: "password must be at least 7 characters long",
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("ADMIN", "OWNER", "EMPLOYEE", "MANAGER", "SUPER ADMIN"),
        allowNull: false,
        validate: {
            isIn: {
                args: [
                    ["ADMIN", "OWNER", "EMPLOYEE", "MANAGER", "SUPER ADMIN"],
                ],
                msg: "user role was wrong",
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => store_1.default, { foreignKey: "OwnerId" }),
    __metadata("design:type", Array)
], User.prototype, "stores", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => employee_1.default, { foreignKey: "UserId" }),
    __metadata("design:type", employee_1.default)
], User.prototype, "employee", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => auditlog_1.default, { foreignKey: "UserId" }),
    __metadata("design:type", Array)
], User.prototype, "auditLogs", void 0);
__decorate([
    sequelize_typescript_1.BeforeCreate,
    sequelize_typescript_1.BeforeUpdate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "validateAndHashPassword", null);
User = __decorate([
    sequelize_typescript_1.Table
], User);
exports.default = User;
//# sourceMappingURL=user.js.map