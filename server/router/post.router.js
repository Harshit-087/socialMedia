import express from "express"
import {createPost,allPost,showPosts,deletePost} from "../controllers/post.controller.js"
import {AuthMiddleware} from "../middleware/verifyjwt.js"
import cors from "cors"

const postRouter =express.Router();
postRouter.use(cors())

postRouter.post("/uploadPost",AuthMiddleware,createPost)
postRouter.get("/allposts",AuthMiddleware,allPost)
postRouter.get("/posts",showPosts)

postRouter.delete("/post",deletePost)

export default postRouter;