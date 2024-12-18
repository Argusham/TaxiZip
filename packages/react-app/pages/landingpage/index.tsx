/* eslint-disable @next/next/no-img-element */
// src/components/LandingPage.tsx
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCar } from "@fortawesome/free-solid-svg-icons";
import { useUserRole } from "@/context/UserRoleContext";
import { useState, useEffect } from "react";
import InfoHub from "@/components/InfoHub";

export default function LandingPage() {
  const router = useRouter();
  const { setRole } = useUserRole();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      text: "Send to friends with just a few taps",
      img: "https://images.unsplash.com/photo-1629128625414-374a9e16d56a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      text: "Fast & Secure Payments",
      img: "https://images.unsplash.com/photo-1605794978644-f0b340b2785a?q=80&w=1071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      text: "Experience seamless rides",
      img: "https://plus.unsplash.com/premium_photo-1730143290241-faa5f87cbed7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  // Auto-advance carousel every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNavigation = (role: "driver" | "commuter") => {
    setRole(role);
    router.push(`/${role}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-between min-h-screen bg-white">
      {/* Title Section */}
      <div className="text-center mt-8">
        <h1 className="text-2xl font-semibold text-gray-800">Taxify Siyaya</h1>
        <h2 className="text-lg text-gray-500">Making Your Ride Enjoyable</h2>
      </div>

      {/* Image Carousel Section */}
      <div className="relative w-full h-[60vh] overflow-hidden flex items-center justify-center mt-4">
        <img
          src={slides[currentSlide].img}
          alt="Slide Image"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>

      {/* Carousel Text Section */}
      <div className="text-center mt-6">
        <p className="text-lg text-gray-800">{slides[currentSlide].text}</p>
        {/* Carousel Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentSlide ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Buttons Section */}
      <div className="w-full max-w-sm flex justify-around mt-10 mb-10">
        <button
          className="w-32 py-3 rounded-full border border-gray-300 text-gray-800 font-medium hover:bg-gray-100 transition-colors"
          onClick={() => handleNavigation("driver")}
        >
          <FontAwesomeIcon icon={faCar} className="mr-2" />
          Driver
        </button>
        <button
          className="w-32 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          onClick={() => handleNavigation("commuter")}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          Commuter
        </button>
      </div>

      <InfoHub />
    </div>
  );
}
