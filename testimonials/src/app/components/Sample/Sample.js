import React from "react";

const Sample = ({ testimonials }) => {
  return (
    <div className="carousel bg-white w-[50vw] rounded-lg">
      {testimonials.map((t, index) => (
        <div key={index} className="testimonial">
          <video controls>
            <source src={t.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p>{t.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Sample;
