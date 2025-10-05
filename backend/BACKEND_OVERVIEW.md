# Backend Overview - Thallos LLM Service

## 📋 Summary

This is a **DeFi-focused LLM backend service** that:
- Generates SQL queries from natural language questions about DeFi data
- Executes queries against a PostgreSQL database with lending, pool, and price data
- Uses GPT-4.1 for query planning and answer generation
- Tracks user queries and conversations
- Deployed as Vercel serverless functions

---

## 🏗️ Architecture

```
┌─────────────────┐
│  Frontend       │
│  (Thallos UI)   │
└────────┬────────┘
         │ HTTP POST /api/query
         │ { question: "..." }
         │
         ▼
┌─────────────────────────────────────────┐
│  Backend API (api/query.js)             │
│  ┌─────────────────────────────────┐   │
│  │ 1. Auth Verification (optional) │   │
│  │ 2. Scope Detection              │   │
│  │ 3. LLM Query Planning           │   │
│  │ 4. SQL Execution                │   │
│  │ 5. Answer Generation            │   │
│  │ 6. Query Logging                │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│  PostgreSQL DB  │     │  OpenAI API  │
│  (Supabase)     │     │  (GPT-4.1)   │
└─────────────────┘     └──────────────┘
```

---

## 📁 File Structure

```
backend/
├── api/
│   └── query.js                      # Main API endpoint
├── config/
│   └── llm_table_registry.json       # Database schema registry
├── conversations/
│   ├── conversation-manager.js       # High-level conversation utilities
│   ├── db-queries.js                 # SQL query templates
│   ├── README.md                     # Documentation
│   ├── CONTEXT_INTEGRATION_GUIDE.md
│   ├── SETUP_COMPLETE.md
│   └── usage-example.js              # Usage examples
├── lib/
│   ├── auth.js                       # Supabase JWT verification
│   ├── guard.js                      # SQL query safety/validation
│   ├── instructions.js               # LLM prompts & query planning
│   ├── query-logger.js               # Query logging to DB
│   └── schema.js                     # Schema doc builder
├── public/
│   └── index.html                    # API landing page
├── scripts/
│   └── local-api.mjs                 # Local development server
├── package.json
└── .gitignore
```

---

## 🔑 Key Components

### 1. **API Endpoint** (`api/query.js`)

**Main Handler**: Processes natural language questions and returns structured answers.

**Request Format**:
```json
{
  "question": "What are the best lending opportunities?",
  "minimal": false,
  "stream": false,
  "presentationHint": null
}
```

**Response Format**:
```json
{
  "sql": "SELECT ...",
  "rows": [...],
  "answer": "Best USDC Lending Right Now...",
  "source": "database_query",
  "intent": "lending_opportunities",
  "retryCount": 0
}
```

**Key Features**:
- ✅ **CORS support** for frontend access
- ✅ **Authentication** via Supabase JWT (optional)
- ✅ **Smart retry system** (up to 3 attempts with progressive learning)
- ✅ **Streaming support** (Server-Sent Events)
- ✅ **Query timeout** (30s default)
- ✅ **Connection pooling** (10 max connections)

---

### 2. **Database Schema Registry** (`config/llm_table_registry.json`)

**Purpose**: Tells the LLM what tables/columns are available and what they contain.

**Structure**:
```json
{
  "update.lending_market_history": {
    "description": "Live lending market data with REAL-TIME supply and borrow APY data",
    "record_count": 12000,
    "update_frequency": "Every 30 minutes to 1 hour",
    "columns": {
      "symbol": "Asset symbol (USDC, ETH, WBTC, etc.)",
      "project": "DeFi protocol name (aave-v3, compound, etc.)",
      "chain": "Blockchain network",
      "apy_base_supply": "Current base supply APY",
      ...
    }
  },
  ...
}
```

**Schemas**:
- **`update.*`**: Live/recent data (5-60 min updates) ← **Default**
- **`clean.*`**: Historical archive data (for trends/backtesting)

**Tables**:
- `update.token_price_daily` - Real-time token prices
- `update.lending_market_history` - Live lending rates
- `update.cl_pool_hist` - Live pool APYs
- `clean.token_price_daily_enriched` - Historical prices
- `clean.lending_market_history` - Lending history
- `clean.cl_pool_hist` - Pool history

---

### 3. **LLM Instructions** (`lib/instructions.js`)

**Core Logic**: Converts natural language → SQL → Natural language answer

**Key Functions**:

#### `isQuestionInDataScope(question)`
Determines if question is about DeFi data or general knowledge.
```javascript
// Returns: true, false, or 'meta'
const inScope = await isQuestionInDataScope("What are the best lending rates?");
// → true (query database)

const inScope = await isQuestionInDataScope("What is blockchain?");
// → false (use general knowledge)
```

#### `planQuery(openai, question, doc, intent)`
Generates SQL query from natural language.
```javascript
const result = await planQuery(openai, "What are the best USDC pools?", null, 'pool_analysis');
// → { sql: "WITH max_ts AS (...) SELECT ..." }
```

#### `generateAnswerFromResults(openai, question, rows, presentationHint, intent, retryCount, stream)`
Converts SQL results into natural language answer.
```javascript
const answer = await generateAnswerFromResults(openai, question, rows, null, 'lending_opportunities', 0, false);
// → "Best USDC Lending Right Now (as of October 5, 2025)..."
```

**Smart Features**:
- **Schema Filtering**: Only shows LLM relevant tables for the question
- **Intent Detection**: Identifies query type (lending, pool, price, etc.)
- **Error Learning**: Improves query on retries based on specific error type
- **Data Quality Filters**: Removes stale data, applies confidence checks

---

### 4. **Authentication** (`lib/auth.js`)

**Purpose**: Verify Supabase JWT tokens to identify users.

```javascript
const userId = await verifyAuthToken(req);
// → "uuid-string" if valid
// → null if invalid/missing (graceful degradation)
```

**Environment Variables Required**:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

---

### 5. **Query Logger** (`lib/query-logger.js`)

**Purpose**: Track user queries for analysis and debugging.

```javascript
await logQuery(userId, question, answer, { intent, sql, rows: rows.length });
```

**Database Tables** (not yet created in your Supabase):
- `user.user` - User records
- `user.messages` - Query history

---

### 6. **Conversation Manager** (`conversations/`)

**Purpose**: Manage multi-turn conversations (ChatGPT-style).

**Key Capabilities**:
- Create/retrieve conversations
- Add user/assistant messages
- Format conversation history for LLM
- Truncate long histories for token limits

**Example**:
```javascript
import { safeQueries, formatMessagesForLLM } from './conversation-manager.js';

// Create conversation
const createSQL = safeQueries.createConversation(userId, 'Chat about DeFi');
const { conversation_id } = await executeSQL(createSQL);

// Add message
const addSQL = safeQueries.addMessage(conversation_id, userId, 'user', 'Show me lending rates');
await executeSQL(addSQL);

// Get history
const messages = await getConversationMessages(conversation_id);
const formatted = formatMessagesForLLM(messages);
```

---

## 🔧 Configuration

### Required Environment Variables

```bash
# Database (Supabase)
DATABASE_URL=postgresql://user:pass@host:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...

# OpenAI
OPENAI_API_KEY=sk-...

# Optional
DB_QUERY_TIMEOUT_MS=30000
FRONTEND_URL=https://your-frontend.com
LLM_TABLE_REGISTRY_PATH=/custom/path/to/registry.json
```

### Local Development

```bash
cd backend
npm install

# Start local server (http://localhost:3000)
npm run dev:local

# Watch for changes
npm run dev:watch

# Deploy to Vercel
vercel deploy
```

---

## 📊 Data Flow

### 1. **Simple Query Flow**
```
User: "What's the price of BTC?"
  ↓
API: Detects intent = 'price_query'
  ↓
LLM: Generates SQL
  → SELECT * FROM update.token_price_daily WHERE symbol = 'BTC' ...
  ↓
DB: Returns rows
  → [{ symbol: 'BTC', price_usd: '95234.56', ... }]
  ↓
LLM: Generates answer
  → "Bitcoin is currently trading at around $95,235 (as of October 5, 2025)..."
  ↓
Response: { answer, sql, rows, intent }
```

### 2. **Complex Query with Retry**
```
User: "Best stablecoin pools?"
  ↓
Attempt 1: Generates SQL
  → ERROR: "UNION types cannot be matched"
  ↓
Retry 1: Learns from error, removes UNION
  → SELECT ... FROM update.cl_pool_hist WHERE ...
  ↓
SUCCESS: Returns 100 rows
  ↓
Answer: "Best Stablecoin Pools Across All Chains..."
```

---

## 🚨 Critical Design Patterns

### 1. **Mandatory Timestamp Filtering**
All queries MUST filter for recent data to avoid stale results:
```sql
WHERE ts >= (SELECT MAX(ts) - 21600 FROM update.cl_pool_hist)
```

### 2. **DISTINCT ON for Deduplication**
Prevents showing same pool/protocol at different timestamps:
```sql
SELECT DISTINCT ON (pool_id) ...
ORDER BY pool_id, ts DESC
```

### 3. **LIMIT 100 Always**
Ensures comprehensive cross-chain/protocol analysis:
```sql
LIMIT 100  -- NOT 5, NOT 10, NOT 50
```

### 4. **Schema Separation**
Never mix `update.*` and `clean.*` schemas (timestamp type incompatibility):
```sql
-- ❌ WRONG
SELECT * FROM update.table UNION SELECT * FROM clean.table

-- ✅ RIGHT
SELECT * FROM update.table WHERE ...
```

---

## 🎯 Query Intents

The system detects 6 types of query intents:

1. **`lending_opportunities`** - "Where can I lend USDC for best rates?"
2. **`pool_analysis`** - "What are the APYs for WETH-USDC pools?"
3. **`price_query`** - "What's the price of ETH?"
4. **`portfolio_optimization`** - "Construct optimal portfolio..." (→ general knowledge)
5. **`general_prediction`** - "Should I buy BTC?" (→ general knowledge)
6. **`standard_query`** - Everything else

---

## 🔒 Security Features

### SQL Injection Protection (`lib/guard.js`)

```javascript
export function guardSql(sql, allowedTables, colsByTable, maxLimit = 500) {
  // ✅ Only SELECT/WITH statements
  // ✅ No DDL/DML keywords (UPDATE, INSERT, DELETE, DROP, etc.)
  // ✅ No comments
  // ✅ Single statement only
  // ✅ Auto-add LIMIT if missing
  // ✅ Clamp LIMIT to max
}
```

### Authentication

- Optional Supabase JWT verification
- Graceful degradation if not authenticated
- User tracking for logged-in users

---

## 📈 Performance Optimizations

1. **Connection Pooling**: Reuse DB connections (10 max, 2 min)
2. **Schema Caching**: Load registry once, cache in memory
3. **Query Timeout**: 30s limit to prevent long-running queries
4. **Smart Retries**: Learn from errors, don't just blindly retry
5. **Filtered Schema**: Only send relevant tables to LLM
6. **Row Limiting**: Query 100 rows, send top 30 to LLM

---

## 🐛 Common Issues & Solutions

### Issue: "Timestamp type mismatch"
**Cause**: Mixing `update.*` (BIGINT) and `clean.*` (BIGINT) schemas with UNION  
**Fix**: Use only one schema, or use separate queries

### Issue: "Same pool appears 20 times"
**Cause**: Missing `DISTINCT ON` - showing same pool at different timestamps  
**Fix**: Add `DISTINCT ON (pool_id)` or `DISTINCT ON (symbol, project, chain)`

### Issue: "Returns old March data in October"
**Cause**: Missing timestamp filter  
**Fix**: Add `WHERE ts >= (SELECT MAX(ts) - 21600 FROM table)`

### Issue: "Only showing 2-3 protocols"
**Cause**: `LIMIT 5` or `LIMIT 10` instead of `LIMIT 100`  
**Fix**: Always use `LIMIT 100` for comprehensive results

---

## 🔗 Integration with Main App

### Current Integration Point

Your main Next.js app (`/Users/aryan/Thallos_ui`) likely calls this backend API at:

```typescript
// In your Next.js chat page
const response = await fetch('/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${supabaseToken}`
  },
  body: JSON.stringify({
    question: userMessage,
    stream: true
  })
});
```

### Missing Integration

Based on the backend code, you should:

1. **Create backend database tables** for query logging:
   - `user.user`
   - `user.conversations`
   - `user.messages`

2. **Set backend environment variables** in Vercel:
   - `DATABASE_URL` (Supabase connection string)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `OPENAI_API_KEY`

3. **Update frontend to use backend**:
   - Point chat API calls to backend `/api/query`
   - Pass Supabase auth token in `Authorization` header

---

## 🚀 Deployment Checklist

- [ ] Set all environment variables in Vercel
- [ ] Create database tables (`user.*` schema)
- [ ] Verify `DATABASE_URL` connection works
- [ ] Test auth flow with Supabase JWT
- [ ] Update frontend to point to backend API
- [ ] Monitor OpenAI API usage/costs
- [ ] Set up error tracking (Sentry, etc.)

---

## 📚 Next Steps

1. **Connect Backend to Frontend**:
   - Update chat page to use backend API
   - Pass authentication tokens
   - Handle streaming responses

2. **Create Database Tables**:
   - Run SQL migrations from `conversations/` folder
   - Set up RLS policies

3. **Monitor & Optimize**:
   - Track query performance
   - Optimize slow SQL queries
   - Monitor OpenAI token usage

---

## 🆘 Support & Documentation

- **API Endpoint**: `POST /api/query`
- **Local Dev**: `npm run dev:local` (http://localhost:3000)
- **Schema Registry**: `config/llm_table_registry.json`
- **Conversation System**: `conversations/README.md`
- **Usage Examples**: `conversations/usage-example.js`

---

**Last Updated**: October 5, 2025  
**Version**: 1.0.0  
**Status**: Production-ready (pending table setup)

