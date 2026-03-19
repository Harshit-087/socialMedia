"use client";
import Stories from "@/components/stories/storie";
import Navbar from "@/components/nav/navbar";
import PostCard from "@/components/postcard/card";
import Footer from "@/components/footer/footer";
import Trending from "@/components/trending/trending";
import Suggestion from "@/components/trending/friendSuggestion";

export default function Dashboard() {
  return (
    <div className="min-h-screen ">
      <Navbar />

      {/* The grid-cols-12 MUST be the direct parent of all col-span items.
        I removed the wrapping div around Section and Right Panel.
      */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 gap-6 px-4 lg:px-6">

        {/* LEFT SIDEBAR - 3 Columns */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-[#0f0a24] w-full h-fit border border-white/10 rounded-3xl p-4 shadow-xl sticky top-6">
            <Footer />
          </div>
        </div>

        {/* FEED - 6 Columns (centered on md, left-aligned on lg) */}
        <section className="col-span-12 md:col-span-7 lg:col-span-6 flex flex-col items-center pb-20">
          <div className="w-full">
             <Stories />
          </div>

          {/* Ensuring the PostCard container takes full width of its 6-column span 
            while keeping the internal max-width for the content itself.
          */}
          <div className="w-full flex flex-col gap-8 mt-6">
            <PostCard />
          </div>
        </section>

        {/* RIGHT PANEL - 3 Columns */}
        <aside className="hidden md:flex md:col-span-5 lg:col-span-3 flex-col gap-6 sticky top-6 h-fit">
          <div className="w-full space-y-6">
            <Trending />
            <Suggestion />
          </div>
        </aside>

      </div>

      {/* Mobile footer */}
      <div className="fixed bottom-0 w-full h-[65px] bg-white/80 border-t backdrop-blur-xl lg:hidden z-50">
        <Footer />
      </div>
    </div>
  );
}