import express from "express"
import {createPost,allPost,showPosts,deletePost,CreateCommunityPost,communityPost,fetchCommunityPost} from "../controllers/post.controller.js"
import {AuthMiddleware} from "../middleware/verifyjwt.js"
import cors from "cors"

const postRouter =express.Router();
postRouter.use(cors())

postRouter.post("/uploadPost",AuthMiddleware,createPost)

postRouter.post("/create_post",AuthMiddleware,CreateCommunityPost)

postRouter.post("/communityPost",AuthMiddleware,communityPost)
postRouter.get("/communityPost",fetchCommunityPost)


postRouter.get("/allposts",AuthMiddleware,allPost)

postRouter.get("/posts",showPosts)

postRouter.delete("/post",deletePost)

export default postRouter;