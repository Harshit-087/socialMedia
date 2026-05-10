import dotenv from "dotenv"
dotenv.config()

if(!process.env.MONGODB_URL){
    throw new Error("MONGODB_URL is not found in env")
}

if(!process.env.SECRET){
    throw new Error("SECRET  is not found in env")
}

export const config ={
    MONGO_URI:process.env.MONGODB_URL,
    SECRET:process.env.SECRET
}

