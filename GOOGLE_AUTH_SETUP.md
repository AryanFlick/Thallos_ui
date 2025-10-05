# Google Authentication Setup Guide

Complete guide to enable Google (Gmail) sign-in for Thallos.

---

## 📋 Step 1: Google Cloud Console Setup (10 minutes)

### 1.1 Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click the project dropdown (top left)
   - Click "NEW PROJECT"
   - Name: "Thallos" or "Thallos Auth"
   - Click "CREATE"

3. **Enable OAuth Consent Screen**
   - Go to: **APIs & Services** → **OAuth consent screen**
   - Select **External** (for public access)
   - Click "CREATE"

4. **Configure OAuth Consent Screen**
   - **App name**: `Thallos`
   - **User support email**: Your email
   - **App logo**: (Optional) Upload Thallos logo
   - **Application home page**: `https://your-domain.com` (or leave blank for now)
   - **Authorized domains**: 
     - Add: `supabase.co`
     - Add your custom domain if you have one
   - **Developer contact email**: Your email
   - Click "SAVE AND CONTINUE"

5. **Scopes** (Optional for now)
   - Click "SAVE AND CONTINUE" (we'll use default scopes)

6. **Test Users** (If app is in Testing mode)
   - Add your email and any test users
   - Click "SAVE AND CONTINUE"

7. **Create OAuth 2.0 Credentials**
   - Go to: **APIs & Services** → **Credentials**
   - Click "+ CREATE CREDENTIALS"
   - Select "OAuth client ID"
   - **Application type**: Web application
   - **Name**: "Thallos Web Client"
   
   **Authorized JavaScript origins**:
   - Add: `http://localhost:3002` (for local dev)
   - Add: `https://your-production-domain.com` (if you have one)
   
   **Authorized redirect URIs**:
   - Add: `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
     - Replace `YOUR_SUPABASE_PROJECT_REF` with your actual Supabase project reference
     - Example: `https://agfqlrbtlkzrpcmelwao.supabase.co/auth/v1/callback`
   
   - Click "CREATE"

8. **Copy Your Credentials**
   - You'll see a popup with:
     - **Client ID** (looks like: `123456789-abc...xyz.apps.googleusercontent.com`)
     - **Client Secret** (looks like: `GOCSPX-...`)
   - **SAVE THESE!** You'll need them for Supabase

---

## 🔧 Step 2: Configure Supabase (5 minutes)

### 2.1 Enable Google Provider in Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard

2. **Navigate to Authentication Settings**
   - Select your project: "Thallos Data House"
   - Go to: **Authentication** → **Providers**

3. **Enable Google Provider**
   - Scroll down to "Google"
   - Toggle **Enable Sign in with Google** to ON

4. **Enter Google Credentials**
   - **Client ID**: Paste the Client ID from Google Cloud Console
   - **Client Secret**: Paste the Client Secret from Google Cloud Console
   - Click "SAVE"

### 2.2 Get Your Callback URL

Your Supabase callback URL should be:
```
https://agfqlrbtlkzrpcmelwao.supabase.co/auth/v1/callback
```

**⚠️ IMPORTANT**: Make sure this EXACT URL is added to Google Cloud Console "Authorized redirect URIs"

---

## 💻 Step 3: Update Frontend Code

I'll now update your code to add Google sign-in buttons.

### Files to Update:
1. `src/app/login/page.tsx` - Add Google sign-in button
2. No other changes needed! Supabase handles everything else.

---

## 🧪 Step 4: Testing (5 minutes)

### Test the Flow

1. **Start your dev server** (already running)
   ```bash
   npm run dev
   ```

2. **Go to login page**
   - Visit: http://localhost:3002/login

3. **Click "Sign in with Google"**
   - Should redirect to Google sign-in
   - Select your Google account
   - Grant permissions
   - Should redirect back to your app
   - Should be logged in!

4. **Check Supabase**
   - Go to: **Authentication** → **Users**
   - You should see your Google account listed

---

## 🔒 Security Checklist

- ✅ Never commit Google Client Secret to Git
- ✅ Use environment variables for sensitive data
- ✅ Enable email verification (optional)
- ✅ Set up proper redirect URLs for production
- ✅ Review OAuth scopes (only request what you need)

---

## 🚨 Common Issues & Solutions

### Issue: "Redirect URI mismatch"
**Solution**: 
- Check that the redirect URI in Google Cloud Console EXACTLY matches:
  `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
- No trailing slash
- Must use `https://`

### Issue: "Access blocked: This app's request is invalid"
**Solution**:
- Make sure OAuth consent screen is configured
- Add your email to Test Users if app is in Testing mode
- Verify authorized domains include `supabase.co`

### Issue: "Email already registered"
**Solution**:
- User already signed up with email/password
- They need to sign in with email/password
- Or you can enable "Allow Duplicate Emails" in Supabase (not recommended)

### Issue: "Invalid client ID"
**Solution**:
- Double-check Client ID in Supabase matches Google Cloud Console
- Make sure there are no extra spaces when copying

---

## 📊 What Gets Stored in Supabase

When a user signs in with Google, Supabase automatically creates:

**In `auth.users` table**:
- `id`: UUID (unique user ID)
- `email`: User's Gmail address
- `email_confirmed_at`: Timestamp (auto-confirmed for Google)
- `provider`: "google"
- `raw_user_meta_data`: 
  ```json
  {
    "avatar_url": "https://lh3.googleusercontent.com/...",
    "email": "user@gmail.com",
    "email_verified": true,
    "full_name": "John Doe",
    "iss": "https://accounts.google.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "provider_id": "123456789...",
    "sub": "123456789..."
  }
  ```

**In `auth.identities` table**:
- Links the Google account to the Supabase user
- Stores provider-specific data

**In `public.profiles` table** (via your trigger):
- Auto-creates profile when new user signs up

---

## 🎨 Customization Options

### Add Custom Scopes

If you need more than basic profile info:

**In Supabase** → **Authentication** → **Providers** → **Google**:
- Add scopes like: `https://www.googleapis.com/auth/calendar.readonly`

### Customize OAuth Consent Screen

**In Google Cloud Console**:
- Add app logo
- Add privacy policy URL
- Add terms of service URL
- Request app verification (for production)

---

## 🚀 Production Deployment Checklist

Before going live:

1. **Update Authorized Redirect URIs**
   - Add your production domain redirect URL

2. **Update Authorized JavaScript Origins**
   - Add your production domain

3. **Publish OAuth Consent Screen**
   - Move from "Testing" to "Production"
   - May require Google verification for certain scopes

4. **Set Site URL in Supabase**
   - Go to: **Authentication** → **URL Configuration**
   - Set **Site URL**: `https://your-production-domain.com`
   - Add to **Redirect URLs**: `https://your-production-domain.com/**`

5. **Test on Production**
   - Sign in with Google on production site
   - Verify redirect works correctly

---

## 📝 Summary

**What you need:**
1. ✅ Google Client ID
2. ✅ Google Client Secret
3. ✅ Supabase callback URL added to Google
4. ✅ Google provider enabled in Supabase
5. ✅ Frontend updated with Google sign-in button

**Total setup time**: ~20 minutes

---

## 🆘 Need Help?

- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2
- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth/social-login/auth-google
- **Test your setup**: Use Incognito mode to test fresh sign-up flow

---

**Next Steps**: I'll now update your login page to add the Google sign-in button! 🚀

