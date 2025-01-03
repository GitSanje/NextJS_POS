"use client";

import React, { ChangeEvent, useState , useEffect} from "react";
// require('dotenv').config()
import "./user.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Input from "../../../../components/Input/Input";
import Button from "../../../../components/Button/Button";

import { redirect, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn } from "next-auth/react";


interface Props {
  searchParams: URLSearchParams;
}

interface RegisterData {
  username: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
}
interface LoginData {
  email: string;
  password: string;
}
const LoginSignup: React.FC<Props> = ({ searchParams }) => {
  const tab = searchParams.get("tab") || "login";
  const router = useRouter();

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // const [user, setUser] = useState<string>(() => {
  //   const ruser = localStorage.getItem('user');
  //   if (ruser) {
  //     try {
  //       return JSON.parse(ruser) as string; 
  //     } catch (e) {
  //       console.error("Failed to parse user from localStorage", e);
  //       return "";
  //     }
  //   }
  //   return "";
  // });
  
    
  

   


  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3500/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        credentials: "include",
      });
      if (!res.ok) {
        const datares = await res.json();
       
       
        toast.error(datares.error, {
          autoClose: 2000,
        });
    
        return;
      }
      const result = await res.json()
      // setUser(result.user)
      if (global?.window !== undefined) {
        localStorage.setItem('user',JSON.stringify(result.user))

      }
      

      toast.success("Login successful!");
      router.push("/auth/profile");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3500/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
        credentials: "include",
      });

      if (!res.ok) {
        const datares = await res.json();
       console.log(datares);
       
        toast.error(datares.message, {
          autoClose: 2000,
        });
        return;
      }
      toast.success("Registration successful! Please login.");
      router.push("?tab=login");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;

    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const social_icons =
    "btn btn-link btn-floating mx-1 bg-gray-300  text-gray-500  rounded-full hover:bg-indigo-400 hover:text-white  ";
  const $active = "bg-indigo-600 text-white";
  const $button =
    "inline-block font-semibold text-black bg-gray-300 rounded h-10 w-32 flex items-center justify-center ";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 bg-gradient-to-r from-indigo-500">
      <div className="w-full max-w-md mt-4">
        <ul className="flex justify-around mb-6">
          <li className="nav-item">
            <a
              className={`nav-link ${$button} ${
                tab === "login" ? $active : ""
              }`}
              id="tab-login"
              href="?tab=login"
            >
              LOGIN
            </a>
          </li>
          <li className="nav-item">
            <a
              className={`nav-link ${$button} ${
                tab === "register" ? $active : ""
              }`}
              id="tab-register"
              href="?tab=register"
            >
              REGISTER
            </a>
          </li>
        </ul>

        <div id="pills-content">
          <div
            id="pills-login"
            className={`tab-pane fade ${
              tab === "login" ? "show active" : "hidden"
            }`}
          >
            <form
              method="POST"
              onSubmit={handleLoginSubmit}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="text-center mb-3">
                <p className="text-lg font-semibold pb-2 text-black">
                  Sign in with:
                </p>
                <div className="social_accounts" onClick={() => signIn('google', {
                  redirect:false
                })}>
                  <Button className={social_icons} type="button">
                    <i className="fab fa-google"></i>
                  </Button>
                </div>
              </div>
              <p className="text-center font-medium text-black">or:</p>

              <Input
                type="email"
                id="loginName"
                placeholder="Email or username"
                name="email"
                label="Email or username"
                value={loginData.email}
                onChange={handleOnChange}
              />

              <Input
                type="password"
                id="loginPassword"
                placeholder="Password"
                name="password"
                label="Password"
                value={loginData.password}
                onChange={handleOnChange}
              />

              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="loginCheck"
                    className="form-check-input"
                  />
                  <label htmlFor="loginCheck" className="ml-2 text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#!" className="text-indigo-500 hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-500 text-white py-2 rounded-lg"
                id="signinbtn"
              >
                Sign in
              </Button>
              <div className="text-center mt-4">
                <p>
                  Not a member?{" "}
                  <a href="#!" className="text-indigo-500 hover:underline">
                    Register
                  </a>
                </p>
              </div>
            </form>
          </div>

          <div
            id="pills-register"
            className={`tab-pane fade ${
              tab === "register" ? "show active" : "hidden"
            }`}
          >
            <form
              method="POST"
              onSubmit={handleRegisterSubmit}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="text-center mb-3">
                <p className="text-lg font-semibold pb-2 text-black">
                  Sign up with:
                </p>
                <Button className={social_icons} type="button">
                  <i className="fab fa-google"></i>
                </Button>
              </div>
              <p className="text-center font-medium text-black">or:</p>

              <Input
                type="text"
                id="registerFullName"
                placeholder="Full Name"
                name="username"
                label="Full Name"
                value={registerData.username}
                onChange={handleOnChange}
              />
              <Input
                type="number"
                id="phone"
                placeholder="Phone number"
                name="phone"
                label="Phone number"
                value={registerData.phone}
                onChange={handleOnChange}
              />
              <Input
                type="email"
                id="registerEmail"
                placeholder="Email"
                name="email"
                label="Email"
                value={registerData.email}
                onChange={handleOnChange}
              />
              <Input
                type="password"
                id="registerPassword"
                placeholder="Password"
                name="password"
                label="Password"
                value={registerData.password}
                onChange={handleOnChange}
              />
              <Input
                type="password"
                id="registerRepeatPassword"
                placeholder="Repeat Password"
                name="password_confirmation"
                label="Repeat Password"
                value={registerData.password_confirmation}
                onChange={handleOnChange}
              />

              <div className="flex justify-center items-center mb-4">
                <input
                  type="checkbox"
                  id="registerCheck"
                  className="form-check-input"
                />
                <label htmlFor="registerCheck" className="ml-2 text-gray-500">
                  I have read and agree to the terms
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-500 text-white py-2 rounded-lg "
                id="signupbtn"
              >
                Sign up
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
