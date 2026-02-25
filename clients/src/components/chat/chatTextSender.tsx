// app/components/chat/chatTextSender.tsx
"use client";

import React, { useEffect,useLayoutEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/userhook";
import { messageQuery } from "@/app/api/messageQuery";


export type Message = {
  _id?: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  message: string;
  mediaUrl?: string;
  isRead?: boolean;
  createdAt?: string;
};

export default function ChatText({ id, setActive,convers_Id }: { id: string; setActive: (v: string) => void; convers_Id?:string }) {
  const { userId } = useUser();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError, error, isFetching } = useQuery<Message[]>({
    queryKey: ["senderMessages",id,convers_Id],
    queryFn: async () => {
      if (!userId || !id) return [];
      console.log("Fetching messages for:", convers_Id);
      const res = await messageQuery.fetchMessage(id,convers_Id);
      // backend returns isActive as number (1) or undefined/0
      setActive(res?.data?.isActive === 1 ? "online" : "offline");
     
      return res.data.data as Message[];
    },
    
      enabled:  !!convers_Id ,
      
        // optional: refetch on window focus for live-ish behavior
        refetchOnWindowFocus: false,
    }
  );

  // on message received via socket, invalidate this query to refresh messages
  

  // scroll to bottom when messages change
  // useLayoutEffect runs after React has updated the DOM, but before the browser paints.
  useLayoutEffect(() => {
    if (!bottomRef.current) return;
    // use smooth only when not initial load, or you can always use smooth
    bottomRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [data?.length]);

  // debug log for query errors (keeps console clean)
  useEffect(() => {
    if (error) {
      console.error("ChatText query error:", error);
    }
  }, [error]);

  if (isLoading) return <p className="text-zinc-600">Loading messages...</p>;
  if (isError) return <p className="text-red-500">Error loading messages</p>;



  return (
   <div className="flex flex-col gap-2">
  {data?.length === 0 && (
    <div className="text-zinc-400 italic text-center mt-4">
      No messages yet. Say hi 👋
    </div>
  )}

  {data?.map((item: Message, index: number) => {
    const mine = item.senderId === userId;
    return (
      <div
        key={item._id || index} // use index as fallback key if _id is not available
        className={`max-w-[75%] px-4 py-2 rounded-2xl break-words relative shadow-sm
          ${mine
            ? "self-end bg-gradient-to-br from-green-600 to-green-800 text-white"
            : "self-start bg-gradient-to-br from-pink-500 to-pink-700 text-white"}
        `}
      >
        {item.message}
       
      </div>
    );
  })}

  {/* sentinel element to scroll into view */}
  <div ref={bottomRef} />
</div>

  );
}
