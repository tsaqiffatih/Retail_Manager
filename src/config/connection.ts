import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import User from '../models/user';
import Employee from '../models/employee';
import Store from '../models/store';
import Payroll from '../models/payroll';
import Attendance from '../models/attendance';
import AuditLog from '../models/auditlog';

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

const databaseConfig: Config = {
    development: {
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_NAME as string,
        host: process.env.DB_HOST as string,
        dialect: 'postgres',
    },
    test: {
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        database: 'database_test',
        host: process.env.DB_HOST as string,
        dialect: 'postgres',
    },
    production: {
        username: 'root',
        password: process.env.DB_PASSWORD as string,
        database: 'database_production',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
};

const env = process.env.NODE_ENV || 'development';
const config: DatabaseConfig = databaseConfig[env as keyof Config];

const sequelizeConnection = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: "postgres",
});

sequelizeConnection.addModels([User,Store,Employee,Payroll,Attendance,AuditLog])

export default sequelizeConnection;

