"use client"
import {useState}from "react"
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { motion, AnimatePresence, transform } from "framer-motion"
import { IoMdRocket } from "react-icons/io";
import { IoGameControllerOutline } from "react-icons/io5"
import { IoAddCircleOutline } from "react-icons/io5";
import { GoHomeFill } from "react-icons/go";
import { FaGlobeAmericas } from "react-icons/fa";
import Link from "next/link"
import SidebarFeatures from "./sidebarFeature";

export default function Sidebar({
    Sidebar, value, community, create
}: {
    Sidebar: () => void,
    value: boolean,
    community: (v: string | null) => void,
    create: (v: boolean) => void
}) {


    return (
        /* 1. Added z-[100] globally so it's always on top of the dashboard and profile */
        /* 2. Changed bg-transparent to bg-black/40 when open to dim the background */
        <div 
            className={`fixed inset-0 w-full h-full transition-opacity duration-300 z-[100] lg:hidden border-r-2 border-gray-800 ${
                value ? "visible bg-black/40 backdrop-blur-sm" : "invisible opacity-0"
            }`}
            onClick={Sidebar}
        >
            {/* Sidebar Container */}
            <AnimatePresence>
                {value && (
                    <motion.div 
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        /* 3. Added relative and a high z-index inside the motion div as well */
                        className="relative z-[101] w-[280px] sm:w-[350px]  h-full  flex flex-col  bg-[#0f0a24] shadow-2xl shadow-black"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white tracking-tighter">culthub</h2>
                        </div>

                        {/* Search bar features , searh ,home,my community*/}
                        <SidebarFeatures Sidebar={Sidebar} value={value} community={community} create={create} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}