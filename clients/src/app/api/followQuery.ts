import {axiosInstance} from "./axiosInstance"

export const followQuery={
    // user following 
    following:async(id:string,userid:string,token:string)=>{
        return await axiosInstance.get("/follow-api/following",{params:{id,userid},
            headers:{
                "content-type":"application/json",
            "Authorization":`Bearer ${token}`
        }})
    },
    follow:async(userid:string,accountId:string,token:string)=>{
        return await axiosInstance.post("/follow-api/follow",{
            userid,
            accountId
    },{headers:{
        "content-type":"application/json",
            "Authorization":`Bearer ${token}`
        }})
    },

    followers:async(userid:string,token:string)=>{
        return await axiosInstance.get("/follow-api/followers",{params:{userid},
        headers:{
            "content-type":"application/json",
            "Authorization":`Bearer ${token}`
        }})
    },
    fetchFollowerAccounts:async(id:string,token:string)=>{
          return await axiosInstance.get("/follow-api/followersAccounts",{params:{id},
        headers:{
            "content-type":"application/json",
            "Authorization":`Bearer ${token}`
        }})
    },
    fetchFollowingAccounts:async(id:string,token:string)=>{
        return await axiosInstance.get("/follow-api/followingAccounts",{params:{id},
        headers:{
            "content-type":"application/json",
            "Authorization":`Bearer ${token}`
        }})
    },
   
}