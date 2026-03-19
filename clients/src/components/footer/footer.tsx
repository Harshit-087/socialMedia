"use client";
import { House, MessagesSquare, Users, Cog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const navItems = [
    { name: "Home", icon: House, href: "/account/dashboard" },
    { name: "Chat", icon: MessagesSquare, href: "/account/chat" },
    { name: "Group", icon: Users, href: "/account/community" },
    { name: "Settings", icon: Cog, href: "/account/setting" },
  ];

  return (
    <ul className="w-full h-full flex max-md:items-center max-md:justify-around  lg:bg-transparent lg:flex-col lg:justify-start lg:gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        
        return (
          <li key={item.name} className="w-full">
            <Link
              href={item.href}
              className={`
                relative group flex flex-col lg:flex-row items-center lg:gap-4 
                px-4 py-3 transition-all duration-300 rounded-xl
                ${item.name === "Settings" ? "lg:mt-auto lg:border-t lg:border-white/5 lg:pt-6" : ""}
                ${active 
                  ? "text-green-400 lg:bg-white/5 lg:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"}
              `}
            >
              {/* Active Indicator Bar (Desktop only) */}
              {active && (
                <div className="hidden lg:block absolute left-0 w-1 h-6 bg-green-400 rounded-r-full" />
              )}

              <Icon 
                size={22} 
                className={`transition-transform duration-300 group-hover:scale-110 ${active ? "drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" : ""}`} 
              />
              
              <span className={`
                text-[10px] lg:text-sm font-semibold tracking-wide transition-colors
                ${active ? "text-black lg:text-white" : "text-inherit"}
              `}>
                {item.name}
              </span>

              {/* Mobile Active Dot */}
              {active && (
                <div className="lg:hidden absolute -bottom-1 w-1 h-1 bg-green-400 rounded-full" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}