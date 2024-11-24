import { ProductCardSkeleton } from "./product-card-skeleton"



interface ProductGridSkeletonProps {
  count?: number
  isMobile: boolean
}

export function ProductGridSkeleton({ count = 8, isMobile }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} isMobile={isMobile} />
      ))}
    </div>
  )
}

