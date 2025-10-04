# Stripe Setup Instructions

## Prerequisites
- A Stripe account (create one at https://stripe.com)
- Access to your Stripe Dashboard

## Step 1: Get Your API Keys

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Add them to your `.env.local` file:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

## Step 2: Create a Subscription Product

1. Go to: https://dashboard.stripe.com/test/products
2. Click **"Add product"** button
3. Fill in the product details:
   - **Name**: `Thallos Pro`
   - **Description**: `Unlimited DeFi intelligence queries and premium features`
   - **Pricing model**: Select **"Standard pricing"**
   - **Price**: `$19.00`
   - **Billing period**: Select **"Monthly"**
   - **Currency**: `USD`
4. Click **"Save product"**
5. After saving, you'll see a **Price ID** that starts with `price_`
6. Copy this Price ID

## Step 3: Add Price ID to Environment Variables

Add the Price ID to your `.env.local` file:

```env
STRIPE_PRICE_ID=price_your_actual_price_id_here
```

## Step 4: Test the Integration

1. Restart your development server (`npm run dev`)
2. Log in to your app
3. Go to Profile → Billing
4. Click "Upgrade to Pro"
5. You should be redirected to a Stripe checkout page

## Step 5: Handle Webhooks (Optional but Recommended)

To automatically update user subscriptions when they pay:

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Add the Webhook signing secret to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Your Complete .env.local File

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Optional

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### "Stripe product not configured" Error
- Make sure `STRIPE_PRICE_ID` is set in `.env.local`
- Restart your dev server after adding environment variables
- Verify the price ID is correct (starts with `price_`)

### Checkout Not Working
- Check your Stripe API keys are in test mode (`pk_test_` and `sk_test_`)
- Ensure your Stripe account is activated
- Check the browser console for detailed error messages

### Production Deployment
1. Switch to live API keys (replace `test` with `live`)
2. Create a production product in Stripe
3. Update `STRIPE_PRICE_ID` with the live price ID
4. Set `NEXT_PUBLIC_APP_URL` to your production domain

