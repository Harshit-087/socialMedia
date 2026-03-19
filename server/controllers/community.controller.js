import Community from "../models/community.schema.js"

export const createCommunity = async(req,res)=>{
    const {userId,banner_url,icon_url,name,description,category,theme,privacy} = req.body;
    console.log("recahed to backend teh community",userId,banner_url,icon_url,description,name,privacy,theme,category)
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
    
   try{
    const fetchedCommunity = await Community.find();
    return res.status(200).json({message:"sucessfully fetch community",data:fetchedCommunity});
   }catch(error){
    return res.status(500).json({message:"internal server error",error:error.message});
   }


}

export const openCommunity = async(req,res)=>{
    const {id} = req.query;
    try{
        const openCommunity = await Community.find({_id:id});
        return res.status(200).json({message:"opened community",data:openCommunity})
    }catch(error){
    return res.status(500).json({message:"internal server error",error:error.message});
   }
}

// add members
export const addMembers = async(req,res)=>{
    const {id,userId} = req.body;
    try{
        const member = await Community.findByIdAndUpdate(id,{
            $push:{Member_id:userId }
        })
        return res.status(200).json({message:"successfully join the community",data:member})
    }catch(error){
        console.log("error in joining",error)
        return res.status(500).json({message:"internal server error",error:error.message})
    }
}

export const deleteCommunity = async (req, res) => {
  const { id } = req.body;

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