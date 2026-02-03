import Video from "../models/video.schema.js";
import mongoose from "mongoose";

export const videoUploadController = async (req,res)=>{
    const {userId,caption,secure_url,public_id} = req.body;
    console.log("video upload controller called with ",req.body);
    try{
          const newVideo = await Video.create({
        userId,
        caption,
        url:secure_url,
        publicId:public_id
    }) 
    return res.status(200).json({msg:"video uploaded successfully",data:newVideo})

   }catch(error){
    console.log("error in video upload controller ",error);
    return res.status(500).json({msg:"internal server error",error:error.message})
   }
}

export const fetchVideos = async(req,res)=>{
    const {id} =req.query;
    try{
        const videos = await Video.find({userId:new mongoose.Types.ObjectId(id)}).sort({createdAt:-1}).populate("userId","username profileImage _id")
        return res.status(200).json({msg:"fetched videos successfully",data:videos})
    }catch(error){
        console.log("error in fetching videos",error);
        return res.status(500).json({msg:"internal server error",error:error.message})
    }
}