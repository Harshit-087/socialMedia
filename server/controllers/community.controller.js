import Community from "../models/community.schema.js"
import mongoose from "mongoose"
import {redis } from "../config/connection.js"

//  Naming inconsistency
// AdminId
// Members_Id
// communityName

// adminId
// members
// name

export const createCommunity = async(req,res)=>{
    const {userId,banner_url,icon_url,name,description,category,theme,privacy} = req.body;
    if (!userId || !name) {
    return res.status(400).json({ message: "Required fields missing" });
}
   // invalidate cache
   await redis.del("all_communities");

     try{
        const community = await Community.create({
            AdminId:userId,
            banner_url,
            icon_url,
            description,
            communityName:name,
            category,
            theme,
            privacy
        })
        return res.status(200).json({message:"created community",data:community})
     }catch(error){
        return res.status(500).json({message:"internal server error",error:error.message})
     }
} 




// my community
export const fetchMyCommunity =async(req,res)=>{
    const {userId} = req.query;
   try{
    const fetchedMyCommunity = await Community.find({AdminId:userId});
    return res.status(200).json({message:"sucessfully fetch community",data:fetchedMyCommunity});
   }catch(error){
    return res.status(500).json({message:"internal server error",error:error.message});
   }

}




// all community fetching...
export const fetchAllCommunity =async(req,res)=>{

    const key = "all_communities";
   const cached = await getCache(key);
    if (cached) {
    return res.json({ data: cached });
    }

   try{
    const fetchedCommunity = await Community.find();

    await setCache(key, fetchedCommunity, 60);

    return res.status(200).json({message:"sucessfully fetch community",data:fetchedCommunity});
   }catch(error){
    return res.status(500).json({message:"internal server error",error:error.message});
   }
}




export const openCommunity = async(req,res)=>{
    const {id} = req.query;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID" });
}
    try{
        const openCommunity = await Community.findById(id);
        return res.status(200).json({message:"opened community",data:openCommunity})
    }catch(error){
    return res.status(500).json({message:"internal server error",error:error.message});
   }
}




// add members (join community)
export const addMembers = async(req,res)=>{
    const {id,userId} = req.body;
    try{

       if (!id || !userId) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const member = await Community.findByIdAndUpdate(id,{
          // addToSet ---> prevent duplicate entry in the array
            $addToSet:{Members_Id:userId }},
            {new:true}
        )
        return res.status(200).json({message:"successfully join the community",data:member})
    }catch(error){
        console.log("error in joining",error)
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}




// joined community fetching
export const fetchjoinedCommunity=async(req,res)=>{
  const {id} = req.query;
  
  // fetch from cache
  const key = `joined_community:${id}`;
  const cachedData = await getCache(key);
  if(cachedData) return res.status(200).json({msg:"success from cache joined community",data:cachedData})
   
  try{
    const joinedCommunity = await Community.find({Members_Id:id})


     await setCache(key,joinedCommunity,600)
    return res.status(200).json({message:"fetched joined community",data:joinedCommunity})
  }catch(error){
    return res.status(500).json({message:"internal server error",error:error.message})
  }
}



export const deleteCommunity = async (req, res) => {
  const { id } = req.body;
  
  //invalidate cache
  await redis.del("all_communities");
  await redis.del(`joined_community:${id}`);

  try {
    if (!id) {
      return res.status(400).json({ message: "Community id required" });
    }

    const deletedCommunity = await Community.findByIdAndDelete(id);

    if (!deletedCommunity) {
      return res.status(404).json({ message: "Community not found" });
    }

    return res.status(200).json({
      message: "Successfully deleted community",
      data: deletedCommunity
    });

  } catch (error) {
    console.log("error deleting community", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};