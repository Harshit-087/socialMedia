import Like from "../models/likes.schema.js"
import User from "../models/user.schema.js"
import Post from "../models/post.schema.js"
import mongoose from "mongoose"

export const createLike= async(req,res)=>{
    const {userId,Url} = req.body;
    // console.log("body parser",userId ,likeImageUrl)
    try{

    const findUser = await User.findOne({_id:userId});
    if(!findUser) return res.status(400).json({msg:"no user exist"});
    const findPost = await Post.findOne({media:{$elemMatch:{url:Url}}});

    console.log(JSON.stringify(findPost,null,2))

    const likeCreated=await Like.create({
        userId,
        postId:findPost._id
    })

    return res.json({msg:"like successfully",data: likeCreated});
   }catch(err){
    return res.status(500).json({msg:"server error in liking",error:err.message})
   }
    
}

export const deleteLike = async(req,res)=>{
    const {userId,url} = req.body;

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

    return res.json({msg:"delete like doc  successfully"})

    }catch(err){
    return res.status(500).json({msg:"server error in liking",error:err.message})
   }
    
}

// all like created by all user --> used for showing count ..
export const getLikes= async(req,res)=>{

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

   return res.json({msg:"getLikes response ",count:likesCount});
    }catch(error){
        console.log("error in counting likes",error)
        return res.status(500).json({msg:"server error",error:error.message})
    }
}

export const myLikes= async(req,res)=>{
    const {userId} = req.query;
    try{
    const fetchedMyLikes= await Like.find({ userId })
    .populate("userId","username email profileImage")

    return res.json({msg:"all your like images",data:fetchedMyLikes})
    }catch(err){
    return res.status(500).json({msg:"server error in liking",error:err.message})
   }
}