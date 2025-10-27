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

interface props{
    close:()=>void;
    data:string;
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
        queryKey:["comments",data],
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
        
        commentMutation.mutate({value:e,userId,data});
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
      <motion.div className="w-screen h-screen bg-[#1f2937] fixed inset-0 z-50 overflow-y-scroll overflow-x-hidden">
        <button onClick={close} className="w-8 h-8 rounded-full bg-white flex justify-center items-center mx-4 my-6">
          <MoveLeft/>
        </button>

       
        <div className="w-full   !my-4 rounded-lg relative left-24 ">
          <Image src={data} alt="#" width={600} height={300} className="w-48 h-auto object-cover rounded-lg"/>
          </div>
        
          <div className=" border-t-2 border-gray-800 overflow-y-scroll">
            {/* for feature like share , writecomment,emojis */}
            <div className="bg-pink-400 border-b-2  border-gray-600 ">

            </div>

            {/* showing all comments  */}
          <Comments comments={comments}/>

            {/* commenting */}
          <CommentText handle={(e:string)=>handleComment(e)}/>
          </div>
      </motion.div>
      </AnimatePresence>
      </>
    )
}