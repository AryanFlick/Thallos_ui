"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { queryBackend, type QueryResponse } from '@/lib/api';

const queryExamples = [
  { type: "Liquidity Pools", query: "What are the best liquidity pools right now?" },
  { type: "Lending Rates", query: "What's the lending APY for ETH on Aave?" },
  { type: "Pool Comparison", query: "Show me WETH-USDC pool rates across protocols" },
  { type: "Token Price", query: "What's the current price of BTC?" },
  { type: "DeFi Protocol", query: "Show TVL and APY for Aave v3" },
  { type: "Best Yield", query: "Where can I get the best yield for USDC?" },
  { type: "Protocol Comparison", query: "Compare lending rates between Aave and Compound" },
  { type: "Market Data", query: "What are the top pools by TVL on Aerodrome?" }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0
  }
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  show: { 
    opacity: 1, 
    x: 0
  }
};

export default function ThallosAgentSection() {
  const [inputValue, setInputValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isFocused || isHovering) return;

    const typeText = async () => {
      setIsTyping(true);
      const currentExample = queryExamples[currentExampleIndex];
      const fullText = currentExample.query;
      
      // Clear current text
      setPlaceholder('');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Type the text with variable speed
      for (let i = 0; i <= fullText.length; i++) {
        setPlaceholder(fullText.substring(0, i));
        const delay = Math.random() * 30 + 20; // Variable typing speed for realism
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Wait before starting next cycle
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Fade out effect
      for (let i = fullText.length; i >= 0; i -= 2) {
        setPlaceholder(fullText.substring(0, i));
        await new Promise(resolve => setTimeout(resolve, 15));
      }
      
      setCurrentExampleIndex((prev) => (prev + 1) % queryExamples.length);
      setIsTyping(false);
    };

    const interval = setInterval(typeText, 8000); // Increased from 5000ms to 8000ms
    typeText(); // Start immediately

    return () => clearInterval(interval);
  }, [currentExampleIndex, isFocused, isHovering]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResponse(null);
    
    try {
      const result = await queryBackend(inputValue);
      setResponse(result);
    } catch (err: any) {
      setError(err.message || 'Failed to query backend. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <section className="bg-black py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/20 via-transparent to-purple-950/20" />
        {/* Animated gradient orbs */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side - Title and Description */}
          <motion.div
            className="text-center lg:text-left"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div 
              className="mb-8"
              variants={slideIn}
            >
              <span className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-purple-950/40 to-purple-900/30 border border-purple-700/40 px-5 py-2.5 backdrop-blur-xl shadow-lg shadow-purple-900/20">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-purple-400 to-purple-300"></span>
                </span>
                <span className="text-sm font-semibold text-purple-200 tracking-wider uppercase">AI Powered</span>
              </span>
            </motion.div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
              <span className="text-white">Thallos </span>
              <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                Agent
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-300 font-light leading-relaxed max-w-xl">
              Pull data about anything with Thallos Agent. Get instant insights into blockchain addresses, transactions, and market data with AI-powered analysis.
            </p>
          </motion.div>

          {/* Right Side - Interactive Box */}
          <motion.div
            className="flex justify-center lg:justify-end w-full"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div 
              className="relative group w-full max-w-2xl"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Animated glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-3xl opacity-20 group-hover:opacity-40 blur-2xl transition-all duration-500 animate-pulse"></div>
              
              {/* Single large textarea with integrated button */}
              <form onSubmit={handleSubmit} className="relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyPress={handleKeyPress}
                  placeholder={!isFocused && !inputValue ? placeholder : 'Ask me anything about blockchain data...'}
                  className="relative w-full h-64 lg:h-80 px-6 py-6 pb-16 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl border border-purple-600/30 rounded-3xl text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 font-mono text-sm leading-relaxed shadow-2xl shadow-purple-900/20"
                  style={{ 
                    caretColor: '#a78bfa'
                  }}
                />
                
                {/* Typing indicator */}
                {!isFocused && !inputValue && isTyping && (
                  <div className="absolute top-6 right-6 flex gap-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                )}

                {/* Submit button inside textarea */}
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-2 px-4 rounded-xl hover:from-purple-500 hover:to-purple-400 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-900/30 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="flex items-center gap-2 text-sm">
                    {isLoading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send</span>
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>

                {/* Character counter */}
                {inputValue && (
                  <div className="absolute bottom-4 left-6">
                    <span className="text-xs text-gray-500">{inputValue.length}/500</span>
                  </div>
                )}
              </form>
            </div>
          </motion.div>
        </div>

        {/* Response Section */}
        {(isLoading || response || error) && (
          <motion.div
            className="mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl border border-purple-600/30 rounded-3xl p-8 shadow-2xl shadow-purple-900/20">
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="ml-4 text-purple-300 font-medium">Querying backend...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <div>
                      <h3 className="text-red-300 font-semibold mb-1">Error</h3>
                      <p className="text-red-200/80 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {response && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Answer
                    </h3>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{response.answer}</p>
                    </div>
                  </div>

                  {response.sql && (
                    <div>
                      <h4 className="text-purple-300/70 font-medium text-sm mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                        </svg>
                        Generated SQL
                      </h4>
                      <pre className="bg-black/40 rounded-xl p-4 overflow-x-auto text-xs">
                        <code className="text-purple-200/80 font-mono">{response.sql}</code>
                      </pre>
                    </div>
                  )}

                  {response.debug && (
                    <div className="text-xs text-gray-500 flex gap-4">
                      {response.intent && <span>Intent: {response.intent}</span>}
                      {response.retryCount !== undefined && <span>Retries: {response.retryCount}</span>}
                      {response.debug.total_rows !== undefined && <span>Rows: {response.debug.total_rows}</span>}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
