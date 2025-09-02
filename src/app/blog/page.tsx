"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

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
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=350&fit=crop&crop=center',
    date: 'December 15, 2024',
    readTime: '8 min read',
    category: 'Institutional'
  },
  {
    id: 'yield-farming-strategies-risk-management',
    title: 'Advanced Yield Farming Strategies and Risk Management',
    description: 'Deep dive into sophisticated yield farming techniques, risk assessment frameworks, and portfolio optimization strategies for maximizing returns while minimizing exposure.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=350&fit=crop&crop=center',
    date: 'December 12, 2024',
    readTime: '12 min read',
    category: 'Strategy'
  },
  {
    id: 'regulatory-landscape-defi-2024',
    title: 'Navigating the Regulatory Landscape of DeFi in 2024',
    description: 'Comprehensive analysis of the evolving regulatory framework for decentralized finance, compliance requirements, and what institutions need to know.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=350&fit=crop&crop=center',
    date: 'December 10, 2024',
    readTime: '10 min read',
    category: 'Regulation'
  },
  {
    id: 'smart-contract-security-audit-guide',
    title: 'Smart Contract Security: A Complete Audit Guide',
    description: 'Essential guide to smart contract security auditing, common vulnerabilities, best practices, and tools for ensuring protocol safety in DeFi applications.',
    image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=350&fit=crop&crop=center',
    date: 'December 8, 2024',
    readTime: '15 min read',
    category: 'Security'
  },
  {
    id: 'liquidity-mining-tokenomics-analysis',
    title: 'Liquidity Mining and Tokenomics: A Data-Driven Analysis',
    description: 'In-depth analysis of liquidity mining programs, tokenomics design, and their impact on protocol sustainability and token value accrual mechanisms.',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&h=350&fit=crop&crop=center',
    date: 'December 5, 2024',
    readTime: '11 min read',
    category: 'Analytics'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-black via-gray-900/50 to-black overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-600/20 rounded-full px-4 py-2 mb-6">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                <span className="text-purple-400 text-sm font-medium">Thallos Blog</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                DeFi Insights &{' '}
                <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
                  Analysis
                </span>
              </h1>
              
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Expert perspectives on decentralized finance, institutional adoption, regulatory developments, 
                and the future of blockchain technology.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden hover:border-purple-600/50 transition-all duration-500 hover:scale-[1.02]"
                >
                  <Link href={`/blog/${post.id}`}>
                    {/* Image */}
                    <div className="relative h-56 overflow-hidden">
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
                    <div className="p-6">
                      {/* Meta Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <time>{post.date}</time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
                        {post.title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {post.description}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center text-purple-400 text-sm font-semibold group-hover:text-purple-300 transition-colors duration-300">
                        <span>Read More</span>
                        <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
