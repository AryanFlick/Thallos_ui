"use client";

import { motion } from 'framer-motion';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

interface ComparisonData {
  id: string;
  eyebrow: string;
  traditionalTitle: string;
  traditionalPoints: string[];
  decentralizedTitle: string;
  decentralizedPoints: string[];
}

const comparisonData: ComparisonData[] = [
  {
    id: 'strategies',
    eyebrow: 'Access',
    traditionalTitle: 'Limited playbook',
    traditionalPoints: [
      'Stocks, bonds, a few funds',
      'High minimums gate advanced strategies', 
      'One provider, one shelf of products'
    ],
    decentralizedTitle: 'Institutional playbook',
    decentralizedPoints: [
      'Multi-strategy, multi-venue access',
      'Flexible sizing across opportunities',
      'Allocation engine over products'
    ]
  },
  {
    id: 'middlemen',
    eyebrow: 'Execution',
    traditionalTitle: 'Hands in the middle',
    traditionalPoints: [
      'Exchanges, brokers, and routing fees',
      'Slow, fragmented settlement',
      'After-hours "privilege" windows'
    ],
    decentralizedTitle: 'Code, not middlemen',
    decentralizedPoints: [
      'Direct, rules-based execution',
      'Fewer hops, fewer fees',
      'Markets available 24/7'
    ]
  },
  {
    id: 'velocity',
    eyebrow: 'Compounding',
    traditionalTitle: 'Classic compounding, low velocity',
    traditionalPoints: [
      'Idle periods between cycles',
      'Static schedules miss moves',
      'Friction erodes net returns'
    ],
    decentralizedTitle: 'High-velocity compounding',
    decentralizedPoints: [
      'Programmatic harvest & redeploy',
      'Adaptive cadence to conditions',
      'Designed for net-of-fee capture'
    ]
  },
  {
    id: 'reporting',
    eyebrow: 'Transparency',
    traditionalTitle: 'Opaque reporting',
    traditionalPoints: [
      'End-of-month PDFs and delays',
      'Unclear fees and slippage',
      'Hard to trace positions'
    ],
    decentralizedTitle: 'See it as it happens',
    decentralizedPoints: [
      'Live positions & activity',
      'Clear cost basis & exports',
      'Traceable flows, end-to-end'
    ]
  },
  {
    id: 'opportunity',
    eyebrow: 'Opportunity Set',
    traditionalTitle: 'Yesterday\'s asset mix',
    traditionalPoints: [
      'Stocks, bonds, real estate—full stop',
      'Missed digital yield & fees-to-makers shift',
      'Slow to adopt new infrastructure'
    ],
    decentralizedTitle: 'Don\'t miss the new class',
    decentralizedPoints: [
      'Access emerging, programmable assets',
      'Capture real, protocol-level yield',
      'Portfolio built for the digital economy'
    ]
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8 } 
  }
};

export default function WhyGoBeyond() {
  return (
    <section className="bg-black py-8 sm:py-12 lg:py-16 relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/10 via-transparent to-purple-950/5" />
      </div>

      <div className="relative z-10 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full min-h-screen">
          {/* Left Side - Static Title */}
          <div className="flex items-center justify-center p-6 lg:p-12 lg:sticky lg:top-0 lg:h-screen">
            <motion.div 
              className="max-w-xl"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <div className="mb-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-purple-950/30 border border-purple-800/30 px-4 py-2 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                  <span className="text-sm font-medium text-purple-200">Traditional vs Decentralized</span>
                </span>
              </div>
              
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[0.9]">
                Why go
                <span className="block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
                  beyond
                </span>
                <span className="block">traditional</span>
                <span className="block">finance?</span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-400 font-light leading-relaxed">
                Scroll to explore how decentralized finance eliminates the friction, 
                delays, and limitations of the old system.
              </p>

              {/* Scroll indicator */}
              <div className="mt-12 flex items-center gap-3 text-purple-300">
                <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-sm font-medium">Scroll to compare</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Scroll Stack */}
          <div className="h-[70vh] lg:h-[80vh] overflow-hidden lg:border-l lg:border-purple-900/20 rounded-3xl bg-gradient-to-b from-purple-950/10 to-transparent">
            <ScrollStack
              className="h-full"
              itemDistance={100}
              itemScale={0.025}
              itemStackDistance={35}
              stackPosition="20%"
              scaleEndPosition="10%"
              baseScale={0.90}
              rotationAmount={0}
              blurAmount={2}
            >
              {comparisonData.map((item, index) => (
                <ScrollStackItem key={item.id} itemClassName="comparison-card">
                  <div className="relative h-full">
                    {/* Card Header */}
                    <div className="flex items-center mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-lg font-bold text-purple-300">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-semibold tracking-wider text-purple-400 uppercase">
                            {item.eyebrow}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Comparison Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Traditional Side */}
                      <div className="relative">
                        <div className="absolute -top-2 -left-2 w-full h-full rounded-2xl bg-gradient-to-br from-gray-800/20 to-transparent"></div>
                        <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gray-700/50 flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                              </svg>
                            </div>
                            <h4 className="text-sm font-semibold text-gray-300">Traditional</h4>
                          </div>
                          <h5 className="text-lg font-bold text-gray-200 mb-3">
                            {item.traditionalTitle}
                          </h5>
                          <ul className="space-y-2">
                            {item.traditionalPoints.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-gray-500 mt-2 flex-shrink-0"></span>
                                <span className="text-sm text-gray-400 leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Decentralized Side */}
                      <div className="relative">
                        <div className="absolute -top-2 -right-2 w-full h-full rounded-2xl bg-gradient-to-br from-purple-600/20 to-transparent"></div>
                        <div className="relative bg-gradient-to-br from-purple-950/40 to-purple-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/50">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-purple-600/50 flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-300" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h4 className="text-sm font-semibold text-purple-300">Decentralized</h4>
                          </div>
                          <h5 className="text-lg font-bold text-white mb-3">
                            {item.decentralizedTitle}
                          </h5>
                          <ul className="space-y-2">
                            {item.decentralizedPoints.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-purple-400 mt-2 flex-shrink-0"></span>
                                <span className="text-sm text-gray-300 leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer - Progress Indicator */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex gap-1">
                        {comparisonData.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all duration-300 ${
                              i <= index 
                                ? 'w-8 bg-purple-500' 
                                : 'w-2 bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {index + 1} of {comparisonData.length}
                      </span>
                    </div>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </div>
      </div>
    </section>
  );
}