# 🚀 Start Backend Locally

## Quick Steps:

### 1. Open a NEW terminal window/tab

### 2. Navigate to backend folder:
```bash
cd /Users/aryan/Thallos_ui/backend
```

### 3. Check if .env file exists:
```bash
ls -la .env
```

**If .env doesn't exist**, create it:
```bash
cat > .env << 'EOF'
# Copy these from your main project .env.local
OPENAI_API_KEY=your_key_here
DATABASE_URL=your_supabase_connection_string
PORT=3001
EOF
```

Then edit `.env` and add your actual keys.

### 4. Install dependencies (if needed):
```bash
npm install
```

### 5. Start the backend:
```bash
npm run dev:local
```

You should see: **"Local API on http://localhost:3001"**

### 6. In ANOTHER terminal, update frontend to use local backend:
```bash
cd /Users/aryan/Thallos_ui
echo "NEXT_PUBLIC_BACKEND_API_URL=http://localhost:3001" >> .env.local
```

### 7. Your frontend should auto-reload. If not, restart it.

### 8. Test!
Go to http://localhost:3002/chat and ask:
**"Compare the top 10 protocols by TVL"**

📊 Chart should appear!

