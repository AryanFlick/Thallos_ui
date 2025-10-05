# Backend Integration Guide

This guide explains how to integrate the `backend/` LLM service with your main Thallos UI app.

---

## 🎯 Overview

**Current Architecture**:
```
Main App (Next.js)           Backend (Vercel Serverless)
├── src/app/chat/            ├── api/query.js (LLM service)
│   └── page.tsx             ├── config/llm_table_registry.json
├── src/app/api/             └── lib/ (auth, prompts, etc.)
│   ├── chat/
│   └── wallets/
```

**Goal**: Replace or enhance your current chat API with the backend LLM service.

---

## 📋 Prerequisites

1. ✅ Backend deployed to Vercel (separate project)
2. ✅ Backend environment variables configured
3. ✅ Supabase tables exist (or skip auth for now)
4. ✅ OpenAI API key set in backend

---

## 🔧 Step 1: Deploy Backend to Vercel

### Option A: Separate Vercel Project

```bash
cd /Users/aryan/Thallos_ui/backend
vercel deploy
```

**Environment Variables** (in Vercel dashboard):
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG...
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://your-main-app.vercel.app
```

**Result**: Backend deployed to `https://thallos-backend.vercel.app`

### Option B: Same Vercel Project (Monorepo)

If you want both in one project, you'd need to:
1. Move `backend/api/query.js` to `src/app/api/llm-query/route.ts`
2. Adapt the Vercel handler format to Next.js App Router format
3. Keep backend libs in `backend/lib/` and import them

**For simplicity, I recommend Option A (separate deployment).**

---

## 🔗 Step 2: Connect Frontend to Backend

### Update Your Chat Page

**File**: `src/app/chat/page.tsx`

Replace your current chat API call with:

```typescript
// Add environment variable for backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://thallos-backend.vercel.app';

// In your handleSendMessage function
const handleSendMessage = async () => {
  if (!input.trim() || !session) return;

  const userMessage = input.trim();
  setInput('');
  
  // Add user message to UI
  const newMessages = [
    ...messages,
    { id: Date.now(), content: userMessage, role: 'user' as const, timestamp: new Date() }
  ];
  setMessages(newMessages);
  setIsLoading(true);

  try {
    // 🔥 NEW: Call backend LLM service
    const response = await fetch(`${BACKEND_URL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`, // Pass Supabase JWT
      },
      body: JSON.stringify({
        question: userMessage,
        stream: false, // Set to true for streaming
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    
    // Add AI response to UI
    const aiMessage = {
      id: Date.now() + 1,
      content: data.answer || 'No answer generated',
      role: 'assistant' as const,
      timestamp: new Date(),
      metadata: {
        sql: data.sql,
        intent: data.intent,
        rows: data.rows?.length || 0,
      }
    };
    
    setMessages([...newMessages, aiMessage]);
    
    // Save conversation to Supabase (your existing code)
    await saveConversation([...newMessages, aiMessage]);

  } catch (error) {
    console.error('Error calling backend:', error);
    // Show error message to user
    const errorMessage = {
      id: Date.now() + 1,
      content: 'Sorry, there was an error processing your request. Please try again.',
      role: 'assistant' as const,
      timestamp: new Date(),
    };
    setMessages([...newMessages, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🌊 Step 3: Add Streaming Support (Optional)

For ChatGPT-style streaming responses:

```typescript
const handleSendMessage = async () => {
  // ... setup code ...

  try {
    const response = await fetch(`${BACKEND_URL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        question: userMessage,
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    // Create placeholder message
    const aiMessageId = Date.now() + 1;
    let aiContent = '';
    
    setMessages([...newMessages, {
      id: aiMessageId,
      content: aiContent,
      role: 'assistant' as const,
      timestamp: new Date(),
    }]);

    // Read Server-Sent Events stream
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.substring(6));
          
          if (data.type === 'answer_chunk') {
            aiContent += data.content;
            
            // Update message in real-time
            setMessages(prev => prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: aiContent }
                : msg
            ));
          }
          
          if (data.type === 'done') {
            console.log('Stream complete:', data);
          }
        }
      }
    }

  } catch (error) {
    console.error('Streaming error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🔒 Step 4: Authentication Flow

### Backend Auth Verification

The backend already has auth built-in (`lib/auth.js`). It:
1. Checks for `Authorization: Bearer <token>` header
2. Verifies JWT with Supabase
3. Returns `userId` if valid, `null` if not
4. Gracefully degrades if auth not configured

### Frontend Requirements

Just pass the Supabase session token:

```typescript
const { session } = useSession(); // Your existing auth hook

const response = await fetch(`${BACKEND_URL}/api/query`, {
  headers: {
    'Authorization': `Bearer ${session?.access_token}`,
    // ... other headers
  },
  // ... rest of request
});
```

---

## 📊 Step 5: Query Tracking (Optional)

The backend logs queries automatically if:
1. User is authenticated
2. Backend database tables exist

### Create Backend Tables

Run these SQL migrations in your Supabase SQL Editor:

```sql
-- Create user schema
CREATE SCHEMA IF NOT EXISTS user;

-- Users table
CREATE TABLE IF NOT EXISTS user.user (
  user_id UUID PRIMARY KEY,
  email VARCHAR(255),
  username VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Conversations table
CREATE TABLE IF NOT EXISTS user.conversations (
  conversation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user.user(user_id) ON DELETE CASCADE,
  title VARCHAR(500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Messages table
CREATE TABLE IF NOT EXISTS user.messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES user.conversations(conversation_id) ON DELETE CASCADE,
  user_id UUID REFERENCES user.user(user_id) ON DELETE CASCADE,
  role VARCHAR(50) CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user ON user.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON user.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON user.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON user.messages(created_at DESC);

-- Enable RLS
ALTER TABLE user.user ENABLE ROW LEVEL SECURITY;
ALTER TABLE user.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON user.user FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own conversations" ON user.conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own messages" ON user.messages FOR SELECT USING (auth.uid() = user_id);
```

---

## 🧪 Step 6: Testing

### 1. Test Backend Directly

```bash
curl -X POST https://thallos-backend.vercel.app/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the price of BTC?"}'
```

Expected response:
```json
{
  "sql": "SELECT ...",
  "rows": [...],
  "answer": "Bitcoin is currently trading at around $95,234...",
  "source": "database_query",
  "intent": "price_query"
}
```

### 2. Test from Frontend

Open your chat page and ask:
- "What are the best lending opportunities?"
- "Show me WETH-USDC pool rates"
- "What's the price of ETH?"

### 3. Check Backend Logs

```bash
vercel logs thallos-backend --follow
```

---

## 🎨 Step 7: UI Enhancements

### Show SQL Query (Optional)

```typescript
// In your message component
{message.role === 'assistant' && message.metadata?.sql && (
  <details className="mt-2 text-xs text-gray-500">
    <summary className="cursor-pointer hover:text-emerald-400">
      View SQL Query
    </summary>
    <pre className="mt-1 p-2 bg-gray-900 rounded overflow-x-auto">
      {message.metadata.sql}
    </pre>
  </details>
)}
```

### Show Query Intent

```typescript
{message.metadata?.intent && (
  <span className="inline-block px-2 py-1 text-xs bg-emerald-900/30 text-emerald-400 rounded">
    {message.metadata.intent}
  </span>
)}
```

### Show Data Metrics

```typescript
{message.metadata?.rows > 0 && (
  <span className="text-xs text-gray-500">
    Analyzed {message.metadata.rows} data points
  </span>
)}
```

---

## 🚨 Common Issues

### Issue: CORS Error

**Error**: `Access to fetch blocked by CORS policy`

**Fix**: Add your frontend URL to backend's allowed origins:

```javascript
// backend/api/query.js
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002', // ← Add your local port
  'https://your-app.vercel.app', // ← Add your production URL
  process.env.FRONTEND_URL
].filter(Boolean);
```

### Issue: 401 Unauthorized

**Error**: `Invalid or expired token`

**Fix**: Check that you're passing the correct Supabase token:

```typescript
console.log('Session token:', session?.access_token?.substring(0, 20));
```

### Issue: 500 Internal Server Error

**Check Backend Logs**:
```bash
vercel logs thallos-backend --follow
```

Common causes:
- Missing environment variables
- Database connection issues
- OpenAI API key invalid
- SQL query errors

---

## 📝 Environment Variables Summary

### Backend (Vercel Dashboard)

```
DATABASE_URL=postgresql://postgres.xxx:5432/postgres?sslmode=require
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJ...
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (`.env.local`)

```
NEXT_PUBLIC_BACKEND_URL=https://thallos-backend.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJ...
```

---

## 🎯 Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Set backend environment variables
3. ✅ Add `NEXT_PUBLIC_BACKEND_URL` to frontend
4. ✅ Update chat page to call backend
5. ✅ Test end-to-end flow
6. ✅ (Optional) Create backend database tables
7. ✅ (Optional) Add streaming support
8. ✅ (Optional) Show SQL queries in UI

---

## 🆘 Need Help?

- **Backend README**: `/Users/aryan/Thallos_ui/backend/BACKEND_OVERVIEW.md`
- **Conversation System**: `/Users/aryan/Thallos_ui/backend/conversations/README.md`
- **Example Code**: `/Users/aryan/Thallos_ui/backend/conversations/usage-example.js`

---

**Last Updated**: October 5, 2025

