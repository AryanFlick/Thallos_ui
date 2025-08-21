export default function StrategiesSection() {
  return (
    <section id="strategies" className="bg-black py-16 sm:py-24 lg:py-32 xl:py-40 relative border-t border-purple-900/20">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-950/5 via-transparent to-purple-950/5" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-purple-400 uppercase mb-3 sm:mb-4">
            Our Strategies
          </h2>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 sm:mb-8 leading-tight">
            Risk-Controlled <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">Alpha Generation</span>
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
