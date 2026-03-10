"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaRegBell, FaShareAlt } from "react-icons/fa";
import { useState } from "react";

export default function CommunityProfile() {
    const [activeTab, setActiveTab] = useState("Post");

    const tabs = [
        { name: "Post" },
        { name: "Media" },
        { name: "Discussion" },
        { name: "Events" },
        { name: "Members" },
        { name: "About" },
    ];

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            /* Changed to relative so it fits inside your dashboard column flow */
            className="w-full min-h-full bg-transparent pt-4 z-30"
        >
            {/* Header Card */}
            <div className="w-[90%] mx-auto h-64 md:h-72 relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
                
                {/* Banner Image */}
                <div className="relative w-full h-full">
                    <Image 
                        src="/images/qunt.jpg" 
                        alt="Community Banner" 
                        fill 
                        className="object-cover"
                        priority
                    />
                    {/* Dark gradient overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a052e] via-transparent to-black/20" />
                </div>

                {/* Info Bar (Floating at bottom) */}
                <div className="absolute bottom-0 w-full p-4 md:p-6 backdrop-blur-xl bg-white/10 border-t border-white/20">
                    <div className="flex flex-col gap-4">
                        
                        {/* Top Row: Title & Avatar */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-xl border-2 border-white/30 shrink-0">
                                <Image src="/images/user.png" alt="Community Logo" fill className="object-cover" />
                            </div>
                            <div className="text-white">
                                <h2 className="text-xl md:text-2xl font-bold leading-tight">Tech Innovators</h2>
                                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">120,000 members</p>
                            </div>
                        </div>

                        {/* Bottom Row: Actions */}
                        <div className="flex items-center gap-3">
                            <button className="flex-1 md:flex-none md:w-48 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                                Join Community
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors">
                                <FaRegBell size={18} />
                            </button>
                            <button className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors">
                                <FaShareAlt size={18} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-6 border-b border-white/10 flex flex-wrap overflow-x-auto no-scrollbar scroll-smooth">
                {tabs.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className={`px-6 py-3 text-sm font-semibold transition-all relative shrink-0 ${
                            activeTab === item.name ? "text-blue-400" : "text-slate-400 hover:text-white"
                        }`}
                    >
                        {item.name}
                        {activeTab === item.name && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_10px_#60a5fa]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Placeholder */}
            <div className="py-10 h-screen overflow-y-scroll text-slate-500 text-center italic flex  bg-white">
                <div className="w-">
                <p>Showing {activeTab} content...</p>
                </div>
                <div className=""></div>
                
            </div>
        </motion.div>
    )
}