import request from "supertest";
import app, { server } from "../app"; // Ensure this path is correct
import sequelizeConnection from "../config/connection";
import { Sequelize } from "sequelize";
import { createToken } from "../helper/jsonWebToken"; // Ensure this path is correct

const sequelize = new Sequelize(
  "postgres",
  process.env.DB_USERNAME as string,
  process.env.DB_PASSWORD,
  {
    host: "127.0.0.1",
    dialect: "postgres",
    logging: false,
  }
);

const deleteTestDatabase = async () => {
  try {
    await sequelize.query("DROP DATABASE IF EXISTS database_test");
  } catch (error) {
    console.error("Error deleting database:", error);
  } finally {
    await sequelize.close();
  }
};

beforeAll(async () => {
  // Setup test database and seed data
});

afterAll(async () => {
  await sequelizeConnection.close();
  server.close();
  await deleteTestDatabase();
}, 15000);

describe("User Controller Tests", () => {
  const superAdminPayload = { email: 'superAdmin@mail.com', username: 'superAdmin' };
  const ownerPayload = { email: 'owner1@mail.com', username: 'owner1Pass' };
  const adminPayload = { email: 'admin1@mail.com', username: 'admin1Pass' };
  const employeePayload = { email: 'employee1@mail.com', username: 'employee1Pass' };

  const superAdminToken = createToken(superAdminPayload);
  const ownerToken = createToken(ownerPayload);
  const adminToken = createToken(adminPayload);
  const employeeToken = createToken(employeePayload);

  describe("POST /login", () => {
    test("success post /login", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "superAdmin@mail.com",
        password: "superAdminPass",
      });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });

    test("fail post /login with wrong email", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "wrong@mail.com",
        password: "superAdminPass",
      });

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "email or password was wrong");
    });

    test("fail post /login with wrong password", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "superAdmin@mail.com",
        password: "wrongPass",
      });

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "email or password was wrong");
    });
  });

  describe("POST /register/owner", () => {
    test("success post", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest",
          email: "ownerTest@mail.com",
          password: "ownerPass1",
          role: "OWNER"
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("fail post cause use existing userName", async () => {
      await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest",
          email: "ownerTest@mail.com",
          password: "ownerPass1",
          role: "OWNER"
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      const response = await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest",
          email: "ownerTest2@mail.com",
          password: "ownerPass1",
          role: "OWNER"
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "userName has been already exists");
    });

    test("fail post cause use existing email", async () => {
      await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest2",
          email: "ownerTest@mail.com",
          password: "ownerPass1",
          role: "OWNER"
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      const response = await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest3",
          email: "ownerTest@mail.com",
          password: "ownerPass1",
          role: "OWNER"
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "email has been already exists");
    });

    test("fail post cause bad password", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest",
          email: "ownerTest@mail.com",
          password: "ownerPass",
          role: "OWNER"
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Password must contain at least one number.");
    });
  });

  describe("POST /register-admin", () => {
    test("success post /register-admin", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
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
          role: "ADMIN"
        })
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("fail post /register-admin with existing userName", async () => {
      await request(app)
        .post("/api/users/register")
        .send({
          firstName: "admin",
          lastName: "Test",
          dateOfBirth: "1990-01-01",
          contact: "123456789",
          education: "Bachelor",
          address: "Admin Street",
          position: "MANAGER",
          salary: 500000,
          password: "adminPass1",
          email: "adminTest2@mail.com",
          storeId: 1,
          role: "ADMIN"
        })
        .set("Authorization", `Bearer ${ownerToken}`);

      const response = await request(app)
        .post("/api/users/register")
        .send({
          firstName: "admin",
          lastName: "Test",
          dateOfBirth: "1990-01-01",
          contact: "123456789",
          education: "Bachelor",
          address: "Admin Street",
          position: "MANAGER",
          salary: 500000,
          password: "adminPass1",
          email: "adminTest2@mail.com",
          storeId: 1,
          role: "ADMIN"
        })
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "userName has been already exists");
    });

    test("fail post /register-admin with existing email", async () => {
      await request(app)
        .post("/api/users/register")
        .send({
          firstName: "admin",
          lastName: "Test",
          dateOfBirth: "1990-01-01",
          contact: "123456789",
          education: "Bachelor",
          address: "Admin Street",
          position: "MANAGER",
          salary: 500000,
          password: "adminPass1",
          email: "adminTest3@mail.com",
          storeId: 1,
          role: "ADMIN"
        })
        .set("Authorization", `Bearer ${ownerToken}`);

      const response = await request(app)
        .post("/api/users/register")
        .send({
          firstName: "admin",
          lastName: "Test",
          dateOfBirth: "1990-01-01",
          contact: "123456789",
          education: "Bachelor",
          address: "Admin Street",
          position: "MANAGER",
          salary: 500000,
          password: "adminPass1",
          email: "adminTest3@mail.com",
          storeId: 1,
          role: "ADMIN"
        })
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "email has been already exists");
    });
  });
});
