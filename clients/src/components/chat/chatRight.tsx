"use client"
import {useState} from "react"
import { FaCircleArrowLeft } from "react-icons/fa6";
import ChatText from "@/components/chat/chatTextSender";
import {useUser} from "@/hooks/userhook"

export default function ChatRight({
    mobileOpen,setMobile,activeChat,submit}
    :{
        mobileOpen:boolean,
        setMobile:(v:boolean)=>void,
        activeChat:{
             username: string,
            id: string,
           open: boolean,
        },
        submit:(e:React.FormEvent)=>void}){
 
         const {userId} = useUser();   
      const [active , setActive] = useState<string>("offline")
        const conver_id = userId && activeChat.id?[userId,activeChat.id].sort().join("_"):"" ;


    
    return(
        <div className={`${mobileOpen ? "flex" : "hidden"} flex-1 md:flex flex-col`}>
  <div className="h-16 border-b border-zinc-800 flex items-center px-4 bg-zinc-900">
    <button className="mr-4 md:hidden text-white hover:text-green-400 transition-colors" onClick={() => setMobile(false)}>
      <FaCircleArrowLeft size={20} />
    </button>
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold text-white">{activeChat.username || "User Name"}</h1>
      <span className={`text-sm ${active === "online" ? "text-green-400" : "text-gray-400"} italic`}>{active}</span>
    </div>
  </div>

  {/* Messages area */}
  <div className="flex-1 bg-zinc-950 overflow-y-auto p-4 rounded-t-2xl">
    {activeChat.id ? 
    <ChatText id={activeChat.id} setActive={setActive} convers_Id={conver_id} /> 
    : <div className="text-zinc-400 italic">Select a chat to start messaging.</div>}
  </div>

  {/* Input */}
  <div className="h-16 border-t border-zinc-800 bg-zinc-900 flex items-center px-4">
    <form onSubmit={submit} className="w-full flex gap-2">
      <input
        name="message"
        type="text"
        placeholder="Type a message..."
        className="w-full bg-zinc-800 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-500 transition"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-5 py-2 rounded-xl font-semibold hover:bg-green-600 transition-colors"
      >
        Send
      </button>
    </form>
  </div>
</div>
    )
}