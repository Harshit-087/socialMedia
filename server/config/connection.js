import mongoose from "mongoose"
import Redis from "ioredis";


const connectionDb=async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}Social`)
        console.log("connected")
    }catch(error){
        console.log("mongodb is not connected")
        console.log("error in connection",error.message)
    }
}


const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export  {redis,connectionDb};