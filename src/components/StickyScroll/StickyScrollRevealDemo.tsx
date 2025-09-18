"use client";
import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";

const content = [
  {
    title: "Pain Point 1 – \"Open but Locked\"",
    description:
      "On-chain data is technically open, but locked behind APIs, dashboards, and coding skills. Most teams get lost in the complexity before finding actionable insights.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <div className="grid grid-cols-3 gap-6 transform rotate-12 scale-110">
            <div className="w-24 h-24 bg-gray-600 rounded-lg border-2 border-gray-500 flex items-center justify-center text-sm font-semibold">API</div>
            <div className="w-24 h-24 bg-gray-600 rounded-lg border-2 border-gray-500 flex items-center justify-center text-2xl">📊</div>
            <div className="w-24 h-24 bg-gray-600 rounded-lg border-2 border-gray-500 flex items-center justify-center text-2xl">🔒</div>
            <div className="w-24 h-24 bg-gray-600 rounded-lg border-2 border-gray-500 flex items-center justify-center text-sm font-semibold">&lt;/&gt;</div>
            <div className="w-24 h-24 bg-gray-600 rounded-lg border-2 border-gray-500 flex items-center justify-center text-sm font-semibold">DB</div>
            <div className="w-24 h-24 bg-gray-600 rounded-lg border-2 border-gray-500 flex items-center justify-center text-2xl">🚧</div>
          </div>
        </div>
        <div className="text-center z-10">
          <h3 className="text-4xl font-bold mb-6 text-red-400">Data Locked Away</h3>
          <p className="text-xl text-gray-300">APIs • Dashboards • Code Barriers</p>
        </div>
      </div>
    ),
  },
  {
    title: "Fix – \"Ask Thallos\"",
    description:
      "Skip the complexity. Just ask Thallos in plain English and get structured, actionable insights instantly. No coding required.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-green-900 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
        <div className="text-center z-10 space-y-8 scale-110">
          <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 border border-green-400/30">
            <div className="text-green-400 text-lg mb-3">Query:</div>
            <div className="text-white text-xl font-medium">"What's ETH utilization on Aave?"</div>
            <div className="mt-6 pt-6 border-t border-green-400/30">
              <div className="text-green-300 text-lg">ETH Supply: 2.3M • Borrow: 1.8M • Util: 78%</div>
            </div>
          </div>
          <div className="bg-green-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-400/50 animate-pulse">
            <div className="text-green-200 text-lg">💡 Strategy Suggestion</div>
            <div className="text-white text-base mt-2">Consider yield farming opportunities</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Pain Point 2 – \"Infrastructure Bloat\"",
    description:
      "Funds waste precious time building data pipelines, maintaining spreadsheets, and managing infrastructure instead of focusing on strategy and alpha generation.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-red-900 to-orange-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-50">
          <div className="grid grid-cols-2 gap-12 scale-125">
            <div className="space-y-6">
              <div className="w-28 h-24 bg-gray-700 rounded-lg border-2 border-red-500 flex flex-col items-center justify-center text-sm font-semibold transform -rotate-12">
                <div className="text-2xl mb-1">🖥️</div>
                <div>Servers</div>
              </div>
              <div className="w-28 h-24 bg-gray-700 rounded-lg border-2 border-red-500 flex flex-col items-center justify-center text-sm font-semibold transform rotate-6">
                <div className="text-2xl mb-1">📊</div>
                <div>Sheets</div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="w-28 h-24 bg-gray-700 rounded-lg border-2 border-red-500 flex flex-col items-center justify-center text-sm font-semibold transform rotate-12">
                <div className="text-2xl mb-1">🔧</div>
                <div>APIs</div>
              </div>
              <div className="w-28 h-24 bg-gray-700 rounded-lg border-2 border-red-500 flex flex-col items-center justify-center text-sm font-semibold transform -rotate-6">
                <div className="text-2xl mb-1">💾</div>
                <div>DBs</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center z-10">
          <h3 className="text-4xl font-bold mb-6 text-orange-400">Infrastructure Bloat</h3>
          <p className="text-xl text-gray-300">Time wasted on plumbing, not strategy</p>
        </div>
      </div>
    ),
  },
  {
    title: "Fix – \"Thallos Terminal\"",
    description:
      "Plug into Thallos Terminal. Skip the infrastructure grind and start making strategic decisions immediately. Focus on what matters: generating alpha.",
    content: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"></div>
        <div className="w-full max-w-2xl z-10 scale-110">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-green-400/30 overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-gray-800/50 px-6 py-4 border-b border-green-400/20 flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div className="text-gray-400 text-lg ml-6 font-semibold">Thallos Terminal</div>
            </div>
            {/* Terminal Content */}
            <div className="p-8 space-y-4 font-mono text-lg">
              <div className="text-green-400 text-xl">$ thallos query "top defi yields"</div>
              <div className="text-gray-300 text-lg space-y-2">
                <div>✓ Aave USDC: 4.2% APY</div>
                <div>✓ Compound ETH: 3.8% APY</div>
                <div>✓ Uniswap V3: 12.4% APY</div>
              </div>
              <div className="text-green-400 animate-pulse text-xl">$ _</div>
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="text-green-400 font-bold text-2xl">Skip the grind. Start deciding.</div>
          </div>
        </div>
      </div>
    ),
  },
];

export function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-20 bg-black min-h-screen">
      <StickyScroll content={content} />
    </div>
  );
}
