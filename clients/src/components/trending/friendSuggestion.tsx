import Image from "next/image";
import Link from "next/link";

export default function Suggestion() {
  return (
    <div className="w-full bg-[#161031] border border-white/10 rounded-2xl shadow-xl p-5 text-white">

      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <div className="relative w-9 h-9">
          <Image
            src="/images/friend.jpg"
            alt="friend"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="font-semibold text-lg">Suggestions</h1>

        <Link
          href="#"
          className="ml-auto text-sm text-blue-400 hover:text-blue-300"
        >
          See more
        </Link>
      </div>

      {/* Suggestions list */}
      <div className="flex flex-col gap-4 mt-4">

        {/* Item */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">

            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10">
              <Image
                src="/images/user.png"
                alt="user1"
                fill
                className="object-cover"
              />
            </div>

            <p className="text-sm text-zinc-300 font-medium">
              SummerVibes
            </p>
          </div>

          <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 rounded-full font-medium transition">
            + Follow
          </button>
        </div>

        {/* Item Example */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">

            <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-white/10">
              <Image
                src="/images/user.png"
                alt="user2"
                fill
                className="object-cover"
              />
            </div>

            <p className="text-sm text-zinc-300 font-medium">
              TravelSoul
            </p>
          </div>

          <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 rounded-full font-medium transition">
            + Follow
          </button>
        </div>

      </div>
    </div>
  );
}