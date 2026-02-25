import {axiosInstance} from "@/app/api/axiosInstance"
import axios from "axios"

export const videoQuery={
    fetchUserVideos:async(id:string)=>{
        return await axiosInstance.get("/video-api/userVideo",{params:{id}})
    },
    fetchAllVideos :async(token:string)=>{
        return await axiosInstance.get("/video-api/allVideos",{params:{token}})
    }
}