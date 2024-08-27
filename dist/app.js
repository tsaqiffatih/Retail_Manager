"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const routers_1 = __importDefault(require("./routers"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const connection_1 = __importDefault(require("./config/connection"));
const payrollScheduler_1 = require("./schedulers/payrollScheduler");
const attendanceScheduler_1 = require("./schedulers/attendanceScheduler");
// Load environment variables based on the environment
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
}
else {
    dotenv_1.default.config();
}
const app = (0, express_1.default)();
const port = process.env.APP_PORT || 3000;
const appName = process.env.APP_NAME;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", routers_1.default);
app.use(errorHandler_1.default);
app.get("/", (req, res) => {
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
        connection_1.default
            .sync()
            .then(() => {
            console.log("Database connected");
            (0, payrollScheduler_1.schedulePayrollCreation)();
            (0, payrollScheduler_1.schedulePayrollUpdate)();
            (0, attendanceScheduler_1.scheduleAttendanceCreation)();
        })
            .catch((err) => console.log("Error connecting to database:", err));
    });
}
exports.default = app;
//# sourceMappingURL=app.js.map