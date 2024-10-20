import React from "react";

const TestimonialCard = ({ testimonial }) => {
    return (
      <div className="border p-6 mb-4 rounded-lg shadow-md bg-gray-200 cursor-pointer hover:shadow-lg transition-shadow md:w-1/2 lg:w-1/3  h-[250px] mx-2">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {testimonial.name}
        </h2>
        <p className="text-gray-600 mb-4">{testimonial.createdAt}</p>
      </div>
    );
  };
  
  export default TestimonialCard;
  