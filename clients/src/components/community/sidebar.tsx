import { FaArrowAltCircleLeft } from "react-icons/fa";
import { motion, AnimatePresence, transform } from "framer-motion"
import { IoMdRocket } from "react-icons/io";
import { IoGameControllerOutline } from "react-icons/io5"
import { IoAddCircleOutline } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { FaGlobeAmericas } from "react-icons/fa";
import Link from "next/link"

export default function Sidebar({
        Sidebar,value
}:{
    Sidebar:()=>void,
    value:boolean
}){
    return(
        <div className={`w-full h-full flex fixed left-0 top-0 bg-transparent max-md:z-50 ${value?"backdrop-blur-xs":null} lg:w-1/3`}
        onClick={Sidebar}>
         {/* sidebar */}
         {/* <AnimatePresence> */}
         <motion.div 
         initial={{x:"-100%",opacity:0}}
         animate={{x:0,opacity:1 }}
         exit={{x:"-100%",opacity:0}}
           transition={{ type: "spring", stiffness:200,damping:25}}       
         className="max-sm:w-2/3 w-3/7 h-full lg:w-2xl  flex flex-col border-r-2 border-gray-400 bg-[#120c2cdd]"
         onClick={(e)=>e.stopPropagation()}
         >
          <h2 className="w-full h-12 text-xl ml-5 flex items-center font-serif text-white">culthub</h2>
         
         <div className="w-full  h-12 border-b-2 border-gray-400 py-1 px-4">
          <input 
          type="text"
        //   value={}
        //   onChange={} 
          placeholder="search" 
          className="w-full  h-full px-2 py-auto border-2 border-gray-400 rounded-lg mx-auto text-white"/>
          </div>

         <div className="flex flex-col px-4 my-2 gap-1">
          <div className="w-full h-10  bg-blue-400 mx-auto  rounded-lg flex  items-center px-4  hover:bg-blue-700 hover:scale-105 text-white gap-2">
           <GoHomeFill size={30}/>
           <Link href="/account/community">  <p>Home</p></Link>
            </div>
           <div className="w-full h-10  bg-blue-400 mx-auto  rounded-lg flex  items-center px-4  hover:bg-blue-700 hover:scale-105 text-white gap-2">
            <FaGlobeAmericas size={30}/>
            <p>Discover</p></div>
     </div>
     <p className="ml-5 text-white">My communities</p>

     <div className="flex flex-col w-full  py-2 px-3 gap-1 text-white">
        <div className="w-full h-16 mx-auto rounded-lg bg-blue-400 flex items-center px-2 gap-2  hover:bg-blue-700 hover:scale-105">
            <IoMdRocket size={30} className=""/>
           <p  >Tech Inovators <br/><span className="text-sm font-serif">100 members</span></p>
           
        </div>
        <div className="w-full h-16 mx-auto rounded-lg bg-blue-400 flex items-center px-2 gap-2 hover:bg-blue-700 hover:scale-105 transition-all duration-200">
            <IoGameControllerOutline size={30} className=""/>
           <p>Gaming Giants <br/><span className="text-sm font-serif">100 members</span></p>
        </div>
        <div className="w-full h-16 mx-auto rounded-lg bg-blue-400 flex justify-center items-center px-2 gap-2 hover:bg-blue-700 hover:scale-105 transition-all duration-200">
            <IoAddCircleOutline size={30} className=""/>
           <p>create community</p>
        </div>
     </div>

       {/* <FaArrowAltCircleLeft size={20} className="text-white" onClick={Sidebar}/>    */}
       </motion.div>
       {/* </AnimatePresence> */}
               
        </div>
    )
}