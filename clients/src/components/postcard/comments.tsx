"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ThumbsDown, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";

interface Comment {
  _id: string;
  Data: string;
  __v: number;
  createdAt: string;
  parentId: string | null;
  postId: {
    _id: string;
  };
  userId: {
    _id: string;
    profileImage: string;
    username: string;
  };
}

interface CommentProps {
  comments: Comment[];
}

export default function Comments({ comments }: CommentProps) {
  return (
    <div className="w-full flex flex-col gap-4 mt-4">
      {comments.map((comment, idx) => (
        <motion.div
          key={comment._id || idx}
          className="flex gap-4 p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 shadow-md hover:shadow-lg transition-all duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-700">
              <Image
                src={comment.userId?.profileImage || "/default-avatar.png"}
                alt={comment.userId?.username || "User"}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white leading-tight">
                  {comment.userId?.username}
                  <span className="ml-2 text-xs text-zinc-400 font-normal">
                    @{comment.userId?.username}
                  </span>
                </p>
                <p className="text-xs text-zinc-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-sm text-zinc-200 mt-2 leading-relaxed">
              {comment.Data}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-6 mt-3 text-zinc-400">
              <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                <ThumbsUp size={18} />
                <span className="text-xs">Like</span>
              </button>

              <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                <ThumbsDown size={18} />
                <span className="text-xs">Dislike</span>
              </button>

              <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                <MessageSquare size={18} />
                <span className="text-xs">Reply</span>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
