import {axiosInstance} from "./axiosInstance"

export const followQuery={
    // user following 
    following:async(id:string,userid:string)=>{
        return await axiosInstance.get("/follow-api/following",{params:{id,userid}})
    },
    follow:async(userid:string,accountId:string)=>{
        return await axiosInstance.post("/follow-api/follow",{
            userid,
            accountId
    })
    },

    followers:async(userid:string)=>{
        return await axiosInstance.get("/follow-api/followers",{params:{userid}})
    },
    fetchFollowerAccounts:async(id:string)=>{
          return await axiosInstance.get("/follow-api/followersAccounts",{params:{id}})
    },
    fetchFollowingAccounts:async(id:string)=>{
        return await axiosInstance.get("/follow-api/followingAccounts",{params:{id}})
    },
   
}