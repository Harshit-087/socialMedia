"use client"
import { useState,useEffect } from "react"
import Image from "next/image"
import { CiMenuBurger } from "react-icons/ci";
import { GiFlexibleStar } from "react-icons/gi";
import CommunityProfile from "./communityPanel";
import CreateCommunity from "./createcommunity";
import SidebarWidgets from "./trendingCommunity";
import SidebarFeatures from "./sidebarFeature";


import AllCommunity from "./allcommunity";




export type Item={
    _id:string,
    AdminId:string,
    banner_url:string,
    icon_url:string,
    communityName:string,
    description:string,
    category:string,
    privacy:string,
    theme:string,
   Members_Id?:string[]
}

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
   
   const [selectedCommunity,setSelectedCommunity] = useState<string>("My_communities");
   const [identifyTab , setIdentifyTab] = useState<string>("All_communities");
  

  
   const handleSelectedCommunity=async(value:string)=>{
    setSelectedCommunity(value);
   }

   

    return (
        /* Fixed height to screen to prevent double scrollbars */
        <div className="w-full h-screen flex flex-col bg-[#0a052e] overflow-hidden">
            
            {/* Navbar */}
            <div className="flex w-full h-16 shrink-0 items-center px-4 lg:hidden border-b border-white/10">
                <CiMenuBurger 
                    size={24} 
                    className="cursor-pointer text-white lg:hidden" 
                    onClick={() => Sidebar()}
                />
                <h1 className="flex-1 text-center lg:text-left lg:px-4 text-white font-bold text-xl tracking-wider">culthub</h1>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden  lg:grid-cols-3">

                {/* leftmost for lg scrren side panel */}
                <div className="w-lg h-full hidden lg:flex flex-col ">
                    <div className="w-full my-8 pb-4 pl-5 text-white text-2xl font-serif border-b-2  border-gray-800">culthub</div>
                <SidebarFeatures Sidebar={Sidebar} value={value} community={community} create={create}/>
                </div>

                {/* Left Side: Feed (Scrollable) */}
                <div className={`${open?"hidden":"h-full"} w-full md:w-[60%]  lg:w-[65%]  overflow-y-auto px-4 pb-10 custom-scrollbar`}>
                    
                    <div className={`flex-col gap-2 mt-6 ${open ? "hidden" : "flex"}`}>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3"> 
                            <GiFlexibleStar size={35} className="text-emerald-400"/> 
                            Discover Communities
                        </h1>
                        <p className="text-slate-400 text-sm ml-1">Find your tribe and connect with like-minded people</p>

                        {/* Filter Buttons */}
                        <div className="flex gap-3 my-6">
                            <button 
                            onClick={()=>{
                                setIdentifyTab("All_communities")
                               
                            }}
                            className={`${identifyTab=="All_communities"?"bg-blue-600 hover:bg-blue-700":"bg-white/5 hover:bg-white/10"} text-white rounded-full px-5 py-2 text-sm font-medium transition cursor-pointer `}>All Communities</button>
                            
                            <button 
                             onClick={()=>{
                                setIdentifyTab("My_communities")
                               
                            }}
                            className={`${identifyTab=="My_communities"?"bg-blue-600 hover:bg-blue-700":"bg-white/5 hover:bg-white/10"} text-white border border-white/10 rounded-full px-5 py-2 text-sm font-medium transition cursor-pointer`}>My communities</button>
                          
                            <button 
                             onClick={()=>{
                                setIdentifyTab("join_communities")
                               
                            }}
                            className={`${identifyTab=="join_communities"?"bg-blue-600 hover:bg-blue-700":"bg-white/5 hover:bg-white/10"} text-white border border-white/10 rounded-full px-5 py-2 text-sm font-medium transition cursor-pointer`}>joined communities</button>
                       
                        </div>
          
                        {/* Community Card Grid */}
                        {identifyTab?
                         <AllCommunity handleSelectedCommunity={handleSelectedCommunity} community={community} Tab={identifyTab}/>
                        :
                        <p>No {identifyTab} to show</p>}
                      
                    </div>

                    
                </div>

                {/* Right Side: Sidebar Widgets (Hidden on Mobile) */}
                {!open &&(
                   <div className="hidden md:flex md:w-[40%] lg:w-[35%] h-full overflow-y-auto  px-6 items-start py-6 custom-scrollbar">
                   <SidebarWidgets />
                </div>
                )}
              {/* Community Detail View */}
                    {open && <CommunityProfile communityId={selectedCommunity} />}

            </div>
            
           

            {/* Overlays */}
            {openCreate  && <CreateCommunity closeCreate={create} />}
        </div>
    )
}