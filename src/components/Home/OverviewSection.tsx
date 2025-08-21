"use client";

import { motion } from 'framer-motion';
import SpotlightCard from '../SpotlightCard';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6 } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const overviewData = [
  {
    id: 'legacy-finance',
    title: 'Legacy Finance',
    description: 'Banks, brokers, funds — reliable but slow, fee-layered, and constrained to a narrow menu of assets.',
    spotlightColor: 'rgba(156, 163, 175, 0.15)' // Gray spotlight
  },
  {
    id: 'thallos-bridge',
    title: 'Thallos Bridge',
    description: 'A secure access layer that converts capital into programmatic strategies — handling custody, execution, and risk controls.',
    spotlightColor: 'rgba(139, 92, 246, 0.2)' // Purple spotlight
  },
  {
    id: 'expanded-opportunity',
    title: 'Expanded Opportunity Set',
    description: 'Transparent, programmable markets with 24/7 liquidity and real yield — a broader toolkit than stocks/bonds alone.',
    spotlightColor: 'rgba(59, 130, 246, 0.15)' // Blue spotlight
  }
];

export default function OverviewSection() {
  return (
    <section className="bg-black py-6 sm:py-8 lg:py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/10 via-transparent to-purple-950/5" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-purple-950/30 border border-purple-800/30 px-4 py-2 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-sm font-medium text-purple-200">OVERVIEW</span>
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6">
            A bigger toolkit for
            <span className="block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
              your capital
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
            Keep the safety. Add speed, transparency, and yield.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {overviewData.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              className="h-full"
            >
              <SpotlightCard 
                className="h-full flex flex-col justify-between min-h-[280px] sm:min-h-[320px] lg:min-h-[360px]"
                spotlightColor={item.spotlightColor}
              >
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-8 sm:mt-12 lg:mt-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <button className="group inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-all duration-300 font-medium text-lg sm:text-xl">
            See how we do it
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="2" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
