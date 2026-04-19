import Like from "../models/likes.schema.js"
import User from "../models/user.schema.js"
import Post from "../models/post.schema.js"
import mongoose from "mongoose"
import {redis } from "../config/connection.js"
import {setCache,getCache} from "../services/redis/cache.js"

export const createLike= async(req,res)=>{
    const {userId,Url} = req.body;
    if(!userId || !Url) return res.status(400).json({msg:"userid and url is required"})
    
     try{
        const alreadyLiked = await Like.exists({
        userId,
       postId: findPost._id
        });

     if (alreadyLiked) return res.status(400).json({ msg: "Already liked" });
   

    const findUser = await User.findOne({_id:userId});
    if(!findUser) return res.status(400).json({msg:"no user exist"});
    const findPost = await Post.findOne({media:{$elemMatch:{url:Url}}});

    console.log(JSON.stringify(findPost,null,2))

    const likeCreated=await Like.create({
        userId,
        postId:findPost._id
    })

     //fetching like  count from cache
        await redis.del(`likes_count`);
        const key = `my_likes:${userId}`;
        await redis.del(key);

    return res.json({msg:"like successfully",data: likeCreated});
   }catch(err){
    return res.status(500).json({msg:"server error in liking",error:err.message})
   }
    
}

export const deleteLike = async(req,res)=>{
    const {userId,url} = req.body;
   if(!userId || !url) return res.status(400).json({msg:"userid and url is required"})

   
    try{
   
    const findPost = await Post.findOne({media:{$elemMatch:{url:url}}});
    if (!findPost) {
  return res.status(404).json({ msg: "Post not found" });
}
    const findLikeDoc = await Like.deleteOne({
        //making userid (on right side) a objectid for comparision 
        userId:new mongoose.Types.ObjectId(userId),
        //postid are are objectid
        postId:findPost._id})

        // invalidate cache
   await redis.del(`likes_count`); 
  const key = `my_likes:${userId}`;
  await redis.del(key);

    return res.json({msg:"delete like doc  successfully"})

    }catch(err){
    return res.status(500).json({msg:"server error in liking",error:err.message})
   }
    
}





// all like created by all user --> used for showing count ..
export const getLikes= async(req,res)=>{

    //fetching like count from cache
    const key = "likes_count";
    const cachedData = await getCache(key);
    if(cachedData) return res.status(200).json({msg:"success from cache likes count",data:cachedData})

    try{

   // counting like using  .aggregrate() ,,get array of obj .
   //it group post
   const likesCount = await Like.aggregate([
    {
       $group:{
        _id:"$postId",   // group by postId
        count:{$sum:1}    // count likes in each group
       }
   }
  ])

  // set in cache
  await setCache("likes_count",likesCount,600)

   return res.json({msg:"getLikes response ",count:likesCount});
    }catch(error){
        console.log("error in counting likes",error)
        return res.status(500).json({msg:"server error",error:error.message})
    }
}





export const myLikes= async(req,res)=>{
    const {userId} = req.query;

    //fetched my like from cache
    const key = `my_likes:${userId}`;
    const cachedData = await getCache(key);
    if(cachedData) return res.status(200).json({msg:"success from cache my likes",data:cachedData})

    try{
    const fetchedMyLikes= await Like.find({ userId })
    .populate("userId","username email profileImage")

    // set in cache
    await setCache(key,fetchedMyLikes,600)

    return res.json({msg:"all your like images",data:fetchedMyLikes})
    }catch(err){
    return res.status(500).json({msg:"server error in liking",error:err.message})
   }
}