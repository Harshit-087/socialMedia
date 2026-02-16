"use client"

import {useState,useEffect} from "react"
import {MoveLeft} from "lucide-react"
import Image from "next/image"
import {useQuery,useMutation} from "@tanstack/react-query"
import {commentQuery} from "@/app/api/commentQuery"
import CommentText from "./comment"
import {motion,AnimatePresence} from "framer-motion"
import {useUser} from "@/hooks/userhook"
import {useQueryClient} from "@tanstack/react-query"
import Comments from "./comments"
import toast from "react-hot-toast"
import {ApiError} from "../auth/loginCard"
import {AxiosResponse} from "axios"
import {PostType} from "./card"

interface props{
    close:()=>void;
    data:PostType;
}


type CommentVariables={
    value:string,
    userId:string,
    data:string
}

type CommentResponse={
    response?:{
        data?:{
            msg?:string,
            data?:{
                  userId:string,
        postId:string,
        Data:string,
        parentId:string |null,
            }
        },
        status:string
    }
}

export default function CommentPanel({close,data}:props){


    const {userId} = useUser();
    const queryClient = useQueryClient();

    //fetching all comments on post 
    const {data:comments,isLoading,error} = useQuery({
        queryKey:["comments",data?.media[0]?.url],
        queryFn:async({queryKey})=>{
            const [_,postUrl] = queryKey;
            const res = await commentQuery.fetchingComment(postUrl);
             toast.success(res.data.msg)
            return res.data.data;
        }
    })

   


    // creating comments on post ..
    const commentMutation = useMutation<AxiosResponse<CommentResponse>,ApiError,CommentVariables>({
        mutationFn:async({value,userId,data}:CommentVariables)=>{
            return await commentQuery.createComment(value,userId,data);
        },
        onSuccess:(res:AxiosResponse<CommentResponse>)=>{
            console.log("created comment success",res);
            queryClient.invalidateQueries({queryKey:["comments"]});

        },
        onError:(err:ApiError)=>{
            console.log("error in creating comment ",err)
        }
    })


    const handleComment=(e:string)=>{
        
        commentMutation.mutate({value:e,userId,data:data?.media[0]?.url});
    }

     if(isLoading){
        return <p>loading comments ......</p>;
    }

    if(error){
        return <p>internal server error </p>
    }

    return(
      <>
      <AnimatePresence>
      <motion.div className="w-screen min-h-screen bg-[#1f2937] fixed inset-0 z-50 overflow-y-scroll overflow-x-hidden md:flex md:flex-col ">
        <div className="flex relative w-full h-10  mt-5 justify-center items-center">
               <button onClick={close} className="w-8 h-8 absolute left-5 rounded-full bg-white flex justify-center items-center mx-4 my-6">
          <MoveLeft className="text-black"/>
        </button>
         <h1 className="text-white font-bold">Bezal</h1>
        </div>
        

       <div className="w-full md:h-140  relative  flex flex-col md:flex-row">

          <div className="w-full md:flex-[0.60]  flex md:flex-col px-2">
       
          <div className=" flex-[0.40] md:flex-[0.60]  my-4 rounded-lg relative w-44  md:w-72 aspect-[3/4] mx-auto ">
          <Image src={data?.media[0]?.url} alt="#" fill className="object-cover rounded-lg"/>
           </div> 

           <div className="bg-white rounded-xl  min-h-36  px-2 py-4 my-auto md:w-full flex-[0.30] md:flex-[0.25] text-black flex flex-col gap-2">
            <h3 className="font-bold ">Author :{data?.userId?.username}</h3>
            <p className="font-bold">Caption : <span className="font-normal">{data?.caption} </span></p>
            </div>

           </div>

             <div className= "w-full min-h-screen md:flex-[0.40] bg-black/20 border-l-2 border-white overflow-y-scroll">            {/* showing all comments  */}
          <Comments comments={comments}/>

            {/* commenting */}
          <CommentText handle={(e:string)=>handleComment(e)}/>
          </div>

       </div>
        
        
        
      </motion.div>
      </AnimatePresence>
      </>
    )
}