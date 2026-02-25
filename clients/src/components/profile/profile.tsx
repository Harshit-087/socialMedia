"use client"
import Image from "next/image";
import {useQuery,useMutation} from "@tanstack/react-query"
import {useSearchParams} from "next/navigation"
import {userQuery} from "@/app/api/userQuery";
import { useEffect, useState } from "react";
import {useUser} from "@/hooks/userhook";
import {followQuery} from "@/app/api/followQuery"
import {AxiosResponse} from "axios"
import {ApiError} from "@/components/auth/loginCard"
import {FollowResponse,FollowVariables} from "@/components/nav/navbar"
import {useQueryClient} from "@tanstack/react-query"    
import Link from "next/link";


export default function ProfileComponent({
    sendSeeAllAccounts ,sendClose}
    :{
        sendSeeAllAccounts:(v:"following" | "followers"|null)=>void,
        sendClose:(v:boolean)=>void}){
   
   const [isFollowing,setIsFollowing]=useState<boolean>(false)
     const {userId } = useUser();
     const queryClient = useQueryClient();

    // extracting the profile accountIdFromUrl 
    const searchParams = useSearchParams();
    const accountIdFromUrl = searchParams.get("id");

     const {data:profile,isLoading,error}=useQuery({
    queryKey:["profile",accountIdFromUrl],
    queryFn:async({queryKey})=>{
      const [,id]=queryKey as [string ,string |undefined]
      if(!id) return;
      const res = await userQuery.fetchProfile(id)
      //  toast.success(res.data.msg)
      return res.data;
    }
  })

    const{data,isLoading:followLoading,error:followError}=useQuery({
      queryKey:["follow",accountIdFromUrl,userId],
      queryFn:async({queryKey})=>{
         const [,id,userId]=queryKey as [string, string|undefined ,string|undefined];
         if(!id || !userId) return ;
         const res= await followQuery.following(id,userId)
         
        //  toast.success(res.data.msg)
         return res.data.data;
      },
      enabled:!!accountIdFromUrl && !!userId
    })
  
  
  

       const followMutation = useMutation<AxiosResponse<FollowResponse>, ApiError, FollowVariables>({
    mutationFn: async ({ userId, accountId }: FollowVariables) => {
      if (userId === accountId) {
        throw new Error("Cannot follow yourself");
      }
      return await followQuery.follow(userId, accountId);
    },
    onSuccess: (res: AxiosResponse<FollowResponse>) => {
    
      console.log("followed successfully", res);
      queryClient.invalidateQueries({queryKey:["follow",userId]})
     
    },
    onError: (err: ApiError) => {
      console.log("error in following", err);
    },
  });

  

    useEffect(()=>{
  
    queryClient.invalidateQueries({queryKey:["follow",accountIdFromUrl,userId]})
     queryClient.invalidateQueries({queryKey:["followers",accountIdFromUrl,userId]})
    
  },[data,accountIdFromUrl,userId]) 

    return(
         <section className="w-full max-w-3xl flex flex-col items-center text-center mt-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-700 shadow-md">
            <Image
              src={profile?.data?.[0]?.profileImage || "/user.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-white mt-2 text-xl font-serif">{profile?.data?.[0].username}</p>

          <p className="mt-4 text-gray-300 max-w-md italic text-sm whitespace-normal block px-8">{profile?.data?.[0]?.bio || "No bio yet..."}</p>

          {/* Stats */}
          <div className="flex justify-center items-center gap-10 mt-6">
            {[
              { label: "Posts", value: profile?.countPost[0]?.count ?? 0 },
              { label: "following", value: data?.following?.[0]?.count ?? 0},
              { label: "followers", value: data?.followers?.[0]?.count ?? 0 },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span onClick={()=>{
                  sendSeeAllAccounts(stat.label==="following" ?"following" :"followers")
                sendClose(true)
                }}   
                   className="text-xl font-semibold">{stat.value}</span>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>



          { userId!==accountIdFromUrl ? 
          (data?.isFollowing ?
             (
             <Link href="/account/chat">
              <div
           className="w-72 my-2 p-1 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-500 cursor-pointer"
          >Message</div> 
          </Link>
          )
            : (<div
           className="w-72 my-2 p-1 rounded-lg bg-blue-600 hover:bg-blue-500 active:bg-blue-500 cursor-pointer"
          onClick={()=>{
             followMutation.mutate({userId:userId as string ,accountId:accountIdFromUrl as string})
           }}
          >follow</div>)
          )
         : (<div className="flex gap-4 justify-center my-4">
             <Link href={`/account/${profile?.data?.[0].username}/editprofile`}> <div  className="border-2 border-gray-500 w-32 py-1 rounded-lg whitespace-nowrap">edit profile</div></Link>
         
        <Link href=""> <div className="border-2 border-gray-500 w-32 py-1 rounded-lg whitespace-nowrap">share profile</div></Link> 
          </div> )}

         

        
          
        </section>
    )
}