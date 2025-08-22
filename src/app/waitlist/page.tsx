"use client";

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function WaitlistPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    investmentExperience: '',
    portfolioSize: '',
    interest: '',
    features: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just simulate submission
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      investmentExperience: '',
      portfolioSize: '',
      interest: '',
      features: ''
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              Join the Alpha
            </h1>
            <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto">
              We&apos;re looking for institutional investors and DeFi enthusiasts who will actively give us feedback.
            </p>
          </div>

          {!isSubmitted ? (
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-3xl opacity-20 blur-xl"></div>
              
              {/* Form container */}
              <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl border border-purple-600/30 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-purple-900/20">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Name Field */}
                  <div className="space-y-3">
                    <label className="block text-white text-lg font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      required
                      className="w-full px-5 py-4 bg-black/60 border border-purple-700/40 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-lg"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-3">
                    <label className="block text-white text-lg font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      required
                      className="w-full px-5 py-4 bg-black/60 border border-purple-700/40 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-lg"
                    />
                  </div>

                  {/* Investment Experience */}
                  <div className="space-y-3">
                    <label className="block text-white text-lg font-medium">What&apos;s your investment experience level?</label>
                    <select
                      name="investmentExperience"
                      value={formData.investmentExperience}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-black/60 border border-purple-700/40 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-lg appearance-none cursor-pointer"
                    >
                      <option value="">Select your experience level</option>
                      <option value="beginner">Beginner (0-2 years)</option>
                      <option value="intermediate">Intermediate (2-5 years)</option>
                      <option value="advanced">Advanced (5-10 years)</option>
                      <option value="professional">Professional (10+ years)</option>
                      <option value="institutional">Institutional Manager</option>
                    </select>
                  </div>

                  {/* Portfolio Size */}
                  <div className="space-y-3">
                    <label className="block text-white text-lg font-medium">What&apos;s your typical portfolio allocation size?</label>
                    <select
                      name="portfolioSize"
                      value={formData.portfolioSize}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-black/60 border border-purple-700/40 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-lg appearance-none cursor-pointer"
                    >
                      <option value="">Select portfolio size</option>
                      <option value="under-10k">Under $10K</option>
                      <option value="10k-50k">$10K - $50K</option>
                      <option value="50k-250k">$50K - $250K</option>
                      <option value="250k-1m">$250K - $1M</option>
                      <option value="1m-10m">$1M - $10M</option>
                      <option value="over-10m">Over $10M</option>
                    </select>
                  </div>

                  {/* Interest Level */}
                  <div className="space-y-3">
                    <label className="block text-white text-lg font-medium">How interested are you in DeFi strategies?</label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-black/60 border border-purple-700/40 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-lg appearance-none cursor-pointer"
                    >
                      <option value="">Select your interest level</option>
                      <option value="very-interested">Very interested - ready to allocate</option>
                      <option value="interested">Interested - want to learn more</option>
                      <option value="curious">Curious - exploring options</option>
                      <option value="cautious">Cautious - need more information</option>
                    </select>
                  </div>

                  {/* Features Request */}
                  <div className="space-y-3">
                    <label className="block text-white text-lg font-medium">What features would you like to see in Thallos? (Optional)</label>
                    <textarea
                      name="features"
                      value={formData.features}
                      onChange={handleInputChange}
                      placeholder="Tell us about the features you'd like to see..."
                      rows={4}
                      className="w-full px-5 py-4 bg-black/60 border border-purple-700/40 rounded-2xl text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-lg"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold py-4 px-8 rounded-2xl hover:from-purple-500 hover:to-purple-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-900/30 text-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10">Join Alpha Program</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-purple-400 rounded-3xl opacity-30 blur-xl"></div>
                <div className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl border border-purple-600/30 rounded-3xl p-8 sm:p-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Welcome to the Alpha!</h2>
                  <p className="text-gray-400 text-lg mb-6">
                    Thank you for joining our alpha program. We&apos;ll be in touch soon with exclusive access and updates.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-300 underline"
                  >
                    Submit another application
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center pt-8">
            <Link
              href="/"
              className="text-gray-500 hover:text-purple-400 transition-colors duration-300 text-sm inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
