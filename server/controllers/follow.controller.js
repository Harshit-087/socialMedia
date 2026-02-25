
import Follow from "../models/follow.schema.js"
import mongoose from "mongoose"

export const followAccount = async(req,res)=>{
     const {userid,accountId} =req.body;
  
     try{
        // user following
  
     const isFollowed = await Follow.exists({
         followingId:new mongoose.Types.ObjectId(accountId), 
        followerId:new mongoose.Types.ObjectId(userid) 
     })      
     if(isFollowed) return ;
       
    const followAccount = await Follow.create({
        followingId:new mongoose.Types.ObjectId(accountId), 
        followerId:new mongoose.Types.ObjectId(userid)    
    })
    

    return res.status(201).json({msg:"followed",data:followAccount})
   }catch(err){
    console.log("error in following",err)
    return res.status(500).json({msg:"internal server error",error:err.message})
   }
}

export const  followingAccount = async(req,res)=>{
    const {id ,userid} =req.query;

    try{
        const following = await Follow.aggregate([
            {$match:{followerId :new mongoose.Types.ObjectId(id)}},   // i am following account 
            {
                  $group:{
                    _id:"$followingId",
                    count : {$sum:1}
                  }
            }
        ])

        const followers = await Follow.aggregate([
            {$match:{followingId:new mongoose.Types.ObjectId(id)}},     // i am being followed
            {
                 $group:{
                    _id:"$followerId",
                    count:{$sum:1}
                 }
            }  
        ])

        const isFollowing = await Follow.exists({
             followerId:userid,
             followingId:id
        })

        return res.status(200).json({msg:"fetching all following",data:{following,followers,isFollowing:!!isFollowing}})
    }catch(err){
        console.log("error in fetching follwing",err)
        return res.status(500).json({error:err.message})
    }
}


export const followers = async(req,res)=>{
    const {userid} = req.query;

    try{

        const getFollower = await Follow.aggregate([
            {$match:{followingId:new mongoose.Types.ObjectId(userid)}},  // the account in which i am beig followed
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

export const followersAccounts = async(req,res)=>{
    const {id} = req.query;
    try{
        const followerAccounts = await Follow.find({followingId:id}).populate("followerId","profileImage username _id")
        // console.log("followerAccount leeeeellee",followerAccounts)
        return res.status(200).json({msg:"fetched follower accounts",data:followerAccounts})
    }catch(error){
        console.log("error in fetching follower accounts",error)
        return res.status(500).json({msg:"internal server error",error:error.message})
    }
}

export const followedAccounts = async(req,res)=>{
    const {id} = req.query;
    try{
      
        const followedAccounts = await Follow.find({followerId:id}).populate("followingId","profileImage username _id")
    //   console.log("followedAccount leeeeellee",followedAccounts)
        return res.status(200).json({msg:"fetched followed accounts",data:followedAccounts})
    }catch(error){
        console.log("error in fetching followed accounts",error)
        return res.status(500).json({msg:"internal server error",error:error.message})
    }
}