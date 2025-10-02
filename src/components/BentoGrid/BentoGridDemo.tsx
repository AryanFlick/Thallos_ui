"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  IconChartLine,
  IconBolt,
  IconWorld,
  IconBrandApple,
} from "@tabler/icons-react";
import { GlobeVisualization } from "./GlobeVisualization";
import LogoScroller from "../LogoScroller";

export function BentoGridDemo() {
  return (
    <div className="w-full py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1] text-white mb-6">
            Built for DeFi Professionals
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to make informed decisions in decentralized finance, 
            from real-time data to strategic insights.
          </p>
        </div>

        {/* Bento Grid */}
        <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[28rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              className={item.className}
              icon={item.icon}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}

const DataVisualization = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-800/20 border border-green-500/20 p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-dot-white/[0.1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
    <div className="relative z-10 flex flex-col justify-center space-y-3">
      <div className="flex items-center space-x-4">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-300 text-sm font-mono">ETH/USD: $2,340.50</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <span className="text-blue-300 text-sm font-mono">TVL: $45.2B</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        <span className="text-yellow-300 text-sm font-mono">APY: 12.4%</span>
      </div>
    </div>
  </div>
);

const PowerfulModels = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] relative overflow-hidden">
    <LogoScroller />
  </div>
);

const PerformanceMetrics = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-900/20 to-red-800/20 border border-orange-500/20 p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-dot-white/[0.1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
    <div className="relative z-10 flex items-center justify-between w-full">
      <div className="space-y-2">
        <div className="text-orange-300 text-xs font-semibold">PERFORMANCE</div>
        <div className="text-2xl font-bold text-white">+24.7%</div>
        <div className="text-orange-400 text-sm">This Quarter</div>
      </div>
      <div className="w-20 h-16 relative">
        <div className="absolute bottom-0 w-2 h-8 bg-orange-400/60 rounded-t"></div>
        <div className="absolute bottom-0 left-3 w-2 h-12 bg-orange-400/80 rounded-t"></div>
        <div className="absolute bottom-0 left-6 w-2 h-16 bg-orange-400 rounded-t"></div>
        <div className="absolute bottom-0 left-9 w-2 h-10 bg-orange-400/70 rounded-t"></div>
      </div>
    </div>
  </div>
);

const items = [
  {
    title: "Real-Time Market Data",
    description: "Access live DeFi metrics, prices, and protocol analytics with institutional-grade data feeds.",
    header: <DataVisualization />,
    className: "md:col-span-2",
    icon: <IconChartLine className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Powerful Models",
    description: "Deeply integrated with Aave, GMX, DeFi Llama and more — with zero data retention.",
    header: <PowerfulModels />,
    className: "md:col-span-1",
    icon: <IconBrandApple className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Global Network",
    description: "Real-time connections across major financial hubs and DeFi protocols worldwide.",
    header: <GlobeVisualization />,
    className: "md:col-span-1",
    icon: <IconWorld className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Performance Analytics",
    description: "Track portfolio performance, risk metrics, and strategic opportunities with advanced analytics.",
    header: <PerformanceMetrics />,
    className: "md:col-span-2",
    icon: <IconBolt className="h-4 w-4 text-neutral-500" />,
  },
];
