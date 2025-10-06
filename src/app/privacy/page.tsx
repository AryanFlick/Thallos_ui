"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DarkVeil from "@/components/DarkVeil";

export default function PrivacyPolicyPage() {
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
                Privacy Policy
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
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Introduction</h2>
                  <p className="text-gray-300 leading-relaxed">
                    At Thallos ("we," "our," or "us"), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our institutional DeFi platform and services.
                  </p>
                </section>

                {/* Information We Collect */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
                  <ul className="text-gray-300 space-y-2 mb-6">
                    <li>• Email address and contact information</li>
                    <li>• Name and professional details</li>
                    <li>• Wallet addresses and blockchain transaction data</li>
                    <li>• Investment preferences and portfolio information</li>
                    <li>• Communication preferences</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3">Technical Information</h3>
                  <ul className="text-gray-300 space-y-2 mb-6">
                    <li>• IP address and device information</li>
                    <li>• Browser type and version</li>
                    <li>• Usage patterns and analytics data</li>
                    <li>• Cookies and similar tracking technologies</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3">DeFi and Financial Data</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Portfolio holdings and performance data</li>
                    <li>• Transaction history and trading activity</li>
                    <li>• Risk assessment and strategy preferences</li>
                    <li>• Market data and analytics usage</li>
                  </ul>
                </section>

                {/* How We Use Information */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">How We Use Your Information</h2>
                  <ul className="text-gray-300 space-y-3">
                    <li>• <strong className="text-emerald-300">Service Delivery:</strong> Provide institutional-grade DeFi portfolio management and analytics</li>
                    <li>• <strong className="text-emerald-300">Personalization:</strong> Customize strategies and recommendations based on your portfolio</li>
                    <li>• <strong className="text-emerald-300">Security:</strong> Protect your account and prevent fraudulent activity</li>
                    <li>• <strong className="text-emerald-300">Communication:</strong> Send important updates, alerts, and service notifications</li>
                    <li>• <strong className="text-emerald-300">Analytics:</strong> Improve our platform and develop new features</li>
                    <li>• <strong className="text-emerald-300">Compliance:</strong> Meet regulatory requirements and legal obligations</li>
                  </ul>
                </section>

                {/* Information Sharing */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Information Sharing and Disclosure</h2>
                  <p className="text-gray-300 mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong className="text-emerald-300">Service Providers:</strong> Trusted third parties who assist in platform operations (data processing, security, analytics)</li>
                    <li>• <strong className="text-emerald-300">Legal Requirements:</strong> When required by law, court order, or regulatory authority</li>
                    <li>• <strong className="text-emerald-300">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                    <li>• <strong className="text-emerald-300">Consent:</strong> When you explicitly authorize us to share your information</li>
                    <li>• <strong className="text-emerald-300">Protection:</strong> To protect our rights, property, or safety, or that of our users</li>
                  </ul>
                </section>

                {/* Data Security */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Data Security</h2>
                  <p className="text-gray-300 mb-4">
                    We implement industry-standard security measures to protect your information:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• End-to-end encryption for sensitive data transmission</li>
                    <li>• Secure cloud infrastructure with enterprise-grade security</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Access controls and authentication protocols</li>
                    <li>• Zero-knowledge architecture for private keys and sensitive financial data</li>
                  </ul>
                </section>

                {/* Your Rights */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Your Rights and Choices</h2>
                  <p className="text-gray-300 mb-4">You have the following rights regarding your personal information:</p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong className="text-emerald-300">Access:</strong> Request a copy of your personal data</li>
                    <li>• <strong className="text-emerald-300">Correction:</strong> Update or correct inaccurate information</li>
                    <li>• <strong className="text-emerald-300">Deletion:</strong> Request deletion of your personal data</li>
                    <li>• <strong className="text-emerald-300">Portability:</strong> Export your data in a machine-readable format</li>
                    <li>• <strong className="text-emerald-300">Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li>• <strong className="text-emerald-300">Restriction:</strong> Limit how we process your information</li>
                  </ul>
                </section>

                {/* Cookies */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Cookies and Tracking Technologies</h2>
                  <p className="text-gray-300 mb-4">
                    We use cookies and similar technologies to enhance your experience:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong className="text-emerald-300">Essential Cookies:</strong> Required for platform functionality</li>
                    <li>• <strong className="text-emerald-300">Analytics Cookies:</strong> Help us understand usage patterns and improve our service</li>
                    <li>• <strong className="text-emerald-300">Preference Cookies:</strong> Remember your settings and preferences</li>
                    <li>• <strong className="text-emerald-300">Security Cookies:</strong> Protect against fraud and unauthorized access</li>
                  </ul>
                </section>

                {/* Third-Party Services */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Third-Party Services</h2>
                  <p className="text-gray-300 mb-4">
                    Our platform integrates with various DeFi protocols and services:
                  </p>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong className="text-emerald-300">Blockchain Networks:</strong> Ethereum, Polygon, Arbitrum, and other supported networks</li>
                    <li>• <strong className="text-emerald-300">DeFi Protocols:</strong> Aave, Compound, Uniswap, and other integrated protocols</li>
                    <li>• <strong className="text-emerald-300">Data Providers:</strong> CoinGecko, DeFiLlama, and other market data sources</li>
                    <li>• <strong className="text-emerald-300">Security Services:</strong> Multi-signature wallets and custody solutions</li>
                  </ul>
                </section>

                {/* International Transfers */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">International Data Transfers</h2>
                  <p className="text-gray-300">
                    Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws, including standard contractual clauses and adequacy decisions.
                  </p>
                </section>

                {/* Children's Privacy */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Children's Privacy</h2>
                  <p className="text-gray-300">
                    Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child, we will take steps to delete such information.
                  </p>
                </section>

                {/* Changes to Policy */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Changes to This Privacy Policy</h2>
                  <p className="text-gray-300">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-4">Contact Us</h2>
                  <p className="text-gray-300 mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6">
                    <p className="text-emerald-300 font-semibold mb-2">Thallos Privacy Team</p>
                    <p className="text-gray-300 mb-2">Email: privacy@thalloscapital.com</p>
                    <p className="text-gray-300 mb-2">Website: https://thallos-ui.vercel.app</p>
                    <p className="text-gray-300">Response time: Within 30 days</p>
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
