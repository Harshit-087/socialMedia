"use client";

import { useState,useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import Posts from "@/components/postcard/posts";
import { useUser } from "@/hooks/userhook";
import Footer from "@/components/footer/footer";
import {followQuery} from "@/app/api/followQuery"
import {useQuery} from "@tanstack/react-query"
import {useQueryClient} from "@tanstack/react-query"
import { useParams, useSearchParams } from "next/navigation";
import {userQuery} from "@/app/api/userQuery"
import toast from "react-hot-toast"


export default function Profile() {
  const [showPosts, setShowPosts] = useState(true);   
  const { bio, profileImage,userId } = useUser();
  const queryClient = useQueryClient();

  const {name}=useParams();

 const searchParam =useSearchParams()
 const id = searchParam.get("id")
  

  const{data:following={},isLoading:followLoading,error:followError}=useQuery({
    queryKey:["follow",id],
    queryFn:async({queryKey})=>{
       const [,id]=queryKey as [string, string|undefined ];
       if(!id) return ;
       const res= await followQuery.following(id)
      //  toast.success(res.data.msg)
       return res.data.data;
    }
  })

  const {data,isLoading,error}=useQuery({
    queryKey:["profile",id],
    queryFn:async({queryKey})=>{
      const [,id]=queryKey as [string ,string |undefined]
      if(!id) return;
      const res = await userQuery.fetchProfile(id)
      //  toast.success(res.data.msg)
      return res.data;
    }
  })

  const {data:followers={},isLoading:followerLoading,error:followerError}=useQuery({
    queryKey:["followers",id],
    queryFn:async({queryKey})=>{
      const [,id]=queryKey as [string,string | undefined]
      if(!id) return;
      const res= await followQuery.followers(id);
      //  toast.success(res.data.msg)
      return res.data.data;
    }
  })

  useEffect(()=>{
  
    queryClient.invalidateQueries({queryKey:["follow",id]})
     queryClient.invalidateQueries({queryKey:["followers",id]})
    
  },[following])

  return (
    <>
      <section className="w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-zinc-950 to-zinc-900 text-white">
        {/* Header Section */}
        <header className="w-full max-w-3xl flex items-center justify-between px-4 py-4">
          <Link
            href="/account/dashboard"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <MoveLeft size={18} />
            </div>
            <span className="text-sm font-medium">Back</span>
          </Link>
        </header>

        {/* Profile Section */}
        <section className="w-full max-w-3xl flex flex-col items-center text-center mt-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-700 shadow-md">
            <Image
              src={data?.data?.[0]?.profileImage || "/user.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          <p className="mt-4 text-gray-300 max-w-md italic text-sm">{data?.data?.[0]?.bio || "No bio yet..."}</p>

          {/* Stats */}
          <div className="flex justify-center items-center gap-10 mt-6">
            {[
              { label: "Posts", value: data?.countPost[0]?.count ?? 0 },
              { label: "Following", value: following[0]?.count ?? 0},
              { label: "Followers", value: followers[0]?.count ?? 0 },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-xl font-semibold">{stat.value}</span>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Navigation Tabs */}
        <nav className="w-full max-w-3xl mt-10">
          <ul className="flex justify-around items-center bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg overflow-hidden text-sm font-medium">
            <li className={`w-full text-center py-3 hover:bg-zinc-700 cursor-pointer transition ${
                showPosts ? "hover:bg-zinc-700" : "bg-blue-600 hover:bg-blue-500"
            }`}
            onClick={()=>setShowPosts(false)}>
              <Link href="#comments">Comments</Link>
            </li>
            <li
              className={`w-full text-center py-3 cursor-pointer transition ${
                showPosts ? "bg-blue-600 hover:bg-blue-500" : "hover:bg-zinc-700"
              }`}
              onClick={() => setShowPosts(true)}
            >
              Posts
            </li>
            <li className="w-full text-center py-3 hover:bg-zinc-700 cursor-pointer transition">
              <Link href="#videos">Videos</Link>
            </li>
            <li className="w-full text-center py-3 hover:bg-zinc-700 cursor-pointer transition">
              <Link href="#tagged">Tagged</Link>
            </li>
          </ul>
        </nav>

        {/* Posts Section */}
        <section className="w-full max-w-3xl mt-6 px-4">
          {showPosts && (
            <div className="animate-fadeIn">
              {data?.data?.[0]?._id && <Posts userid={data.data[0]._id} />}

            </div>
          )}
        </section>

        {/* Footer */}
        <div className="mt-auto w-full">
          <Footer />
        </div>
      </section>
    </>
  );
}
