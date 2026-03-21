"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { FaRegBell, FaShareAlt } from "react-icons/fa";
import { useState,useEffect } from "react";
import {useQuery,useMutation} from "@tanstack/react-query"
import {communityQuery} from "@/app/api/communityQuery"
import {Item} from "./dashboard"
import { useUser } from "@/hooks/userhook";
import { useQueryClient } from "@tanstack/react-query";
import Post from "./post/post";



export default function CommunityProfile({communityId}:{communityId:string}) {
    const [activeTab, setActiveTab] = useState("Post");
    const [joined , setJoined] = useState<boolean>(false)
    const {userId} = useUser();
    const queryClient =  useQueryClient();
   

    const tabs = [
        { name: "Post" },
        { name: "Media" },
        { name: "Discussion" },
        { name: "Events" },
        { name: "Members" },
        { name: "About" },
    ];

 const {data,isLoading,isError} = useQuery({
    queryKey:["community",communityId],
    queryFn:async({queryKey})=>{
        const [ _,communityId] = queryKey as [string , string|undefined]
        if(!communityId) return ;
        const res = await communityQuery.openCommunity(communityId)
        console.log("response",res.data.data);
        return res.data.data;
    }
 })

  

  const memberMutation = useMutation({
        mutationFn:async({id,userId}:{id:string,userId:string})=>{
            if(!id || !userId) return;
            return await communityQuery.joinCommunity(id,userId)
        },
        onSuccess:(res)=>{
            console.log(res?.data?.message);
    queryClient.invalidateQueries({queryKey:["community",communityId]})
    
        },
        onError:(error)=>{
            console.log(error.message);
        }
    })


      const deleteMutation = useMutation({
        mutationFn:async(id:string)=>{
            if(!id ) return;
            return await communityQuery.deleteCommunity(id)
        },
        onSuccess:(res)=>{
            console.log(res?.data?.message);
          queryClient.invalidateQueries({queryKey:["community",communityId]})
          window.location.reload()
        },
        onError:(error)=>{
            console.log(error.message);
        }
    })

   const handleJoinCommunity=async(id:string)=>{
    
    memberMutation.mutate({id,userId});
   }
    
   const handleDeleteCommunity=async(id:string)=>{
    
    deleteMutation.mutate(id)
     
   }
   //see carefully
 useEffect(() => {
  if (data?.length) {
    const joined = data.some((item: Item) =>
      item.Members_Id?.some(
        (value: string) => String(value) === String(userId)
      )
    );

    setJoined(joined);
  }
}, [data, userId]);
  
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
            {data && data.map((item:Item)=>(
<div key={item._id} className="w-[90%] mx-auto h-64 md:h-72 relative rounded-[2.5rem]  overflow-hidden shadow-2xl border border-white/10">
              
                {/* Banner Image */}
                <div className="relative w-full h-full">
                    <Image 
                        src={item.banner_url} 
                        alt="/images/qunt.jpg"
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
                                <Image src={item.icon_url} alt="/images/user.png" fill className="object-cover" />
                            </div>
                            <div className="text-white">
                                <h2 className="text-xl md:text-2xl font-bold leading-tight">{item.communityName} </h2>
                                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">120,000 members</p>
                                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{item.privacy}</p>
                            </div>
                        </div>

                        {/* Bottom Row: Actions */}
                        <div className="flex items-center gap-3">
                           {item.AdminId != userId? 
                           <button 
                           onClick={()=>handleJoinCommunity(item._id)}
                           disabled={joined}
                           className={`flex-1 md:flex-none md:w-48 py-2.5 ${joined? "bg-white/10": "bg-blue-600 hover:bg-blue-500"}  text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95`}>
                              {joined? "Joined": "Join Community"}  
                            </button>
                           :
                           <button 
                           onClick={()=>handleDeleteCommunity(item._id)}
                           className="flex-1 md:flex-none md:w-48 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                                Delete Community
                            </button>} 
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
            ))}
            

            {/* Navigation Tabs */}
            <div className="mt-6 border-b border-white/10 flex md:flex-wrap overflow-x-auto no-scrollbar scroll-smooth">
                {tabs.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className={`px-6 py-3 text-sm font-semibold transition-all relative shrink-0 max-md:overflow-x-auto ${
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

<div className="h-screen overflow-y-auto bg-white text-slate-500 text-center italic py-8">
  <div className="max-w-4xl mx-auto px-4">
    {activeTab === "Post" ? (
      <div className="text-left not-italic">
        <Post />
      </div>
    ) : (
      <p className="py-20">Showing {activeTab} content...</p>
    )}
  </div>
</div>
        </motion.div>
    )
}