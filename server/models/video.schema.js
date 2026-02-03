import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    url:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:false
    }
},{
    timestamps:true
})

const Video = new mongoose.model("video",videoSchema);

export default Video;