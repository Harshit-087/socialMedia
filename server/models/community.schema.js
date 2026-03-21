import mongoose from "mongoose"

const communitySchema  = new mongoose.Schema({
    AdminId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    Members_Id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }],
    banner_url:{
        type:String,
        required:true
    },
    icon_url:{
        type:String,
        required:true
    },
    communityName:{
        type:String,
        
    },
    description:{
        type:String,
      
    },
    privacy:{
        type:String
    },
    category:{
        type:String
    },
    theme:{
        type:String
    }

})

const Community = mongoose.model("community",communitySchema)

export default Community;