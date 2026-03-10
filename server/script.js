import express from "express";
import {createServer} from "node:http"
import cors from "cors";

import {Server} from "socket.io"
import router from "./router/router.js";
import  connectionDb  from "./db/connection.js";
import dotenv from 'dotenv'
import Message from "./models/message.schema.js";
import mongoose from "mongoose";
dotenv.config()

const app = express();
const server = createServer(app);

const allowedOrigins = [
  process.env.ORIGIN1,
 process.env.ORIGIN2// your machine's IP for mobile testing
 
];

export  const io = new Server(server,{
  cors:{
     origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
})


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["content-type", "authorization"],
  credentials: true
}));

connectionDb();



app.use("/", router);

 
io.on("connection", (socket) => {
  const {userId,receiverId} = socket.handshake.query;
  console.log("CONNECTED USER:", socket.handshake.query.userId);

  // create a room for the chat 
  // const room_id = [userId,receiverId].sort().join("_");
  socket.join(userId);

  
  //beginner we do mapping as userid to socketId, so that the server know whom to send msg ,  they donot send to a reciver id they need socketId ,
  // the room_id alraedy done the mapping of userid with socketId .
 
 socket.on('chat-message',async(data)=>{
  console.log("chat message",data)


  //create doc of data for storage
  const MessageDoc = await Message.create({
    senderId:new mongoose.Types.ObjectId( data.senderId),
    receiverId:new mongoose.Types.ObjectId(data.receiverId),
    conversationId :[data.senderId,data.receiverId].sort().join("_"),
    message:data.message
  })

  
  // id is used to status of other online or offline
 io.to(data.receiverId).emit("new-message",{message:MessageDoc.message,conversationId:MessageDoc.conversationId,id:data.senderId});
  
 io.to(data.senderId).emit("new-message",{message:MessageDoc.message,conversationId:MessageDoc.conversationId,id:data.receiverId});



  console.log(
    "message send to :",
    data.receiverId,
    "Room size:",
    io.sockets.adapter.rooms.get(data.receiverId)?.size)
 })
});


// connect kafka first 

server.listen(5000,"0.0.0.0", () => {         // then start server..
  console.log("Server running on port 5000");
});








