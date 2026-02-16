"use client";
import {X} from "lucide-react"
import { useState,useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import Posts from "@/components/postcard/posts";
import { useUser } from "@/hooks/userhook";
import Footer from "@/components/footer/footer";
import {followQuery} from "@/app/api/followQuery"
import {useQuery,useMutation} from "@tanstack/react-query"
import {useQueryClient} from "@tanstack/react-query"
import { useParams, useSearchParams } from "next/navigation";
import {userQuery} from "@/app/api/userQuery"
import toast from "react-hot-toast"
import {storyQuery} from "../../api/storyQuery"
import FollowerAccount from "@/components/followerAccount/follower"
import Videos from "@/components/video/videos";
import {AxiosResponse} from "axios"
import {ApiError} from "@/components/auth/loginCard"
import {FollowResponse,FollowVariables} from "@/components/nav/navbar"


export default function Profile() {
   
   const [stories, setStories] = useState<boolean>(false);  
   const [createStory , setCreateStory] =useState<boolean>(false);
   const [label ,setLabel]=useState<string>("");
   const [numberOfFollowers,setNumberOfFollowers]=useState<number>(0);
   const [seeAllAccounts,setSeeAllAccounts]=useState<boolean>(false);
 
   const [activeTab,setActiveTab]=useState<"stories" | "posts" | "video"|"tagged">("posts")
  const {userId } = useUser();
  const queryClient = useQueryClient();

  const {name}=useParams();

 const searchParam =useSearchParams()
 const id = searchParam.get("id")
  

  const{data:following=[],isLoading:followLoading,error:followError}=useQuery({
    queryKey:["follow",id],
    queryFn:async({queryKey})=>{
       const [,id]=queryKey as [string, string|undefined ];
       if(!id) return ;
       const res= await followQuery.following(id)
      //  toast.success(res.data.msg)
       return res.data.data;
    },
    enabled:!!id
  })

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

  const {data:followers={},isLoading:followerLoading,error:followerError}=useQuery({
    queryKey:["followers",id],
    queryFn:async({queryKey})=>{
      const [,id]=queryKey as [string,string | undefined]
      if(!id) return;
      const res= await followQuery.followers(id);
      //  toast.success(res.data.msg)
      return res.data.data;
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

  useEffect(()=>{
  
    queryClient.invalidateQueries({queryKey:["follow",id]})
     queryClient.invalidateQueries({queryKey:["followers",id]})
    
  },[following])

    // seeing all followers from profile 
    
  
  const {data:followersAccounts=[],isLoading:followersAccountsLoading,error:followersAccountsError}=useQuery({
    queryKey:["followerAccount",id,label],
    queryFn:async()=>{
      
      if(!id || !label) throw new Error("Missing id or label");;

      if(label==="Followers"){
      const res = await followQuery.fetchFollowerAccounts(id); 
      console.log("followers accounts aa gaya ",res.data.data)
      return res.data.data;
      }
      if(label==="Following" ){
        const res = await followQuery.fetchFollowingAccounts(id); 
        console.log("following accounts aa gaya ",res.data.data)
        return res.data.data;
      }
      
      
    },
    enabled:seeAllAccounts && !!id && !!label
  })

  
  console.log("followers accounts in profile page",followersAccounts)


  
    const followMutation = useMutation<AxiosResponse<FollowResponse>, ApiError, FollowVariables>({
    mutationFn: async ({ userId, accountId }: FollowVariables) => {
      if (userId === accountId) {
        throw new Error("Cannot follow yourself");
      }
      return await followQuery.follow(userId, accountId);
    },
    onSuccess: (res: AxiosResponse<FollowResponse>) => {
      toast.success(res.data?.msg);
      console.log("followed successfully", res);
      queryClient.invalidateQueries({queryKey:["follow",userId]})
     
    },
    onError: (err: ApiError) => {
      console.log("error in following", err);
    },
  });

  const isFollowing = following.some((f:{followId:string})=>f.followId === id)


 

  return (
    <>
      <section className={`w-full min-h-screen flex flex-col items-center bg-gradient-to-b from-zinc-950 to-zinc-900 text-white ${seeAllAccounts ? "hidden" : ""}`}>
        {/* Header Section */}
        <header className="w-full max-w-3xl flex items-center justify-between px-4 py-4">
          <Link
            href="/account/dashboard"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <MoveLeft size={18} />
            </div>
            <span className="text-sm font-medium">Back</span>
          </Link>
        </header>

        {/* Profile Section */}
        <section className="w-full max-w-3xl flex flex-col items-center text-center mt-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-700 shadow-md">
            <Image
              src={data?.data?.[0]?.profileImage || "/user.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-white mt-2 text-xl font-serif">{data?.data?.[0].username}</p>

          <p className="mt-4 text-gray-300 max-w-md italic text-sm whitespace-normal block px-8">{data?.data?.[0]?.bio || "No bio yet..."}</p>

          {/* Stats */}
          <div className="flex justify-center items-center gap-10 mt-6">
            {[
              { label: "Posts", value: data?.countPost[0]?.count ?? 0 },
              { label: "Following", value: following[0]?.count ?? 0},
              { label: "Followers", value: followers[0]?.count ?? 0 },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span onClick={()=>{
                  setLabel(stat.label)
                  setNumberOfFollowers(stat.value)
                  setSeeAllAccounts(true)}}
                   className="text-xl font-semibold">{stat.value}</span>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
          {(userId!==id)?
          <div
           className="w-72 my-2 p-1 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-500 cursor-pointer"
          onClick={()=>{
            followMutation.mutate({userId:userId as string ,accountId:id as string})
          }}
          >follow</div>
          :<div className="flex gap-4 justify-center my-4">
            <Link href={`/account/${data?.data?.[0].username}/editprofile`}> <div  className="border-2 border-gray-500 w-32 py-1 rounded-lg whitespace-nowrap">edit profile</div></Link>
         
         <Link href=""> <div className="border-2 border-gray-500 w-32 py-1 rounded-lg whitespace-nowrap">share profile</div></Link> 
          </div> }

          {/* followed */}
          {isFollowing ? (
            <div className="w-72 my-2 p-1 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-500 cursor-pointer">following</div>
          ):null}
          
        </section>

        {/* Navigation Tabs */}
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

        {/* Footer */}
        <div className="mt-auto w-full lg:hidden">
          <Footer />
        </div>
      </section>


      {/* // showing follower */}
     {seeAllAccounts && (
  <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
    <FollowerAccount setSeeAllAccounts={setSeeAllAccounts} followerAccount={followersAccounts} />
   
  </div>
)}

    </>
  );
}
