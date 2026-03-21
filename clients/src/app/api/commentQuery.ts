import {axiosInstance} from "./axiosInstance"

export const commentQuery={
     createComment:async(value:string,userid:string,data:string)=>{
      return await axiosInstance.post("/comment-api/comment",{
        value,
    userid,
      data})
    },
    fetchingComment:async(value:string)=>{
        return await axiosInstance.get("/comment-api/allcomments",{
            params:{value}
        })
    },
    
}