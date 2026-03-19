import mongoose from "mongoose"


const storySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    mediaUrl:{
        type:String
    },
    secure_url:{type:String},
    mediaType:{
        type:String                     // "image" | "video"
    },
    expiresAt:{
        type:Date,
        default:Date.now,
        expires:"24*60*60*1000"
    }
},{timestampe:true})

const Story = mongoose.model("Story",storySchema)
export default Story;