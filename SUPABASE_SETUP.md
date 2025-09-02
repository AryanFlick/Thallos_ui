# Thallos AI Agent Setup

## Quick Setup Instructions

1. **Create `.env.local` file** in your project root:
   ```bash
   touch .env.local
   ```

2. **Add your credentials** to `.env.local`:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://zgwsjkjmphquyynzhqrm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key-here
   
   # OpenAI Configuration
   OPENAI_API_KEY=your-actual-openai-api-key-here
   ```

3. **Get your API keys**:
   
   **Supabase:**
   - Go to your Supabase project dashboard
   - Navigate to **Settings > API**
   - Copy the **"anon public"** key
   - Replace `your-actual-supabase-anon-key-here` with this key
   
   **OpenAI:**
   - Go to [OpenAI API Dashboard](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key
   - Replace `your-actual-openai-api-key-here` with this key

4. **Test Authentication**:
   - Visit `/login` to create an account
   - Sign up with your email
   - Check your email for confirmation
   - Sign in and access `/chat`

## Features Implemented

### Authentication Pages
- **`/login`** - Sign in/Sign up with email authentication
- **`/chat`** - AI-powered chatbot interface with GPT-4o for institutional DeFi analysis

### Components Created
- **Login Screen**: Beautiful UI with DarkVeil background
- **Chatbot Interface**: Professional chat UI with sidebar
- **Auth Protection**: Automatic redirects for unauthenticated users

### Navigation Updates
- **Navbar**: "Agent" link now goes to `/login`
- **Authentication Flow**: Seamless user experience

## Authentication Features

- ✅ Email/Password authentication
- ✅ User registration with email confirmation
- ✅ Session persistence
- ✅ Auto token refresh
- ✅ Protected routes
- ✅ Sign out functionality
- ✅ Error handling and user feedback

## Next Steps

1. Add your Supabase anon key to `.env.local`
2. Test the authentication flow
3. Customize the chatbot responses (currently simulated)
4. Add any additional user data tables to Supabase if needed
