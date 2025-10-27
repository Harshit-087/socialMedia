import express from "express"
import {followAccount,followingAccount,followers} from "../controllers/follow.controller.js"
import cors from "cors"

const followRouter =express.Router();
followRouter.use(cors())

followRouter.post("/follow",followAccount)
followRouter.get("/following",followingAccount)

followRouter.get("/followers",followers)



export default followRouter;