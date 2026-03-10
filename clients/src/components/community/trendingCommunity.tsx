import React from 'react';
import { HiTrendingUp, HiPhotograph } from "react-icons/hi";
import { FaRocket, FaGamepad, FaGem, FaTrophy } from "react-icons/fa";

const SidebarWidgets = () => {
  const trendingCommunities = [
    { id: 1, name: 'Tech Innov...', members: '12,543', growth: '10%', icon: <FaRocket />, color: 'bg-blue-500' },
    { id: 2, name: 'Gaming Le...', members: '28,901', growth: '14%', icon: <FaGamepad />, color: 'bg-purple-500' },
    { id: 3, name: 'Crypto Ent...', members: '45,782', growth: '20%', icon: <FaGem />, color: 'bg-emerald-500' },
    { id: 4, name: 'Digital Arti...', members: '8,234', growth: '13%', icon: <HiPhotograph />, color: 'bg-pink-500' },
  ];

  const topContributors = [
    { rank: 1, name: 'cryptoking', xp: '8,750 XP', color: 'bg-orange-400' },
    { rank: 2, name: 'techsavvy', xp: '7,200 XP', color: 'bg-slate-300' },
    { rank: 3, name: 'gamerpro', xp: '5,640 XP', color: 'bg-orange-700' },
  ];

  return (
    /* Removed fixed width/bg so it inherits from your parent div */
    <div className="flex flex-col gap-6 w-70 max-w-md mx-auto py-8">
      
      {/* Trending Communities Card */}
      <div className="bg-[#1a2235] rounded-[2.5rem] p-8 shadow-2xl border border-slate-700/30">
        <div className="mb-6">
           <div className="flex items-start gap-3 text-white">
            <HiTrendingUp className="text-emerald-400 text-2xl mt-1" />
            <h2 className="text-2xl font-bold leading-tight">
                Trending <br /> Communities
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          {trendingCommunities.map((item) => (
            <div key={item.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-xl text-white shadow-lg`}>
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-[16px]">{item.name}</span>
                  <span className="text-slate-400 text-xs">{item.members} members</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
                <HiTrendingUp />
                <span>+{item.growth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors Card */}
      <div className="bg-[#1a2235] rounded-[2.5rem] p-8 shadow-2xl border border-slate-700/30">
        <div className="flex items-center gap-3 mb-6 text-white">
          <FaTrophy className="text-orange-400 text-xl" />
          <h2 className="text-xl font-bold">Top Contributors</h2>
        </div>

        <div className="space-y-5">
          {topContributors.map((user) => (
            <div key={user.rank} className="flex items-center gap-4">
              <div className={`${user.color} w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-slate-900`}>
                {user.rank}
              </div>
              {/* Avatar Placeholder - Replace 'div' with 'img' for real photos */}
              <div className="w-12 h-12 rounded-full border-2 border-slate-600 bg-slate-800 overflow-hidden">
                 <div className="w-full h-full bg-gradient-to-br from-slate-500 to-slate-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-[16px]">{user.name}</span>
                <span className="text-[11px] text-slate-400 font-bold tracking-widest uppercase">{user.xp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SidebarWidgets;