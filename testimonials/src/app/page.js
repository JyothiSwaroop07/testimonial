// src/app/page.js
import { redirect } from "next/navigation";
import Navbar from "./components/Navbar/Navbar";

export default function RootPage() {
  return (
    <div>
      <Navbar/>
    </div>
  )
}