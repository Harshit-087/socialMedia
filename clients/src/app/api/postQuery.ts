import {axiosInstance} from "./axiosInstance"
import axios from "axios"

export const postQuery= {
      peoplePosts:async(token:string)=>{
     return await axiosInstance.get("/post-api/allposts",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
     )
    },
     showPosts:async(userId:string)=>{

        // get request with params
     return await axiosInstance.get("/post-api/posts",{params:{userId}})
    },
    uploadPost:async(data:FormData,userId:string,token:string)=>{
        // the formdata should not wrapp inside {} , so we append the userId and token to formdata
        data.append("userId",userId),
          data.append("token",token)
        return await axios.post("/api/image_upload", data )
    },
}