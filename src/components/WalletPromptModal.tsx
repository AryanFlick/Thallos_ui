"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { X } from "lucide-react";
import ConnectWallet from "./ConnectWallet";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface WalletPromptModalProps {
  userId: string;
  onClose: () => void;
}

export default function WalletPromptModal({ userId, onClose }: WalletPromptModalProps) {
  const [hasWallet, setHasWallet] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkWalletStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const checkWalletStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsChecking(false);
        return;
      }

      const response = await fetch("/api/wallets", {
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (response.ok && result.wallets && result.wallets.length > 0) {
        setHasWallet(true);
        // Auto-close if wallet is connected
        setTimeout(onClose, 500);
      }
    } catch (error) {
      console.error("Error checking wallet status:", error);
    } finally {
      setIsChecking(false);
    }
  };

  // Don't show if user already has a wallet
  if (hasWallet) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 z-10 p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors border border-gray-700"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/10 p-8">
          {isChecking ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent mb-4"></div>
              <p className="text-gray-400">Checking wallet status...</p>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  <svg
                    className="w-12 h-12 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white text-center mb-3">
                Connect Your Wallet
              </h2>

              {/* Description */}
              <p className="text-gray-400 text-center mb-8">
                To access DeFi protocols and get personalized insights, please connect at least one wallet to your account.
              </p>

              {/* Connect Wallet Button */}
              <div className="flex justify-center">
                <ConnectWallet />
              </div>

              {/* Skip option */}
              <div className="mt-6 text-center">
                <button
                  onClick={onClose}
                  className="text-sm text-gray-500 hover:text-gray-400 transition-colors underline"
                >
                  Skip for now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

