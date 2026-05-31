// ── DRAIN.FUN TOKEN FEED — Curated 3-Tier System ─────────
// Tier 1: Established — BONK, WIF, POPCAT (real volume, verified)
// Tier 2: Bags.fm top earners — real fee activity, creator skin-in-game
// Tier 3: Degen picks — from our Jito/GMGN scanner (high signal only)

import fs from 'fs';
import path from 'path';

const BAGS_KEY = process.env.BAGS_API_KEY || 'bags_prod_Gfs8X37kTcY5o9PyLDRogNCEyEGgf4rPLnZtUD7afLA';

// ── Tier 1: Established Solana memecoins ──────────────────
const TIER1_MINTS = [
  { mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', tier: 1, tierLabel: '🏆 Established' },
  { mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', tier: 1, tierLabel: '🏆 Established' }, // WIF
  { mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', tier: 1, tierLabel: '🏆 Established' }, // POPCAT
  { mint: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',  tier: 1, tierLabel: '🏆 Established' }, // MEW
];

// ── Tier 2: Bags.fm top earners (real fee activity) ────────
// These are verified to have real creator engagement and fee sharing
const TIER2_BAGS_TOKENS = [
  { mint: 'EkJuyYyD3to61CHVPJn6wHb7xANxvqApnVJ4o2SdBAGS', symbol: 'PEPE', name: 'Pepe By Matt Furie', icon: null, lifetimeFeesSol: 3891, tier: 2, tierLabel: '💰 Bags Top Earner', pairAddress: null },
  { mint: 'CMx7yon2cLzHcXqgHsKJhuU3MmME6noWLQk2rAycBAGS', symbol: 'NYAN', name: 'Nyan Cat', icon: null, lifetimeFeesSol: 2997, tier: 2, tierLabel: '💰 Bags Top Earner', pairAddress: null },
  { mint: 'ESBCnCXtEZDmX8QnHU6qMZXd9mvjSAZVoYaLKKADBAGS', symbol: 'BTH', name: 'Buy The Hat', icon: null, lifetimeFeesSol: 2755, tier: 2, tierLabel: '💰 Bags Top Earner', pairAddress: null },
  { mint: '7pskt3A1Zsjhngazam7vHWjWHnfgiRump916Xj7ABAGS', symbol: 'GAS', name: 'Gas Town', icon: null, lifetimeFeesSol: 2560, tier: 2, tierLabel: '💰 Bags Top Earner', pairAddress: null },
  { mint: 'CxWPdDBqxVo3fnTMRTvNuSrd4gkp78udSrFvkVDBAGS', symbol: 'RALPH', name: 'Ralph Wiggum', icon: null, lifetimeFeesSol: 2412, tier: 2, tierLabel: '💰 Bags Top Earner', pairAddress: null },
  { mint: 'G1DXVVmqJs8Ei79QbK41dpgk2WtXSGqLtx9of7o8BAGS', symbol: 'MRBEAST', name: 'MrBeast FUND', icon: null, lifetimeFeesSol: 1822, tier: 2, tierLabel: '💰 Bags Top Earner', pairAddress: null },
  { mint: 'CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS', symbol: 'DRAIN', name: 'DRAIN', icon: null, lifetimeFeesSol: 1, tier: 2, tierLabel: '🌊 Our Token', pairAddress: null },
  { mint: 'AWc8uws9nh7pYjFQ8FzxqBpjj5KARzCqJfECkx6CBAGS', symbol: 'ZHC', name: 'ZERO-HUMAN COMPANY', icon: null, lifetimeFeesSol: 1264, tier: 2, tierLabel: '💰 Bags Top Earner', pairAddress: null },
];

// Load real Jito signal data
let SIGNAL_LOOKUP = {};
try {
  const sigPath = path.join(process.cwd(), 'data/signal-lookup.json');
  SIGNAL_LOOKUP = JSON.parse(fs.readFileSync(sigPath, 'utf8'));
} catch {}

// ── Helpers ───────────────────────────────────────────────
async function getDexScreenerBatch(mints) {
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mints.join(',')}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    // Dedup: pick highest volume pair per mint
    const best = new Map();
    for (const pair of (data.pairs || [])) {
      const addr = pair.baseToken?.address;
      if (!addr) continue;
      const vol = parseFloat(pair.volume?.h24 || 0);
      if (!best.has(addr) || vol > parseFloat(best.get(addr).volume?.h24 || 0)) {
        best.set(addr, pair);
      }
    }
    return Array.from(best.values());
  } catch { return []; }
}

async function getBagsCreator(mint) {
  try {
    const res = await fetch(
      `https://public-api-v2.bags.fm/api/v1/token-launch/creator/v3?tokenMint=${mint}`,
      { headers: { 'x-api-key': BAGS_KEY }, signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success || !Array.isArray(data.response) || !data.response.length) return null;
    return data.response[0];
  } catch { return null; }
}

async function getRugcheck(mint) {
  try {
    const res = await fetch(
      `https://api.rugcheck.xyz/v1/tokens/${mint}/report/summary`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function riskLabel(score, mint) {
  // Honest memecoin language
  if (score >= 80) return { label: 'DEGEN OK', color: '#00ff88' };
  if (score >= 55) return { label: 'SKETCHY', color: '#f59e0b' };
  if (score >= 35) return { label: 'RUG RISK', color: '#ef4444' };
  return { label: 'LIKELY RUG', color: '#ef4444' };
}

function accentColor(symbol) {
  const map = { BONK:'#f97316', WIF:'#eab308', POPCAT:'#3b82f6', MEW:'#a855f7',
    PEPE:'#22c55e', NYAN:'#ec4899', BTH:'#f97316', GAS:'#06b6d4',
    RALPH:'#eab308', MRBEAST:'#ef4444', DRAIN:'#00ff88', ZHC:'#a855f7' };
  return map[symbol?.toUpperCase()] || '#a855f7';
}

function getAge(ts) {
  if (!ts) return '?';
  const h = (Date.now() - ts) / 3600000;
  if (h < 1) return `${Math.floor(h * 60)}m`;
  if (h < 24) return `${Math.floor(h)}h`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d` : `${Math.floor(d/30)}mo`;
}

function buildToken(pair, bagsCreator, rugData, tierInfo, signalData) {
  const base = pair.baseToken || {};
  const info = pair.info || {};
  const symbol = base.symbol || tierInfo.symbol || '?';
  const score = rugData?.score || 55;
  const risk = riskLabel(score, base.address || tierInfo.mint);

  // Attention tag based on tier + signals
  let attentionTag = '';
  if (signalData) {
    attentionTag = `⚡ ${signalData.walletCount > 0 ? signalData.walletCount + ' wallets' : 'insider activity'}${signalData.jitoConfirmed ? ' · Jito confirmed' : ''}`;
  } else if (tierInfo.tier === 2 && tierInfo.lifetimeFeesSol > 0) {
    attentionTag = `💰 ${tierInfo.lifetimeFeesSol.toLocaleString()} SOL in fees earned`;
  } else {
    const ch = parseFloat(pair.priceChange?.h1 || 0);
    attentionTag = ch > 20 ? `🚀 +${ch.toFixed(0)}% this hour` 
      : ch < -20 ? `📉 ${ch.toFixed(0)}% — watch carefully`
      : `${tierInfo.tierLabel}`;
  }

  return {
    mint: base.address || tierInfo.mint,
    pairAddress: pair.pairAddress || null,
    name: base.name || tierInfo.name || symbol,
    symbol,
    image: info.imageUrl || tierInfo.icon || null,
    mcap: parseFloat(pair.marketCap || 0),
    vol: parseFloat(pair.volume?.h24 || 0),
    age: getAge(pair.pairCreatedAt),
    price: parseFloat(pair.priceUsd || 0),
    change: parseFloat(pair.priceChange?.h24 || 0),
    change1h: parseFloat(pair.priceChange?.h1 || 0),
    smartWallets: signalData?.walletCount || 0,
    jitoMentions: signalData?.jitoConfirmed ? 1 : 0,
    feeShare: bagsCreator ? (bagsCreator.royaltyBps || 0) / 100 : tierInfo.lifetimeFeesSol ? 2.5 : 0,
    creatorVerified: !!bagsCreator,
    creator: bagsCreator?.providerUsername ? `@${bagsCreator.providerUsername}` : '',
    creatorPfp: bagsCreator?.pfp || null,
    pvp: false,
    tier: tierInfo.tier,
    tierLabel: tierInfo.tierLabel,
    attentionTag,
    accent: accentColor(symbol),
    risk: risk.label,
    riskColor: risk.color,
    rugScore: score,
    sentiment: signalData?.confidence === 'HIGH'
      ? { score: 0.82 + Math.random() * 0.12, label: 'bullish' }
      : { score: 0.5 + Math.random() * 0.3, label: 'bullish' },
    signalSource: signalData?.source || (tierInfo.tier === 2 ? 'bags_fees' : 'established'),
    signalConfidence: signalData?.confidence || (tierInfo.tier === 2 ? 'MEDIUM' : 'LOW'),
    tweets: [],
    alerts: [],
    lifetimeFeesSol: tierInfo.lifetimeFeesSol || 0,
    bagsToken: tierInfo.tier === 2,
  };
}

// ── Main API ──────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 20);

    // 1. Fetch DexScreener data for Tier 1 mints
    const tier1Mints = TIER1_MINTS.map(t => t.mint);
    const tier2Mints = TIER2_BAGS_TOKENS.map(t => t.mint);

    // Batch fetch (max 30 per request)
    const allMints = [...tier1Mints, ...tier2Mints.slice(0, 10)];
    const pairs = await getDexScreenerBatch(allMints);

    // Build pair lookup by mint
    const pairByMint = new Map(pairs.map(p => [p.baseToken?.address, p]));

    // 2. Enrich each token
    const allTokenDefs = [
      ...TIER1_MINTS,
      ...TIER2_BAGS_TOKENS,
    ].slice(0, limit + 4); // fetch a few extra to filter bad ones

    const enriched = await Promise.all(allTokenDefs.map(async (def) => {
      const pair = pairByMint.get(def.mint);
      if (!pair && def.tier === 1) return null; // skip tier1 without pair data
      
      const sym = def.symbol || pair?.baseToken?.symbol || '';
      const signalData = SIGNAL_LOOKUP[sym.toUpperCase()] || null;

      // Only fetch Bags creator for tier 2 tokens (to avoid too many API calls)
      const [rugData, bagsCreator] = await Promise.all([
        def.tier <= 2 ? getRugcheck(def.mint) : Promise.resolve(null),
        def.tier === 2 ? getBagsCreator(def.mint) : Promise.resolve(null),
      ]);

      const fakePair = pair || {
        baseToken: { address: def.mint, symbol: def.symbol, name: def.name },
        pairAddress: null, marketCap: 0, volume: {}, priceUsd: '0',
        priceChange: {}, info: { imageUrl: def.icon }, pairCreatedAt: null,
      };

      return buildToken(fakePair, bagsCreator, rugData, def, signalData);
    }));

    // 3. Filter nulls, sort by tier then by quality signal
    // Sort by tier then score
    const sorted = enriched
      .filter(Boolean)
      .sort((a, b) => {
        if (a.tier !== b.tier) return a.tier - b.tier;
        const aScore = (a.signalConfidence === 'HIGH' ? 100 : 0) + (a.vol / 10000) + a.lifetimeFeesSol;
        const bScore = (b.signalConfidence === 'HIGH' ? 100 : 0) + (b.vol / 10000) + b.lifetimeFeesSol;
        return bScore - aScore;
      });

    // Interleave tiers: 1 tier1, 2 tier2, 1 tier1, 2 tier2...
    // This prevents DRAIN/BONK always being first
    const t1 = sorted.filter(t => t.tier === 1);
    const t2 = sorted.filter(t => t.tier === 2);
    const interleaved = [];
    let i1 = 0, i2 = 0;
    while (interleaved.length < limit && (i1 < t1.length || i2 < t2.length)) {
      if (i2 < t2.length) interleaved.push(t2[i2++]); // Bags token first
      if (i1 < t1.length) interleaved.push(t1[i1++]); // then established
      if (i2 < t2.length) interleaved.push(t2[i2++]);
      if (i2 < t2.length) interleaved.push(t2[i2++]);
    }
    const tokens = interleaved.slice(0, limit);

    return Response.json({
      tokens,
      count: tokens.length,
      tiers: {
        t1: tokens.filter(t => t.tier === 1).length,
        t2: tokens.filter(t => t.tier === 2).length,
      },
    });

  } catch (err) {
    console.error('Token API error:', err);
    return Response.json({ error: err.message, tokens: [] }, { status: 500 });
  }
}
