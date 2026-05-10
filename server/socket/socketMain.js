import {chatHandler} from "./chat.socket.js"

export const SocketMain = (io)=>{
    io.on("connection",(socket)=>{
         const userId  = socket.handshake.query.userId;
        if (!userId) return socket.disconnect();
  
        console.log("a user connected",userId)
        socket.join(userId);
 
        chatHandler(io,socket)

        socket.on("disconnect", () => {
      console.log("User disconnected");
    });
    })
}