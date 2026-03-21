import {axiosInstance} from "./axiosInstance"
import axios from "axios"

export const communityQuery ={
    createCommunity:async(formData:FormData)=>{
        return await axios.post("/api/community_upload",formData)
    },
    fetchAllCommunity:async()=>{
        return await axiosInstance.get("/community-api/fetch_allCommunity")
    },
    fetchMyCommunity:async(userId:string)=>{
        return await axiosInstance.get("/community-api/fetch_myCommunity",{params:{userId}})
    },
    openCommunity:async(id:string)=>{
     return await axiosInstance.get("/community-api/openCommunity",{params:{id}});
    },
    joinCommunity:async(id:string,userId:string)=>{
        return await axiosInstance.post("/community-api/join_community",{id,userId})
    },
    deleteCommunity:async(id:string)=>{
        return await axiosInstance.post("/community-api/delete_community",{id})
    },
    fetchjoinedCommunity:async(id:string)=>{
        return await axiosInstance.get("/community-api/joined_community",{params:{id}})
    }
}