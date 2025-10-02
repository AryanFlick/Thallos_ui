"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type Logo = { name: string; src: string };

const LOGOS: Logo[] = [
  { name: "Aave", src: "/logos/Aave.png" },
  { name: "DeFi Llama", src: "/logos/DefiLlama.png" },
  { name: "Coinbase", src: "/logos/Coinbase.png" },
  { name: "GMX", src: "/logos/GMX.png" },
  { name: "Messari", src: "/logos/messari.png" },
];

export default function LogoScroller() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LOGOS.length);
    }, 2500); // Smooth transition timing

    return () => clearInterval(interval);
  }, []);

  // Get the 4 logos to display (2 left, 2 right of Thallos)
  const getVisibleLogos = () => {
    const leftLogos = [];
    const rightLogos = [];
    
    // Get 2 logos for the left side
    for (let i = -2; i <= -1; i++) {
      leftLogos.push(LOGOS[(currentIndex + i + LOGOS.length) % LOGOS.length]);
    }
    
    // Get 2 logos for the right side
    for (let i = 1; i <= 2; i++) {
      rightLogos.push(LOGOS[(currentIndex + i + LOGOS.length) % LOGOS.length]);
    }
    
    return { leftLogos, rightLogos };
  };

  const { leftLogos, rightLogos } = getVisibleLogos();

  return (
    <div className="relative w-full overflow-hidden py-16">
      {/* Main container with proper centering */}
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-4">
          
          {/* Left side logos */}
          {leftLogos.map((logo, index) => (
            <div
              key={`left-${currentIndex}-${index}`}
              className="h-20 w-20 rounded-xl bg-gray-900/50 backdrop-blur-sm flex items-center justify-center transition-all duration-1000 ease-in-out transform"
              style={{
                animation: 'slideIn 1s ease-in-out'
              }}
            >
              <Image
                src={logo.src}
                width={48}
                height={48}
                alt={`${logo.name} logo`}
                className="object-contain opacity-90"
                priority
              />
            </div>
          ))}
          
          {/* Thallos in the center with animated shiny border */}
          <div className="relative mx-2">
            {/* Contained animated border - only around Thallos */}
            <div className="absolute -inset-[1px] rounded-xl overflow-hidden">
              <div 
                className="absolute inset-0 opacity-100"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.6), transparent)',
                  animation: 'shimmer 2.5s linear infinite'
                }}
              />
            </div>
            
            {/* Subtle static glow */}
            <div className="absolute -inset-[2px] rounded-xl bg-emerald-500/20 blur-md" />
            
            {/* Main Thallos container */}
            <div className="relative h-20 w-20 rounded-xl bg-neutral-900 flex items-center justify-center border border-emerald-500/30">
              {/* Checkerboard pattern */}
              <div className="absolute inset-3 grid grid-cols-4 grid-rows-4 gap-[0.5px] opacity-30">
                {Array.from({ length: 16 }, (_, i) => (
                  <div
                    key={i}
                    className={`${
                      (Math.floor(i / 4) + i) % 2 === 0 ? 'bg-white' : 'bg-transparent'
                    } rounded-[1px]`}
                  />
                ))}
              </div>
              
              {/* Thallos logo */}
              <div className="relative z-10 flex items-center justify-center">
                <Image
                  src="/logos/Thallos.png"
                  width={48}
                  height={48}
                  alt="Thallos"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          
          {/* Right side logos */}
          {rightLogos.map((logo, index) => (
            <div
              key={`right-${currentIndex}-${index}`}
              className="h-20 w-20 rounded-xl bg-gray-900/50 backdrop-blur-sm flex items-center justify-center transition-all duration-1000 ease-in-out transform"
              style={{
                animation: 'slideIn 1s ease-in-out'
              }}
            >
              <Image
                src={logo.src}
                width={48}
                height={48}
                alt={`${logo.name} logo`}
                className="object-contain opacity-90"
                priority
              />
            </div>
          ))}
          
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
