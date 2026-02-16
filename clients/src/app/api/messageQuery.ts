
import {axiosInstance} from "./axiosInstance"


export const messageQuery={
    fetchMessage:async(userId:string,id:string)=>{
        return await axiosInstance.get("/message-api/send-messages",{params:{userId,id}})
    },
   
}