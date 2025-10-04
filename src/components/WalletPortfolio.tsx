"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface WalletPortfolioProps {
  user: User;
}

export default function WalletPortfolio({ user }: WalletPortfolioProps) {
  const [hasWallet, setHasWallet] = useState(false);
  const [walletCount, setWalletCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkWallets = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch("/api/wallets", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const result = await response.json();

        if (response.ok && result.wallets) {
          setWalletCount(result.wallets.length);
          setHasWallet(result.wallets.length > 0);
        }
      } catch (error) {
        console.error("Error checking wallets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWallets();
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-4 border-t border-emerald-500/20">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-800 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-emerald-500/20 bg-gray-900/30">
      {hasWallet ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-400">Portfolio</h3>
            <span className="text-xs text-emerald-400 font-medium">{walletCount} {walletCount === 1 ? 'Wallet' : 'Wallets'}</span>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-500/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
              <p className="text-xs text-gray-400 font-medium">Connected Wallets</p>
            </div>
            <p className="text-sm text-emerald-300">
              Agent can now provide personalized insights based on your portfolio
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-400">Portfolio</h3>
          
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
              <p className="text-xs text-gray-400 font-medium">No Wallets Connected</p>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Connect a wallet for personalized DeFi insights and portfolio analysis
            </p>
            <a
              href="/profile"
              className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200"
            >
              Connect Wallet
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

