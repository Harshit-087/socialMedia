import mongoose from "mongoose"
import Redis from "ioredis";
import {config} from "../config/config.js"


const connectionDb=async()=>{
    try{
        await mongoose.connect(`${config.MONGO_URI}Social`)
        console.log("connected")
    }catch(error){
        console.log("mongodb is not connected")
        console.log("error in connection",error.message)
    }
}


const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis error:", err));

export  {redis,connectionDb};