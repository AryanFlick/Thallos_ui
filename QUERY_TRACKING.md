# Query Tracking & Subscription System

## Overview
The system tracks user queries to enforce monthly limits (15 for free users, unlimited for Pro).

## How Query Tracking Works

### 1. Query Counting
- **Location**: `/src/app/api/chat/route.ts`
- **Timing**: Queries are tracked ONLY after successful OpenAI responses
- **Table**: `user_api_usage` in Supabase

### 2. Monthly Limit Check (Before API Call)
```typescript
// Check if user has exceeded 15 queries this month
- Counts queries from start of current month
- Free users: 15 queries/month
- Pro users: Unlimited (skip check)
```

### 3. Query Recording (After Successful Response)
```typescript
// Only tracked if OpenAI responds successfully
await supabase.from('user_api_usage').insert({
  user_id: userId,
  endpoint: '/api/chat',
  method: 'POST',
  status_code: 200,
  created_at: new Date().toISOString()
});
```

**Why after the response?**
- Prevents counting failed API calls
- User only charged for successful queries
- More accurate usage metrics

## Chat History Storage

### Database Schema (Supabase)

**conversations table:**
```sql
id: UUID (auto-generated)
user_id: UUID (references auth.users)
title: TEXT (first 50 chars of first message)
created_at: TIMESTAMPTZ
updated_at: TIMESTAMPTZ (auto-updates on new messages)
```

**messages table:**
```sql
id: UUID (auto-generated)
conversation_id: UUID (references conversations)
content: TEXT (message content)
is_user: BOOLEAN (true for user, false for AI)
created_at: TIMESTAMPTZ
```

### How Conversations Work

**Starting a New Chat:**
1. User clicks "New Chat" → clears messages, resets conversation ID
2. User sends first message → creates new conversation in database
3. Conversation appears in sidebar with title

**Continuing a Chat:**
1. Each new message pair (user + AI) is saved to `messages` table
2. Conversation's `updated_at` timestamp is automatically updated (via trigger)
3. Messages accumulate in the database

**Loading Past Chats:**
1. User clicks conversation in sidebar
2. System queries: `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC`
3. All messages load and display in order
4. User can continue the conversation

## Subscription Plans

### Free Plan
- 15 queries per month
- Resets on the 1st of each month
- Full access to all features (just limited queries)

### Pro Plan ($19/month)
- Unlimited queries
- No monthly reset needed
- Checked via `user_subscriptions` table:
  ```sql
  status = 'active' AND plan = 'pro'
  ```

## API Endpoints

### `/api/chat` (POST)
**Flow:**
1. ✅ Authenticate user
2. ✅ Check monthly query limit (free users only)
3. ✅ Check rate limits (30/min for auth users)
4. ✅ Call OpenAI API
5. ✅ Track successful query in `user_api_usage`
6. ✅ Return response

### `/api/check-query-limit` (GET)
**Returns:**
```json
{
  "queriesUsed": 5,
  "monthlyLimit": 15,
  "plan": "free",
  "canQuery": true
}
```

## Monitoring Query Usage

### For Users (Profile Page)
- View queries used this month
- See monthly limit
- Progress bar showing usage
- Warning at 80% (12/15 queries)
- Upgrade prompt when limit reached

### For Developers (Supabase Dashboard)
```sql
-- Check total queries this month
SELECT COUNT(*) FROM user_api_usage 
WHERE user_id = 'user-uuid-here' 
AND created_at >= date_trunc('month', CURRENT_DATE);

-- See query history
SELECT * FROM user_api_usage 
WHERE user_id = 'user-uuid-here' 
ORDER BY created_at DESC 
LIMIT 50;

-- Check all conversations for a user
SELECT * FROM conversations 
WHERE user_id = 'user-uuid-here' 
ORDER BY updated_at DESC;

-- See messages in a conversation
SELECT * FROM messages 
WHERE conversation_id = 'conversation-uuid-here' 
ORDER BY created_at ASC;
```

## Testing the System

### Test Query Limits
1. Log in with a test account
2. Make 15 queries
3. Try to make the 16th query → should see limit error
4. Go to Profile → Billing to see usage

### Test Chat History
1. Start a new chat
2. Send 3-4 messages back and forth
3. Click "New Chat"
4. Previous chat should appear in sidebar
5. Click on previous chat → should load all messages
6. Continue the conversation → new messages should be appended

### Test Stripe Upgrade (After Setup)
1. Reach query limit
2. Click "Upgrade to Pro"
3. Complete Stripe checkout (use test card: 4242 4242 4242 4242)
4. Should redirect back to profile
5. Subscription should show as "Pro"
6. No query limits should apply

## Current Status

✅ **Working:**
- Query tracking after successful responses
- Monthly limit enforcement for free users
- Pro user unlimited access
- Chat history storage and loading
- Conversation grouping (like ChatGPT)
- Rate limiting (IP and user-based)

⚠️ **Needs Setup:**
- Stripe Price ID (see STRIPE_SETUP.md)
- Webhook endpoint for automatic subscription updates (optional)

## Database Migrations

All required migrations are in `/supabase_migrations/`:
1. `001_create_user_wallets_table.sql` - Wallet storage
2. `002_create_conversations_and_messages.sql` - Chat history
3. `003_create_user_subscriptions_table.sql` - Subscriptions & API usage

Run these in your Supabase SQL Editor in order.

