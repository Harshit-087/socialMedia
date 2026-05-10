
import {axiosInstance} from "./axiosInstance"


export const messageQuery={
    fetchMessage:async(id:string , token:string,convers_id?:string)=>{
        return await axiosInstance.get("/message-api/send-messages",{params:{id,convers_id},
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${token}`
            
        }})
    },
   
}