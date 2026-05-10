// app/components/chat/ChatDashboard.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/userhook";
import { followQuery } from "@/app/api/followQuery";
import { GetSocket } from "@/lib/socket";
import Link from "next/link";
import Image from "next/image";
import { Socket } from "socket.io-client";
import { CiSearch } from "react-icons/ci";
import ChatRight from "@/components/chat/chatRight";
import { BsChatDots } from "react-icons/bs"
import SidebarChat from "@/components/chat/sidebar";
import { CiMenuBurger } from "react-icons/ci";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { AnimatePresence } from "framer-motion";
import Footer from "@/components/footer/footer";

type Account = {
  followerId?: {
    username: string;
    profileImage: string;
    _id: string;
  },
  followingId?: {
    username: string;
    profileImage: string;
    _id: string;
  };
};


export default function ChatDashboard() {
  const { userId ,token} = useUser();
  const queryClient = useQueryClient();
  //open sidebar
  const [openSidebar,setOpenSidebar ] =useState<boolean|null>(false);

  // creating all contact to show on left side 
  const [contactList , setContactList ] =useState<Account[] >([]);
  
  const [openChat ,setOpenChat] = useState<boolean>(false);
  // UI state
  const [activeChat, setActiveChat] = useState<{ username: string; id: string; open: boolean }>({
    username: "",
    id: "",
    open: false,
  });


  // mobile-only panel toggle (false = show contact list; true = show chat)
  const [mobileOpen, setMobileOpen] = useState(false);

  // socket stored in ref to avoid re-subscribing when component re-renders
  const socketRef = useRef<Socket | null>(null);

  // fetch following list
  const { data: following, isLoading: followingLoading } = useQuery<Account[]>({
   queryKey: ["following", userId,token],
    queryFn:async () => {
      if (!userId || !token) throw new Error("invalid id");
      const res = await followQuery.fetchFollowingAccounts(userId,token);
     console.log("following",res.data)
      return res.data.data;
    },
     enabled: !!userId 
});


 // fetch follower list for msg 
 const {data:follower,isLoading:followerLoading}= useQuery<Account[]>({
   queryKey: ["follower", userId,token],
    queryFn:async () => {
      if (!userId || !token) throw new Error("invalid id");
      const res = await followQuery.fetchFollowerAccounts(userId,token);
      console.log("follower",res.data)
      return res.data.data;
    },
     enabled: !!userId 
});


  useEffect(()=>{
  
   setContactList(()=>[...(following ?? []),...(follower ||[])]);
   
  },[following,follower]) 

  // Initialize socket when userId is available (defer server-side issues)
  useEffect(() => {
    if (!userId ) return;

    // create socket instance (GetSocket should handle creating/returning connected socket)
    // If GetSocket returns a single shared socket per user, adapt accordingly.
    const s = GetSocket(userId);
    socketRef.current = s;

    const onConnect = () => console.log("socket connected", s.id);
    s.on("connect", onConnect);

    

    // handle incoming realtime messages (invalidate react-query so UI refreshes)
   const onNewMessage = (payload: {message:string,conversationId:string,id:string}) => {
      // Invalidate message queries so the UI refreshes with the latest messages.
      // Use a partial query key so all conversations for this user are refreshed,
      // regardless of the specific roomId used in the cache key.
       if (payload?.message && payload.conversationId) {
          queryClient.invalidateQueries({
          queryKey: ["senderMessages",payload.id,payload.conversationId,token]
        });
      }
    // setting to send in chatText to send the fetch query in backend ..
      

      // if refreshed ..
      // Also invalidate the active chat if open (so header preview / last message updates)
      queryClient.invalidateQueries({ 
        queryKey: ["senderMessages",payload.id,payload.conversationId,token],
       refetchType: "active"});
      console.log("new-message payload", payload.message,payload.conversationId);
    };
 
    s.on("new-message", onNewMessage); 
    return () => {
      s.off("connect", onConnect);
      s.off("new-message", onNewMessage);
      // NOTE: don't call s.disconnect() here if GetSocket manages a shared socket
      // If GetSocket returns a dedicated socket per component, you may want to disconnect.
    };
  }, [userId]);
//  here following account [0].followid._id is not used because if 1 folllow other while 2 donot follow the sender then the invalidation does not happen .
// no msg reach to reciever...
  
  //  
  //  (e: React.FormEvent<HTMLFormElement | Element>) => {  


  // Send message through socket; ensure activeChat.id is used (not data[0])
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement|Element>) => {
      e.preventDefault();
      const form = (e as React.FormEvent<HTMLFormElement>).currentTarget;
      const input = form.querySelector("input[name='message']") as HTMLInputElement | null;
      const value = input?.value?.trim();
      if (!value || !userId || !activeChat.id) return;
      const newConversationId= [userId,activeChat.id].sort().join("_");

      // optimistic UI: invalidate so React Query re-fetches messages
      queryClient.invalidateQueries({ 
        queryKey: ["senderMessages",activeChat.id,newConversationId,token] ,
        refetchType:"active"});

      socketRef.current?.emit("chat-message", {
        message: value,
        senderId: userId,
        receiverId: activeChat.id,
      });

      

      // clear the input
      if (input) input.value = "";
    },
    [activeChat.id, queryClient, userId]
  );

  // function creates once not again and again as re-render, due to useCallback.
  //  only when dependency cahnge the new function is created .
  const handleSelectContact = useCallback((account: Account) => {
   
    const otherUserId = account.followerId?._id || account.followingId?._id;
    if(!otherUserId) return ;

    setActiveChat({
      username: account.followerId?.username || account.followingId?.username || "Unknown",  // showing all the contact either we followed it or vice-versa.
      id: otherUserId ,
      open: true,
    });

    setOpenChat(true);

    // On mobile, open the chat view (desktop will still display both columns)
    setMobileOpen(true); 

     }, [queryClient, userId]);

  // layout classes: mobile-first; md: show both columns.
  // left panel: w-full on small, fixed on md+
  // right panel: hidden on small until mobileOpen true; md:flex always show
 
  //callback 
  const handleScreen =(v:boolean)=>{
    setMobileOpen(v);
  }

  //open sidebar
  const handleOpenSidebar = ()=>{
    setOpenSidebar(prev =>!prev);
  }


  return (
    <div className="h-screen w-full bg-zinc-900 flex overflow-hidden">
      {/* Left: Conversation List */}
<div
  className={`${
    mobileOpen ? "hidden" : "flex"
  }  w-full md:flex md:w-60 lg:w-80 border-r border-zinc-800 flex-col bg-zinc-900`}
>
  <div className="h-14 px-2 flex items-center border-b border-zinc-800">
    <Link href="/account/dashboard"><FaCircleArrowLeft
                  size={20}
                  className="text-gray-300 hover:text-green-400 max-md:block hidden"
                />
                </Link>
       {/*here */}
      <CiMenuBurger 
                          size={24} 
                          className="cursor-pointer text-white max-md:hidden" 
                          onClick={() =>handleOpenSidebar() }
                      />
    
    <h1 className="px-4 text-white font-semibold text-lg">Chats</h1>
  </div>

  <div className="p-2 w-full border-b-2 border-gray-800">
    <label htmlFor="searchContacts" className="flex  h-12 border-2 border-zinc-700 rounded-xl overflow-hidden">
      <input
        name="search"
        type="text"
        placeholder="Search"
        className="text-white bg-zinc-800 flex-1  px-2 outline-none"
      />
      <button className="bg-green-500 py-1 px-4 md:px-2 font-medium hover:bg-green-600 transition-colors">
        <CiSearch size={18} className="text-white" />
      </button>
    </label>
  </div>

  <div className="flex-1 overflow-y-auto  py-1 relative overflow-x-hidden ">
    {followingLoading &&  <p className="text-white px-4">Loading contacts...</p>}
         {contactList?.map((item) => (
      <button
        key={item.followerId?._id || item.followingId?._id}
        onClick={() => handleSelectContact(item)}
        className="w-full h-16 px-4 py-2 text-white rounded-xl bg-zinc-800 flex items-center gap-3 hover:bg-zinc-700 transition-colors my-2"
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-inner">
          <Image src={item.followerId?.profileImage || item.followingId?.profileImage || "/images/user.png"} alt={"/images/user.png"} fill className="object-cover" />
        </div>

        <div className="flex-1 text-left ">
          <h2 className="text-sm font-medium">{item.followerId?.username || item.followingId?.username}</h2>
          <span className="text-xs text-zinc-400 italic">Online / last message</span>
        </div>
      </button>
      
    ))}
    <div className="lg:hidden fixed text-white bg-white bottom-0 w-full h-12 p-4">
      <Footer/>
    </div>
   {/* <div className=" ">
      <div className="flex items-center gap-2 p-2 border-t-2 border-dashed">
        <Cog size={20}
         className={`transition-transform duration-300 group-hover:scale-110 `} />
        <p className="font-serif text-xl"> Setting</p>
      </div>
    </div> */}
  </div>
   
</div>

    {/* Right: Chat Window */}
    {openChat ?
      <ChatRight mobileOpen={mobileOpen} setMobile={handleScreen} activeChat={activeChat} submit={handleSubmit}/>
    :
    <div className={`hidden md:flex flex-1 items-center justify-center bg-gradient-to-b from-zinc-950 to-zinc-900`}>
      <div className="text-center max-w-sm px-6">

        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-800 flex items-center justify-center mb-6 shadow-lg">
          <BsChatDots className="text-zinc-400 text-4xl" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-white mb-2">
          Select a conversation
        </h2>

        {/* Subtitle */}
        <p className="text-zinc-400 text-sm leading-relaxed">
          Choose a chat from the left to start messaging.
          Your messages will appear here.
        </p>

      </div>
    </div>}
   
  <AnimatePresence>
{openSidebar&&(<SidebarChat isOpen={openSidebar} open={handleOpenSidebar}/>)}
    </AnimatePresence>
    </div>
  );
}
