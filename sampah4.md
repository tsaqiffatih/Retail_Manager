Tentu! Berikut adalah kode lengkap yang mencakup setup global, teardown global, dan konfigurasi yang diperlukan, termasuk file `package.json`:

### 1. **File `src/config/database.ts`**

```typescript
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

console.log("Database connection established.");

export default sequelizeConnection;
```

### 2. **File `src/tests/setup/globalSetup.ts`**

```typescript
import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import User from '../../../src/models/user';
import Store from '../../../src/models/store';
import Employee from '../../../src/models/employee';
import Payroll from '../../../src/models/payroll';
import Attendance from '../../../src/models/attendance';
import AuditLog from '../../../src/models/auditlog';
import { hashPassword } from '../../../src/utils/hashPassword'; // Pastikan ini sesuai dengan implementasi Anda
import { generateStoreCodeTs } from '../../../src/utils/generateStoreCode'; // Pastikan ini sesuai dengan implementasi Anda

dotenv.config();

const testDbConfig = {
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: 'database_test',
  host: process.env.DB_HOST as string,
  dialect: 'postgres',
};

export default async function globalSetup() {
  const sequelizeTest = new Sequelize(
    testDbConfig.database,
    testDbConfig.username,
    testDbConfig.password,
    {
      host: testDbConfig.host,
      dialect: 'postgres',
      models: [User, Store, Employee, Payroll, Attendance, AuditLog],
    }
  );

  sequelizeTest.addModels([
    User,
    Store,
    Employee,
    Payroll,
    Attendance,
    AuditLog,
  ]);

  // Sinkronisasi model
  await sequelizeTest.sync({ force: true });

  // Seeding data dummy
  console.log("========== Seeding user data... ==========");
  const userFilePath = path.resolve(__dirname, "../dummy/user.json");
  const userJsonData = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));

  const userData = userJsonData.map((item: any) => ({
    ...item,
    password: hashPassword(item.password),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await User.bulkCreate(userData);
  console.log("========== User data seeded ==========");

  console.log("=========== Seeding store data... ===========");
  const storeFilePath = path.resolve(__dirname, "../dummy/store.json");
  const storeJsonData = JSON.parse(fs.readFileSync(storeFilePath, "utf-8"));

  const storeData = storeJsonData.map((item: any) => ({
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
  }));

  await Store.bulkCreate(storeData);
  console.log("=========== Store data seeded... ===========");

  console.log("=========== Seeding employee data... ===========");
  const employeeFilePath = path.resolve(__dirname, "../dummy/employee.json");
  const employeeJsonData = JSON.parse(fs.readFileSync(employeeFilePath, "utf-8"));

  const employeeData = employeeJsonData.map((item: any) => ({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await Employee.bulkCreate(employeeData);
  console.log("=========== Employee data seeded... ===========");

  console.log("=========== Seeding Attendance data... ===========");
  const attendanceFilePath = path.resolve(__dirname, "../dummy/attendance.json");
  const attendanceJsonData = JSON.parse(fs.readFileSync(attendanceFilePath, "utf-8"));

  const attendanceData = attendanceJsonData.map((item: any) => ({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await Attendance.bulkCreate(attendanceData);
  console.log("=========== Attendance data seeded... ===========");

  console.log("=========== Seeding Payroll data... ===========");
  const payrollFilePath = path.resolve(__dirname, "../dummy/payroll.json");
  const payrollJsonData = JSON.parse(fs.readFileSync(payrollFilePath, "utf-8"));

  const payrollData = payrollJsonData.map((item: any) => ({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await Payroll.bulkCreate(payrollData);
  console.log("=========== Payroll data seeded... ===========");

  console.log("=========== Seeding AuditLog data... ===========");
  const auditLogFilePath = path.resolve(__dirname, "../dummy/auditLog.json");
  const auditLogJsonData = JSON.parse(fs.readFileSync(auditLogFilePath, "utf-8"));

  const auditLogData = auditLogJsonData.map((item: any) => ({
    ...item,
    timestamp: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await AuditLog.bulkCreate(auditLogData);
  console.log("=========== AuditLog data seeded... ===========");
}
```

### 3. **File `src/tests/setup/globalTeardown.ts`**

```typescript
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';
import User from '../../models/user';
import Store from '../../models/store';
import Employee from '../../models/employee';
import Payroll from '../../models/payroll';
import Attendance from '../../models/attendance';
import AuditLog from '../../models/auditlog';

dotenv.config();

const testDbConfig = {
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
  database: 'database_test',
  host: process.env.DB_HOST as string,
  dialect: 'postgres',
};

export default async function globalTeardown() {
  const sequelizeTest = new Sequelize(
    testDbConfig.database,
    testDbConfig.username,
    testDbConfig.password,
    {
      host: testDbConfig.host,
      dialect: 'postgres',
      models: [User, Store, Employee, Payroll, Attendance, AuditLog],
    }
  );

  sequelizeTest.addModels([
    User,
    Store,
    Employee,
    Payroll,
    Attendance,
    AuditLog,
  ]);

  // Hapus semua skema jika diperlukan
  await sequelizeTest.dropAllSchemas(); // Atau hapus dengan cara lain jika diperlukan

  // Tutup koneksi database
  await sequelizeTest.close();
}
```

### 4. **File `src/tests/setup/setup.ts`**

```typescript
import { app } from '../../app'; // Mengimpor instance aplikasi Express
import sequelizeConnection from '../../config/database'; // Mengimpor konfigurasi Sequelize dengan nama baru

const port = 3000;
let server: any;

// Setup global environment sebelum semua tes
beforeAll(async () => {
  // Mengatur koneksi ke database
  await sequelizeConnection.authenticate();
  await sequelizeConnection.sync({ force: true }); // Sinkronisasi model dan force untuk membersihkan tabel

  // Menjalankan server Express
  server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});

// Cleanup global environment setelah semua tes
afterAll(async () => {
  // Menutup server jika ada
  if (server) {
    server.close();
  }
  
  // Menutup koneksi ke database
  await sequelizeConnection.close();
});
```

### 5. **File `

package.json`**

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "scripts": {
    "test": "jest",
    "test:setup": "jest --config ./src/tests/setup/jest.config.js"
  },
  "dependencies": {
    "dotenv": "^16.0.3",
    "sequelize": "^6.22.0",
    "sequelize-typescript": "^2.1.3"
  },
  "devDependencies": {
    "@types/jest": "^29.0.3",
    "jest": "^29.0.3",
    "ts-jest": "^29.0.3",
    "typescript": "^5.0.4"
  },
  "jest": {
    "globalSetup": "<rootDir>/src/tests/setup/globalSetup.ts",
    "globalTeardown": "<rootDir>/src/tests/setup/globalTeardown.ts",
    "setupFilesAfterEnv": ["<rootDir>/src/tests/setup/setup.ts"],
    "testEnvironment": "node",
    "testMatch": ["**/*.test.ts"],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    }
  }
}
```

Dengan konfigurasi ini, Jest akan memanggil `globalSetup` sebelum suite tes dimulai, melakukan seeding data yang diperlukan. Setelah semua tes selesai, `globalTeardown` akan dipanggil untuk membersihkan database dan menutup koneksi.