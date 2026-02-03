import {axiosInstance} from "./axiosInstance"
import {formData} from "@/app/account/signup/page"
import axios from "axios"

export interface Data{
    email:string,
    password:string
}

export const userQuery={
    login:async(data:Data)=>{
        return await axiosInstance.post("/signin",
           data
        )
    },
    signup:async(data:formData)=>{
        return await axiosInstance.post("/register",data)
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
