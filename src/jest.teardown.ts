import { Sequelize } from "sequelize";
// import { server } from "./app"; // Pastikan ini path yang benar ke file app.ts
import sequelizeConnection from "./config/connection";
import { sequelizeTest } from "./jest.setup";
// import { server } from "./app";

const deleteTestDatabase = async () => {
  try {
    await sequelizeTest.query("DROP DATABASE IF EXISTS database_test");
  } catch (error) {
    console.error("Error deleting database:", error);
  } finally {
    console.log("========== Test database deleted ==========");
    await sequelizeTest.close();
  }
};

// const closeServer = async () => {
//   return new Promise<void>((resolve) => {
//     if ((global as any).testServer) {
//       (global as any).testServer.close(() => {
//         console.log("Server closed");
//         resolve();
//       });
//     } else {
//       resolve();
//     }
//   });
// };


module.exports = async () => {
  console.log("======= Tearing down test database... =======");

  await sequelizeConnection.close();
  console.log("======== Success close sequelzieConnection ========");
  
  // await closeServer();
  console.log("======== Success close Server ========");

  await deleteTestDatabase();
  console.log("======== Success Delete database ========");

  console.log("========== Main database connection closed ==========");
};
