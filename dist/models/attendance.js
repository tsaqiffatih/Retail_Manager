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
let Attendance = class Attendance extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], Attendance.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        validate: {
            notNull: { msg: "Date of Attendance cannot be null" },
            notEmpty: { msg: "Date of Attendance is required" },
        },
    }),
    __metadata("design:type", Date)
], Attendance.prototype, "date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.ENUM("Present", "Absent", "Sick", "Leave"),
        allowNull: false,
        validate: {
            notNull: { msg: "Status cannot be null" },
            notEmpty: { msg: "Status is required" },
            isIn: {
                args: [["Present", "Absent", "Sick", "Leave"]],
                msg: "Invalid Attendance Status",
            },
        },
        defaultValue: "Absent",
    }),
    __metadata("design:type", String)
], Attendance.prototype, "status", void 0);
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
], Attendance.prototype, "EmployeeId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => employee_1.default, { foreignKey: "EmployeeId", onDelete: "CASCADE" }),
    __metadata("design:type", employee_1.default)
], Attendance.prototype, "employee", void 0);
Attendance = __decorate([
    sequelize_typescript_1.Table
], Attendance);
exports.default = Attendance;
//# sourceMappingURL=attendance.js.map