import Image from "next/image";
import Link from "next/link";

export default function Trending() {
  return (
    <div className="w-full bg-[#161031] border border-white/10 rounded-2xl shadow-xl p-5 text-white">

      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/10">
        <div className="relative w-9 h-9">
          <Image
            src="/images/fire.jpg"
            alt="fire"
            fill
            className="object-cover"
          />
        </div>

        <h1 className="font-semibold text-lg">Trending</h1>

        <Link
          href="#"
          className="ml-auto text-sm text-blue-400 hover:text-blue-300"
        >
          See more
        </Link>
      </div>

      {/* Trending topics */}
      <div className="flex flex-col gap-4 mt-4">

        {/* Item */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-zinc-200">
              #SummerVibes
            </p>
            <span className="text-xs text-zinc-400">
              120K posts
            </span>
          </div>

          <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 rounded-full font-medium transition">
            + Follow
          </button>
        </div>

        {/* Item example */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-zinc-200">
              #TravelDiaries
            </p>
            <span className="text-xs text-zinc-400">
              89K posts
            </span>
          </div>

          <button className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 rounded-full font-medium transition">
            + Follow
          </button>
        </div>

      </div>
    </div>
  );
}