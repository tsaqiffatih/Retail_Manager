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
    noStoreOwnerToken: (0, jsonWebToken_1.createToken)({
        email: "owner3mail.com",
        username: "owner3Boss",
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
    }),
    employeeToken: (0, jsonWebToken_1.createToken)({
        email: "employee1@mail.com",
        username: "employee1Pass",
    }),
    ownerToken2: (0, jsonWebToken_1.createToken)({
        email: "owner2@mail.com",
        username: "owner21",
    }),
});
// Test suite untuk user endpoints
describe("Store Controller Tests", () => {
    console.time("Testing STORE time:");
    const { ownerToken, adminToken, employeeToken, managerToken, noStoreOwnerToken, ownerToken2 } = generateTokens();
    describe("GET /stores", () => {
        test("success GET /stores for OWNER role", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get("/api/stores")
                .set("Authorization", `Bearer ${ownerToken}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("success");
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);
            // Example assertion for the structure of the first store
            const firstStore = response.body.data[0];
            expect(firstStore).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                location: expect.any(String),
                category: expect.any(String),
                code: expect.any(String),
                OwnerId: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                employees: expect.arrayContaining([
                    expect.objectContaining({
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
                        user: expect.objectContaining({
                            id: expect.any(Number),
                            userName: expect.any(String),
                            email: expect.any(String),
                            role: expect.any(String),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        }),
                    }),
                ]),
            });
            expect(response.body.totalItems).toBeGreaterThan(0);
            expect(response.body.totalPages).toBeGreaterThan(0);
            expect(response.body.currentPage).toBe(1);
        }));
        test("success GET /stores for OWNER role with no stores", () => __awaiter(void 0, void 0, void 0, function* () {
            // This assumes OWNER with no stores
            const response = yield (0, supertest_1.default)(app_1.default)
                .get("/api/stores")
                .set("Authorization", `Bearer ${noStoreOwnerToken}`)
                .expect(200);
            expect(response.body.message).toBe("success");
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBe(0);
            expect(response.body.totalItems).toBe(0);
            expect(response.body.totalPages).toBe(0);
            expect(response.body.currentPage).toBe(1);
        }));
        test("success GET /stores for ADMIN role", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get("/api/stores")
                .set("Authorization", `Bearer ${adminToken}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("success");
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);
        }));
        test("success GET /stores for MANAGER role", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get("/api/stores")
                .set("Authorization", `Bearer ${managerToken}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("success");
            expect(response.body.data).toBeInstanceOf(Array);
            expect(response.body.data.length).toBeGreaterThan(0);
        }));
        test("fail GET /stores with invalid limit value", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get("/api/stores")
                .query({ limit: "invalid" })
                .set("Authorization", `Bearer ${ownerToken}`);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid limit value.");
        }));
        test("fail GET /stores with invalid page value", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get("/api/stores")
                .query({ page: "invalid" })
                .set("Authorization", `Bearer ${ownerToken}`);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Invalid page value.");
        }));
        test("fail GET /stores for EMPLOYEE role", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get("/api/stores")
                .set("Authorization", `Bearer ${employeeToken}`);
            expect(response.status).toBe(403);
            expect(response.body.message).toBe("Forbidden Access");
        }));
    });
    describe("POST /stores", () => {
        test("success POST /stores with valid data", () => __awaiter(void 0, void 0, void 0, function* () {
            const storeData = {
                name: "New Electronics Store",
                location: "Surabaya",
                category: "Electronics",
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/stores")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send(storeData);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("success");
            expect(response.body.data).toMatchObject({
                name: storeData.name,
                location: storeData.location,
                category: storeData.category,
                OwnerId: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        }));
        test("fail POST /stores with missing name", () => __awaiter(void 0, void 0, void 0, function* () {
            const storeData = {
                location: "Surabaya",
                category: "Electronics",
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/stores")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send(storeData);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Store name cannot be null");
        }));
        test("fail POST /stores with missing location", () => __awaiter(void 0, void 0, void 0, function* () {
            const storeData = {
                name: "New Electronics Store",
                category: "Electronics",
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/stores")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send(storeData)
                .expect(400);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Store location cannot be null");
        }));
        test("fail POST /stores with missing category", () => __awaiter(void 0, void 0, void 0, function* () {
            const storeData = {
                name: "New Electronics Store",
                location: "Surabaya",
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/stores")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send(storeData);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Store category cannot be null");
        }));
        test("fail POST /stores with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
            const storeData = {
                name: "New Electronics Store",
                location: "Surabaya",
                category: "Electronics",
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/stores")
                .set("Authorization", `Bearer 1831813831818329183`)
                .send(storeData);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "Invalid Token");
        }));
        test("fail POST /stores with missing token", () => __awaiter(void 0, void 0, void 0, function* () {
            const storeData = {
                name: "New Electronics Store",
                location: "Surabaya",
                category: "Electronics",
            };
            const response = yield (0, supertest_1.default)(app_1.default).post("/api/stores").send(storeData);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "Invalid Token");
        }));
        test("fail POST /stores with invalid location", () => __awaiter(void 0, void 0, void 0, function* () {
            const storeData = {
                name: "Invalid Store",
                location: "12345",
                category: "Electronics",
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/stores")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send(storeData);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Store location must be in indonesia location");
        }));
        test("fail POST /stores with invalid category", () => __awaiter(void 0, void 0, void 0, function* () {
            const storeData = {
                name: "Invalid Store",
                location: "Surabaya",
                category: "Animals",
            };
            const response = yield (0, supertest_1.default)(app_1.default)
                .post("/api/stores")
                .set("Authorization", `Bearer ${ownerToken}`)
                .send(storeData);
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("message", "Invalid Store Category");
        }));
    });
    describe("GET /stores/:id Endpoint Tests", () => {
        test("should return 200 and store details for OWNER with valid store ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/stores/1`)
                .set("Authorization", `Bearer ${ownerToken}`);
            // Directly access the store object
            const store = response.body.data;
            expect(store).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                location: expect.any(String),
                category: expect.any(String),
                code: expect.any(String),
                OwnerId: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                employees: expect.arrayContaining([
                    expect.objectContaining({
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
                    }),
                ]),
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("success");
            expect(store.id).toBe(1);
        }));
        test("should return 200 and store details for ADMIN with valid store ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/stores/2`)
                .set("Authorization", `Bearer ${adminToken}`);
            const store = response.body.data;
            expect(store).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                location: expect.any(String),
                category: expect.any(String),
                code: expect.any(String),
                OwnerId: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                employees: expect.arrayContaining([
                    expect.objectContaining({
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
                    }),
                ]),
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("success");
            expect(response.body.data.id).toBe(2);
        }));
        test("should return 200 and store details for MANAGER with valid store ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/stores/1`)
                .set("Authorization", `Bearer ${managerToken}`);
            const store = response.body.data;
            expect(store).toMatchObject({
                id: expect.any(Number),
                name: expect.any(String),
                location: expect.any(String),
                category: expect.any(String),
                code: expect.any(String),
                OwnerId: expect.any(Number),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                employees: expect.arrayContaining([
                    expect.objectContaining({
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
                    }),
                ]),
            });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("success");
            expect(response.body.data.id).toBe(1);
        }));
        test("should return 403 for EMPLOYEE with valid store ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/stores/1`)
                .set("Authorization", `Bearer ${employeeToken}`);
            expect(response.status).toBe(403);
            expect(response.body.message).toBe("Forbidden Access");
        }));
        test("should return 404 for invalid store ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get("/api/stores/999999")
                .set("Authorization", `Bearer ${ownerToken}`);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Store is not found");
        }));
        test("should return 403 for unauthorized access to store details", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get(`/api/stores/1`)
                .set("Authorization", `Bearer ${noStoreOwnerToken}`);
            expect(response.status).toBe(403);
            expect(response.body.message).toBe("You do not have permission to access this store");
        }));
    });
    const storeIdToDelete = 5; // ID store yang akan dihapus
    describe("DELETE /stores/:storeId", () => {
        it("fail delete/:storeId with not authorized", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/api/stores/${storeIdToDelete}`)
                .set("Authorization", `Bearer 12152615361762131731736317`);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "Invalid Token");
        }));
        it("fail delete/:storeId with store does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete("/api/stores/9999")
                .set("Authorization", `Bearer ${ownerToken}`)
                .expect(404);
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("message", "Store is not found");
        }));
        it("fail delete/:storeId with missing Authorization header ", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).delete(`/api/stores/${storeIdToDelete}`);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "Invalid Token");
        }));
        it("fail delete/:storeId with Authorization header is not Bearer", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/api/stores/${storeIdToDelete}`)
                .set("Authorization", `Basic ${ownerToken}`);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "Invalid Token");
        }));
        it("fail delete/:storeId with user is not the store owner", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/api/stores/${storeIdToDelete}`)
                .set("Authorization", `Bearer ${ownerToken2}`);
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("message", "access denied");
        }));
        it("success delete/:storeId with store and associated users if authorized", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .delete(`/api/stores/${storeIdToDelete}`)
                .set("Authorization", `Bearer ${ownerToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Store and related Users deleted successfully");
        }));
    });
    console.timeEnd("Testing STORE time:");
});
//# sourceMappingURL=storeController.test.js.map