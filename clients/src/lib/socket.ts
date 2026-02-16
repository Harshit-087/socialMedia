import {io,Socket} from "socket.io-client"
import {useUser} from "@/hooks/userhook"

let socket:Socket |null = null;

export function GetSocket(userId:string,receiverId:string):Socket{
   
    if(!socket){
        socket = io(process.env.NEXT_PUBLIC_BACKEND_URL as string ,
            
            {
                query: {userId,receiverId},
           withCredentials:true,
           transports:["websocket","pooling"]
        })
    }
     
     return socket
}