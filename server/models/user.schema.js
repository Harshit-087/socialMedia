import mongoose from "mongoose"

const userSchema = new mongoose.Schema ({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
    bio:{
        type:String,
        required:true
    },
    profileImage:{
        type:String
    },
    website:{
        type:String
    },
    isPrivate:{
        type:Boolean,
    }

},{timestamps:true})

const User =new mongoose.model ("user",userSchema)

export default User 