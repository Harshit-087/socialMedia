
import {axiosInstance} from "./axiosInstance"


export const messageQuery={
    fetchMessage:async(id:string , convers_id?:string)=>{
        return await axiosInstance.get("/message-api/send-messages",{params:{id,convers_id}})
    },
   
}