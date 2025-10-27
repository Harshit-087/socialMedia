import Post from "../models/post.schema.js"
import User from "../models/user.schema.js" 

export const updateSchema = async(req,res)=>{
    try{
    const {userId,publicId,url,caption} = req.body;
    console.log("url",req.body.url)
    // return res.json({msg:"reached schema"})

    const findUser = await User.findOne({_id:userId})
    if(!findUser) return res.status(404).json({msg:"user not found"});
        
    const savedPost = await Post.create({
     userId,
    caption,
     media:[{url, position:0, mediaType: "image"}]
    })
    console.log("post created",savedPost)
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
        const posts= await Post.find({userId}).populate("userId","username profileImage")

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


