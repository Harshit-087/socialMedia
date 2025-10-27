import mongoose from "mongoose"


const messageSchema= new mongoose.schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    data:{
       type:String
    },
    mediaUrl:{
        type:String
    },
    isRead:{
        type:Boolean
    }
},{timestamps:true})

const Message = mongoose.model("message",messageSchema)

export default Message