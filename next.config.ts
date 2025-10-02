import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard configuration for Next.js 15
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  env: {
    // Provide defaults for build time
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  },
};

export default nextConfig;
