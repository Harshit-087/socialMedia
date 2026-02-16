"use client"
import {useEffect,useState} from "react"
import {useQuery,useQueryClient } from "@tanstack/react-query"
import {useUser} from "@/hooks/userhook"
import { messageQuery } from "@/app/api/messageQuery"


export type message={
    senderId:string,
    receiverId:string,
    roomId:string,
    message:string,
    mediaUrl?:string,
    isRead?:boolean
}
export default function ChatText({id ,setActive}:{id:string,setActive:(v:string)=>void}) {
  const { userId } = useUser()
 
  // fetching msg from the db.
  const { data,isLoading ,isError ,error } = useQuery({
    queryKey: ["senderMessages", userId,id],
    enabled: !!userId,
    queryFn: async () => {

      const res = await messageQuery.fetchMessage(userId!,id)
      if(res.data.isActive=== "1" ) setActive("online");
      else{ setActive("offline")};
      
      return res.data.data
    },
  })



  useEffect(() => {
  if (error) {
    console.log("QUERY ERROR 👉", error)
  }
}, [error])

  if (isLoading) return <p>Loading...</p>
  if (isError) return <p>Error loading messages</p>

  return (
    <div className="flex flex-col gap-2">
      {data?.map((item: message, index: number) => (
        <div
          key={index}
          className={`${item.senderId===userId ? "self-end" :"self-start" } break-words ${item.senderId===userId ?"bg-green-800" : "bg-pink-800"}  text-white w-fit px-4 py-2 rounded-xl max-w-[70%]`}
        >
          {item.message}
        </div>
      ))}
    </div>
  )
}
