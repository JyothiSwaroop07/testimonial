import React, { useState } from "react";

import { CiVideoOn } from "react-icons/ci";
import { FaPen } from "react-icons/fa";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../../lib/firebase"; // Consolidate firebase imports
import { doc, getDoc, collection, getDocs, query, where, setDoc } from "firebase/firestore";
import { useAuth } from "../../../lib/useAuth";

import { useEffect } from "react";

const TestimonialForm = ({ space, spaceid }) => {
    console.log(spaceid)

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [text, setText] = useState("");
    const [video, setVideo] = useState(""); 
    const [rating, setRating] = useState(0);


    


    const handleSubmit = async() => {
      const testimonialId = crypto.randomUUID();
      
      try{
        const testimonialRef = doc(collection(db, "testimonials"));
        await setDoc(testimonialRef, {
          uid: testimonialId,
          spaceId: spaceid,
          name,
          email,
          address,
          text,
          video,
          rating,
          createdAt: new Date().toISOString(),
        });
        console.log("Testimonial added");
        
      } catch(error){
        console.log("error submitting testimonial", error)
      }
    }
    

  return (
    <div className="p-10 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">{space.header}</h1>

      <p className="text-gray-600 mb-8 text-m">{space.message}</p>

      <h2 className="text-m font-semibold text-left text-gray-700 self-start mb-4">
        Questions:
      </h2>
      <ol className="list-decimal pl-6 text-m text-gray-800 font-normal">
        {space.questions.map((q) => (
          <li key={q.id} className="mb-1">
            {q.question}
          </li>
        ))}
      </ol>

        <div className="lg:flex mt-12">
      <button type="button" className='flex flex-row justify-center w-[70vw] h-[40px] bg-blue-600 text-[white] m-2 lg:w-[30vw] ' >
            <h1 className='text-center m-auto flex flex-row '><CiVideoOn size={20} style={{margin: '2px' }} className="font-bold" />  Record a Video</h1>
      </button>
      <button type="button" className='flex flex-row justify-center w-[70vw] h-[40px] bg-[grey] text-[white] m-2 lg:w-[30vw]' >
            <h1 className='text-center m-auto flex flex-row '><FaPen size={20} style={{margin: '2px' }} />  Give the text</h1>
        </button>
        </div>

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

      <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500 my-10" onClick={handleSubmit}>
        Send The Testimonial
      </button>

    </div>
  );
};

export default TestimonialForm;
