"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Search, Menu } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Session } from "next-auth/core/types"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import Image from "next/image";


const categories = [
  { name: "Electronics", href: "/category/electronics" },
  { name: "Clothing", href: "/category/clothing" },
  { name: "Home & Garden", href: "/category/home-garden" },
  { name: "Sports & Outdoors", href: "/category/sports-outdoors" },
]


type Props = {
  session : Session | null 
}
export function NavbarVendify({session}:Props) {

  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const cartItemCount = 3 // This would typically come from your cart state

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const searchTerm = event.currentTarget.search.value
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
  }

    
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false }); 
      toast.success("Logged out successfully");
      window.location.href = '/';
    } catch (error) {
      toast.error("Failed to log out");
    }
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center flex-row gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} />
              <span className="text-2xl font-bold text-primary">
            
              Vendify</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:flex items-center">
            <form onSubmit={handleSearch} className="mr-4">
              <div className="relative">
                <Input
                  type="search"
                  name="search"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 rounded-full"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </form>
            {/* <Link href="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-400 hover:text-gray-500" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Link> */}

            {
              session?.user.id ?
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-4">
                {
  session?.user.image ? (
        <Image 
          src={session.user.image} 
          alt="User Profile" 
          className="h-6 w-6 rounded-full" 
          width={24} 
          height={24} 
        />
      ) : (
        <User className="h-6 w-6" />
      )
    }

                
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem >  <Link href={'/profile'}> Profile </Link></DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/order'}> Orders </Link></DropdownMenuItem> 
                <DropdownMenuItem>Wishlist</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            :
            <Button variant="ghost" size="icon" className="ml-4"
            >
              <Link href={"/auth/login"}>
              <User className="h-6 w-6" />
              
              </Link>
            
            </Button>

            }
            
          </div>
          <div className="flex items-center sm:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col h-full">
                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <Input
                        type="search"
                        name="search"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 rounded-full"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </form>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block text-gray-500 hover:text-gray-900 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-auto space-y-4">
                    <Link
                      href="/cart"
                      className="flex items-center justify-between text-gray-500 hover:text-gray-900 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>Cart</span>
                      <Badge variant="secondary">{cartItemCount}</Badge>
                    </Link>
                    <Link
                      href="/account"
                      className="block text-gray-500 hover:text-gray-900 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Account
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

