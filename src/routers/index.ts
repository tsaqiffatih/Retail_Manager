import express from "express";
import userRouter from './userRouter';
import storeRouter from './storeRouter'

const router = express.Router()

router.use("/users", userRouter)
router.use("/stores", storeRouter)

export default router