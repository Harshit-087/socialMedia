"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useUser } from "@/hooks/userhook";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

type HandleProps = {
  handle: (value: string) => void;
};

export default function CommentText({ handle }: HandleProps) {
  const [commentValue, setCommentValue] = useState<string>("");
  const { profileImage, username } = useUser();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleTextComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleSubmitText = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentValue.trim()) return;
    handle(commentValue);
    setCommentValue("");
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <motion.div
      className="w-full bg-zinc-900/80 backdrop-blur-md border-t border-zinc-700 p-3 flex items-center fixed bottom-0 left-0 right-0 z-50"
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Avatar */}
      <div className="w-12 h-12 relative rounded-full overflow-hidden border border-zinc-700 flex-shrink-0">
        <Image
          src={profileImage || "/default-avatar.png"}
          alt={username || "User"}
          fill
          className="object-cover"
        />
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmitText}
        className="flex-1 ml-3 flex flex-col gap-1"
      >
        <div className="flex justify-between items-center">
          <p className="text-sm text-zinc-200 font-medium">
            {username || "Anonymous"}
          </p>
          <p className="text-xs text-zinc-400">
            {formatDistanceToNow(new Date(), { addSuffix: true })}
          </p>
        </div>

        <div className="flex items-end gap-2 mt-1">
          <textarea
            ref={inputRef}
            id="comment"
            name="comment"
            value={commentValue}
            onChange={handleTextComment}
            placeholder="Write your comment..."
            className="flex-1 text-sm bg-zinc-800 text-white border border-zinc-600 rounded-xl px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            rows={1}
            wrap="hard"
          ></textarea>

          <button
            type="submit"
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors active:scale-95"
          >
            <Send className="text-white w-5 h-5" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}
