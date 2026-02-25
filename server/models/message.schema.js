import mongoose from "mongoose"


const messageSchema= new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
  conversationId:{
        type:String

    },
    message:{
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