"use client"
import { useState } from "react"
import Image from "next/image"
import { CiMenuBurger } from "react-icons/ci";
import { GiFlexibleStar } from "react-icons/gi";
import CommunityProfile from "./community";
import CreateCommunity from "./createcommunity";
import SidebarWidgets from "./trendingCommunity";
import SidebarFeatures from "./sidebarFeature";

export default function CommunityDashboard({
    Sidebar, value, community, open, create, openCreate
}: {
    Sidebar: () => void,
    value: boolean,
    community: (v: string|null) => void,
    open: string | null,
    create: (v: boolean) => void,
    openCreate: boolean | null
}) {

    return (
        /* Fixed height to screen to prevent double scrollbars */
        <div className="w-full h-screen flex flex-col bg-[#0a052e] overflow-hidden">
            
            {/* Navbar */}
            <div className="flex w-full h-16 shrink-0 items-center px-4 border-b border-white/10">
                <CiMenuBurger 
                    size={24} 
                    className="cursor-pointer text-white lg:hidden" 
                    onClick={() => Sidebar()}
                />
                <h1 className="flex-1 text-center lg:text-left lg:px-4 text-white font-bold text-xl tracking-wider">culthub</h1>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden lg:grid-cols-3">

                {/* leftmost for lg scrren side panel */}
                <div className="w-lg h-full hidden lg:flex flex-col ">
                <SidebarFeatures Sidebar={Sidebar} value={value} community={community} create={create}/>
                </div>

                {/* Left Side: Feed (Scrollable) */}
                <div className="w-full md:w-[60%]  lg:w-[65%] h-full overflow-y-auto px-4 pb-10 custom-scrollbar">
                    
                    <div className={`flex-col gap-2 mt-6 ${open ? "hidden" : "flex"}`}>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3"> 
                            <GiFlexibleStar size={35} className="text-emerald-400"/> 
                            Discover Communities
                        </h1>
                        <p className="text-slate-400 text-sm ml-1">Find your tribe and connect with like-minded people</p>

                        {/* Filter Buttons */}
                        <div className="flex gap-3 my-6">
                            <button className="bg-blue-600 text-white rounded-full px-5 py-2 text-sm font-medium transition hover:bg-blue-700">All Communities</button>
                            <button className="bg-white/5 text-white border border-white/10 rounded-full px-5 py-2 text-sm font-medium transition hover:bg-white/10">My communities</button>
                        </div>
          
                        {/* Community Card Grid */}
                        <div className="grid grid-cols-1 gap-6 ">
                            {/* Card Item */}

                            <div 
                                className="group relative w-full  h-64 rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all"
                                onClick={() => community("comunity1")}
                            >
                                {/* Background Image with Overlay */}
                                <Image src="/images/qunt.jpg" alt="bg" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                {/* Info Content */}
                                <div className="absolute bottom-0 w-full p-6 flex items-end gap-4 backdrop-blur-md bg-white/10 border-t border-white/10">
                                    <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl -translate-y-2">
                                        <Image src="/images/user.png" alt="user" fill className="object-cover"/>
                                    </div>
                                    <div className="flex-1 pb-1">
                                        <h3 className="text-white font-bold text-lg">Tech Innovators</h3>
                                        <p className="text-slate-300 text-xs line-clamp-1">Discussing AI, web3 and emerging technologies</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">10,000 members</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>

                {/* Right Side: Sidebar Widgets (Hidden on Mobile) */}
                {!open &&(
                   <div className="hidden md:flex md:w-[40%] lg:w-[35%] h-full overflow-y-auto  px-6 items-start py-6 custom-scrollbar">
                   <SidebarWidgets />
                </div>
                )}
             

            </div>
            
            {/* Community Detail View */}
                    {open && <CommunityProfile />}

            {/* Overlays */}
            {openCreate && <CreateCommunity closeCreate={create} />}
        </div>
    )
}