"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "../../hooks/useCartStore";
import { signOut, useSession } from "next-auth/react";
import CartModel from "../Cart/CartModel";
import { toast } from "react-toastify";



const NavIcons = () => {

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathName = usePathname();
  const {data: session} = useSession()
  
  
  const { cart, counter, getCart } = useCartStore();
  const userId =  session?.user?.id;
  // console.log(session?.user?.id, cart,counter);

  
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false }); // Prevent automatic redirection
      toast.success("Logged out successfully", {
        autoClose: 2000,
      });
      window.location.href = '/';
    } catch (error) {
      toast.error("Failed to log out");
    }
  };


  const handleProfile = () => {
    if (!session) {
      router.push("/api/auth/signin");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

   useEffect(() => {
    if(userId){
      getCart(userId)
    }
   },[userId])


  return (
    <>
         <div className="flex items-center gap-4 xl:gap-6 relative">
      <Image
        src="/profile.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
        // onClick={login}
        onClick={handleProfile}
      />
      {isProfileOpen && (
        <div className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          
          <Link href="/profile">Profile</Link>

           <div className="mt-2 cursor-pointer" onClick={() => setIsProfileOpen(false)}>
           <Link href="/order">Order</Link>
            </div>
         
          <div className="mt-2 cursor-pointer" onClick={handleSignOut}>
            {isLoading ? "Logging out" : "Logout"}
          </div>
        </div>
      )}
      <Image
        src="/notification.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div
        className="relative cursor-pointer"
        onClick={() => setIsCartOpen((prev) => !prev)}
      >
        <Image src="/cart.png" alt="" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>
      {isCartOpen && <CartModel setIsCartOpen = {setIsCartOpen}/>}
    </div>
      
    </>
  )
}

export default NavIcons
