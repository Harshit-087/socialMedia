import mongoose from "mongoose"


const connectionDb=async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}Social`)
        console.log("connected")
    }catch{
        console.log("mongodb is not connected")
    }
}

export default connectionDb