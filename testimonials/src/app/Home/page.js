// pages/dashboard.js
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Navbar from "../components/Navbar/Navbar";
import { FaFileAlt, FaVideo, FaFolderOpen, FaFolderPlus } from "react-icons/fa";
import Footer from "../components/Footer/Footer";

const Home = () => {
  const [user, setUser] = useState(null);
  const [spacesCount, setSpacesCount] = useState(0);
  const [videosCount, setVideosCount] = useState(0);
  const [testimonialsCount, setTestimonialsCount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else router.push("/"); // Redirect if not logged in
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-10 pb-32">

      <h1 className="text-xl md:text-2xl text-[#091057] font-bold mb-4">Welcome, {user?.displayName}</h1>

      <div className="overview flex flex-col items-center mt-15 ">
        <h3 className="text-xl md:text-2xl text-gray-600 font-semibold my-10">
          Overview
        </h3>

        <div className="cards flex flex-col lg:flex-row items-center gap-10">

          <div className="bg-white shadow-md rounded-lg flex flex-col justify-between gap-6 p-10 md:p-12 ">
            <div className="flex justify-between items-center gap-12">
              <h3 className="text-xl font-semibold text-gray-700">Total Spaces</h3>
              <FaFolderOpen className="text-3xl text-[#091057]" />
            </div>
            <div className="text-4xl font-bold text-gray-800">
              {spacesCount}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg flex flex-col justify-between gap-6 p-10 md:p-12">
            <div className="flex justify-between items-center gap-12">
              <h3 className="text-xl font-semibold text-gray-700">Total Videos</h3>
              <FaVideo className="text-3xl text-[#091057]" />
            </div>
            <div className="text-4xl font-bold text-gray-800">
              {videosCount}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg flex flex-col justify-between gap-6 p-10 md:p-12">
            <div className="flex justify-between items-center gap-12">
              <h3 className="text-xl font-semibold text-gray-700">Testimonials</h3>
              <FaFileAlt className="text-3xl text-[#091057]" />
            </div>
            <div className="text-4xl font-bold text-gray-800">
              {testimonialsCount}
            </div>
          </div>

        </div>

      </div>

      <div className="overview flex flex-col items-center mt-15 ">
        <h3 className="text-xl md:text-2xl text-gray-600 font-semibold my-10">
          Your spaces
        </h3>

        {
          spacesCount===0 ? 
            <div className="flex flex-col justify-start items-center md:my-0">
                <FaFolderPlus className="text-3xl text-[#091057] mb-4" />
                <h2 className="text-m md:text-xl text-[#091057] font-bold">No Spaces yet</h2>
                <h3 className="text-sm md:text-m text-gray-600 font-semibold my-4">
                Create your first space to start collecting testimonials
                </h3>
                
                <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500">
                  + Create a new Space
                </button>

            </div> 

            : null
        }

      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Home;
