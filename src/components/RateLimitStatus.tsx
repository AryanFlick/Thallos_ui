"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface RateLimitStatusProps {
  user: User | null;
}

interface UsageStats {
  requestsToday: number;
  requestsThisHour: number;
  requestsThisMinute: number;
  dailyLimit: number;
  hourlyLimit: number;
  minuteLimit: number;
}

export default function RateLimitStatus({ user }: RateLimitStatusProps) {
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUsageStats = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const now = new Date();
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const hourStart = new Date(now.getTime() - 60 * 60 * 1000);
      const minuteStart = new Date(now.getTime() - 60 * 1000);

      // Get usage from Supabase
      const { data: todayRequests } = await supabase
        .from('user_api_usage')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', dayStart.toISOString());

      const { data: hourRequests } = await supabase
        .from('user_api_usage')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', hourStart.toISOString());

      const { data: minuteRequests } = await supabase
        .from('user_api_usage')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', minuteStart.toISOString());

      setUsage({
        requestsToday: todayRequests?.length || 0,
        requestsThisHour: hourRequests?.length || 0,
        requestsThisMinute: minuteRequests?.length || 0,
        dailyLimit: 1000, // Adjust based on your limits
        hourlyLimit: 100,
        minuteLimit: 30
      });
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsageStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchUsageStats, 30000);
    return () => clearInterval(interval);
  }, [user, fetchUsageStats]);

  if (!user || !usage) return null;

  const getUsageColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'text-red-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getProgressColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-purple-500';
  };

  return (
    <div className="p-4 border-t border-purple-800/30 bg-gray-900/50">
      <div className="text-xs text-gray-400 mb-3 flex items-center justify-between">
        <span>API Usage</span>
        {loading && (
          <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>
      
      <div className="space-y-3">
        {/* Minute Limit */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">This Minute</span>
            <span className={getUsageColor(usage.requestsThisMinute, usage.minuteLimit)}>
              {usage.requestsThisMinute}/{usage.minuteLimit}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(usage.requestsThisMinute, usage.minuteLimit)}`}
              style={{ width: `${Math.min((usage.requestsThisMinute / usage.minuteLimit) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Hour Limit */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">This Hour</span>
            <span className={getUsageColor(usage.requestsThisHour, usage.hourlyLimit)}>
              {usage.requestsThisHour}/{usage.hourlyLimit}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(usage.requestsThisHour, usage.hourlyLimit)}`}
              style={{ width: `${Math.min((usage.requestsThisHour / usage.hourlyLimit) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Daily Limit */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Today</span>
            <span className={getUsageColor(usage.requestsToday, usage.dailyLimit)}>
              {usage.requestsToday}/{usage.dailyLimit}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(usage.requestsToday, usage.dailyLimit)}`}
              style={{ width: `${Math.min((usage.requestsToday / usage.dailyLimit) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {usage.requestsThisMinute >= usage.minuteLimit * 0.8 && (
        <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-600/30 rounded-lg">
          <p className="text-xs text-yellow-400">
            ⚠️ Approaching rate limit. Please slow down your requests.
          </p>
        </div>
      )}
    </div>
  );
}
