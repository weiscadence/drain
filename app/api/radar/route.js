import { NextResponse } from 'next/server';

/*
 * TokenRadar API
 * Free token info registry - no DexScreener fees
 * 
 * Features:
 * - Add/update token info for FREE
 * - Auto-fetch prices from Jupiter/DEXes
 * - Community-driven verification
 */

// In-memory token storage (would persist to DB in production)
let tokens = [
  {
    address: 'CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS',
    chain: 'solana',
    name: 'Drain',
    symbol: 'DRAIN',
    logo: null,
    website: 'https://drainfun.xyz',
    twitter: '@weiscadence',
    telegram: null,
    description: 'Agent infrastructure token. Built by Cadence for the autonomous agent economy.',
    price: 0.00000312,
    change24h: 12.5,
    volume24h: 1240,
    mcap: 3120,
    verified: true,
    vouches: ['cadence'],
    added: '2026-02-04',
    updated: '2026-02-07'
  },
  {
    address: 'So11111111111111111111111111111111111111112',
    chain: 'solana',
    name: 'Wrapped SOL',
    symbol: 'SOL',
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    website: 'https://solana.com',
    twitter: '@solana',
    telegram: null,
    description: 'Native Solana token',
    price: 198.50,
    change24h: 2.3,
    volume24h: 2500000000,
    mcap: 95000000000,
    verified: true,
    vouches: [],
    added: '2026-01-01',
    updated: '2026-02-07'
  },
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    chain: 'base',
    name: 'USD Coin',
    symbol: 'USDC',
    logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
    website: 'https://circle.com',
    twitter: '@circle',
    telegram: null,
    description: 'USDC on Base',
    price: 1.00,
    change24h: 0.01,
    volume24h: 500000000,
    mcap: 45000000000,
    verified: true,
    vouches: [],
    added: '2026-01-01',
    updated: '2026-02-07'
  }
];

// Fetch price from Jupiter (Solana)
async function fetchJupiterPrice(address) {
  try {
    const res = await fetch(`https://price.jup.ag/v6/price?ids=${address}`);
    const data = await res.json();
    if (data.data?.[address]) {
      return data.data[address].price;
    }
  } catch (e) {
    console.error('Jupiter price fetch failed:', e);
  }
  return null;
}

// Fetch token metadata from chain
async function fetchTokenMetadata(address, chain) {
  // Would implement per-chain metadata fetching
  return {};
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const chain = searchParams.get('chain');
  const search = searchParams.get('search');
  
  // Get single token
  if (address) {
    const token = tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, token });
  }
  
  // Filter tokens
  let results = [...tokens];
  
  if (chain) {
    results = results.filter(t => t.chain === chain);
  }
  
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(t => 
      t.name?.toLowerCase().includes(q) ||
      t.symbol?.toLowerCase().includes(q) ||
      t.address?.toLowerCase().includes(q)
    );
  }
  
  // Sort by volume by default
  results.sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0));
  
  return NextResponse.json({
    success: true,
    count: results.length,
    tokens: results
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, token } = body;
    
    if (action === 'add') {
      // Validate required fields
      if (!token.address || !token.chain || !token.symbol || !token.name) {
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required fields: address, chain, symbol, name' 
        }, { status: 400 });
      }
      
      // Check if already exists
      const existing = tokens.find(t => 
        t.address.toLowerCase() === token.address.toLowerCase() && 
        t.chain === token.chain
      );
      
      if (existing) {
        return NextResponse.json({ 
          success: false, 
          error: 'Token already exists. Use update instead.' 
        }, { status: 409 });
      }
      
      // Add new token
      const newToken = {
        address: token.address,
        chain: token.chain,
        name: token.name,
        symbol: token.symbol.toUpperCase(),
        logo: token.logo || null,
        website: token.website || null,
        twitter: token.twitter || null,
        telegram: token.telegram || null,
        description: token.description || null,
        price: 0,
        change24h: 0,
        volume24h: 0,
        mcap: 0,
        verified: false,
        vouches: [],
        added: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0]
      };
      
      tokens.push(newToken);
      
      return NextResponse.json({
        success: true,
        message: 'Token added successfully (FREE!)',
        token: newToken
      });
    }
    
    if (action === 'update') {
      const index = tokens.findIndex(t => 
        t.address.toLowerCase() === token.address.toLowerCase()
      );
      
      if (index === -1) {
        return NextResponse.json({ 
          success: false, 
          error: 'Token not found' 
        }, { status: 404 });
      }
      
      // Update allowed fields (FREE!)
      const updatable = ['name', 'symbol', 'logo', 'website', 'twitter', 'telegram', 'description'];
      for (const field of updatable) {
        if (token[field] !== undefined) {
          tokens[index][field] = token[field];
        }
      }
      tokens[index].updated = new Date().toISOString().split('T')[0];
      
      return NextResponse.json({
        success: true,
        message: 'Token updated successfully (FREE!)',
        token: tokens[index]
      });
    }
    
    if (action === 'vouch') {
      // Add a vouch (community verification)
      const { address, voucher } = body;
      const token = tokens.find(t => t.address.toLowerCase() === address.toLowerCase());
      
      if (!token) {
        return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
      }
      
      if (!token.vouches.includes(voucher)) {
        token.vouches.push(voucher);
        // Auto-verify if 3+ vouches
        if (token.vouches.length >= 3) {
          token.verified = true;
        }
      }
      
      return NextResponse.json({
        success: true,
        vouches: token.vouches.length,
        verified: token.verified
      });
    }
    
    if (action === 'refresh-price') {
      // Refresh price from DEX
      const { address, chain } = body;
      const token = tokens.find(t => 
        t.address.toLowerCase() === address.toLowerCase()
      );
      
      if (!token) {
        return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
      }
      
      if (chain === 'solana') {
        const price = await fetchJupiterPrice(address);
        if (price) {
          token.price = price;
          token.updated = new Date().toISOString().split('T')[0];
        }
      }
      
      return NextResponse.json({
        success: true,
        price: token.price
      });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
