// ── Sorsa Alpha API — Budget-smart social signal layer ───────────────────────
// Strategy: 10,000 pulls/month = 333/day budget
//   • Batch KOL search (all tokens in ONE query) every 2 hours → 12 calls/day
//   • Token’s own Twitter recent tweets per-handle, 6h TTL → ~60 calls/day
//   • Score cache: new accounts once, 72h TTL → ~20-30/day
//   • Total est: ~90-100 calls/day → ~3,000/month (≤30% of budget)
//
// Filter pipeline (free, no extra calls):
//   1. followers_count >= 5,000    — influence proxy
//   2. likes_count >= 10           — real engagement
//   3. Sorsa score >= 500 (if cached) OR 100k+ followers — quality gate
//   These filters run on search results in-memory; only score lookups cost credits

import fs from 'fs';
import path from 'path';

const SORSA_KEY = process.env.SORSA_API_KEY || '1f857c53-7146-4857-9188-7182719bb609';
const CACHE_PATH = path.join(process.cwd(), 'data/sorsa-cache.json');
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;  // 2h for tweet data
const SCORE_TTL_MS = 72 * 60 * 60 * 1000; // 72h for score data

// Sorsa score threshold to show a tweet
const MIN_SCORE = 500;
// Follower count to even bother scoring
const MIN_FOLLOWERS = 5000;
// Engagement floor — use Sorsa's `likes_count` field (not favorite_count)
const MIN_LIKES = 10;
// Max score checks per refresh cycle (budget protection)
const MAX_SCORE_CHECKS_PER_CYCLE = 8;

// ── Cache I/O ─────────────────────────────────────────────
function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    return { tweets: [], tweetsFetchedAt: 0, scores: {} };
  }
}

function saveCache(cache) {
  try {
    fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch {}
}

// ── Score lookup (with cache) ─────────────────────────────
async function getScore(username, cache) {
  const now = Date.now();
  const cached = cache.scores[username];
  if (cached && now - cached.at < SCORE_TTL_MS) return cached.score;

  try {
    const r = await fetch(`https://api.sorsa.io/v3/score?username=${encodeURIComponent(username)}`, {
      headers: { ApiKey: SORSA_KEY },
      signal: AbortSignal.timeout(4000),
    });
    if (!r.ok) return null;
    const d = await r.json();
    const score = d.score ?? null;
    if (score !== null) {
      cache.scores[username] = { score, at: now };
    }
    return score;
  } catch {
    return null;
  }
}

// ── Batch tweet search ────────────────────────────────────
// Builds ONE query covering all tokens to minimise API credits
async function fetchAlphaTweets(symbols) {
  // Build query: "$BONK OR $WIF OR $TRUMP ..." + engagement filter
  const tokenQuery = symbols.slice(0, 12).map(s => `$${s}`).join(' OR ');
  // min_faves may or may not be honored by Sorsa; we filter in-memory too
  const query = `(${tokenQuery}) min_faves:${MIN_LIKES} -is:retweet`;

  try {
    const r = await fetch('https://api.sorsa.io/v3/search-tweets', {
      method: 'POST',
      headers: { ApiKey: SORSA_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, order: 'popular' }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return [];
    const d = await r.json();
    return d.tweets || [];
  } catch {
    return [];
  }
}

// ── Main route ────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbolsParam = searchParams.get('symbols') || 'BONK,WIF,POPCAT,FARTCOIN,TRUMP,PEPE,MOODENG,CHILLGUY';
  const symbols = symbolsParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

  const cache = loadCache();
  const now = Date.now();
  const stale = now - cache.tweetsFetchedAt > CACHE_TTL_MS;

  if (stale) {
    // Fetch fresh tweets — 1 API call
    const rawTweets = await fetchAlphaTweets(symbols);

    // Step 1: filter by followers + engagement (free)
    // Note: Sorsa uses `likes_count` not `favorite_count`, and tweet body is in `full_text`
    const candidates = rawTweets.filter(t => {
      const u = t.user || {};
      const likes = t.likes_count || t.favorite_count || 0;
      return (u.followers_count || 0) >= MIN_FOLLOWERS && likes >= MIN_LIKES;
    });

    // Step 2: score check for unknown accounts (budget-guarded)
    let scoreChecks = 0;
    const enriched = [];
    for (const t of candidates) {
      const u = t.user || {};
      const username = u.username || u.screen_name || '';
      if (!username) continue;

      let score = cache.scores[username]?.score ?? null;
      const scoreFresh = cache.scores[username] && (now - cache.scores[username].at < SCORE_TTL_MS);

      if (!scoreFresh && scoreChecks < MAX_SCORE_CHECKS_PER_CYCLE) {
        score = await getScore(username, cache);
        scoreChecks++;
      }

      // Include tweet if: score >= MIN_SCORE, or score unknown but huge following (>100k)
      const passScore = score === null
        ? (u.followers_count || 0) >= 100000
        : score >= MIN_SCORE;

      if (passScore) {
        const tweetText = t.full_text || t.text || '';
      enriched.push({
          id: String(t.id || t.id_str || ''),
          text: tweetText,
          author: username,
          authorFollowers: u.followers_count || 0,
          authorName: u.display_name || u.name || username,
          authorAvatar: u.profile_image_url || null,
          sorsaScore: score,
          likes: t.likes_count || t.favorite_count || 0,
          retweets: t.retweet_count || 0,
          views: t.view_count || 0,
          createdAt: t.created_at || null,
          // Which token(s) this tweet mentions
          tokens: symbols.filter(sym => tweetText.toUpperCase().includes(`$${sym}`)),
        });
      }
    }

    // Sort by engagement
    enriched.sort((a, b) => (b.likes + b.retweets * 2) - (a.likes + a.retweets * 2));

    cache.tweets = enriched;
    cache.tweetsFetchedAt = now;
    saveCache(cache);
  }

  // Return tweets, optionally filtered to requested tokens
  const filtered = cache.tweets.filter(t =>
    t.tokens.some(sym => symbols.includes(sym))
  );

  // Also return per-token official tweets from the token's own Twitter
  const officialBySymbol = cache.officialTweets || {};
  const officialFiltered = {};
  for (const sym of symbols) {
    if (officialBySymbol[sym]) officialFiltered[sym] = officialBySymbol[sym];
  }

  return Response.json({
    tweets: filtered,
    officialTweets: officialFiltered,
    fetchedAt: cache.tweetsFetchedAt,
    stale: stale,
    count: filtered.length,
    budget: {
      note: '~90-100 Sorsa API calls/day est. (~3,000/month, 30% of 10k budget).',
    },
  });
}

// ── POST /api/sorsa — refresh official tweets for a specific token handle ────────
export async function POST(request) {
  try {
    const { symbol, handle } = await request.json();
    if (!symbol || !handle) return Response.json({ error: 'symbol + handle required' }, { status: 400 });

    const cache = loadCache();
    const now = Date.now();
    const OFFICIAL_TTL = 6 * 60 * 60 * 1000; // 6h

    if (!cache.officialTweets) cache.officialTweets = {};
    if (!cache.officialFetchedAt) cache.officialFetchedAt = {};

    const sym = symbol.toUpperCase();
    const lastFetch = cache.officialFetchedAt[sym] || 0;

    if (now - lastFetch < OFFICIAL_TTL) {
      return Response.json({ tweets: cache.officialTweets[sym] || [], cached: true });
    }

    // Fetch token's own recent tweets — 1 Sorsa API call
    const r = await fetch(`https://api.sorsa.io/v3/user-tweets?username=${encodeURIComponent(handle)}`, {
      headers: { ApiKey: SORSA_KEY },
      signal: AbortSignal.timeout(6000),
    });
    if (!r.ok) return Response.json({ tweets: [], cached: false });
    const d = await r.json();

    const tweets = (d.tweets || []).slice(0, 5).map(t => ({
      id: String(t.id || ''),
      text: (t.full_text || t.text || '').replace(/https?:\/\/\S+/g, '').trim(),
      likes: t.likes_count || 0,
      retweets: t.retweet_count || 0,
      views: t.view_count || 0,
      createdAt: t.created_at || null,
      official: true,
    }));

    cache.officialTweets[sym] = tweets;
    cache.officialFetchedAt[sym] = now;
    saveCache(cache);

    return Response.json({ tweets, cached: false, symbol: sym });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
