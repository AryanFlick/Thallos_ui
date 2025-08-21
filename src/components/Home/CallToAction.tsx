export default function CallToAction() {
  return (
    <section id="waitlist" className="bg-black py-16 sm:py-24 lg:py-32 xl:py-40 relative border-t border-purple-900/20">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent" />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-950/30 border border-purple-800/30 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-sm mb-6 sm:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium text-purple-200">Limited Access</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 sm:mb-8 leading-tight">
            Ready to <span className="text-purple-400">Get Started?</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-400 mb-8 sm:mb-12 font-light px-4 sm:px-0">
            Join the waitlist to be among the first to experience institutional-grade DeFi portfolio management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <button className="w-full sm:w-auto group relative px-6 sm:px-8 py-3 sm:py-4 overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold text-base sm:text-lg shadow-2xl shadow-purple-900/50 transition-all duration-300 hover:shadow-purple-900/70 hover:scale-105">
              <span className="relative z-10">Join Waitlist</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl border border-purple-800/50 text-purple-200 font-semibold text-base sm:text-lg backdrop-blur-sm transition-all duration-300 hover:bg-purple-950/30 hover:border-purple-700/50 hover:text-purple-100">
              Contact Sales <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
