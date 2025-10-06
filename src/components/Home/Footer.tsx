'use client';

import BoxSplitAnimation from '@/components/BoxSplitAnimation';

export default function Footer() {
  return (
    <footer className="relative bg-black">
      {/* Traditional Footer Content */}
      <div className="bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  Thallos
                </h3>
              </div>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Bringing institutional discipline to decentralized markets. Professional-grade DeFi strategies designed for sophisticated investors.
              </p>
              <div className="flex space-x-4 mt-6">
                {/* Social Links */}
                <a 
                  href="#" 
                  className="text-gray-500 hover:text-emerald-400 transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-gray-500 hover:text-emerald-400 transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="text-gray-500 hover:text-emerald-400 transition-colors duration-300"
                  aria-label="Discord"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#overview" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#strategies" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Strategies
                  </a>
                </li>
                <li>
                  <a href="#agent" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Thallos Agent
                  </a>
                </li>
                <li>
                  <a href="/waitlist" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Join Alpha
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 text-sm">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-12 pt-8 border-t border-emerald-900/20">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm">
                © 2024 Thallos. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy" className="text-gray-500 hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-500 hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Terms of Service
                </a>
                <a href="/terms#investment-risks" className="text-gray-500 hover:text-emerald-400 transition-colors duration-300 text-sm">
                  Risk Disclosure
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Box Split Animation Section - At the very bottom */}
      <section className="py-8 sm:py-12">
        <BoxSplitAnimation 
          text="THALLOS CAPITAL"
          totalBoxes={18}
          showTyping={true}
          typeSpeedMsPerChar={150}
          className="min-h-[120px] sm:min-h-[160px] md:min-h-[200px]"
          backgroundClass="bg-black"
          boxColorClass="bg-gradient-to-t from-emerald-900/60 to-emerald-800/40"
          textClassName="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 animate-shimmer tracking-wider relative text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
        />
      </section>
    </footer>
  );
}
