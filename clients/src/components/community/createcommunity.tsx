"use client"
import {useState} from "react"
import {useMutation} from "@tanstack/react-query"
import { TbXboxX } from "react-icons/tb";
import {communityQuery} from "@/app/api/communityQuery"
import {useUser} from "@/hooks/userhook"

import { QueryClient } from "@tanstack/react-query";


export default function CreateCommunity({ closeCreate }: { closeCreate: (v: boolean) => void }) {

  const {userId ,token} = useUser();
  const [privacy ,setPrivacy] = useState<"public"|"private"|"invite">("public");
  const  [ color,setColor]  =useState<string>("bg-blue-600");
  const [communityName , setCommunityName] = useState<string>("");
 const [description , setDescription] = useState<string>("");
 const [tech,setTech] = useState<string>("");
 const queryClient =new  QueryClient();

  const createCommunityMutation = useMutation({ 
    mutationFn:async(formData:FormData)=>{
      if(!formData) throw new Error("Id is invalid");
     return await communityQuery.createCommunity(formData)
   },
   onSuccess:(res)=>{
     console.log("community created",res);
     closeCreate(false)
   },
   onError:(error)=>{
    console.log("error in creating community",error)
   }

  })

    const handleSubmit=(e:React.FormEvent)=>{
      e.preventDefault();
    //   value = e.currentTarget
    const banner = (e.currentTarget as HTMLFormElement).banner as HTMLInputElement;
    const icon = (e.currentTarget as HTMLFormElement).icon as HTMLInputElement;
    
    const BannerFile = banner.files?.[0];
    const IconFile = icon.files?.[0];
    if(!BannerFile || !IconFile) throw new Error("provide a banner and icon file");
   console.log("category ",tech)
      const formData = new FormData();
      formData.append("banner",BannerFile);
      formData.append("icon",IconFile);
      formData.append("id",userId);
      formData.append("token",token);
      formData.append("theme",color);
      formData.append("communityName",communityName);
      formData.append("description",description);
      formData.append("tech",tech);
      formData.append("privacy",privacy);
      createCommunityMutation.mutate(formData);
    }


  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center px-3">
      
      <div className="w-full md:w-2xl h-8/12 bg-white rounded-lg flex flex-col p-6 gap-4 overflow-y-scroll">
        
        {/* Header */}
        <div className="w-full flex items-center">
          <h1 className="text-xl font-semibold">Create Community</h1>
          <TbXboxX
            size={22}
            className="text-black ml-auto cursor-pointer"
            onClick={() => closeCreate(false)}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Community Name */}
          <div>
            <label className="block mb-2 text-sm font-medium">Community Name</label>
            <input
              type="text"
              name="name"
              value={communityName}
              placeholder="Enter community name"
              onChange={(e)=>setCommunityName(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0f1b2d] text-white border border-gray-700 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              placeholder="What's this community about?"
              rows={4}
              name="description"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0f1b2d] text-white border border-gray-700 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-medium">Category</label>
            <select
  value={tech}
  onChange={(e) => setTech(e.target.value)}
  className="w-full p-3 rounded-lg bg-[#0f1b2d] text-white border border-gray-700 focus:outline-none"
>
   <option value="">Select category</option>
  <option value="tech">Tech</option>
  <option value="fitness">Fitness</option>
  <option value="business">Business</option>
  <option value="travel">Travel</option>
  <option value="crypto">Crypto</option>
  <option value="study">Study</option>
  <option value="gaming">Gaming</option>
  <option value="food">Food</option>
  <option value="art">Art</option>
  <option value="music">Music</option>
</select>
          </div>

          {/* Privacy */}
          <div>
            <label className="block mb-3 text-sm font-medium">Privacy</label>
            <div className="flex gap-3">
              <button name="public" onClick={()=>{setPrivacy("public")}} type="button" className={`flex-1 py-2 rounded-lg ${privacy=="public"?"bg-blue-400":"bg-[#0f1b2d]"} text-white border `}>
                Public
              </button>
              <button name="private" onClick={()=>{setPrivacy("private")}} type="button" className={`flex-1 py-2 rounded-lg ${privacy=="private"?"bg-blue-400":"bg-[#0f1b2d]"} text-white border `}>
                Private
              </button>
              <button name="invite" onClick={()=>{setPrivacy("invite")}} type="button" className={`flex-1 py-2 rounded-lg ${privacy=="invite"?"bg-blue-400":"bg-[#0f1b2d]"} text-white border `}>
                Invite Only
              </button>
            </div>
          </div>

          {/* Theme Color */}
          <div>
            <label className="block mb-3 text-sm font-medium">Theme Color</label>
            <div className="flex gap-3 flex-wrap">
              <div onClick={()=>{setColor("bg-blue-600")}} className="w-10 h-10 rounded-full bg-blue-600 border-2 border-black cursor-pointer"></div>
              <div onClick={()=>{setColor("bg-purple-600")}} className="w-10 h-10 rounded-full bg-purple-600 cursor-pointer"></div>
              <div onClick={()=>{setColor("bg-green-500")}} className="w-10 h-10 rounded-full bg-green-500 cursor-pointer"></div>
              <div onClick={()=>{setColor("bg-pink-500")}} className="w-10 h-10 rounded-full bg-pink-500 cursor-pointer"></div>
              <div onClick={()=>{setColor("bg-orange-500")}} className="w-10 h-10 rounded-full bg-orange-500 cursor-pointer"></div>
              <div  onClick={()=>{setColor("bg-red-500")}} className="w-10 h-10 rounded-full bg-red-500 cursor-pointer"></div>
              <div  onClick={()=>{setColor("bg-cyan-500")}} className="w-10 h-10 rounded-full bg-cyan-500 cursor-pointer"></div>
              <div  onClick={()=>{setColor("bg-indigo-500")}} className="w-10 h-10 rounded-full bg-indigo-500 cursor-pointer"></div>
            </div>
          </div>

          <div className="flex gap-4 ">
                  <label htmlFor="banner"
                    className="w-[45%] h-12 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer text-gray-500 hover:border-blue-500">
                    <input id="banner" name="banner" type="file" accept="image/*" className="hidden"/>
                    upload Banner
                  </label>

                   <label htmlFor="icon"
                    className="flex-1 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer text-gray-500 hover:border-blue-500">
                    <input id="icon" name="icon" type="file" accept="image/*" className="hidden"/>
                    upload Icon
                  </label>
          </div>

          <button
          type="submit"
          disabled={createCommunityMutation.isPending}

           className={`rounded-lg h-10 w-full self-center transition ${
    createCommunityMutation.isPending
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-blue-400 hover:bg-blue-700"
  }`}>{createCommunityMutation.isPending?"creating....":"create community"}</button>

        </form>
      </div>
    </div>
  );
}