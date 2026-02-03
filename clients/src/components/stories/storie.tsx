"use client"
import {useState} from "react"
import {useUser} from "@/hooks/userhook"
import Image from "next/image"
import {useQuery} from "@tanstack/react-query"
import {storyQuery } from "../../app/api/storyQuery"
import Link from "next/link"
import { MoveLeft,ChevronLeft,ChevronRight } from "lucide-react"
import { AnimatePresence,motion } from "framer-motion"

interface StoryData{
  _id:string;
  mediaUrl:string;
}


export interface FollwingAccountStory{
 
  followId:{
    _id:string;
    profileImage:string;
    
  },
  stories:[{
  _id:string;
  mediaUrl:string;
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
      if(current<(Result.data?.story?.length - 1)){ setCurrent(prev=>prev+1)};
    }
    const prevStory = ()=>{
      if(current > 0 ) {setCurrent(prev=>prev-1)};
    }

    
    return(
        <>
          <div className="w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-400 overflow-x-auto pb-4 pt-8 border-t-2 border-white/20 shadow-md">
          <ul className="flex gap-4 px-4 ">
             <li
    key="me"
    className="w-24 h-24 rounded-full flex justify-center items-center flex-shrink-0 transform hover:scale-105 transition-transform duration-300 shadow-lg"
  >
    <div
      onClick={() => {
        if (Result?.data?.length > 0){ 
          setShowStory(Result.data);
          setProfileImageStory(profileImage || "");
          setProfileUsernameStory(Result.data[0]?.userId?.username );
          setOpenStory(true);}
      }}
      className={`w-22 h-22 ${
        Result?.data?.length > 0 ? "bg-blue-500" : "bg-white"
      } rounded-full flex justify-center items-center shadow-inner`}
    >
      <div className="w-20 h-20 relative rounded-full flex justify-center items-center overflow-hidden text-white font-semibold shadow-lg">
        <Image
          src={profileImage || "/user.png"}
          alt="your-story"
          fill
          className="object-cover"
        />
      </div>
    </div>
  </li>
            {Result && (Result?.followingStory  ?? []).map((s:FollwingAccountStory, idx:number) => (
              <li
                key={idx}
                className="w-24 h-24 rounded-full flex justify-center items-center flex-shrink-0 transform hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                <div onClick={()=>{
                 if(s.stories.length>0) {
                  setShowStory(s.stories);
                  setProfileImageStory(s.followId.profileImage);
                  setProfileUsernameStory(s.stories?.[0]?.userId?.username || "");
                  setOpenStory(true)}
                }}
                 className={`w-22 h-22 ${s.stories?.length>1 ? "bg-blue-500":"bg-white"}  rounded-full flex justify-center items-center shadow-inner`}>
                  
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 relative rounded-full flex justify-center items-center text-white font-semibold shadow-md overflow-hidden">
                      {s.followId.profileImage ? (
                        <Image 
                        src={s?.followId?.profileImage}
                        alt="story-user"
                        fill
                        className="object-cover"/>
                      ):null}
                    </div>
                
                  
                </div>
              </li>
            ))}
          </ul>
         
         {openStory && (
  <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm">
    {/* Header */}
    <div className="fixed top-0 left-0 w-full h-16 px-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent z-10">
      <div className="flex items-center gap-3">
        <MoveLeft
          onClick={() => setOpenStory(false)}
          className="text-white cursor-pointer hover:scale-110 transition-transform"
          size={26}
        />
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/40">
        
         <Image
            src={profileImageStory || "/user.png"}
            alt="User profile"
            fill
            className="object-cover"
          />
         
        </div>
        <p className="text-white text-lg font-semibold">
          {profileUsernameStory || "Unknown User"}
        </p>
      </div>
      {Result.data?.length>1?
      <span className="text-sm text-white/60">{current + 1 }/{Result.data?.length} Story</span>
      :null}
    </div>

    {/* Stories */}
    <div className="flex-1 relative overflow-hidden mt-16">
      {Result && showStory ? (
          <AnimatePresence mode="wait">
          <motion.div
            key={showStory[current]?._id }
            initial={{x:100,opacity:0}}
            animate={{x:0,opacity:1}}
            exit={{x:-100,opacity:0}}
            transition={{duration:0.5,ease:"easeInOut"}}
            className="absolute inset-0 animate-fadeIn"
              >
            <Image
              src={ showStory[current]?.mediaUrl}
              alt={`story-${current}`}
              fill
              className="object-cover transition-all duration-700 ease-in-out"
            />
            {/* Optional gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex h-full items-center justify-center text-white/60">
          No stories available.
        </div>
      )}
       {current>0 &&(
      <button onClick={prevStory} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60"><ChevronLeft /></button>
    )}

     {current<Result.data.length-1 &&(
      <button onClick={nextStory} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60"><ChevronRight /></button>
    )}
    </div>
   
  </div>
)}



        </div>


        </>
    )
}