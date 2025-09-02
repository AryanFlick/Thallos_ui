"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'institutional-defi-adoption-2024',
    title: 'Institutional DeFi Adoption: Trends and Opportunities in 2024',
    description: 'Explore how major financial institutions are embracing decentralized finance protocols and the emerging opportunities for institutional investors in the DeFi space.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center',
    date: 'December 15, 2024',
    readTime: '8 min read',
    category: 'Institutional'
  },
  {
    id: 'yield-farming-strategies-risk-management',
    title: 'Advanced Yield Farming Strategies and Risk Management',
    description: 'Deep dive into sophisticated yield farming techniques, risk assessment frameworks, and portfolio optimization strategies for maximizing returns while minimizing exposure.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop&crop=center',
    date: 'December 12, 2024',
    readTime: '12 min read',
    category: 'Strategy'
  },
  {
    id: 'regulatory-landscape-defi-2024',
    title: 'Navigating the Regulatory Landscape of DeFi in 2024',
    description: 'Comprehensive analysis of the evolving regulatory framework for decentralized finance, compliance requirements, and what institutions need to know.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center',
    date: 'December 10, 2024',
    readTime: '10 min read',
    category: 'Regulation'
  },
  {
    id: 'smart-contract-security-audit-guide',
    title: 'Smart Contract Security: A Complete Audit Guide',
    description: 'Essential guide to smart contract security auditing, common vulnerabilities, best practices, and tools for ensuring protocol safety in DeFi applications.',
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=250&fit=crop&crop=center',
    date: 'December 8, 2024',
    readTime: '15 min read',
    category: 'Security'
  },
  {
    id: 'liquidity-mining-tokenomics-analysis',
    title: 'Liquidity Mining and Tokenomics: A Data-Driven Analysis',
    description: 'In-depth analysis of liquidity mining programs, tokenomics design, and their impact on protocol sustainability and token value accrual mechanisms.',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&h=250&fit=crop&crop=center',
    date: 'December 5, 2024',
    readTime: '11 min read',
    category: 'Analytics'
  }
];

export default function BlogSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, blogPosts.length - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section id="blog" className="relative py-20 bg-gradient-to-b from-black via-gray-900/50 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-600/20 rounded-full px-4 py-2 mb-6">
            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="text-purple-400 text-sm font-medium">Insights & Analysis</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Latest from{' '}
            <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
              Thallos
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Stay ahead of the curve with our expert insights on DeFi strategies, institutional adoption, 
            regulatory developments, and blockchain analytics.
          </p>
        </motion.div>

        {/* Blog Carousel */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 border border-purple-600/40 text-white p-3 rounded-full transition-all duration-300 ${
              currentIndex === 0 
                ? 'bg-gray-600/20 opacity-50 cursor-not-allowed' 
                : 'bg-purple-600/20 hover:bg-purple-600/40 hover:scale-110'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 border border-purple-600/40 text-white p-3 rounded-full transition-all duration-300 ${
              currentIndex >= maxIndex
                ? 'bg-gray-600/20 opacity-50 cursor-not-allowed'
                : 'bg-purple-600/20 hover:bg-purple-600/40 hover:scale-110'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl">
            <motion.div 
              className="flex transition-transform duration-500 ease-in-out"
              animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
            >
              {blogPosts.map((post, index) => (
                <div key={post.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                  <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-600/50 transition-all duration-500 hover:scale-[1.02] h-full"
                  >
                    <Link href={`/blog/${post.id}`} className="block h-full">
                      <div className="flex flex-col h-full">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="bg-purple-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <time>{post.date}</time>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                            {post.description}
                          </p>

                          {/* Read More */}
                          <div className="flex items-center text-purple-400 text-sm font-semibold group-hover:text-purple-300 transition-colors duration-300 mt-auto">
                            <span>Read More</span>
                            <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-3">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-purple-500 w-8'
                    : 'bg-purple-500/30 hover:bg-purple-500/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600/20 to-purple-500/20 border border-purple-600/40 text-purple-300 hover:text-white hover:border-purple-500/60 px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-105 group"
          >
            <span className="font-semibold">View All Articles</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
