import {axiosInstance} from "./axiosInstance"

export const likeQuery={
    
    likePost:async(userId:string,Url:string,token:string)=>{
        return await axiosInstance.post("/like-api/like",
            {
            userId,
            Url},              // for body wrap in object.
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        ) 
    },
    deleteLike:async(userId:string,url:string,token:string)=>{
        return await axiosInstance.post("/like-api/deletelike",
            {
                userId,
                url
            },
           { headers:{
              Authorization:`Bearer ${token}`
           }}
        )
    },
    fetchingLikes:async()=>{
        return await axiosInstance.get("/like-api/getLikes")
    },
    fetchMyLikes:async(userId:string)=>{
      return await axiosInstance.get("/like-api/myLikes",{params:{userId}})
    },
}



