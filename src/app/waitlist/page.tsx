"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just simulate submission
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo/Brand */}
        <div>
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent hover:from-purple-300 hover:to-purple-200 transition-colors duration-300"
          >
            Thallos
          </Link>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Join the Waitlist
            </h1>
            <p className="text-gray-400 text-lg">
              Be the first to experience institutional-grade DeFi strategies.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 bg-gray-900/50 border border-purple-800/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600/80 to-purple-500/80 backdrop-blur-xl border border-purple-400/20 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-500/90 hover:to-purple-400/90 transition-all duration-300 hover:scale-105"
              >
                Join Waitlist
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-purple-950/30 border border-purple-700/30 rounded-lg">
                <p className="text-purple-200 font-medium">
                  ✓ Thank you for joining our waitlist!
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  We'll notify you when Thallos is ready.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-purple-400 hover:text-purple-300 transition-colors duration-300 text-sm underline"
              >
                Submit another email
              </button>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="pt-8">
          <Link
            href="/"
            className="text-gray-500 hover:text-purple-400 transition-colors duration-300 text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
