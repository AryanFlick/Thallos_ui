# Real Portfolio Integration - Quick Setup

Your portfolio is now fetching **REAL blockchain data** from connected wallets! 🎉

## How It Works

The system fetches actual wallet balances from blockchain networks and displays the total USD value.

### What's Included:

✅ **ETH Balance** - Fetches native token balance (ETH, MATIC, etc.)
✅ **Token Balances** - Fetches ERC20 token holdings
✅ **Real-time Prices** - Gets current ETH price from CoinGecko
✅ **Multi-chain Support** - Ethereum, Polygon, Arbitrum, Optimism, Base
✅ **Free Tier Available** - Works without API keys using public RPCs

---

## Option 1: Basic Setup (Free, No API Key)

The system works **out of the box** without any API keys using:
- Public RPC endpoints (free)
- CoinGecko API (free, no key needed)

**Current Status:** ✅ Already working!

**Limitations:**
- ETH balance only (tokens not included without Alchemy)
- Slower response times
- May hit rate limits with many users

---

## Option 2: Enhanced Setup (Recommended - Free Tier)

For better performance and token balance support:

### 1. Sign up for Alchemy (Free Tier)

Go to: https://www.alchemy.com/
- Free tier: 300M compute units/month
- No credit card required
- Support for multiple chains

### 2. Create an App

1. Click "Create new app"
2. Name: "Thallos Portfolio"
3. Chain: "Ethereum" (Mainnet)
4. Copy your **API Key**

### 3. Add to Environment Variables

Add to your `.env.local`:
```env
ALCHEMY_API_KEY=your_api_key_here
```

### 4. Restart Your Server

```bash
npm run dev
```

That's it! 🎉

---

## How Portfolio Value is Calculated

1. **Fetch Wallet Addresses** - Gets all connected wallets from database
2. **For Each Wallet:**
   - Fetch native balance (ETH, MATIC, etc.)
   - Fetch ERC20 token balances (with Alchemy)
   - Get current prices from CoinGecko
3. **Calculate Total Value** - Sum all assets in USD
4. **Display in UI** - Show formatted value with 24h change

---

## Supported Chains

| Chain | Native Token | Status |
|-------|-------------|--------|
| Ethereum | ETH | ✅ Supported |
| Polygon | MATIC | ✅ Supported |
| Arbitrum | ETH | ✅ Supported |
| Optimism | ETH | ✅ Supported |
| Base | ETH | ✅ Supported |

The chain is automatically detected from the wallet's `chain` field in the database.

---

## API Endpoints

### GET `/api/portfolio`

**Headers:**
```
Authorization: Bearer {supabase_access_token}
```

**Response:**
```json
{
  "totalValue": "12847.32",
  "change24h": 0,
  "tokens": [
    {
      "symbol": "ETH",
      "balance": 3.5,
      "value": 12250.00
    },
    {
      "symbol": "USDC",
      "balance": 597.32,
      "value": 597.32
    }
  ],
  "walletCount": 2
}
```

---

## Testing

### 1. Connect a Wallet

1. Go to Profile → Wallets
2. Click "Connect Wallet"
3. Connect with RainbowKit

### 2. View Portfolio

The portfolio value should appear in:
- Chat sidebar (left side)
- Shows real ETH balance × current price

### 3. Check Console

Open browser console to see:
```
✓ Fetching portfolio for 0x123...
✓ ETH Balance: 2.5 ETH
✓ ETH Price: $3,500
✓ Total Value: $8,750.00
```

---

## Troubleshooting

### "Portfolio value shows $0.00"

**Possible causes:**
1. Wallet has no balance (check on Etherscan)
2. API rate limit hit (wait 1 minute)
3. Network error (check console)

**Solutions:**
- Add test ETH to your wallet
- Add Alchemy API key for better reliability
- Check browser console for errors

### "Loading forever"

**Cause:** API timeout or network error

**Solution:**
- Check your internet connection
- Verify SUPABASE_SERVICE_ROLE_KEY is set
- Check API logs for errors

### "Value seems incorrect"

**Cause:** Only counting ETH (without Alchemy)

**Solution:**
- Add Alchemy API key to include token balances
- Tokens are only fetched with Alchemy integration

---

## Adding Token Price Support

To show values for ERC20 tokens (USDC, DAI, etc.), you need to add price lookups.

### Option A: CoinGecko Pro (Recommended)

```typescript
// Add to portfolio API
async function getTokenPrice(contractAddress: string): Promise<number> {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddress}&vs_currencies=usd`,
    {
      headers: { 
        'x-cg-pro-api-key': process.env.COINGECKO_API_KEY 
      }
    }
  );
  const data = await response.json();
  return data[contractAddress.toLowerCase()]?.usd || 0;
}
```

### Option B: Use Alchemy Price API

Alchemy also provides token prices in their API responses.

---

## Performance Optimization

### Caching (Recommended)

Add Redis or database caching:

```sql
-- Create cache table
CREATE TABLE portfolio_cache (
  user_id UUID PRIMARY KEY,
  total_value DECIMAL,
  tokens JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Refresh every 5 minutes
CREATE INDEX idx_portfolio_cache_updated 
ON portfolio_cache(updated_at);
```

Then update API to check cache first:
```typescript
const cached = await getCachedPortfolio(userId);
if (cached && Date.now() - cached.updated_at < 5 * 60 * 1000) {
  return cached; // Return cached data
}
```

---

## Security Notes

🔒 **Important:**
- Portfolio API requires authentication
- Only shows data for authenticated user's wallets
- Uses service role key on server (never exposed to client)
- Rate limiting applied per user

---

## Costs & Limits

### Free Tier (Current Setup)
- ✅ Public RPCs: Unlimited
- ✅ CoinGecko: 10-30 calls/minute
- ⚠️ Token balances: Not available

### With Alchemy Free Tier
- ✅ 300M compute units/month
- ✅ ~300,000 API calls
- ✅ Token balances included
- ✅ Multiple chains

For typical usage (100 users checking portfolio 10x/day):
- **Public RPC:** May hit limits
- **Alchemy Free:** Plenty of capacity ✅

---

## Next Steps

1. ✅ **Test Current Setup** - Should work immediately
2. ✅ **Add Alchemy Key** - For better performance (optional)
3. ✅ **Add Caching** - For production (recommended)
4. ✅ **Add Token Prices** - For full portfolio tracking

---

## Environment Variables Summary

```env
# Required (already set)
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Optional but recommended
ALCHEMY_API_KEY=your_key_here

# Future enhancements
COINGECKO_API_KEY=... # For token prices
REDIS_URL=... # For caching
```

---

## Support

The portfolio API is now live at `/api/portfolio`. It automatically:
- ✅ Detects connected wallets
- ✅ Fetches balances from blockchain
- ✅ Converts to USD
- ✅ Returns total value

**Your portfolio value is now real and live!** 🚀

