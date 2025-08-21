export default function AboutSection() {
  return (
    <section id="about" className="bg-black py-16 sm:py-24 lg:py-32 xl:py-40 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-xs sm:text-sm font-semibold tracking-wider text-purple-400 uppercase mb-3 sm:mb-4">
            About Thallos
          </h2>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 sm:mb-8 leading-tight">
            Institutional-Grade <span className="text-purple-400">DeFi Infrastructure</span>
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-gray-400 font-light px-4 sm:px-0">
            We combine decades of traditional finance experience with cutting-edge blockchain technology
            to deliver secure, scalable, and sophisticated portfolio management solutions.
          </p>
        </div>
      </div>
    </section>
  );
}
