import React from "react";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase"
import { getDoc } from "firebase/firestore";
import Image from "next/image";
import texticon from './texticon.jpg';
import videoicon from './videoicon.jpg'; 
import { MdDeleteForever } from "react-icons/md";


const TestimonialCard = ({ testimonial, fetchUpdatedTestimonial, handleDeleteTestimonial }) => {

  
  const [isLiked, setIsLiked] = useState(testimonial.isLiked);

  const toggleLike = async() => {
    console.log("in liked");
    const newLikeStatus = !isLiked;
    setIsLiked(newLikeStatus);

    try{
      const testimonialRef = doc(db, "testimonials", testimonial.id);
      await updateDoc(testimonialRef, {isLiked: newLikeStatus});

      const updatedSnap = await getDoc(testimonialRef);
      if(updatedSnap.exists()) {
        fetchUpdatedTestimonial(updatedSnap.data());
      }
    }catch(err){
      console.log("error updating", err);
    }
    
  }

  const deleteTestimonial = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm("Are you sure you want to delete this testimonial?");
    
    // If the user confirms, proceed with the deletion
    if (confirmed) {
      handleDeleteTestimonial(testimonial.id);
  
      try {
        const testimonialRef = doc(db, "testimonials", testimonial.id);
  
        // Optionally, update testimonial fields if needed
        await updateDoc(testimonialRef, { isLiked: newLikeStatus });
  
        const updatedSnap = await getDoc(testimonialRef);
        if (updatedSnap.exists()) {
          fetchUpdatedTestimonial(updatedSnap.data());
        }
      } catch (err) {
        console.log("Error updating:", err);
      }
    }
  };
  
    return (
      <div className="border flex flex-col justify-between p-6 mb-4 rounded-lg shadow-md bg-gray-100 cursor-pointer hover:shadow-lg transition-shadow md:w-1/2 lg:w-3/4  h-[250px] mx-2">
        <div className="top flex justify-between">
            <div className="text-xl font-semibold text-gray-800 mb-2 flex">
              {
                testimonial.text!=="" && 
                <div className="rounded-xl bg-white flex justify-center border-2 border-blue-500 w-[50px] h-[20px] mr-2">
                  <p className="text-gray=900 text-[12px] self-center">Text</p>
                  <FaHeart className="relative text-xs text-red-500 top-0 right-0" />
                </div>
              }
              {
                testimonial.video!=="" && 
                <div className="rounded-xl bg-white flex justify-center border-2 border-blue-500 w-[55px] h-[20px]">
                  <p className="text-gray=900 text-[12px] self-center">Video</p>
                  <FaHeart className="relative text-xs text-red-500 top-0 right-0" />
                </div>
              }
            </div>
            <button 
            className="text-red-500 text-2xl focus:outline-none" 
            onClick={toggleLike}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
            
        <div className="flex overflow-hidden max-w-4xl max-h-xs">
            <p className="text-gray-800 font-semibold text-sm mb-4 ">{testimonial.text}</p>
        </div>
        
        
        <p className="text-normal text-sm mb-4 text-gray-700">{testimonial.name}</p>
        <p className="text-gray-600 text-sm mb-4 ">{testimonial.createdAt}</p>

        <button className="ml-auto text-2xl" onClick={deleteTestimonial}>
          <MdDeleteForever/>
        </button>
      </div>
    );
  };
  
  export default TestimonialCard;
  