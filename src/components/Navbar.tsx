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

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  };

  // Different nav items based on authentication status
  const navItems = user ? [
    { name: 'Agent', href: '/chat' },
    { name: 'Profile', href: '/profile' },
  ] : [];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${
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
          className={`backdrop-blur-2xl transition-all duration-500 ease-in-out relative overflow-hidden ${
            isScrolled
              ? 'bg-white/10 border border-white/20 rounded-full px-6 py-3 shadow-2xl shadow-black/20 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:via-transparent before:to-white/5 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500'
              : 'bg-white/5 border-b border-white/10 px-6 py-4 before:absolute before:bottom-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500'
          }`}
        >
          <div className={`flex items-center transition-all duration-500 max-w-7xl mx-auto ${isScrolled ? 'px-6' : ''}`}>
            {/* Logo - Left */}
            <div className={`flex-shrink-0 ${isScrolled ? 'mr-8' : ''}`}>
            <Link
              href="/"
              className={`font-bold relative group transition-all duration-300 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              }`}
            >
                <span className="relative z-20 bg-gradient-to-r from-green-500 via-green-400 to-green-500 bg-clip-text text-transparent hover:from-green-400 hover:via-green-300 hover:to-green-400 transition-all duration-300">
                Thallos
              </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-green-700/20 to-green-500/20 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300 z-10"></div>
            </Link>
            </div>

            {/* Navigation Items - Center */}
            <div className={`hidden md:flex items-center justify-center flex-1 ${isScrolled ? 'gap-x-6' : 'gap-x-8'}`}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-white/80 hover:text-white transition-all duration-300 font-medium relative group ${
                    isScrolled ? 'text-sm' : 'text-base'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute -inset-x-2 -inset-y-1 bg-white/5 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </Link>
              ))}
            </div>

            {/* Right Side - Auth Buttons */}
            <div className={`hidden md:flex items-center gap-3 flex-shrink-0 ${isScrolled ? 'ml-8' : ''}`}>
              {user ? (
                // Logged in - show user name and logout button
                <>
                  <Link
                    href="/profile"
                    className={`text-white/90 hover:text-green-400 font-medium transition-all duration-300 ${
                      isScrolled ? 'text-sm' : 'text-base'
                    }`}
                  >
                    {getUserDisplayName()}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`text-red-400 hover:text-red-300 font-medium transition-all duration-300 ${
                      isScrolled ? 'text-sm' : 'text-base'
                    }`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Not logged in - show Login and Sign Up buttons
                <>
                  <Link
                    href="/login"
                    className={`text-white/90 hover:text-white font-medium transition-all duration-300 ${
                      isScrolled ? 'text-sm' : 'text-base'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/login"
                    className={`bg-gradient-to-r from-green-800/80 to-green-700/80 backdrop-blur-xl border border-green-600/20 text-white hover:from-green-700/90 hover:to-green-600/90 transition-all duration-300 font-semibold rounded-full shadow-lg shadow-green-950/30 hover:shadow-green-950/50 hover:scale-105 relative group overflow-hidden ${
                      isScrolled
                        ? 'px-4 py-1.5 text-sm'
                        : 'px-5 py-2 text-base'
                    }`}
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-700 to-green-500 rounded-full opacity-20 group-hover:opacity-40 blur transition-all duration-300 -z-10"></div>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-green-500 transition-colors"
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
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/10 border-t border-white/20 backdrop-blur-2xl">
              <div className="px-6 py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white/80 hover:text-white transition-colors font-medium py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Auth Buttons */}
                {user ? (
                  <div className="border-t border-white/20 pt-4 space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <p className="text-white font-medium text-sm">{user.email}</p>
                      <p className="text-gray-400 text-xs">View Profile</p>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full text-center text-red-400 hover:text-red-300 transition-colors font-medium py-2"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  // Not logged in - show Login and Sign Up buttons
                  <div className="border-t border-white/20 pt-4 space-y-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center text-white/80 hover:text-white transition-colors font-medium py-2"
                    >
                      Login
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-center bg-gradient-to-r from-green-800/80 to-green-700/80 backdrop-blur-xl border border-green-600/20 text-white hover:from-green-700/90 hover:to-green-600/90 transition-all duration-300 font-semibold rounded-full py-3 px-6 shadow-lg shadow-green-950/30 hover:shadow-green-950/50"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </nav>
  );
}
