"use client"
import {useState} from "react"
import Image from "next/image"
import Link from "next/link"
import { CiMenuBurger } from "react-icons/ci";
import { GiFlexibleStar } from "react-icons/gi";
import CommunityProfile from "./community";

export default function CommunityDashboard({
    Sidebar,value
}:{
    Sidebar:()=>void,
    value:boolean
}){
   
    const [openCommunity,setOpenCommunity] = useState<string|null>(null)

    const handleCommunity=(value:string)=>{
        setOpenCommunity(value);
    }

    return(
        <div className="w-full flex flex-col bg-[#080421bb]">
         {/* navbar hide on lg */}
            <div className ="flex w-full h-10 lg:flex-1 border-b-2 border-gray-800" >
                <CiMenuBurger 
                size={20} 
                className="w-12 self-center text-white" 
                onClick={()=>{Sidebar()}}
                />
                <h1 className="self-center flex justify-center text-white  flex-1 mx-auto">culthub</h1>
            </div>

        <div className="w-full lg:flex-1 h-screen overflow-y-scroll px-2  relative">
    
            {/* community */}
         <div className={` text-white  flex-col gap-2 mt-4 ${openCommunity?"hidden":"flex"}`}>
            <h1 className="text-3xl flex gap-1"> <GiFlexibleStar size={30} className="text-white"/> Discover Communities</h1>
            <p className="text-xs tracking-wide">Find your tribe and connect with like-minded people</p>

            {/* all or my community */}
            <div className="flex gap-2 my-4 text-white">
                <button className="bg-transparent  hover:bg-blue-700 rounded-lg border-2 border-gray-400 px-2 py-1">All Communities</button>
                <button className="hover:bg-blue-700 rounded-lg border-2 border-gray-400 px-2 py-1">My communities</button>
            </div>
          
          {/* community group map it  */}
            <div id={"community1"} className="w-full h-48 px-3 py-1 " onClick={()=>handleCommunity("comunity1")}>
                <div className="w-full h-full border-2 border-transparent rounded-lg shadow-2xl overflow-hidden relative">

                   {/* bg image upper */}
                   <div className="relative w-full h-2/3  overflow-hidden">
                    <Image src="/images/qunt.jpg" alt ="/image" fill className="object-cover scale-105"/>
                   </div>

                   {/* lower part */}
                   <div className="w-full h-1/2 flex bg-[#48484ee7] rounded-t-lg absolute bottom-0 right-0 z-30 backdrop-blur-2xl">

                   <div className="w-1/3 h-full  flex justify-center">
                    {/* middle user */}
                   <div className="relative w-10 h-10 aspect-square rounded-lg overflow-hidden shadow-xl -translate-y-4">
                <Image src="/images/user.png" alt="images" fill className="object-contain"/>
                </div>

                </div>
                    <div className="flex-1">
                    <h3 >Tech Inovators</h3>
                    <p className="text-xs">Discussing the latest in AI,web3 and emerging Technologies  </p>
                    <span className="text-xs">10000 members</span>
                    </div>

                   </div>

                </div>
                
            </div>
         </div>

        

        {/* the specific community pops up */}
        {openCommunity &&(
        <CommunityProfile/>)}

        </div>
        </div>
    )
}