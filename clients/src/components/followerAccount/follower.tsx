import Image from "next/image"
import { X } from "lucide-react"
import Link from "next/link"

export type followerAccount = {
 
    profileImage: string
    username: string
    _id: string
  
}

export default function FollowerAccount({
  setSeeAllAccounts,
  followerAccount,
}: {
  setSeeAllAccounts: (v: boolean) => void
  followerAccount: followerAccount[]
}) {
  return (
    // Backdrop
    <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center">

      {/* Modal */}
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="relative flex items-center justify-center border-b px-4 py-3">
          <h2 className="text-base font-semibold">Followers</h2>

          <X
            onClick={() => setSeeAllAccounts(false)}
            className="absolute right-4 cursor-pointer text-gray-500 hover:text-black"
          />
        </div>

        {/* List */}
        {followerAccount.length ===0 ?
        <p>no account to show</p>
      :(<div className="flex-1 overflow-y-auto">
          {followerAccount.map((items:followerAccount, index:number) => (
            <Link key={index} href={`/account/${items.username}?id=${items._id}`}>
            <div
              key={ index}
              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 transition"
            >
              {/* Avatar */}
              <div className="relative w-11 h-11 rounded-full overflow-hidden">
                <Image
                  src={items.profileImage || "/images/user.png"}
                  alt="profile"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Username */}
              <p className="text-sm font-medium">
                {items.username}
              </p>

              <button className="px-3 py-1 bg-blue-500 text-white rounded-xl ml-auto">Message</button>
            </div>
            </Link>
          ))}
        </div>)}
        
      </div>
    </div>
  )
}
