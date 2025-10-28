"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { EllipsisVertical, X } from "lucide-react";
import axios,{AxiosResponse} from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {useMutation} from "@tanstack/react-query"
import {ApiError} from "../auth/loginCard"
import {postQuery} from "@/app/api/postQuery"
import toast from "react-hot-toast"
import {useUser} from "@/hooks/userhook"
 
type ImageProps = {
  props: {
    pic: { media: [{publicId: string,url: string }] };
    close: () => void;
  };
};



type ImageResponse = {
    msg?:string
   
}

type ImageVariable={
  publicId:string,
  token:string
}

export default function ImageComponent({ props }: ImageProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePublicId,setImagePublicId] = useState<string>("")
  const [open,setOpen] =useState<boolean>(false);
  const {token} =useUser();

  useEffect(() => {
    setImageUrl(props.pic.media[0]?.url.trimStart());
    setImagePublicId(props.pic?.media[0].publicId);
  }, [props]);

  const deletePostMutation=useMutation<AxiosResponse<ImageResponse>,ApiError,ImageVariable>({
   mutationFn:async({publicId,token}:ImageVariable)=>{
    return await postQuery.deletePost(publicId,token)
   },
   onSuccess:(res:AxiosResponse<ImageResponse>)=>{
      toast.success(res?.data?.msg || "delete success")
      console.log("delete success",res)
   },
   onError:(err:ApiError)=>{
    toast.error("delete fails")
    console.log("delete fails ",err)
   }
  })

 

  return (
    <AnimatePresence>
      {imageUrl && (
        <motion.div
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-50 overflow-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={props.close}
        >
          {/* Top Action Buttons */}
          <div
            className="absolute top-6 right-6 flex items-center gap-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
         <div className="relative inline-block">
  {/* Toggle button */}
  <button
    onClick={() => setOpen(!open)}
    className="p-2 bg-zinc-800/70 hover:bg-zinc-700 rounded-full text-white transition"
    title="Options"
  >
    <EllipsisVertical size={20} />
  </button>

  {/* Dropdown menu */}
  {open && (
    <div className="absolute right-0 top-10 w-24 rounded-lg bg-white text-black flex flex-col shadow-lg">
      <button
        onClick={() => {
          deletePostMutation.mutate({ publicId: imagePublicId, token });
          setOpen(false);
        }}
        className="w-full py-2 hover:bg-gray-100 text-left px-3 rounded-lg transition"
      >
        Delete
      </button>
    </div>
  )}
</div>

            <button
              onClick={props.close}
              className="p-2 bg-red-600 hover:bg-red-500 rounded-full text-white transition"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Centered Image */}
          <motion.div
            className="relative w-full max-w-6xl h-auto flex justify-center items-center px-4 py-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            onClick={(e:React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <div className="relative w-full h-auto max-h-[90vh] flex justify-center">
              <Image
                src={imageUrl}
                alt="Preview"
                width={1200}
                height={800}
                className="object-contain w-auto h-full max-h-[90vh] rounded-xl select-none"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
