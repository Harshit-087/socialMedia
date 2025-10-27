import express from "express"


import {AuthMiddleware} from "../middleware/verifyjwt.js"
import userRouter from "./user.router.js"
import likeRouter from "./like.router.js"
import postRouter from "./post.router.js"
import commentRouter from "./comments.router.js"
import followRouter from "./follow.router.js"
import {Register,Signin} from "../controllers/user.controller.js"

import dotenv from "dotenv"
dotenv.config()

const router= express.Router()

router.use(express.json({limit:"10mb"}))
router.use(express.urlencoded({limit:"10mb",extended:true}))



router.post("/register",Register)

router.post("/signin",Signin)

router.use("/user-api",userRouter)

router.use("/like-api",likeRouter)

router.use("/comment-api",commentRouter)

router.use("/follow-api",followRouter)

router.use("/post-api",postRouter)

export default router

