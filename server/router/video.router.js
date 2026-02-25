import express from "express";
import {videoUploadController,fetchVideos,fetchAllVideos} from "../controllers/video.controller.js"

const videoRouter= express.Router();

videoRouter.post("/uploadVideo",videoUploadController)
videoRouter.get("/userVideo",fetchVideos)
videoRouter.get("/allVideos",fetchAllVideos)

export default videoRouter;