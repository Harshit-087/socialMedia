"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FaCircleArrowLeft } from "react-icons/fa6";
import Footer from "../footer/footer";

export default function SidebarChat({ isOpen, open }: { isOpen: boolean; open: () => void }) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          // 1. Sidebar Slide + Fade
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            staggerChildren: 0.1 // 2. Animates children one by one
          }}
          className="relative hidden lg:flex w-[320px] h-full flex-col
          bg-[#0f0a24] border-r border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header Animation */}
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-6 py-6 flex items-center justify-between border-b border-white/5 bg-black/10"
          >
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Chats</h2>
              <p className="text-[10px] text-green-400 uppercase font-bold tracking-widest mt-1">
                System Online
              </p>
            </div>

            <button
              onClick={open}
              className="p-2 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
            >
              <FaCircleArrowLeft
                size={22}
                className="text-zinc-500 group-hover:text-green-400 transition-colors"
              />
            </button>
          </motion.div>

          {/* Navigation / Content Animation */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex-1 px-3 py-6 overflow-y-auto custom-scrollbar"
          >
            <Footer />
          </motion.div>

          {/* Subtle Bottom Glow Decor */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}