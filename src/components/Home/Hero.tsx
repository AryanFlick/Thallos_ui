import DarkVeil from '@/components/DarkVeil';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-black">
      {/* DarkVeil Background with purple theme - More visible */}
      <div className="absolute inset-0 z-0 opacity-70">
        <DarkVeil 
          speed={1.2}
          hueShift={270}
          noiseIntensity={0.03}
          warpAmount={0.15}
          scanlineIntensity={0.02}
          scanlineFrequency={0.8}
        />
      </div>
      
      {/* Gradient Overlays - Subtle to let DarkVeil show through */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent via-transparent to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/10 via-transparent to-purple-950/10" />
      </div>
      
      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-6xl text-center">
          {/* Premium Badge */}
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full bg-purple-950/60 border border-purple-700/40 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium text-purple-100">Institutional DeFi Platform</span>
          </div>
          
          {/* Main Heading - Exactly 2 Lines */}
          <h2 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] max-w-5xl mx-auto">
            <span className="block text-white">Bringing institutional discipline</span>
            <span className="block bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
              to decentralized markets
            </span>
          </h2>
          
          {/* Subheading - Responsive */}
          <p className="mt-3 sm:mt-4 lg:mt-6 text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-300 max-w-2xl lg:max-w-3xl mx-auto font-light px-4 sm:px-0">
            Thallos is bridging traditional portfolios to the on-chain economy with 
            <span className="text-purple-200 font-normal"> risk-controlled strategies</span> and 
            <span className="text-purple-200 font-normal"> secure execution</span>.
          </p>
          
          {/* CTA Buttons - Responsive */}
          <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <a href="/waitlist" className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600/80 to-purple-500/80 backdrop-blur-xl border border-purple-400/20 text-white font-semibold text-base sm:text-lg shadow-2xl shadow-purple-900/50 transition-all duration-300 hover:shadow-purple-900/70 hover:scale-105 hover:from-purple-500/90 hover:to-purple-400/90 inline-block text-center">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <button className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-purple-800/50 bg-purple-950/20 backdrop-blur-xl text-purple-200 font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-purple-950/40 hover:border-purple-700/70 hover:text-purple-100">
              Learn More 
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
