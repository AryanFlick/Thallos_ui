"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import ConnectWallet from "@/components/ConnectWallet";
import UserWallets from "@/components/UserWallets";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface APIUsageData {
  queriesThisMonth: number;
  monthlyLimit: number;
  plan: 'free' | 'pro';
}

interface BillingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  queriesPerMonth: number;
}

const billingPlans: BillingPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: [
      "15 queries per month",
      "Basic support",
      "1 connected wallet",
      "Standard response time"
    ],
    queriesPerMonth: 15
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    features: [
      "Unlimited queries",
      "Priority support",
      "Unlimited wallets",
      "Advanced analytics",
      "Faster response time",
      "API access"
    ],
    queriesPerMonth: -1 // -1 means unlimited
  }
];

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"profile" | "wallets" | "usage" | "billing">("profile");
  const [apiUsage, setApiUsage] = useState<APIUsageData>({
    queriesThisMonth: 0,
    monthlyLimit: 15,
    plan: 'free'
  });
  const [currentPlan, setCurrentPlan] = useState("free");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();

  const fetchAPIUsage = async (userId: string) => {
    try {
      // Get current month start date
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Check subscription status
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      const isPro = subscription?.status === 'active' && subscription?.plan === 'pro';

      // Count queries this month
      const { data: queries, error } = await supabase
        .from('user_api_usage')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString());

      if (error) {
        console.error('Error fetching API usage:', error);
        // Use default values on error
        setApiUsage({
          queriesThisMonth: 0,
          monthlyLimit: isPro ? -1 : 15,
          plan: isPro ? 'pro' : 'free'
        });
        setCurrentPlan(isPro ? 'pro' : 'free');
        return;
      }

      const queryCount = queries?.length || 0;

      setApiUsage({
        queriesThisMonth: queryCount,
        monthlyLimit: isPro ? -1 : 15,
        plan: isPro ? 'pro' : 'free'
      });
      setCurrentPlan(isPro ? 'pro' : 'free');
    } catch (error) {
      console.error('Error in fetchAPIUsage:', error);
      // Set default values on error
      setApiUsage({
        queriesThisMonth: 0,
        monthlyLimit: 15,
        plan: 'free'
      });
    }
  };

  const checkUser = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.push('/login');
        return;
      }

      setUser(session.user);
      
      // Fetch actual usage data from backend
      await fetchAPIUsage(session.user.id);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, checkUser]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleUpgrade = async () => {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          // Note: You need to create a Stripe product first
        // For now, we'll handle this without a specific price ID
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data);
        // Show helpful error message
        if (data.error === 'Stripe product not configured') {
          alert('⚠️ Stripe Setup Required\n\n' +
                'To enable subscriptions, you need to:\n' +
                '1. Create a product in Stripe Dashboard\n' +
                '2. Add STRIPE_PRICE_ID to your .env.local file\n\n' +
                'See the Stripe setup instructions in your project.');
        } else {
          alert(`Failed to start checkout: ${data.message || data.error || 'Please try again'}`);
        }
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const sidebarItems = [
    { id: "profile", label: "Profile", icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: "wallets", label: "Wallets", icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )},
    { id: "usage", label: "API Usage", icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: "billing", label: "Billing", icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )}
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-lg font-bold">Account Settings</h2>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Desktop Sidebar */}
        <div className="w-64 mr-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Account Settings</h2>
            
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as "profile" | "wallets" | "usage" | "billing")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="flex-1">
          <ProfileContent activeSection={activeSection} user={user} apiUsage={apiUsage} currentPlan={currentPlan} handleUpgrade={handleUpgrade} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed top-0 left-0 bottom-0 w-72 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 z-50 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Menu</h2>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id as "profile" | "wallets" | "usage" | "billing");
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="pt-16 px-4 pb-8">
          <ProfileContent activeSection={activeSection} user={user} apiUsage={apiUsage} currentPlan={currentPlan} handleUpgrade={handleUpgrade} />
        </div>
      </div>
    </div>
  );
}

// Separate component for profile content to avoid duplication
interface ProfileContentProps {
  activeSection: "profile" | "wallets" | "usage" | "billing";
  user: User;
  apiUsage: APIUsageData;
  currentPlan: string;
  handleUpgrade: () => void;
}

function ProfileContent({ activeSection, user, apiUsage, currentPlan, handleUpgrade }: ProfileContentProps) {
  return (
    <>
      {/* Profile Section */}
      {activeSection === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl lg:text-2xl font-bold mb-6">Profile Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email Address
                </label>
                <div className="p-3 bg-black/50 border border-gray-700 rounded-lg text-sm lg:text-base break-all">
                  {user.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  User ID
                </label>
                <div className="p-3 bg-black/50 border border-gray-700 rounded-lg font-mono text-xs lg:text-sm break-all">
                  {user.id}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Account Created
                </label>
                <div className="p-3 bg-black/50 border border-gray-700 rounded-lg text-sm lg:text-base">
                  {new Date(user.created_at || '').toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Wallets Section */}
      {activeSection === "wallets" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl lg:text-2xl font-bold mb-6">Connected Wallets</h2>
            
            <div className="mb-6">
              <ConnectWallet />
            </div>
            
            <UserWallets />
          </div>
        </motion.div>
      )}

      {/* API Usage Section */}
      {activeSection === "usage" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl lg:text-2xl font-bold mb-6">API Usage</h2>
            
            {/* Monthly Usage Overview */}
            <div className="bg-black/50 border border-gray-700 rounded-lg p-4 lg:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                <div>
                  <h3 className="text-base lg:text-lg font-semibold">Monthly Queries</h3>
                  <p className="text-gray-400 text-xs lg:text-sm mt-1">
                    {apiUsage.plan === 'free' 
                      ? `${apiUsage.queriesThisMonth} of ${apiUsage.monthlyLimit} queries used`
                      : 'Unlimited queries with Pro plan'
                    }
                  </p>
                </div>
                {apiUsage.plan === 'free' && (
                  <div className="text-left sm:text-right">
                    <p className="text-xl lg:text-2xl font-bold text-emerald-400">
                      {apiUsage.monthlyLimit - apiUsage.queriesThisMonth}
                    </p>
                    <p className="text-xs lg:text-sm text-gray-400">remaining</p>
                  </div>
                )}
              </div>
              
              {apiUsage.plan === 'free' && (
                <>
                  <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
                    <div 
                      className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(apiUsage.queriesThisMonth / apiUsage.monthlyLimit) * 100}%` }}
                    />
                  </div>
                  
                  {apiUsage.queriesThisMonth >= apiUsage.monthlyLimit * 0.8 && (
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 lg:p-4">
                      <p className="text-yellow-400 text-xs lg:text-sm">
                        You&apos;re approaching your monthly query limit. Upgrade to Pro for unlimited queries.
                      </p>
                      <button
                        onClick={handleUpgrade}
                        className="mt-3 px-3 py-1.5 lg:px-4 lg:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-200 text-xs lg:text-sm font-medium"
                      >
                        Upgrade to Pro
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Usage Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-black/50 border border-gray-700 rounded-lg p-3 lg:p-4">
                <p className="text-gray-400 text-xs lg:text-sm">Total Queries</p>
                <p className="text-xl lg:text-2xl font-bold mt-1">{apiUsage.queriesThisMonth}</p>
              </div>
              <div className="bg-black/50 border border-gray-700 rounded-lg p-3 lg:p-4">
                <p className="text-gray-400 text-xs lg:text-sm">Current Plan</p>
                <p className="text-xl lg:text-2xl font-bold mt-1 capitalize">{apiUsage.plan}</p>
              </div>
              <div className="bg-black/50 border border-gray-700 rounded-lg p-3 lg:p-4">
                <p className="text-gray-400 text-xs lg:text-sm">Reset Date</p>
                <p className="text-lg lg:text-2xl font-bold mt-1">
                  {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Billing Section */}
      {activeSection === "billing" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Current Plan */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl lg:text-2xl font-bold mb-4">Current Plan</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-2xl lg:text-3xl font-bold capitalize">{currentPlan}</span>
                <p className="text-gray-400 mt-2 text-sm lg:text-base">
                  {currentPlan === "free" 
                    ? "You have 15 queries per month. Upgrade to Pro for unlimited access."
                    : "You have unlimited queries with the Pro plan."
                  }
                </p>
              </div>
              {currentPlan === "pro" && (
                <button className="px-4 py-2 lg:px-6 lg:py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm lg:text-base">
                  Manage Subscription
                </button>
              )}
            </div>
          </div>

          {/* Available Plans */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {billingPlans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                className={`bg-gray-900/50 backdrop-blur-sm border rounded-xl p-6 lg:p-8 ${
                  currentPlan === plan.id ? "border-emerald-500" : "border-gray-800"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline">
                    <span className="text-4xl lg:text-5xl font-bold">${plan.price}</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-sm lg:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={currentPlan !== plan.id ? handleUpgrade : undefined}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 text-sm lg:text-base ${
                    currentPlan === plan.id
                      ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                      : plan.id === "pro"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? "Current Plan" : "Choose Plan"}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 lg:p-8">
            <h2 className="text-xl lg:text-2xl font-bold mb-6">Payment Methods</h2>
            <div className="space-y-4">
              <button className="w-full p-4 bg-black/50 hover:bg-black/70 border border-gray-700 rounded-lg text-left transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <div>
                      <div className="font-medium text-sm lg:text-base">Add Payment Method</div>
                      <div className="text-xs lg:text-sm text-gray-400">Add a credit card or debit card</div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}