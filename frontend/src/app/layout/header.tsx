"use client";
import React, { useState, useEffect } from "react";

const Header = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = isClient ? Math.min(scrollY / window.innerHeight, 1) : 0;
  return (
    <div className="w-full h-screen relative">
      <video
        className="w-full h-full object-cover"
        src="/assets/videos/beachVid.mp4"
        autoPlay
        loop
        muted
      />
      <div className="absolute w-full h-screen top-0 left-0 bg-gradient-to-b from-gray-900 to-white/0 transition-opacity duration-300 overlay" 
      style={{
        background: `linear-gradient(to bottom, rgba(31, 41, 55, ${0.1 - opacity * 1}), white)`,
      }}/>
      <div className="absolute top-0 w-full h-full flex flex-col justify-center text-center text-white py-4">
        <h1 className="font-bold text-5xl py-2">First Class Travel</h1>
        <h3 className="py-7 text-3xl">Top 1% Locations Worldwide</h3>
        <div>
          <button className="mb-5 mt-1 bg-blue-400 py-3 px-7 rounded-lg w-fit">
            Discover Tour
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
