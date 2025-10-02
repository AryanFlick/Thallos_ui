"use client";

import { useState, useEffect, useRef } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Wallet, User as UserIcon, LogOut, ChevronDown } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserWallet {
  id: string;
  address: string;
  chain_id: number;
}

interface UserProfileDropdownProps {
  user: User;
  onSignOut: () => void;
}

const CHAIN_NAMES: Record<number, string> = {
  1: "Ethereum",
  137: "Polygon",
  10: "Optimism",
  42161: "Arbitrum",
  8453: "Base",
  11155111: "Sepolia",
};

export default function UserProfileDropdown({ user, onSignOut }: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchWallets();
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchWallets = async () => {
    setIsLoadingWallets(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      const response = await fetch("/api/wallets", {
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setWallets(result.wallets || []);
      }
    } catch (error) {
      console.error("Error fetching wallets:", error);
    } finally {
      setIsLoadingWallets(false);
    }
  };

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getUserDisplayName = () => {
    // Try to get name from user metadata, fallback to email
    return user.user_metadata?.name || user.email?.split("@")[0] || "User";
  };

  return (
    <div className="relative z-[120]" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group relative z-[120]"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-semibold">
          {getUserDisplayName().charAt(0).toUpperCase()}
        </div>
        <span className="text-white/90 text-sm font-medium hidden sm:block">
          {getUserDisplayName()}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-white/60 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-[130] animate-in fade-in slide-in-from-top-2 duration-200" style={{ position: 'absolute', isolation: 'isolate' }}>
          {/* User info section */}
          <div className="px-4 py-4 border-b border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-lg font-bold">
                {getUserDisplayName().charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-gray-400 text-sm truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Wallets section */}
          <div className="px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                Connected Wallets
              </h3>
              {wallets.length > 0 && (
                <span className="text-emerald-500 text-xs font-medium">
                  {wallets.length}
                </span>
              )}
            </div>

            {isLoadingWallets ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
              </div>
            ) : wallets.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {wallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <Wallet className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-mono truncate">
                        {shortenAddress(wallet.address)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {CHAIN_NAMES[wallet.chain_id] || `Chain ${wallet.chain_id}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <Wallet className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No wallets connected</p>
              </div>
            )}

            <Link
              href="/wallet"
              onClick={() => setIsOpen(false)}
              className="block mt-3 text-center text-emerald-500 hover:text-emerald-400 text-sm font-medium transition-colors"
            >
              Manage Wallets →
            </Link>
          </div>

          {/* Menu items */}
          <div className="py-2">
            <Link
              href="/wallet"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Account Settings</span>
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.7);
        }
      `}</style>
    </div>
  );
}

