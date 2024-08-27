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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const jsonWebToken_1 = require("../helper/jsonWebToken");
const generateTokens = () => ({
    superAdminToken: (0, jsonWebToken_1.createToken)({
        email: "superAdmin@mail.com",
        username: "superAdmin",
    }),
    ownerToken: (0, jsonWebToken_1.createToken)({
        email: "owner1@mail.com",
        username: "owner1Pass",
    }),
    adminToken: (0, jsonWebToken_1.createToken)({
        email: "admin1@mail.com",
        username: "admin1Pass",
    }),
    managerToken: (0, jsonWebToken_1.createToken)({
        email: "manager2@mail.com",
        username: "manager2",
        // storeId => 1 name => john
    }),
    employeeToken: (0, jsonWebToken_1.createToken)({
        email: "employee1@mail.com",
        username: "employee1Pass",
        // storeId => 1 name => emily
    }),
    manager3: (0, jsonWebToken_1.createToken)({
        email: "managerBoss21@mail.com",
        username: "managerBoss21",
    }),
});
describe("Employee Controller Tests", () => {
    console.time("Testing Employee time:");
    const { ownerToken, adminToken, employeeToken, managerToken, manager3, } = generateTokens();
    const employeeId = 4;
    const updatedEmployee = 7; //role Manager and role Admin are classified as Employees. 
    describe("GET employees/:id", () => {
        it("success GET /employees/:id retreives the employee's own data", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/employees/${employeeId}`)
                .set("Authorization", `Bearer ${employeeToken}`);
            const employee = response.body.data;
            expect(employee).toMatchObject({
                id: expect.any(Number),
                firstName: expect.any(String),
                lastName: expect.any(String),
                dateOfBirth: expect.any(String),
                contact: expect.any(String),
                education: expect.any(String),
                address: expect.any(String),
                position: expect.any(String),
                salary: expect.any(Number),
                UserId: expect.any(Number),
                StoreId: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                attendances: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        date: expect.any(String),
                        status: expect.any(String),
                        EmployeeId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }),
                ]),
                payrolls: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        date: expect.any(String),
                        amount: expect.any(Number),
                        status: expect.any(String),
                        EmployeeId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }),
                ]),
                store: expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    location: expect.any(String),
                    category: expect.any(String),
                    code: expect.any(String),
                    OwnerId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
                user: expect.objectContaining({
                    id: expect.any(Number),
                    userName: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "success");
            expect(response.body.data).toHaveProperty("id", employeeId);
        }));
        it("success GET /employees/:id retrieves data for MANAGER/ADMIN with store access", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/employees/${employeeId}`)
                .set("Authorization", `Bearer ${managerToken}`);
            const employee = response.body.data;
            expect(employee).toMatchObject({
                id: expect.any(Number),
                firstName: expect.any(String),
                lastName: expect.any(String),
                dateOfBirth: expect.any(String),
                contact: expect.any(String),
                education: expect.any(String),
                address: expect.any(String),
                position: expect.any(String),
                salary: expect.any(Number),
                UserId: expect.any(Number),
                StoreId: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                attendances: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        date: expect.any(String),
                        status: expect.any(String),
                        EmployeeId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }),
                ]),
                payrolls: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        date: expect.any(String),
                        amount: expect.any(Number),
                        status: expect.any(String),
                        EmployeeId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }),
                ]),
                store: expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    location: expect.any(String),
                    category: expect.any(String),
                    code: expect.any(String),
                    OwnerId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
                user: expect.objectContaining({
                    id: expect.any(Number),
                    userName: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "success");
            expect(response.body.data).toHaveProperty("id", employeeId);
        }));
        it("success GET /employees/:id retrieves data for store OWNER", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/employees/${employeeId}`)
                .set("Authorization", `Bearer ${ownerToken}`);
            const employee = response.body.data;
            expect(employee).toMatchObject({
                id: expect.any(Number),
                firstName: expect.any(String),
                lastName: expect.any(String),
                dateOfBirth: expect.any(String),
                contact: expect.any(String),
                education: expect.any(String),
                address: expect.any(String),
                position: expect.any(String),
                salary: expect.any(Number),
                UserId: expect.any(Number),
                StoreId: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                attendances: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        date: expect.any(String),
                        status: expect.any(String),
                        EmployeeId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }),
                ]),
                payrolls: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        date: expect.any(String),
                        amount: expect.any(Number),
                        status: expect.any(String),
                        EmployeeId: expect.any(Number),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String),
                    }),
                ]),
                store: expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    location: expect.any(String),
                    category: expect.any(String),
                    code: expect.any(String),
                    OwnerId: expect.any(Number),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
                user: expect.objectContaining({
                    id: expect.any(Number),
                    userName: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                }),
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "success");
            expect(response.body.data).toHaveProperty("id", employeeId);
        }));
        it("fail GET /employees/:id for roles without store access (ADMIN/OWNER/EMPLOYEE)", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/employees/${employeeId}`)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "access denied");
        }));
        it("fail GET /employees/:id, employee not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get("/api/employees/9999")
                .set("Authorization", `Bearer ${employeeToken}`);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Employee is not found");
        }));
    });
    describe("PATCH employees/:id", () => {
        it("fail PATCH /employees/:id for protected fields (StoreId)", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/api/employees/${employeeId}`)
                .set("Authorization", `Bearer ${employeeToken}`)
                .send({ StoreId: 123 });
            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty("message", "Field StoreId is protected and cannot be updated");
        }));
        it("fail PATCH /employees/:id for protected fields (UserId)", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/api/employees/${employeeId}`)
                .set("Authorization", `Bearer ${employeeToken}`)
                .send({ UserId: 123 });
            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty("message", "Field UserId is protected and cannot be updated");
        }));
        it("fail PATCH /employees/:id for invalid fields are sent", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/api/employees/${employeeId}`)
                .set("Authorization", `Bearer ${employeeToken}`)
                .send({ userName: "budiSusanto" });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "No fields to update found");
        }));
        it("fail PATCH /employees/:id for employee not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/api/employees/999`)
                .set("Authorization", `Bearer ${employeeToken}`)
                .send({ firstName: "budiSusanto" });
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Employee is not found");
        }));
        it("should update an employee", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/api/employees/${updatedEmployee}`)
                .set("Authorization", `Bearer ${manager3}`)
                .send({ firstName: "Updated Name" });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Employee updated successfully");
            expect(response.body.data);
        }));
    });
    console.timeEnd("Testing Employee time:");
});
//# sourceMappingURL=employeeController.test.js.map