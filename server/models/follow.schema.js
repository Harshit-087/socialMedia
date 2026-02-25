import mongoose from "mongoose"


const followSchema = new mongoose.Schema({
    followerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    followingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
},{timestamps:true})


const Follow = mongoose.model("follow",followSchema)

export default Follow