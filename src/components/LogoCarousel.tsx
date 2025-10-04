"use client";

import Image from "next/image";
import React from "react";

const LOGOS = [
  { src: "/logos/Aave.png", alt: "Aave" },
  { src: "/logos/GMX.png", alt: "GMX" },
  { src: "/logos/DefiLlama.png", alt: "DeFiLlama" },
  { src: "/logos/messari.png", alt: "Messari" },
  { src: "/logos/Coinbase.png", alt: "Coinbase" },
];

export default function LogoCarousel() {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
      {/* Infinite scroll container */}
      <div className="flex gap-8 animate-scroll">
        {/* First set of logos */}
        {LOGOS.map((logo, index) => (
          <div
            key={`logo-1-${index}`}
            className="flex items-center justify-center shrink-0 w-32 h-32"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={120}
              className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ))}
        
        {/* Duplicate set for seamless loop */}
        {LOGOS.map((logo, index) => (
          <div
            key={`logo-2-${index}`}
            className="flex items-center justify-center shrink-0 w-32 h-32"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={120}
              className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ))}
        
        {/* Third set for extra smoothness */}
        {LOGOS.map((logo, index) => (
          <div
            key={`logo-3-${index}`}
            className="flex items-center justify-center shrink-0 w-32 h-32"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={120}
              height={120}
              className="object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-160px * ${LOGOS.length}));
          }
        }

        .animate-scroll {
          animation: scroll 15s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
