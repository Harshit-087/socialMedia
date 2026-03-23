import mongoose from "mongoose"

const communityPostSchema = new mongoose.Schema({
    communityId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"community"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    caption:{
        type:String
    },
    publicId:{
        type:String
    },
    url:{
        type:String
    }

},{timestamps:true}) 

const CommunityPost = mongoose.model("communitypost",communityPostSchema)
export default CommunityPost;