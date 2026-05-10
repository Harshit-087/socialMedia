import { axiosInstance } from "./axiosInstance";
import axios from "axios"

export  const storyQuery={
   // going to cloudinary
   upload:async(formdata:FormData)=>{
     
    return await axios.post("/api/upload_story",formdata)
     
        // formdata is obj so donot wrap it in another obj 
   },

   fetchStory:async(id:string,token:string)=>{
      console.log("id backend going",id)
      return await axiosInstance.get("/story-api/mystory",{params:{id},
       headers:{
         "content-type":"application/json",
              "Authorization":`Bearer ${token}`
           }})
   }
}