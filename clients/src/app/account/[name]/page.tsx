"use client";
import { useState } from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import Footer from "@/components/footer/footer";
import {followQuery} from "@/app/api/followQuery"
import {useQuery} from "@tanstack/react-query"
import {useSearchParams } from "next/navigation";
import FollowerAccount from "@/components/followerAccount/follower"
import ProfileComponent from "@/components/profile/profile";
import SlotsComponent from "@/components/profile/slots";
import FollowingAccount from "@/components/followerAccount/following";
import { useUser } from "@/hooks/userhook";


export default function Profile() {
     
 const [seeAllAccounts,setSeeAllAccounts]=useState<"following" | "followers"|null>(null); 
   const [close ,setClose]=useState<boolean>(false);
  const {token}  = useUser()
 const searchParam =useSearchParams()
 const id = searchParam.get("id")

    
   const handleSeeAllAccounts=(data:"following" | "followers"|null)=>{
     setSeeAllAccounts(data)
  }

  const handleClose=(value:boolean)=>{
    setClose(value)
  }

  const {data:followerAccounts=[],isLoading:followersAccountsLoading,error:followersAccountsError}=useQuery({
    queryKey:["followerAccount",id,token],
    queryFn:async()=>{
      
      if(!id || !token ) throw new Error("Missing id or label");;
      const res = await followQuery.fetchFollowerAccounts(id,token); 
      
      return res.data.data;
  },
    enabled:!!id 
  })
 

  const {data:followingAccounts=[]}=useQuery({
    queryKey:["following-Account",id,token],
    queryFn:async()=>{
      
      if(!id|| !token) return;
      const res = await followQuery.fetchFollowingAccounts(id,token)
     
      return res.data.data
    },
    enabled:!!id
  })
  
    return (
    <>
      <section className={`w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-zinc-950 to-zinc-900 text-white `}>
        {/* Header Section */}
        <header className="w-full max-w-3xl flex items-center justify-between px-4 py-4">
          <Link
            href="/account/dashboard"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center mr-4">
              <MoveLeft size={18} />
            </div></Link>
            <span className="text-sm font-medium text-white mr-auto">Back</span>
          
        </header>

        {/* Profile Section */}
       <ProfileComponent   sendSeeAllAccounts={handleSeeAllAccounts} sendClose={handleClose}/>

        {/* Navigation Tabs */}
        <SlotsComponent id={id!}/>

        {/* Footer */}
        <div className="mt-auto w-full lg:hidden">
          <Footer />
        </div>
  </section>
  

  {close  && seeAllAccounts ==="following"? 
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
    <FollowingAccount sendClose={setClose} followingAccount={followingAccounts} />
    </div>
    : null }

    { close && seeAllAccounts === "followers" ?
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
  <FollowerAccount sendClose={setClose} followerAccount={followerAccounts} />  
  </div>
  :   null}

    

    </>
  );
}
