"use client"
import {useState} from "react"
import {useUser} from "@/hooks/userhook";
import {useQuery} from "@tanstack/react-query"
import {videoQuery} from "@/app/api/videoQuery"
import { X } from "lucide-react";

export type VideoItem={
    userId:{
      username:string,
      profileImage:string,
      _id:string
    },
    url:string,
    publicId:string,
    caption?:string,
    createdAt:string
}

export default function Videos(){
  const {userId,token} = useUser();
  const [open,setOpen] =useState<boolean>(false);

  const {data = [], isLoading, error} = useQuery<VideoItem[], Error>({
    queryKey:["videos",userId,token],
    queryFn:async({queryKey})=>{
        const [ , userId,token] =queryKey as [string,string|undefined,string]
        if(!userId) return [];
        const res = await videoQuery.fetchUserVideos(userId,token);
       
        return res.data.data;
    }
  })

    return(
        <>
  
        {data ? 
         <div className="w-full min-h-24    grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-2 gap-4">
          {data.map((items:VideoItem,index:number)=>( 
            <div key={items.publicId ?? index} 
            className="relative w-full  aspect-ratio-[3/4]  flex justify-center items-center overflow-hidden hover:scale-105 transition-transform duration-300 "
            onClick={()=>setOpen(true)}>
               <video src={items.url}  className="object-cover border-2 border-gray-400 rounded-xl"/>
            <div 
            className="absolute inset-0 bg-black/10 hover:bg-black/30 flex justify-center items-center text-white text-lg font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl cursor-pointer"
            onClick={(e)=>e.stopPropagation()}
            >view</div>
            </div>
           
            ))} 
          
        </div>
          :<p className="text-center text-gray-400">No videos to show</p>}

          {open ?
          <div className="bg-black backdrop-blur-md w-full h-full flex flex-col">
            <div className="w-full flex justify-end p-4">
              <X size={30} className="text-white cursor-pointer" onClick={()=>setOpen(false)}/>
                <div className="w-full aspect-ratio relative">
                  <video src={data[0]?.url} controls autoPlay className="object-contain w-full h-full"/>
                </div>
            </div>
          </div> :null}
        </>
       
    )
}