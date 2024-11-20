'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { LayoutGrid, LayoutList, LayoutDashboard, Search, ChevronDown, ShoppingCart, Circle } from 'lucide-react'

export default function NFTMarketplace() {
  const [viewMode, setViewMode] = useState('grid')
  
  const nfts = Array(4).fill({
    name: "Oracle Patron NFT",
    price: "0.225 ETH",
    lastSale: "0.22 ETH",
    image: "/placeholder.svg?height=400&width=300"
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="border-b border-zinc-800">
        <div className="container mx-auto">
          <nav className="flex items-center gap-8 py-4">
            <Button variant="ghost" className="font-bold">Items</Button>
            <Button variant="ghost">Offers</Button>
            <Button variant="ghost">Analytics</Button>
            <Button variant="ghost">Activity</Button>
          </nav>
        </div>
      </div>

      <div className="container mx-auto py-6">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 space-y-6">
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Circle className="h-4 w-4" />
                Filter
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center justify-between">
                Status
                <ChevronDown className="h-4 w-4" />
              </h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                  Listed
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  On auction
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  New
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  Has offers
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center justify-between">
                Price
                <ChevronDown className="h-4 w-4" />
              </h3>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center justify-between">
                Currency
                <ChevronDown className="h-4 w-4" />
              </h3>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <span>Sweep</span>
                <Switch />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Circle className="h-3 w-3 fill-green-500 text-green-500" />
                <span>Live</span>
                <span className="text-zinc-500">15,071 results</span>
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
                <Input 
                  placeholder="Search by name or trait" 
                  className="pl-10 bg-zinc-900 border-zinc-800"
                />
              </div>
              <Select defaultValue="low-to-high">
                <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low-to-high">Price low to high</SelectItem>
                  <SelectItem value="high-to-low">Price high to low</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 border border-zinc-800 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === 'list' ? 'bg-zinc-800' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === 'grid' ? 'bg-zinc-800' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === 'large' ? 'bg-zinc-800' : ''}
                  onClick={() => setViewMode('large')}
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className={`grid ${viewMode === 'list' ? 'grid-cols-1' : viewMode === 'grid' ? 'grid-cols-3' : 'grid-cols-4'} gap-4`}>
              {nfts.map((nft, i) => (
                <div key={i} className="bg-zinc-900 rounded-lg overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{nft.name}</h3>
                    <p className="text-lg font-bold mb-2">{nft.price}</p>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Buy now
                      </Button>
                      <Button variant="outline" size="icon" className="border-zinc-700">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-zinc-500 mt-2">Last sale: {nft.lastSale}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}