import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export function ProductCardSkeleton() {
    return (
      [...Array(8)].map((_, index) => (
        <div
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%] animate-pulse"
          key={index}
        >
          {/* Skeleton for image */}
          <div className="relative w-full h-80 bg-gray-300 rounded-md"></div>
      
          {/* Skeleton for product name and price */}
          <div className="flex justify-between items-center">
            <span className="w-1/2 h-4 bg-gray-300 rounded"></span>
            <span className="w-1/4 h-4 bg-gray-300 rounded"></span>
          </div>
      
          {/* Skeleton for description */}
          <div className="h-6 bg-gray-300 rounded mt-2"></div>
      
          {/* Skeleton for button */}
          <div className="w-max py-2 px-4 h-8 bg-gray-300 rounded-2xl mt-2"></div>
        </div>
      ))
    )
}