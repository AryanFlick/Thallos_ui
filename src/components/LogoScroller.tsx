"use client";

import React from "react";
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
  // Triple the logos for seamless loop
  const tripleLogos = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <div className="relative w-full overflow-hidden py-12">
      {/* Scrolling logos container - behind Thallos */}
      <div className="relative z-[1] flex gap-12 animate-scroll-rtl">
        {tripleLogos.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            className="flex-shrink-0 flex items-center justify-center"
          >
            <Image
              src={logo.src}
              width={80}
              height={80}
              alt={`${logo.name} logo`}
              className="object-contain opacity-60 transition-opacity duration-300"
              priority
            />
          </div>
        ))}
      </div>
      
      {/* Thallos logo - fixed in center, on top */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10]">
        <div className="relative">
          {/* Animated border shimmer */}
          <div className="absolute -inset-[2px] rounded-xl overflow-hidden">
            <div 
              className="absolute inset-0 opacity-100"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.6), transparent)',
                animation: 'shimmer 2.5s linear infinite'
              }}
            />
          </div>
          
          {/* Glow effect */}
          <div className="absolute -inset-[3px] rounded-xl bg-emerald-500/30 blur-lg" />
          
          {/* Main Thallos container - bigger */}
          <div className="relative w-28 h-28 rounded-xl bg-neutral-900/95 backdrop-blur-sm flex items-center justify-center border border-emerald-500/40 shadow-2xl shadow-emerald-500/20">
            {/* Checkerboard pattern */}
            <div className="absolute inset-4 grid grid-cols-4 grid-rows-4 gap-[0.5px] opacity-30">
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
                width={56}
                height={56}
                alt="Thallos"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes scroll-rtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-scroll-rtl {
          animation: scroll-rtl 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
