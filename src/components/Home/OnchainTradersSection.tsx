"use client";

import { motion } from 'framer-motion';

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
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const tradersFeatures = [
  {
    id: 'token-discovery',
    title: 'Token Discovery',
    description: 'Spot the next big opportunity before the crowd.',
  },
  {
    id: 'due-diligence',
    title: 'Due Diligence',
    description: 'Run checks on any wallet, token, or trend in seconds.',
  },
  {
    id: 'price-explainers',
    title: 'Price Explainers',
    description: 'Understand market moves in plain language.',
  },
  {
    id: 'portfolio-personalized',
    title: 'Portfolio Personalized',
    description: 'Track all your assets and protocols, in one place.',
  },
  {
    id: 'address-labeling',
    title: 'Address Labeling',
    description: 'Know who\'s behind every transaction — from whales to funds.',
  },
  {
    id: 'transaction-review',
    title: 'Transaction Review',
    description: 'Context-rich breakdowns of movements that matter.',
  }
];

export default function OnchainTradersSection() {
  return (
    <section className="bg-black py-20 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/5 to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 lg:mb-20"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-950/30 border border-emerald-800/30 rounded-full px-4 py-2 mb-6">
            <span className="text-emerald-400 text-sm font-medium">{'// Trading Features'}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-2">
            Built and Optimized
          </h2>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            For{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Onchain Traders
            </span>
          </h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {tradersFeatures.map((feature) => (
            <motion.div
              key={feature.id}
              variants={fadeInUp}
              className="text-center px-4 sm:px-0"
            >
              {/* Title */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-400 mb-3 sm:mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Optional CTA */}
        <motion.div
          className="text-center mt-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <button className="group inline-flex items-center gap-3 px-8 py-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/50 rounded-full text-green-400 font-medium text-lg transition-all duration-300">
            Explore Trading Features
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
