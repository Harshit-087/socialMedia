"use client";
import Stories from "@/components/stories/storie"
import Navbar from "@/components/nav/navbar";
import PostCard from "@/components/postcard/card";
import Footer from "@/components/footer/footer";

export default function Dashboard() {
 

  return (
    <>
      <Navbar />

      <section className="max-w-[1440px] min-h-screen mx-auto flex flex-col text-white pb-20 overflow-x-hidden">
        {/* Stories section */}
      <Stories/> 

        {/* Posts */}
        <div className="flex flex-col items-center mt-6 gap-6">
          <PostCard />
        </div>

        {/* Footer */}
        <Footer />
      </section>
    </>
  );
}
