"use client";
import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  IconChartLine,
  IconTerminal2,
  IconDatabase,
  IconBolt,
} from "@tabler/icons-react";

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
        <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[20rem]">
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

const TerminalInterface = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-black border border-green-500/30 p-4 relative overflow-hidden">
    <div className="w-full">
      {/* Terminal Header */}
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-gray-400 text-xs ml-2">thallos-terminal</span>
      </div>
      {/* Terminal Content */}
      <div className="font-mono text-sm space-y-2">
        <div className="text-green-400">$ thallos analyze --protocol aave</div>
        <div className="text-gray-300">✓ Fetching protocol data...</div>
        <div className="text-gray-300">✓ Analyzing risk metrics...</div>
        <div className="text-green-400 animate-pulse">$ _</div>
      </div>
    </div>
  </div>
);

const DatabaseConnections = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-800/20 border border-purple-500/20 p-6 relative overflow-hidden">
    <div className="absolute inset-0 bg-dot-white/[0.1] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]"></div>
    <div className="relative z-10 w-full">
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="space-y-2">
          <div className="w-full h-2 bg-purple-500/30 rounded animate-pulse"></div>
          <div className="w-3/4 h-2 bg-blue-500/30 rounded animate-pulse"></div>
          <div className="w-1/2 h-2 bg-green-500/30 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-purple-400/50 rounded-full flex items-center justify-center">
            <IconDatabase className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
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
    title: "Terminal Interface",
    description: "Command-line access to DeFi protocols with natural language queries and instant results.",
    header: <TerminalInterface />,
    className: "md:col-span-1",
    icon: <IconTerminal2 className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Multi-Chain Integration",
    description: "Connect to 50+ blockchains and 200+ protocols through unified API endpoints.",
    header: <DatabaseConnections />,
    className: "md:col-span-1",
    icon: <IconDatabase className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Performance Analytics",
    description: "Track portfolio performance, risk metrics, and strategic opportunities with advanced analytics.",
    header: <PerformanceMetrics />,
    className: "md:col-span-2",
    icon: <IconBolt className="h-4 w-4 text-neutral-500" />,
  },
];
