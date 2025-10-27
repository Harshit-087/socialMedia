"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { EllipsisVertical, X } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

type ImageProps = {
  props: {
    pic: { media: [{ url: string }] };
    close: () => void;
  };
};

export default function ImageComponent({ props }: ImageProps) {
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    setImage(props.pic.media[0]?.url.trimStart());
  }, [props]);

  const handleRemove = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/remove`);
      alert("Image removed successfully!");
    } catch (error) {
      console.error("Failed to remove image:", error);
    }
  };

  return (
    <AnimatePresence>
      {image && (
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
            <button
              onClick={handleRemove}
              className="p-2 bg-zinc-800/70 hover:bg-zinc-700 rounded-full text-white transition"
              title="Options"
            >
              <EllipsisVertical size={20} />
            </button>

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
            onClick={(e:any) => e.stopPropagation()}
          >
            <div className="relative w-full h-auto max-h-[90vh] flex justify-center">
              <Image
                src={image}
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
