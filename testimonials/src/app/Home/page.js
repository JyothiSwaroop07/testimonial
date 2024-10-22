// pages/dashboard.js
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../lib/firebase"; // Consolidate firebase imports
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../lib/useAuth";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { FaFileAlt, FaVideo, FaFolderOpen, FaFolderPlus } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

const Home = () => {
  const [user, setUser] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [videosCount, setVideosCount] = useState(0);
  const [testimonialsCount, setTestimonialsCount] = useState(0);
  const [loading, setLoading] = useState(true); // Track loading status

  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user)
        setUser(user) // Redirect if logged in
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [router]);

  const fetchSpaces = async (userId) => {
    try {
        const spacesRef = collection(db, "spaces"); 
        const q = query(spacesRef, where("ownerId", "==", userId));
        const querySnapshot = await getDocs(q);
    
        const spaces = [];
        querySnapshot.forEach((doc) => {
            
            spaces.push({ id: doc.id, ...doc.data() });
        });
        
        console.log(spaces);
        return spaces; 
    } catch (error) {
        console.error("Error fetching spaces:", error);
        return []; 
    }
};

useEffect(() => {
    const getSpaces = async () => {
        
        console.log("useEffect triggered"); 
        if (user) {
            console.log("User found:", user); 
            try {
                const userSpaces = await fetchSpaces(user.uid);
                console.log(user.uid);
                console.log(userSpaces);
                setSpaces(userSpaces);
            } catch (error) {
                console.error("Error fetching spaces:", error);
            } finally {
                setLoading(false); 
            }
        } else {
            console.log("No user found"); 
            setLoading(false); 
        }
    };

    getSpaces();
}, [user]);

  if (loading) {
    // Show loader while loading
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-10 pb-32">
        <h1 className="text-xl md:text-2xl text-[#091057] font-bold mb-4">
          Welcome
        </h1>

        <div className="overview flex flex-col items-center mt-15">
          <h3 className="text-xl md:text-2xl text-gray-600 font-semibold my-10">
            Overview
          </h3>

          <div className="cards flex flex-col lg:flex-row items-center gap-10">
            <Card
              title="Total Spaces"
              icon={<FaFolderOpen className="text-3xl text-[#091057]" />}
              count={spaces.length}
            />
            <Card
              title="Total Videos"
              icon={<FaVideo className="text-3xl text-[#091057]" />}
              count={videosCount}
            />
            <Card
              title="Testimonials"
              icon={<FaFileAlt className="text-3xl text-[#091057]" />}
              count={testimonialsCount}
            />
          </div>
        </div>

        <div className="overview flex flex-col items-center mt-15">
          <h3 className="text-xl md:text-2xl text-gray-600 font-semibold my-10">
            Your spaces
          </h3>

          {spaces.length === 0 ? (
            <NoSpaces router={router} />
          ) : (
            <SpacesList spaces={spaces} router={router} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

const Card = ({ title, icon, count }) => (
  <div className="bg-white shadow-md rounded-lg flex flex-col justify-between gap-6 p-10 md:p-12">
    <div className="flex justify-between items-center gap-12">
      <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
      {icon}
    </div>
    <div className="text-4xl font-bold text-gray-800">{count}</div>
  </div>
);

const NoSpaces = ({ router }) => (
  <div className="flex flex-col justify-start items-center md:my-0">
    <FaFolderPlus className="text-3xl text-[#091057] mb-4" />
    <h2 className="text-m md:text-xl text-[#091057] font-bold">
      No Spaces yet
    </h2>
    <h3 className="text-sm md:text-m text-gray-600 font-semibold my-4">
      Create your first space to start collecting testimonials
    </h3>
    <button
      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
      onClick={() => router.push("/CreateSpace")}
    >
      + Create a new Space
    </button>
  </div>
);


const SpacesList = ({ spaces, router }) => (
  <div className="flex flex-col items-center">
    <div className="cards flex flex-col lg:flex-row lg:flex-wrap lg:justify-around items-center gap-10">
      {spaces.map((space, index) => (
        <div
          key={space.id}  
          className="bg-white min-w-80 min-h-40 shadow-md rounded-lg flex flex-col justify-between gap-6 p-10 md:p-12 cursor-pointer"
          onClick={() => router.push(`/Home/${space.id}`)}
        >
          <div className="flex justify-between items-center gap-12">
            <h3 className="text-xl font-semibold text-gray-700">
              {space.name}
            </h3>
            <BsThreeDots className="text-3xl text-[#091057]" />
          </div>
        </div>
      ))}
    </div>

    <button
      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500 my-10"
      onClick={() => router.push("/CreateSpace")}
    >
      + Create a new Space
    </button>
  </div>
);

export default Home;
