"use client";
import Stories from "@/components/stories/storie"
import Navbar from "@/components/nav/navbar";
import PostCard from "@/components/postcard/card";
import Footer from "@/components/footer/footer";
import Trending from "@/components/trending/trending";
import Suggestion from "@/components/trending/friendSuggestion";

export default function Dashboard() {
 

  return (
    <>
      <Navbar />
     
     <div className=" max-w-[1200px] mx-auto flex flex-row-reverse ">
      <section className="max-w-[1200px] min-h-screen mx-auto flex flex-col  text-white pb-20   lg:flex-[0.65] ">
        {/* Stories section */}
      <Stories/> 

        {/* Posts */}
        <div className="md:flex   w-full md:gap-6">
        <div className="flex flex-col flex-[0.65] items-center mt-6 gap-6   ">
          <PostCard />
        </div>
        
        {/* for tablet */}
        <div className="hidden md:flex h-fit   flex-[0.35]  flex-col sticky top-0 mt-6 border-l border-white/10 pl-2">
         <Trending/>
         <Suggestion/>
        </div>
        </div>

        {/* Footer for mobile and tablet */}
         <div className="w-full h-[60px] fixed bottom-0 bg-white/90 backdrop-blur-md shadow-t-lg border-t border-gray-200 lg:hidden ">
        <Footer />
          </div>
      </section>
         
         {/* footer for desktop */}
         <div className="hidden lg:flex-[0.20]  h-fit  lg:block  bg-white/90 backdrop-blur-md shadow-t-lg border-2 border-gray-200 mx-4 my-5 p-4 rounded-4xl shadow-2xl sticky top-6">
        <Footer />
          </div>
      </div>
    </>
  );
}
