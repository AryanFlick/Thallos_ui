# Wallet Portfolio Integration Guide

## Current Status

The `WalletPortfolio` component now displays:
- ✅ Portfolio value (currently a demo value: $12,847.32)
- ✅ 24h change (demo value: +$247.18)
- ✅ Wallet count
- ✅ Personalized insights message

## Replace Demo Value with Real Data

To display actual wallet balances, you need to integrate with blockchain APIs. Here are the recommended options:

---

## Option 1: Alchemy API (Recommended)

### Why Alchemy?
- ✅ Multi-chain support (Ethereum, Polygon, Arbitrum, Optimism, Base)
- ✅ Token balances API
- ✅ Free tier available
- ✅ Great documentation

### Setup Steps:

1. **Get API Key**
   - Sign up at: https://www.alchemy.com/
   - Create a new app
   - Copy your API key

2. **Add to `.env.local`**
   ```env
   ALCHEMY_API_KEY=your_api_key_here
   ```

3. **Install SDK** (optional)
   ```bash
   npm install alchemy-sdk
   ```

4. **Create API Route**
   
   Create `/src/app/api/portfolio/route.ts`:
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import { Alchemy, Network } from 'alchemy-sdk';
   import { createClient } from '@supabase/supabase-js';

   const alchemy = new Alchemy({
     apiKey: process.env.ALCHEMY_API_KEY!,
     network: Network.ETH_MAINNET,
   });

   export async function GET(request: NextRequest) {
     try {
       const authHeader = request.headers.get('authorization');
       if (!authHeader) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
       }

       const token = authHeader.replace('Bearer ', '');
       const supabase = createClient(
         process.env.NEXT_PUBLIC_SUPABASE_URL!,
         process.env.SUPABASE_SERVICE_ROLE_KEY!
       );

       const { data: { user }, error } = await supabase.auth.getUser(token);
       if (error || !user) {
         return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
       }

       // Get user's wallets
       const { data: wallets } = await supabase
         .from('user_wallets')
         .select('address, chain')
         .eq('user_id', user.id);

       if (!wallets || wallets.length === 0) {
         return NextResponse.json({ totalValue: 0, change24h: 0 });
       }

       let totalValue = 0;

       // Fetch balances for each wallet
       for (const wallet of wallets) {
         const balances = await alchemy.core.getTokenBalances(wallet.address);
         
         // For each token, get price and calculate value
         for (const token of balances.tokenBalances) {
           if (token.tokenBalance && parseInt(token.tokenBalance) > 0) {
             // Get token metadata
             const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
             
             // Get token price from CoinGecko or similar
             const price = await getTokenPrice(token.contractAddress);
             const balance = parseInt(token.tokenBalance) / Math.pow(10, metadata.decimals || 18);
             totalValue += balance * price;
           }
         }

         // Get ETH balance
         const ethBalance = await alchemy.core.getBalance(wallet.address);
         const ethPrice = await getEthPrice();
         totalValue += parseFloat(ethBalance.toString()) / 1e18 * ethPrice;
       }

       return NextResponse.json({
         totalValue: totalValue.toFixed(2),
         change24h: 0, // Calculate from historical data
         wallets: wallets.length
       });
     } catch (error) {
       console.error('Portfolio fetch error:', error);
       return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
     }
   }

   async function getTokenPrice(contractAddress: string): Promise<number> {
     // Implement price fetching from CoinGecko or similar
     // Example: https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=...
     return 0;
   }

   async function getEthPrice(): Promise<number> {
     const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
     const data = await response.json();
     return data.ethereum.usd;
   }
   ```

5. **Update WalletPortfolio Component**
   
   In `/src/components/WalletPortfolio.tsx`, replace the demo value:
   ```typescript
   if (result.wallets.length > 0) {
     // Fetch real portfolio value
     const portfolioResponse = await fetch("/api/portfolio", {
       headers: {
         Authorization: `Bearer ${session.access_token}`,
       },
     });
     
     const portfolioData = await portfolioResponse.json();
     setPortfolioValue(parseFloat(portfolioData.totalValue));
   }
   ```

---

## Option 2: Moralis API

### Why Moralis?
- ✅ Multi-chain support
- ✅ NFT support
- ✅ Built-in price data
- ✅ DeFi positions tracking

### Setup:

1. Sign up at: https://moralis.io/
2. Get API key
3. Use Moralis Web3 API to fetch wallet balances
4. Documentation: https://docs.moralis.io/web3-data-api/evm/reference/wallet-api

---

## Option 3: DefiLlama API (Free)

### Why DefiLlama?
- ✅ Completely free
- ✅ DeFi protocol data
- ✅ No API key needed
- ✅ TVL and yield data

### Example API Call:

```typescript
// Get wallet balance across all protocols
const response = await fetch(
  `https://api.llama.fi/updatedProtocol/aave`
);
```

Documentation: https://defillama.com/docs/api

---

## Option 4: Simple Implementation (Etherscan + CoinGecko)

For a basic implementation using free APIs:

```typescript
// 1. Get token balances from Etherscan
const etherscanUrl = `https://api.etherscan.io/api?module=account&action=tokentx&address=${walletAddress}&apikey=${ETHERSCAN_API_KEY}`;

// 2. Get prices from CoinGecko (free tier)
const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`;

// 3. Calculate total value
```

---

## Quick Test (No API Integration)

If you want to test the UI with different values:

In `WalletPortfolio.tsx`, line 45-46:
```typescript
// Change this value to test different portfolio amounts
setPortfolioValue(45328.76); // Your desired test value
```

---

## Multi-Chain Support

To support multiple chains:

1. Store chain info in `user_wallets` table (already done)
2. Create separate API clients for each chain:
   ```typescript
   const chains = {
     ethereum: new Alchemy({ network: Network.ETH_MAINNET }),
     polygon: new Alchemy({ network: Network.MATIC_MAINNET }),
     arbitrum: new Alchemy({ network: Network.ARB_MAINNET }),
   };
   ```
3. Fetch balances from all chains and sum up

---

## Caching Recommendations

Portfolio data can be cached to reduce API calls:

1. **Cache in database**:
   ```sql
   CREATE TABLE portfolio_cache (
     user_id UUID PRIMARY KEY,
     total_value DECIMAL,
     updated_at TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES auth.users(id)
   );
   ```

2. **Refresh every 5 minutes**:
   ```typescript
   // Check if cache is fresh
   if (cachedData && Date.now() - cachedData.updated_at < 5 * 60 * 1000) {
     return cachedData.total_value;
   }
   ```

---

## Next Steps

1. ✅ Choose an API provider (Alchemy recommended)
2. ✅ Get API key
3. ✅ Create `/api/portfolio` endpoint
4. ✅ Update `WalletPortfolio` to fetch from API
5. ✅ Test with your wallet addresses
6. ✅ Add error handling and loading states
7. ✅ Implement caching for better performance

---

## Cost Estimates

| Provider | Free Tier | Paid Plans |
|----------|-----------|------------|
| **Alchemy** | 300M compute units/month | $199/month for more |
| **Moralis** | 40,000 requests/month | $49/month+ |
| **DefiLlama** | Unlimited (free) | N/A |
| **Etherscan** | 5 calls/second | $4.99/month+ |

For most applications, the free tiers are sufficient!

---

## Current Demo Values

The component currently shows:
- Portfolio Value: **$12,847.32** (hardcoded)
- 24h Change: **+$247.18** (hardcoded)

Replace line 46 in `WalletPortfolio.tsx` with your API integration to show real data.

