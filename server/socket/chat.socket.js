// user sends a message. and we push into redis stream instead of going to mongodb directly.
import {redis} from "../config/connection.js";


export const chatHandler = (io,socket)=>{
    socket.on("chat-message",async({senderId,recieverId,message})=>{
        console.log("chat message",senderId,recieverId,message)

        const conversationId = [senderId,recieverId].sort().join("_");

        // emit to sender and reciever both for faster ui
        const payload ={senderId,recieverId,message,conversationId,id:senderId};
        io.to(recieverId).emit("new-message",payload);
        io.to(senderId).emit("new-message",payload);

        // 2. Add to Redis Stream (The "Beginner" way)
        // 'CHAT_STREAM' is our list name. '*' generates a unique ID.
        try{
            await redis.xadd("chat_stream","*",
                "senderId",senderId,
                "recieverId",recieverId,
                "message",message,
                "conversationId",conversationId
            )
        }catch(error){
            console.error("Failed to add to stream:", error);
        }
    })
}