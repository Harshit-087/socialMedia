"use client";
import { X, Film, Grid, UserSquare2, PlayCircle, Plus } from "lucide-react";
import { useState } from "react";
import Videos from "@/components/video/videos";
import Posts from "@/components/postcard/posts";
import { useUser } from "@/hooks/userhook";
import { storyQuery } from "@/app/api/storyQuery";
import { useMutation, useQuery } from "@tanstack/react-query";
import { userQuery } from "@/app/api/userQuery";

type TabType = "stories" | "posts" | "video" | "tagged";

export default function SlotsComponent({ id }: { id: string }) {
  const { userId ,token} = useUser();
  const [createStory, setCreateStory] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("posts");

  const { data:profile, isLoading } = useQuery({
    queryKey: ["profile", id,token],
    queryFn: async ({ queryKey }) => {
      const [, id,token] = queryKey as [string, string | undefined,string];
      if (!id || !token) return;
      const res = await userQuery.fetchProfile(id,token);
      console.log("post",res.data)
      return res.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await storyQuery.upload(formData);
    },
    onSuccess: () => setCreateStory(false),
  });

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = (e.currentTarget as HTMLFormElement).storyFile as HTMLInputElement;
    const file = value.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("story", file);
    formData.append("userId", userId);
    formData.append("token",token)
    uploadMutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* NAVIGATION TABS */}
      <nav className="w-full border-t border-zinc-800 mt-10">
        <ul className="flex justify-center gap-8 md:gap-16">
          {[
            { id: "posts", label: "POSTS", icon: <Grid size={18} /> },
            { id: "stories", label: "STORIES", icon: <PlayCircle size={18} /> },
            { id: "video", label: "VIDEOS", icon: <Film size={18} /> },
            { id: "tagged", label: "TAGGED", icon: <UserSquare2 size={18} /> },
          ].map((tab) => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 py-4 cursor-pointer transition-all border-t-2 -mt-[2px] ${
                activeTab === tab.id
                  ? "border-white text-white"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.icon}
              <span className="text-xs font-bold tracking-widest">{tab.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* CONTENT SECTION */}
      <section className="w-full mt-8 px-4">
        {activeTab === "stories" && (
          <div className="flex flex-col items-center">
            {userId === id && (
              <button
                onClick={() => setCreateStory(true)}
                className="mb-8 flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition active:scale-95"
              >
                <Plus size={20} />
                Create Story
              </button>
            )}
            <div className="text-zinc-500 py-20 text-center">
              <PlayCircle size={48} className="mx-auto mb-4 opacity-20" />
              <p>No active stories</p>
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="animate-in fade-in duration-500">
            {profile?.data?._id ? (
              <Posts userid={profile.data._id} />
            ) : (
              <p className="text-center text-zinc-500 py-20">No posts yet</p>
            )}
          </div>
        )}

        {activeTab === "video" && (
          <div className="animate-in fade-in duration-500">
            <Videos />
          </div>
        )}

        {activeTab === "tagged" && (
          <div className="text-zinc-500 py-20 text-center animate-in fade-in duration-500">
            <UserSquare2 size={48} className="mx-auto mb-4 opacity-20" />
            <p>No tagged photos</p>
          </div>
        )}
      </section>

      {/* UPLOAD MODAL */}
      {createStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#18181b] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
            <button 
              onClick={() => setCreateStory(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white transition"
            >
              <X size={24} />
            </button>
            
            <form onSubmit={handleStorySubmit} className="p-8">
              <h3 className="text-xl font-bold text-white mb-6">New Story</h3>
              
              <label
                htmlFor="storyImage"
                className="group flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/50 transition-all mb-6"
              >
                <div className="flex flex-col items-center p-6 text-center">
                  <PlayCircle size={48} className="text-zinc-600 group-hover:text-blue-500 mb-4 transition-colors" />
                  <span className="text-zinc-400 font-medium mb-1">Select media to upload</span>
                  <p className="text-xs text-zinc-600">High quality photos or videos</p>
                </div>
                <input
                  type="file"
                  id="storyImage"
                  name="storyFile"
                  accept="image/*,video/*"
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                disabled={uploadMutation.isPending}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold rounded-xl transition shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              >
                {uploadMutation.isPending ? "Uploading..." : "Share to Story"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}