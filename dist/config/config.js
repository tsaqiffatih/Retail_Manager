"use strict";
const dotenv = require('dotenv');
dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
module.exports = {
    development: {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": "postgres"
    },
    test: {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": "database_test",
        "host": process.env.DB_HOST,
        "dialect": "postgres"
    },
    production: {
        "use_env_variable": "DATABASE_URL",
        "dialect": "postgres",
        "dialectOptions": {
            ssl: {
                rejectUnauthorized: false,
            }
        }
    }
};
//# sourceMappingURL=config.js.map