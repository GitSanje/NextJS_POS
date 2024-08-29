"use client"
import {
  BookOpen,
  Braces,
  GlobeLock,
  Phone,
  TableOfContents,
} from "lucide-react";
import { useRouter } from "next/navigation";

import React,{useRef,useEffect} from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const Page = ({ sidebarOpen ,setSideBarOpen}) => {
  const router = useRouter()

  const handleLogout =  async(e) => {
    e.preventDefault();
  
    const res = await fetch('http://localhost:3500/api/users/logout', {
      method:"POST",
      credentials: "include"
    })
  
    if(res.ok){
      toast.success("Logged out successfully!");
      localStorage.removeItem('user');
      router.push("/?tab=login");
    }
  
   }
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSideBarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSideBarOpen]);
  return (
    <aside
    ref={sidebarRef}
      className={`fixed ${
        sidebarOpen
          ? "translate-x-0 transition-transform duration-300 ease-in-out"
          : "-translate-x-full transition-transform duration-300 ease-in-out"
      } top-0 left-0 flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-gray-300 border-r dark:bg-gray-900 dark:border-gray-700`}
    >
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav className="flex-1 -mx-3 space-y-3 ">
          <>
        
            <div className="flex flex-col items-center mt-6 -mx-2  py-2">
              <img
                className="object-cover w-24 h-24 mx-2 rounded-full"
                src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                alt="avatar"
              />
              <h4 className="mx-2 mt-2 font-medium text-gray-800 dark:text-gray-200">
                Sukraj Chaudhary
              </h4>
              <p className="mx-2 mt-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                Sukrajchaudhary90@gmail.com
              </p>
              <button className="h-1 p-5 px-6 border-1 bg-red-400 mt-2 flex justify-center items-center rounded-3xl"
              onClick={handleLogout}>Signout</button>
            </div>
          </>
           <hr className="h-[1px]" />
          <h1 className=" text-xl ">Help Documents</h1>
          <a
            className="flex items-center px-3 py-1 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            href="#"
          >
            <BookOpen
              className="h-10 w-10 border-2 p-2 bg-blue-600 text-white rounded-full"
              color="#ecedee"
            />
            <span className="mx-2 text-sm font-medium">User Guide</span>
          </a>
          <a
            className="flex items-center px-3 py-1 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            href="#"
          >
            <Braces
              className="h-10 w-10 border-2 p-2 bg-purple-500 text-white rounded-full"
              color="#ecedee"
            />
            <span className="mx-2 text-sm font-medium">Developer Guides</span>
          </a>
          <a
            className="flex items-center px-3 py-1 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            href="#"
          >
            <TableOfContents
              className="h-10 w-10 border-2 p-2 bg-red-700 text-white rounded-full"
              color="#ecedee"
            />

            <span className="mx-2 text-sm font-medium">FAQs</span>
          </a>
          <a
            className="flex items-center px-3 py-1 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            href="#"
          >
            <GlobeLock
              className="h-10 w-10 border-2 p-2 bg-pink-600 text-white rounded-full"
              color="#ecedee"
            />
            <span className="mx-2 text-sm font-medium whitespace-nowrap">
              {" "}
              Practices of Security
            </span>
          </a>
          <a
            className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            href="#"
          >
            <Phone
              className="h-10 w-10 border-2 p-2 bg-green-600 text-white rounded-full"
              color="#ecedee"
            />
            <span className="mx-2 text-sm font-medium">Contact Us</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default Page;
