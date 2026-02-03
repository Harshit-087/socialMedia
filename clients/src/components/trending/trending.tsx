import Image from "next/image";
import Link from "next/link";


export default function Trending(){
    return(
         <div className="m-6 w-72 h-48 bg-white rounded-lg shadow-lg flex-col text-black">

            <div className="flex items-center gap-2 m-4 border-b-2 border-[#C5C7C8]">
           <div className="relative w-12 h-12 rounded-full overflow-hidden ">
            <Image src="/images/fire.jpg" alt="fire" fill className="object-cover" />
             </div>
             <h1 className="font-bold text-xl">Trending</h1>
             <Link href="#" className="ml-auto text-blue-500 text-sm font-medium">See more</Link>
             </div>
             

             {/* use map to show atleast 2-3 account */}
             <div className="flex justify-between  m-4">
              <div className="flex-col">
              <p className="text-gray-700">#SummerVibes</p>
              <span className="text-gray-500 text-sm">120K posts</span>
              </div>
              
              <button className="bg-blue-500 text-white px-3 py-1 rounded-2xl text-sm font-medium border-2 border-[#C5C7C8] my-auto">+ Follow</button>
             </div>

          </div>
    )
}