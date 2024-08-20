import request from "supertest";
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
    // storeId => 1 name => john
  }),
  employeeToken: createToken({
    email: "employee1@mail.com",
    username: "employee1Pass",
    // storeId => 1 name => emily
  }),
  ownerToken2: createToken({
    email: "owner2@mail.com",
    username: "owner21",
  }),
});

describe("Employee Controller Tests", () => {
  console.time("Testing STORE time:");
  const {
    ownerToken,
    adminToken,
    employeeToken,
    managerToken,
    noStoreOwnerToken,
    ownerToken2,
  } = generateTokens();

  const employeeId = 4;

  describe("GET employees/:id", () => {
    it("success GET /employees/:id retreives the employee's own data", async () => {
      const response = await request(app)
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
    });

    it("success GET /employees/:id retrieves data for MANAGER/ADMIN with store access", async () => {
      const response = await request(app)
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
    });

    it("success GET /employees/:id retrieves data for store OWNER", async () => {
      const response = await request(app)
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
    });

    it("fail GET /employees/:id for roles without store access (ADMIN/OWNER/EMPLOYEE)", async () => {
      const response = await request(app)
        .get(`/api/employees/${employeeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "access denied");
    });

    it("fail GET /employees/:id, employee not found", async () => {
      const response = await request(app)
        .get("/api/employees/9999")
        .set("Authorization", `Bearer ${employeeToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Employee is not found");
    });
  });

  describe("PATCH employees/:id", () => {
    /*
        it('should update an employee', async () => {
          const response = await request(app)
            .patch(`/api/employees/${employeeId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Updated Name' });
          
          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('message', 'Employee updated successfully');
          expect(response.body.data).toHaveProperty('name', 'Updated Name');
        });
    
        it('should return 403 if attempting to update protected fields', async () => {
          const response = await request(app)
            .patch(`/api/employees/${employeeId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ StoreId: 123 }); // Fields yang dilindungi
          
          expect(response.status).toBe(403);
          expect(response.body).toHaveProperty('name', 'protected_field');
        });
    
        it('should return 404 if employee not found for update', async () => {
          const response = await request(app)
            .patch('/api/employees/9999') // ID yang tidak ada
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Another Update' });
          
          expect(response.status).toBe(404);
          expect(response.body).toHaveProperty('name', 'Not Found');
        });
        */
  });

  console.timeEnd("Testing STORE time:");
});
