import Message from "../models/message.schema.js";
import {io} from "../script.js"

export const sendMessage = async(req,res)=>{
   const {id,convers_id} = req.query; 
   console.log("recieved the idds :",convers_id)

try{ 

      // finding the chat for specific room .
      const messages = await Message.find({conversationId:convers_id}).sort({createdAt:1}) //oldest first

      //online or offline
      // 1 for online , undefined fro offline
      const activeStatus = io.sockets.adapter.rooms.get(id)?.size ;

    console.log("get the message sended",messages)
    console.log("get the status",activeStatus)
    return res.status(200).json({msg:"successfully fetched",data:messages,isActive:activeStatus})
   }catch(error){
    console.log("error in fetching the sender message",error)
    return res.status(500).json({msg:"internal server error",error:error.message})
   }
}
