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
   
      <ul className="w-full h-full flex justify-around items-center lg:flex-col ">
        {navItems.map((item, idx) => (
          <Link key={idx} href={item.href} className="group flex flex-col lg:flex-row lg:gap-2 lg:my-2 lg:px-2 items-center max-md:justify-center h-full w-full transition-all">
            <span className="p-2 rounded-full group-hover:bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 text-gray-600 group-hover:text-white transition-all duration-300">
              {item.icon}
            </span>
            <span className="text-xs lg:text-lg mt-1 text-gray-600 group-hover:text-purple-500 hover:font-bold">
              {item.name}
            </span>
          </Link>
        ))}
      </ul>
    
  );
}
