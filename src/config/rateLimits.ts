// Rate limiting configuration for different user tiers

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  maxTokensPerRequest?: number;
  description: string;
}

export const RATE_LIMIT_TIERS: Record<string, RateLimitConfig> = {
  // Free tier users
  FREE: {
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 500,
    maxTokensPerRequest: 1000,
    description: 'Free tier - Basic usage limits'
  },
  
  // Authenticated users
  AUTHENTICATED: {
    requestsPerMinute: 30,
    requestsPerHour: 300,
    requestsPerDay: 1500,
    maxTokensPerRequest: 2000,
    description: 'Authenticated users - Standard limits'
  },
  
  // Premium users (for future implementation)
  PREMIUM: {
    requestsPerMinute: 100,
    requestsPerHour: 1000,
    requestsPerDay: 5000,
    maxTokensPerRequest: 4000,
    description: 'Premium tier - High usage limits'
  },
  
  // Enterprise users (for future implementation)
  ENTERPRISE: {
    requestsPerMinute: 500,
    requestsPerHour: 5000,
    requestsPerDay: 25000,
    maxTokensPerRequest: 8000,
    description: 'Enterprise tier - Maximum limits'
  }
};

// IP-based limits for unauthenticated users
export const IP_RATE_LIMITS = {
  requestsPerMinute: 5,
  requestsPerHour: 20,
  requestsPerDay: 50,
  description: 'IP-based limits for unauthenticated requests'
};

// Rate limit error messages
export const RATE_LIMIT_MESSAGES = {
  MINUTE_EXCEEDED: 'Too many requests in the last minute. Please wait before sending another message.',
  HOUR_EXCEEDED: 'Hourly request limit reached. Please try again next hour.',
  DAILY_EXCEEDED: 'Daily request limit reached. Please try again tomorrow.',
  UPGRADE_SUGGESTION: 'Consider upgrading your plan for higher limits.',
  CONTACT_SUPPORT: 'If you need higher limits, please contact our support team.'
};

// Function to get user's rate limit tier (can be enhanced with database lookup)
export function getUserTier(user: { email?: string } | null): keyof typeof RATE_LIMIT_TIERS {
  if (!user) return 'FREE';
  
  // Add logic here to determine user tier based on subscription, etc.
  // For now, all authenticated users get AUTHENTICATED tier
  return 'AUTHENTICATED';
}

// Function to check if user needs to be warned about approaching limits
export function shouldWarnUser(current: number, limit: number, threshold: number = 0.8): boolean {
  return current >= limit * threshold;
}

// Function to calculate time until reset
export function getTimeUntilReset(resetTime: number): string {
  const now = Date.now();
  const diff = resetTime - now;
  
  if (diff <= 0) return 'now';
  
  const seconds = Math.ceil(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}
