import request from "supertest";
import app, { server } from "../app";
import sequelizeConnection from "../config/connection";
import { Sequelize } from "sequelize";
import { createToken } from "../helper/jsonWebToken";

const deleteTestDatabase = async () => {
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

  try {
    await sequelize.query("DROP DATABASE IF EXISTS database_test");
  } catch (error) {
    console.log("Error deleting database:", error);
  } finally {
    console.log("========== Test database deleted ==========");
    await sequelize.close();
  }
};

describe("User Controller Tests", () => {
  // Simulated payloads for different roles
  const superAdminPayload = {
    email: "superAdmin@mail.com",
    username: "superAdmin",
  };
  const ownerPayload = { email: "owner1@mail.com", username: "owner1Pass" };
  const adminPayload = { email: "admin1@mail.com", username: "admin1Pass" };
  const employeePayload = {
    email: "employee1@mail.com",
    username: "employee1Pass",
  };

  // Generate tokens for different roles
  const superAdminToken = createToken(superAdminPayload);
  const ownerToken = createToken(ownerPayload);
  const adminToken = createToken(adminPayload);
  const employeeToken = createToken(employeePayload);

  afterAll(async () => {
    await sequelizeConnection.close();
    server.close();
    await deleteTestDatabase();
  }, 15000);

  describe("POST /login", () => {
    test("success post /login", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "superAdmin@mail.com",
        password: "superAdminPass",
      });

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("access_token", expect.any(String));
    });

    test("fail post /login with wrong email", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "wrong@mail.com",
        password: "superAdminPass",
      });

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "email or password was wrong");
    });

    test("fail post /login with wrong password", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "superAdmin@mail.com",
        password: "wrongPass",
      });

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "email or password was wrong");
    });
  });

  describe("POST /register-owner", () => {
    test("success post", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest",
          email: "ownerTest@mail.com",
          password: "ownerPass1",
          role: "OWNER",
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
          role: "OWNER",
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      const response = await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest",
          email: "ownerTest2@mail.com",
          password: "ownerPass1",
          role: "OWNER",
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "userName has been already exists"
      );
    });

    test("fail post cause use existing email", async () => {
      await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest2",
          email: "ownerTest@mail.com",
          password: "ownerPass1",
          role: "OWNER",
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      const response = await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest3",
          email: "ownerTest@mail.com",
          password: "ownerPass1",
          role: "OWNER",
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "email has been already exists"
      );
    });

    test("fail post cause bad password", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
          userName: "ownerTest",
          email: "ownerTest@mail.com",
          password: "ownerPass",
          role: "OWNER",
        })
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Password must contain at least one number."
      );
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
          role: "ADMIN",
        })
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("fail post /register-admin with existing userName", async () => {
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
          role: "ADMIN",
        })
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "userName has been already exists"
      );
    });

    test("fail post /register-admin with existing email", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
          firstName: "admin12",
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
        })
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "email has been already exists"
      );
    });
  });
  
  describe("POST /register-employee", () => {
    test("success post /register-employee", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
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
        })
        .set("Authorization", `Bearer ${adminToken}`);

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", expect.any(String));
    });

    test("fail post cause existing email", async () => {
      
      const response = await request(app)
        .post("/api/users/register")
        .send({
          firstName: "employee",
          lastName: "Test2",
          dateOfBirth: "1995-05-05",
          contact: "987654321",
          education: "High School",
          address: "Employee Street",
          position: "Staff",
          salary: 3000,
          password: "employeePass1",
          email: "employeeTest@mail.com",
        })
        .set("Authorization", `Bearer ${adminToken}`);

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "email has been already exists");
    });

    test("fail post cause existing username", async () => {
      
      const response = await request(app)
        .post("/api/users/register")
        .send({
          firstName: "employee",
          lastName: "Test",
          dateOfBirth: "1995-05-05",
          contact: "987654321",
          education: "High School",
          address: "Employee Street",
          position: "Staff",
          salary: 3000,
          password: "employeePass1",
          email: "employee2Test@mail.com",
        })
        .set("Authorization", `Bearer ${adminToken}`);

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "userName has been already exists");
    });
  });

  describe("PATCH /edit-user", () => {
    test("success patch /edit-user", async () => {
      
      const response = await request(app)
        .patch("/api/users/6")
        .send({
          userName: "updatedName",
          email: "updated@mail.com",
          password: "updatedPass1",
        })
        .set("Authorization", `Bearer ${employeeToken}`);

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "Success update user data");
    });

    test("fail patch /edit-user with unauthorized access", async () => {
      const response = await request(app)
        .patch("/api/users/1") 
        .send({
          userName: "updatedName",
          email: "updated@mail.com",
          password: "updatedPass",
        })
        .set("Authorization",`Bearer ${ownerToken}`);

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "access denied");
    });
  });
/*
  describe("DELETE /delete-user", () => {
    test("success delete /delete-user", async () => {
      
      const response = await request(app)
        .delete("/api/users/delete-user/1") // Sesuaikan dengan id yang ada di database
        .set("Authorization", `Bearer ${superAdminToken}`);

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "User successfully deleted");
    });

    test("fail delete /delete-user with unauthorized access", async () => {
      
      const response = await request(app)
        .delete("/api/users/delete-user/1") // Sesuaikan dengan id yang ada di database
        .set("Authorization", `Bearer ${employeeToken}`);

      const { body, status } = response;
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty(
        "message",
        "You do not have permission to delete this user"
      );
    });
  });
  */
});
