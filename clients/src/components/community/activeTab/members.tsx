"use client"

import Image from "next/image"
import { useState } from "react"

type Member = {
  _id: string
  username: string
  profileImage:string
  avatar?: string
}

export default function MembersList({ members }: { members: Member[] }) {
  const [search, setSearch] = useState("")

  const filteredMembers = members?.filter((m) =>
    m.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full px-4 py-6">
      
      {/* 🔍 Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
        />
      </div>

      {/* 👥 Members Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        
        {filteredMembers?.map((member) => (
          <div
            key={member._id}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center hover:bg-white/10 transition"
          >
            
            {/* Avatar */}
            <div className="relative w-16 h-16 mb-3">
              {member.avatar ? (
                <Image
                  src={member.avatar}
                  alt={member.username}
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {member.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name */}
            <p className="text-sm text-white font-medium text-center">
              {member.username}
            </p>

            {/* Badge */}
            <span className="mt-2 text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
              Member
            </span>
          </div>
        ))}

      </div>

      {/* Empty State */}
      {filteredMembers?.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No members found
        </p>
      )}
    </div>
  )
}