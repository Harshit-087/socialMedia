"use client";
import {X} from "lucide-react"
import { useState } from "react";
import Videos from "@/components/video/videos";
import Posts from "@/components/postcard/posts";
import {useUser} from "@/hooks/userhook";
import { storyQuery } from "@/app/api/storyQuery";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userQuery } from "@/app/api/userQuery";

export default function SlotsComponent({id}:{id:string}){
  
      const {userId} = useUser();
       const [stories, setStories] = useState<boolean>(false);  
         const [createStory , setCreateStory] =useState<boolean>(false);
         const [activeTab,setActiveTab]=useState<"stories" | "posts" | "video"|"tagged">("posts")


           const {data,isLoading,error}=useQuery({
    queryKey:["profile",id],
    queryFn:async({queryKey})=>{
      const [,id]=queryKey as [string ,string |undefined]
      if(!id) return;
      const res = await userQuery.fetchProfile(id)
      //  toast.success(res.data.msg)
      return res.data;
    }
  })
  

           const uploadMutation=useMutation({
    mutationFn:async(formdata:FormData)=>{
   return await storyQuery.upload(formdata)
    }
  })


    const handleStorySubmit=async(e:React.FormEvent)=>{
    e.preventDefault();
    const value = (e.currentTarget as HTMLFormElement).storyFile as HTMLInputElement;
    const file = value.files?.[0];
    console.log("story file",file)
    if(!file) throw new Error("no story is provided")
    const formdata = new FormData();
    formdata.append("story",file)
    formdata.append("id",userId)
    console.log("formdata",formdata)
   uploadMutation.mutate(formdata)
  }

    return(
        <>
        <nav className="w-full max-w-3xl mt-10">
          <ul className="flex justify-around items-center bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg overflow-hidden text-sm font-medium">
            <li className={`w-full text-center py-3 hover:bg-zinc-700 cursor-pointer transition ${
                activeTab==="stories" ?  "bg-blue-600 hover:bg-blue-500":"hover:bg-zinc-700" 
            }`}
            onClick={()=>{setStories(true);
            
            setActiveTab("stories")}}>
             Stories
            </li>
            <li
              className={`w-full text-center py-3 cursor-pointer transition ${
                activeTab==="posts" ? "bg-blue-600 hover:bg-blue-500" : "hover:bg-zinc-700"
              }`}
              onClick={() =>{ setActiveTab("posts");setStories(false)}}
            >
              Posts
            </li>
            <li className={`w-full text-center py-3 cursor-pointer transition ${
                activeTab==="video" ? "bg-blue-600 hover:bg-blue-500" : "hover:bg-zinc-700"
              }`}
              onClick={()=>{setActiveTab("video"); setStories(false)}}>
              Videos
            </li>
            <li className={`w-full text-center py-3 cursor-pointer transition ${
                activeTab==="tagged" ? "bg-blue-600 hover:bg-blue-500" : "hover:bg-zinc-700"
              }`} 
              onClick={()=>{setActiveTab("tagged");setStories(false)}}>
              Tagged
            </li>
          </ul>
        </nav>

        {/* Posts Section */}
        <section className="w-full  max-w-3xl mt-6 px-4 ">
          {(stories && userId===id )? 
          <div className="w-full h-15 border-2 border-gray-200 px-4  rounded-lg flex justify-between items-center">
            <p className="text-lg">create story</p>
            <button onClick={()=>setCreateStory(true)} className="bg-blue-500 rounded-lg w-24 h-8  " >create</button></div>:null}
          
          {/* stories */}
          {activeTab==="stories" ?(
            <div className="animate-fadeIn">
              <p className="text-center text-gray-400">No stories to show</p>
            </div>
          ):null}

          {/* posts */}
          {activeTab==="posts" ? (
            <div className="animate-fadeIn">
              {data?.data?.[0]?._id && <Posts userid={data.data[0]._id} />}  

            </div>
          ):null}

          {/* videos */}
          {activeTab==="video" ? (
            <div className="animate-fadeIn">
              <Videos/>
            </div>
          ):null}

          {/* tagged */}
          {activeTab==="tagged" ? (
            <div className="animate-fadeIn">
              <p className="text-center text-gray-400">No tagged posts to show</p>
            </div>
          ):null}

        </section>

        {createStory?
        <form
  onSubmit={handleStorySubmit}
  encType="multipart/form-data"
  className="flex flex-col items-center gap-6 py-6 px-8"
>
  {/* Story Upload Box */}
  <label
    htmlFor="storyImage"
    className="flex flex-col items-center justify-center w-full h-60 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition"
  >
    <span className="text-gray-400 text-lg font-medium">
      Tap or drag to upload your story
    </span>
    <p className="text-sm text-gray-400">Supported formats: JPG, PNG, MP4</p>
    <input
      type="file"
      id="storyImage"
      name="storyFile"
      accept="image/*,video/*"
      className="hidden"
    />
  </label>

  

  {/* Submit Button */}
  <button
    type="submit"
    className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-md transition active:scale-95"
  >
    Upload Story
  </button>
</form>
    :null}
    </>
    )
}