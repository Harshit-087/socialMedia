import { House, MessagesSquare, Users, Cog } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const navItems = [
    { name: "Home", icon: <House />, href: "/account/dashboard" },
    { name: "Chat", icon: <MessagesSquare />, href: "/chat" },
    { name: "Group", icon: <Users />, href: "/community" },
    { name: "Settings", icon: <Cog />, href: "/setting" },
  ];

  return (
    <div className="w-full h-[60px] fixed bottom-0 bg-white/90 backdrop-blur-md shadow-t-lg border-t border-gray-200">
      <ul className="w-full h-full flex justify-around items-center">
        {navItems.map((item, idx) => (
          <Link key={idx} href={item.href} className="group flex flex-col items-center justify-center h-full w-full transition-all">
            <span className="p-2 rounded-full group-hover:bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 text-gray-600 group-hover:text-white transition-all duration-300">
              {item.icon}
            </span>
            <span className="text-xs mt-1 text-gray-600 group-hover:text-gray-900 font-medium">
              {item.name}
            </span>
          </Link>
        ))}
      </ul>
    </div>
  );
}
