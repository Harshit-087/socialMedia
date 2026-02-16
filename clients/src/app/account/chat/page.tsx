"use client"

import {useEffect,useState,useRef} from "react"
import {useQuery,useQueryClient} from "@tanstack/react-query"
import {useUser} from "@/hooks/userhook"
import {followQuery} from "@/app/api/followQuery"
import {GetSocket} from "@/lib/socket"
import { FaCircleArrowLeft } from "react-icons/fa6";
import Link from "next/link"
import ChatText from "@/components/chat/chatTextSender"
import Image from "next/image"
import {Socket} from "socket.io-client"

type Account ={
    followId:{
        username:string,
        profileImage:string,
        _id:string
    }
}

export default function ChatDashboard() {

  const [ inputValue,setInputValue] = useState<string>("")
  const [message,setMessage] = useState<string>("")
  const [activeChat,setActiveChat] =useState({username:"",id:"",open:false})
    const {userId } = useUser()
    const queryClient = useQueryClient()
    const [socket ,setSocket]=useState<Socket|null>(null)
     const [active , setActive] = useState<string>("")
     const [isOpen ,setIsOpen] = useState<boolean|null>(false)
     const chatRef = useRef<HTMLDivElement|null>(null)
   
     const {data,isLoading,isError} = useQuery({
    queryKey:["following",userId],
    queryFn:async({queryKey})=>{
        const [,id]=queryKey as [string ,string|undefined]
        if(!id) throw new Error("invalid id")
      const res  = await  followQuery.fetchFollowingAccounts(userId)

    return res.data.data;
        
    }
   })

   useEffect(()=>{
    if(!userId || !data?.length) return

    const s = GetSocket(userId , data[0].followId._id)
    setSocket(s);
   },[userId,data])

     
      useEffect(()=>{
      if(!socket) return 

       socket.on("connect",()=>{
        console.log("connected to server",socket.id)

       })
       return ()=>{
        socket.off("connect")
       }
    },[socket])



   const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
   
    //formdata used in fetch and axios for multipart data..
   //emit end plain js object 
   //sending msg  to backend 
     socket?.emit('chat-message',
      {
    message: inputValue,
    senderId: userId,
    receiverId: data[0].followId._id,
   })
 
     setInputValue("") 
    }
   
  // backend se msg emit hu room_id then recieve here for both sender and reciever
    useEffect(()=>{
       if(!socket) return;

         const handleNewMessage = (message:string) => {
          setMessage(message)
    queryClient.invalidateQueries({
      queryKey: ["senderMessages", userId, activeChat.id],
    });
  };
  // recieving msg response that emitted.
    socket.on('new-message',(message)=>{
      console.log("message recieved")
      handleNewMessage(message);
    })
     
  return()=>{
    socket.off("new-message", handleNewMessage);
  }

    },[socket,activeChat.id,userId,queryClient])

    // for scroll the screen for new msg 
    useEffect(()=>{
      if(chatRef.current){
        chatRef.current.scrollTop=chatRef.current.scrollHeight
      }
    },[message])


  return (
    <div className="h-screen w-full bg-zinc-900 flex">
      
      {/* Left: Conversation List */}
      <div className={`${isOpen?"hidden":"flex"} w-full md:flex md:w-52 lg:w-80 border-r border-zinc-800 flex flex-col`}>
        <div className="h-14 px-2 flex items-center ">
        <Link href="/account/dashboard"> 
         <FaCircleArrowLeft size={20} className="text-white"/> 
         </Link>
          <h1 className="px-4 border-b border-zinc-800 text-white">chats</h1>
        </div>

        <div className="bg-white w-full p-2 h-12">
          <label htmlFor="searchContacts" className="flex h-full border-2 border-gray-800 rounded-xl overflow-hidden ">
          <input
           type="text" 
          placeholder="search" 
          className="text-black bg-red-200 flex-[0.80] px-1 border-none "/>
          <button className="bg-green-500 flex-[0.20]">search</button>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {/* Conversation items go here */}
         
           {data?.map((item:Account ,index:number)=>(
            // main contact
          <div key={index} 
          onClick={()=>{
            setActiveChat({username:item.followId.username,id:item.followId._id,open:true})
            setIsOpen(true)
          }}
          className=" w-full h-16 px-4 py-2 text-white rounded-xl bg-gray-800 flex"  >
             {/* image left side */}
            <div className="relative w-12 h-12 aspect-square rounded-full overflow-hidden">
              <Image src={item.followId.profileImage} alt="#" fill className="object-cover"/>
            </div>
            {/* center name and msg */}
            <div className="bg-red-200 flex flex-col">
            <h2 className="px-2">{item.followId.username}</h2>
           {chatRef.current ?<p>{message}</p> :null} 
            </div>
            </div>
        ))}
         
        </div>
      </div>

      {/* Right: Chat Window */}
      <div className={`${isOpen?"flex":"hidden"} flex-1 md:flex flex-col `}>
        
        {/* Header */}
        {activeChat.open ===true ? 
        <div className="h-16 border-b border-zinc-800 flex  px-4 text-white bg-blue-200">
          <button className="mr-4 md:hidden" onClick={()=>setIsOpen(false)}>
            <FaCircleArrowLeft size={20} className="text-white"/>
          </button>
          <div className="flex flex-col items-center  py-2">
              <h1 className="h-12 self-start mx-4 text-2xl">{activeChat.username}</h1> 
             {active ? <p className="self-start mx-4">{active}</p>:null } 
         </div>
        </div>
        :<div className="h-16 border-b border-zinc-800 flex items-center px-4  text-white">
          User Name
        </div>}
        

        {/* Messages */}
        <div 
        ref={chatRef}
        className="flex-1 flex-col-reverse bg-white overflow-y-auto p-4 ">
          
          {/* Messages go here */}
          {activeChat ?
          
         <ChatText id={activeChat.id} setActive={setActive}/>
       :null}
        </div>

        {/* Input */}
        <div className="h-16 border-t border-zinc-800 bg-transparent  flex items-center px-4">
          <form onSubmit={(e)=>handleSubmit(e)} className=" w-full flex bg-transparent ">
             <input
            type="text"
            value={inputValue}
            onChange={(e)=>setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none"
          />
          <button className="bg-blue-500 text-white px-2 py-1">send</button>
          </form>
        </div>
      </div>

    </div>
  )
}
