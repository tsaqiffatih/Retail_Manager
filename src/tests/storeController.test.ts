import request from "supertest"; // koneksi database
import app from "../app";
import { createToken } from "../helper/jsonWebToken";

const generateTokens = () => ({
  superAdminToken: createToken({
    email: "superAdmin@mail.com",
    username: "superAdmin",
  }),
  noStoreOwnerToken: createToken({
    email: "owner3mail.com",
    username: "owner3Boss",
  }),
  ownerToken: createToken({
    email: "owner1@mail.com",
    username: "owner1Pass",
  }),
  adminToken: createToken({
    email: "admin1@mail.com",
    username: "admin1Pass",
  }),
  managerToken: createToken({
    email: "manager2@mail.com",
    username: "manager2",
  }),
  employeeToken: createToken({
    email: "employee1@mail.com",
    username: "employee1Pass",
  }),
});

// Test suite untuk user endpoints
describe("Store Controller Tests", () => {
  const {
    ownerToken,
    adminToken,
    employeeToken,
    managerToken,
    noStoreOwnerToken,
  } = generateTokens();

  describe("GET /stores", () => {
    test("success GET /stores for OWNER role", async () => {
      const response = await request(app)
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
    });

    test("success GET /stores for OWNER role with no stores", async () => {
      // This assumes OWNER with no stores
      const response = await request(app)
        .get("/api/stores")
        .set("Authorization", `Bearer ${noStoreOwnerToken}`)
        .expect(200);

      expect(response.body.message).toBe("success");
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
      expect(response.body.totalItems).toBe(0);
      expect(response.body.totalPages).toBe(0);
      expect(response.body.currentPage).toBe(1);
    });

    test("success GET /stores for ADMIN role", async () => {
      const response = await request(app)
        .get("/api/stores")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("success");
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test("success GET /stores for MANAGER role", async () => {
      const response = await request(app)
        .get("/api/stores")
        .set("Authorization", `Bearer ${managerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("success");
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test("fail GET /stores with invalid limit value", async () => {
      const response = await request(app)
        .get("/api/stores")
        .query({ limit: "invalid" })
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid limit value.");
    });

    test("fail GET /stores with invalid page value", async () => {
      const response = await request(app)
        .get("/api/stores")
        .query({ page: "invalid" })
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid page value.");
    });

    test("fail GET /stores for EMPLOYEE role", async () => {
      const response = await request(app)
        .get("/api/stores")
        .set("Authorization", `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Forbidden Access");
    });
  });

  describe("POST /stores", () => {
    test("success POST /stores with valid data", async () => {
      const storeData = {
        name: "New Electronics Store",
        location: "Surabaya",
        category: "Electronics",
      };

      const response = await request(app)
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
    });

    test("fail POST /stores with missing name", async () => {
      const storeData = {
        location: "Surabaya",
        category: "Electronics",
      };

      const response = await request(app)
        .post("/api/stores")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(storeData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Store name cannot be null"
      );
    });

    test("fail POST /stores with missing location", async () => {
      const storeData = {
        name: "New Electronics Store",
        category: "Electronics",
      };

      const response = await request(app)
        .post("/api/stores")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(storeData)
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Store location cannot be null"
      );
    });

    test("fail POST /stores with missing category", async () => {
      const storeData = {
        name: "New Electronics Store",
        location: "Surabaya",
      };

      const response = await request(app)
        .post("/api/stores")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(storeData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Store category cannot be null"
      );
    });
    /*
    test("fail POST /stores with invalid token", async () => {
      const storeData = {
        name: "New Electronics Store",
        location: "Surabaya",
        category: "Electronics",
      };

      const response = await request(app)
        .post("/api/stores")
        .set("Authorization", `Bearer 1831813831818329183`)
        .send(storeData)
        .expect(401); // Assuming invalid token returns 401 Unauthorized

      expect(response.body.message).toBe("Unauthorized access.");
    });

    test("fail POST /stores with missing token", async () => {
      const storeData = {
        name: "New Electronics Store",
        location: "Surabaya",
        category: "Electronics",
      };

      const response = await request(app)
        .post("/api/stores")
        .send(storeData)
        .expect(401); // Assuming missing token returns 401 Unauthorized

      expect(response.body.message).toBe("Unauthorized access.");
    });

    test("fail POST /stores with invalid data", async () => {
      const storeData = {
        name: "Invalid Store",
        location: "12345", // Assuming location should be a valid city or address
        category: "", // Assuming category cannot be empty
      };

      const response = await request(app)
        .post("/api/stores")
        .set("Authorization", `Bearer ${ownerToken}`)
        .send(storeData)
        .expect(400); // Adjust based on how your application handles invalid data

      expect(response.body.message).toBe("Invalid data.");
    });
    */
  });
});
