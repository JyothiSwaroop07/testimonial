// src/app/page.js

"use client";

import Navbar from "./components/Navbar/Navbar";
import { useRouter } from "next/navigation";

export default function App() {

  const router = useRouter();

  return (
    <div className="w-[100vw]">
      <Navbar/>

      <div className="flex flex-col items-center justify-start  min-h-screen bg-gray-100 p-[8vw] md:p-[10vw]">
          <div className=" w-[80vw] md:w-[60vw] xl:w-[50vw]">
            <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold mb-4 md:mb-8 text-[#091057] text-center">Get Testimonials from your customers with ease</h1>
            <h2 className="text-sm md:text-m xl:text-m font-bold mb-4 md:mt-6 text-center text-gray-600">Difficult to recieve testimonials and use them? Not anymore with our TestimonialHub. You can collect text and video testimonials from your customers with no need for a developer or website hosting</h2>
            <div className="flex justify-center" >
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-white transition" type="button" onClick={() => router.push("/Login")}>
              Sign In 
            </button>
            </div>

          </div>
      </div>


    </div>
  )
}