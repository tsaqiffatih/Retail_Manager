import request from "supertest";
import app, { server } from "../app";
import sequelizeConnection from "../config/connection";
import { Sequelize } from "sequelize";
import { createToken } from "../helper/jsonWebToken";

// Helper function to delete the test database
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
    console.error("Error deleting database:", error);
  } finally {
    console.log("========== Test database deleted ==========");
    await sequelize.close();
  }
};



// Payloads and tokens for testing
const generateTokens = () => ({
  superAdminToken: createToken({
    email: "superAdmin@mail.com",
    username: "superAdmin",
  }),
  ownerToken: createToken({
    email: "owner1@mail.com",
    username: "owner1Pass",
  }),
  adminToken: createToken({
    email: "admin1@mail.com",
    username: "admin1Pass",
  }),
  employeeToken: createToken({
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
  const { superAdminToken, ownerToken, adminToken, employeeToken } =
    generateTokens();

    const closeServer = () => {
      return new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    };

  // Cleanup after all tests
  afterAll(async () => {
    await sequelizeConnection.close();
    // server.close();
    await closeServer()
    await deleteTestDatabase();
  }, 15000);

  // Test block for /login route
  describe("POST /login", () => {
    const loginData = (email: string, password: string) => ({
      email,
      password,
    });

    test("success post /login", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send(loginData("superAdmin@mail.com", "superAdminPass"));

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toHaveProperty("access_token", expect.any(String));
    });

    test("fail post /login with wrong email", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send(loginData("wrong@mail.com", "superAdminPass"));

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "email or password was wrong");
    });

    test("fail post /login with wrong password", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send(loginData("superAdmin@mail.com", "wrongPass"));

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "email or password was wrong");
    });
  });

  // Test block for /register-owner route
  describe("POST /register-owner", () => {
    const registerData = (
      userName: string,
      email: string,
      password: string
    ) => ({
      userName,
      email,
      password,
      role: "OWNER",
    });

    test("success post /register-owner", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send(registerData("ownerTest", "ownerTest@mail.com", "ownerPass1"))
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("fail post /register-owner with existing userName", async () => {
      await request(app)
        .post("/api/users/register")
        .send(registerData("ownerTest", "ownerTest@mail.com", "ownerPass1"))
        .set("Authorization", `Bearer ${superAdminToken}`);

      const response = await request(app)
        .post("/api/users/register")
        .send(registerData("ownerTest", "ownerTest2@mail.com", "ownerPass1"))
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "userName has been already exists"
      );
    });

    test("fail post /register-owner with existing email", async () => {
      await request(app)
        .post("/api/users/register")
        .send(registerData("ownerTest2", "ownerTest@mail.com", "ownerPass1"))
        .set("Authorization", `Bearer ${superAdminToken}`);

      const response = await request(app)
        .post("/api/users/register")
        .send(registerData("ownerTest3", "ownerTest@mail.com", "ownerPass1"))
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "email has been already exists"
      );
    });

    test("fail post /register-owner with weak password", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send(registerData("ownerTest", "ownerTest@mail.com", "ownerPass"))
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Password must contain at least one number."
      );
    });
  });

  // Test block for /register-admin route
  describe("POST /register-admin", () => {
    test("success post /register-admin", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send(bodyJsonAdmin1)
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("fail post /register-admin with existing userName", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
          ...bodyJsonAdmin1,
          email: "adminTest2@mail.com",
        })
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "userName has been already exists"
      );
    });

    test("fail post /register-admin with existing email", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
          ...bodyJsonAdmin1,
          firstName: "updatedAdmin",
          email: "adminTest@mail.com",
        })
        .set("Authorization", `Bearer ${ownerToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "email has been already exists"
      );
    });
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

    test("success post /register-employee", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send(employeeData)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("fail post /register-employee with existing email", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
          ...employeeData,
          firstName: "employeeUpdated",
        })
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "email has been already exists"
      );
    });

    test("fail post /register-employee with existing username", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({
          ...employeeData,
          email: "employee2Test@mail.com",
        })
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "userName has been already exists"
      );
    });
  });

  // Test block for /edit-user route
  describe("PATCH /edit-user", () => {
    const updatedUserData = {
      userName: "updatedEmployee",
      email: "employeeUpdated@mail.com",
      password: "EmployeeTest1",
    };

    const updatedToken = createToken({
      email: updatedUserData.email,
      username: updatedUserData.userName,
    });

    const updatedEmail = "partialupdate@mail.com"

    const updatedTokenSecond = createToken({
      email: updatedEmail,
      username: updatedUserData.userName
    })

    test("fail patch /edit-user with non-existent user ID", async () => {
      const response = await request(app)
        .patch("/api/users/999")
        .send(updatedUserData)
        .set("Authorization", `Bearer ${employeeToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "User is not found");
    });

    test("fail patch /edit-user with unauthorized access", async () => {
      const response = await request(app)
        .patch("/api/users/5")
        .send(updatedUserData)
        .set("Authorization", `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Forbidden Access");
    });

    test("fail patch /edit-user with invalid email format", async () => {
      const tokenPayload = createToken({email: "partialupdate@mail.com", username: "updatedName"})
      const response = await request(app)
        .patch("/api/users/6")
        .send({
          email: "invalid-email-format",
        })
        .set("Authorization", `Bearer ${employeeToken}`);
    
      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "Invalid Email Type");
    });

    test("fail patch /edit-user with short password", async () => {
      const response = await request(app)
        .patch("/api/users/6")
        .send({
          password: "short",
        })
        .set("Authorization", `Bearer ${employeeToken}`);
    
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "password must be at least 7 characters long");
    });

    test("fail patch /edit-user with weak password", async () => {
      const response = await request(app)
        .patch("/api/users/6")
        .send({
          password: "weakpass",
        })
        .set("Authorization", `Bearer ${employeeToken}`);

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Password must contain at least one uppercase letter. Password must contain at least one number."
      );
    });

    test("fail patch /edit-user with existing email", async () => {
      const response = await request(app)
        .patch("/api/users/6")
        .send({
          email: "employee2@mail.com",
        })
        .set("Authorization", `Bearer ${employeeToken}`);
    
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "email has been already exists");
    });

    test("fail patch /edit-user as unauthorized role", async () => {
      const response = await request(app)
        .patch("/api/users/6")
        .send({
          userName: "updatedName",
        })
        .set("Authorization", `Bearer ${adminToken}`);
    
      const { body, status } = response;
      expect(status).toBe(403);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "Forbidden Access");
    });

    test("success patch /edit-user", async () => {
      const response = await request(app)
        .patch("/api/users/6")
        .send(updatedUserData)
        .set("Authorization", `Bearer ${employeeToken}`);

      // expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Success update user data"
      );
    });

    test("success patch /edit-user with partial fields", async () => {
      const response = await request(app)
        .patch("/api/users/6")
        .send({
          email: updatedEmail,
        })
        .set("Authorization", `Bearer ${updatedToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Success update user data");
      expect(response.body.data).toHaveProperty("email", "partialupdate@mail.com");
    });

    test("success patch /edit-user with strong password", async () => {
      const tokenPayload = createToken({email: "partialupdate@mail.com", username: "updatedName"})
      const response = await request(app)
        .patch("/api/users/6")
        .send({
          password: "StrongPass1",
        })
        .set("Authorization", `Bearer ${updatedTokenSecond}`);
    
      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty("message", "Success update user data");
    });
  });
});
