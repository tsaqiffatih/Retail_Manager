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
  manager3: createToken({
    email: "managerBoss21@mail.com",
    username: "managerBoss21",
  }),
});

describe("Employee Controller Tests", () => {
  console.time("Testing Employee time:");
  const {
    ownerToken,
    adminToken,
    employeeToken,
    managerToken,
    noStoreOwnerToken,
    ownerToken2,
    manager3,
    superAdminToken
  } = generateTokens();

  const payrollId = 8;
  const updatedPayroll = 7;

  describe("PATCH payrolls/:id", () => {
    test("fail PATCH /payrolls/:id for role EMPLOYEE", async () => {
      const response = await request(app)
        .patch(`/api/payrolls/${payrollId}`)
        .send({ payrollId: "Paid" })
        .set("Authorization", `Bearer ${employeeToken}`)

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden Access"
      );
    });

    test("fail PATCH /payrolls/:id for payroll not found", async () => {
      const response = await request(app)
        .patch(`/api/payrolls/999`)
        .send({ status: "PAID" })
        .set("Authorization", `Bearer ${ownerToken}`)

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Payroll is not found");
    });

    test('fail PATCH /payrolls/:id for role EMPLOYEE', async () => {
      const response = await request(app)
        .patch(`/api/payrolls/${payrollId}`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({status:"UNPAID", amount: 15000000 });
  
      expect(response.status).toBe(403); 
      expect(response.body.message).toBe('Forbidden Access');
    });

    test('fail PATCH /payrolls/:id for unauthorized user to update payroll', async () => {
      const response = await request(app)
        .patch(`/api/payrolls/${payrollId}`)
        .set('Authorization', `Bearer ${noStoreOwnerToken}`)
        .send({ amount: 1500000 });
  
      expect(response.status).toBe(401); 
      expect(response.body.message).toBe('access denied');
    });

    test('fail PATCH /payrolls/:id for no fields to update', async () => {
      const response = await request(app)
        .patch(`/api/payrolls/${payrollId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({}); // No fields to update
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No fields to update found');
    });

    test("success PATCH /payrolls/:id field status for role MANAGER/ADMIN with store access", async () => {
      const response = await request(app)
        .patch(`/api/payrolls/${payrollId}`)
        .set("Authorization", `Bearer ${managerToken}`)
        .send({ status: "PAID" ,amount: 2000000});

      // expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Payroll updated successfully"
      );
      expect(response.body.data);
    });

    test("success PATCH /payrolls/:id field status for role OWNER with store access", async () => {
      const response = await request(app)
        .patch(`/api/payrolls/${payrollId}`)
        .set("Authorization", `Bearer ${ownerToken}`)
        .send({ status: "PAID",amount: 4000000 });

      // expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        "Payroll updated successfully"
      );
      expect(response.body.data);
    });
    
  });

  describe("GET payrolls/report", () => {

    test('success GET /payrolls/report for role OWNER own store', async () => {
      const response = await request(app)
        .get('/api/payrolls/report')
        .set('Authorization', `Bearer ${ownerToken}`)
        .query({ startDate: '2024-08-01', endDate: '2024-08-31' });
  
      // expect(response.status).toBe(200);
      expect(response.body.message).toBe('Payroll report generated successfully');
      expect(response.body.data).toBeInstanceOf(Array);
  
      if (response.body.data.length > 0) {
        const firstRecord = response.body.data[0];
        expect(firstRecord).toHaveProperty('id');
        expect(firstRecord).toHaveProperty('date');
        expect(firstRecord).toHaveProperty('status');
        expect(firstRecord).toHaveProperty('EmployeeId');
        expect(firstRecord).toHaveProperty('createdAt');
        expect(firstRecord).toHaveProperty('updatedAt');
        expect(firstRecord).toHaveProperty('employee');
  
        const employee = firstRecord.employee;
        expect(employee).toHaveProperty('id');
        expect(employee).toHaveProperty('firstName');
        expect(employee).toHaveProperty('lastName');
        expect(employee).toHaveProperty('dateOfBirth');
        expect(employee).toHaveProperty('contact');
        expect(employee).toHaveProperty('education');
        expect(employee).toHaveProperty('address');
        expect(employee).toHaveProperty('position');
        expect(employee).toHaveProperty('salary');
        expect(employee).toHaveProperty('UserId');
        expect(employee).toHaveProperty('StoreId');
        expect(employee).toHaveProperty('store');
  
        const store = employee.store;
        expect(store).toHaveProperty('id');
        expect(store).toHaveProperty('name');
        expect(store).toHaveProperty('location');
        expect(store).toHaveProperty('category');
        expect(store).toHaveProperty('code');
        expect(store).toHaveProperty('OwnerId');
      }
    });

    test('success GET /payrolls/report for role ADMIN with store access', async () => {
      const response = await request(app)
        .get('/api/payrolls/report')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ startDate: '2024-08-01', endDate: '2024-08-31' });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Payroll report generated successfully');
      expect(response.body.data).toBeInstanceOf(Array);
  
      if (response.body.data.length > 0) {
        const firstRecord = response.body.data[0];
        expect(firstRecord).toHaveProperty('id');
        expect(firstRecord).toHaveProperty('date');
        expect(firstRecord).toHaveProperty('status');
        expect(firstRecord).toHaveProperty('EmployeeId');
        expect(firstRecord).toHaveProperty('createdAt');
        expect(firstRecord).toHaveProperty('updatedAt');
        expect(firstRecord).toHaveProperty('employee');
  
        const employee = firstRecord.employee;
        expect(employee).toHaveProperty('id');
        expect(employee).toHaveProperty('firstName');
        expect(employee).toHaveProperty('lastName');
        expect(employee).toHaveProperty('dateOfBirth');
        expect(employee).toHaveProperty('contact');
        expect(employee).toHaveProperty('education');
        expect(employee).toHaveProperty('address');
        expect(employee).toHaveProperty('position');
        expect(employee).toHaveProperty('salary');
        expect(employee).toHaveProperty('UserId');
        expect(employee).toHaveProperty('StoreId');
        expect(employee).toHaveProperty('store');
  
        const store = employee.store;
        expect(store).toHaveProperty('id');
        expect(store).toHaveProperty('name');
        expect(store).toHaveProperty('location');
        expect(store).toHaveProperty('category');
        expect(store).toHaveProperty('code');
        expect(store).toHaveProperty('OwnerId');
      }
    });

    test('success GET /payrolls/report for role MANAGER with store access ', async () => {
      const response = await request(app)
        .get('/api/payrolls/report')
        .set('Authorization', `Bearer ${managerToken}`)
        .query({ startDate: '2024-08-01', endDate: '2024-08-31' });
  
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Payroll report generated successfully');
      expect(response.body.data).toBeInstanceOf(Array);
  
      if (response.body.data.length > 0) {
        const firstRecord = response.body.data[0];
        expect(firstRecord).toHaveProperty('id');
        expect(firstRecord).toHaveProperty('date');
        expect(firstRecord).toHaveProperty('status');
        expect(firstRecord).toHaveProperty('EmployeeId');
        expect(firstRecord).toHaveProperty('createdAt');
        expect(firstRecord).toHaveProperty('updatedAt');
        expect(firstRecord).toHaveProperty('employee');
  
        const employee = firstRecord.employee;
        expect(employee).toHaveProperty('id');
        expect(employee).toHaveProperty('firstName');
        expect(employee).toHaveProperty('lastName');
        expect(employee).toHaveProperty('dateOfBirth');
        expect(employee).toHaveProperty('contact');
        expect(employee).toHaveProperty('education');
        expect(employee).toHaveProperty('address');
        expect(employee).toHaveProperty('position');
        expect(employee).toHaveProperty('salary');
        expect(employee).toHaveProperty('UserId');
        expect(employee).toHaveProperty('StoreId');
        expect(employee).toHaveProperty('store');
  
        const store = employee.store;
        expect(store).toHaveProperty('id');
        expect(store).toHaveProperty('name');
        expect(store).toHaveProperty('location');
        expect(store).toHaveProperty('category');
        expect(store).toHaveProperty('code');
        expect(store).toHaveProperty('OwnerId');
      }
    });

    test('fail GET /payrolls/report for role EMPLOYEE', async () => {
      const response = await request(app)
        .get('/api/payrolls/report')
        .set('Authorization', `Bearer ${employeeToken}`)
        .query({ startDate: '2024-08-01', endDate: '2024-08-31' }); 
  
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Forbidden Access');
    });
  
    test('fail GET /payrolls/report for invalid status value', async () => {
      const response = await request(app)
        .get('/api/payrolls/report')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .query({ startDate: '2024-08-01', endDate: '2024-08-31', status: 'InvalidStatus' });
  
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status value. Allowed values are PAID or UNPAID.');
    });
  
    test('fail GET /payrolls/report for no payroll records found', async () => {
      const response = await request(app)
        .get('/api/payrolls/report')
        .set('Authorization', `Bearer ${noStoreOwnerToken}`)
        .query({ startDate: '3000-01-01', endDate: '3000-01-31' });
  
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('No payroll records found');
    });

    test('fail GET /payrolls/report for no token set in headers', async () => {
      const response = await request(app)
        .get('/api/payrolls/report')
        .set('Authorization', `Bearer 13751375176163271637616`)
        .query({ startDate: '3000-01-01', endDate: '3000-01-31' });
  
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid Token');
    });
    
  });

  console.timeEnd("Testing Employee time:");
});
