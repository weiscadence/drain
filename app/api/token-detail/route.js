// Rich token detail: holders, smart wallets, on-chain stats
// Used by the info sheet to replace broken iframes

const GMGN_KEY = 'gmgn_c835090d1d3def6cbaa59fdb85478d97';
const RUGCHECK_BASE = 'https://api.rugcheck.xyz/v1';

async function getGmgnTokenInfo(mint) {
  try {
    const ts = Math.floor(Date.now() / 1000);
    const clientId = crypto.randomUUID ? crypto.randomUUID() : 'drain-app';
    const res = await fetch(
      `https://openapi.gmgn.ai/v1/market/rank?chain=sol&address=${mint}&limit=1&timestamp=${ts}&client_id=drain-${Math.random().toString(36).slice(2)}`,
      { headers: { 'X-APIKEY': GMGN_KEY }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return null;
    const d = await res.json();
    return d?.data || null;
  } catch { return null; }
}

// Extract holders from rugcheck full report (free, no auth needed)
// rugFull is passed in after being fetched; call this AFTER getRugcheckFull
function extractHoldersFromRugcheck(rugFull) {
  if (!rugFull?.topHolders?.length) return [];
  // Known DEX/LP program owners to exclude from holder display
  const DEX_OWNERS = new Set([
    '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1', // Raydium
    'FEZGCABhqHJEbFvhTAjNR5sKDXsqMBLNpJAMEcsTQLuN',
    '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', // Orca
    'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc',
    '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P',  // Pump.fun
  ]);
  return rugFull.topHolders
    .filter(h => !DEX_OWNERS.has(h.owner || ''))
    .slice(0, 12)
    .map((h, i) => ({
      address: (h.address || '').slice(0, 8) + '...',
      pct: parseFloat(h.pct || 0),
      isSmart: h.insider === true,
      isTeam: i === 0 && h.pct > 20, // largest holder likely team if > 20%
      value: 0,
      type: h.insider ? 'smart' : i < 3 ? 'top' : 'holder',
    }));
}

async function getSmartWalletCount(mint) {
  // Use GMGN rank to find smart wallet count for this specific token
  try {
    const ts = Math.floor(Date.now() / 1000);
    const res = await fetch(
      `https://openapi.gmgn.ai/v1/market/rank?chain=sol&address=${mint}&limit=1&timestamp=${ts}&client_id=drain-${Math.random().toString(36).slice(2)}`,
      { headers: { 'X-APIKEY': GMGN_KEY }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return 0;
    const d = await res.json();
    if (d.code !== 0) return 0;
    const rank = d?.data?.data?.rank || d?.data?.rank || [];
    const token = rank.find(t => t.address === mint);
    return token?.smart_degen_count || 0;
  } catch { return 0; }
}

async function getRugcheckFull(mint) {
  try {
    const res = await fetch(`${RUGCHECK_BASE}/tokens/${mint}/report`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mint = searchParams.get('mint');
  if (!mint) return Response.json({ error: 'mint required' }, { status: 400 });

  const [gmgnInfo, smartCount, rugFull] = await Promise.all([
    getGmgnTokenInfo(mint),
    getSmartWalletCount(mint),
    getRugcheckFull(mint),
  ]);

  // Use rugcheck topHolders — free, no auth, includes pct field
  const holderBubbles = extractHoldersFromRugcheck(rugFull);

  // Top holder concentration (exclude DEX programs already filtered above)
  const top10Pct = holderBubbles.slice(0, 10).reduce((a, h) => a + h.pct, 0);

  // Rugcheck score interpretation:
  // Full report 'score' = cumulative RISK points (higher = MORE risky)
  // Convert to human-readable safety level
  let rugcheckData = null;
  if (rugFull) {
    const riskScore = rugFull.score || 0;
    const risks = (rugFull.risks || []).filter(r => r.level !== 'info');
    const criticalRisks = risks.filter(r => r.level === 'danger' || r.score > 500);
    const lpLocked = rugFull.markets?.[0]?.lp?.lpLockedPct || 0;
    // Safety label based on risk accumulation
    const safetyLabel = criticalRisks.length > 0 ? '⚠ HIGH RISK'
      : risks.length > 3 ? '⚡ MEDIUM RISK'
      : risks.length <= 1 && lpLocked > 80 ? '✓ LOW RISK'
      : '⚡ MEDIUM RISK';
    const safetyGood = criticalRisks.length === 0 && risks.length <= 2;
    rugcheckData = {
      score: riskScore,
      safetyLabel,
      safetyGood,
      lpLocked,
      mutable: rugFull.tokenMeta?.mutable || false,
      mintAuthority: rugFull.tokenMeta?.mintAuthority !== null,
      freezeAuthority: rugFull.tokenMeta?.freezeAuthority !== null,
      risks: risks.slice(0, 4),
      riskCount: risks.length,
    };
  }

  return Response.json({
    mint,
    smartWallets: smartCount,
    holderBubbles,
    top10Pct: top10Pct.toFixed(1),
    totalHolders: gmgnInfo?.holder_count || rugFull?.markets?.[0]?.lpHolders?.total || 0,
    price: gmgnInfo?.price || 0,
    priceChange1h: gmgnInfo?.price_change_percent1h || 0,
    priceChange24h: gmgnInfo?.price_change_percent || 0,
    volume24h: gmgnInfo?.volume || 0,
    mcap: gmgnInfo?.market_cap || 0,
    liquidity: gmgnInfo?.liquidity || 0,
    rugcheck: rugcheckData,
  });
}
