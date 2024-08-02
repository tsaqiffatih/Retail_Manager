import express from "express";
import userRouter from './userRouter';

const router = express.Router()

router.use("/users", userRouter)
// router.use("/store" )

export default router