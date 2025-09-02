import { supabase } from '@/lib/supabase';

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  identifier: string;
  type: 'user' | 'ip';
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
  message?: string;
}

// In-memory rate limiting for IP addresses (fallback)
const ipLimits = new Map<string, { count: number; resetTime: number }>();

export class RateLimiter {
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 20, windowMs: number = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async checkLimit(options: RateLimitOptions): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (options.type === 'user') {
      return this.checkUserLimit(options.identifier, windowStart, now);
    } else {
      return this.checkIPLimit(options.identifier, windowStart, now);
    }
  }

  private async checkUserLimit(userId: string, windowStart: number, now: number): Promise<RateLimitResult> {
    try {
      // Get user's requests in the current window from Supabase
      const { data: requests, error } = await supabase
        .from('user_api_usage')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(windowStart).toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Failed to check Supabase rate limit, falling back to IP limit');
        return this.checkIPLimit(userId, windowStart, now);
      }

      const requestCount = requests?.length || 0;
      const remaining = Math.max(0, this.maxRequests - requestCount);

      if (requestCount >= this.maxRequests) {
        return {
          success: false,
          remaining: 0,
          resetTime: windowStart + this.windowMs,
          message: `Rate limit exceeded. You can make ${this.maxRequests} requests per minute. Try again in ${Math.ceil((windowStart + this.windowMs - now) / 1000)} seconds.`
        };
      }

      // Log this request
      await supabase
        .from('user_api_usage')
        .insert({
          user_id: userId,
          endpoint: '/api/chat',
          created_at: new Date().toISOString()
        });

      return {
        success: true,
        remaining,
        resetTime: windowStart + this.windowMs
      };

    } catch (error) {
      console.warn('Rate limit check failed, allowing request:', error);
      return {
        success: true,
        remaining: this.maxRequests,
        resetTime: now + this.windowMs
      };
    }
  }

  private checkIPLimit(ip: string, windowStart: number, now: number): RateLimitResult {
    const existing = ipLimits.get(ip);
    
    // Clean expired entries
    if (existing && existing.resetTime < now) {
      ipLimits.delete(ip);
    }

    const current = ipLimits.get(ip) || { count: 0, resetTime: now + this.windowMs };
    
    if (current.count >= this.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetTime: current.resetTime,
        message: `Rate limit exceeded. Maximum ${this.maxRequests} requests per minute. Try again in ${Math.ceil((current.resetTime - now) / 1000)} seconds.`
      };
    }

    // Increment count
    current.count++;
    ipLimits.set(ip, current);

    return {
      success: true,
      remaining: this.maxRequests - current.count,
      resetTime: current.resetTime
    };
  }

  // Clean up expired IP entries periodically
  static cleanupExpiredEntries() {
    const now = Date.now();
    for (const [ip, data] of ipLimits.entries()) {
      if (data.resetTime < now) {
        ipLimits.delete(ip);
      }
    }
  }
}

// Utility function to get client IP
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  return 'unknown';
}

// Different rate limit configurations
export const RATE_LIMITS = {
  // Authenticated users get higher limits
  AUTHENTICATED_USER: new RateLimiter(30, 60 * 1000), // 30 requests per minute
  
  // IP-based limits for fallback
  IP_BASED: new RateLimiter(10, 60 * 1000), // 10 requests per minute per IP
  
  // Premium users (if you add tiers later)
  PREMIUM_USER: new RateLimiter(100, 60 * 1000), // 100 requests per minute
};

// Cleanup expired entries every 5 minutes
setInterval(() => {
  RateLimiter.cleanupExpiredEntries();
}, 5 * 60 * 1000);
