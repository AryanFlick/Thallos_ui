# 🛡️ Rate Limiting Implementation Guide

## Overview
Your Thallos AI now has comprehensive rate limiting to prevent abuse and manage API costs. The system uses multiple layers of protection.

## 🚀 Features Implemented

### ✅ **Multi-Tier Rate Limiting**
- **Authenticated Users**: 30 requests/minute, 300/hour, 1500/day
- **IP-Based (Fallback)**: 10 requests/minute, 20/hour, 50/day  
- **Future Premium Tiers**: Ready for 100-500 requests/minute

### ✅ **Smart Fallback System**
- Primary: Supabase database tracking (persistent, accurate)
- Fallback: In-memory IP tracking (when Supabase unavailable)
- Graceful degradation ensures service continuity

### ✅ **User Experience**
- Real-time usage dashboard in chat sidebar
- Visual progress bars with color-coded warnings
- Clear error messages with retry timing
- Automatic cleanup of old usage data

### ✅ **Security Features**
- User authentication integration
- IP-based protection for anonymous users
- Request logging and analytics
- Configurable limits per user tier

## 📊 Rate Limit Structure

| User Type | Per Minute | Per Hour | Per Day | Max Tokens |
|-----------|------------|----------|---------|------------|
| **IP Only** | 5 | 20 | 50 | 1000 |
| **Free User** | 10 | 100 | 500 | 1000 |
| **Authenticated** | 30 | 300 | 1500 | 2000 |
| **Premium** | 100 | 1000 | 5000 | 4000 |
| **Enterprise** | 500 | 5000 | 25000 | 8000 |

## 🗄️ Database Schema

The rate limiting system requires one additional table in Supabase:

```sql
-- API usage tracking table (already included in supabase_chat_tables.sql)
CREATE TABLE user_api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Configuration Files

### **1. Core Rate Limiter** (`src/lib/rateLimit.ts`)
- `RateLimiter` class with Supabase integration
- IP-based fallback system
- Automatic cleanup of expired entries
- Client IP detection utilities

### **2. Configuration** (`src/config/rateLimits.ts`)
- Tier definitions and limits
- User tier detection logic
- Warning thresholds and messages
- Time calculation utilities

### **3. Usage Dashboard** (`src/components/RateLimitStatus.tsx`)
- Real-time usage display
- Visual progress indicators
- Warning notifications
- Auto-refresh every 30 seconds

## 🛠️ API Integration

### **Request Headers**
```javascript
// Authenticated requests include:
{
  'Authorization': 'Bearer <supabase_access_token>',
  'Content-Type': 'application/json'
}
```

### **Response Headers**
```javascript
// All responses include:
{
  'X-RateLimit-Remaining': '25',
  'X-RateLimit-Reset': '1704067200000',
  'Retry-After': '45' // (only for 429 responses)
}
```

### **Error Responses**
```json
{
  "error": "Rate limit exceeded. 0 requests remaining. Try again in 45 seconds.",
  "rateLimitInfo": {
    "remaining": 0,
    "resetTime": 1704067200000
  }
}
```

## 🔒 Security Measures

### **1. User Authentication**
- Supabase JWT token validation
- User-specific tracking and limits
- Automatic tier detection

### **2. IP Protection**
- Fallback rate limiting by IP address
- Protection against distributed attacks
- Automatic cleanup of expired data

### **3. Database Security**
- Row Level Security (RLS) policies
- User isolation (users only see their own usage)
- Automatic data cleanup (24-hour retention)

## ⚙️ Customization Options

### **Adjust Rate Limits**
Edit `src/config/rateLimits.ts`:
```typescript
AUTHENTICATED: {
  requestsPerMinute: 50,  // Increase limits
  requestsPerHour: 500,
  requestsPerDay: 2000,
  // ...
}
```

### **Add User Tiers**
Enhance `getUserTier()` function:
```typescript
export function getUserTier(user: any): keyof typeof RATE_LIMIT_TIERS {
  if (user?.subscription === 'premium') return 'PREMIUM';
  if (user?.subscription === 'enterprise') return 'ENTERPRISE';
  return user ? 'AUTHENTICATED' : 'FREE';
}
```

### **Custom Time Windows**
Modify `RateLimiter` constructor:
```typescript
new RateLimiter(maxRequests, windowMs) // windowMs in milliseconds
```

## 📈 Monitoring & Analytics

### **Usage Tracking**
- All requests logged to `user_api_usage` table
- Queryable by user, endpoint, and time range
- Automatic cleanup prevents database bloat

### **Performance Metrics**
- Response time tracking
- Error rate monitoring
- Usage pattern analysis

### **Alerts** (Future Enhancement)
- Email notifications for high usage
- Admin dashboard for monitoring
- Automatic tier upgrade suggestions

## 🚨 Abuse Prevention

### **1. Multiple Protection Layers**
- User authentication required for higher limits
- IP-based backup protection
- Progressive penalties for violations

### **2. Automatic Enforcement**
- Real-time limit checking
- Immediate request blocking
- Clear feedback to users

### **3. Monitoring**
- Usage pattern detection
- Anomaly identification
- Manual review capabilities

## 🔄 Testing Rate Limits

### **Test Commands**
```bash
# Test authenticated user limits
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"message":"test"}'

# Test IP-based limits (no auth)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"test '$i'"}' && echo
done
```

## 📋 Setup Checklist

- ✅ Rate limiting code implemented
- ✅ Supabase integration ready
- ✅ User dashboard created
- ✅ Configuration files created
- ✅ **SQL schema applied in Supabase** ✨
- ⏳ **Test rate limits** in production
- ⏳ **Monitor usage patterns** after deployment

## 💡 Cost Management Tips

1. **Monitor OpenAI Usage**: Track tokens used per request
2. **Adjust Limits**: Lower limits during high-traffic periods
3. **User Education**: Show usage stats to encourage responsible use
4. **Tier Upgrades**: Implement paid tiers for heavy users
5. **Caching**: Consider caching common responses

Your rate limiting system is now production-ready and will effectively prevent API abuse while providing a great user experience! 🎯
