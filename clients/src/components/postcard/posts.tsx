"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ImageComponent from "../postcard/image";
import UploadPost from "./uploadpost";
import { useQuery } from "@tanstack/react-query";
import { postQuery } from "@/app/api/postQuery";
import { PostType } from "@/components/postcard/card";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast"

export default function Posts({userid}:{userid:string}) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [post, setPost] = useState(false);
  
  const modalRef = useRef<HTMLDivElement>(null);
 
  const handleImage = (idx: number) => {
    setSelectedImage(idx);
    setIsOpen(true);
  };

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isOpen]);

  // Fetch posts for this user
  const {
    data: queryData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", userid],
    queryFn: async ({ queryKey }) => {
      const [, userIdFromKey] = queryKey;
      if (!userIdFromKey) return [];
      const res = await postQuery.showPosts(userIdFromKey);
      console.log("queryData",res.data.data)
       toast.success(res.data.msg)
      return res.data?.data;
    },
    refetchOnWindowFocus:false,
    refetchOnReconnect:false,
    refetchOnMount:false,
    enabled: !!userid,
  });

  if (isLoading)
    return (
      <p className="text-lg font-medium text-blue-400 text-center mt-8 animate-pulse">
        Loading posts...
      </p>
    );

  if (error) {
    console.error("useQuery showPosts error:", error);
  }

  return (
    <>
      <section className="w-full flex flex-col bg-gradient-to-b from-zinc-950 to-zinc-900 text-white pb-20 px-4">
        {/* Header Bar */}
        <div className="flex justify-between items-center mt-6 bg-zinc-800/70 backdrop-blur-sm rounded-xl px-5 py-3 border border-zinc-700 shadow-md">
          <h2 className="text-lg font-semibold">Create a new post</h2>
          <button
            onClick={() => setPost(!post)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
          >
            <PlusCircle size={18} />
            <span>Post</span>
          </button>
        </div>

        {/* Gallery Section */}
        <div id="posts" className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {queryData && queryData.length > 0 ? (
            queryData.map((item: PostType, idx: number) => (
              <motion.button
                key={idx}
                onClick={() => handleImage(idx)}
                className="relative overflow-hidden rounded-xl group shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <Image
                  src={item.media[0]?.url || "/placeholder.png"}
                  alt="Post"
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover rounded-xl transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-sm text-white font-medium">View</p>
                </div>
              </motion.button>
            ))
          ) : (
            <p className="text-center text-zinc-400 col-span-full mt-10">
              No posts yet. Start sharing your moments ✨
            </p>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {isOpen && selectedImage !== null && (
          <motion.div
            ref={modalRef}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              onClick={(e:React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
            >
              <ImageComponent
                props={{
                  pic: queryData[selectedImage!],
                  close: () => setIsOpen(false),
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Post Modal */}
      {post && <UploadPost onClose={() => setPost(false)} />}
    </>
  );
}
