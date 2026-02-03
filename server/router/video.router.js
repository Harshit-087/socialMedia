import express from "express";
import {videoUploadController,fetchVideos} from "../controllers/video.controller.js"

const videoRouter= express.Router();

videoRouter.post("/uploadVideo",videoUploadController)
videoRouter.get("/userVideo",fetchVideos)

export default videoRouter;