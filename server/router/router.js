import express from "express"


import {AuthMiddleware} from "../middleware/verifyjwt.js"
import userRouter from "./user.router.js"
import likeRouter from "./like.router.js"
import postRouter from "./post.router.js"
import commentRouter from "./comments.router.js"
import followRouter from "./follow.router.js"
import {Register,Signin,updatePassword} from "../controllers/user.controller.js"
import videoRouter from "./video.router.js"
import dotenv from "dotenv"
import messageRouter from "./message.router.js"
import storyRouter from "./story.router.js"
import communityRouter from "./community.router.js"
import {hydrateAccessToken} from "../controllers/token.controller.js"
dotenv.config()
import {apiLimiter,authLimiter} from "../middleware/ratelimiter.js"
import client from "prom-client"

const router= express.Router()

router.use(express.json({limit:"10mb"}))
router.use(express.urlencoded({limit:"10mb",extended:true}))

router.use("/uploads",express.static("uploads"))

// public routes
router.post("/register", authLimiter, Register)
router.post("/signin", authLimiter, Signin)
router.put("/update-password",updatePassword)
// apply global limiter
router.use(apiLimiter)
router.use(AuthMiddleware)  // all routes below this line are protected routes
// hydrating the access token
router.post("/refresh",hydrateAccessToken)

// protected + grouped routes
router.use("/like-api", likeRouter)

router.use("/user-api", userRouter)
router.use("/post-api", postRouter)
router.use("/comment-api", commentRouter)
router.use("/follow-api", followRouter)
router.use("/video-api", videoRouter)
router.use("/message-api", messageRouter)
router.use("/story-api", storyRouter)
router.use("/community-api", communityRouter)


export default router

