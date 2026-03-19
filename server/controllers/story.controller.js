import Story from "../models/stories.schema.js"

export const createStory = async(req,res)=>{
   const {userId,mediatype,url,public_url} =req.body;
   console.log("story reached ");
   try{
    const uploadStory = await Story.create({
        userId:userId,
        mediaUrl:public_url,
        secure_url:url,
        mediaType:mediatype,
    })
    return res.json({message:"created story",data:uploadStory})
   }catch(err){
    return res.json({message:"error in creating story",error:err.message})
   }
}

export const FetchStory = async(req,res)=>{
    const {id} = req.query;

    try{
        const fetchStory = await Story.find({userId:id});
        return res.status(200).json({message:"successfully fetched story",data:fetchStory});

    }catch(error){
        console.log("error in fetching the story")
        return res.json({message:"internal server error",error:error.message})
    }
}