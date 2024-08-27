const dotenv = require("dotenv");

dotenv.config();
// console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("DATABASE_URL_DEVELOPMENT:", process.env.DATABASE_URL_DEVELOPMENT);
// postgres://username:password@host:port/database_name


module.exports = {
  development: {
    "url": process.env.DEV_DATABASE_URL,
    "dialect": "postgres",
  },
  test: {
    "url": process.env.TEST_DATABASE_URL,
    "dialect": "postgres",
  },
  production: {
    "url": process.env.PROD_DATABASE_URL,
    "dialect": "postgres",
    "dialectOptions": {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
