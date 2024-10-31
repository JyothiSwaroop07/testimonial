"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import TestimonialForm from "@/app/components/TestimonialForm/TestimonialForm";

const FillDetails = ({params}) => {
  const [space, setSpace] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const router = useRouter();
  

  const spaceId = params.spaceid; 

  const fetchSpaceDetails = async (spaceId) => {
    // setLoading(true);
    console.log("Fetching space:", spaceId);
    try {
      const spaceRef = doc(db, "spaces", spaceId); 
      const spaceSnap = await getDoc(spaceRef);

      if (spaceSnap.exists()) {
        setSpace(spaceSnap.data()); 
      } else {
        console.log("Space not found!");
        router.push("/"); 
      }
    } catch (error) {
      console.error("Error fetching space details:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    console.log(spaceId)
    if (spaceId) {
      fetchSpaceDetails(spaceId); 
    }
  }); 

  console.log(space);

  if (loading) {
    
  }

  if(!space) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-gray-900"></div>
    </div>
  );
  

  else return (
    <div className="p-10 flex flex-col justify-center items-center">
      <TestimonialForm space={space} key={spaceId} spaceid={spaceId}/>
      
    </div>
  );
};

  

export default FillDetails;
