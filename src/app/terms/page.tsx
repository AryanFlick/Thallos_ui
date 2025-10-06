"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DarkVeil from "@/components/DarkVeil";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Navbar />
      
      {/* DarkVeil Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <DarkVeil 
          speed={0.8}
          hueShift={140}
          noiseIntensity={0.02}
          warpAmount={0.1}
        />
      </div>
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-green-950/20 via-black/80 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-20 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-2xl border border-emerald-500/20 rounded-3xl p-8 md:p-12 shadow-2xl shadow-emerald-900/20"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-gray-400">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="space-y-8">
                
                {/* Introduction */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Agreement to Terms</h2>
                  <p className="text-gray-300 leading-relaxed">
                    These Terms of Service ("Terms") govern your use of Thallos, our institutional DeFi platform and services. By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access our services.
                  </p>
                </section>

                {/* Service Description */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Service Description</h2>
                  <p className="text-gray-300 mb-4">
                    Thallos provides institutional-grade DeFi portfolio management services, including:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Real-time DeFi market data and analytics</li>
                    <li>• Portfolio management and optimization tools</li>
                    <li>• Risk assessment and management strategies</li>
                    <li>• Integration with major DeFi protocols</li>
                    <li>• Professional-grade reporting and insights</li>
                    <li>• AI-powered market intelligence and recommendations</li>
                  </ul>
                </section>

                {/* Eligibility */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Eligibility and Account Requirements</h2>
                  <p className="text-gray-300 mb-4">To use our services, you must:</p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Be at least 18 years of age</li>
                    <li>• Have the legal capacity to enter into binding agreements</li>
                    <li>• Provide accurate and complete information</li>
                    <li>• Maintain the security of your account credentials</li>
                    <li>• Comply with all applicable laws and regulations</li>
                    <li>• Meet our institutional client requirements</li>
                  </ul>
                </section>

                {/* User Responsibilities */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">User Responsibilities</h2>
                  <p className="text-gray-300 mb-4">You agree to:</p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Use our services only for lawful purposes</li>
                    <li>• Not engage in any fraudulent or illegal activities</li>
                    <li>• Maintain the confidentiality of your account information</li>
                    <li>• Report any security breaches or suspicious activity</li>
                    <li>• Comply with all applicable DeFi and financial regulations</li>
                    <li>• Not attempt to reverse engineer or compromise our systems</li>
                  </ul>
                </section>

                {/* Investment Risks */}
                <section id="investment-risks">
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Investment Risks and Disclaimers</h2>
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-red-300 mb-3">⚠️ Important Risk Warning</h3>
                    <p className="text-gray-300 mb-4">
                      DeFi investments carry significant risks, including but not limited to:
                    </p>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Smart contract risks and potential exploits</li>
                      <li>• Market volatility and liquidity risks</li>
                      <li>• Regulatory changes and compliance risks</li>
                      <li>• Technology risks and network failures</li>
                      <li>• Loss of private keys and wallet access</li>
                      <li>• Impermanent loss in liquidity pools</li>
                    </ul>
                  </div>
                  <p className="text-gray-300">
                    Past performance does not guarantee future results. All investments involve risk, and you may lose some or all of your invested capital. You should carefully consider your investment objectives, level of experience, and risk appetite before making any investment decisions.
                  </p>
                </section>

                {/* Service Availability */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Service Availability</h2>
                  <p className="text-gray-300 mb-4">
                    While we strive to provide continuous service availability, we cannot guarantee:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Uninterrupted access to our platform</li>
                    <li>• Real-time data accuracy or completeness</li>
                    <li>• Compatibility with all devices or browsers</li>
                    <li>• Availability during maintenance periods</li>
                    <li>• Performance during high network congestion</li>
                  </ul>
                </section>

                {/* Intellectual Property */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Intellectual Property Rights</h2>
                  <p className="text-gray-300 mb-4">
                    All content, features, and functionality of our services are owned by Thallos and are protected by international copyright, trademark, and other intellectual property laws. You may not:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Copy, modify, or distribute our proprietary content</li>
                    <li>• Use our trademarks without written permission</li>
                    <li>• Reverse engineer our algorithms or strategies</li>
                    <li>• Create derivative works based on our services</li>
                    <li>• Remove or alter any proprietary notices</li>
                  </ul>
                </section>

                {/* Limitation of Liability */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Limitation of Liability</h2>
                  <p className="text-gray-300 mb-4">
                    To the maximum extent permitted by law, Thallos shall not be liable for:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Investment losses or portfolio performance</li>
                    <li>• Market volatility or economic conditions</li>
                    <li>• Third-party service interruptions</li>
                    <li>• User errors or security breaches</li>
                    <li>• Regulatory changes or compliance issues</li>
                    <li>• Indirect, incidental, or consequential damages</li>
                  </ul>
                </section>

                {/* Indemnification */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Indemnification</h2>
                  <p className="text-gray-300">
                    You agree to indemnify and hold harmless Thallos, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of our services, violation of these Terms, or infringement of any third-party rights.
                  </p>
                </section>

                {/* Termination */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Termination</h2>
                  <p className="text-gray-300 mb-4">
                    We may terminate or suspend your account at any time for:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Violation of these Terms of Service</li>
                    <li>• Fraudulent or illegal activity</li>
                    <li>• Non-payment of fees (if applicable)</li>
                    <li>• Extended periods of inactivity</li>
                    <li>• Regulatory or legal requirements</li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    You may terminate your account at any time by contacting our support team. Upon termination, your access to our services will cease, but certain provisions of these Terms will survive.
                  </p>
                </section>

                {/* Governing Law */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Governing Law and Dispute Resolution</h2>
                  <p className="text-gray-300">
                    These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to conflict of law principles. Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration in accordance with the rules of the [Arbitration Organization].
                  </p>
                </section>

                {/* Changes to Terms */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Changes to Terms</h2>
                  <p className="text-gray-300">
                    We reserve the right to modify these Terms at any time. We will notify you of any material changes by posting the updated Terms on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated Terms.
                  </p>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Contact Information</h2>
                  <p className="text-gray-300 mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
                    <p className="text-emerald-300 font-semibold mb-2">Thallos Legal Team</p>
                    <p className="text-gray-300 mb-2">Email: legal@thalloscapital.com</p>
                    <p className="text-gray-300 mb-2">Website: https://thallos-ui.vercel.app</p>
                    <p className="text-gray-300">Response time: Within 5 business days</p>
                  </div>
                </section>

              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-emerald-500/20">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link
                  href="/"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors duration-300 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Back to Home
                </Link>
                <p className="text-gray-500 text-sm">
                  © 2024 Thallos. All rights reserved.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
