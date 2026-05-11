// user sends a message. and we push into redis stream instead of going to mongodb directly.
import {redis} from "../config/connection.js";


export const chatHandler = (io,socket)=>{
    socket.on("chat-message",async({senderId,receiverId,message})=>{
        console.log("chat message",senderId,receiverId,message)

        const conversationId = [senderId,receiverId].sort().join("_");
        const createdAt = new Date().toISOString();

        // emit to sender and receiver both for faster ui
        const payload ={senderId,receiverId,message,conversationId,id:senderId,createdAt};
        io.to(receiverId).emit("new-message",payload);
        io.to(senderId).emit("new-message",payload);

        // 2. Add to Redis Stream (The "Beginner" way)
        // 'CHAT_STREAM' is our list name. '*' generates a unique ID.
        try{
            await redis.xadd("chat_stream","*",
                "senderId",senderId,
                "receiverId",receiverId,
                "message",message,
                "conversationId",conversationId,
                "createdAt", createdAt
            )
        }catch(error){
            console.error("Failed to add to stream:", error);
        }
    })
}