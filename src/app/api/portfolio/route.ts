import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Get Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

interface TokenBalance {
  symbol: string;
  balance: number;
  value: number;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = getSupabaseClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get user's wallets
    const { data: wallets, error: walletsError } = await supabase
      .from('user_wallets')
      .select('address, chain')
      .eq('user_id', user.id);

    if (walletsError || !wallets || wallets.length === 0) {
      return NextResponse.json({ 
        totalValue: 0, 
        change24h: 0,
        tokens: [],
        walletCount: 0
      });
    }

    let totalValue = 0;
    const allTokens: TokenBalance[] = [];

    // Fetch portfolio value for each wallet
    for (const wallet of wallets) {
      try {
        const portfolioData = await fetchWalletPortfolio(wallet.address, wallet.chain);
        totalValue += portfolioData.totalValue;
        allTokens.push(...portfolioData.tokens);
      } catch (error) {
        console.error(`Error fetching portfolio for ${wallet.address}:`, error);
      }
    }

    return NextResponse.json({
      totalValue: totalValue.toFixed(2),
      change24h: 0, // Will be calculated if historical data is available
      tokens: allTokens,
      walletCount: wallets.length
    });

  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch portfolio',
      totalValue: 0,
      change24h: 0
    }, { status: 500 });
  }
}

async function fetchWalletPortfolio(address: string, chain: string = 'ethereum'): Promise<{ totalValue: number; tokens: TokenBalance[] }> {
  let totalValue = 0;
  const tokens: TokenBalance[] = [];

  try {
    // Get Alchemy API key if available, otherwise use free alternatives
    const alchemyKey = process.env.ALCHEMY_API_KEY;
    
    if (alchemyKey) {
      // Use Alchemy for better data
      const alchemyUrl = getAlchemyUrl(chain, alchemyKey);
      
      // Fetch ETH balance
      const ethBalance = await fetchEthBalance(address, alchemyUrl);
      const ethPrice = await fetchEthPrice();
      const ethValue = ethBalance * ethPrice;
      
      if (ethValue > 0) {
        totalValue += ethValue;
        tokens.push({
          symbol: 'ETH',
          balance: ethBalance,
          value: ethValue
        });
      }

      // Fetch ERC20 token balances
      const tokenBalances = await fetchTokenBalances(address, alchemyUrl);
      for (const token of tokenBalances) {
        totalValue += token.value;
        tokens.push(token);
      }
    } else {
      // Fallback: Use free Etherscan API
      console.warn('No Alchemy API key found, using fallback method');
      
      // Get ETH balance using free RPC
      const ethBalance = await fetchEthBalancePublicRPC(address, chain);
      const ethPrice = await fetchEthPrice();
      const ethValue = ethBalance * ethPrice;
      
      if (ethValue > 0) {
        totalValue += ethValue;
        tokens.push({
          symbol: 'ETH',
          balance: ethBalance,
          value: ethValue
        });
      }
    }

    return { totalValue, tokens };
  } catch (error) {
    console.error('Error fetching wallet portfolio:', error);
    return { totalValue: 0, tokens: [] };
  }
}

function getAlchemyUrl(chain: string, apiKey: string): string {
  const networks: Record<string, string> = {
    'ethereum': 'eth-mainnet',
    'polygon': 'polygon-mainnet',
    'arbitrum': 'arb-mainnet',
    'optimism': 'opt-mainnet',
    'base': 'base-mainnet'
  };
  
  const network = networks[chain.toLowerCase()] || 'eth-mainnet';
  return `https://${network}.g.alchemy.com/v2/${apiKey}`;
}

async function fetchEthBalance(address: string, alchemyUrl: string): Promise<number> {
  try {
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
      })
    });

    const data = await response.json();
    const balanceWei = parseInt(data.result, 16);
    return balanceWei / 1e18;
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    return 0;
  }
}

async function fetchEthBalancePublicRPC(address: string, chain: string): Promise<number> {
  try {
    const rpcUrls: Record<string, string> = {
      'ethereum': 'https://eth.llamarpc.com',
      'polygon': 'https://polygon-rpc.com',
      'arbitrum': 'https://arb1.arbitrum.io/rpc',
      'optimism': 'https://mainnet.optimism.io',
      'base': 'https://mainnet.base.org'
    };

    const rpcUrl = rpcUrls[chain.toLowerCase()] || rpcUrls['ethereum'];

    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
      })
    });

    const data = await response.json();
    const balanceWei = parseInt(data.result, 16);
    return balanceWei / 1e18;
  } catch (error) {
    console.error('Error fetching ETH balance from public RPC:', error);
    return 0;
  }
}

async function fetchTokenBalances(address: string, alchemyUrl: string): Promise<TokenBalance[]> {
  try {
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [address],
        id: 1
      })
    });

    const data = await response.json();
    const tokenBalances: TokenBalance[] = [];

    if (data.result && data.result.tokenBalances) {
      // Get top tokens only (to avoid rate limits)
      const topTokens = data.result.tokenBalances.slice(0, 10);
      
      for (const token of topTokens) {
        const balance = parseInt(token.tokenBalance, 16);
        if (balance > 0) {
          // Get token metadata
          const metadata = await fetchTokenMetadata(token.contractAddress, alchemyUrl);
          if (metadata && metadata.decimals) {
            const tokenBalance = balance / Math.pow(10, metadata.decimals);
            // For now, we can't get prices without additional APIs
            // This would require CoinGecko or similar
            tokenBalances.push({
              symbol: metadata.symbol || 'UNKNOWN',
              balance: tokenBalance,
              value: 0 // Price lookup would go here
            });
          }
        }
      }
    }

    return tokenBalances;
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return [];
  }
}

async function fetchTokenMetadata(contractAddress: string, alchemyUrl: string): Promise<{ symbol: string; decimals: number } | null> {
  try {
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenMetadata',
        params: [contractAddress],
        id: 1
      })
    });

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
}

async function fetchEthPrice(): Promise<number> {
  try {
    // Use CoinGecko free API (no key required)
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { 
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 60 } // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch ETH price');
    }

    const data = await response.json();
    return data.ethereum?.usd || 0;
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    // Fallback price if API fails
    return 3500; // Approximate ETH price
  }
}

