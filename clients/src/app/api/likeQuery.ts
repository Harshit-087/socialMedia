import {axiosInstance} from "./axiosInstance"

export const likeQuery={
    
    likePost:async(userId:string,Url:string,token:string)=>{
        return await axiosInstance.post("/like-api/like",
            {
            userId,
            Url},              // for body wrap in object.
            {
                headers:{
                    "content-type":"application/json",
                     "Authorization":`Bearer ${token}`
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
            "content-type":"application/json",
               "Authorization":`Bearer ${token}`
           }}
        )
    },
    fetchingLikes:async(token:string)=>{
        return await axiosInstance.get("/like-api/getLikes",{
             headers:{
                "content-type":"application/json",
               "Authorization":`Bearer ${token}`
           }
        })
    },
    fetchMyLikes:async(userId:string,token:string)=>{
      return await axiosInstance.get("/like-api/myLikes",{params:{userId},
     headers:{
        "content-type":"application/json",
               "Authorization":`Bearer ${token}`
           }})
    },
}



