export default function StrategiesSection() {
  return (
    <section id="strategies" className="bg-black py-16 sm:py-24 lg:py-32 xl:py-40 relative border-t border-emerald-900/20">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/5 via-transparent to-emerald-950/5" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-950/30 border border-emerald-800/30 rounded-full px-4 py-2 mb-6">
            <span className="text-emerald-400 text-sm font-medium">{'// Portfolio Strategy'}</span>
          </div>
          <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-emerald-400 uppercase mb-3 sm:mb-4">
            Our Strategies
          </h2>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 sm:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">Risk-Controlled</span> Alpha Generation
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-400 font-light px-4 sm:px-0">
            Our proprietary strategies are designed to capture opportunities across DeFi protocols
            while maintaining strict risk parameters and capital preservation principles.
          </p>
        </div>
      </div>
    </section>
  );
}
