import Post from "../models/post.schema.js"
import Comment from "../models/comments.schema.js"
import mongoose from "mongoose"
import {redis} from "../config/connection.js"
import {setCache,getCache} from "../services/redis/cache.js"
 
export const commentStore = async(req,res)=>{
    const {value,userid,data}=req.body;
    //invalidate cache
    await redis.del(`comments:${data}`);

  try{
    const gettingPost = await Post.findOne({media:{$elemMatch:{url:data}}})
    const createdComment = await Comment.create({
        userId:new mongoose.Types.ObjectId(userid),
        postId:gettingPost._id,
        Data:value,
        parentId: null
    })

    return res.status(201).json({msg:"created the comment sucessfully",data:createdComment})
  }catch(error){
    console.log("error in creating a comment",error)
    return res.status(500).json({msg:"unsucessfull in creating comment",error:error.message})
  }
    
}


export const fetchingComment = async(req,res)=>{
    const {value}  = req.query;
   // fetching comments from cache
   const key = `comments:${value}`;
   const cachedData = await getCache(key);
   if(cachedData) return res.status(200).json({msg:"success from cache comments",data:cachedData});

    try{
    const gettingPost = await Post.findOne({media:{$elemMatch:{url:value}}})
    // console.log("getting post for comment",gettingPost)
    const existedComments = await Comment.find({postId:new mongoose.Types.ObjectId(gettingPost._id)})
      .populate("postId","_id")
      .populate("userId","username profileImage")
      .sort({createdAt:-1})
     

      // //set in the cache
      await setCache(key,existedComments,600);

    return res.status(200).json({msg:"fetched comments successfully",data:existedComments})
    }catch(error){
        console.log("error in fetching post",error)
        return res.status(500).json({msg:"unsuccessfull comments fetching ",error:error.message})
    }
}