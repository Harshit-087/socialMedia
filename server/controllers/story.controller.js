import Story from "../models/stories.schema.js"
import {redis} from "../config/connection.js"
import {setCache,getCache} from "../services/redis/cache.js"
import * as validator from "../validator/story.validator.js"
 
export const createStory = async(req,res)=>{
     try{   // 1. Validate input
    const validation = validator.createStorySchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        message: "validation error",
        error: validation.error.issues,
      })
    }

    const data = validation.data;
   
   // invalidate cache
   await redis.del(`story:${data.userId}`);
 
    const uploadStory = await Story.create(data)
    return res.status(201).json({message:"created story",data:uploadStory})
   }catch(err){
    return res.status(500).json({message:"error in creating story",error:err.message})
   }
}

export const FetchStory = async(req,res)=>{
    try{
     const validation = validator.fetchStorySchema.safeParse(req.query)

    if (!validation.success) {
      return res.status(400).json({
        message: "validation error",
        error: validation.error.issues,
      })
    }

    const {id} =validation.data;
  // fetching story for explore page
  const key = `story:${id}`;
  const cachedData = await getCache(key);
  if(cachedData) return res.status(200).json({msg:"success from cache story",data:cachedData})
    
        const fetchStory = await Story.find({userId:id}).populate("userId","username profileImage _id");

        // set in the cache
        await setCache(key,fetchStory,600);

        return res.status(200).json({message:"successfully fetched story",data:fetchStory});

    }catch(error){
        console.log("error in fetching the story")
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}