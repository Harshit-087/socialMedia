import express from "express"
import {findUser,fetchProfile} from "../controllers/user.controller.js"
import cors from "cors"

const userRouter =express.Router();
userRouter.use(cors())

userRouter.get("/user",findUser)

userRouter.get("/profile",fetchProfile)

export default userRouter;