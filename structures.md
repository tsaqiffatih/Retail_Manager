# Project Structure: RETAIL_MANAGER

```plaintext
RETAIL_MANAGER/
│
├── docs/
│   └── swagger
│        ├── attendance.yaml
│        ├── employee.yaml
│        ├── index.yaml
│        ├── payroll.yaml
│        ├── store.yaml
│        └── user.yaml
│
├── dummy/
│   ├── attendance.json
│   ├── auditLog.json
│   ├── employee.json
│   ├── payroll.json
│   ├── store.json
│   └── user.json
│
├── node_modules/
│
├── src/
│   ├── config/
│   │   ├── config.js
│   │   ├── connection.ts
│   │   └── swagger.ts
│   │
│   ├── controllers/
│   │   ├── attendanceController.ts
│   │   ├── employeeController.ts
│   │   ├── payrollController.ts
│   │   ├── storeController.ts
│   │   └── userController.ts
│   │
│   ├── helper/
│   │   ├── bcrypt.ts
│   │   ├── bcryptJs.js
│   │   ├── codeGenerator.ts
│   │   ├── codeGeneratorJs.js
│   │   ├── isStrongPassword.ts
│   │   ├── isValidCategory.ts
│   │   ├── jsonWebToken.ts
│   │   ├── locationValidation.ts
│   │
│   ├── interface/
│   │   └── auth.ts
│   │
│   ├── middleware/
│   │   ├── auditMiddleware.ts
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   │
│   ├── migrations/
│   │   ├── 20240727190828-create-user.js
│   │   ├── 20240727190829-create-store.js
│   │   ├── 20240727190831-create-employee.js
│   │   ├── 20240727190832-create-attendance.js
│   │   ├── 20240727190833-create-payroll.js
│   │   └── 20240727190837-create-audit-log.js
│   │
│   ├── models/
│   │   ├── attendance.ts
│   │   ├── auditlog.ts
│   │   ├── employee.ts
│   │   ├── payroll.ts
│   │   ├── store.ts
│   │   └── user.ts
│   │
│   ├── routers/
│   │   ├── attendanceRouter.ts
│   │   ├── employeeRouter.ts
│   │   ├── index.ts
│   │   ├── payrollRouter.ts
│   │   ├── storeRouter.ts
│   │   └── userRouter.ts
│   │
│   ├── schedulers/
│   │   ├── attendanceScheduler.ts
│   │   └── payrollScheduler.ts
│   │
│   ├── seeders/
│   │   ├── 20240727195928-user-seed-initial.js
│   │   ├── 20240727195940-store-seed-initial.js
│   │   ├── 20240727195949-employee-seed-initial.js
│   │   ├── 20240727195959-attendance-seed-initial.js
│   │   ├── 20240727200015-payroll-seed-initial.js
│   │   └── 20240727200037-auditLog-seed-initial.js
│   │
│   ├── services/
│   │   └── userService.ts
│   │
│   ├── tests/
│   │   └── app.ts
│   │
│   ├── app.ts
│   └── jest.setup.ts
│
├── .env
├── .env.example
├── .gitignore
├── .sequelizerc
├── auth.md
├── package-lock.json
├── package.json
├── README.md
├── structures.md
└── tsconfig.json
```