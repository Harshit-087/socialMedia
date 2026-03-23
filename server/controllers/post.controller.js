import CommunityPost from "../models/communityPost.schema.js";
import Post from "../models/post.schema.js"
import User from "../models/user.schema.js" 

// data from cloudinary to store
export const createPost = async(req,res)=>{
    try{
    const {userId,publicId,url,caption} = req.body;
    console.log("url",req.body)
    // return res.json({msg:"reached schema"})

    const findUser = await User.findOne({_id:userId})
    if(!findUser) return res.status(404).json({msg:"user not found"});
        
    const savedPost = await Post.create({
     userId,
    caption,
     media:[{publicId,url, position:0, mediaType: "image"}]
    })
  
    console.dir(JSON.stringify(savedPost,null,2))
    return res.status(200).json({msg:"post created",data:savedPost})

}catch(err){
    console.log("error in creating a post",err)
    return res.status(500).json({msg:"failed in post creation"})
}
}




export const showPosts = async(req,res)=>{
    try{
        const {userId} =req.query
        console.log("showpost userId",userId)
        if(!userId) return res.status(400).json({msg:"userId is required"})
        const posts= await Post.find({userId}).populate("userId","username profileImage _id")

    // for media array to show ..
    //JSON.stringify(value, replacer, space)
    //replacer --> something to remove  

        // console.log(JSON.stringify(posts,null,2))

        return res.json({msg:"success",data:posts})
    }catch(err){
        console.log("error in fetching posts",err)
        return res.status(500).json({msg:"internal server error"})
    }
}

export const allPost=async(req,res)=>{
    const result = await Post.find().populate("userId","username profileImage").sort({createdAt:-1}); //newest first
   console.log("all post ",result)
    return res.json({msg:'fetched all request ',data:result});
}


export const deletePost=async(req,res)=>{
    const {publicId} = req.body;

  try{
    const deletedpost =await Post.deleteOne({media:{$elemMatch:{publicId}}});
    return res.status(200).json({msg:"deleted successfully"}) 
  }catch(err){
    return res.status(500).json({msg:"server error in deleting post"})
  }
}

// community post
export const CreateCommunityPost=async(req,res)=>{
    const { userId,caption,communityId} = req.body;
   

    try{
        const communityPost = await CommunityPost.create({
            userId,
            caption,communityId
        })
        const populatedPost = await communityPost.populate("userId","username profileImage _id").sort({createdAt:-1})

        // set and get() are global variable which are bad to trigger for sending msg around the app
        req.app.get("socket.io").to(communityId).emit("new_community_post",populatedPost)
        return res.status(200).json({message:"community post created",data:communityPost})
    }catch(error){
        console.log("error in creating a community post",err)
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}

// community Post via cloudinary
export const communityPost = async(req,res)=>{
    const {userId,communityId,publicId,url,caption} =req.body;
    try{
        const communityPost = await CommunityPost.create({
            userId,
            communityId,
            caption,
            publicId,
            url
        })
        const populatedPost = await communityPost.populate("userId","username profileImage _id").sort({createdAt:-1})
        req.app.get("socket.io").to(communityId).emit("new_community_post",populatedPost)
        return res.status(200).json({message:"successfull community post via cloudinary",data:communityPost})
    }catch(error){
         console.log("error in creating a community post",error)
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}

export const  fetchCommunityPost = async(req,res)=>{
    const {communityId } = req.query
    try{
        const communityPost = await CommunityPost.find({communityId:communityId}).populate("userId","username profileImage _id").sort({createdAt:-1})
        return res.status(200).json({message:"successfully fetch community post",data:communityPost})
    }catch(error){
        console.log("error in fetching community post",error)
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}