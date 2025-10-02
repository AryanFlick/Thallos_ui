"use client";
import React from "react";
import { Globe } from "@/components/magicui/globe";

export const GlobeVisualization = () => {
  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] relative overflow-hidden bg-transparent">
      <div className="relative z-10 w-full h-full flex items-center justify-center" style={{ minHeight: '300px' }}>
        <Globe className="w-full h-full" />
      </div>
    </div>
  );
};
