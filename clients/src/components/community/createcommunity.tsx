import { TbXboxX } from "react-icons/tb";

export default function CreateCommunity({ closeCreate }: { closeCreate: (v: boolean) => void }) {

    const handleSubmit=(e:React.FormEvent)=>{
      e.preventDefault();
    //   value = e.currentTarget
    }
  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-center items-center px-3">
      
      <div className="w-full md:w-2xl h-8/12 bg-white rounded-lg flex flex-col p-6 gap-4 overflow-y-scroll">
        
        {/* Header */}
        <div className="w-full flex items-center">
          <h1 className="text-xl font-semibold">Create Community</h1>
          <TbXboxX
            size={22}
            className="text-black ml-auto cursor-pointer"
            onClick={() => closeCreate(false)}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Community Name */}
          <div>
            <label className="block mb-2 text-sm font-medium">Community Name</label>
            <input
              type="text"
              placeholder="Enter community name"
              className="w-full p-3 rounded-lg bg-[#0f1b2d] text-white border border-gray-700 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              placeholder="What's this community about?"
              rows={4}
              className="w-full p-3 rounded-lg bg-[#0f1b2d] text-white border border-gray-700 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-medium">Category</label>
            <select className="w-full p-3 rounded-lg bg-[#0f1b2d] text-white border border-gray-700 focus:outline-none">
              <option>Tech</option>
              <option>Fitness</option>
              <option>Business</option>
              <option>Travel</option>
              <option>Crypto</option>
              <option>Study</option>
              <option>Gaming</option>
              <option>Food</option>
              <option>Art</option>
              <option>Music</option>
            </select>
          </div>

          {/* Privacy */}
          <div>
            <label className="block mb-3 text-sm font-medium">Privacy</label>
            <div className="flex gap-3">
              <button type="button" className="flex-1 py-2 rounded-lg bg-[#0f1b2d] text-white border border-gray-700">
                Public
              </button>
              <button type="button" className="flex-1 py-2 rounded-lg bg-[#0f1b2d] text-white border border-gray-700">
                Private
              </button>
              <button type="button" className="flex-1 py-2 rounded-lg bg-blue-600 text-white">
                Invite Only
              </button>
            </div>
          </div>

          {/* Theme Color */}
          <div>
            <label className="block mb-3 text-sm font-medium">Theme Color</label>
            <div className="flex gap-3 flex-wrap">
              <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-black cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-purple-600 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-green-500 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-pink-500 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-orange-500 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-red-500 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-cyan-500 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-indigo-500 cursor-pointer"></div>
            </div>
          </div>

          <div className="flex gap-4 ">
                  <label htmlFor="banner"
                    className="w-[45%] h-12 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer text-gray-500 hover:border-blue-500">
                    <input type="file" accept="image/*" className="hidden"/>
                    upload Banner
                  </label>

                   <label htmlFor="icon"
                    className="flex-1 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer text-gray-500 hover:border-blue-500">
                    <input type="file" accept="image/*" className="hidden"/>
                    upload Icon
                  </label>
          </div>

          <button
          type="submit"
          className="rounded-lg  h-10  w-full self-center bg-blue-400 hover:bg-blue-700">create community</button>

        </form>
      </div>
    </div>
  );
}