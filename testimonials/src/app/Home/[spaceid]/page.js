"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { auth } from "../../../lib/firebase";
import TestimonialCard from "@/app/components/TestimonialCard/TestimonialCard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import Sample from "@/app/components/Sample/Sample";

import mansoryfixed from './mansoryfixed.png';
import carousels from './carousels.png';

import Image from "next/image";


const SpaceDetails = ({ params }) => {
  const { spaceid } = params; 
  const spaceLink = `https://testimonialhub.vercel.app/${spaceid}/FillDetails`
  
  const router = useRouter();
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [activeEmbedTab, setActiveEmbedTab] = useState('');

  const [testimonials, setTestimonials] = useState([]);
  const [videoTestimonials, setVideoTestimonials] = useState([]);
  const [textTestimonials, setTextTestimonials] = useState([]);
  const [likedTestimonials, setLikedTesimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [embedDropDown, setEmbedDropDown] = useState(false);

  const [galleryPopupVisible, setGalleryPopupVisible] = useState(false);
  const [embedPopupVisible, setEmbedPopupVisible] = useState(false);

  const [layoutType, setLayoutType] = useState('');
  
  const notify = () => toast("Link Copied to clipboard");
  const notifyLike = () => toast("Testimonial added to Gallery");
  const notifyDislike = () => toast("Testimonial Removed to Gallery");

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
        const liked = fetchedTestimonials.filter((t) => t.isLiked===true);

        console.log(video, "vi");
        console.log(text, "tx");

        setVideoTestimonials(video);
        setTextTestimonials(text);
        setTestimonials(fetchedTestimonials);
        setLikedTesimonials(liked);
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
      <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-gray-900"></div>
      </div>
      </>
    );
  }

  if (!space) return <p>Space not found!</p>;


  const handleFetchUpdatedTestimonial = async (updatedTestimonial) => {
    updatedTestimonial.isLiked ? notifyLike() : notifyDislike();
  
    try {
      setLoading(true);
      await fetchSpaceTestimonials();
      setActiveTab("All");
    } finally {
      setLoading(false);
    }
  };

  const tabs = ["All", "Video", "Text", "Liked"];
  
  const handleEmbedTabChange = (tab) => {
    if(tab=="Gallery"){
      setGalleryPopupVisible(!galleryPopupVisible);
      console.log("gallery clicked")
    }
  }

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
    else if(tab=="Liked") {
      setFilteredTestimonials(likedTestimonials);
    }
    
  }

  const copylink = (e) => {
    navigator.clipboard.writeText(spaceLink)
    console.log("copied");
    // toast.success('Link copied to clipboard!', {
    //   position: "top-right",
    //   autoClose: 3000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   theme: "colored",
    // });
    notify();
}

  const handleLayoutSelect = (type) => {
    setGalleryPopupVisible(false);
    if(type==1){
      setLayoutType('mansoryfixed');
    }
    else if(type==2){
      setLayoutType('carousels');
    }
    setEmbedPopupVisible(true);

  }

  const GalleryPopup = () => {
    return (
    <div className="fixed top-0 right-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30">
      
      <div className="bg-white rounded-lg p-12 flex flex-col justify-center items-center">
          

        <h1 className="text-gray-800 text-2xl font-sembold mb-5">Embed your Wall of Love</h1>
        <h3 className="text-gray-700 text-xl font-sembold mb-3">Choose a Layout</h3>

        <div className="layouts flex flex-row gap-3">

          <div className="border-2 border-gray-700 flex flex-col p-2 justify-between items-center rounded-lg cursor-pointer hover:scale-105" onClick={()=>handleLayoutSelect(1)}>
            <Image src={mansoryfixed} width={200} height={200} alt="layout1"/>
            <h3 className="text-gray-700 text-lg font-sembold mb-3 justify-self-end">Mansory - Fixed</h3>
          </div>

          <div className="border-2 border-gray-700 flex flex-col p-2 justify-between items-center rounded-lg cursor-pointer hover:scale-105" onClick={()=>handleLayoutSelect(2)}>
            <Image src={carousels} width={200} height={200} alt="layout2"/>
            <h3 className="text-gray-700 text-lg font-sembold mb-3 justify-self-end">Carousels</h3>
          </div>

        </div>

        <button className="bg-gray-900 p-2 rounded-lg text-white w-[120px] h-[40px] mt-6 " onClick={()=>setGalleryPopupVisible(false)}>
          Close
        </button>
      </div>
    </div>
    )
  }

  const EmbedPopup = () => {
    return(
      <div className="fixed top-0 right-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30">
      
      <div className="bg-white rounded-lg p-12 flex flex-col justify-center items-center">
          

        <h1 className="text-gray-800 text-2xl font-sembold mb-5">Code to embed</h1>
        <h3 className="text-gray-700 text-xl font-sembold mb-3">{layoutType}</h3>

      
        <button className="bg-gray-900 p-2 rounded-lg text-white w-[120px] h-[40px] mt-6 " onClick={()=>setEmbedPopupVisible(false)}>
          Close
        </button>
      </div>
    </div>
    )
  }

  return (
    <div className="">
      <nav className="bg-gray-900 p-4 fixed w-[100vw] z-10">
        <div>
          <h1 className="text-left font-bold text-white text-2xl">{space.name}</h1>
          <h3 className="font-semibold text-[#b4b4b4] text-sm">Space Url: 
            <span className="text-gray text-xs underline cursor-pointer">  https://testimonialhub.vercel.app/Home/{spaceid}</span>
          </h3>
        </div>
      </nav>
      <hr className="text-white"></hr>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          
          draggable
          pauseOnHover
          theme="light"
          
          />

            {embedPopupVisible==true ? (<EmbedPopup/>) : galleryPopupVisible==true ? (<GalleryPopup/>) : null} 
      <div className="hidden md:flex mt-[85px]">
        
        <div className=" md:flex flex-col w-1/6 bg-gray-900 py-4 px-1 space-y-4 fixed h-[100vh]">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 rounded text-left  ${
                activeTab === tab ? "bg-gray-200 font-bold text-gray-800" : "text-white hover:bg-gray-700"
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}

          <button className="py-2 px-4 rounded text-left text-gray-100 font-bold mt-24 flex flex-row justify-between" onClick={() => setEmbedDropDown((prev)=>!prev)}>
              <h3 className="">
              Embed Testimonials 
              </h3>
              <>
              {embedDropDown ? <MdKeyboardArrowDown className="text-xl"/> : <MdOutlineKeyboardArrowRight className="text-xl"/>}
              </>
          </button> 

          {embedDropDown && (
              <div className="flex flex-col ml-3 gap-4">
                {/* Gallery Button */}
                <button
                  className={`py-2 px-4 rounded text-left hover:bg-gray-700 ${
                    activeEmbedTab === "Gallery" ? "text-white" : "text-white"
                  }`}
                  onClick={() => setGalleryPopupVisible(true)}
                >
                  Gallery
                </button>

                {/* Single Testimonial Button */}
                <button
                  className={`py-2 px-4 rounded text-left hover:bg-gray-700 ${
                    activeEmbedTab === "SingleTestimonial" ? "" : "text-white"
                  }`}
                  onClick={() => handleEmbedTabChange("SingleTestimonial")}
                >
                  Single Testimonial
                </button>

                {/* Collecting Widget Button */}
                <button
                  className={`py-2 px-4 rounded text-left hover:bg-gray-700 ${
                    activeEmbedTab === "CollectingWidget" ? "" : "text-white"
                  }`}
                  onClick={() => handleEmbedTabChange("CollectingWidget")}
                >
                  Collecting Widget
                </button>
              </div>
            )}
        </div>
        
        <div className="flex-1 ml-[16.666667%]">
            <div className="flex justify-end">
            <button className="text-center  h-[40px] bg-gray-900 rounded-lg text-[white] m-4 p-2 hover:scale-105" onClick={copylink}>Copy Testimonial Form Link to Clipboard</button>
            </div>
        <div className="p-4 flex-1">

        {filteredTestimonials.map((testimonial) => (
              <TestimonialCard testimonial={testimonial} key={testimonial.id} fetchUpdatedTestimonial={handleFetchUpdatedTestimonial} />
            ))
          }
        </div>
        {/* <div className="flex flex-row justify-center">
        <Sample testimonials={likedTestimonials} />
        </div> */}
      </div>
      </div>

      <div className="md:hidden mt-[85px]">
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
          <div className="relative w-full px-4 my-2">
            <select
              className="w-full p-2 border rounded-lg text-gray-800 bg-white shadow-sm"
              value={activeEmbedTab}
              onChange={(e) => handleEmbedTabChange(e.target.value)}
            >
              <option value="" disabled>
                Select embed Widget
              </option>
              <option value="Gallery" className="hover:bg-gray-800 hover:text-white" onClick={()=>setGalleryPopupVisible(true)}>Gallery</option>
              <option value="SingleTestimonial" className="hover:bg-gray-800 hover:text-white">Single Testimonial</option>
              <option value="CollectingWidget" className="hover:bg-gray-800 hover:text-white">Collecting Widget</option>
            </select>
          </div>
          
          <button className="text-center  h-[40px] bg-gray-900 rounded-lg self-center text-[white] m-2 p-2 hover:scale-105" onClick={copylink}>Copy Testimonial Form Link to Clipboard</button>
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
