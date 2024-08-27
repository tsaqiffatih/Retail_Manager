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
// Payloads and tokens for testing
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
    employeeToken: (0, jsonWebToken_1.createToken)({
        email: "employee1@mail.com",
        username: "employee1Pass",
    }),
});
const bodyJsonAdmin1 = {
    firstName: "admin",
    lastName: "Test",
    dateOfBirth: "1990-01-01",
    contact: "123456789",
    education: "Bachelor",
    address: "Admin Street",
    position: "MANAGER",
    salary: 500000,
    password: "adminPass1",
    email: "adminTest@mail.com",
    storeId: 1,
    role: "ADMIN",
};
describe("User Controller Tests", () => {
    const { superAdminToken, ownerToken, adminToken, employeeToken } = generateTokens();
    // Test block for /login route
    describe("POST /login", () => {
        const loginData = (email, password) => ({
            email,
            password,
        });
        test("success post /login", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/login")
                .send(loginData("superAdmin@mail.com", "superAdminPass"));
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("access_token", expect.any(String));
        }));
        test("fail post /login with wrong email", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/login")
                .send(loginData("wrong@mail.com", "superAdminPass"));
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "email or password was wrong");
        }));
        test("fail post /login with wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/login")
                .send(loginData("superAdmin@mail.com", "wrongPass"));
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "email or password was wrong");
        }));
    });
    // Test block for /register-owner route
    describe("POST /register-owner", () => {
        const registerData = (userName, email, password) => ({
            userName,
            email,
            password,
            role: "OWNER",
        });
        test("success post /register-owner", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(registerData("ownerTest", "ownerTest@mail.com", "ownerPass1"))
                .set("Authorization", `Bearer ${superAdminToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", expect.any(String));
        }));
        test("fail post /register-owner with existing userName", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(registerData("ownerTest", "ownerTest@mail.com", "ownerPass1"))
                .set("Authorization", `Bearer ${superAdminToken}`);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(registerData("ownerTest", "ownerTest2@mail.com", "ownerPass1"))
                .set("Authorization", `Bearer ${superAdminToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "userName has been already exists");
        }));
        test("fail post /register-owner with existing email", () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(registerData("ownerTest2", "ownerTest@mail.com", "ownerPass1"))
                .set("Authorization", `Bearer ${superAdminToken}`);
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(registerData("ownerTest3", "ownerTest@mail.com", "ownerPass1"))
                .set("Authorization", `Bearer ${superAdminToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "email has been already exists");
        }));
        test("fail post /register-owner with weak password", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(registerData("ownerTest", "ownerTest@mail.com", "ownerPass"))
                .set("Authorization", `Bearer ${superAdminToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Password must contain at least one number.");
        }));
    });
    // Test block for /register-admin route
    describe("POST /register-admin", () => {
        test("success post /register-admin", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(bodyJsonAdmin1)
                .set("Authorization", `Bearer ${ownerToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", expect.any(String));
        }));
        test("fail post /register-admin with existing userName", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(Object.assign(Object.assign({}, bodyJsonAdmin1), { email: "adminTest2@mail.com" }))
                .set("Authorization", `Bearer ${ownerToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "userName has been already exists");
        }));
        test("fail post /register-admin with existing email", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(Object.assign(Object.assign({}, bodyJsonAdmin1), { firstName: "updatedAdmin", email: "adminTest@mail.com" }))
                .set("Authorization", `Bearer ${ownerToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "email has been already exists");
        }));
    });
    // Test block for /register-employee route
    describe("POST /register-employee", () => {
        const employeeData = {
            firstName: "employee",
            lastName: "Test",
            dateOfBirth: "1995-05-05",
            contact: "987654321",
            education: "High School",
            address: "Employee Street",
            position: "Staff",
            salary: 3000,
            password: "employeePass1",
            email: "employeeTest@mail.com",
        };
        test("success post /register-employee", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(employeeData)
                .set("Authorization", `Bearer ${adminToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", expect.any(String));
        }));
        test("fail post /register-employee with existing email", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(Object.assign(Object.assign({}, employeeData), { firstName: "employeeUpdated" }))
                .set("Authorization", `Bearer ${adminToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "email has been already exists");
        }));
        test("fail post /register-employee with existing username", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/users/register")
                .send(Object.assign(Object.assign({}, employeeData), { email: "employee2Test@mail.com" }))
                .set("Authorization", `Bearer ${adminToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "userName has been already exists");
        }));
    });
    // Test block for /edit-user route
    describe("PATCH /edit-user", () => {
        const updatedUserData = {
            userName: "updatedEmployee",
            email: "employeeUpdated@mail.com",
            password: "EmployeeTest1",
        };
        const updatedToken = (0, jsonWebToken_1.createToken)({
            email: updatedUserData.email,
            username: updatedUserData.userName,
        });
        const updatedEmail = "partialupdate@mail.com";
        const updatedTokenSecond = (0, jsonWebToken_1.createToken)({
            email: updatedEmail,
            username: updatedUserData.userName,
        });
        test("fail patch /edit-user with non-existent user ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch("/api/users/999")
                .send(updatedUserData)
                .set("Authorization", `Bearer ${employeeToken}`);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "User is not found");
        }));
        test("fail patch /edit-user with unauthorized access", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch("/api/users/5")
                .send(updatedUserData)
                .set("Authorization", `Bearer ${employeeToken}`);
            expect(response.status).toBe(403);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("message", "Forbidden Access");
        }));
        test("fail patch /edit-user with invalid email format", () => __awaiter(void 0, void 0, void 0, function* () {
            const tokenPayload = (0, jsonWebToken_1.createToken)({
                email: "partialupdate@mail.com",
                username: "updatedName",
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch("/api/users/6")
                .send({
                email: "invalid-email-format",
            })
                .set("Authorization", `Bearer ${employeeToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("message", "Invalid Email Type");
        }));
        test("fail patch /edit-user with short password", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch("/api/users/6")
                .send({
                password: "short",
            })
                .set("Authorization", `Bearer ${employeeToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("message", "password must be at least 7 characters long");
        }));
        test("fail patch /edit-user with weak password", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch("/api/users/6")
                .send({
                password: "weakpass",
            })
                .set("Authorization", `Bearer ${employeeToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("message", "Password must contain at least one uppercase letter. Password must contain at least one number.");
        }));
        test("fail patch /edit-user with existing email", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch("/api/users/6")
                .send({
                email: "employee2@mail.com",
            })
                .set("Authorization", `Bearer ${employeeToken}`);
            expect(response.status).toBe(400);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("message", "email has been already exists");
        }));
        test("fail patch /edit-user as unauthorized role", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch("/api/users/6")
                .send({
                userName: "updatedName",
            })
                .set("Authorization", `Bearer ${adminToken}`);
            expect(response.status).toBe(403);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("message", "Forbidden Access");
        }));
        test("success patch /edit-user", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch("/api/users/6")
                .send(updatedUserData)
                .set("Authorization", `Bearer ${employeeToken}`);
            // expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Success update user data");
        }));
        test("success patch /edit-user with partial fields", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch("/api/users/6")
                .send({
                email: updatedEmail,
            })
                .set("Authorization", `Bearer ${updatedToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("message", "Success update user data");
            expect(response.body.data).toHaveProperty("email", "partialupdate@mail.com");
        }));
        test("success patch /edit-user with strong password", () => __awaiter(void 0, void 0, void 0, function* () {
            const tokenPayload = (0, jsonWebToken_1.createToken)({
                email: "partialupdate@mail.com",
                username: "updatedName",
            });
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch("/api/users/6")
                .send({
                password: "StrongPass1",
            })
                .set("Authorization", `Bearer ${updatedTokenSecond}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body).toHaveProperty("message", "Success update user data");
        }));
    });
});
//# sourceMappingURL=userController.test.js.map