// app/components/chat/ChatDashboard.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/userhook";
import { followQuery } from "@/app/api/followQuery";
import { GetSocket } from "@/lib/socket";
import { FaCircleArrowLeft } from "react-icons/fa6";
import Link from "next/link";
import ChatText from "@/components/chat/chatTextSender";
import Image from "next/image";
import { Socket } from "socket.io-client";
import {messageQuery} from "@/app/api/messageQuery";
import { CiSearch } from "react-icons/ci";

type Account = {
  followId: {
    username: string;
    profileImage: string;
    _id: string;
  };
};

export default function ChatDashboard() {
  const { userId } = useUser();
  const queryClient = useQueryClient();
  const [active , setActive] = useState<string>("offline")

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
   queryKey: ["following", userId],
    queryFn:async () => {
      if (!userId) throw new Error("invalid id");
      const res = await followQuery.fetchFollowingAccounts(userId);
      return res.data.data;
    },
     enabled: !!userId 
});

  // Initialize socket when userId is available (defer server-side issues)
  useEffect(() => {
    if (!userId || !following?.length) return;

    // create socket instance (GetSocket should handle creating/returning connected socket)
    // If GetSocket returns a single shared socket per user, adapt accordingly.
    const s = GetSocket(userId, following[0].followId._id);
    socketRef.current = s;

    const onConnect = () => console.log("socket connected", s.id);
    s.on("connect", onConnect);

    return () => {
      s.off("connect", onConnect);
      // NOTE: don't call s.disconnect() here if GetSocket manages a shared socket
      // If GetSocket returns a dedicated socket per component, you may want to disconnect.
    };
  }, [userId, following]);

  // handle incoming realtime messages (invalidate react-query so UI refreshes)
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;

    const onNewMessage = (payload: { roomId?: string; message?: string }) => {
      // Invalidate message queries so the UI refreshes with the latest messages.
      // Use a partial query key so all conversations for this user are refreshed,
      // regardless of the specific roomId used in the cache key.
       if (payload?.roomId) {
          queryClient.invalidateQueries({
          queryKey: ["senderMessages", userId],
        });
      }
      // Also invalidate the active chat if open (so header preview / last message updates)
      queryClient.invalidateQueries({ queryKey: ["following", userId] });
      console.log("new-message payload", payload);
    };

    s.on("new-message", onNewMessage);
    return () => {
      s.off("new-message", onNewMessage);
    };
  }, [queryClient, userId]);

  // Send message through socket; ensure activeChat.id is used (not data[0])
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const input = form.querySelector("input[name='message']") as HTMLInputElement | null;
      const value = input?.value?.trim();
      if (!value || !userId || !activeChat.id) return;

      // optimistic UI: invalidate so React Query re-fetches messages
      queryClient.invalidateQueries({ queryKey: ["senderMessages", userId, activeChat.id] });

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
    setActiveChat({
      username: account.followId.username,
      id: account.followId._id,
      open: true,
    });

    // On mobile, open the chat view (desktop will still display both columns)
    setMobileOpen(true);

    // prefetch messages for faster UX as usr click on contact
    queryClient.prefetchQuery({
      queryKey:["senderMessages", userId, account.followId._id],
      queryFn:async()=>{
        if(!userId) throw new Error("invalid id")
        const res = await messageQuery.fetchMessage(userId,account.followId._id)
        return res.data.data
      }
    });
  }, [queryClient, userId]);

  // layout classes: mobile-first; md: show both columns.
  // left panel: w-full on small, fixed on md+
  // right panel: hidden on small until mobileOpen true; md:flex always show
  return (
    <div className="h-screen w-full bg-zinc-900 flex">
      {/* Left: Conversation List */}
<div
  className={`${
    mobileOpen ? "hidden" : "flex"
  } w-full md:flex md:w-60 lg:w-80 border-r border-zinc-800 flex-col bg-zinc-900`}
>
  <div className="h-14 px-2 flex items-center border-b border-zinc-800">
    <Link href="/account/dashboard">
      <FaCircleArrowLeft size={20} className="text-white hover:text-green-400 transition-colors" />
    </Link>
    <h1 className="px-4 text-white font-semibold text-lg">Chats</h1>
  </div>

  <div className="p-2 w-full">
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

  <div className="flex-1 overflow-y-auto py-2">
    {followingLoading && <p className="text-white px-4">Loading contacts...</p>}
    {following?.map((item) => (
      <button
        key={item.followId._id}
        onClick={() => handleSelectContact(item)}
        className="w-full h-16 px-4 py-2 text-white rounded-xl bg-zinc-800 flex items-center gap-3 hover:bg-zinc-700 transition-colors"
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-inner">
          <Image src={item.followId.profileImage} alt={item.followId.username} fill className="object-cover" />
        </div>

        <div className="flex-1 text-left">
          <h2 className="text-sm font-medium">{item.followId.username}</h2>
          <span className="text-xs text-zinc-400 italic">Online / last message</span>
        </div>
      </button>
    ))}
  </div>
</div>

{/* Right: Chat Window */}
<div className={`${mobileOpen ? "flex" : "hidden"} flex-1 md:flex flex-col`}>
  <div className="h-16 border-b border-zinc-800 flex items-center px-4 bg-zinc-900">
    <button className="mr-4 md:hidden text-white hover:text-green-400 transition-colors" onClick={() => setMobileOpen(false)}>
      <FaCircleArrowLeft size={20} />
    </button>
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold text-white">{activeChat.username || "User Name"}</h1>
      <span className={`text-sm ${active === "online" ? "text-green-400" : "text-gray-400"} italic`}>{active}</span>
    </div>
  </div>

  {/* Messages area */}
  <div className="flex-1 bg-zinc-950 overflow-y-auto p-4 rounded-t-2xl">
    {activeChat.id ? <ChatText id={activeChat.id} setActive={setActive} /> : <div className="text-zinc-400 italic">Select a chat to start messaging.</div>}
  </div>

  {/* Input */}
  <div className="h-16 border-t border-zinc-800 bg-zinc-900 flex items-center px-4">
    <form onSubmit={handleSubmit} className="w-full flex gap-2">
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

    </div>
  );
}
