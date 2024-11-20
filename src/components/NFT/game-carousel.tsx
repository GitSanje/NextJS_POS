'use client'

import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"

export default function GameCarousel() {
  const games = [
    {
      id: 1,
      title: "Money Print Factory",
      image: "/placeholder.svg?height=200&width=300",
      status: "Coming Soon",
      price: null,
    },
    {
      id: 2,
      title: "Yard Sale Simulator",
      image: "/placeholder.svg?height=200&width=300",
      status: null,
      price: 6.99,
    },
    {
      id: 3,
      title: "Clicker Clicker Clicker",
      image: "/placeholder.svg?height=200&width=300",
      status: null,
      price: 1.89,
      tags: ["Idler", "Clicker", "Relaxing", "Economy"],
      reviews: {
        count: 12,
        status: "Positive",
      },
      releaseDate: "Nov 5, 2024",
      previewImage: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 4,
      title: "Idle Colony",
      image: "/placeholder.svg?height=200&width=300",
      status: "Coming Soon",
      price: null,
    },
  ]

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-200">MORE LIKE THIS</h2>
        <Button variant="link" className="text-blue-400 hover:text-blue-300">
          See All
        </Button>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-hidden">
          {games.map((game) => (
            <HoverCard key={game.id} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className="relative w-[300px] h-[200px] rounded-lg overflow-hidden">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                      <div className="w-full">
                        {game.status ? (
                          <div className="text-lg font-semibold text-white">
                            {game.status}
                          </div>
                        ) : (
                          <div className="text-lg font-semibold text-white">
                            ${game.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </HoverCardTrigger>
              
              {game.tags && (
                <HoverCardContent 
                  className="w-[400px] bg-gray-800 border-gray-700 text-gray-100"
                  sideOffset={5}
                >
                  <div className="space-y-4">
                    <img
                      src={game.previewImage}
                      alt={`${game.title} preview`}
                      className="w-full h-[200px] object-cover rounded-lg"
                    />
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{game.title}</h3>
                      <div className="flex gap-2 flex-wrap mb-3">
                        {game.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-gray-700 text-gray-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={game.reviews.status === "Positive" ? "text-green-400" : "text-yellow-400"}>
                          {game.reviews.status}
                        </span>
                        <span className="text-gray-400">
                          ({game.reviews.count} User Reviews)
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm mt-1">
                        {game.releaseDate}
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              )}
            </HoverCard>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-gray-800/80 hover:bg-gray-700/80 text-white"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-gray-800/80 hover:bg-gray-700/80 text-white"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
    </div>
  )
}