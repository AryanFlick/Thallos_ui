# Quick Webhook Testing Guide

Follow these steps to test Stripe webhooks in 5 minutes:

## 1. Install Stripe CLI (One-time setup)

```bash
brew install stripe/stripe-cli/stripe
```

## 2. Login to Stripe

```bash
stripe login
```

This opens your browser - click "Allow access"

## 3. Start Webhook Forwarding

In a **NEW terminal** (keep this running):

```bash
stripe listen --forward-to localhost:3002/api/stripe/webhook
```

You'll see output like:
```
> Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

**Copy the `whsec_xxxxx` part!**

## 4. Add Webhook Secret

1. Open `.env.local`
2. Add this line (replace with your actual secret):
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```
3. Make sure you also have:
   ```
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## 5. Restart Your Dev Server

In your main terminal:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

## 6. Test the Flow

1. Open http://localhost:3002
2. Log in
3. Go to Profile → Billing
4. Click "Upgrade to Pro"
5. Use test card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
6. Complete payment
7. You should be redirected back to profile

## 7. Check It Worked

### In the Stripe CLI terminal:
You should see:
```
webhook  ✓ checkout.session.completed
```

### In your app logs:
```
✓ Checkout completed for user: ...
✓ Successfully activated Pro subscription for user: ...
```

### In your Profile page:
- Plan should say "Pro"
- API Usage should show "Unlimited"

### In Supabase:
1. Go to Supabase Dashboard
2. Table Editor → `user_subscriptions`
3. You should see a row with:
   - `plan: 'pro'`
   - `status: 'active'`

## 8. Test Unlimited Queries

1. Go to Agent page
2. Send more than 15 messages
3. Should work without limit! 🎉

---

## Troubleshooting

### "Webhook signature verification failed"
- Check `STRIPE_WEBHOOK_SECRET` in `.env.local` matches the one from `stripe listen`
- Restart dev server

### "Missing Supabase environment variables"
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key)
- Get it from: Supabase Dashboard → Settings → API → service_role

### Subscription not activating
- Check the Stripe CLI terminal for errors
- Check your app logs for errors
- Verify the `user_subscriptions` table exists in Supabase

### Still seeing "Free Plan" after payment
- Refresh the profile page
- Check Supabase `user_subscriptions` table manually
- Verify webhook received event (check Stripe CLI terminal)

---

## What's Happening?

```
User clicks "Upgrade to Pro"
    ↓
Stripe Checkout opens
    ↓
User enters card & pays
    ↓
Stripe processes payment
    ↓
Stripe sends webhook event → Your app (via Stripe CLI)
    ↓
Webhook verifies signature
    ↓
Webhook updates Supabase
    ↓
User now has Pro subscription!
    ↓
Unlimited queries unlocked! ✨
```

---

## Next Steps

Once testing works locally:

1. **Deploy your app** to production
2. **Create production webhook** in Stripe Dashboard
3. **Update environment variables** on hosting platform
4. **Test with real payment** (optional)

See `STRIPE_WEBHOOK_SETUP.md` for full production deployment guide.

