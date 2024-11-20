import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle, ChevronDown } from "lucide-react"

export default function Component() {
  const [view, setView] = useState('trending')
  const [timeFrame, setTimeFrame] = useState('24h')

  const collections = [
    {
      rank: 1,
      name: "Oracle Patron NFT",
      image: "/placeholder.svg?height=48&width=48",
      verified: true,
      floorPrice: "0.23",
      volume: "722"
    },
    {
      rank: 2,
      name: "tubby cats",
      image: "/placeholder.svg?height=48&width=48",
      verified: true,
      floorPrice: "0.10",
      volume: "17"
    },
    {
      rank: 3,
      name: "Lil Pudgys",
      image: "/placeholder.svg?height=48&width=48",
      verified: true,
      floorPrice: "1.17",
      volume: "157"
    },
    {
      rank: 4,
      name: "Rumble Kong League",
      image: "/placeholder.svg?height=48&width=48",
      verified: true,
      floorPrice: "0.09",
      volume: "11"
    },
    {
      rank: 5,
      name: "0N1 Force",
      image: "/placeholder.svg?height=48&width=48",
      verified: true,
      floorPrice: "0.10",
      volume: "8"
    },
    {
      rank: 6,
      name: "Redacted Remilio Ba...",
      image: "/placeholder.svg?height=48&width=48",
      verified: true,
      floorPrice: "1.45",
      volume: "121"
    },
    {
      rank: 7,
      name: "Doodles",
      image: "/placeholder.svg?height=48&width=48",
      verified: true,
      floorPrice: "2.45",
      volume: "128"
    },
    {
      rank: 8,
      name: "Milady Maker",
      image: "/placeholder.svg?height=48&width=48",
      verified: true,
      floorPrice: "6.60",
      volume: "306"
    },
    {
      rank: 9,
      name: "Mutant Ape Yacht Club",
      image: "/placeholder.svg?height=48&width=48",
      verified: true,
      floorPrice: "2.25",
      volume: "101"
    },
    {
      rank: 10,
      name: "Otherdeed Expanded",
      image: "/placeholder.svg?height=48&width=48",
      verified: true,
      floorPrice: "0.14",
      volume: "9"
    }
  ]

  return (
    <div className="w-full min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button 
              variant={view === 'trending' ? "secondary" : "ghost"} 
              className={view === 'trending' ? "bg-zinc-800 hover:bg-zinc-700" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}
              onClick={() => setView('trending')}
            >
              Trending
            </Button>
            <Button 
              variant={view === 'top' ? "secondary" : "ghost"} 
              className={view === 'top' ? "bg-zinc-800 hover:bg-zinc-700" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}
              onClick={() => setView('top')}
            >
              Top
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex">
              {['1h', '6h', '24h', '7d'].map((time) => (
                <Button 
                  key={time}
                  variant={timeFrame === time ? "secondary" : "ghost"} 
                  className={timeFrame === time ? "bg-zinc-800 hover:bg-zinc-700" : "text-zinc-400 hover:text-white hover:bg-zinc-800"}
                  onClick={() => setTimeFrame(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All chains</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
              View all
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-zinc-400 text-sm border-b border-zinc-800">
                <th className="text-left py-3 px-4">Rank</th>
                <th className="text-left py-3 px-4">Collection</th>
                <th className="text-right py-3 px-4">Floor Price</th>
                <th className="text-right py-3 px-4">Volume</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr
                  key={collection.rank}
                  className="border-b border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="py-4 px-4">{collection.rank}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-12 h-12 rounded-lg"
                      />
                      <div className="flex items-center gap-1">
                        {collection.name}
                        {collection.verified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">{collection.floorPrice} ETH</td>
                  <td className="py-4 px-4 text-right">{collection.volume} ETH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}