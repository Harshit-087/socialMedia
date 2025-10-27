"use client"
import {useUser} from "@/hooks/userhook"
import Image from "next/image"

export default function Stories(){

    const stories= Array(16).fill("dnf");
    const {profileImage}=useUser()
    
    return(
        <>
          <div className="w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-orange-400 overflow-x-auto pb-4 pt-8 border-t-2 border-white/20 shadow-md">
          <ul className="flex gap-4 px-4 ">
            {stories.map((story, idx) => (
              <li
                key={idx}
                className="w-24 h-24 rounded-full flex justify-center items-center flex-shrink-0 transform hover:scale-105 transition-transform duration-300 shadow-lg"
              >
                <div className="w-22 h-22 bg-white rounded-full flex justify-center items-center shadow-inner">
                  {idx === 0 ? (
                    <div className="w-20 h-20 relative rounded-full flex justify-center items-center overflow-hidden text-white font-semibold shadow-lg">
                      <Image src={profileImage} alt="#" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full flex justify-center items-center text-white font-semibold shadow-md">
                      {story}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        </>
    )
}