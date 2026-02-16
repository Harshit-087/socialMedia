import express from "express"
import {followAccount,followingAccount,followers,followersAccounts,followedAccounts} from "../controllers/follow.controller.js"
import cors from "cors"

const followRouter =express.Router();
followRouter.use(cors())

followRouter.post("/follow",followAccount)
followRouter.get("/following",followingAccount)

followRouter.get("/followers",followers)

followRouter.get("/followersAccounts",followersAccounts)
followRouter.get("/followingAccounts",followedAccounts)

export default followRouter;