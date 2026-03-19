"use client"
import {useState} from "react"

export default function Post() {

    const [ inputValue,setInputValue] = useState<string>("");
  return (
    <div className="w-full h-24  flex items-center gap-3 p-4 rounded-xl">
      
      <input
        id="message"
        name="message"
        value={inputValue}
        onChange={(e)=>setInputValue(e.target.value)}
        type="text"
        placeholder="Enter the message"
        className="flex-1 h-full outline-none border-2 border-gray-800 rounded-lg px-4"
      />

      <button className="w-20 h-12  bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
        Post
      </button>

    </div>
  );
}