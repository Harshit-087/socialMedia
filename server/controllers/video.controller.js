import Video from "../models/video.schema.js";
import mongoose from "mongoose";
import * as validator from "../validator/video.validator.js"
import {redis} from "../config/connection.js"
import {setCache,getCache} from "../services/redis/cache.js"

export const videoUploadController = async (req,res)=>{

    try{
        //validation 
        const validationResult = validator.createVideoSchema.safeParser(req.body);
        if(!validationResult.success){
            return res.status(400).json({msg:"validation error",error:validationResult.error.issues})
        }
        const data = validationResult.data;
           // invalidate
    await redis.del("all_videos");
     await redis.del("videos:${data.userId}")



          const newVideo = await Video.create({data}) 
    return res.status(200).json({msg:"video uploaded successfully",data:newVideo})

   }catch(error){
    console.log("error in video upload controller ",error);
    return res.status(500).json({msg:"internal server error",error:error.message})
   }
}

// user account videos
export const fetchVideos = async(req,res)=>{
     
    try{
         //validation 
        const validationResult = validator.fetchVideoSchema.safeParse(req.query);
        if(!validationResult.success){
            return res.status(400).json({msg:"validation error",error:validationResult.error.issues})
        }
        const {userId} = validationResult.data;
        const key = "video:${userId}";
         
        // fetch from  cache
        const cachedResponse = await getCache(key)
        if(cachedResponse){
            return res.status(200).json({msg:"success from  cache video",data:cachedResponse})
        }

        const videos = await Video.find({userId}).sort({createdAt:-1}).populate("userId","username profileImage _id")
        
        // set in  cache
        await setCache(key,videos,600)
        
        return res.status(200).json({msg:"fetched videos successfully",data:videos})
    }catch(error){
        console.log("error in fetching videos",error);
        return res.status(500).json({msg:"internal server error",error:error.message})
    }
}

export const  fetchAllVideos  = async(req,res)=>{
     try{
        const key="all_videos";
        const cachedResponse = await getCache(key)
        if(cachedResponse){
            return res.status(200).json({msg:"success from  cache  all video",data:cachedResponse})
        }

        const allVideos = await Video.find().sort({createdAt:-1}).populate("userId","profileImage username _id");
        
        //set cache
        await setCache(key,allVideos,600)
       
        return res.json({msg:"fetched all videos successfully",data:allVideos})

     }catch(error){
        console.log("failed  to fetch video",error);
        return res.json({msg:"internal server error",error:error.message});
     }
} 