import mongoose from "mongoose"


const likeSchema = new mongoose.Schema({
    userId:{
      type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    postId:{
       type:mongoose.Schema.Types.ObjectId,
        ref:"post",
        required:true
    }
},{timestampe:true})


const Like = mongoose.model("like",likeSchema)

export default Like