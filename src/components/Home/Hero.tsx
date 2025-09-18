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
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background Ripple Effect */}
      <div className="absolute inset-0 z-0">
        <BackgroundRippleEffect 
          rows={12}
          cols={30}
          cellSize={48}
        />
      </div>
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 z-10 bg-black/20" />
      
      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-6xl text-center">
          
          {/* Main Heading */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] max-w-6xl mx-auto bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b"
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              backgroundImage: `linear-gradient(to bottom, ${colors.heading.from}, ${colors.heading.to})`
            }}
          >
            The indispensable terminal for DeFi&apos;s capital markets
          </h1>
          
          {/* Search Bar with Typewriter Effect */}
          <SearchBar />
          
          {/* CTA Buttons - Responsive */}
          <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <a 
              href="/waitlist" 
              className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 overflow-hidden rounded-xl backdrop-blur-xl text-white font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 inline-block text-center"
              style={{
                background: `linear-gradient(to right, ${colors.ctaPrimary.from}, ${colors.ctaPrimary.to})`,
                border: `1px solid ${colors.ctaPrimary.border}`,
                boxShadow: `0 25px 50px -12px ${colors.ctaPrimary.shadow}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${colors.ctaPrimary.hoverFrom}, ${colors.ctaPrimary.hoverTo})`;
                e.currentTarget.style.boxShadow = `0 25px 50px -12px ${colors.ctaPrimary.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${colors.ctaPrimary.from}, ${colors.ctaPrimary.to})`;
                e.currentTarget.style.boxShadow = `0 25px 50px -12px ${colors.ctaPrimary.shadow}`;
              }}
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <button 
              className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 rounded-xl backdrop-blur-xl font-semibold text-base sm:text-lg transition-all duration-300"
              style={{
                border: `1px solid ${colors.ctaSecondary.border}`,
                backgroundColor: colors.ctaSecondary.bg,
                color: colors.ctaSecondary.text,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.ctaSecondary.hoverBg;
                e.currentTarget.style.border = `1px solid ${colors.ctaSecondary.hoverBorder}`;
                e.currentTarget.style.color = colors.ctaSecondary.hoverText;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.ctaSecondary.bg;
                e.currentTarget.style.border = `1px solid ${colors.ctaSecondary.border}`;
                e.currentTarget.style.color = colors.ctaSecondary.text;
              }}
            >
              Learn More 
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
