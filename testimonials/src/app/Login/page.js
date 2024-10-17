// src/app/Login/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth } from "../../lib/firebase"; // Adjust path if needed
import Navbar from "../components/Navbar/Navbar";

const Login = () => {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Handle loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard"); // Redirect to dashboard if already logged in
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/Home");
    } catch (err) {
      setError("Google login failed. Please try again.");
      console.error(err);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // Login with Email/Password
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Signup with Email/Password
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/Home");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }
  console.log(error);

  return (
    <>
    <Navbar />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">{isLogin ? "Login" : "Signup"}</h1>
        
        {error && <div className="text-red-500">Invalid Credentials</div>}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <hr></hr>
        <span className="text-gray-400 text-sm">
            Or Sign In with google            
        </span>        

        <button
          onClick={handleGoogleLogin}
          className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-400"
        >
          Sign in with Google
        </button>

        <div className="text-center">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 cursor-pointer"
            >
              {isLogin ? "Sign up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
