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

async function getGmgnTopHolders(mint) {
  try {
    const ts = Math.floor(Date.now() / 1000);
    const res = await fetch(
      `https://openapi.gmgn.ai/v1/market/token_top_holders?chain=sol&address=${mint}&limit=15&timestamp=${ts}&client_id=drain-${Math.random().toString(36).slice(2)}`,
      { headers: { 'X-APIKEY': GMGN_KEY }, signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) return [];
    const d = await res.json();
    if (d.code !== 0) return [];
    const list = d?.data?.list || [];
    return list.map(h => ({
      address: (h.address || h.account_address || '').slice(0,8) + '...',
      pct: parseFloat(h.amount_percentage || h.percent || 0),
      isSmart: (h.wallet_tag_v2 && h.wallet_tag_v2.includes('smart')) || h.is_smart_degen || false,
      isTeam: h.addr_type === 1 || h.tag === 'team',
      value: parseFloat(h.usd_value || 0),
      type: h.addr_type === 1 ? 'team' : h.is_smart_degen ? 'smart' : 'holder',
    }));
  } catch { return []; }
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

  const [gmgnInfo, holders, smartCount, rugFull] = await Promise.all([
    getGmgnTokenInfo(mint),
    getGmgnTopHolders(mint),
    getSmartWalletCount(mint),
    getRugcheckFull(mint),
  ]);

  // Build holder distribution for bubble visualization
  const holderBubbles = holders.slice(0, 15).map(h => ({
    address: h.address?.slice(0, 8) + '...',
    pct: parseFloat(h.percentage || h.pct || 0),
    isSmart: (h.wallet_tag_v2 && h.wallet_tag_v2.includes('smart')) || h.is_smart_degen || false,
    isTeam: h.tag === 'team' || h.is_creator,
    value: parseFloat(h.usd_value || 0),
    type: h.tag || (h.is_smart_degen ? 'smart' : 'holder'),
  }));

  // Top holder concentration
  const top10Pct = holderBubbles.slice(0, 10).reduce((a, h) => a + h.pct, 0);

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
    rugcheck: rugFull ? {
      score: rugFull.score || 0,
      lpLocked: rugFull.markets?.[0]?.lp?.lpLockedPct || 0,
      mutable: rugFull.tokenMeta?.mutable || false,
      mintAuthority: rugFull.tokenMeta?.mintAuthority !== null,
      freezeAuthority: rugFull.tokenMeta?.freezeAuthority !== null,
      risks: (rugFull.risks || []).slice(0, 4),
    } : null,
  });
}
