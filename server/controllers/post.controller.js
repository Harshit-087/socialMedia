import CommunityPost from "../models/communityPost.schema.js";
import Post from "../models/post.schema.js"
import User from "../models/user.schema.js" 
import {setCache,getCache} from "../services/redis/cache.js"
import {redis } from "../config/connection.js"

// data from cloudinary to store
export const createPost = async(req,res)=>{
    try{
    const {userId,publicId,url,caption} = req.body;
    console.log("url",req.body)
    const findUser = await User.findOne({_id:userId})
    if(!findUser) return res.status(404).json({msg:"user not found"});
        
    const savedPost = await Post.create({
     userId,
    caption,
     media:[{publicId,url, position:0, mediaType: "image"}]
    })


   // ----*** IMPORTANT: clear cache****-----
        await redis.del(`posts:${userId}`);
        await redis.del("all_posts");


    // console.dir(JSON.stringify(savedPost,null,2))
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

       // fetching fromm cache
        const key = `posts:${userId}`;
        const cachedData = await getCache(key);
        if(cachedData) return res.status(200).json({msg:"success from cache",data:cachedData})

        const posts= await Post.find({userId}).populate("userId","username profileImage _id")

        // set the cache
        await setCache(key,posts,600);

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
    // fetching all post for explore page
    const key = "all_posts"
    const cachedData = await getCache(key);
    if(cachedData) return res.status(200).json({msg:"success from cache all posts",data:cachedData});

    // if not in cache then fetch from db and cache 
    const result = await Post.find().populate("userId","username profileImage").sort({createdAt:-1});
    
    // set in the cache
    await setCache(key,result,600);
    
    
//    console.log("all post ",result)
    return res.json({msg:'fetched all request ',data:result});
}


export const deletePost=async(req,res)=>{
    const {publicId} = req.body;
  await redis.del(`posts:${userId}`);
  await redis.del("all_posts");
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

   await redis.del(`community_post:${communityId}`);

    // fetching from the cache
    // const key =  `community_post:${communityId}`;
    // const cachedData = await getCache(key);
    // if(cachedData) return res.status(200).json({msg:"success from cache community post",data:cachedData})

    try{
        const communityPost = await CommunityPost.create({
            userId,
            caption,communityId
        })
        const populatedPost = await CommunityPost.populate("userId","username profileImage _id").sort({createdAt:-1})
        
         

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

    await redis.del(`community_post:${communityId}`);
    try{
        const communityPost = await CommunityPost.create({
            userId,
            communityId,
            caption,
            publicId,
            url
        })
        const populatedPost = await CommunityPost.populate("userId","username profileImage _id").sort({createdAt:-1})
        req.app.get("socket.io").to(communityId).emit("new_community_post",populatedPost)
        return res.status(200).json({message:"successfull community post via cloudinary",data:communityPost})
    }catch(error){
         console.log("error in creating a community post",error)
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}

export const  fetchCommunityPost = async(req,res)=>{
    const {communityId } = req.query

    // fetching from the cache
    const key = `community_post:${communityId}`;
    const cachedData = await getCache(key);
    if(cachedData) return res.status(200).json({msg:"success from cache community post",data:cachedData})
    try{
        const communityPost = await CommunityPost.find({communityId:communityId}).populate("userId","username profileImage _id").sort({createdAt:-1})
      
            //set in the cache
           await setCache(key,communityPost,600);

        return res.status(200).json({message:"successfully fetch community post",data:communityPost})
    }catch(error){
        console.log("error in fetching community post",error)
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}