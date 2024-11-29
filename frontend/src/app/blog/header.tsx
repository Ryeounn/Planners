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
        <img className="w-full h-full object-cover" src="/assets/images/blog/blog.jpg"/>
      <div className="absolute w-full h-screen top-0 left-0 bg-gradient-to-b from-gray-900 to-white/0 transition-opacity duration-300 overlay" 
      style={{
        background: `linear-gradient(to bottom, rgba(31, 41, 55, ${0.5 - opacity * 1}), white)`,
      }}/>
      <div className="absolute top-0 w-full h-full flex flex-col justify-center text-center text-white py-4">
        <h1 className="font-bold text-5xl py-2">Blog Travel</h1>
        <h3 className="py-7 text-3xl">Record your exciting journey</h3>
      </div>
    </div>
  );
};

export default Header;
