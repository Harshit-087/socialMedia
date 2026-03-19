"use client"
import {useState} from "react"
import {useUser} from "@/hooks/userhook"
import Image from "next/image"
import {useQuery} from "@tanstack/react-query"
import {storyQuery } from "../../app/api/storyQuery"
import Link from "next/link"
import { MoveLeft,ChevronLeft,ChevronRight ,X} from "lucide-react"
import { AnimatePresence,motion } from "framer-motion"

interface StoryData{
  _id:string;
  mediaUrl:string;
  secure_url:string;
}


export interface FollwingAccountStory{
 
  followId:{
    _id:string;
    profileImage:string;
    
  },
  stories:[{
  _id:string;
  mediaUrl:string;
  secure_url:string
  userId:{
    _id:string;
    username:string;
    profileImage:string;
  }
  
  }]
}

export default function Stories(){

    const [showStory,setShowStory]=useState<StoryData[]>([]);
   
    const [profileImageStory,setProfileImageStory]=useState<string>("");
    const [profileUsernameStory,setProfileUsernameStory]=useState<string>("");
    const [current ,setCurrent] = useState<number>(0);
    const {profileImage,userId}=useUser()
    const [openStory,setOpenStory] =useState<boolean>(false)

    const {data:Result={},isLoading,error} =useQuery({
      queryKey:["story",userId],
      queryFn:async({queryKey})=>{
        const [_,id] =queryKey as [string , string ]
       
        const res=await storyQuery.fetchStory(id);
        console.log("query Data",res)
        return res.data;
      }
    })

    const nextStory = ()=>{
      if(current<(Result.data?.story?.length)){ setCurrent(prev=>prev+1)};
    }
    const prevStory = ()=>{
      if(current > 0 ) {setCurrent(prev=>prev-1)};
    }

    
   return (
  <>
    {/* STORIES BAR */}
    <div className="w-full bg-white/5 backdrop-blur-md overflow-x-auto pb-6 pt-8 border-b border-white/10 scrollbar-hide">
      <ul className="flex gap-5 px-6">
        {/* Current User Story */}
        <li className="flex flex-col items-center gap-2 flex-shrink-0">
          <div
            onClick={() => {
              if (Result?.data?.length > 0) {
                setShowStory(Result.data);
                setProfileImageStory(profileImage || "");
                setProfileUsernameStory(Result.data[0]?.userId?.username);
                setOpenStory(true);
              }
            }}
            className={`p-[3px] rounded-full cursor-pointer transition-all active:scale-95 ${
              Result?.data?.length > 0 
              ? "bg-blue-400" 
              : "border-2 border-dashed border-zinc-600"
            }`}
          >
            <div className="bg-[#0f0a24] p-[2px] rounded-full">
              <div className="w-16 h-16 md:w-20 md:h-20 relative rounded-full overflow-hidden border border-white/10">
                <Image
                  src={profileImage || "/user.png"}
                  alt="me"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <span className="text-[11px] font-medium text-zinc-400">Your Story</span>
        </li>

        {/* Following Stories */}
        {Result && (Result?.followingStory ?? []).map((s: FollwingAccountStory, idx: number) => (
          <li key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div
              onClick={() => {
                if (s.stories.length > 0) {
                  setShowStory(s.stories);
                  setProfileImageStory(s.followId.profileImage);
                  setProfileUsernameStory(s.stories?.[0]?.userId?.username || "");
                  setOpenStory(true);
                }
              }}
              className="p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 cursor-pointer transition-all hover:rotate-3"
            >
              <div className="bg-[#0f0a24] p-[2px] rounded-full">
                <div className="w-16 h-16 md:w-20 md:h-20 relative rounded-full overflow-hidden">
                  <Image
                    src={s?.followId?.profileImage || "/user.png"}
                    alt="user"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-zinc-300 truncate w-16 text-center">
              {s.stories?.[0]?.userId?.username}
            </span>
          </li>
        ))}
      </ul>
    </div>

    {/* FULL SCREEN VIEWER */}
    {openStory && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
        {/* Blurred background for cinema effect */}
        <div className="absolute inset-0 opacity-40 blur-3xl scale-110">
           <Image src={showStory[current]?.secure_url} fill className="object-cover" alt="bg" />
        </div>

        <div className="relative w-full h-full md:h-[90vh] md:max-w-[450px] md:rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-2xl">
          
          {/* Top Progress Indicators */}
          <div className="absolute top-0 left-0 w-full px-2 py-4 z-50 flex gap-1">
            {showStory.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-white transition-all duration-300 ${i <= current ? 'w-full' : 'w-0'}`}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-6 left-0 w-full px-4 flex items-center justify-between z-50">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20">
                <Image src={profileImageStory || "/user.png"} fill className="object-cover" alt="p" />
              </div>
              <span className="text-white font-bold text-sm drop-shadow-md">
                {profileUsernameStory}
              </span>
            </div>
            <button onClick={() => setOpenStory(false)} className="text-white/80 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Media */}
          <div className="w-full h-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={showStory[current]?._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full"
              >
                <Image
                  src={showStory[current]?.secure_url}
                  fill
                  className="object-contain"
                  alt="story"
                />
              </motion.div>
            </AnimatePresence>

            {/* Tap Targets */}
            <div className="absolute inset-0 flex">
              <div className="flex-1 cursor-pointer" onClick={prevStory} />
              <div className="flex-1 cursor-pointer" onClick={nextStory} />
            </div>
          </div>

          {/* Desktop Navigation Arrows */}
          <div className="hidden md:block">
            {current > 0 && (
              <button 
                onClick={prevStory} 
                className="absolute -left-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all"
              >
                <ChevronLeft size={32} />
              </button>
            )}
            {current < showStory.length - 1 && (
              <button 
                onClick={nextStory} 
                className="absolute -right-16 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all"
              >
                <ChevronRight size={32} />
              </button>
            )}
          </div>
        </div>
      </div>
    )}
  </>
);}