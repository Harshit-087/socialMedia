"use client"
import {useState,useEffect} from 'react'
import {Socket} from  "socket.io-client"
import CommunityDashboard from '@/components/community/dashboard'
import Sidebar from '@/components/community/sidebar'
import { AnimatePresence } from 'framer-motion'
import Footer from "@/components/footer/footer"

 export default function Community(){
  const [openSidebar ,setOpenSidebar] = useState<boolean>(false);

  const handleSidebar = ()=>{
       setOpenSidebar(prev=>!prev);
  }

  return (
    <div className="max-w-[7xl]  flex relative">
     {/* left side */}
     <AnimatePresence>
     {openSidebar &&( 
      <Sidebar Sidebar={handleSidebar} value={openSidebar}/>)}
      </AnimatePresence>
   
      {/* right side */}
      <CommunityDashboard Sidebar={handleSidebar} value={openSidebar}/>
      <div className="w-full h-[60px] fixed bottom-0 bg-white/90 backdrop-blur-md shadow-t-lg border-t border-gray-200 lg:hidden ">
              <Footer />
                </div>
    </div>
  )
}

