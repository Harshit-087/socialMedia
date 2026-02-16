import express from "express"
import {sendMessage} from "../controllers/message.controller.js"

const messageRouter = express.Router()

messageRouter.get("/send-messages",sendMessage)

export default messageRouter;