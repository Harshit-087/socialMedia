import {axiosInstance} from "./axiosInstance"
import {formData} from "@/app/account/signup/page"
import axios from "axios"

export interface Data{
    email:string,
    password:string
}

export const userQuery={
    login:async(data:Data)=>{
        return await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/signin`,
           data,{
            withCredentials:true
           }
        )
    },
    signup:async(data:formData)=>{
        return await axiosInstance.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`,
            data,{
                withCredentials:true
            })
    },
    // redirectToHome:async(token:string)=>{
    //     return await axiosInstance.get("/dashboard", {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    // },
   
   
   
    searchUser:async(user:string)=>{
           
        await new Promise(resolve=>setTimeout(resolve,1000));
          
           return await axiosInstance.get("/user-api/user",{params:{user}})
           
    },
    fetchProfile:async(id:string)=>{
        return await axiosInstance.get("/user-api/profile",{params:{id}})
    },
    
    
    editProfile:async(name:string,email:string,bio:string,website:string)=>{
        return await axiosInstance.post("/user-api/editProfile",{name,email,bio,website},{
            headers:{
                "content-type":"multipart/form-data"
            }
        })
    }
}
