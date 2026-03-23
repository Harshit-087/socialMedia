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
    uploadPost:async(data:FormData)=>{
        // the formdata should not wrapp inside {} , so we append the userId and token to formdata
        
        return await axios.post("/api/image_upload", data )
    },
    deletePost:async(publicId:string,token:string)=>{
        // send image as query param to match axios.delete signature
        return await axios.delete("/api/image_upload", { params: { publicId ,token } })
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
               
                Authorization:`Bearer ${token}`
            }
        })
    },
    fetchCommunityPost:async(communityId:string)=>{
        return await axiosInstance.get("/post-api/communityPost",{params:{communityId}})
    }
}