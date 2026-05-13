// components/PostSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton"

export function PostSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 border rounded-xl">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" /> {/* Avatar */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-[150px]" /> {/* Username */}
          <Skeleton className="h-4 w-[100px]" /> {/* Timestamp */}
        </div>
      </div>
      <Skeleton className="h-[200px] w-full rounded-xl" /> {/* Post Image/Content */}
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" /> {/* Like Button */}
        <Skeleton className="h-8 w-20" /> {/* Comment Button */}
      </div>
    </div>
  )
}