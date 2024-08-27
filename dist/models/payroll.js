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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const employee_1 = __importDefault(require("./employee"));
let Payroll = class Payroll extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], Payroll.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        validate: {
            notNull: { msg: "Date of Payroll cannot be null" },
            notEmpty: { msg: "Date of Payroll is required" },
        },
    }),
    __metadata("design:type", Date)
], Payroll.prototype, "date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "Amount cannot be null" },
            notEmpty: { msg: "Amount is required" },
        },
    }),
    __metadata("design:type", Number)
], Payroll.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("PAID", "UNPAID"),
        allowNull: false,
        validate: {
            notNull: { msg: "Status cannot be null" },
            notEmpty: { msg: "Status is required" },
            isIn: {
                args: [["PAID", "UNPAID"]],
                msg: "Invalid Payroll Status",
            },
        },
    }),
    __metadata("design:type", String)
], Payroll.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => employee_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "Employee Id cannot be null" },
            notEmpty: { msg: "Employee Id is required" },
        },
    }),
    __metadata("design:type", Number)
], Payroll.prototype, "EmployeeId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => employee_1.default, { foreignKey: 'EmployeeId', onDelete: 'CASCADE' }),
    __metadata("design:type", employee_1.default)
], Payroll.prototype, "employee", void 0);
Payroll = __decorate([
    sequelize_typescript_1.Table
], Payroll);
exports.default = Payroll;
//# sourceMappingURL=payroll.js.map