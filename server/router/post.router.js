import express from "express"
import {updateSchema,allPost,showPosts} from "../controllers/post.controller.js"
import {AuthMiddleware} from "../middleware/verifyjwt.js"
import cors from "cors"

const postRouter =express.Router();
postRouter.use(cors())

postRouter.post("/uploadPost",AuthMiddleware,updateSchema)
postRouter.get("/allposts",AuthMiddleware,allPost)
postRouter.get("/posts",showPosts)



export default postRouter;