"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("../models/user"));
const employee_1 = __importDefault(require("../models/employee"));
const store_1 = __importDefault(require("../models/store"));
const payroll_1 = __importDefault(require("../models/payroll"));
const attendance_1 = __importDefault(require("../models/attendance"));
const auditlog_1 = __importDefault(require("../models/auditlog"));
dotenv_1.default.config();
// Check if required environment variables are defined
const requiredEnvVars = [
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_NAME",
    "DB_HOST",
];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Error: Missing environment variable ${envVar}`);
        process.exit(1);
    }
});
const databaseConfig = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: "postgres",
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: "database_test",
        host: process.env.DB_HOST,
        dialect: "postgres",
    },
    production: {
        dialect: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: true
    },
};
const env = process.env.NODE_ENV || "development";
const config = databaseConfig[env];
let sequelizeConnection;
if (env === "production") {
    // Koneksi untuk production menggunakan URL dan SSL jika diperlukan
    sequelizeConnection = new sequelize_typescript_1.Sequelize(config.url, {
        dialect: 'postgres',
        models: [user_1.default, store_1.default, employee_1.default, payroll_1.default, attendance_1.default, auditlog_1.default],
    });
}
else {
    // Koneksi untuk development dan test menggunakan parameter individual
    sequelizeConnection = new sequelize_typescript_1.Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: "postgres",
        models: [user_1.default, store_1.default, employee_1.default, payroll_1.default, attendance_1.default, auditlog_1.default],
    });
}
/*
const sequelizeConnection = new Sequelize(
  config.database as string,
  config.username as string,
  config.password,
  {
    host: config.host,
    dialect: "postgres",
    models: [User, Store, Employee, Payroll, Attendance, AuditLog],
  }
);
*/
exports.default = sequelizeConnection;
//# sourceMappingURL=connection.js.map