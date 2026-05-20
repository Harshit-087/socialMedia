"use client"

import { useState } from "react"
import { Home, User, Bell, Shield } from "lucide-react"



export default function SettingsPage() {
  // 1. Clean out the old FormState type, we don't need it anymore!

  const [activeTab, setActiveTab] = useState("profile")

  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    notifications: true,
    password: "",
  })

  // 2. Use a robust ChangeEvent type that covers both inputs and textareas safely
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    // Check if it's a checkbox using an "in" guard to safely read the 'checked' property
    const isCheckbox = type === "checkbox" && "checked" in e.target
    const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : value

    setForm((prev) => ({
      ...prev,
      [name]: finalValue,
    }))
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      
      {/* 🔹 Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/10 p-6">
        <h2 className="text-xl font-semibold mb-8">Settings</h2>

        <nav className="space-y-4">
          <button onClick={() => setActiveTab("profile")} className="flex items-center gap-3 hover:text-purple-400">
            <User size={18}/> Profile
          </button>
          <button onClick={() => setActiveTab("security")} className="flex items-center gap-3 hover:text-purple-400">
            <Shield size={18}/> Security
          </button>
          <button onClick={() => setActiveTab("notifications")} className="flex items-center gap-3 hover:text-purple-400">
            <Bell size={18}/> Notifications
          </button>
        </nav>
      </aside>

      {/* 🔹 Main Content */}
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold capitalize">{activeTab}</h1>

          {/* Home Button */}
          <button
            onClick={() => window.location.href = "/account/dashboard"}
            className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20"
          >
            <Home size={16}/> Home
          </button>
        </div>

        {/* 🔹 Profile */}
        {activeTab === "profile" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
            />
            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
            />
            <textarea
              name="bio"
              placeholder="Bio"
              value={form.bio}
              onChange={(e)=>handleChange(e)}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
            />
          </div>
        )}

        {/* 🔹 Security */}
        {activeTab === "security" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
            />
          </div>
        )}

        {/* 🔹 Notifications */}
        {activeTab === "notifications" && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h2 className="font-medium">Enable Notifications</h2>
              <p className="text-sm text-gray-400">Get updates and alerts</p>
            </div>
            <input
              type="checkbox"
              name="notifications"
              checked={form.notifications}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Save Button */}
        <button className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
          Save Changes
        </button>
      </main>

      {/* 🔻 Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-black border-t border-white/10 flex justify-around py-3">
        <button onClick={() => setActiveTab("profile")}><User size={20}/></button>
        <button onClick={() => setActiveTab("security")}><Shield size={20}/></button>
        <button onClick={() => setActiveTab("notifications")}><Bell size={20}/></button>
        <button onClick={() => window.location.href = "/"}><Home size={20}/></button>
      </div>
    </div>
  )
}