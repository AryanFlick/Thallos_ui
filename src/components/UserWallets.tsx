"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Trash2, Copy, ExternalLink } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserWallet {
  id: string;
  address: string;
  chain_id: number;
  created_at: string;
}

// Chain information
const CHAIN_INFO: Record<number, { name: string; explorer: string; color: string }> = {
  1: { name: "Ethereum", explorer: "https://etherscan.io", color: "bg-blue-500" },
  137: { name: "Polygon", explorer: "https://polygonscan.com", color: "bg-purple-500" },
  10: { name: "Optimism", explorer: "https://optimistic.etherscan.io", color: "bg-red-500" },
  42161: { name: "Arbitrum", explorer: "https://arbiscan.io", color: "bg-blue-600" },
  8453: { name: "Base", explorer: "https://basescan.org", color: "bg-indigo-500" },
  11155111: { name: "Sepolia", explorer: "https://sepolia.etherscan.io", color: "bg-gray-500" },
};

export default function UserWallets() {
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [removingWallet, setRemovingWallet] = useState<string>("");

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setError("Please log in to view your wallets");
        return;
      }

      // Fetch wallets from API
      const response = await fetch("/api/wallets", {
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setWallets(result.wallets);
      } else {
        setError(result.error || "Failed to fetch wallets");
      }
    } catch (error) {
      console.error("Error fetching wallets:", error);
      setError("Failed to fetch wallets");
    } finally {
      setIsLoading(false);
    }
  };

  const removeWallet = async (walletId: string) => {
    try {
      setRemovingWallet(walletId);

      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setError("Please log in to remove wallets");
        return;
      }

      const response = await fetch("/api/wallets", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ walletId }),
      });

      const result = await response.json();

      if (response.ok) {
        // Remove wallet from local state
        setWallets(prev => prev.filter(w => w.id !== walletId));
      } else {
        setError(result.error || "Failed to remove wallet");
      }
    } catch (error) {
      console.error("Error removing wallet:", error);
      setError("Failed to remove wallet");
    } finally {
      setRemovingWallet("");
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getChainInfo = (chainId: number) => {
    return CHAIN_INFO[chainId] || { 
      name: `Chain ${chainId}`, 
      explorer: "", 
      color: "bg-gray-500" 
    };
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Connected Wallets</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Connected Wallets</h3>
      
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-200 text-sm">
          {error}
        </div>
      )}

      {wallets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-2">No wallets connected</p>
          <p className="text-sm text-gray-500">Connect your first wallet to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wallets.map((wallet) => {
            const chainInfo = getChainInfo(wallet.chain_id);
            return (
              <div
                key={wallet.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center space-x-4">
                  {/* Chain indicator */}
                  <div
                    className={`w-3 h-3 rounded-full ${chainInfo.color}`}
                    title={chainInfo.name}
                  />
                  
                  {/* Wallet info */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-mono">
                        {shortenAddress(wallet.address)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(wallet.address)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copy address"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-400">
                      {chainInfo.name} • Connected {new Date(wallet.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Explorer link */}
                  {chainInfo.explorer && (
                    <a
                      href={`${chainInfo.explorer}/address/${wallet.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      title="View on explorer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {/* Remove button */}
                  <button
                    onClick={() => removeWallet(wallet.id)}
                    disabled={removingWallet === wallet.id}
                    className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Remove wallet"
                  >
                    {removingWallet === wallet.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


