import request from 'supertest';
import app, { server } from '../app'; // Sesuaikan dengan path ke file utama aplikasi Anda
import sequelizeConnection from '../config/connection';
import { Sequelize } from "sequelize";

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
    // console.log("Error deleting database:", error);
  } finally {
    // console.log("========== Test database deleted ==========");
    await sequelize.close();
  }
};

describe('User Controller Tests', () => {
  
  afterAll(async () => {
    await sequelizeConnection.close();
    server.close();
    await deleteTestDatabase();
  }, 15000);

  describe('POST /login', () => {
    test('success post /login', async () => {
      const response = await request(app).post('/api/users/login').send({
        email: 'superAdmin@mail.com',
        password: 'superAdminPass',
      });

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('data', expect.any(String));
    });

    test('fail post /login with wrong email', async () => {
      const response = await request(app).post('/api/users/login').send({
        email: 'wrong@mail.com',
        password: 'superAdminPass',
      });

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'email or password was wrong');
    });

    test('fail post /login with wrong password', async () => {
      const response = await request(app).post('/api/users/login').send({
        email: 'superAdmin@mail.com',
        password: 'wrongPass',
      });

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'email or password was wrong');
    });
  });

  describe('POST /register-owner', () => {
    test('success post /register-owner', async () => {
      const response = await request(app).post('/api/users/register-owner').send({
        userName: 'ownerTest',
        email: 'ownerTest@mail.com',
        password: 'ownerPass',
      });

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', expect.any(String));
    });

    test('fail post /register-owner with existing email', async () => {
      const response = await request(app).post('/api/users/register-owner').send({
        userName: 'ownerTest',
        email: 'ownerTest@mail.com', // email yang sama dengan sebelumnya
        password: 'ownerPass',
      });

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'Email already in use');
    });
  });

  describe('POST /register-admin', () => {
    test('success post /register-admin', async () => {
      const response = await request(app).post('/api/users/register-admin').send({
        firstName: 'admin',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        contact: '123456789',
        education: 'Bachelor',
        address: 'Admin Street',
        position: 'Manager',
        salary: 5000,
        password: 'adminPass',
        email: 'adminTest@mail.com',
      });

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', expect.any(String));
    });

    test('fail post /register-admin with existing email', async () => {
      const response = await request(app).post('/api/users/register-admin').send({
        firstName: 'admin',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        contact: '123456789',
        education: 'Bachelor',
        address: 'Admin Street',
        position: 'Manager',
        salary: 5000,
        password: 'adminPass',
        email: 'adminTest@mail.com', // email yang sama dengan sebelumnya
      });

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'Email already in use');
    });
  });

  describe('POST /register-employee', () => {
    test('success post /register-employee', async () => {
      const response = await request(app).post('/api/users/register-employee').send({
        firstName: 'employee',
        lastName: 'Test',
        dateOfBirth: '1995-05-05',
        contact: '987654321',
        education: 'High School',
        address: 'Employee Street',
        position: 'Staff',
        salary: 3000,
        password: 'employeePass',
        email: 'employeeTest@mail.com',
      });

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', expect.any(String));
    });

    test('fail post /register-employee with existing email', async () => {
      const response = await request(app).post('/api/users/register-employee').send({
        firstName: 'employee',
        lastName: 'Test',
        dateOfBirth: '1995-05-05',
        contact: '987654321',
        education: 'High School',
        address: 'Employee Street',
        position: 'Staff',
        salary: 3000,
        password: 'employeePass',
        email: 'employeeTest@mail.com', // email yang sama dengan sebelumnya
      });

      const { body, status } = response;
      expect(status).toBe(400);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'Email already in use');
    });
  });

  describe('PUT /edit-user/:id', () => {
    test('success put /edit-user/:id', async () => {
      const response = await request(app)
        .put('/api/users/edit-user/1') // Sesuaikan dengan id yang ada di database
        .send({
          userName: 'updatedName',
          email: 'updated@mail.com',
          password: 'updatedPass',
        })
        .set('Authorization', `Bearer valid_token`); // Sesuaikan dengan token yang valid

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'Success update data');
    });

    test('fail put /edit-user/:id with unauthorized access', async () => {
      const response = await request(app)
        .put('/api/users/edit-user/1') // Sesuaikan dengan id yang ada di database
        .send({
          userName: 'updatedName',
          email: 'updated@mail.com',
          password: 'updatedPass',
        })
        .set('Authorization', `Bearer invalid_token`); // Sesuaikan dengan token yang tidak valid

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'access_denied');
    });
  });

  describe('DELETE /delete-user/:id', () => {
    test('success delete user /delete-user/:id', async () => {
      const response = await request(app)
        .delete('/api/users/delete-user/1') // Sesuaikan dengan id yang ada di database
        .set('Authorization', `Bearer valid_token`); // Sesuaikan dengan token yang valid

      const { body, status } = response;
      expect(status).toBe(200);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'User deleted successfully');
    });

    test('fail delete user /delete-user/:id with unauthorized access', async () => {
      const response = await request(app)
        .delete('/api/users/delete-user/1') // Sesuaikan dengan id yang ada di database
        .set('Authorization', `Bearer invalid_token`); // Sesuaikan dengan token yang tidak valid

      const { body, status } = response;
      expect(status).toBe(401);
      expect(body).toBeInstanceOf(Object);
      expect(body).toHaveProperty('message', 'Unauthorized Delete');
    });
  });
});
