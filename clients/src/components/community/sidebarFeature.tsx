import { FaArrowAltCircleLeft } from "react-icons/fa";
import { motion, AnimatePresence, transform } from "framer-motion"
import { IoMdRocket } from "react-icons/io";
import { IoGameControllerOutline } from "react-icons/io5"
import { IoAddCircleOutline } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { FaGlobeAmericas } from "react-icons/fa";

export  default function SidebarFeatures({
    Sidebar, value, community, create
}: {
    Sidebar: () => void,
    value: boolean,
    community: (v: string | null) => void,
    create: (v: boolean) => void
}){
    return(
        <>
        <div className="px-4 mb-6">
                            <input 
                                type="text"
                                placeholder="Search..." 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-col px-3 gap-2">
                            <div 
                                onClick={() => { community(null); Sidebar(); }}
                                className="w-full h-12 bg-blue-600 rounded-xl flex items-center px-4 cursor-pointer hover:bg-blue-500 text-white gap-3 transition-all"
                            >
                                <GoHomeFill size={24}/>
                                <p className="font-semibold">Home</p>
                            </div>
                            <div className="w-full h-12 bg-white/5 hover:bg-white/10 rounded-xl flex items-center px-4 cursor-pointer text-white gap-3 transition-all">
                                <FaGlobeAmericas size={22}/>
                                <p className="font-semibold">Discover</p>
                            </div>
                        </div>

                        <p className="px-6 mt-8 mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">My communities</p>

                        <div className="flex flex-col px-3 gap-2 overflow-y-auto">
                            <div className="w-full p-4 rounded-xl bg-white/5 flex items-center gap-4 hover:bg-white/10 cursor-pointer transition-all border border-white/5 group">
                                <div className="p-2 bg-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                                    <IoMdRocket size={24} className="text-white"/>
                                </div>
                                <div className="text-white">
                                    <p className="font-bold leading-tight">Tech Innovators</p>
                                    <span className="text-[10px] text-slate-400">10,000 members</span>
                                </div>
                            </div>

                            <div className="w-full p-4 rounded-xl bg-white/5 flex items-center gap-4 hover:bg-white/10 cursor-pointer transition-all border border-white/5 group">
                                <div className="p-2 bg-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                                    <IoGameControllerOutline size={24} className="text-white"/>
                                </div>
                                <div className="text-white">
                                    <p className="font-bold leading-tight">Gaming Giants</p>
                                    <span className="text-[10px] text-slate-400">5,400 members</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => { create(true); Sidebar(); }}
                                className="w-full mt-4 p-4 rounded-xl border-2 border-dashed border-white/10 flex justify-center items-center gap-2 text-slate-400 hover:text-white hover:border-white/30 transition-all"
                            >
                                <IoAddCircleOutline size={24}/>
                                <p className="font-medium">Create Community</p>
                            </button>
                        </div>
                        </>
    )
}