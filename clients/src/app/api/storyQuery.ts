import { axiosInstance } from "./axiosInstance";


export  const storyQuery={
   upload:async(formdata:FormData)=>{
     
    return await axiosInstance.post("/user-api/uploadstory",formdata,{
      headers:{
         "content-type":"multipart/form-data"
      }
    }) ;   // formdata is obj so donot wrap it in another obj 
   },

   fetchStory:async(id:string)=>{
      console.log("id backend going",id)
      return await axiosInstance.get("/user-api/mystory",{params:{id}})
   }
}