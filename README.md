

# Retail Manager Backend

A comprehensive backend system for managing retail stores, employees, attendance, payroll, and more. Built using Node.js, Express, and Sequelize with TypeScript, this project features role-based access control (RBAC) for users with roles like Admin, Owner, Manager, and Employee.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/Retail_Manager.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Copy the `.env.example` file to `.env` and configure the required variables.

   ```bash
   cp .env.example .env
   ```
4. Run database create:

   ```bash
   npx sequelize-cli db:create
   ```

5. Run database migrations:

   ```bash
   npx sequelize-cli db:migrate
   ```

6. Seed the database (optional):

   ```bash
   npx sequelize-cli db:seed:all
   ```

## Usage

To start the development server, run:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

## Project Structure

```
RETAIL_MANAGER/
│
├── dummy/                     # Dummy data for seeding and testing
│   ├── attendance.json
│   ├── auditLog.json
│   ├── employee.json
│   ├── payroll.json
│   ├── store.json
│   └── user.json
│
├── node_modules/               # Node.js modules
│
├── src/
│   ├── config/                 # Configuration and database connection files
│   ├── controllers/            # Request handling logic
│   ├── helper/                 # Utility functions
│   ├── interface/              # TypeScript interfaces
│   ├── middleware/             # Express middleware (auth, error handling,audit)
│   ├── migrations/             # Sequelize migration files
│   ├── models/                 # Sequelize models for the database
│   ├── routers/                # Route handlers
│   ├── schedulers/             # Scheduling logic (e.g., payroll, attendance)
│   ├── seeders/                # Sequelize seed files
│   ├── tests/                  # Jest test files
│   ├── app.ts                  # Main application entry point
│   └── jest.setup.ts           # Jest global setup file
│
├── .env.example                # Example environment configuration
├── .gitignore                  # Git ignore file
├── .sequelizerc                # Sequelize configuration
├── package-lock.json           # NPM package lock file
├── package.json                # Node.js dependencies and scripts
├── payloadUser.md              # Authentication documentation
├── README.md                   # Project documentation
├── structures.md               # Documentation of project structure
└── tsconfig.json               # TypeScript configuration
```

## Environment Variables

The following environment variables are required to run the application:

- `NODE_ENV`: Application environment (`development`, `production`, `test`)
- `SECRET`: Secret key for JWT authentication
- `APP_NAME`: Aplication name will show in log terminal
- `APP_PORT`: Port for the Express server (default: 3000)
- `DEV_DATABASE_URL`: Database URL for development
- `TEST_DATABASE_URL`: Database URL for test
- `PROD_DATABASE_URL`: Database URL for production

## API Documentation

API documentation for this backend system is available on Postman. You can view the full documentation at the following link:

[Retail Manager API Documentation](https://documenter.getpostman.com/view/33860218/2sA3s7iULM)


## Testing

To run tests, execute:

```bash
npm test
```

This application uses Jest for testing. All test files are located in the `src/tests` directory.

## Features

- **Role-Based Access Control (RBAC)**: Different roles (Admin, Owner, Manager, Employee) with different levels of access.
- **Comprehensive API**: Manage users, stores, employees, attendance, and payroll.
- **Automatic Payroll Creation**: Default payroll status is set to UNPAID and amount is set from sallary in Employee field at the start of each month
- **Automatic Payroll Processing**: Payroll calculations based on attendance data.
- **Daily Attendance Creation**: Default attendance status is set to 'Absent' at the start of each day.

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the ISC License.
