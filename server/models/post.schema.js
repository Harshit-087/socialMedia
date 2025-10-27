import mongoose from "mongoose"

if (mongoose.models['post']) {
    delete mongoose.models['post'];  // remove cached model
}

const postSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required:true
    },
    caption:{
        type:String ,
        },
    location:{
        type:String ,
    },
        // media is an array of subdocuments. Define an explicit schema for each media item.
        media: [
            new mongoose.Schema(
                {
                    url: { type: String },
                    // Use a different key name to avoid confusion with Mongoose's `type` shortcut
                    mediaType: { type: String }, // "image" || "video"
                    position: { type: Number }, // position in the carousel
                },
                { _id: false }
            ),
        ],
},{timestamps:true})


const Post = mongoose.model("post",postSchema)
export default Post