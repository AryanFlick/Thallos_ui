'use client';

import { useState, useEffect, useMemo } from 'react';
import { theme } from '@/styles/theme';

export default function SearchBar() {
  // Search prompts for typewriter effect
  const searchPrompts = useMemo(() => [
    "What's ETH borrow utilization on Aave right now?",
    "Backtest ETH staking vs. Curve LP since Jan 2023.",
    "Show me top whale inflows this week."
  ], []);

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isUserTyping, setIsUserTyping] = useState(false);

  // Extract theme colors for easy modification
  const colors = {
    subheading: theme.hero.subheading,
    accent: theme.hero.accent,
    ctaPrimary: theme.hero.ctaPrimary,
    background: theme.background.primary,
  };

  // Typewriter effect (paused when user is typing)
  useEffect(() => {
    if (isUserTyping) return; // Don't animate when user is typing
    
    const currentPrompt = searchPrompts[currentPromptIndex];
    
    if (isWaiting) {
      const waitTimeout = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, 2000); // Wait 2 seconds before deleting
      return () => clearTimeout(waitTimeout);
    }

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentPromptIndex((prev) => (prev + 1) % searchPrompts.length);
      } else {
        const deleteTimeout = setTimeout(() => {
          setCurrentText(currentPrompt.substring(0, currentText.length - 1));
        }, 30); // Even faster deletion
        return () => clearTimeout(deleteTimeout);
      }
    } else {
      if (currentText === currentPrompt) {
        setIsWaiting(true);
      } else {
        const typeTimeout = setTimeout(() => {
          setCurrentText(currentPrompt.substring(0, currentText.length + 1));
        }, 70); // Faster typing speed
        return () => clearTimeout(typeTimeout);
      }
    }
  }, [currentText, isDeleting, isWaiting, currentPromptIndex, searchPrompts, isUserTyping]);

  const handleSearch = () => {
    window.location.href = '/waitlist';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    setIsUserTyping(value.length > 0);
  };

  const handleInputFocus = () => {
    setIsUserTyping(true);
  };

  const handleInputBlur = () => {
    if (userInput.length === 0) {
      setIsUserTyping(false);
    }
  };

  return (
    <div className="mt-8 sm:mt-10 lg:mt-12 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="relative group">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, ${colors.ctaPrimary.from}33, ${colors.ctaPrimary.to}33)`
          }}
        ></div>
        
        {/* Search bar */}
        <div 
          className="relative flex items-center backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl"
          style={{
            backgroundColor: `${colors.background}80`, // 50% opacity
            borderColor: '#4b5563', // Dark gray border
          }}
        >
          {/* Input field for user typing */}
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={isUserTyping ? "" : currentText}
            className="flex-1 bg-transparent text-base sm:text-lg focus:outline-none px-6 py-4 sm:py-5 placeholder-opacity-100"
            style={{ 
              color: colors.subheading,
              caretColor: colors.accent
            }}
          />
          
          {/* Show cursor only when not user typing */}
          {!isUserTyping && (
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none flex items-center">
              <span 
                className="text-base sm:text-lg invisible"
                style={{ color: colors.subheading }}
              >
                {currentText}
              </span>
              <span 
                className="w-0.5 h-6 animate-pulse ml-1"
                style={{ backgroundColor: colors.accent }}
              ></span>
            </div>
          )}
          
          <div className="flex items-center pr-2">
            {/* Search button */}
            <button
              onClick={handleSearch}
              className="ml-4 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              style={{
                background: `linear-gradient(to right, ${colors.ctaPrimary.from}, ${colors.ctaPrimary.to})`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${colors.ctaPrimary.hoverFrom}, ${colors.ctaPrimary.hoverTo})`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${colors.ctaPrimary.from}, ${colors.ctaPrimary.to})`;
              }}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
