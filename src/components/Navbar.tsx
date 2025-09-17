"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Check for user authentication
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Check if page is scrolled more than 20px
      setIsScrolled(currentScrollY > 20);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      // Close mobile menu when scrolling
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Different nav items based on authentication status
  const navItems = user ? [
    { name: 'Agent', href: '/chat' },
  ] : [
    { name: 'About', href: '#about' },
    { name: 'Strategies', href: '#strategies' },
    { name: 'Blog', href: '#blog' },
    { name: 'Agent', href: '/login' },
    { name: 'Education', href: '#education' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div
        className={`transition-all duration-500 ease-in-out ${
          isScrolled
            ? 'mx-auto max-w-fit mt-4'
            : 'w-full'
        }`}
      >
        <div
          className={`backdrop-blur-xl transition-all duration-500 ease-in-out relative overflow-hidden ${
            isScrolled
              ? 'bg-black/80 border border-yellow-800/30 rounded-full px-4 py-3 shadow-2xl shadow-yellow-900/30 before:absolute before:inset-0 before:bg-gradient-to-r before:from-yellow-500/10 before:via-transparent before:to-yellow-500/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500'
              : 'bg-black/50 border-b border-yellow-900/20 px-6 py-4 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-yellow-500/50 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500'
          }`}
        >
          <div
            className={`flex items-center transition-all duration-500 ${
              isScrolled
                ? 'gap-x-8 px-4'
                : 'justify-between max-w-7xl mx-auto'
            }`}
          >
            {/* Logo - Made Larger */}
            <Link
              href="/"
              className={`font-bold relative group transition-all duration-300 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              }`}
            >
              <span className="relative z-20 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent hover:from-yellow-300 hover:via-yellow-200 hover:to-yellow-300 transition-all duration-300">
                Thallos
              </span>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-600/20 to-yellow-400/20 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 z-10"></div>
            </Link>

            {/* Navigation Items - Desktop Only */}
            <div className="hidden md:flex items-center gap-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-400 hover:text-yellow-300 transition-all duration-300 font-medium relative group ${
                    isScrolled ? 'text-sm' : 'text-base'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute -inset-x-2 -inset-y-1 bg-yellow-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              ))}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-x-3">
              {user ? (
                // Logged in - show logout button
                <button
                  onClick={handleSignOut}
                  className={`text-gray-300 hover:text-yellow-300 transition-all duration-300 font-medium relative group ${
                    isScrolled ? 'text-sm' : 'text-base'
                  }`}
                >
                  <span className="relative z-10">Logout</span>
                  <div className="absolute -inset-x-2 -inset-y-1 bg-yellow-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                </button>
              ) : (
                // Not logged in - show login and waitlist buttons
                <>
                  <Link
                    href="/login"
                    className={`text-gray-300 hover:text-yellow-300 transition-all duration-300 font-medium relative group ${
                      isScrolled ? 'text-sm' : 'text-base'
                    }`}
                  >
                    <span className="relative z-10">Login</span>
                    <div className="absolute -inset-x-2 -inset-y-1 bg-yellow-500/10 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                  </Link>

                  <Link
                    href="/waitlist"
                    className={`bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 backdrop-blur-xl border border-yellow-400/20 text-white hover:from-yellow-500/90 hover:to-yellow-400/90 transition-all duration-300 font-semibold rounded-full shadow-lg shadow-yellow-900/30 hover:shadow-yellow-900/50 hover:scale-105 relative group overflow-hidden ${
                      isScrolled
                        ? 'px-4 py-1.5 text-sm'
                        : 'px-5 py-2 text-base'
                    }`}
                  >
                    <span className="relative z-10">Join Waitlist</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full opacity-20 group-hover:opacity-40 blur transition-all duration-300 -z-10"></div>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-yellow-400 transition-colors"
              aria-label="Menu"
            >
              <svg
                className={`transition-all duration-300 ${
                  isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>

                    {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 border-t border-yellow-900/20 backdrop-blur-xl">
              <div className="px-6 py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-400 hover:text-yellow-300 transition-colors font-medium py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Buttons */}
                {user ? (
                  // Logged in - show logout button
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="block w-full text-center text-gray-300 hover:text-yellow-300 transition-colors font-medium py-2 border-t border-yellow-900/20 pt-4"
                  >
                    Logout
                  </button>
                ) : (
                  // Not logged in - show login and waitlist buttons
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-gray-300 hover:text-yellow-300 transition-colors font-medium py-2 border-t border-yellow-900/20 pt-4"
                    >
                      Login
                    </Link>
                    
                    <Link
                      href="/waitlist"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center bg-gradient-to-r from-yellow-600/80 to-yellow-500/80 backdrop-blur-xl border border-yellow-400/20 text-white hover:from-yellow-500/90 hover:to-yellow-400/90 transition-all duration-300 font-semibold rounded-full py-3 px-6 mt-4 shadow-lg shadow-yellow-900/30 hover:shadow-yellow-900/50"
                    >
                      Join Waitlist
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating indicator when scrolled */}
      {isScrolled && (
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-3">
          <div className="relative">
            <div className="w-16 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-full opacity-60 animate-pulse" />
            <div className="absolute inset-0 w-16 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-full opacity-30 blur-sm animate-pulse" />
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-yellow-400 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>
      )}
    </nav>
  );
}
