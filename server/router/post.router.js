import express from "express"
import {createPost,allPost,showPosts,deletePost,CreateCommunityPost,communityPost,fetchCommunityPost} from "../controllers/post.controller.js"

import cors from "cors"

const postRouter =express.Router();
postRouter.use(cors())

postRouter.post("/uploadPost",createPost)

postRouter.post("/create_post",CreateCommunityPost)

postRouter.post("/communityPost",communityPost)
postRouter.get("/communityPost",fetchCommunityPost)


postRouter.get("/allposts",allPost)

postRouter.get("/posts",showPosts)

postRouter.delete("/post",deletePost)

export default postRouter;