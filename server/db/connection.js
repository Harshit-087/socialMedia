import mongoose from "mongoose"


const connectionDb=async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}Social`)
        console.log("connected")
    }catch(error){
        console.log("mongodb is not connected")
        console.log("error in connection",error.message)
    }
}

export default connectionDb