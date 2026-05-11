"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
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
  createdAt: string;
};

export default function ChatText({ id, setActive, convers_Id }: { id: string; setActive: (v: string) => void; convers_Id?: string }) {
  const { userId, token } = useUser();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isError, error } = useQuery<Message[]>({
    // CRITICAL: Must match the order used in ChatDashboard.tsx invalidation
    queryKey: ["senderMessages", id, convers_Id, token], 
    queryFn: async () => {
      if (!userId || !id || !token || !convers_Id) return [];
      const res = await messageQuery.fetchMessage(id, token, convers_Id);
      
      if (res?.data) {
        setActive(res.data.isActive === 1 ? "online" : "offline");
        return res.data.data as Message[];
      }
      return [];
    },
    enabled: !!convers_Id && !!token && !!userId,
    refetchOnWindowFocus: false,
  });

  // Scroll to bottom logic
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(() => {
    if (data && data.length > 0) {
      scrollToBottom();
    }
  }, [data]); // Trigger every time the data array changes

  if (isLoading) return <div className="p-4 text-zinc-500 animate-pulse">Loading messages...</div>;
  if (isError) return <div className="p-4 text-red-500">Failed to load chat.</div>;

  return (
    <div className="flex flex-col gap-3 px-4 pt-2 min-h-full">
      {data?.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-zinc-500 italic">
          No messages yet. Say hi 👋
        </div>
      ) : (
        data?.map((item: Message, index: number) => {
          const isMe = item.senderId === userId;
          return (
            <div
              key={item._id || `${item.createdAt}-${index}`} // Fallback key if _id is missing
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm break-words
                  ${isMe 
                    ? "bg-green-600 text-white rounded-br-none" 
                    : "bg-zinc-800 text-white rounded-bl-none"}
                `}
              >
                <p className="text-sm md:text-base">{item.message}</p>
              </div>
              
              {/* Optional: Add a tiny timestamp */}
              {item.createdAt && (
                <span className="text-[10px] text-zinc-500 mt-1 px-1">
                  {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          );
        })
      )}
      
      {/* Invisible element to anchor the scroll */}
      <div ref={bottomRef} className="h-1 w-full" />
    </div>
  );
}