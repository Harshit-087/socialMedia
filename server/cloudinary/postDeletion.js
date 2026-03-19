import {v2 as cloudinary } from "cloudinary"
import Story from ".././models/stories.schema.js"
import cron from "node-cron"

cloudinary.config({
    cloud_name:`${process.env.CLOUDINARY_CLOUD_NAME}`,
    api_key:`${process.env.CLOUDINARY_API_KEY}`,
    api_secret:`${process.env.CLOUDINARY_API_SECRET}`,
    secure:true
});

cron.schedule("0 * * * *",async()=>{
    const storyDeletion = await Story.find({
        expiresAt:{$lt: new Date(Date.now()-24*60*60*1000)} //milliseconds
    })
    for(const story of storyDeletion){
        await cloudinary.uploader.destroy(story.public_id);
        await Story.delete({_id:story._id})
    }
})