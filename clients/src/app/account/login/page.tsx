import CardDemo from "@/components/auth/loginCard";

export default function Login() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12 lg:p-0">
      {/* Premium Background Mesh Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.12),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.12),transparent_50%)]" />
      
      {/* Two-Column Grid: Stacks on mobile, splits 50/50 on large screens */}
      <div className="relative z-10 grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        
        {/* LEFT SIDE: The Login Card */}
        <div className="flex justify-center lg:justify-end lg:pr-8">
          <CardDemo />
        </div>

        {/* RIGHT SIDE: Italic & Tilted Typography Branding */}
        <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left lg:pl-8">
          <div className="inline-block origin-center lg:origin-left transform -rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 italic font-serif">
                Simplicity
              </span>
              <span className="block mt-1 text-slate-200">
                meets productivity.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-base sm:text-lg text-slate-400 font-medium italic tracking-wide">
              “The secret of getting ahead is getting started.”
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}