# Stripe Webhook Setup Guide

This guide will help you set up Stripe webhooks to automatically activate Pro subscriptions when users complete payment.

## Why Webhooks?

Webhooks allow Stripe to notify your app when events happen (like successful payments), so you can automatically:
- Activate Pro subscriptions
- Grant unlimited API access
- Update billing status
- Handle cancellations

---

## Step 1: Get Your Webhook Endpoint URL

### For Development (Local Testing with Stripe CLI):

1. **Install Stripe CLI** (if not already installed):
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Or download from: https://stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe CLI**:
   ```bash
   stripe login
   ```
   This will open your browser to authorize the CLI.

3. **Forward webhooks to your local server**:
   ```bash
   stripe listen --forward-to localhost:3002/api/stripe/webhook
   ```
   
   This command will output a webhook signing secret that looks like:
   ```
   whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   **Copy this secret!** You'll need it in Step 2.

4. **Keep the terminal running** while you test. The CLI will show webhook events in real-time.

### For Production:

Your webhook URL will be:
```
https://your-domain.com/api/stripe/webhook
```

---

## Step 2: Add Webhook Secret to Environment Variables

1. Open your `.env.local` file

2. Add the webhook secret:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
   ```

3. **Make sure your SUPABASE_SERVICE_ROLE_KEY is set** (required for webhook to update database):
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```
   
   Get this from: Supabase Dashboard → Project Settings → API → service_role key

4. Restart your dev server:
   ```bash
   npm run dev
   ```

---

## Step 3: Configure Webhook in Stripe Dashboard (For Production)

1. Go to: https://dashboard.stripe.com/test/webhooks

2. Click **"Add endpoint"**

3. Enter your endpoint URL:
   ```
   https://your-domain.com/api/stripe/webhook
   ```

4. Select events to listen to:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. Click **"Add endpoint"**

6. Copy the **Signing secret** (starts with `whsec_`)

7. Add it to your production environment variables

---

## Step 4: Test the Webhook

### Test with Stripe CLI (Development):

1. Make sure `stripe listen` is running in a terminal

2. In another terminal, trigger a test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

3. Check your app logs - you should see:
   ```
   ✓ Checkout completed for user: [user-id]
   ✓ Successfully activated Pro subscription for user: [user-id]
   ```

### Test with Real Payment Flow:

1. Log into your app
2. Go to Profile → Billing
3. Click "Upgrade to Pro"
4. Complete checkout with test card: `4242 4242 4242 4242`
5. After payment, you should be redirected back
6. Check your profile - plan should now show "Pro"
7. Try making more than 15 queries - should work unlimited!

---

## Step 5: Verify Subscription is Active

### Check in Supabase:

1. Go to Supabase Dashboard → Table Editor
2. Open `user_subscriptions` table
3. You should see a row with:
   - `plan: 'pro'`
   - `status: 'active'`
   - `stripe_customer_id: 'cus_...'`
   - `stripe_subscription_id: 'sub_...'`

### Check in Your App:

1. Go to Profile → API Usage
2. Should show "Pro Plan" instead of "Free Plan"
3. Should show "Unlimited" queries instead of "15/month"

---

## How It Works

1. **User clicks "Upgrade to Pro"** → Creates Stripe checkout session
2. **User completes payment** → Stripe charges card
3. **Stripe sends webhook** → Your app receives `checkout.session.completed` event
4. **Webhook handler runs** → Updates `user_subscriptions` table in Supabase
5. **User gets Pro access** → Unlimited queries, no 15/month limit

---

## Troubleshooting

### Webhook not receiving events:

**Problem**: Stripe events not showing up in logs

**Solutions**:
- Check `stripe listen` is running
- Verify webhook secret is correct in `.env.local`
- Restart dev server after adding environment variables
- Check Stripe CLI output for errors

### Subscription not activating:

**Problem**: Payment succeeds but user still shows "Free Plan"

**Solutions**:

1. Check webhook logs in terminal for errors
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key)
3. Check Supabase `user_subscriptions` table for row
4. Ensure `userId` is in checkout session metadata:
   ```typescript
   metadata: {
     userId: user.id,
   }
   ```

### Signature verification failed:

**Problem**: `Webhook signature verification failed`

**Solutions**:
- Make sure you're using the webhook secret from `stripe listen` command
- Don't use the webhook secret from Stripe Dashboard in local dev
- Verify `.env.local` has correct `STRIPE_WEBHOOK_SECRET`
- Restart dev server

### Database update fails:

**Problem**: `Error updating subscription` in logs

**Solutions**:
- Check `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Verify `user_subscriptions` table exists (run migration)
- Check table has correct columns (see migration file)
- Ensure RLS policies allow service role access

---

## Security Notes

🔒 **Important Security Points**:

1. **Always verify webhook signatures** - Already done in the code ✅
2. **Use service role key only in webhook** - Never expose it to client
3. **Webhook secret is different** for development and production
4. **Test mode vs Live mode** - Use test keys for development

---

## Production Deployment

When deploying to production:

1. **Create production webhook** in Stripe Dashboard (live mode)
2. **Update environment variables** on your hosting platform:
   ```env
   STRIPE_SECRET_KEY=sk_live_...  # Not sk_test_
   STRIPE_WEBHOOK_SECRET=whsec_... # From production webhook
   SUPABASE_SERVICE_ROLE_KEY=...  # Production service key
   ```
3. **Switch to live Stripe price ID** in your code
4. **Test with real card** (small amount) before going live

---

## Monitoring Webhooks

### In Stripe Dashboard:

1. Go to: Developers → Webhooks
2. Click on your webhook endpoint
3. View "Event history" to see:
   - Successful deliveries ✅
   - Failed deliveries ❌
   - Response times
   - Retry attempts

### In Your App Logs:

Watch for these log messages:
- ✅ `Checkout completed for user: ...`
- ✅ `Successfully activated Pro subscription for user: ...`
- ✅ `Updated subscription for user: ...`
- ❌ `Error updating subscription: ...`

---

## Quick Reference: Webhook Events

| Event | When | What Happens |
|-------|------|--------------|
| `checkout.session.completed` | Payment succeeds | Creates Pro subscription |
| `customer.subscription.created` | Subscription starts | Updates subscription details |
| `customer.subscription.updated` | Plan changes | Updates status/dates |
| `customer.subscription.deleted` | User cancels | Sets status to 'cancelled' |
| `invoice.payment_succeeded` | Monthly renewal succeeds | Extends subscription |
| `invoice.payment_failed` | Payment fails | Sets status to 'past_due' |

---

## Need Help?

- **Stripe Webhook Docs**: https://stripe.com/docs/webhooks
- **Stripe CLI Docs**: https://stripe.com/docs/stripe-cli
- **Test Cards**: https://stripe.com/docs/testing#cards
- **Webhook Testing**: https://stripe.com/docs/webhooks/test

