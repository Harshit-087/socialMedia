import Story from "../models/stories.schema.js"
import {redis} from "../config/connection.js"
import {setCache,getCache} from "../services/redis/cache.js"

export const createStory = async(req,res)=>{
   const {userId,mediatype,url,public_url} =req.body;
   console.log("story reached ");
   
   // invalidate cache
   await redis.del(`story:${userId}`);
   try{
    const uploadStory = await Story.create({
        userId:userId,
        mediaUrl:public_url,
        secure_url:url,
        mediaType:mediatype,
    })
    return res.json({message:"created story",data:uploadStory})
   }catch(err){
    return res.json({message:"error in creating story",error:err.message})
   }
}

export const FetchStory = async(req,res)=>{
    const {id} = req.query;
  // fetching story for explore page
  const key = `story:${id}`;
  const cachedData = await getCache(key);
  if(cachedData) return res.status(200).json({msg:"success from cache story",data:cachedData})
    try{
        const fetchStory = await Story.find({userId:id});

        // set in the cache
        await setCache(key,fetchStory,600);

        return res.status(200).json({message:"successfully fetched story",data:fetchStory});

    }catch(error){
        console.log("error in fetching the story")
        return res.json({message:"internal server error",error:error.message})
    }
}