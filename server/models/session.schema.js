import mongoose from "mongoose"


const sessionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref="user"
    },
    refreshTokenhash:{
        type:String,
        required:[true,"refresh token is requires"]
    },
    ipAddress:{
        type:String,
        required:[true,"ip address is required"]
    },
    userAgent:{
        type:String,
        required:[true,"user agent is required"]
    },
   revoked:{
    type:Boolean,
    default:false
   }   
},{timestamps:true})

const Session = mongoose.model("session",sessionSchema)

export default Session;