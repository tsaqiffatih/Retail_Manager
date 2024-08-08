import express from "express";
import userRouter from './userRouter';
import storeRouter from './storeRouter'
import employeeRouter from './employeeRouter'
import payrollRouter from './payrollRouter'
import attendanceRouter from './attendanceRouter'

const router = express.Router()

router.use("/users", userRouter)
router.use("/stores", storeRouter)
router.use("/employees", employeeRouter)
router.use("/attendances", attendanceRouter)
router.use("/payrolls", payrollRouter)

export default router