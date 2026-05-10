"use client"
 /// for pull on alll user we will use websocket for post pull instead of invalidate query
import { useState,useEffect,useRef } from "react"
import { GetSocket } from "@/lib/socket";
import {Socket} from "socket.io-client"
import {formatDistanceToNow} from "date-fns"
import {useUser} from "@/hooks/userhook"
import {useMutation,useQuery,useQueryClient} from "@tanstack/react-query"
import imageCompression from "browser-image-compression"
import {postQuery} from "@/app/api/postQuery"
import {
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  ImagePlus,
} from "lucide-react"

type PostType = {
  _id:string
  userId:{
    username:string,
    profileImage:string,
    _id:string
  } 
 
  caption: string
  url: string
  createdAt:string
}

export default function PostSection({communityId}:{communityId:string}) {
  const [postText, setPostText] = useState<string>("")
  const [imageUrl, setImageUrl] = useState<string|null>("")
  const socket  = useRef<Socket|null>(null)
  const {userId,token} = useUser() 
  const queryClient = useQueryClient()

  const {data,isLoading,isError}=useQuery({
    queryKey:["communityPost",communityId,token],
    queryFn:async()=>{
      const res = await postQuery.fetchCommunityPost(communityId,token);
      console.log("res.data.data:",res)
      return res.data.data;
    },
    
    enabled: !!userId && !!communityId,
    refetchInterval:5000 ,   // refetch after every 5 sec
    refetchIntervalInBackground:true
    
  })
  const uploadMutation = useMutation({
    mutationFn:async(formData:FormData)=>{
      if(formData.get("communityPost")){
        return await postQuery.uploadPost(formData);
      }
      else{
      return await postQuery.createCommunityPost(formData)
      }
    },
    onSuccess:(res)=>{
      console.log("successfull posting",res)
     
    },
    onError:(err)=>{
      console.log("error in posting in community post",err)
    }
  })

  const handleCreatePost = async (e:React.FormEvent) => {
    if (!postText.trim()) return

    e.preventDefault();
    const value = (e.currentTarget as HTMLFormElement).imageurl as HTMLInputElement;
    const file = value?.files?.[0] as File;
    const caption = (e.currentTarget as HTMLFormElement).caption as HTMLTextAreaElement;

    console.log("working on compression")
    if(!caption) return ;
    // compressing file 
    const formData = new FormData()
    if(file){
    const image = await imageCompression(file,{maxSizeMB:1})
    formData.append("communityPost",image)
    }
    formData.append("caption",caption.value)
    formData.append("userId",userId)
    formData.append("token",token)
    formData.append("communityId",communityId)
    // setPosts([newPost, ...posts])
   uploadMutation.mutate(formData)
    setPostText("")
    setImageUrl("")
    
  }

  // updating all user post whenever any one upload a post 
  useEffect(()=>{
    if (!userId) return;
    const s = GetSocket(userId)
    socket.current =s;
    s.on("new_community_post",(newPost:PostType)=>{
      queryClient.setQueryData(["communityPost",communityId],(oldData:PostType[])=>{     //setQueryData needs to be PostType[] (an array), not just PostType.
        if(!oldData) return {data:[newPost]};
        return  [newPost,...oldData];
      })
    })
    return ()=>{
      s.off("new_community_post")
    };
  },[communityId,queryClient])

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">

      {/* CREATE POST */}
      <div className="bg-[#121826] border border-gray-800 rounded-2xl p-6 text-white shadow-xl">
        <h2 className="text-lg font-bold mb-4">Create Post</h2>
       <form onSubmit={(e)=>handleCreatePost(e)} >
        <textarea
         name="caption"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full bg-transparent border border-gray-700 rounded-xl p-4 outline-none resize-none min-h-[120px] focus:border-blue-500"
        />

        <input
        name="imageurl"
          
          type="file"
          accept="imge/**"
          placeholder="Paste image URL (optional)"
          className="w-full mt-3 bg-transparent border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
        />

        <div className="flex justify-between items-center mt-4">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ImagePlus size={18} />
            Add Image
          </button>

          <button
            type = "submit"
            className="px-5 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700"
          >
            Post
          </button>
        </div>
        </form>
      </div>

      {/* POSTS FEED */}
      {data && data.map((post:PostType) => (
        <div
          key={post._id}
          className="bg-[#121826] border border-gray-800 rounded-2xl p-6 text-white shadow-xl"
        >
          {/* HEADER */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex gap-3">
              <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden border border-gray-700">
                <img
                  src={post.userId.profileImage}
                  alt="avatar"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{post.userId.username}</span>
                  <span className="bg-white/10  text-[10px] px-2 py-0.5 rounded-md font-bold uppercase">
                    user
                  </span>
                 
                </div>
                <p className="text-gray-500 text-xs">{formatDistanceToNow(new Date(post.createdAt))} ago</p>
              </div>
            </div>

            <button className="text-gray-500 hover:bg-gray-800 p-1 rounded-full">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* BODY */}
          <div className="space-y-4 mb-4">
            <p className="text-gray-200">{post.caption}</p>

            {post.url && (
              <div className="rounded-xl overflow-hidden border border-gray-800">
                <img src={post.url} alt="post" className="w-full object-cover" />
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-between border-t border-gray-800 pt-4">
            <div className="flex gap-6 text-gray-400">
              <button className="flex gap-2 hover:text-red-500">
                <Heart size={20} />
                0
              </button>

              <button className="flex gap-2 hover:text-blue-400">
                <MessageSquare size={20} />
                0
              </button>

              <button className="flex gap-2 hover:text-green-400">
                <Share2 size={20} />
                0
              </button>
            </div>

            <Bookmark size={20} className="text-gray-400 hover:text-white" />
          </div>
        </div>
      ))}
    </div>
  )
}