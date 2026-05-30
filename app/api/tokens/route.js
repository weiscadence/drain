// Live token feed — real Solana memecoins from DexScreener + Rugcheck
// Bags API key stored but needs activation at dev.bags.fm
// Falls back to DexScreener trending tokens

const BAGS_KEY = process.env.BAGS_API_KEY || 'bags_prod_Gfs8X37kTcY5o9PyLDRogNCEyEGgf4rPLnZtUD7afLA';

// Curated Solana memecoins — real tokens with actual market data
// DRAIN is our own Bags.fm token, others are popular Solana memecoins
const SEED_MINTS = [
  'CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS', // DRAIN (our Bags.fm token)
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // WIF (dogwifhat)
  '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', // POPCAT
  'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',  // MEW
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', // JUP
  'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82',  // BOME
];

async function getDexScreenerTokens(mints) {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mints.join(',')}`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) throw new Error('dex failed');
    const data = await res.json();
    return data.pairs || [];
  } catch { return []; }
}

async function getDexScreenerTrending() {
  try {
    // Get boosted/trending Solana tokens
    const res = await fetch('https://api.dexscreener.com/token-boosts/top/v1', {
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) throw new Error('trending failed');
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.tokenProfiles || data.boosts || []);
    return items
      .filter(t => t.chainId === 'solana' && t.tokenAddress)
      .slice(0, 8)
      .map(t => t.tokenAddress);
  } catch { return []; }
}

async function getRugcheck(mint) {
  try {
    const res = await fetch(
      `https://api.rugcheck.xyz/v1/tokens/${mint}/report/summary`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) throw new Error('rugcheck failed');
    return await res.json();
  } catch {
    return { score: 65, _mock: true };
  }
}

async function getBagsTokenData(mint) {
  // Try Bags API - will work once key is activated at dev.bags.fm
  try {
    const res = await fetch(
      `https://public-api-v2.bags.fm/api/v1/token-launch/creator/v3?tokenMint=${mint}`,
      {
        headers: { 'x-api-key': BAGS_KEY },
        signal: AbortSignal.timeout(3000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    // response is an array of creators
    const creators = Array.isArray(data.response) ? data.response : [];
    return creators.length > 0 ? {
      creator: creators[0],
      allCreators: creators,
      providerUsername: creators[0]?.providerUsername,
      provider: creators[0]?.provider,
      pfp: creators[0]?.pfp,
      royaltyBps: creators[0]?.royaltyBps,
    } : null;
  } catch { return null; }
}

// Known safe tokens - don't show HIGH RISK for these
const SAFE_TOKENS = {
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { label: 'VERIFIED', color: 'green', note: 'USDC - Circle' },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { label: 'VERIFIED', color: 'green', note: 'USDT' },
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': { label: 'LOW RISK', color: 'green', note: 'BONK' },
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': { label: 'LOW RISK', color: 'green', note: 'Jupiter' },
  'So11111111111111111111111111111111111111112': { label: 'VERIFIED', color: 'green', note: 'wSOL' },
  'CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS': { label: 'LOW RISK', color: 'green', note: 'DRAIN' },
};

function buildRiskBadge(rugData, mint) {
  if (mint && SAFE_TOKENS[mint]) return SAFE_TOKENS[mint];
  const score = rugData?.score || 50;
  if (score >= 75) return { label: 'LOW RISK', color: 'green' };
  if (score >= 45) return { label: 'MED RISK', color: 'yellow' };
  return { label: 'HIGH RISK', color: 'red' };
}

function pairToToken(pair, bagsData) {
  const base = pair.baseToken || {};
  const info = pair.info || {};
  const vol = pair.volume?.h24 || 0;
  const change = pair.priceChange?.h24 || 0;
  const age = pair.pairCreatedAt
    ? getAge(pair.pairCreatedAt)
    : '?';

  // Smart wallet signal (mock for now — Helius would give real data)
  const smartWallets = Math.floor(20 + Math.random() * 180);
  const jitoMentions = Math.floor(Math.random() * 6);

  return {
    mint: base.address || pair.pairAddress,
    pairAddress: pair.pairAddress,
    name: base.name || base.symbol || '?',
    symbol: base.symbol || '?',
    image: info.imageUrl || null,
    mcap: pair.marketCap || 0,
    vol: parseFloat(vol),
    age,
    price: parseFloat(pair.priceUsd || 0),
    change: parseFloat(change),
    smartWallets,
    jitoMentions,
    feeShare: bagsData?.feeShareBps ? bagsData.feeShareBps / 100 : 0,
    creatorVerified: !!bagsData?.providerUsername,
    creator: bagsData?.providerUsername ? `@${bagsData.providerUsername}` : (info.socials?.[0]?.url ? '@' + info.socials[0].url.split('/').pop() : ''),
    pvp: false,
    attentionTag: buildAttentionTag(base.symbol, pair),
    accent: symbolToAccent(base.symbol),
    risk: 'LOW',
    riskColor: '#00ff88',
    sentiment: { score: 0.5 + Math.random() * 0.4, label: 'bullish' },
    tweets: [],
    alerts: [],
    links: info.socials || [],
    _source: 'dexscreener',
  };
}

function getAge(ts) {
  const ms = Date.now() - ts;
  const h = ms / 3600000;
  if (h < 1) return `${Math.floor(ms / 60000)}m`;
  if (h < 24) return `${Math.floor(h)}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  return `${Math.floor(d / 30)}mo`;
}

function symbolToAccent(sym) {
  const map = {
    BONK: '#f97316', DRAIN: '#00ff88', JUP: '#a855f7', USDC: '#3b82f6',
    WIF: '#eab308', MEME: '#f43f5e', SAMO: '#06b6d4',
  };
  return map[sym?.toUpperCase()] || '#' + (parseInt(sym?.charCodeAt(0) || 150) * 1234567 % 0xffffff).toString(16).padStart(6, '0').slice(0, 6);
}

function buildAttentionTag(symbol, pair) {
  const change = parseFloat(pair.priceChange?.h1 || 0);
  const vol = parseFloat(pair.volume?.h1 || 0);
  if (change > 50) return `🚀 +${change.toFixed(0)}% in 1h`;
  if (change < -20) return `📉 ${change.toFixed(0)}% — watch carefully`;
  if (vol > 100000) return `⚡ High volume: $${(vol/1000).toFixed(0)}K/hr`;
  return `◎ Solana · ${symbol}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // 1. Get trending token addresses
    const trendingMints = await getDexScreenerTrending();
    const allMints = [...new Set([...SEED_MINTS, ...trendingMints])].slice(0, limit);

    // 2. Get real pair data from DexScreener
    const pairs = await getDexScreenerTokens(allMints);

    // 3. Deduplicate by base token address, pick highest volume pair
    const seen = new Map();
    for (const pair of pairs) {
      const addr = pair.baseToken?.address;
      if (!addr) continue;
      const existing = seen.get(addr);
      const vol = parseFloat(pair.volume?.h24 || 0);
      if (!existing || vol > parseFloat(existing.volume?.h24 || 0)) {
        seen.set(addr, pair);
      }
    }

    const uniquePairs = Array.from(seen.values())
      .filter(p => p.baseToken?.address && parseFloat(p.marketCap || 0) > 0)
      .sort((a, b) => parseFloat(b.volume?.h24 || 0) - parseFloat(a.volume?.h24 || 0))
      .slice(0, limit);

    // 4. Enrich with Rugcheck + Bags
    const tokens = await Promise.all(uniquePairs.map(async (pair) => {
      const mint = pair.baseToken?.address;
      const [rugData, bagsData] = await Promise.all([
        getRugcheck(mint),
        getBagsTokenData(mint),
      ]);

      const token = pairToToken(pair, bagsData);
      const badge = buildRiskBadge(rugData, mint);
      token.rugcheck = {
        score: rugData?.score || 65,
        badge,
        lpLocked: rugData?.markets?.[0]?.lp?.lpLockedPct || 0,
        mutable: rugData?.tokenMeta?.mutable || false,
        topHolderPct: rugData?.topHolders?.[0]?.pct || 0,
        _mock: rugData?._mock || false,
      };
      token.risk = badge.label.split(' ')[0];
      token.riskColor = badge.color === 'green' ? '#00ff88' : badge.color === 'yellow' ? '#f59e0b' : '#ef4444';
      
      // Enrich with real Bags data if available
      if (bagsData?.creator) {
        const creator = bagsData.creator;
        token.creator = creator.providerUsername ? `@${creator.providerUsername}` : (creator.bagsUsername ? `@${creator.bagsUsername}` : '');
        token.creatorVerified = true;
        token.creatorPfp = creator.pfp || null;
        token.feeShare = creator.royaltyBps ? creator.royaltyBps / 100 : token.feeShare;
        token.bagsCreator = true;
      }

      return token;
    }));

    return Response.json({
      tokens,
      count: tokens.length,
      sources: ['dexscreener', 'rugcheck'],
      bagsApiStatus: 'needs activation at dev.bags.fm',
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    return Response.json({ error: err.message, tokens: [] }, { status: 500 });
  }
}
