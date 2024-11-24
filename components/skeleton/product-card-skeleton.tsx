import { Skeleton } from "@/components/ui/skeleton"

interface ProductCardSkeletonProps {
  isMobile: boolean
}

export function ProductCardSkeleton({ isMobile }: ProductCardSkeletonProps) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white text-black shadow-sm animate-pulse">
      <div className={`relative overflow-hidden ${isMobile ? "h-24" : "sm:h-48 h-40"}`}>
        <Skeleton className="absolute inset-0" />
      </div>
      <div className="p-2 flex flex-col gap-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  )
}

