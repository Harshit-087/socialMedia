import {axiosInstance} from "./axiosInstance"
import axios from "axios"

export const communityQuery ={
    createCommunity:async(formData:FormData)=>{
        const token = formData.get("token");
        return await axios.post("/api/community_upload",formData,{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        })
    },
    fetchAllCommunity:async(token:string)=>{
        return await axiosInstance.get("/community-api/fetch_allCommunity",{
            headers:{
            "Authorization":`Bearer ${token}`
            }
        })
    },
    fetchMyCommunity:async(userId:string,token:string)=>{
        return await axiosInstance.get("/community-api/fetch_myCommunity",{params:{userId},
            headers:{
                "content-type":"application/json",
                "Authorization":`Bearer ${token}`
            }})
    },
    openCommunity:async(id:string,token:string)=>{
     return await axiosInstance.get("/community-api/openCommunity",{params:{id},

            headers:{
                "content-type":"application/json",
                "Authorization":`Bearer ${token}`
            }});
    },
    joinCommunity:async(id:string,userId:string,token:string)=>{
        return await axiosInstance.post("/community-api/join_community",{id,userId},{
            headers:{
                "content-type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
    },
    deleteCommunity:async(id:string,token:string)=>{
        return await axiosInstance.post("/community-api/delete_community",{id},{
            headers:{
                "content-type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
    },
    fetchjoinedCommunity:async(id:string,token:string)=>{
        return await axiosInstance.get("/community-api/joined_community",{params:{id},
            headers:{
                "content-type":"application/json",
                "Authorization":`Bearer ${token}`
            }
        })
    }
}