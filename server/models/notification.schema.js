 import mongoose from "mongoose"


const notifySchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    // who triggered it .
    actorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    type:{type:String} ,       // "like" | "comment" | "follow" | "mention" | "message"
    postId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"post"
    },
    isRead:{
        type:Boolean
    }
},{timestamps:true}) 

const Notify = mongoose.model("notify",notifySchema)

export default Notify;