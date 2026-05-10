"use client"

import {communityQuery} from "@/app/api/communityQuery"
import {useUser} from "@/hooks/userhook"
import {useQuery} from "@tanstack/react-query"
import Image from "next/image"
import {Item} from "./dashboard"

export default function AllCommunity({handleSelectedCommunity,community,Tab}:{handleSelectedCommunity:(v:string)=>void, community:(v:string|null)=>void ,Tab:string}){
       
    const {userId,token} = useUser()

     
         const {data,isLoading,isError} = useQuery({
        queryKey:["community",userId,token,Tab],
        queryFn:async({queryKey})=>{
            if(Tab === "All_communities"){
            const res = await communityQuery.fetchAllCommunity(token)
            console.log("response all community",res.data.data);
            return res.data.data;
        }
        else if(Tab ==="My_communities"){
           const [ _,id] = queryKey as [string , string|undefined]
            if(!id) return ;
            const res = await communityQuery.fetchMyCommunity(id,token)
            console.log("response",res.data.data);
            return res.data.data;
        }
        else{
             const [ _,id] = queryKey as [string , string|undefined]
            if(!id) return ;
            const res = await communityQuery.fetchjoinedCommunity(id,token)
            console.log("response",res.data.data);
            return res.data.data;
        }
        
     }})
    
       
   
    
  
     

    return(
         <div className="grid grid-cols-1 gap-6 ">
                            {/* Card Item */}

                         {data && data.map((item:Item)=>(
                              <div key={item._id}
                                className="group relative w-full  h-64 rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all"
                                onClick={() => {
                                    community("comunity1")
                                    handleSelectedCommunity(item._id)
                                }}
                            >
                                {/* Background Image with Overlay */}
                                <Image src={item.banner_url} alt="/images/qunt.jpg" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                {/* Info Content */}
                                <div className="absolute bottom-0 w-full p-6 flex items-end gap-4 backdrop-blur-md bg-white/10 border-t border-white/10">
                                    <div className="relative w-16 h-16 shrink-0 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl -translate-y-2">
                                        <Image src={item.icon_url} alt="/images/user.png" fill className="object-cover"/>
                                    </div>
                                    <div className="flex-1 pb-1">
                                        <h3 className="text-white font-bold text-lg">{item.communityName}</h3>
                                        <p className="text-slate-300 text-xs line-clamp-1">{item.description}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">10,000 members</span>
                                            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">{item.privacy}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                         ))}  
                        </div>
    )
}