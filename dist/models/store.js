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
const user_1 = __importDefault(require("./user"));
const employee_1 = __importDefault(require("./employee"));
const locationValidation_1 = require("../helper/locationValidation");
const codeGenerator_1 = require("../helper/codeGenerator");
const isValidCategory_1 = require("../helper/isValidCategory");
// Definisi model Store tanpa parameter generik
let Store = class Store extends sequelize_typescript_1.Model {
    static createStoreCode(store) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findByPk(store.OwnerId);
            if (!user) {
                throw { name: 'Not Found', param: 'User' };
            }
            store.code = (0, codeGenerator_1.generateStoreCodeTs)(user === null || user === void 0 ? void 0 : user.userName, store.category, store.location, new Date(), store.OwnerId);
        });
    }
    static findByOwnerId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const stores = yield this.findAll({
                where: { OwnerId: userId },
                attributes: ['OwnerId'],
            });
            return stores.map(store => store.OwnerId);
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
], Store.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Store name is required" },
            notNull: { msg: "Store name cannot be null" },
        },
        unique: {
            name: "Unique_Name_Constraint",
            msg: "Store name has already been taken",
        },
    }),
    __metadata("design:type", String)
], Store.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Store location is required" },
            notNull: { msg: "Store location cannot be null" },
            isValidLocationCheck(value) {
                if (!(0, locationValidation_1.isValidIndonesianLocation)(value)) {
                    throw new Error("Store location must be in indonesia location");
                }
            }
        },
    }),
    __metadata("design:type", String)
], Store.prototype, "location", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Store category is required" },
            notNull: { msg: "Store category cannot be null" },
            isValidCategoryCheck(value) {
                if (!(0, isValidCategory_1.isValidCategory)(value)) {
                    throw new Error("Invalid Store Category");
                }
            }
        },
    }),
    __metadata("design:type", String)
], Store.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Store.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_1.default),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "Owner Id cannot be null" },
            notEmpty: { msg: "Owner Id is required" },
        },
    }),
    __metadata("design:type", Number)
], Store.prototype, "OwnerId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_1.default, { foreignKey: 'OwnerId', onDelete: 'CASCADE' }),
    __metadata("design:type", user_1.default)
], Store.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => employee_1.default, { foreignKey: 'StoreId', onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Store.prototype, "employees", void 0);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    sequelize_typescript_1.BeforeCreate,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Store]),
    __metadata("design:returntype", Promise)
], Store, "createStoreCode", null);
Store = __decorate([
    sequelize_typescript_1.Table
], Store);
exports.default = Store;
//# sourceMappingURL=store.js.map