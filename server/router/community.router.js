import express from "express"
import {createCommunity,fetchMyCommunity,fetchAllCommunity,openCommunity,addMembers,deleteCommunity,fetchjoinedCommunity} from "../controllers/community.controller.js"
import cors from "cors"

const communityRouter =express.Router();

communityRouter.post("/create",createCommunity);

communityRouter.get("/fetch_myCommunity",fetchMyCommunity);

communityRouter.get("/fetch_allCommunity",fetchAllCommunity);
communityRouter.get("/openCommunity",openCommunity)

communityRouter.post("/join_community",addMembers)
communityRouter.post("/delete_community",deleteCommunity)

communityRouter.get("/joined_community",fetchjoinedCommunity)

export default communityRouter;