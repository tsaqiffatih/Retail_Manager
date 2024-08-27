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
const payroll_1 = __importDefault(require("./payroll"));
const attendance_1 = __importDefault(require("./attendance"));
const user_1 = __importDefault(require("./user"));
const store_1 = __importDefault(require("./store"));
let Employee = class Employee extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    }),
    __metadata("design:type", Number)
], Employee.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "First name cannot be null" },
            notEmpty: { msg: "First name is required" },
        },
    }),
    __metadata("design:type", String)
], Employee.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Last name cannot be null" },
            notEmpty: { msg: "Last name is required" },
        },
    }),
    __metadata("design:type", String)
], Employee.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        validate: {
            notNull: { msg: "Date of birth cannot be null" },
            notEmpty: { msg: "Date of birth is required" },
        },
    }),
    __metadata("design:type", Date)
], Employee.prototype, "dateOfBirth", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Contact cannot be null" },
            notEmpty: { msg: "Contact is required" },
        },
    }),
    __metadata("design:type", String)
], Employee.prototype, "contact", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Education cannot be null" },
            notEmpty: { msg: "Education is required" },
        },
    }),
    __metadata("design:type", String)
], Employee.prototype, "education", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: true,
    }),
    __metadata("design:type", String)
], Employee.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Position cannot be null" },
            notEmpty: { msg: "Position is required" },
        },
    }),
    __metadata("design:type", String)
], Employee.prototype, "position", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "Salary cannot be null" },
            notEmpty: { msg: "Salary is required" },
        },
    }),
    __metadata("design:type", Number)
], Employee.prototype, "salary", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "UserId cannot be null" },
            notEmpty: { msg: "UserId is required" },
        },
    }),
    __metadata("design:type", Number)
], Employee.prototype, "UserId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => store_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "StoreId cannot be null" },
            notEmpty: { msg: "StoreId is required" },
        },
    }),
    __metadata("design:type", Number)
], Employee.prototype, "StoreId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.default, { foreignKey: 'UserId', onDelete: 'CASCADE' }),
    __metadata("design:type", user_1.default)
], Employee.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => store_1.default, { foreignKey: 'StoreId', onDelete: 'CASCADE' }),
    __metadata("design:type", store_1.default)
], Employee.prototype, "store", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => payroll_1.default, { foreignKey: 'EmployeeId' }),
    __metadata("design:type", Array)
], Employee.prototype, "payrolls", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => attendance_1.default, { foreignKey: 'EmployeeId' }),
    __metadata("design:type", Array)
], Employee.prototype, "attendances", void 0);
Employee = __decorate([
    sequelize_typescript_1.Table
], Employee);
exports.default = Employee;
//# sourceMappingURL=employee.js.map