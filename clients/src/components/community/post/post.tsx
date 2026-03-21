"use client"
import { useState } from "react"
// Note: You may need to install 'lucide-react' for the icons
import { MessageSquare, Heart, Share2, Bookmark, MoreHorizontal } from "lucide-react"

export default function Post() {
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* POST CONTAINER */}
      <div className="bg-[#121826] border border-gray-800 rounded-2xl p-6 text-white shadow-xl">
        
        {/* HEADER: User Info */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            {/* User Avatar Dummy */}
            <div className="w-12 h-12 bg-gray-600 rounded-full overflow-hidden border border-gray-700">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=cryptoking" alt="avatar" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold hover:underline cursor-pointer">cryptoking</span>
                <span className="bg-red-500 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Admin</span>
                <span className="text-gray-500 text-sm">• Level 42</span>
              </div>
              <p className="text-gray-500 text-xs">37 minutes ago</p>
            </div>
          </div>
          <button className="text-gray-500 hover:bg-gray-800 p-1 rounded-full">
            <MoreHorizontal size={20} />
          </button>
        </div>

        {/* BODY: Text Content */}
        <div className="space-y-4 mb-4">
          <p className="text-gray-200 leading-relaxed">
            Just launched our new AI model that can generate entire codebases from natural language! 
            This is going to revolutionize how we build software. What do you all think about the 
            future of AI-assisted development?
          </p>
          
          {/* IMAGE PLACEHOLDER: Matches the blue AI abstract image in your screenshot */}
          <div className="rounded-xl overflow-hidden border border-gray-800">
             <img 
               src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000" 
               alt="AI Concept" 
               className="w-full h-auto object-cover"
             />
          </div>
        </div>

        {/* FOOTER: Stats & Actions */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
          <div className="flex items-center gap-6 text-gray-400">
            <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer">
              <Heart size={20} className="fill-red-500 text-red-500" />
              <span className="text-sm font-medium">234</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer">
              <MessageSquare size={20} />
              <span className="text-sm font-medium">45</span>
            </div>
            <div className="flex items-center gap-2 hover:text-green-400 cursor-pointer">
              <Share2 size={20} />
              <span className="text-sm font-medium">12</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white">
            <Bookmark size={20} />
          </button>
        </div>

        {/* INPUT AREA: Your original logic styled to match */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full hidden sm:block"></div>
          <input
            id="message"
            name="message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="text"
            placeholder="Write a comment..."
            className="flex-1 bg-transparent outline-none border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-blue-500 transition-colors"
          />
          <button 
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
            onClick={() => { console.log(inputValue); setInputValue(""); }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}