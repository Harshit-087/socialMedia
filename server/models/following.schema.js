import mongoose from "mongoose"


const followSchema = new mongoose.Schema({
    followId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
},{timestampe:true})


const Follow = mongoose.model("follow",followSchema)

export default Follow