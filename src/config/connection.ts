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
  dialect: 'postgres';
  url: string 
  ssl?: boolean
}

interface Config {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
}

// Check if required environment variables are defined
const requiredEnvVars = [
  "DEV_DATABASE_URL",
  "TEST_DATABASE_URL",
  "PROD_DATABASE_URL"
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Error: Missing environment variable ${envVar}`);
    process.exit(1);
  }
});

const databaseConfig: Config = {
  development: {
    url: process.env.DEV_DATABASE_URL as string,
    dialect: "postgres",
  },
  test: {
    url: process.env.TEST_DATABASE_URL as string,
    dialect: "postgres",
  },
  production: {
    dialect: 'postgres',
    url: process.env.DATABASE_URL as string,
    ssl: true
  },
};

const env = process.env.NODE_ENV || "development";
const config: DatabaseConfig = databaseConfig[env as keyof Config];

let sequelizeConnection: Sequelize;

if (env === "production") {
  sequelizeConnection = new Sequelize(config.url as string, {
    dialect: 'postgres',
    models: [User, Store, Employee, Payroll, Attendance, AuditLog],
  });
} else {
  sequelizeConnection = new Sequelize(config.url as string, {
    dialect: "postgres",
    models: [User, Store, Employee, Payroll, Attendance, AuditLog],
  });
}

export default sequelizeConnection;

