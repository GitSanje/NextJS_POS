"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

// Menu items
const menuItems = [
  { href: "/", label: "Homepage" },
  { href: "/", label: "Shop" },
  { href: "/", label: "Deals" },
  { href: "/", label: "About" },
  { href: "/", label: "Contact" },
  { href: "/", label: "Cart(1)" },
];

const Menu = () => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false }); // Prevent automatic redirection
      toast.success("Logged out successfully", {
        autoClose: 2000,
      });
      redirect("/");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="">
      <FontAwesomeIcon
        icon={open ? faTimes : faBars}
        size="lg"
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
        style={{ width: "30px", height: "30px" }}
      />

      {open && (
        <div className="absolute bg-gray-500 text-white left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl  z-10">
          {menuItems.map((item) => (
            <MenuLink
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </MenuLink>
          ))}
          {session ? (
            <button onClick={handleSignOut}>Logout</button>
          ) : (
            <Link href="/api/auth/signin">
              <button onClick={() => setOpen(false)}>Sign In</button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;

export const MenuLink = ({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => (
  <Link href={href} onClick={onClick}>
    {children}
  </Link>
);
