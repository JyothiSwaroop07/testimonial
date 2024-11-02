import React, { useState } from "react";
import { CiVideoOn } from "react-icons/ci";
import { FaPen, FaStar } from "react-icons/fa";
import { doc, collection, setDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import axios from 'axios';
import { useEffect } from "react";
import VideoRecorder from "../VideoRecorder/VideoRecorder";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestimonialForm = ({ space, spaceid }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [text, setText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [rating, setRating] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility state
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false); // Video popup state

  const notify = () => toast("Testimonial Sent... You can close this window...");

  
  const handleSubmit = async () => {
    const testimonialId = crypto.randomUUID();
    try {
      const testimonialRef = doc(collection(db, "testimonials"));
      await setDoc(testimonialRef, {
        uid: testimonialId,
        spaceId: spaceid,
        name,
        email,
        address,
        isLiked: false,
        text,
        video: videoUrl,
        rating,
        createdAt: new Date().toISOString(),
      });
      console.log("Testimonial added");
      setName('');
      setEmail('');
      setAddress('');
      setText('');

      notify();
    } catch (error) {
      console.log("Error submitting testimonial", error);
    }
  };

  useEffect(() => {
  if (videoUrl) {
    console.log("Updated Video URL:", videoUrl);
  }
}, [videoUrl]);

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default"); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dchbfnlct/video/upload`,
        formData
      );
      const url = response.data.secure_url;
      setVideoUrl(url);
      console.log("Video uploaded successfully:", url);
    } catch (error) {
      console.error("Video upload failed:", error);
    }
  };

  const togglePopup = () => setIsPopupOpen(!isPopupOpen); // Toggle popup
  const toggleVideoPopup = () => setIsVideoPopupOpen(!isVideoPopupOpen);
  const handleRating = (index) => setRating(index + 1); // Set rating based on star clicked

  return (
    <div className="p-10 flex flex-col justify-center items-center">
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
      <h1 className="text-2xl font-bold mb-4">{space.header}</h1>
      <p className="text-gray-600 mb-8 text-m">{space.message}</p>

      <h2 className="text-m font-semibold text-left text-gray-700 self-start mb-4">
        Questions:
      </h2>
      <ol className="list-decimal pl-6 text-m text-gray-800 font-normal">
        {space.questions.map((q) => (
          <li key={q.id} className="mb-1">{q.question}</li>
        ))}
      </ol>

      <div className="lg:flex mt-12">
        <button
          type="button"
          className="flex flex-row justify-center w-[70vw] h-[40px] bg-blue-600 text-white m-2 lg:w-[30vw]"
          onClick={toggleVideoPopup}
        >
          <h1 className="text-center m-auto flex flex-row">
            <CiVideoOn size={20} style={{ margin: '2px' }} /> Record a Video
          </h1>
        </button>

        <button
          type="button"
          className="flex flex-row justify-center w-[70vw] h-[40px] bg-gray-500 text-white m-2 lg:w-[30vw]"
          onClick={togglePopup} // Open the popup
        >
          <h1 className="text-center m-auto flex flex-row">
            <FaPen size={20} style={{ margin: '2px' }} /> Give the Text
          </h1>
        </button>
      </div>

      {isVideoPopupOpen && (
        <div className="fixed overflow-y-auto inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[80vw] lg:w-[40vw] max-h-[80vh] overflow-y-auto">
            <VideoRecorder handleVideoUpload={handleVideoUpload} />
            <h2 className="text-sm font-normal text-gray-800 mb-1">You can also upload a recorded video here</h2>
            <input
              type="file"
              accept="video/*"
              className="mb-4"
              onChange={handleVideoUpload}
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                onClick={toggleVideoPopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[80vw] lg:w-[40vw]">
            <h2 className="text-xl text-gray-800 font-bold mb-1">Write Text Testimonial to</h2>
            <h3 className="text-lf text-gray-900 font-semibold mb-7">{space.header}</h3>

            <div className="flex mb-2">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  size={30}
                  className={`cursor-pointer ${
                    index < rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => handleRating(index)}
                />
              ))}
            </div>
            <h2 className="text-m font-semibold  text-gray-700 mb-6">
                  Rate Us here
                </h2>

            <div className="flex flex-col mb-4">
                <h2 className="text-m font-semibold  text-gray-700 mb-4">
                  Questions:
                </h2>
                <ol className="list-decimal pl-6 text-m text-gray-800 font-normal">
                  {space.questions.map((q) => (
                    <li key={q.id} className="mb-1">{q.question}</li>
                  ))}
                </ol>
            </div>

            <textarea
              className="w-full h-[200px] p-2 border border-gray-900 rounded mb-4"
              placeholder="Give your Answer..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                onClick={togglePopup} // Close popup
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => {
                  
                  togglePopup(); // Submit and close popup
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {space.nameReq && (
        <div className="mb-4 w-full mt-12">
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-b border-gray-600 p-2 w-full md:w-1/2 lg:w-1/3 focus:outline-none"
            required
          />
        </div>
      )}

      {space.emailReq && (
        <div className="mb-4 w-full mt-6">
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-gray-600 p-2 w-full md:w-1/2 lg:w-1/3 focus:outline-none"
            required
          />
        </div>
      )}

      {space.addressReq && (
        <div className="mb-4 w-full mt-6">
          <label className="block text-gray-700 font-semibold mb-1" htmlFor="address">
            Address:
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border-b border-gray-600 p-2 w-full md:w-1/2 lg:w-1/3 focus:outline-none"
            required
          />
        </div>
      )}

      <button
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500 my-10"
        onClick={handleSubmit}
      >
        Send The Testimonial
      </button>
    </div>
  );
};

export default TestimonialForm;
