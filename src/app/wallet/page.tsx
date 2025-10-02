"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import ConnectWallet from "@/components/ConnectWallet";
import UserWallets from "@/components/UserWallets";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WalletPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkUser = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/login');
        return;
      }

      setUser(session.user);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, checkUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Wallet Management</h1>
          <p className="text-gray-400 text-lg">
            Connect and manage your crypto wallets securely
          </p>
        </div>

        {/* User Info */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-2">
            <p className="text-gray-300">
              <span className="text-gray-500">Email:</span> {user.email}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-500">User ID:</span> {user.id}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-500">Joined:</span> {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Connect Wallet Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Connect New Wallet</h2>
          <p className="text-gray-400 mb-6">
            Connect your crypto wallets to access DeFi protocols and manage your portfolio.
          </p>
          <ConnectWallet />
        </div>

        {/* Connected Wallets */}
        <UserWallets />

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
          <h3 className="text-yellow-400 font-semibold mb-2">🔒 Security Notice</h3>
          <p className="text-yellow-200 text-sm">
            Your wallet addresses are stored securely and are only visible to you. 
            We never store your private keys or have access to your funds.
          </p>
        </div>
      </div>
    </div>
  );
}
