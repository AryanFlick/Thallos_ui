# 🧪 Chart System - Local Testing Guide

## The Problem

Your frontend is calling the **production backend** at `https://thallos-llm-service.vercel.app`, which doesn't have the chart code yet. We need to either:
1. **Test locally** (quick, for development)
2. **Deploy to Vercel** (for production)

---

## ⚡ Option 1: Test Locally (Recommended First)

### Step 1: Set Up Backend Environment

Create `/backend/.env` file:
```bash
cd /Users/aryan/Thallos_ui/backend
touch .env
```

Add these variables to `/backend/.env`:
```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_key_here

# Database Connection (from your Supabase project)
DATABASE_URL=postgresql://postgres.agfqlrbtlkzrpcmelwao:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Run on port 3001 (since 3000 and 3002 are in use)
PORT=3001
```

**Find your DATABASE_URL**:
1. Go to Supabase Dashboard
2. Project Settings → Database
3. Copy "Connection String" (Transaction pooler)
4. Replace `[YOUR-PASSWORD]` with your database password

### Step 2: Install Backend Dependencies
```bash
cd /Users/aryan/Thallos_ui/backend
npm install
```

### Step 3: Start Backend Locally
```bash
npm run dev:local
```

You should see: `Local API on http://localhost:3001`

### Step 4: Point Frontend to Local Backend

Open a **new terminal** and create/update `.env.local` in the root:
```bash
cd /Users/aryan/Thallos_ui
echo "NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001" > .env.local
```

### Step 5: Restart Frontend

Your Next.js dev server should auto-reload. If not:
```bash
# Kill the current dev server (Ctrl+C)
# Then:
npm run dev
```

### Step 6: Test!

1. Go to: http://localhost:3002/chat
2. Ask: **"Compare the top 10 protocols by TVL"**
3. 📊 Chart should appear!

---

## 🚀 Option 2: Deploy to Vercel (For Production)

### Step 1: Navigate to Backend
```bash
cd /Users/aryan/Thallos_ui/backend
```

### Step 2: Ensure Git is Set Up
```bash
# Check if backend is a git repo
git status

# If not initialized:
git init
git add .
git commit -m "Add chart support"
```

### Step 3: Deploy to Vercel
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project or create new
# - Set as production? Yes
```

### Step 4: Set Environment Variables in Vercel

After deploying, set environment variables in Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your backend project
3. Settings → Environment Variables
4. Add:
   - `OPENAI_API_KEY` = your OpenAI key
   - `DATABASE_URL` = your Supabase connection string

### Step 5: Redeploy
```bash
vercel --prod
```

### Step 6: Update Frontend (if using new URL)

If you got a new Vercel URL, update your frontend `.env.local`:
```bash
NEXT_PUBLIC_BACKEND_API_URL=https://your-new-backend-url.vercel.app
```

---

## 🧪 Quick Test Commands

### Test Backend Locally:
```bash
# In one terminal:
cd backend && npm run dev:local

# In another terminal, test with curl:
curl -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Compare top 10 protocols", "stream": true}'
```

### Test Backend on Vercel:
```bash
curl -X POST https://your-backend.vercel.app/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "Compare top 10 protocols", "stream": true}'
```

Look for this in the output:
```
data: {"type":"chart","chart":{"type":"bar",...}}
```

---

## 🐛 Troubleshooting

### "Cannot find module 'dotenv'"
```bash
cd backend
npm install
```

### "Port 3001 already in use"
Change PORT in `/backend/.env`:
```env
PORT=3005  # or any available port
```

Then update frontend `.env.local`:
```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3005
```

### "Database connection failed"
- Check DATABASE_URL in `/backend/.env`
- Verify password is correct
- Try connection pooler URL from Supabase

### Charts still not showing
1. Open browser console (F12)
2. Check Network tab for backend requests
3. Look for `chart` in the SSE stream response
4. Check for errors in backend terminal

### Backend CORS errors
The backend has CORS enabled by default. If you see CORS errors:
- Make sure backend is running
- Check the BACKEND_API_URL in frontend `.env.local`
- Restart both frontend and backend

---

## 📊 Expected Behavior

When you ask **"Compare the top 10 protocols by TVL"**:

1. Backend receives question
2. Generates SQL query
3. Fetches data from database
4. **Chart generator analyzes data** ✨
5. Detects "compare" + categorical data
6. Generates bar chart config
7. **Streams chart chunk** to frontend
8. Frontend renders beautiful chart
9. AI explanation appears below

---

## 🎯 Test Questions That WILL Show Charts

Once backend is running with chart support:

```
Compare the top 10 lending protocols
Show me USDC lending rates over time  
Chart ETH pool performance
Visualize the best yield opportunities
What are the highest APY pools?
Display TVL distribution across protocols
```

---

## 💡 Pro Tip

**For fastest testing**: Use local backend (Option 1) first, then deploy (Option 2) when you're happy with it!

---

## 📝 Files Modified (Already Done)

✅ Backend:
- `/backend/lib/chart-generator.js` - NEW
- `/backend/api/query.js` - Modified (line 7, 257-261)

✅ Frontend:
- `/src/components/ChartRenderer.tsx` - NEW  
- `/src/app/chat/page.tsx` - Modified
- `/src/lib/api.ts` - Modified

---

## 🆘 Still Not Working?

Run this diagnostic:

```bash
# Check if chart-generator exists
ls -la backend/lib/chart-generator.js

# Check if backend has the import
grep "chart-generator" backend/api/query.js

# Check if frontend has ChartRenderer
ls -la src/components/ChartRenderer.tsx

# Check frontend API URL
grep "BACKEND_API_URL" .env.local
```

Share the output and I'll help debug!

