import express from "express"
import {commentStore,fetchingComment} from "../controllers/comment.controller.js"
import cors from "cors"

const commentRouter =express.Router();
commentRouter.use(cors())

commentRouter.post("/comment",commentStore)
commentRouter.get("/allcomments",fetchingComment)




export default commentRouter;