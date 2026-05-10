import {axiosInstance} from "./axiosInstance"
import axios from "axios"

export const postQuery= {
      peoplePosts:async(token:string)=>{
     return await axiosInstance.get("/post-api/allposts",
        {
            headers:{
                "content-type":"application/json",
                 "Authorization":`Bearer ${token}`
            }
        }
     )
    },
     showPosts:async(userId:string,token:string)=>{

        // get request with params
     return await axiosInstance.get("/post-api/posts",{params:{userId},
     headers:{
        "content-type":"application/json",
               "Authorization":`Bearer ${token}`
           }})
    },
    uploadPost:async(data:FormData)=>{
        // the formdata should not wrapp inside {} , so we append the userId and token to formdata
        const token = data.get("token")
        return await axios.post("/api/image_upload", data,{
             headers:{
                "content-type":"application/json",
               "Authorization":`Bearer ${token}`
           }
        } )
    },
    deletePost:async(publicId:string,token:string)=>{
        // send image as query param to match axios.delete signature
        return await axios.delete("/api/image_upload", { params: { publicId ,token },
         headers:{
            "content-type":"application/json",
               "Authorization":`Bearer ${token}`
           } })
    },


    createCommunityPost:async(data:FormData)=>{
       const token =   data.get("token")
       const userId = data.get("userId")
       const communityId = data.get("communityId")
       const caption = data.get("caption")
        return await axiosInstance.post("/post-api/create_post",{
            userId,caption,communityId
        },{
            headers:{
               "content-type":"application/json",
                 "Authorization":`Bearer ${token}`
            }
        })
    },
    fetchCommunityPost:async(communityId:string,token:string)=>{
        return await axiosInstance.get("/post-api/communityPost",{params:{communityId},
         headers:{
            "content-type":"application/json",
               "Authorization":`Bearer ${token}`
           }})
    }
}