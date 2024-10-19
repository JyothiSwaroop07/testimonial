"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { auth } from "../../../lib/firebase";

const SpaceDetails = ({ params }) => {
  const { spacename } = params; 
  console.log(spacename);
  const router = useRouter();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const fetchSpaceDetails = async (spacename) => {
    console.log(spacename);
    try {
      const spaceRef = doc(db, "spaces", spacename); 
      const spaceSnap = await getDoc(spaceRef);

      if (spaceSnap.exists()) {
        setSpace(spaceSnap.data());
      } else {
        console.log("Space not found!");
      }
    } catch (error) {
      console.error("Error fetching space details:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    const getUserIdAndFetchSpace = () => {
      const user = auth.currentUser; 

      if (user) {
        fetchSpaceDetails(spacename);
      } else {
        console.log("No user authenticated, redirecting to login...");
        router.push("/"); 
      }
    };
    getUserIdAndFetchSpace();
  }, [spacename]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-gray-900"></div>
      </div>
    );
  }

  if (!space) return <p>Space not found!</p>;

  const tabs = ["All", "Video", "Text", "Liked"];

  return (
    <div className="">
      <nav className="bg-gray-900 p-4">
        <div>
          <h1 className="text-left font-bold text-white text-2xl">{space.name}</h1>
          <h3 className="font-semibold text-[#b4b4b4] text-sm">Space Url: 
            <span className="text-gray text-xs underline cursor-pointer">  https://testimonialhub.vercel.app/Home/{spacename}</span>
          </h3>
        </div>
      </nav>

      <div className="hidden md:flex">
        <div className=" md:flex flex-col w-1/4 bg-gray-200 h-screen p-4 space-y-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`p-2 rounded text-left ${
                activeTab === tab ? "bg-gray-400 font-bold" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="md:flex-1 p-4">
          <h2 className="text-2xl font-bold">{activeTab}</h2>
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex flex-col md:hidden">
          <div className="flex flex-wrap justify-around p-4 space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`p-2 border-b-2 ${
                  activeTab === tab
                    ? "border-gray-900 font-bold"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="p-4">
            <h2 className="text-2xl font-bold">{activeTab}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetails;
