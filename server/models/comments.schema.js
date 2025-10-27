import mongoose from "mongoose" 


const commentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
   
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    },
    Data:{
        type:String
    },
    parentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comments",
        default:null
    }
},{timestamps:true})


const Comments = mongoose.model("comments",commentSchema)

export default Comments