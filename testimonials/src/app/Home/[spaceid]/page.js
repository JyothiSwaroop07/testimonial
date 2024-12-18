"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { auth } from "../../../lib/firebase";
import TestimonialCard from "@/app/components/TestimonialCard/TestimonialCard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import Sample from "@/app/components/Sample/Sample";
import { BsCollection } from "react-icons/bs";

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
  const [singleTestimonialPopup, setSingleTestimonialPopup] = useState(false);
  const [singleTestimonialEmbedPopup, setSingleTestimonialEmbedPopup] = useState(false)

  const [selectedTestimonialId, setSelectedTestimonialId] = useState('');

  const [copied, setCopied] = useState(false);

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

  const handleDeleteTestimonial = async (testimonialId) => {
    try {
      await deleteDoc(doc(db, "testimonials", testimonialId)); // Delete the document from Firestore
      toast.success("Testimonial deleted successfully!");
      
      // Refresh the testimonials list after deletion
      fetchSpaceTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial.");
    }
  };

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

  const handletestimonialSelect = (testimonial) => {
    console.log(testimonial.id)
    setSelectedTestimonialId(testimonial.id);
    setSingleTestimonialPopup(false);
    setSingleTestimonialEmbedPopup(true);
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

    const embedCode = `
        <div style="position: relative; width: 100%; height: 550px; padding-bottom: 56.25%; overflow: hidden; margin-top:64px; margin-bottom: 64px;">
          <iframe src="https://embed-testimonials.vercel.app/${layoutType}/${spaceid}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
                  title="Testimonials"
                  loading="lazy"
                  allowfullscreen>
          </iframe>
        </div>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

    return(
      <div className="fixed top-0 right-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30">
      
      <div className="bg-white rounded-lg w-[70%] p-12 flex flex-col justify-center items-center">
          

        <h1 className="text-gray-800 text-2xl font-bold mb-5">Code to embed</h1>
        <h2 className="text-gray-800 text-2xl font-normal mb-5">Embed this code to dunamically update your testimonials in your site by selecting and unselecting the testimonials here</h2>
        <div className="relative bg-black text-white w-full py-4 px-2 rounded-md overflow-x-auto">
          <pre className="whitespace-pre overflow-x-scroll">{embedCode}</pre>

          {/* Copy Button */}
          <button 
            onClick={copyToClipboard}
            className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

      ``
        <button className="bg-gray-900 p-2 rounded-lg text-white w-[120px] h-[40px] mt-6 " onClick={()=>setEmbedPopupVisible(false)}>
          Close
        </button>
      </div>
    </div>
    )
  }
  
  const SingleTestimonialPopup = () => {
    return (
    <div className="fixed top-0 right-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30">
      
      <div className="bg-white rounded-lg p-4 flex flex-col justify-center items-center">
          

        <h1 className="text-gray-800 text-2xl font-sembold mb-5">Embed your Wall of Love</h1>
        <h3 className="text-gray-700 text-xl font-sembold mb-3">Choose a testimonial</h3>

        <div className=" mx-auto overflow-x-hidden overflow-y-auto">
        {testimonials.map((testimonial, index) => (
          <div className="card bg-gray-100 my-2 rounded-lg p-2 hover:scale-105 hover:rounded-lg cursor-pointer" onClick={()=>handletestimonialSelect(testimonial)} key={index}>
            <h2 className="text-xs text-gray-800 mb-2">{testimonial.name}</h2>

            <h3 className="text-xs text-gray-800 truncate italic font-semibold mb-2 mt-2">{testimonial.text.slice(0,45)}.....</h3>

            <h2 className="text-xs text-gray-800 mb-1 mt-1">{testimonial.email}</h2>
          </div>
        ))}
        </div>

        <div className="layouts flex flex-row gap-3">

          

        </div>

        <button className="bg-gray-900 p-2 rounded-lg text-white w-[120px] h-[40px] mt-6 " onClick={()=>setSingleTestimonialPopup(false)}>
          Close
        </button>
      </div>
    </div>
    )
  }

  const SingleTestimonialEmbedPopup = () => {

      const embedCode = `<div style="position: relative; width: 100%; height: 550px; padding-bottom: 56.25%; overflow: hidden; margin-top:64px; margin-bottom: 64px;">
          <iframe src="https://embed-testimonials.vercel.app/SingleTestimonial/${selectedTestimonialId}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;" 
                  title="Testimonials"
                  loading="lazy"
                  allowfullscreen>
          </iframe>
        </div>`;

      const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
      };

      return (
        <div className="fixed top-0 right-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-30">
      
      <div className="bg-white rounded-lg w-[70%] p-12 flex flex-col justify-center items-center">
          

        <h1 className="text-gray-800 text-2xl font-bold mb-5">Code to embed</h1>
        <h2 className="text-gray-800 text-2xl font-normal mb-5">Embed this code to dynamically update your testimonial in your site by selecting and unselecting the testimonials here</h2>
        <div className="relative bg-black text-white w-full py-4 px-2 rounded-md overflow-x-auto">
          <pre className="whitespace-pre overflow-x-scroll">{embedCode}</pre>

          {/* Copy Button */}
          <button 
            onClick={copyToClipboard}
            className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

      ``
        <button className="bg-gray-900 p-2 rounded-lg text-white w-[120px] h-[40px] mt-6 " onClick={()=>setSingleTestimonialEmbedPopup(false)}>
          Close
        </button>
      </div>
    </div>
      )
  }

  const NoTestimonials = ({ router }) => (
    <div className="flex flex-col justify-start items-center mt-32 mx-auto w-[80vw]">
      <BsCollection className="text-3xl text-[#091057] mb-4" />
      <h2 className="text-m md:text-xl text-[#091057] font-bold">
        No Testimonials yet
      </h2>
      <h3 className="text-sm md:text-m text-gray-600 font-semibold my-4">
        copy the link of this space and share with people to collect testimonials
      </h3>
      <button
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
        onClick={copylink}
      >
        Copy the form link
      </button>
    </div>
  );

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


      {singleTestimonialEmbedPopup==true ? (<SingleTestimonialEmbedPopup/>) : singleTestimonialPopup==true ? (<SingleTestimonialPopup/>) : null}

       <div> 
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
                  onClick={() => setSingleTestimonialPopup(true)}
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

        {filteredTestimonials.length==0 && <NoTestimonials/>}

        {filteredTestimonials.map((testimonial) => (
              <TestimonialCard testimonial={testimonial} key={testimonial.id} fetchUpdatedTestimonial={handleFetchUpdatedTestimonial} handleDeleteTestimonial={handleDeleteTestimonial} />
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
              <option value="SingleTestimonial" className="hover:bg-gray-800 hover:text-white" onClick={()=>setSingleTestimonialPopup(true)}>Single Testimonial</option>
              <option value="CollectingWidget" className="hover:bg-gray-800 hover:text-white">Collecting Widget</option>
            </select>
          </div>
          
          <button className="text-center  h-[40px] bg-gray-900 rounded-lg self-center text-[white] m-2 p-2 hover:scale-105" onClick={copylink}>Copy Testimonial Form Link to Clipboard</button>
          
          {filteredTestimonials.length==0 && <NoTestimonials/>}
          
          <div className="p-4">
            {filteredTestimonials.map((testimonial) => (
              <TestimonialCard testimonial={testimonial} key={testimonial.id} handleDeleteTestimonial={handleDeleteTestimonial}/>
            ))
          }
          </div>
        </div>
      </div>
      </div>

      
      
    </div>
  );
};

export default SpaceDetails;
