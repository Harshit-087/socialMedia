import mongoose from "mongoose"


const storySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    mediaUrl:{
        type:String
    },
    mediaType:{
        type:String                     // "image" | "video"
    },
    expiresAt:{
        type:Date
    }
},{timestampe:true})