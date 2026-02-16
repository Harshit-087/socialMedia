"use client";
import { useState,useEffect } from "react";
import { Heart, MessageCircle, Send, EllipsisVertical,MoveLeft } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/hooks/userhook";
import { userQuery } from "@/app/api/userQuery";
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import {formatDistanceToNow} from "date-fns"
import CommentPanel from "./commentPanel";
import {likeQuery} from "@/app/api/likeQuery"
import {postQuery} from "@/app/api/postQuery"
import toast from "react-hot-toast"
import {AxiosResponse} from "axios"
import {ApiError} from "../auth/loginCard"
import Link from "next/link";
import {videoQuery} from "@/app/api/videoQuery"
import {VideoItem} from "../video/videos"

export type MediaItem={ 
  url:string; type?:string; position?:number }

 export type PostType={ 
  _id: string; 
  userId: { username: string; profileImage: string; _id:string};
  caption:string;
  media: MediaItem[]; createdAt: string; }



  type DeleteLikeResponse={
    msg:string
  }

  type LikeResponse={
    msg:string,
    data:{
      userId:string,
      postId:string
    },
    status:number
  }

 

  type LikeVariables={
    userId:string ,
     Url:string,
     token:string
  }


interface UserInfo {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

interface MyLike {
  _id: string;
  postId: string;
  userId: UserInfo;
}

interface MyLikesResponse {
  msg: string;
  data: MyLike[];
}


  type feedItem =
  |{kind:"post",data:PostType}
  |{kind:"video",data:VideoItem};

export default function PostCard() {
  const {userId ,token}=useUser()
 // rather then using index , use postid beacuse . on maping index changes but  like remian at index  .
  const [likedImage, setLikedImage] = useState<{[key:string]:boolean}>({});
  const [likesOnPost,setLikesOnPost] = useState<{[key:string]:number}>({})
  const [openComment,setOpenComment] = useState<boolean>(false);
  const [commentForPost,setCommentForPost]=useState<PostType>();

  

  //using useQueryclient invalidateQueries.
  //for rehydrating the cache ... after mutation
  const queryClient= useQueryClient();

  // fetching posts ..//
  const {
    data: post = [],
    isLoading: postLoading,
    error: postError,
  } = useQuery({
    queryKey: ["posts",token],
    queryFn: async ({ queryKey }) => { 
      const [_,token]=queryKey as [string ,string|undefined];
      if(!token) throw new Error("cannot find token");
      const res = await postQuery.peoplePosts(token);
       toast.success("posts")
      return res.data?.data || [];
    },
    enabled: !!userId, //  Only runs when userId is ready
  });

  //fetching video from cache ..
   const {data:videos = [], isLoading, error} = useQuery<VideoItem[], Error>({
     queryKey:["videos",userId],
     queryFn:async({queryKey})=>{
         const [ , id] =queryKey as [string,string|undefined]
         if(!id) return [];
         const res = await videoQuery.fetchUserVideos(id);
         return res.data.data;
     }
   })


  // making like ...//
  const likeCreateMutation = useMutation<AxiosResponse<LikeResponse>,ApiError,LikeVariables>({
    mutationFn: async ({userId,Url,token}:LikeVariables) => {
      return await likeQuery.likePost(userId,Url,token);
    },
    onSuccess:(res:AxiosResponse<LikeResponse>)=>{
      //  toast.success(res.data.msg)
      queryClient.invalidateQueries({ queryKey: ["myLikes", userId] })
      queryClient.invalidateQueries({queryKey:["getLikes"]})
    },
    onError:(err:ApiError)=>{
      console.log("error in liking  post",err)
    }
  });
  
  //removing likes from db //
  const likeDeleteMutation=useMutation<AxiosResponse<DeleteLikeResponse>,ApiError,LikeVariables>({
    mutationFn:async({userId,Url,token}:{ userId:string , Url:string,token:string })=>{
      return await likeQuery.deleteLike(userId,Url,token);
    },
    onSuccess:(res:AxiosResponse<DeleteLikeResponse>)=>{
      //  toast.success(res.data.msg)
      queryClient.invalidateQueries({ queryKey: ["myLikes", userId] })
      queryClient.invalidateQueries({queryKey:["getLikes"]})
    },
    onError:(err:ApiError)=>{
      console.log("error in liking deletion  post",err)
    }
  })

  // fetching all likes ..  by all user on diff post used for counting // 
  const {data:countLikes,isLoading:countLikesLoading,error:countLikesError} = useQuery({
    queryKey:["getLikes"],
    queryFn:async({queryKey})=>{
      const res =  await likeQuery.fetchingLikes();
      //  toast.success(res.data.msg)
      return res.data?.count;
    }
  })

  useEffect(()=>{
    if(!countLikes) return; 

    countLikes.forEach((item:{ _id: string; count: number })=>{
      setLikesOnPost(prev=>({...prev,[item._id]:item.count}))
    })
  },[countLikes])

  // fetching my specific liked image ..//
  const {data:myLikes,isLoading:myLikesLoading,error:myLikesError}=useQuery({
    queryKey:["myLikes",userId],
    queryFn:async({queryKey})=>{
      const [_,userid] = queryKey
      const res=  await likeQuery.fetchMyLikes(userid);
        // toast.success(res.data.msg)
      return res.data?.data;
     }
  })

  useEffect(()=>{
    
    if(!myLikes) return;

    //Use forEach for side-effects, not map.
  myLikes.forEach((like: MyLike)=>{
    // the object literial to make it object and  return  , not a block , which is for func..
   setLikedImage((prev)=>({...prev,[like.postId]:true}))
  })
},[myLikes]);



  if (postLoading) {
    return (
      <p className="text-xl font-serif text-violet-600">loading posts .....</p>
    );
  }

  if (postError) {
    console.log("error in dashboard post", postError);
  }

   
 
  const handleLike = (postid:string,index:number) => {
    
    //getting url of liked image to send to backend ..
    const Url = post[index].media[0]?.url ?? "";

   // locallike for all image separate..
   const isLiked = likedImage[postid] ?? false;
  

  if (!isLiked) {
    // likedImage now only store the liked images 
     setLikedImage((prev) => ({...prev,[postid]:!isLiked}))
    likeCreateMutation.mutate({ userId, Url ,token});

  } else {
    // removing dislike key pair from the likedImage object ..
    setLikedImage(prev=>{
      const newstate ={...prev};  //make a copy of the entire obj
      delete newstate[postid];   // deleting the dilike key
      return newstate            // returning the new obj 
    });
    likeDeleteMutation.mutate({ userId, Url ,token});
  }    
  };


  // sidepanel appear fro image.. 
   const handleCommentPanel=(index:number)=>{
    const url = post[index]
    setCommentForPost(url);
    setOpenComment(true)

  };

  const formatLikes =(num:number):string=>{
    if(num >=1000000) return (num/1000000).toFixed(1)+"M";
   if(num >= 1000) return (num/1000).toFixed(1) +"k";
   
   return num.toString();
  }




  const combinedFeed:feedItem[]=[
    ...post.map((p:PostType)=>({kind:"post",data:p})),
    ...videos.map((v:VideoItem)=>({kind:"video",data:v}))
  ]


  return (
   <div className="flex flex-col items-center gap-6 py-6">
  {combinedFeed.map((item:feedItem,index:number) => (
    <div
      key={index}
      className="w-[90%] bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 rounded-2xl shadow-lg flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">

           <Image
              src={ item.data.userId.profileImage || "/images/qunt.jpg"}
              alt="profile"
              fill
              className="object-cover"
            />
          </div>
          <div>
           <Link href={`/account/${ item.data.userId.username}?id=${item.data.userId._id}`}> <p className="font-medium text-sm text-white">{item.kind==="post"? item.data.userId.username : item.data.userId.username || "User"}</p></Link>
           <Link href=""> <p className="text-xs text-white/80">@{ item.data.userId.username || "username"}</p></Link>
          </div>
        </div>
        <EllipsisVertical className="text-white" />
      </div>

      {/* Post image */}
      <div className="w-full relative">
      {/* checking for video or img  */}
       {item.kind==="post" ? 
       <Image
          src={item.data.media[0]?.url || "/placeholder.png"}
          alt="post"
          width={400}
          height={400}
          className="w-full max-h-96 object-cover"
        />
       : <video src={item.data.url} controls autoPlay className="object-contain border-2 border-gray-400  w-full max-h-96"/>
       } 
      </div>

      {/* Caption */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <p className="text-sm text-gray-800 whitespace-normal break-words leading-relaxed">
          <span className="font-semibold text-gray-900 mr-2">@{ item.data.userId.username || "user"}</span>
          <span className="text-gray-500"> {formatDistanceToNow(new Date( item.data.createdAt ))} ago </span>
          <br />
          {item.kind==="post"? item.data.caption : item.data.caption || "hello"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-around items-center py-3 bg-gray-50">
        <div className="flex gap-2 items-center">
          <Heart
            onClick={() => handleLike(item.kind==="post"? item.data._id : item.data.publicId, index)}
            className={likedImage[item.kind==="post"? item.data._id : item.data.publicId] ? "text-red-600" : "text-gray-600 hover:text-red-500 transition-colors"}
          />
          <p className="text-gray-700">{likesOnPost[item.kind==="post"? item.data._id : item.data.publicId] ? formatLikes(likesOnPost[item.kind==="post"? item.data._id : item.data.publicId]) : 0}</p>
        </div>

        <MessageCircle className="text-blue-600 hover:text-blue-500 transition-colors" onClick={() => handleCommentPanel(index)} />
        <Send className="text-green-600 hover:text-green-500 transition-colors" />
      </div>
    </div>
  ))}

  {/* Comment panel */}
  {openComment ? <CommentPanel close={() => setOpenComment(false)} data={commentForPost!} /> : null}
</div>

  );
}
