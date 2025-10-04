"use client";
import React, { useState, useEffect } from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { GlobeVisualization } from "./GlobeVisualization";
import LogoCarousel from "../LogoCarousel";

export function BentoGridDemo() {
  return (
    <div className="w-full py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-950/30 border border-emerald-800/30 rounded-full px-4 py-2 mb-6">
            <span className="text-emerald-400 text-sm font-medium">{'// Real-Time Intelligence'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] text-white mb-4 sm:mb-6">
            Built for <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">DeFi Professionals</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4 sm:px-0">
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
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
}

const qaData = [
  {
    question: "Which DeFi category has gained the most TVL recently?",
    answer: "Liquid Staking Derivatives (LSD) has gained +$12.4B TVL this quarter, with Lido and Rocket Pool leading the surge."
  },
  {
    question: "What's the market share of the top 5 DEX protocols?",
    answer: "Uniswap: 42%, Curve: 18%, PancakeSwap: 15%, dYdX: 12%, Balancer: 8%. Combined they control 95% of DEX volume."
  },
  {
    question: "What are the top 10 protocols by TVL?",
    answer: "1. Lido ($23.1B), 2. Aave ($11.8B), 3. MakerDAO ($8.4B), 4. Curve ($5.2B), 5. Uniswap ($4.9B), 6. Compound ($3.7B), 7. Rocket Pool ($3.2B), 8. Convex ($2.8B), 9. GMX ($2.1B), 10. dYdX ($1.9B)"
  },
  {
    question: "Which chains have the highest DeFi adoption?",
    answer: "Ethereum leads with $58B TVL (54%), followed by BSC $12B (11%), Arbitrum $8B (7%), Polygon $6B (6%), and Optimism $4B (4%)."
  }
];

const DataVisualization = () => {
  const [currentQA, setCurrentQA] = useState(0);
  const [phase, setPhase] = useState<'typing-question' | 'waiting' | 'showing-answer' | 'typing-answer' | 'display' | 'transition'>('typing-question');
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");

  useEffect(() => {
    const currentData = qaData[currentQA];
    let timeout: NodeJS.Timeout;

    switch (phase) {
      case 'typing-question':
        if (questionText.length < currentData.question.length) {
          timeout = setTimeout(() => {
            setQuestionText(prev => currentData.question.slice(0, prev.length + 1));
          }, 30);
        } else {
          timeout = setTimeout(() => {
            setPhase('waiting');
          }, 500);
        }
        break;

      case 'waiting':
        timeout = setTimeout(() => {
          setPhase('showing-answer');
        }, 100);
        break;

      case 'showing-answer':
        timeout = setTimeout(() => {
          setPhase('typing-answer');
        }, 300);
        break;

      case 'typing-answer':
        if (answerText.length < currentData.answer.length) {
          timeout = setTimeout(() => {
            setAnswerText(prev => currentData.answer.slice(0, prev.length + 1));
          }, 20);
        } else {
          timeout = setTimeout(() => {
            setPhase('display');
          }, 2500);
        }
        break;

      case 'display':
        timeout = setTimeout(() => {
          setPhase('transition');
        }, 100);
        break;

      case 'transition':
        timeout = setTimeout(() => {
          setQuestionText("");
          setAnswerText("");
          setCurrentQA((prev) => (prev + 1) % qaData.length);
          setPhase('typing-question');
        }, 500);
        break;
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentQA, phase, questionText, answerText]);

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border border-emerald-500/20 p-4 relative overflow-hidden">
      <div className="relative z-10 flex flex-col justify-start pt-4 w-full space-y-3">
        {/* Question Box */}
        <div 
          className={`transition-all duration-500 ${
            phase === 'transition' ? 'opacity-0 -translate-y-8' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="bg-gray-800/60 rounded-lg p-3 border border-emerald-500/40">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono text-xs mt-0.5 font-bold">Q:</span>
              <p className="text-white text-sm font-medium flex-1 leading-relaxed">
                {questionText}
                {phase === 'typing-question' && <span className="inline-block w-0.5 h-4 bg-emerald-400 ml-1 animate-pulse"></span>}
              </p>
            </div>
          </div>
        </div>

        {/* Answer Box */}
        {(phase === 'showing-answer' || phase === 'typing-answer' || phase === 'display' || phase === 'transition') && (
          <div 
            className={`transition-all duration-500 ${
              phase === 'transition'
                ? 'opacity-0 -translate-y-8' 
                : 'opacity-100 translate-y-0'
            }`}
            style={{
              animation: phase === 'showing-answer' ? 'slideInFromBottom 0.4s ease-out' : 'none'
            }}
          >
            <div className="bg-emerald-900/40 rounded-lg p-3 border border-emerald-400/40 shadow-lg shadow-emerald-500/10">
              <div className="flex items-start gap-2">
                <span className="text-emerald-300 font-mono text-xs mt-0.5 font-bold">A:</span>
                <p className="text-emerald-50 text-sm flex-1 leading-relaxed">
                  {answerText}
                  {phase === 'typing-answer' && <span className="inline-block w-0.5 h-4 bg-emerald-300 ml-1 animate-pulse"></span>}
                </p>
              </div>
            </div>
      </div>
        )}

        {/* Indicator - positioned at bottom */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-1.5">
          {qaData.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentQA ? 'w-8 bg-emerald-400' : 'w-1.5 bg-emerald-400/30'
              }`}
            />
          ))}
      </div>
      </div>
      
      <style jsx>{`
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
  </div>
);
};

const PowerfulModels = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] relative overflow-hidden">
    <LogoCarousel />
  </div>
);

const performanceMetrics = [
  {
    label: "PORTFOLIO PERFORMANCE",
    value: "+34.2%",
    subtext: "Past 30 Days",
    color: "emerald",
    bars: [65, 45, 80, 70, 95, 75],
    icon: "📈"
  },
  {
    label: "TOP PROTOCOL",
    value: "Aave",
    subtext: "+127% APY",
    color: "emerald",
    bars: [40, 55, 70, 85, 92, 88],
    icon: "🏆"
  },
  {
    label: "RISK-ADJUSTED RETURN",
    value: "2.4x",
    subtext: "Sharpe Ratio",
    color: "emerald",
    bars: [50, 60, 75, 70, 85, 90],
    icon: "⚡"
  },
  {
    label: "YIELD OPPORTUNITY",
    value: "18.5%",
    subtext: "Optimal Strategy",
    color: "emerald",
    bars: [30, 50, 65, 80, 75, 85],
    icon: "💎"
  }
];

const PerformanceMetrics = () => {
  const [currentMetric, setCurrentMetric] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentMetric((prev) => (prev + 1) % performanceMetrics.length);
        setIsAnimating(false);
      }, 600);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const metric = performanceMetrics[currentMetric];

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border border-emerald-500/20 p-6 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent animate-pulse"></div>
      
      {/* Floating particles */}
      <div className="absolute top-4 right-8 w-2 h-2 bg-emerald-400/40 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
      <div className="absolute top-12 right-16 w-1.5 h-1.5 bg-emerald-300/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
      <div className="absolute bottom-8 right-12 w-2 h-2 bg-emerald-500/20 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}></div>
      
      <div className="relative z-10 flex items-center justify-between w-full">
        {/* Left side - Metrics */}
        <div className="space-y-3 flex-1">
          <div 
            className={`transition-all duration-600 ${
              isAnimating ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))' }}>
                {metric.icon}
              </span>
              <div className={`text-emerald-300 text-xs font-bold tracking-wider`}>
                {metric.label}
              </div>
            </div>
            <div className={`text-4xl font-bold text-white mb-1 bg-gradient-to-r from-emerald-200 to-emerald-400 bg-clip-text text-transparent`}
              style={{
                textShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
                filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.2))'
              }}
            >
              {metric.value}
            </div>
            <div className={`text-emerald-400/80 text-sm font-medium`}>
              {metric.subtext}
            </div>
          </div>
        </div>

        {/* Right side - Animated Bar Chart */}
        <div className="flex items-end gap-2 h-24 relative">
          {metric.bars.map((height, idx) => (
            <div
              key={`${currentMetric}-${idx}`}
              className={`w-3 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t relative transition-all duration-700 ease-out`}
              style={{
                height: `${height}%`,
                animation: `slideUp 0.8s ease-out ${idx * 0.1}s backwards`,
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
              }}
            >
              {/* Glow effect on top */}
              <div className="absolute -top-1 left-0 right-0 h-2 bg-emerald-300 rounded-full blur-sm"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {performanceMetrics.map((_, idx) => (
          <div
            key={idx}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === currentMetric 
                ? 'w-8 bg-emerald-400 shadow-lg shadow-emerald-400/50' 
                : 'w-1.5 bg-emerald-400/30'
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const items = [
  {
    title: "Real-Time Market Data",
    description: "Access live DeFi metrics, prices, and protocol analytics with institutional-grade data feeds.",
    header: <DataVisualization />,
    className: "md:col-span-2",
  },
  {
    title: "Data from Everywhere",
    description: "Deeply integrated with Aave, GMX, DeFi Llama and more — with zero data retention.",
    header: <PowerfulModels />,
    className: "md:col-span-1",
  },
  {
    title: "Global Network",
    description: "Real-time connections across major financial hubs and DeFi protocols worldwide.",
    header: <GlobeVisualization />,
    className: "md:col-span-1",
  },
  {
    title: "Performance Analytics",
    description: "Track portfolio performance, risk metrics, and strategic opportunities with advanced analytics.",
    header: <PerformanceMetrics />,
    className: "md:col-span-2",
  },
];
