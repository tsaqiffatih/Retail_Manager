import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import User from "../models/user";
import Employee from "../models/employee";
import Store from "../models/store";
import Payroll from "../models/payroll";
import Attendance from "../models/attendance";
import AuditLog from "../models/auditlog";

dotenv.config();

interface DatabaseConfig {
  username: string;
  password: string | undefined;
  database: string;
  host: string;
  dialect: string;
}

interface Config {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

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

const databaseConfig: Config = {
  development: {
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    host: process.env.DB_HOST as string,
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: "database_test",
    host: process.env.DB_HOST as string,
    dialect: "postgres",
  },
  production: {
    username: "root",
    password: "",
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

const env = process.env.NODE_ENV || "development";
const config: DatabaseConfig = databaseConfig[env as keyof Config];

const sequelizeConnection = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "postgres",
    models: [User, Store, Employee, Payroll, Attendance, AuditLog],
  }
);

sequelizeConnection.addModels([
  User,
  Store,
  Employee,
  Payroll,
  Attendance,
  AuditLog,
]);

console.log("berjalan di sini");

export default sequelizeConnection;
