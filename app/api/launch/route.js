import { NextResponse } from 'next/server';

/*
 * DRAIN LAUNCH API - Ethical Token Launcher
 * Agent-first programmatic token creation
 */

// In-memory storage (would be Solana on-chain in production)
let tokens = [];
let trades = [];

const FEE_STRUCTURE = {
  tradeFee: 0.003,      // 0.3%
  creatorShare: 0.5,    // 50% to creator
  liquidityShare: 0.3,  // 30% to liquidity
  platformShare: 0.2,   // 20% to platform
};

// Bonding curve price calculation
function calculatePrice(supply, maxSupply = 1_000_000_000) {
  const initialPrice = 0.00001;
  const multiplier = 10;
  return initialPrice * (1 + (supply / maxSupply) * multiplier);
}

// Calculate buy amount from SOL input
function calculateBuyAmount(token, solAmount) {
  const currentPrice = calculatePrice(token.supply, token.maxSupply);
  const tokensOut = solAmount / currentPrice;
  const fee = solAmount * FEE_STRUCTURE.tradeFee;
  return {
    tokensOut: Math.floor(tokensOut * 0.997), // minus fee
    fee,
    creatorReward: fee * FEE_STRUCTURE.creatorShare,
    newPrice: calculatePrice(token.supply + tokensOut, token.maxSupply),
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'list';

  if (action === 'list') {
    return NextResponse.json({
      success: true,
      tokens: tokens.map(t => ({
        ...t,
        currentPrice: calculatePrice(t.supply, t.maxSupply),
        marketCap: calculatePrice(t.supply, t.maxSupply) * t.supply,
      })),
      count: tokens.length,
    });
  }

  if (action === 'get') {
    const symbol = searchParams.get('symbol');
    const token = tokens.find(t => t.symbol === symbol);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      token: {
        ...token,
        currentPrice: calculatePrice(token.supply, token.maxSupply),
        marketCap: calculatePrice(token.supply, token.maxSupply) * token.supply,
        trades: trades.filter(t => t.symbol === symbol).slice(-50),
      },
    });
  }

  if (action === 'quote') {
    const symbol = searchParams.get('symbol');
    const amount = parseFloat(searchParams.get('amount') || '0.1');
    const side = searchParams.get('side') || 'buy';
    
    const token = tokens.find(t => t.symbol === symbol);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
    }
    
    if (side === 'buy') {
      const result = calculateBuyAmount(token, amount);
      return NextResponse.json({ success: true, quote: result });
    }
    
    // Sell quote
    const currentPrice = calculatePrice(token.supply, token.maxSupply);
    const solOut = amount * currentPrice * 0.997;
    return NextResponse.json({
      success: true,
      quote: {
        solOut,
        fee: amount * currentPrice * FEE_STRUCTURE.tradeFee,
      },
    });
  }

  if (action === 'fees') {
    return NextResponse.json({
      success: true,
      fees: FEE_STRUCTURE,
      comparison: {
        pumpFun: { tradeFee: 0.01, graduationFee: 6 },
        drainLaunch: { tradeFee: 0.003, graduationFee: 0 },
        savings: '70% lower fees, no graduation fee',
      },
    });
  }

  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const { name, symbol, description, wallet, agentId, twitter, website, image } = body;
      
      // Validation
      if (!name || !symbol || !wallet) {
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required fields: name, symbol, wallet' 
        }, { status: 400 });
      }
      
      if (symbol.length > 10) {
        return NextResponse.json({ 
          success: false, 
          error: 'Symbol must be 10 characters or less' 
        }, { status: 400 });
      }
      
      if (tokens.find(t => t.symbol === symbol.toUpperCase())) {
        return NextResponse.json({ 
          success: false, 
          error: 'Symbol already exists' 
        }, { status: 400 });
      }

      const token = {
        id: `token_${Date.now()}`,
        name,
        symbol: symbol.toUpperCase(),
        description: description || '',
        creator: wallet,
        agentId: agentId || null,
        isAgent: !!agentId,
        twitter: twitter || null,
        website: website || null,
        image: image || null,
        supply: 0,
        maxSupply: 1_000_000_000,
        createdAt: new Date().toISOString(),
        graduated: false,
        totalVolume: 0,
        creatorEarnings: 0,
        // Mock addresses (would be real Solana addresses)
        mint: `mint_${Date.now().toString(36)}`,
        bondingCurve: `curve_${Date.now().toString(36)}`,
        lpRewardsWallet: wallet,
      };

      tokens.push(token);

      return NextResponse.json({
        success: true,
        token: {
          ...token,
          currentPrice: calculatePrice(0, token.maxSupply),
        },
        message: 'Token created! Bonding curve active.',
        _note: 'Devnet only - mainnet after audit',
      });
    }

    if (action === 'buy' || action === 'sell') {
      const { symbol, amount, wallet } = body;
      
      const token = tokens.find(t => t.symbol === symbol);
      if (!token) {
        return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
      }

      const trade = {
        id: `trade_${Date.now()}`,
        symbol,
        side: action,
        amount,
        wallet,
        timestamp: new Date().toISOString(),
      };

      if (action === 'buy') {
        const result = calculateBuyAmount(token, amount);
        token.supply += result.tokensOut;
        token.totalVolume += amount;
        token.creatorEarnings += result.creatorReward;
        trade.tokensReceived = result.tokensOut;
        trade.creatorReward = result.creatorReward;
      } else {
        // Sell
        const price = calculatePrice(token.supply, token.maxSupply);
        const solOut = amount * price * 0.997;
        token.supply -= amount;
        token.totalVolume += solOut;
        trade.solReceived = solOut;
      }

      trades.push(trade);

      // Check graduation (69 SOL mcap)
      const mcap = calculatePrice(token.supply, token.maxSupply) * token.supply;
      if (mcap >= 69 && !token.graduated) {
        token.graduated = true;
        // Would migrate to Meteora here
      }

      return NextResponse.json({
        success: true,
        trade,
        token: {
          ...token,
          currentPrice: calculatePrice(token.supply, token.maxSupply),
          marketCap: mcap,
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
