"use client"; // Ensures it's a client-side component

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {auth} from '../../../lib/firebase'
import { useAuth } from "@/lib/useAuth";

import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Track menu state
  
  const router = useRouter();


  const {user} = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/Login");
  };


  return (
    <nav className="bg-[#091057] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center">
          <Image
            src="/favicon.ico" // Use your logo path here
            alt="Logo"
            className="h-8 w-8 mr-2"
            width={100}
            height={100}
          />
          <span className="text-white text-lg font-semibold">Testimonials</span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex space-x-6">
          {["Home", "About", "Services", "Contact"].map((name) => (
            <a
              key={name}
              href={`#${name.toLowerCase()}`}
              className="text-white hover:text-gray-300 transition"
            >
              {name}
            </a>
          ))}
        </div>

        {/* Login/Signup Buttons */}
        { !user ? <div className="hidden md:flex space-x-4">
          <button
            onClick={() => router.push("/Login")}
            className="bg-none text-white px-4 py-2 rounded-md hover:bg-none transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/Login")}
            className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-white transition"
          >
            Signup
          </button>
        </div>
        :
        <div className="hidden md:flex space-x-4">
            <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      }

        {/* Hamburger Menu for Small Screens */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu (Popdown) */}
      {isOpen && (
        <div className="md:hidden  p-4 space-y-2">
          {["Home", "About", "Services", "Contact"].map((name) => (
            <a
              key={name}
              href={`#${name.toLowerCase()}`}
              className="block text-white hover:bg-blue-400 p-2 rounded transition"
            >
              {name}
            </a>
          ))}

          {!user ? <div className="flex space-x-4 mt-4">
            <button
              onClick={() => router.push("/Login")}
              className="bg-white text-blue-600 w-full py-2 rounded-md hover:bg-gray-200 transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/Login")}
              className="bg-gray-200 text-blue-600 w-full py-2 rounded-md hover:bg-white transition"
            >
              Signup
            </button>
          </div>
          :
          <div className="flex space-x-4 mt-4">
            <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-500"
              >
                Logout
              </button>
          </div>
        } 

        </div>
      )}
    </nav>
  );
}
