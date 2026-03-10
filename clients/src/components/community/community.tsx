import Image from "next/image"
import {motion} from "framer-motion"
import { FaRegBell } from "react-icons/fa";
import { FaShareAlt } from "react-icons/fa";

export default function CommunityProfile(){
    return(
        <motion.div 
        initial={{y:100, opacity: 0 }}
        animate={{y:0, opacity: 1 }}
        exit={{y:100 , opacity:0}}
        transition={{
            type:"spring",stiffness:200,damping:25
        }}

        className="w-full absolute inset-0 h-screen overflow-y-scroll bg-[#080421bb]">
                  <div className="w-full h-48 px-2 py-1 mt-5">
                                  <div className="w-full h-full border-2 rounded-lg shadow-xl overflow-hidden relative">
                  
                                     {/* bg image upper */}
                                     <div className="relative w-full h-2/3  overflow-hidden">
                                      <Image src="/images/qunt.jpg" alt ="/image" fill className="object-cover scale-105"/>
                                     </div>
                  
                                     {/* lower part */}
                                     <div className="w-full h-1/2 flex flex-col border-1 border-gray-400  bg-[#48484ee7] rounded-t-lg absolute bottom-0 right-0 z-30  backdrop-blur-2xl">
                  
                                     <div className="w-full h-1/2  flex items-center  gap-2 px-4">
                                      {/* middle user */}
                                     <div className="relative w-8 h-8 aspect-square rounded-lg overflow-hidden shadow-xl ">
                                  <Image src="/images/user.png" alt="images" fill className="object-contain"/>
                                  </div>
                                  <div className="flex flex-col leading-normal text-white">
                                            <p>Tech Innovators</p>
                                       <span className="text-xs">120000 members</span>
                                     </div>
                  
                                  </div> 

                                  {/* lower 2 */}
                                     <div className="flex-1 flex items-center justify-evenly">
                                        <button className="w-[70%] rounded-md bg-blue-400 hover:bg-blue-700 ">join</button>
                                        <FaRegBell size={20} className="text-white w-8 aspect-square border-2 border-transparent shadow-xl hover:border-blue-600 "/>
                                        <FaShareAlt size={20} className="text-white  w-8 aspect-square  border-2 border-transparent shadow-xl hover:border-blue-600"/>
                                     </div>
                  
                                     </div>
                  
                                  </div>
                                  
                              </div>

                              <div className="text-white mt-4 border-b-2 border-gray-400 flex overflow-x-auto">
                                {[{name:"Post"},
                                {name:"Media"},
                                {name:"Discussion"},
                                {name:"Events"},
                                {name:"Members"},
                                {name:"About"},
                                ].map((item)=>(
                                    <div key={item.name} className="px-2 py-1 m-2 flex-shrink-0 ">{item.name}</div>
                                ))}
                              </div>
        </motion.div>
    )
}
