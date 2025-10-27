import express from "express"
import {createLike,deleteLike,getLikes,myLikes} from "../controllers/like.controller.js"
import {AuthMiddleware} from "../middleware/verifyjwt.js"
import cors from "cors"

const likeRouter =express.Router();
likeRouter.use(cors())

likeRouter.post("/like",AuthMiddleware,createLike)
likeRouter.post("/deletelike",AuthMiddleware,deleteLike)
likeRouter.get("/getLikes",getLikes)
likeRouter.get("/myLikes",myLikes)



export default likeRouter;