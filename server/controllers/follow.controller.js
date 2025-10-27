import Follow from "../models/following.schema.js"
import Follower from "../models/followers.schema.js"
import mongoose from "mongoose"

export const followAccount = async(req,res)=>{
     const {userid,accountId} =req.body;

     try{
        // user following

        
    const followAccount = await Follow.create({
        followId:new mongoose.Types.ObjectId(accountId), 
        userId:new mongoose.Types.ObjectId(userid)    
    })
     
    //user being followed
    const followerAccount=await Follower.create({
        userId:new mongoose.Types.ObjectId(accountId),  
        followerId:new mongoose.Types.ObjectId(userid)
    })


    return res.status(201).json({msg:"followed",data:followAccount})
   }catch(err){
    console.log("error in following",err)
    return res.status(500).json({msg:"internal server error",error:err.message})
   }
}

export const  followingAccount = async(req,res)=>{
    const {userid} =req.query;

    try{
        const getFollowing = await Follow.aggregate([
            {$match:{userId:new mongoose.Types.ObjectId(userid)}},
            {
            $group:{
                _id:"$followId",
                count:{$sum:1}
            }
        }])
        return res.status(200).json({msg:"fetching all following",data:getFollowing})
    }catch(err){
        console.log("error in fetching follwing",err)
        return res.status(500).json({error:err.message})
    }
}


export const followers = async(req,res)=>{
    const {userid} = req.query;

    try{

        const getFollower = await Follower.aggregate([
            {$match:{userId:new mongoose.Types.ObjectId(userid)}},
            {
                $group:{
                    _id:"$followerId",
                    count:{$sum:1}
                }
            }
        ])

        return res.status(200).json({msg:"fetched followers ",data:getFollower})
    }catch(error){
        console.log("error  in fetching followers",error)
        return res.status(500).json({msg:"internal server error",error:error.message})
    }
}