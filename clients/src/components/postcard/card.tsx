"use client";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Send, EllipsisVertical, MoveLeft } from "lucide-react";
import Image from "next/image";
import { useUser } from "@/hooks/userhook";
import { userQuery } from "@/app/api/userQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns"
import CommentPanel from "./commentPanel";
import { likeQuery } from "@/app/api/likeQuery"
import { postQuery } from "@/app/api/postQuery"
import toast from "react-hot-toast"
import { AxiosResponse } from "axios"
import { ApiError } from "../auth/loginCard"
import Link from "next/link";
import { videoQuery } from "@/app/api/videoQuery"
import { VideoItem } from "../video/videos"


export type MediaItem = { url: string; type?: string; position?: number }
export type PostType = { _id: string; userId: { username: string; profileImage: string; _id: string }; caption: string; media: MediaItem[]; createdAt: string; }
type DeleteLikeResponse = { msg: string }
type LikeResponse = { msg: string, data: { userId: string, postId: string }, status: number }
type LikeVariables = { userId: string, Url: string, token: string }
interface UserInfo { _id: string; username: string; email: string; profileImage?: string; }
interface MyLike { _id: string; postId: string; userId: UserInfo; }
interface MyLikesResponse { msg: string; data: MyLike[]; }
type feedItem = | { kind: "post", data: PostType } | { kind: "video", data: VideoItem };

export default function PostCard() {
  const { userId, token } = useUser()
  const [likedImage, setLikedImage] = useState<{ [key: string]: boolean }>({});
  const [likesOnPost, setLikesOnPost] = useState<{ [key: string]: number }>({})
  const [openComment, setOpenComment] = useState<boolean>(false);
  const [commentForPost, setCommentForPost] = useState<PostType>();

  const queryClient = useQueryClient();

  // fetching posts ..//
  const { data: post = [], isLoading: postLoading, error: postError } = useQuery({
    queryKey: ["all-posts", token],
    queryFn: async ({ queryKey }) => {
      const [_, token] = queryKey as [string, string | undefined];
      if (!token) throw new Error("cannot find token");
      const res = await postQuery.peoplePosts(token);
      return res.data?.data || [];
    },
    enabled: !!userId,
  });

  //fetching video from cache ..
  const { data: videos = [], isLoading, error } = useQuery<VideoItem[], Error>({
    queryKey: ["all-videos", token],
    queryFn: async ({ queryKey }) => {
      const [_, token] = queryKey as [string, string | undefined]
      if (!token) return;
      const res = await videoQuery.fetchAllVideos(token);
      return res.data.data;
    },
    enabled: !!token
  })

  // making like ...//
  const likeCreateMutation = useMutation<AxiosResponse<LikeResponse>, ApiError, LikeVariables>({
    mutationFn: async ({ userId, Url, token }: LikeVariables) => {
      return await likeQuery.likePost(userId, Url, token);
    },
    onSuccess: (res: AxiosResponse<LikeResponse>) => {
      queryClient.invalidateQueries({ queryKey: ["myLikes", userId] })
      queryClient.invalidateQueries({ queryKey: ["getLikes"] })
    },
    onError: (err: ApiError) => { console.log("error in liking post", err) }
  });

  //removing likes from db //
  const likeDeleteMutation = useMutation<AxiosResponse<DeleteLikeResponse>, ApiError, LikeVariables>({
    mutationFn: async ({ userId, Url, token }: { userId: string, Url: string, token: string }) => {
      return await likeQuery.deleteLike(userId, Url, token);
    },
    onSuccess: (res: AxiosResponse<DeleteLikeResponse>) => {
      queryClient.invalidateQueries({ queryKey: ["myLikes", userId] })
      queryClient.invalidateQueries({ queryKey: ["getLikes"] })
    },
    onError: (err: ApiError) => { console.log("error in liking deletion post", err) }
  })

  // fetching all likes .. counting // 
  const { data: countLikes } = useQuery({
    queryKey: ["getLikes"],
    queryFn: async () => {
      const res = await likeQuery.fetchingLikes();
      return res.data?.count;
    }
  })

  useEffect(() => {
    if (!countLikes) return;
    countLikes.forEach((item: { _id: string; count: number }) => {
      setLikesOnPost(prev => ({ ...prev, [item._id]: item.count }))
    })
  }, [countLikes])

  // fetching my specific liked image ..//
  const { data: myLikes } = useQuery({
    queryKey: ["myLikes", userId],
    queryFn: async ({ queryKey }) => {
      const [_, userid] = queryKey
      const res = await likeQuery.fetchMyLikes(userid);
      return res.data?.data;
    }
  })

  useEffect(() => {
    if (!myLikes) return;
    myLikes.forEach((like: MyLike) => {
      setLikedImage((prev) => ({ ...prev, [like.postId]: true }))
    })
  }, [myLikes]);

  if (postLoading) {
    return (
      <div className="flex flex-col items-center gap-4 mt-20">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent  rounded-full animate-spin" />
        <p className="text-sm font-medium text-zinc-500 tracking-widest uppercase">Fetching Feed...</p>
      </div>
    );
  }

  const handleLike = (postid: string, index: number) => {
    const Url = post[index]?.media[0]?.url ?? "";
    const isLiked = likedImage[postid] ?? false;
    if (!isLiked) {
      setLikedImage((prev) => ({ ...prev, [postid]: !isLiked }))
      likeCreateMutation.mutate({ userId, Url, token });
    } else {
      setLikedImage(prev => {
        const newstate = { ...prev };
        delete newstate[postid];
        return newstate
      });
      likeDeleteMutation.mutate({ userId, Url, token });
    }
  };

  const handleCommentPanel = (index: number) => {
    const url = post[index]
    setCommentForPost(url);
    setOpenComment(true)
  };

  const formatLikes = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num.toString();
  }

  const combinedFeed: feedItem[] = [
    ...post.map((p: PostType) => ({ kind: "post", data: p })),
    ...videos.map((v: VideoItem) => ({ kind: "video", data: v }))
  ]

  return (
  <div className="flex flex-col items-center gap-10 py-10 w-full">
    {combinedFeed.map((item: feedItem, index: number) => {
      const itemId = item.kind === "post" ? item.data._id : item.data.publicId;
      const isLiked = likedImage[itemId];

      return (
        <div
          key={index}
          className="w-full max-w-[520px] rounded-3xl overflow-hidden
          bg-gradient-to-b from-[#1b153f] via-[#151133] to-[#0f0b26]
          border border-white/10
          shadow-[0_15px_40px_rgba(0,0,0,0.6)]
          backdrop-blur-xl
          transition-all duration-300
          hover:shadow-[0_20px_60px_rgba(0,0,0,0.9)]
          hover:border-white/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/20">
                <Image
                  src={item.data.userId.profileImage || "/images/qunt.jpg"}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="leading-tight">
                <Link href={`/account/${item.data.userId.username}?id=${item.data.userId._id}`}>
                  <p className="text-sm font-semibold text-white hover:text-green-400 transition">
                    {item.data.userId.username || "User"}
                  </p>
                </Link>

                <p className="text-[11px] text-zinc-400">
                  {formatDistanceToNow(new Date(item.data.createdAt))} ago
                </p>
              </div>
            </div>

            <button className="p-2 rounded-full hover:bg-white/10 transition">
              <EllipsisVertical size={20} className="text-zinc-400" />
            </button>
          </div>

          {/* Media */}
          <div className="relative w-full aspect-square bg-black">
            {item.kind === "post" ? (
              <Image
                src={item.data.media[0]?.url || "/placeholder.png"}
                alt="post"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <video
                src={item.data.url}
                controls
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {/* Actions */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleLike(itemId, index)}
                className="flex items-center gap-2 group"
              >
                <Heart
                  size={24}
                  className={`transition-all duration-300 ${
                    isLiked
                      ? "fill-red-500 text-red-500 scale-110"
                      : "text-zinc-400 group-hover:text-red-400"
                  }`}
                />

                <span className="text-sm font-semibold text-zinc-300">
                  {likesOnPost[itemId]
                    ? formatLikes(likesOnPost[itemId])
                    : 0}
                </span>
              </button>

              <button
                onClick={() => handleCommentPanel(index)}
                className="text-zinc-400 hover:text-blue-400 transition"
              >
                <MessageCircle size={24} />
              </button>

              <button className="text-zinc-400 hover:text-green-400 transition">
                <Send size={24} />
              </button>
            </div>

            {/* Caption */}
            <p className="text-sm text-zinc-200 leading-relaxed">
              <span className="font-semibold text-white mr-2">
                {item.data.userId.username}
              </span>

              {item.kind === "post"
                ? item.data.caption
                : item.data.caption || "View video details..."}
            </p>
          </div>
        </div>
      );
    })}

    {openComment ? (
      <CommentPanel
        close={() => setOpenComment(false)}
        data={commentForPost!}
      />
    ) : null}
  </div>
)
}