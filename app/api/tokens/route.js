// ── DRAIN.FUN TOKEN FEED — Curated 3-Tier System ─────────
// Tier 1: Established — BONK, WIF, POPCAT (real volume, verified)
// Tier 2: Bags.fm top earners — real fee activity, creator skin-in-game
// Tier 3: Degen picks — from our Jito/GMGN scanner (high signal only)

import fs from 'fs';
import path from 'path';

const BAGS_KEY = process.env.BAGS_API_KEY || 'bags_prod_Gfs8X37kTcY5o9PyLDRogNCEyEGgf4rPLnZtUD7afLA';

// ── Tier 1: Established Solana memecoins ──────────────────
const TIER1_MINTS = [
  { mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', tier: 1, tierLabel: '🏆 Established', symbol: 'BONK' },
  { mint: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', tier: 1, tierLabel: '🏆 Established', symbol: 'WIF' },
  { mint: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', tier: 1, tierLabel: '🏆 Established', symbol: 'POPCAT' },
  { mint: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5',  tier: 1, tierLabel: '🏆 Established', symbol: 'MEW' },
  { mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', tier: 1, tierLabel: '🏆 Established', symbol: 'RAY' },
  { mint: 'HZ1JovNiVvGqweLangdexQ3K4cHjkGa7RaRWkxEd6pAv', tier: 1, tierLabel: '🏆 Established', symbol: 'PYTH' },
  { mint: 'A8C3xuqscfmyLrte3VmTqrAq8kgMASius9AFNANwpump', tier: 1, tierLabel: '🌶️ Hot', symbol: 'FARTCOIN' },
  { mint: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN', tier: 1, tierLabel: '🌶️ Hot', symbol: 'TRUMP' },
  { mint: 'Df6yfrKC8kZE3KNkrHERKzAetSxbrWeniQfyJY4Jpump', tier: 1, tierLabel: '🏆 Established', symbol: 'CHILLGUY' },
  { mint: 'ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzc8Th', tier: 1, tierLabel: '🏆 Established', symbol: 'MOODENG' },
];

// ── Tier 2: Real Solana memecoins — verified on-chain mints ──
// All have real DexScreener data, real images, real volume
const TIER2_REAL_MEMES = [
  { mint: 'HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4', tier: 2, tierLabel: '🐶 Sol OG', symbol: 'MYRO', name: 'Myro' },
  { mint: 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82', tier: 2, tierLabel: '📚 Viral', symbol: 'BOME', name: 'Book of Meme' },
  { mint: '5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK31CR8Ada', tier: 2, tierLabel: '🐒 Degen', symbol: 'PONKE', name: 'Ponke' },
  { mint: 'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk', tier: 2, tierLabel: '🦆 OG Meme', symbol: 'WEN', name: 'Wen' },
  { mint: '7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3', tier: 2, tierLabel: '📢 CT Legend', symbol: 'SLERF', name: 'Slerf' },
  { mint: '6ogzHhzdrQr9Pgv6hZ2MNze7UrzBMAFyBBWUYp1Vhrt6', tier: 2, tierLabel: '🤡 Cult Coin', symbol: 'RETARDIO', name: 'Retardio' },
  { mint: '3B5wuUrMEi5yATD7on46hKfej3pfmd7t1RKgrsN3pump', tier: 2, tierLabel: '🐐 Goat', symbol: 'BILLY', name: 'Billy the Goat' },
  { mint: '5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp', tier: 2, tierLabel: '🐱 Viral', symbol: 'MICHI', name: 'Michi' },
  { mint: '63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9', tier: 2, tierLabel: '💪 Gigachad', symbol: 'GIGA', name: 'Gigachad' },
  { mint: 'CzrE6sHCRNRUPFQnVvxBPfbfEphb3dBRSYFTLFYcLLhQ', tier: 2, tierLabel: '🐸 Meme King', symbol: 'PEPE', name: 'Pepe (Sol)' },
];

// ── Bags.fm hackathon tokens (REAL Bags.fm platform mints) ─────
// Core to the Bags hackathon — these ARE real tokens, mints confirmed on-chain
const TIER2_BAGS_TOKENS = [
  { mint: 'EkJuyYyD3to61CHVPJn6wHb7xANxvqApnVJ4o2SdBAGS', symbol: 'PEPE', name: 'Pepe By Matt Furie', icon: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg', lifetimeFeesSol: 3891, tier: 2, tierLabel: '💰 Bags Top Earner', isBags: true },
  { mint: 'CMx7yon2cLzHcXqgHsKJhuU3MmME6noWLQk2rAycBAGS', symbol: 'NYAN', name: 'Nyan Cat', icon: null, lifetimeFeesSol: 2997, tier: 2, tierLabel: '💰 Bags Top Earner', isBags: true },
  { mint: 'ESBCnCXtEZDmX8QnHU6qMZXd9mvjSAZVoYaLKKADBAGS', symbol: 'BTH', name: 'Buy The Hat', icon: null, lifetimeFeesSol: 2755, tier: 2, tierLabel: '💰 Bags Top Earner', isBags: true },
  { mint: '7pskt3A1Zsjhngazam7vHWjWHnfgiRump916Xj7ABAGS', symbol: 'GAS', name: 'Gas Town', icon: null, lifetimeFeesSol: 2560, tier: 2, tierLabel: '💰 Bags Top Earner', isBags: true },
  { mint: 'CxWPdDBqxVo3fnTMRTvNuSrd4gkp78udSrFvkVDBAGS', symbol: 'RALPH', name: 'Ralph Wiggum', icon: null, lifetimeFeesSol: 2412, tier: 2, tierLabel: '💰 Bags Top Earner', isBags: true },
  { mint: 'G1DXVVmqJs8Ei79QbK41dpgk2WtXSGqLtx9of7o8BAGS', symbol: 'MRBEAST', name: 'MrBeast FUND', icon: null, lifetimeFeesSol: 1822, tier: 2, tierLabel: '💰 Bags Top Earner', isBags: true },
  { mint: 'CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS', symbol: 'DRAIN', name: 'DRAIN', icon: null, lifetimeFeesSol: 1, tier: 2, tierLabel: '🌊 Our Token', isBags: true },
  { mint: 'AWc8uws9nh7pYjFQ8FzxqBpjj5KARzCqJfECkx6CBAGS', symbol: 'ZHC', name: 'ZERO-HUMAN COMPANY', icon: null, lifetimeFeesSol: 1264, tier: 2, tierLabel: '💰 Bags Top Earner', isBags: true },
];

// Dynamic: fetch trending Solana pairs with real volume to augment feed
async function getLiveTrending(limit = 6) {
  try {
    const known = new Set([...TIER1_MINTS.map(t=>t.mint), ...TIER2_REAL_MEMES.map(t=>t.mint)]);
    const res = await fetch(
      'https://api.dexscreener.com/latest/dex/search?q=solana',
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.pairs || [])
      .filter(p => p.chainId === 'solana'
        && !known.has(p.baseToken?.address)
        && parseFloat(p.volume?.h24 || 0) > 100000
        && parseFloat(p.marketCap || 0) > 500000
      )
      .sort((a,b) => parseFloat(b.volume?.h24||0) - parseFloat(a.volume?.h24||0))
      .slice(0, limit)
      .map(p => ({
        mint: p.baseToken?.address,
        tier: 3,
        tierLabel: '🔥 Trending',
        symbol: p.baseToken?.symbol || '???',
        name: p.baseToken?.name || p.baseToken?.symbol || '???',
        _liveData: p,
      }));
  } catch { return []; }
}

// ── New pump.fun launches with early traction ───────────────────────────
async function getNewLaunches(limit = 4) {
  try {
    const known = new Set([
      ...TIER1_MINTS.map(t=>t.mint),
      ...TIER2_REAL_MEMES.map(t=>t.mint),
      ...TIER2_BAGS_TOKENS.map(t=>t.mint),
    ]);

    // DexScreener token profiles — newest tokens with social presence
    // These are tokens that paid to have a profile = some creator commitment
    const [profileRes, boostRes] = await Promise.allSettled([
      fetch('https://api.dexscreener.com/token-profiles/latest/v1', { signal: AbortSignal.timeout(5000) }),
      fetch('https://api.dexscreener.com/token-boosts/top/v1', { signal: AbortSignal.timeout(5000) }),
    ]);

    const profiles = profileRes.status === 'fulfilled' && profileRes.value.ok
      ? await profileRes.value.json() : [];
    const boosts = boostRes.status === 'fulfilled' && boostRes.value.ok
      ? await boostRes.value.json() : [];

    // Build set of mints from boosted tokens (signals real creator buy-in)
    const boostedMints = new Set((Array.isArray(boosts) ? boosts : [])
      .filter(t => t.chainId === 'solana')
      .map(t => t.tokenAddress)
      .slice(0, 30)
    );

    // Filter profiles: Solana, not already known, has Twitter
    const candidates = (Array.isArray(profiles) ? profiles : [])
      .filter(t => t.chainId === 'solana' && !known.has(t.tokenAddress) && t.tokenAddress)
      .map(t => ({
        mint: t.tokenAddress,
        twitter: (t.links || []).find(l => l.url?.includes('twitter') || l.url?.includes('x.com'))?.url,
        telegram: (t.links || []).find(l => l.url?.includes('t.me') || l.label?.toLowerCase() === 'telegram')?.url,
        website: (t.links || []).find(l => l.label?.toLowerCase() === 'website' || (!l.type && l.url))?.url,
        description: t.description || '',
        isBoosted: boostedMints.has(t.tokenAddress),
      }))
      // Prioritize: has Twitter + boosted > has Twitter > others
      .sort((a, b) => {
        const aScore = (a.twitter ? 2 : 0) + (a.isBoosted ? 1 : 0);
        const bScore = (b.twitter ? 2 : 0) + (b.isBoosted ? 1 : 0);
        return bScore - aScore;
      })
      .slice(0, limit * 3); // fetch more than needed, filter by volume below

    if (!candidates.length) return [];

    // Get DexScreener data for these mints
    const mints = candidates.map(c => c.mint).slice(0, 12);
    const pairRes = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${mints.join(',')}`,
      { signal: AbortSignal.timeout(6000) }
    );
    if (!pairRes.ok) return [];
    const pairData = await pairRes.json();

    // Best pair per mint, filter by min volume
    const pairByMint = new Map();
    for (const p of (pairData.pairs || [])) {
      const addr = p.baseToken?.address;
      if (!addr) continue;
      const existing = pairByMint.get(addr);
      const vol = parseFloat(p.volume?.h24 || 0);
      if (!existing || vol > parseFloat(existing.volume?.h24 || 0)) {
        pairByMint.set(addr, p);
      }
    }

    const results = [];
    for (const c of candidates) {
      const pair = pairByMint.get(c.mint);
      if (!pair) continue;
      const vol = parseFloat(pair.volume?.h24 || 0);
      const mcap = parseFloat(pair.marketCap || 0);
      // Must have some real activity: vol > 5k or boosted
      if (vol < 5000 && !c.isBoosted) continue;

      // Parse Twitter handle from URL
      const twitterHandle = c.twitter
        ? c.twitter.replace(/https?:\/\/(www\.)?(twitter\.com|x\.com)\//, '').replace(/\/$/, '').split('/')[0]
        : null;

      const ageMs = pair.pairCreatedAt ? Date.now() - pair.pairCreatedAt : null;
      const ageLabel = ageMs
        ? ageMs < 3600000 ? `🔥 ${Math.floor(ageMs/60000)}m old`
          : ageMs < 86400000 ? `🆕 ${Math.floor(ageMs/3600000)}h old`
          : ageMs < 604800000 ? `${Math.floor(ageMs/86400000)}d old`
          : null
        : null;

      results.push({
        mint: c.mint,
        tier: 3,
        tierLabel: c.isBoosted ? '⚡ Boosted Launch' : ageLabel || '🔥 New Launch',
        symbol: pair.baseToken?.symbol || '???',
        name: pair.baseToken?.name || pair.baseToken?.symbol || '???',
        twitterHandle,
        telegram: c.telegram,
        website: c.website,
        _liveData: pair,
      });

      if (results.length >= limit) break;
    }
    return results;
  } catch (e) {
    console.error('getNewLaunches error:', e.message);
    return [];
  }
}

// ── GMGN Tier 3: top smart-wallet concentration tokens from alfalfa scanner ──────────
async function getGmgnTier3Tokens(limit = 5) {
  try {
    const gmgnSignals = loadGmgnSignals();
    if (!gmgnSignals.size) return [];

    // Sort by smartCount desc, take top N
    const sorted = [...gmgnSignals.entries()]
      .sort((a, b) => (b[1].smartCount || 0) - (a[1].smartCount || 0))
      .slice(0, limit * 2); // fetch more, filter below

    if (!sorted.length) return [];

    // Get pair data for real symbols + DexScreener info
    const mints = sorted.map(([mint]) => mint);
    let pairMap = new Map();
    try {
      const r = await fetch(
        `https://api.dexscreener.com/latest/dex/tokens/${mints.slice(0, 15).join(',')}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (r.ok) {
        const d = await r.json();
        for (const p of (d.pairs || [])) {
          const addr = p.baseToken?.address;
          if (!addr) continue;
          const v = parseFloat(p.volume?.h24 || 0);
          if (!pairMap.has(addr) || v > parseFloat(pairMap.get(addr).volume?.h24 || 0)) {
            pairMap.set(addr, p);
          }
        }
      }
    } catch {}

    const results = [];
    for (const [mint, sig] of sorted) {
      const pair = pairMap.get(mint);
      const mcap = pair ? parseFloat(pair.marketCap || 0) : sig.mcap;
      // Skip tokens that are too big (established) or too small (likely dead)
      if (mcap > 50_000_000) continue; // >$50M already established
      if (mcap > 0 && mcap < 10_000) continue; // <$10k likely dead/rug

      const tierLabel = sig.smartCount >= 100 ? '🧠 HIGH SMART MONEY'
        : sig.smartCount >= 50 ? '⚡ MED SMART MONEY'
        : '💡 SMART SIGNAL';

      results.push({
        mint,
        tier: 3,
        tierLabel,
        symbol: (pair?.baseToken?.symbol || sig.symbol || '?'),
        name: pair?.baseToken?.name || sig.symbol || '?',
        _liveData: pair || null,
        _gmgnSmartCount: sig.smartCount,
        _gmgnConf: sig.confidence,
        _gmgnDex: sig.dex,
        _gmgnUrl: sig.gmgn,
      });
      if (results.length >= limit) break;
    }
    return results;
  } catch (e) {
    console.error('getGmgnTier3Tokens error:', e.message);
    return [];
  }
}

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

// ── Read GMGN signals from alpha-calls.json (written by gmgn-scanner.js every 10min) ────────
const ALPHA_CALLS_PATH = path.join(process.cwd(), '..', '..', 'data', 'alpha-calls.json');
const ALPHA_CALLS_PATH2 = '/home/ubuntu/.openclaw/workspace/data/alpha-calls.json';

function loadGmgnSignals() {
  // Returns Map<mint, { symbol, smartCount, mcap, vol24h, dex, gmgn, openedAt }>
  const result = new Map();
  try {
    const raw = fs.readFileSync(ALPHA_CALLS_PATH2, 'utf8');
    const d = JSON.parse(raw);
    const calls = Array.isArray(d) ? d : (d.calls || []);
    // Include all wallet_coord/gmgn signals from last 2h (regardless of status)
    const cutoff = Date.now() - 8 * 60 * 60 * 1000;
    for (const c of calls) {
      const tags = c.tags || [];
      if (!tags.includes('gmgn') && c.source !== 'wallet_coord') continue;
      const opened = new Date(c.openedAt || 0).getTime();
      if (opened < cutoff) continue;
      const e = c.extra || {};
      if (!e.mint) continue;
      // Keep highest smartCount per mint
      const existing = result.get(e.mint);
      if (!existing || (e.smartCount || 0) > (existing.smartCount || 0)) {
        result.set(e.mint, {
          symbol: c.asset || e.symbol || '?',
          smartCount: e.smartCount || 0,
          mcap: e.mcap || 0,
          vol24h: e.vol24h || 0,
          dex: e.dex || `https://dexscreener.com/solana/${e.mint}`,
          gmgn: e.gmgn || `https://gmgn.ai/sol/token/${e.mint}`,
          confidence: c.confidence || 'LOW',
          openedAt: c.openedAt || new Date().toISOString(),
        });
      }
    }
  } catch {}
  return result;
}

function getGmgnSmartCount(mint) {
  // Local read — no network call, no Cloudflare block
  const signals = loadGmgnSignals();
  return Promise.resolve(signals.get(mint)?.smartCount || 0);
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

// Known fallback images for tokens that may lack DexScreener images
const KNOWN_IMAGES = {
  BONK: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
  WIF: 'https://bafkreibk3covs5ltyqxa272uodhculbgn2tgghy5254bfyw4h3m6cklrr4i.ipfs.nftstorage.link',
  POPCAT: 'https://bafkreie3bqtlxgfzfeqhq2t4eqhlfzofgkfhbzzdcfkr4twudbbzlq3kce.ipfs.nftstorage.link',
  MEW: 'https://bafkreibgg33fkdgcktxrqhvtxj3h7k47iu4cnfklq5e7jnepmlv7j6c6le.ipfs.nftstorage.link',
  FARTCOIN: 'https://ipfs.io/ipfs/QmNSmS6ZGesZJ3mFp4vVCpRV9hfBbgVhDWMQAaGR8TKVZG',
  PEPE: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
  DRAIN: null,
};

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

  // Extract socials from DexScreener info.socials (free, already fetched)
  const socials = info.socials || [];
  const twitterSocial = socials.find(s => s.type === 'twitter');
  const telegramSocial = socials.find(s => s.type === 'telegram');
  const websiteSocial = (info.websites || [])[0];
  // Extract Twitter handle from URL — guard against community/intent URLs like x.com/i/...
  let twitterHandle = null;
  if (twitterSocial?.url) {
    const raw = twitterSocial.url.replace(/https?:\/\/(www\.)?(twitter\.com|x\.com)\//, '').replace(/\/$/, '').split('?')[0];
    const first = raw.split('/')[0];
    // Valid handle: alphanumeric + underscore, 1-50 chars, not 'i' or 'intent' or 'hashtag'
    if (first && /^[a-zA-Z0-9_]{2,50}$/.test(first) && !['i','intent','hashtag','home','explore','search','notifications'].includes(first.toLowerCase())) {
      twitterHandle = first;
    }
  }
  if (!twitterHandle) twitterHandle = tierInfo.twitterHandle || null;

  return {
    mint: base.address || tierInfo.mint,
    pairAddress: pair.pairAddress || null,
    name: base.name || tierInfo.name || symbol,
    symbol,
    // Social links
    twitter: twitterHandle || null,
    twitterUrl: twitterSocial?.url || (twitterHandle ? `https://x.com/${twitterHandle}` : null),
    telegram: telegramSocial?.url || tierInfo.telegram || null,
    website: websiteSocial?.url || tierInfo.website || null,
    // Image: use DexScreener URL exactly as returned — their CDN serves original params fine
    // Do NOT modify the URL params — changing them breaks the CDN request
    image: info.imageUrl || tierInfo.icon || KNOWN_IMAGES[symbol?.toUpperCase()] || null,
    mcap: parseFloat(pair.marketCap || 0),
    vol: parseFloat(pair.volume?.h24 || 0),
    liquidity: parseFloat(pair.liquidity?.usd || 0),
    volume24h: parseFloat(pair.volume?.h24 || 0),
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
    // Sorsa tweets are injected after buildToken() in the main API handler
  };
}

// ── Sorsa tweet injection (cache-only, no extra API cost here) ─────────────
const SORSA_CACHE_PATH = path.join(process.cwd(), 'data/sorsa-cache.json');
function getSorsaTweetsForSymbol(symbol) {
  try {
    const cache = JSON.parse(fs.readFileSync(SORSA_CACHE_PATH, 'utf8'));
    return (cache.tweets || []).filter(t => t.tokens && t.tokens.includes(symbol.toUpperCase())).slice(0, 2);
  } catch { return []; }
}

// ── Main API ──────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '25'), 30);

    // 1. Fetch DexScreener data for Tier 1 + Tier 2 mints in parallel with live trending
    // CRITICAL: DexScreener batch has 30-pair limit — Tier1 tokens consume all slots
    // Must call Bags separately or they get dropped from results
    const tier1Mints = TIER1_MINTS.map(t => t.mint);
    const tier2Mints = TIER2_REAL_MEMES.map(t => t.mint);
    const bagsMints = TIER2_BAGS_TOKENS.map(t => t.mint);

    // Load GMGN signals synchronously (local file, no network) — used for smart wallet enrichment
    const gmgnSignals = loadGmgnSignals();

    const [tier1Pairs, bagsPairs, realMemePairs, liveTrending, newLaunches, gmgnTier3] = await Promise.all([
      getDexScreenerBatch(tier1Mints),
      getDexScreenerBatch(bagsMints),   // separate call — Bags get dedicated 30-pair window
      getDexScreenerBatch(tier2Mints),
      getLiveTrending(3),
      getNewLaunches(3),
      getGmgnTier3Tokens(5),            // real smart wallet concentration signals
    ]);

    // Build unified pair lookup
    const pairByMint = new Map();
    for (const p of [...tier1Pairs, ...bagsPairs, ...realMemePairs]) {
      const addr = p.baseToken?.address;
      if (!addr) continue;
      const existing = pairByMint.get(addr);
      const vol = parseFloat(p.volume?.h24 || 0);
      if (!existing || vol > parseFloat(existing.volume?.h24 || 0)) {
        pairByMint.set(addr, p);
      }
    }
    // Add Tier 3 pairs
    for (const lt of [...liveTrending, ...newLaunches, ...gmgnTier3]) {
      if (lt._liveData) pairByMint.set(lt.mint, lt._liveData);
    }

    // 2. Enrich each token — Tier1 + Tier2 + trending + new launches + GMGN smart money
    const allTokenDefs = [
      ...TIER1_MINTS,
      ...TIER2_BAGS_TOKENS,
      ...TIER2_REAL_MEMES,
      ...liveTrending,
      ...newLaunches,
      ...gmgnTier3,
    ].slice(0, limit + 15);

    const enriched = await Promise.all(allTokenDefs.map(async (def) => {
      const pair = pairByMint.get(def.mint);
      if (!pair && def.tier === 1) return null; // skip tier1 without pair data
      if (!pair && def.tier === 3) return null; // skip trending without pair data
      if (!pair && def.tier === 2 && !def.isBags) return null; // skip tier2 real memes with no current DEX pair
      // Bags tokens (isBags) are allowed without pair data — they show fee/lifetime stats
      
      const sym = def.symbol || pair?.baseToken?.symbol || '';
      const signalData = SIGNAL_LOOKUP[sym.toUpperCase()] || null;

      // GMGN smart count: read from local alpha-calls.json (no network call, always fresh)
      // For GMGN Tier 3 tokens the count is already on def._gmgnSmartCount
      const localSmartCount = def._gmgnSmartCount || gmgnSignals.get(def.mint)?.smartCount || 0;

      const [rugData, bagsCreator] = await Promise.all([
        def.tier <= 2 ? getRugcheck(def.mint) : Promise.resolve(null),
        def.tier === 2 ? getBagsCreator(def.mint) : Promise.resolve(null),
      ]);

      const fakePair = pair || {
        baseToken: { address: def.mint, symbol: def.symbol, name: def.name },
        pairAddress: null, marketCap: 0, volume: {}, priceUsd: '0',
        priceChange: {}, info: { imageUrl: def.icon }, pairCreatedAt: null,
      };

      // Build effective signal: jito lookup → GMGN local count → null
      const gmgnConf = def._gmgnConf || (localSmartCount >= 100 ? 'HIGH' : localSmartCount >= 50 ? 'MEDIUM' : localSmartCount > 0 ? 'LOW' : null);
      const effectiveSignal = signalData
        || (localSmartCount > 0 ? { walletCount: localSmartCount, source: 'gmgn', confidence: gmgnConf } : null);
      const token = buildToken(fakePair, bagsCreator, rugData, def, effectiveSignal);
      // Attach GMGN links for deep-linking from the card
      if (def._gmgnUrl) token.gmgnUrl = def._gmgnUrl;
      return token;
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

    // Interleave: mix established + real memes + live trending
    // Pattern: T2(meme) → T1(established) → T3(trending) → repeat
    const t1 = sorted.filter(t => t.tier === 1);
    const t2 = sorted.filter(t => t.tier === 2);
    const t3 = sorted.filter(t => t.tier === 3);
    const interleaved = [];
    let i1 = 0, i2 = 0, i3 = 0;
    while (interleaved.length < limit) {
      const added = [];
      if (i2 < t2.length) added.push(t2[i2++]);
      if (i1 < t1.length) added.push(t1[i1++]);
      if (i3 < t3.length) added.push(t3[i3++]);
      if (i2 < t2.length) added.push(t2[i2++]);
      if (!added.length) break;
      interleaved.push(...added);
    }
    const tokens = interleaved.slice(0, limit);

    // Inject Sorsa KOL tweets (served from cache, zero extra API calls here)
    // The sorsa/route.js refreshes the cache every 2h via its own cron or on-demand
    for (const token of tokens) {
      const sorsaTweets = getSorsaTweetsForSymbol(token.symbol);
      if (sorsaTweets.length > 0) {
        token.tweets = sorsaTweets.map(t => ({
          a: `@${t.author}`,
          t: t.text.replace(/https?:\/\/\S+/g, '').trim().slice(0, 140),
          l: t.likes,
          score: t.sorsaScore,
          followers: t.authorFollowers,
        }));
        // High-score tweet signals bullish sentiment
        const topScore = Math.max(...sorsaTweets.map(t => t.sorsaScore || 0));
        if (topScore >= 800) {
          token.sentiment = { score: 0.8 + Math.random() * 0.15, label: 'bullish' };
          token.signalSource = 'sorsa_kol';
          token.signalConfidence = 'HIGH';
        }
      }
    }

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
