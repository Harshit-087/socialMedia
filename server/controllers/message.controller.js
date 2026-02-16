import Message from "../models/message.schema.js";
import {io} from "../script.js"

export const sendMessage = async(req,res)=>{
   const {userId,id} = req.query; 
   console.log("recieved the idds :",userId,id)

try{ 
      const room_id = [userId,id].sort().join("_");

      // finding the chat for specific room .
      const messages = await Message.find({roomId:room_id}).sort({createdAt:1}) //oldest first

      //online or offline
      // 1 for online , undefined fro offline
      const activeStatus = io.sockets.adapter.rooms.get(id)?.size 

    console.log("get the message sended",messages)
    return res.status(200).json({msg:"successfully fetched",data:messages,isActive:activeStatus})
   }catch(error){
    console.log("error in fetching the sender message",error)
    return res.status(500).json({msg:"internal server error",error:error.message})
   }
}
