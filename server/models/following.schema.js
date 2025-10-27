import mongoose from "mongoose"


const followSchema = new mongoose.Schema({
    followId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
},{timestampe:true})


const Follow = mongoose.model("follow",followSchema)

export default Follow