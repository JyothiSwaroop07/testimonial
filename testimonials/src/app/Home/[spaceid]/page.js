"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { auth } from "../../../lib/firebase";
import TestimonialCard from "@/app/components/TestimonialCard/TestimonialCard";

const SpaceDetails = ({ params }) => {
  const { spaceid } = params; 
  
  const router = useRouter();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const [testimonials, setTestimonials] = useState([]);
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [textTestimonials, setTextTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);

  const fetchSpaceTestimonials = async() => {
    
      try{
        const testimonialRef = collection(db, "testimonials");
        const q = query(testimonialRef, where('spaceId', '==', spaceid));
        const querySnapshot = await getDocs(q);

        const fetchedTestimonials = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const video = fetchedTestimonials.filter((t) => t.video!=="" && t.text==="");
        const text = fetchedTestimonials.filter((t) => t.video==="" && t.text!=="");

        console.log(video, "vi");
        console.log(text, "tx");

        setVideoTestimonials(video);
        setTextTestimonials(text);
        setTestimonials(fetchedTestimonials);
        setFilteredTestimonials(fetchedTestimonials);
        
        setLoading(false);
      }
      catch(error) {
        console.log("fetch testimonial error", error);
        setLoading(false);
      }
  }

  const fetchSpaceDetails = async (spaceid) => {
    console.log(spaceid);
    try {
      const spaceRef = doc(db, "spaces", spaceid); 
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
        fetchSpaceDetails(spaceid);
        if(spaceid){
          fetchSpaceTestimonials();
        }
      } else {
        console.log("No user authenticated, redirecting to login...");
        router.push("/"); 
      }
    };
    getUserIdAndFetchSpace();
  }, [spaceid]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-gray-900"></div>
      </div>
    );
  }

  if (!space) return <p>Space not found!</p>;

  const tabs = ["All", "Video", "Text", "Liked"];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if(tab==="All") {
      setFilteredTestimonials(testimonials);
    }else if(tab=="Video") {
      console.log("in video")
      setFilteredTestimonials(videoTestimonials);
    }
    else if(tab==="Text") {
      setFilteredTestimonials(textTestimonials);
    }
  }

  

  return (
    <div className="">
      <nav className="bg-gray-900 p-4">
        <div>
          <h1 className="text-left font-bold text-white text-2xl">{space.name}</h1>
          <h3 className="font-semibold text-[#b4b4b4] text-sm">Space Url: 
            <span className="text-gray text-xs underline cursor-pointer">  https://testimonialhub.vercel.app/Home/{spaceid}</span>
          </h3>
        </div>
      </nav>
      <hr className="text-white"></hr>
      <div className="hidden md:flex">
        <div className=" md:flex flex-col w-1/6 bg-gray-900 h-screen py-4 px-1 space-y-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 rounded text-left  ${
                activeTab === tab ? "bg-gray-200 font-bold text-gray-800" : "text-white"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 flex flex-1 flex-row">
        {filteredTestimonials.map((testimonial) => (
              <TestimonialCard testimonial={testimonial} key={testimonial.id} />
            ))
          }
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
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="p-4">
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard testimonial={testimonial} key={testimonial.id} />
            ))
          }
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetails;
