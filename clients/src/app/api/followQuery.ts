import {axiosInstance} from "./axiosInstance"

export const followQuery={
    // user following 
    following:async(userid:string)=>{
        return await axiosInstance.get("/follow-api/following",{params:{userid}})
    },
    follow:async(userid:string,accountId:string)=>{
        return await axiosInstance.post("/follow-api/follow",{
            userid,
            accountId
    })
    },

    followers:async(userid:string)=>{
        return await axiosInstance.get("/follow-api/followers",{params:{userid}})
    }
}