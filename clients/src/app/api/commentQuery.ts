import {axiosInstance} from "./axiosInstance"

export const commentQuery={
     createComment:async(value:string,userid:string,data:string,token:string)=>{
      return await axiosInstance.post("/comment-api/comment",{
        value,
    userid,
      data}
    ,{
        headers:{
            "content-type":"application/json",
            "Authorization":`Bearer ${token}`
        }
      })
    },
    fetchingComment:async(value:string,token:string)=>{
        return await axiosInstance.get("/comment-api/allcomments",{
            params:{value},
            headers:{
                "content-type":"application/json",
            "Authorization":`Bearer ${token}`
        }
        })
    },
    
}