import express from "express"
import {createStory,FetchStory} from "../controllers/story.controller.js"
const storyRouter = express.Router()

storyRouter.post("/create_story",createStory);

storyRouter.get("/mystory",FetchStory)

export default storyRouter;