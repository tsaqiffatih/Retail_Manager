import express from "express";
import userRouter from './userRouter';
import storeRouter from './storeRouter'
import attendanceRouter from './attendanceRouter'

const router = express.Router()

router.use("/users", userRouter)
router.use("/stores", storeRouter)
router.use("/attendances", attendanceRouter)

export default router