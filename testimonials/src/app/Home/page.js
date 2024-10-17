// pages/dashboard.js
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Navbar from "../components/Navbar/Navbar";

const Home = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else router.push("/Login"); // Redirect if not logged in
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/Login");
  };

  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.displayName}</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-500"
      >
        Logout
      </button>
    </div>
    </>
  );
};

export default Home;
