import React from "react";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase"
import { getDoc } from "firebase/firestore";

const TestimonialCard = ({ testimonial, fetchUpdatedTestimonial }) => {

  
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

    return (
      <div className="border p-6 mb-4 rounded-lg shadow-md bg-gray-200 cursor-pointer hover:shadow-lg transition-shadow md:w-1/2 lg:w-1/3  h-[250px] mx-2">
        <div className="top flex justify-between">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {testimonial.name}
            </h2>
            <button 
            className="text-red-500 text-2xl focus:outline-none" 
            onClick={toggleLike}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">{testimonial.createdAt}</p>
      </div>
    );
  };
  
  export default TestimonialCard;
  