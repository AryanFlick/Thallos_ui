'use client';

import { BackgroundRippleEffect } from '@/components/ui/background-ripple-effect';
import SearchBar from '@/components/ui/SearchBar';
import { theme } from '@/styles/theme';

export default function Hero() {

  // Extract theme colors for easy modification
  const colors = {
    // Hero section colors from theme
    heading: {
      from: theme.hero.headingFrom,
      to: theme.hero.headingTo,
    },
    accent: theme.hero.accent,
    subheading: theme.hero.subheading,
    ctaPrimary: theme.hero.ctaPrimary,
    ctaSecondary: theme.hero.ctaSecondary,
    background: theme.background.primary,
  };

  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden pt-16 md:pt-0"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background Ripple Effect */}
      <div className="absolute inset-0 z-[1]">
        <BackgroundRippleEffect 
          rows={12}
          cols={30}
          cellSize={48}
        />
      </div>
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 z-[2] bg-black/20" />
      
      {/* Content */}
      <div className="relative z-[3] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-6xl text-center">
          
          {/* Main Heading */}
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight leading-[1.1] max-w-6xl mx-auto bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b"
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              backgroundImage: `linear-gradient(to bottom, ${colors.heading.from}, ${colors.heading.to})`
            }}
          >
            The indispensable terminal for DeFi&apos;s capital markets
          </h1>
          
          {/* Search Bar with Typewriter Effect */}
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
