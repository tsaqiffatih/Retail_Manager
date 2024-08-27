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
exports.sequelizeTest = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("./config/connection"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = require("./helper/bcrypt");
const user_1 = __importDefault(require("./models/user"));
const store_1 = __importDefault(require("./models/store"));
const codeGenerator_1 = require("./helper/codeGenerator");
const employee_1 = __importDefault(require("./models/employee"));
const attendance_1 = __importDefault(require("./models/attendance"));
const payroll_1 = __importDefault(require("./models/payroll"));
const auditlog_1 = __importDefault(require("./models/auditlog"));
const app_1 = __importDefault(require("./app"));
const port = 3000;
let server;
exports.sequelizeTest = new sequelize_1.Sequelize("postgres", process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false,
});
const createTestDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelizeTest.query("CREATE DATABASE database_test");
        console.log("database_test created");
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === "SequelizeDatabaseError" &&
                error.message.includes("already exists")) {
                // Database already exists, ignore the error
                console.log("Database already exists, ignoring error");
            }
            else {
                console.log("Error creating database:", error);
                throw error;
            }
        }
        else {
            console.log(`====== Re-throw if the error is not an instance of Error ${error}======`);
            throw error; // Re-throw if the error is not an instance of Error
        }
    }
});
const seedingDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    // ==> seeding user data to database test <==\\
    console.log("========== Seeding user data... ==========");
    const userFilePath = path_1.default.resolve(__dirname, "../dummy/user.json"); // Path yang benar ke file JSON
    const userJsonData = JSON.parse(fs_1.default.readFileSync(userFilePath, "utf-8"));
    const userData = userJsonData.map((item) => (Object.assign(Object.assign({}, item), { password: (0, bcrypt_1.hashPassword)(item.password), createdAt: new Date(), updatedAt: new Date() })));
    yield user_1.default.bulkCreate(userData);
    console.log("========== User data seeded ==========");
    // ==> seeding user data to database test <==\\
    // ==> seeding store data to database test <== \\
    console.log("=========== Seeding store data... ===========");
    const storeFilePath = path_1.default.resolve(__dirname, "../dummy/store.json"); // Path yang benar ke file JSON
    const storeJsonData = JSON.parse(fs_1.default.readFileSync(storeFilePath, "utf-8"));
    const storeData = storeJsonData.map((item) => {
        const tempStore = {
            code: (0, codeGenerator_1.generateStoreCodeTs)(item.ownerUsername, item.category, item.location, new Date(), item.OwnerId),
            name: item.name,
            location: item.location,
            category: item.category,
            OwnerId: item.OwnerId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return tempStore;
    });
    yield store_1.default.bulkCreate(storeData);
    console.log("=========== Store data seeded... ===========");
    // ==> seeding store data to database test <== \\
    // ==> seeding employee data to database test <== \\
    console.log("=========== Seeding employee data... ===========");
    const employeeFilePath = path_1.default.resolve(__dirname, "../dummy/employee.json");
    const employeeJsonData = JSON.parse(fs_1.default.readFileSync(employeeFilePath, "utf-8"));
    const employeeData = employeeJsonData.map((item) => (Object.assign(Object.assign({}, item), { createdAt: new Date(), updatedAt: new Date() })));
    yield employee_1.default.bulkCreate(employeeData);
    console.log("=========== Employee data seeded... ===========");
    // ==> seeding employee data to database test <==
    // ==> seeding attendance data to database test <==\\
    console.log("=========== Seeding Attendance data... ===========");
    const attendanceFilePath = path_1.default.resolve(__dirname, "../dummy/attendance.json");
    const attendanceJsonData = JSON.parse(fs_1.default.readFileSync(attendanceFilePath, "utf-8"));
    const attendanceData = attendanceJsonData.map((item) => (Object.assign(Object.assign({}, item), { createdAt: new Date(), updatedAt: new Date() })));
    yield attendance_1.default.bulkCreate(attendanceData);
    console.log("=========== Attendance data seeded... ===========");
    // ==> seeding Attendance data to database test <==\\
    // ==> seeding payroll data to database test <==\\
    console.log("=========== Seeding Payroll data... ===========");
    const payrollFilePath = path_1.default.resolve(__dirname, "../dummy/payroll.json");
    const payrollJsonData = JSON.parse(fs_1.default.readFileSync(payrollFilePath, "utf-8"));
    const payrollData = payrollJsonData.map((item) => (Object.assign(Object.assign({}, item), { createdAt: new Date(), updatedAt: new Date() })));
    yield payroll_1.default.bulkCreate(payrollData);
    console.log("=========== Payroll data seeded... ===========");
    // ==> seeding payroll data to database test <==\\
    // ==> seeding auditLog data to database test <==\\
    console.log("=========== Seeding AuditLog data... ===========");
    const auditLogFilePath = path_1.default.resolve(__dirname, "../dummy/auditLog.json");
    const auditLogJsonData = JSON.parse(fs_1.default.readFileSync(auditLogFilePath, "utf-8"));
    const auditLogData = auditLogJsonData.map((item) => (Object.assign(Object.assign({}, item), { timestamp: new Date(), createdAt: new Date(), updatedAt: new Date() })));
    yield auditlog_1.default.bulkCreate(auditLogData);
    console.log("=========== AuditLog data seeded... ===========");
    // ==> seeding auditLog data to database test <==\\
});
const deleteTestDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.sequelizeTest.query("DROP DATABASE IF EXISTS database_test");
    }
    catch (error) {
        console.error("Error deleting database:", error);
    }
});
// Setup global environment sebelum semua tes
// 
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.time("Start setup beforeAll");
    console.log("======= Setting up test database... =======");
    console.log("========== Start create database ==========");
    yield createTestDatabase();
    console.log("========== create database done ==========");
    console.log("========== Syncing database schema... ==========");
    yield connection_1.default.sync({ force: true });
    yield seedingDatabase();
    // Menjalankan server Express
    server = app_1.default.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    console.timeEnd("Start setup beforeAll");
}), 10000);
// Cleanup global environment setelah semua tes
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Menutup server
    if (server) {
        server.close();
    }
    // Menutup koneksi ke database
    yield connection_1.default.close();
    console.log("========== Start delete database ==========");
    yield deleteTestDatabase();
    console.log("========== Test database deleted ==========");
    yield exports.sequelizeTest.close();
}));
//# sourceMappingURL=setup.js.map