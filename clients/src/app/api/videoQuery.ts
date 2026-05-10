import {axiosInstance} from "@/app/api/axiosInstance"
import axios from "axios"

export const videoQuery={
    fetchUserVideos:async(userId:string,token:string)=>{
        return await axiosInstance.get("/video-api/userVideo",{params:{userId},
         headers:{
            "content-type":"application/json",
               "Authorization":`Bearer ${token}`
           }})
    },
    fetchAllVideos :async(token:string)=>{
        return await axiosInstance.get("/video-api/allVideos",{params:{token},
         headers:{
            "content-type":"application/json",
               "Authorization":`Bearer ${token}`
           }})
    }
}