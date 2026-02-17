import Post from "../models/post.schema.js"
import Comment from "../models/comments.schema.js"
import mongoose from "mongoose"
 
export const commentStore = async(req,res)=>{
    const {value,userid,data}=req.body;

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

    try{
    const gettingPost = await Post.findOne({media:{$elemMatch:{url:value}}})
    const existedComments = await Comment.find({postId:gettingPost._id})
      .populate("postId","_id")
      .populate("userId","username profileImage")
      .sort({createdAt:-1})
    

    return res.status(200).json({msg:"fetched comments successfully",data:existedComments})
    }catch(error){
        console.log("error in fetching post",error)
        return res.status(500).json({msg:"unsuccessfull comments fetching ",error:error.message})
    }
}