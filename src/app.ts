import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers";
import errorHandler from "./middleware/errorHandler";
import sequelizeConnection from "./config/connection";
import portfinder from "portfinder";
import {
  schedulePayrollCreation,
  schedulePayrollUpdate,
} from "./schedulers/payrollScheduler";
import { scheduleAttendanceCreation } from "./schedulers/attendanceScheduler";

// Load environment variables based on the environment
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
} else {
  dotenv.config();
}

const app = express();
const port = process.env.APP_PORT || 3000;
const appName = process.env.APP_NAME;

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// export const server = app.listen(port, () => {
//   console.log(`Example app for ${appName} listening on port ${port}`);
//   sequelizeConnection
//     .sync()
//     .then(() => {
//       console.log("Database synced successfully.");

//       schedulePayrollCreation();
//       schedulePayrollUpdate();
//       scheduleAttendanceCreation()
//     })
//     .catch((err) => {
//       console.error("Error syncing database:", err);
//     });
// });

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Example app for ${appName} listening on port ${port}`);
    sequelizeConnection
      .sync()
      .then(() => {
        console.log("Database connected");
        schedulePayrollCreation();
        schedulePayrollUpdate();
        scheduleAttendanceCreation();
      })
      .catch((err) => console.log("Error connecting to database:", err));
  });
}

export default app;
