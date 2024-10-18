import React from "react";
import Image from "next/image";

import logo from '../../../app/favicon.ico'

const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-wrap justify-between gap-4">
            {/* Brand Section */}
            <div className="w-full md:w-1/3">
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-xl">
                    <Image src={logo} width={100} height={100} alt="logo" />
                </div>
                <h2 className="text-2xl font-semibold">Testimonial</h2>
              </div>
              <p className="text-gray-400">
                The easiest solution to getting text and video testimonials from your customers.
              </p>
            </div>
  
            {/* Products Column */}
            <div className="w-full md:w-1/5">
              <h3 className="font-semibold mb-3">Products</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Our Gallery</a></li>
                <li><a href="#" className="hover:text-white">Embed widgets</a></li>
                <li><a href="#" className="hover:text-white">Chrome extension</a></li>
                <li><a href="#" className="hover:text-white">Slack app</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
  
            {/* Company Column */}
            <div className="w-full md:w-1/5">
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Our resources</a></li>
                <li><a href="#" className="hover:text-white">Tutorials</a></li>
                <li><a href="#" className="hover:text-white">Privacy policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Contact us</a></li>
              </ul>
            </div>
  
            {/* Customers Column */}
            <div className="w-full md:w-1/5">
              <h3 className="font-semibold mb-3">Customers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Agencies</a></li>
                <li><a href="#" className="hover:text-white">B2B companies</a></li>
                <li><a href="#" className="hover:text-white">Course creators</a></li>
                <li><a href="#" className="hover:text-white">eCommerce</a></li>
                <li><a href="#" className="hover:text-white">Consumer apps</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  