import DarkVeil from '@/components/DarkVeil';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-black">
      {/* DarkVeil Background with yellow theme - More visible */}
      <div className="absolute inset-0 z-0 opacity-70">
        <DarkVeil 
          speed={1.2}
          hueShift={60}
          noiseIntensity={0.03}
          warpAmount={0.15}
          scanlineIntensity={0.02}
          scanlineFrequency={0.8}
        />
      </div>
      
      {/* Gradient Overlays - Subtle to let DarkVeil show through */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-950/20 via-transparent via-transparent to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-950/10 via-transparent to-yellow-950/10" />
      </div>
      
      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-6xl text-center">
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] max-w-6xl mx-auto" 
              style={{ color: '#E4E0EA', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            The indispensable terminal for DeFi&apos;s capital markets.
          </h1>
          
          {/* Subheading - Responsive */}
          <p className="mt-3 sm:mt-4 lg:mt-6 text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-300 max-w-2xl lg:max-w-3xl mx-auto font-light px-4 sm:px-0">
            Thallos is bridging traditional portfolios to the on-chain economy with 
            <span className="text-yellow-200 font-normal"> risk-controlled strategies</span> and 
            <span className="text-yellow-200 font-normal"> secure execution</span>.
          </p>
          
          {/* CTA Buttons - Responsive */}
          <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <a href="/waitlist" className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 overflow-hidden rounded-xl bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 backdrop-blur-xl border border-yellow-400/20 text-white font-semibold text-base sm:text-lg shadow-2xl shadow-yellow-900/50 transition-all duration-300 hover:shadow-yellow-900/70 hover:scale-105 hover:from-yellow-500/90 hover:to-yellow-400/90 inline-block text-center">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            <button className="w-full sm:w-auto group px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-yellow-800/50 bg-yellow-950/20 backdrop-blur-xl text-yellow-200 font-semibold text-base sm:text-lg transition-all duration-300 hover:bg-yellow-950/40 hover:border-yellow-700/70 hover:text-yellow-100">
              Learn More 
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
