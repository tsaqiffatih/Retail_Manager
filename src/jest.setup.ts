import { Sequelize } from "sequelize";
import sequelizeConnection from "./config/connection";
import path from "path";
import fs from "fs";
import { hashPassword } from "./helper/bcrypt";
import User from "./models/user";
import Store from "./models/store";
import { generateStoreCodeTs } from "./helper/codeGenerator";
import { StoreJson, TempStore } from "./interface";
import Employee from "./models/employee";
import Attendance from "./models/attendance";
import Payroll from "./models/payroll";
import AuditLog from "./models/auditlog";

export const sequelizeTest = new Sequelize(
  "postgres",
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD,
  {
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false,
  }
);

const createTestDatabase = async () => {
  try {
    await sequelizeTest.query("CREATE DATABASE database_test");
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.name === "SequelizeDatabaseError" &&
        error.message.includes("already exists")
      ) {
        // Database already exists, ignore the error
        console.log("Database already exists, ignoring error");
      } else {
        console.log("Error creating database:", error);
        throw error;
      }
    } else {
      console.log(`====== Re-throw if the error is not an instance of Error ${error}======`);
      throw error; // Re-throw if the error is not an instance of Error
    }
  } finally {
    await sequelizeTest.close();
    console.log("========== create database done ==========")
  }
};

module.exports = async () => {
  console.log("======= Setting up test database... =======");
  await createTestDatabase();

  console.log("========== Syncing database schema... ==========");
  await sequelizeConnection.sync({ force: true });

  // ==> seeding user data to database test <==\\
  console.log("========== Seeding user data... ==========");
  const userFilePath = path.resolve(__dirname, "../dummy/user.json"); // Path yang benar ke file JSON
  const userJsonData: User[] = JSON.parse(
    fs.readFileSync(userFilePath, "utf-8")
  );

  const userData = userJsonData.map((item: User) => ({
    ...item,
    password: hashPassword(item.password),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await User.bulkCreate(userData);
  console.log("========== User data seeded ==========");
  // ==> seeding user data to database test <==\\

  // ==> seeding store data to database test <== \\
  console.log("=========== Seeding store data... ===========");
  const storeFilePath = path.resolve(__dirname, "../dummy/store.json"); // Path yang benar ke file JSON
  const storeJsonData: StoreJson[] = JSON.parse(
    fs.readFileSync(storeFilePath, "utf-8")
  );

  const storeData = storeJsonData.map((item) => {
    const tempStore= {
      code: generateStoreCodeTs(
        item.ownerUsername,
        item.category,
        item.location,
        new Date(),
        item.OwnerId
      ),
      name: item.name,
      location: item.location,
      category: item.category,
      OwnerId: item.OwnerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return tempStore;
  });

  await Store.bulkCreate(storeData);
  console.log("=========== Store data seeded... ===========");
  // ==> seeding store data to database test <== \\

  // ==> seeding employee data to database test <== \\
  console.log("=========== Seeding employee data... ===========");
  const employeeFilePath = path.resolve(__dirname, "../dummy/employee.json");
  const employeeJsonData: Employee[] = JSON.parse(
    fs.readFileSync(employeeFilePath, "utf-8")
  );

  const employeeData = employeeJsonData.map((item: Employee) => ({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await Employee.bulkCreate(employeeData);
  console.log("=========== Employee data seeded... ===========");
  // ==> seeding employee data to database test <==

  // ==> seeding attendance data to database test <==\\
  console.log("=========== Seeding Attendance data... ===========");
  const attendanceFilePath = path.resolve(
    __dirname,
    "../dummy/attendance.json"
  );
  const attendanceJsonData: Attendance[] = JSON.parse(
    fs.readFileSync(attendanceFilePath, "utf-8")
  );

  const attendanceData = attendanceJsonData.map((item: Attendance) => ({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await Attendance.bulkCreate(attendanceData);
  console.log("=========== Attendance data seeded... ===========");
  // ==> seeding Attendance data to database test <==\\

  // ==> seeding payroll data to database test <==\\
  console.log("=========== Seeding Payroll data... ===========");
  const payrollFilePath = path.resolve(__dirname, "../dummy/payroll.json");
  const payrollJsonData: Payroll[] = JSON.parse(
    fs.readFileSync(payrollFilePath, "utf-8")
  );

  const payrollData = payrollJsonData.map((item: Payroll) => ({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await Payroll.bulkCreate(payrollData);
  console.log("=========== Payroll data seeded... ===========");
  // ==> seeding payroll data to database test <==\\

  // ==> seeding auditLog data to database test <==\\
  console.log("=========== Seeding AuditLog data... ===========");
  const auditLogFilePath = path.resolve(__dirname, "../dummy/auditLog.json");
  const auditLogJsonData: AuditLog[] = JSON.parse(
    fs.readFileSync(auditLogFilePath, "utf-8")
  );

  const auditLogData = auditLogJsonData.map((item: AuditLog) => ({
    ...item,
    timestamp: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await AuditLog.bulkCreate(auditLogData);
  console.log("=========== AuditLog data seeded... ===========");
  // ==> seeding auditLog data to database test <==\\
};
