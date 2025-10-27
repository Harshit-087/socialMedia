import mongoose from "mongoose"


const followerSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    followerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        requires:true
    },
},{timestampe:true})


const Follower = mongoose.model("follower",followerSchema)

export default Follower