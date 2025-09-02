'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyText from '@/components/ShinyText';

const faqData = [
  {
    id: 1,
    question: "How does Thallos ensure institutional-grade security?",
    answer: "Thallos implements multi-layered security protocols including cold storage solutions, multi-signature wallets, and institutional custody partnerships. Our infrastructure undergoes regular third-party security audits and complies with institutional security standards."
  },
  {
    id: 2,
    question: "What makes Thallos different from other DeFi platforms?",
    answer: "Thallos bridges the gap between traditional institutional finance and decentralized markets. We provide institutional-grade risk management, compliance frameworks, and sophisticated analytics tools that traditional DeFi platforms lack, while maintaining the benefits of decentralization."
  },
  {
    id: 3,
    question: "What are the minimum investment requirements?",
    answer: "Thallos caters to institutional investors and sophisticated individuals. Minimum investment requirements vary by strategy, typically starting at $100,000 for individual strategies and $500,000 for portfolio management services. Contact us for specific requirements based on your investment goals."
  },
  {
    id: 4,
    question: "How does risk management work in your strategies?",
    answer: "Our risk management framework includes real-time monitoring, automated position sizing, dynamic hedging, and strict drawdown controls. We employ both quantitative models and qualitative analysis to assess and mitigate risks across all market conditions."
  },
  {
    id: 5,
    question: "What reporting and analytics do you provide?",
    answer: "Thallos provides comprehensive reporting including real-time portfolio analytics, risk metrics, performance attribution, and regulatory reporting. Our institutional dashboard offers detailed insights into strategy performance, market exposure, and compliance status."
  }
];

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <section className="py-20 sm:py-32 bg-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <ShinyText 
            text="Frequently Asked Questions"
            speed={4}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          />
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Get answers to common questions about Thallos and our institutional DeFi strategies.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-900/50 backdrop-blur-sm border border-purple-800/20 rounded-2xl overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 sm:px-8 py-6 text-left flex items-center justify-between hover:bg-purple-900/10 transition-all duration-300 group"
              >
                <ShinyText
                  text={faq.question}
                  speed={6}
                  className="text-lg sm:text-xl font-semibold pr-4 group-hover:text-purple-300 transition-colors duration-300"
                />
                <motion.div
                  animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex-shrink-0"
                >
                  <svg 
                    className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="2" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {openItems.includes(faq.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-8 pb-6 pt-2 border-t border-purple-800/10">
                      <ShinyText
                        text={faq.answer}
                        speed={8}
                        className="text-gray-300 text-base sm:text-lg leading-relaxed"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center space-y-4 p-8 bg-gradient-to-br from-purple-900/20 via-purple-800/10 to-purple-900/20 backdrop-blur-sm border border-purple-600/20 rounded-2xl">
            <ShinyText
              text="Still have questions?"
              speed={5}
              className="text-xl sm:text-2xl font-semibold"
            />
            <p className="text-gray-400 text-base sm:text-lg mb-4">
              Our team is here to help you understand how Thallos can work for your portfolio.
            </p>
            <a
              href="/waitlist"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600/80 to-purple-500/80 backdrop-blur-xl border border-purple-400/20 text-white font-semibold rounded-xl hover:from-purple-500/90 hover:to-purple-400/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-900/30"
            >
              <span>Get in Touch</span>
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl"></div>
    </section>
  );
}


