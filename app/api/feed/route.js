// Live alpha feed — multi-source crypto signal stream
// Sources: Sorsa KOL tweets · DexScreener boosts · new launches · movers

import fs from 'fs';
import path from 'path';

// ─── Accent colours ────────────────────────────────────────────────────────────
const ACCENT = {
  BONK: '#eab308', WIF: '#3b82f6', POPCAT: '#ec4899',
  FARTCOIN: '#22c55e', TRUMP: '#ef4444', PEPE: '#22c55e',
  MOODENG: '#f97316', CHILLGUY: '#8b5cf6', MEW: '#06b6d4', RAY: '#a855f7',
};
const accentFor = (sym) => ACCENT[sym?.toUpperCase()] ?? '#a855f7';

// ─── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60_000)   return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

function fmtNum(n) {
  if (!n || n === 0) return '$0';
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function fetchWithTimeout(url, timeoutMs = 5000) {
  return fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
}

// ─── Source 1: Sorsa KOL tweets ────────────────────────────────────────────────
function getKolTweets() {
  try {
    const p = path.join(process.cwd(), 'data/sorsa-cache.json');
    const cache = JSON.parse(fs.readFileSync(p, 'utf8'));
    const tweets = cache.tweets ?? [];
    const now = Date.now();
    const EIGHT_HOURS  = 8  * 3600 * 1000;
    const TWELVE_HOURS = 12 * 3600 * 1000;

    return tweets
      .map((t) => {
        const createdMs = new Date(t.createdAt).getTime();
        const age = now - createdMs;
        // Drop anything older than 12h
        if (age > TWELVE_HOURS) return null;
        // Only include if within 8h OR has >= 100 likes
        if (age > EIGHT_HOURS && (t.likes ?? 0) < 100) return null;

        const sym = (t.tokens?.[0] ?? 'UNKNOWN').toUpperCase();
        return {
          id: `kol_${t.id}`,
          type: 'kol_tweet',
          token: sym,
          color: accentFor(sym),
          size: t.sorsaScore > 1000 ? 'large' : 'small',
          time: timeAgo(createdMs),
          author: `@${t.author}`,
          text: t.text,
          likes: t.likes ?? 0,
          views: t.views ?? 0,
          sorsaScore: t.sorsaScore ?? 0,
          _sortScore: t.sorsaScore ?? 0,
          _ts: createdMs,
        };
      })
      .filter(Boolean);
  } catch (err) {
    console.warn('[feed] sorsa-cache read failed:', err.message);
    return [];
  }
}

// ─── Lookup real symbols from DexScreener for a batch of mints ───────────────────
async function lookupSymbols(mints) {
  const result = new Map();
  if (!mints.length) return result;
  try {
    const r = await fetchWithTimeout(`https://api.dexscreener.com/latest/dex/tokens/${mints.slice(0,15).join(',')}`);
    if (!r.ok) return result;
    const d = await r.json();
    const best = new Map();
    for (const p of (d.pairs || [])) {
      const addr = p.baseToken?.address;
      if (!addr) continue;
      const v = parseFloat(p.volume?.h24 || 0);
      if (!best.has(addr) || v > (best.get(addr)._v || 0)) { best.set(addr, { ...p, _v: v }); }
    }
    for (const [addr, p] of best) {
      result.set(addr, {
        symbol: p.baseToken?.symbol || '',
        image: p.info?.imageUrl || null,
        vol: parseFloat(p.volume?.h24 || 0),
        change1h: parseFloat(p.priceChange?.h1 || 0),
        mcap: parseFloat(p.marketCap || 0),
      });
    }
  } catch {}
  return result;
}

// ─── Source 2: DexScreener boosts ───────────────────────────────────────────────────
async function getBoosts() {
  try {
    const res = await fetchWithTimeout('https://api.dexscreener.com/token-boosts/top/v1');
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.tokenBoosts ?? []);
    const solItems = items.filter((b) => b.chainId === 'solana').slice(0, 8);
    const mints = solItems.map(b => b.tokenAddress).filter(Boolean);
    const symMap = await lookupSymbols(mints);
    return solItems
      .map((b) => {
        const info = symMap.get(b.tokenAddress);
        const sym = info?.symbol || b.description?.match(/\$([A-Z]{2,10})/)?.[1] || null;
        if (!sym || sym.length < 2) return null;
        return {
          id: `boost_${b.tokenAddress}`,
          type: 'boost',
          token: sym,
          color: accentFor(sym),
          size: 'small',
          time: 'live',
          boostAmount: b.totalAmount ?? b.amount ?? 0,
          description: b.description ?? '',
          vol: info?.vol || 0,
          mcap: info?.mcap || 0,
          _sortScore: b.totalAmount ?? 0,
          _ts: Date.now(),
        };
      })
      .filter(Boolean)
      .slice(0, 5);
  } catch (err) {
    console.warn('[feed] boosts fetch failed:', err.message);
    return [];
  }
}
// ─── Source 3: DexScreener new profiles (launches with social) ─────────────────
async function getNewLaunches() {
  try {
    const res = await fetchWithTimeout('https://api.dexscreener.com/token-profiles/latest/v1');
    if (!res.ok) return [];
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data.tokenProfiles ?? data.profiles ?? []);
    const solWithTw = items
      .filter((t) => t.chainId === 'solana' && t.links?.some(
        (l) => l.type === 'twitter' || l.label?.toLowerCase().includes('twitter') || l.url?.includes('x.com') || l.url?.includes('twitter.com')
      ))
      .slice(0, 6);

    // Lookup real symbols
    const mints = solWithTw.map(t => t.tokenAddress).filter(Boolean);
    const symMap = await lookupSymbols(mints);

    return solWithTw
      .map((t) => {
        const info = symMap.get(t.tokenAddress);
        const sym = info?.symbol
          || t.header?.match(/\$([A-Z]{2,10})/)?.[1]
          || t.description?.match(/\$([A-Z]{2,10})/)?.[1]
          || null;
        if (!sym || sym.length < 2) return null; // skip unresolved
        const twitterLink = t.links?.find((l) => l.type === 'twitter' || l.url?.includes('x.com') || l.url?.includes('twitter.com'));
        const telegramLink = t.links?.find((l) => l.type === 'telegram' || l.url?.includes('t.me'));
        return {
          id: `launch_${t.tokenAddress}`,
          type: 'launch',
          token: sym,
          color: accentFor(sym),
          size: 'tall',
          time: 'new',
          description: (t.description ?? '').slice(0, 120),
          twitter: twitterLink?.url ?? null,
          telegram: telegramLink?.url ?? null,
          vol: info?.vol || 0,
          mcap: info?.mcap || 0,
          _sortScore: info?.vol || 0,
          _ts: Date.now(),
        };
      })
      .filter(Boolean)
      .slice(0, 3);
  } catch (err) {
    console.warn('[feed] launches fetch failed:', err.message);
    return [];
  }
}
// ─── Source 4: DexScreener trending movers ────────────────────────────────────
async function getMovers() {
  try {
    const res = await fetchWithTimeout('https://api.dexscreener.com/latest/dex/search?q=solana');
    if (!res.ok) return [];
    const data = await res.json();
    const pairs = (data.pairs ?? [])
      .filter((p) => {
        if (p.chainId !== 'solana') return false;
        const ch1h = parseFloat(p.priceChange?.h1 ?? 0);
        const vol   = parseFloat(p.volume?.h24 ?? 0);
        return Math.abs(ch1h) > 5 && vol > 50_000;
      })
      .sort((a, b) =>
        Math.abs(parseFloat(b.priceChange?.h1 ?? 0)) -
        Math.abs(parseFloat(a.priceChange?.h1 ?? 0))
      )
      .slice(0, 3);

    return pairs.map((p) => {
      const sym    = (p.baseToken?.symbol ?? '???').toUpperCase();
      const ch1h   = parseFloat(p.priceChange?.h1 ?? 0);
      const vol    = parseFloat(p.volume?.h24 ?? 0);
      const mcap   = parseFloat(p.marketCap ?? 0);
      return {
        id: `mover_${p.pairAddress ?? p.baseToken?.address}`,
        type: 'mover',
        token: sym,
        color: accentFor(sym),
        size: Math.abs(ch1h) > 30 ? 'large' : 'small',
        time: 'live',
        change1h: ch1h,
        vol,
        mcap,
        _sortScore: Math.abs(ch1h),
        _ts: Date.now(),
      };
    });
  } catch (err) {
    console.warn('[feed] movers fetch failed:', err.message);
    return [];
  }
}

// ─── Sort order ───────────────────────────────────────────────────────────────
// ─── Source 5: GMGN smart money concentration (from alfalfa scanner local file) ────
function getGmgnFeedPosts() {
  const ALPHA_CALLS = '/home/ubuntu/.openclaw/workspace/data/alpha-calls.json';
  try {
    const raw = fs.readFileSync(ALPHA_CALLS, 'utf8');
    const d = JSON.parse(raw);
    const calls = Array.isArray(d) ? d : (d.calls || []);
    const cutoff = Date.now() - 8 * 60 * 60 * 1000;
    const seen = new Map();
    for (const c of calls) {
      if (!c.tags?.includes('gmgn') && c.source !== 'wallet_coord') continue;
      const e = c.extra || {};
      if (!e.mint || !e.smartCount) continue;
      const opened = new Date(c.openedAt || 0).getTime();
      if (opened < cutoff) continue;
      if (!seen.has(e.mint) || (seen.get(e.mint).smartCount || 0) < e.smartCount) {
        seen.set(e.mint, { ...e, asset: c.asset, confidence: c.confidence, openedAt: c.openedAt });
      }
    }
    return [...seen.values()]
      .filter(s => (s.smartCount || 0) >= 20)
      .sort((a, b) => (b.smartCount || 0) - (a.smartCount || 0))
      .slice(0, 5)
      .map(s => {
        const sym = s.asset || s.symbol || '?';
        const tier = (s.smartCount >= 100) ? '🧠 HIGH' : (s.smartCount >= 50) ? '⚡ MED' : '💡 LOW';
        const openedMs = new Date(s.openedAt || 0).getTime();
        return {
          id: `gmgn_${s.mint}`,
          type: 'smart_money',
          token: sym,
          color: accentFor(sym),
          size: s.smartCount >= 100 ? 'large' : 'small',
          time: timeAgo(openedMs || Date.now()),
          smartCount: s.smartCount,
          mcap: s.mcap || 0,
          vol: s.vol24h || 0,
          tier,
          dex: s.dex || `https://dexscreener.com/solana/${s.mint}`,
          gmgn: `https://gmgn.ai/sol/token/${s.mint}`,
          _sortScore: s.smartCount || 0,
          _ts: openedMs || Date.now(),
        };
      });
  } catch { return []; }
}

const TYPE_RANK = { smart_money: 0, kol_tweet: 1, mover: 2, boost: 3, launch: 4, alert: 5 };

function sortPosts(posts) {
  return posts.sort((a, b) => {
    const rankDiff = (TYPE_RANK[a.type] ?? 9) - (TYPE_RANK[b.type] ?? 9);
    if (rankDiff !== 0) return rankDiff;
    // Within same type, highest score first
    return (b._sortScore ?? 0) - (a._sortScore ?? 0);
  });
}

// ─── Route handler ─────────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    // Fetch all sources in parallel
    const [boostPosts, launchPosts, moverPosts] = await Promise.all([
      getBoosts(),
      getNewLaunches(),
      getMovers(),
    ]);
    // Sync reads (local files, no network)
    const kolPosts = getKolTweets();
    const gmgnPosts = getGmgnFeedPosts();

    const allPosts = sortPosts([
      ...gmgnPosts,
      ...kolPosts,
      ...moverPosts,
      ...boostPosts,
      ...launchPosts,
    ]).slice(0, 30);

    // Strip internal sort keys before sending
    const posts = allPosts.map(({ _sortScore, _ts, ...rest }) => rest);

    return Response.json(
      { posts, count: posts.length, generatedAt: Date.now() },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    );
  } catch (err) {
    console.error('[feed] fatal error:', err);
    return Response.json({ posts: [], count: 0, generatedAt: Date.now() }, { status: 500 });
  }
}
