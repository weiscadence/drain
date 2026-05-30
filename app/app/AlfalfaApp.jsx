'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

const C = {
  bg: '#0a0a0a', card: '#111', border: '#1e1e1e',
  text: '#e8e0d0', dim: 'rgba(232,224,208,.4)',
  green: '#00ff88', red: '#ff4444',
  purple: '#9933ff', amber: '#f59e0b', cyan: '#00d4ff',
  blue: '#3b82f6',
};

const LANE_COLORS = {
  memecoin: C.purple, lp: C.green, hip3: C.amber,
  pred: C.cyan, news: '#ff6b9d', ton: '#00b8ff', btc: '#f7931a',
  smart: '#00e5ff', other: C.dim,
};
const LANE_LABELS = {
  memecoin: '🎯 Memecoin', lp: '💧 LP', hip3: '⚡ HIP-3',
  pred: '🎲 Predict', news: '📰 News', ton: '💎 TON', btc: '₿ BTC',
};

function getLane(src) {
  // Memecoin: on-chain wallet coordination + KOL calls
  if (['wallet_coord','kol_ca','kol_mention'].includes(src)) return 'memecoin';
  // TON ecosystem
  if (src === 'ton_momentum' || src === 'ton_coordination') return 'ton';
  // LP / Meteora
  if (src?.includes('meteora') || src === 'lp_insider') return 'lp';
  // HIP-3 / Hyperliquid
  if (src?.includes('hip3') || src === 'funding_arb' || src?.includes('funding')) return 'hip3';
  // Smart wallet consensus + arb
  if (['consensus_tracker','cross_venue_arb','funding_neutral'].includes(src)) return 'smart';
  // Prediction markets: Polymarket + vol spikes + longshots + BTC/ETH/SOL hourly candles + quant
  if (['poly_diverge','vol_spike','new_market','cross_market_arb','poly_updown',
       'crypto_predict','longshot_load','near_term_edge','longshot','smart_money',
       'poly_trader','quant_bias','clob_sweep','cross_arb','compound_edge',
       'poly_clob_imbalance'].includes(src)) return 'pred';
  // News / CEX listings
  if (['news_catalyst','cex_listing'].includes(src)) return 'news';
  // BTC 5-min directional
  if (src === 'btc_5min') return 'btc';
  return 'other';
}

function fmtP(p) {
  if (!p) return '—';
  const n = Number(p);
  if (n >= 10000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n >= 1) return '$' + n.toFixed(2);
  if (n >= 0.01) return '$' + n.toFixed(4);
  return '$' + n.toPrecision(3);
}

function Tag({ label, color = C.dim }) {
  return (
    <span style={{ fontSize:9, letterSpacing:'.13em', padding:'2px 7px', borderRadius:4,
      background: color+'22', color, border:'1px solid '+color+'40', display:'inline-flex', alignItems:'center' }}>
      {label}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background:C.card, border:'1px solid '+C.border, borderRadius:12, padding:14, marginBottom:8, ...style }}>
      {children}
    </div>
  );
}

// ── Stats bar per lane ────────────────────────────────────────────
function LaneStats({ calls, lane }) {
  const laneCalls = calls.filter(c => getLane(c.source) === lane);
  const closed = laneCalls.filter(c => c.status === 'closed' && (c.outcome === 'win' || c.outcome === 'loss'));
  const wins = closed.filter(c => c.outcome === 'win');
  const wr = closed.length ? Math.round(wins.length / closed.length * 100) : null;
  const open = laneCalls.filter(c => c.status === 'open').length;
  const color = LANE_COLORS[lane] || C.dim;

  return (
    <div style={{ display:'flex', gap:12, alignItems:'center', fontSize:11, color:C.dim }}>
      <span style={{ color }}>{open} open</span>
      {wr !== null && <span style={{ color: wr >= 60 ? C.green : wr >= 40 ? C.amber : C.red }}>{wr}% WR ({closed.length} calls)</span>}
      {wr === null && closed.length === 0 && <span>no resolved calls yet</span>}
    </div>
  );
}

// ── Price bar ─────────────────────────────────────────────────────
function PriceBar({ prices, fg }) {
  const btc = prices?.bitcoin;
  const sol = prices?.solana;
  const ton = prices?.['ton'] || prices?.['the-open-network'];
  const fgColor = !fg?.value ? C.dim : fg.value < 35 ? C.red : fg.value > 65 ? C.green : C.amber;
  const coins = [
    { sym:'₿', p:btc?.price, c:btc?.change24h },
    { sym:'◎', p:sol?.price, c:sol?.change24h },
    { sym:'💎', p:ton?.price, c:ton?.change24h },
  ];
  return (
    <div style={{ display:'flex', borderBottom:'1px solid '+C.border, overflowX:'auto', fontSize:11 }}>
      {coins.map(({sym,p,c}) => (
        <div key={sym} style={{ padding:'8px 13px', borderRight:'1px solid '+C.border, whiteSpace:'nowrap', flexShrink:0 }}>
          {sym} <b>{p ? '$'+Number(p).toLocaleString('en-US',{maximumFractionDigits:p<100?2:0}) : '—'}</b>
          {c != null && <span style={{ color:c>=0?C.green:C.red, marginLeft:4 }}>{c>=0?'+':''}{Number(c).toFixed(1)}%</span>}
        </div>
      ))}
      <div style={{ padding:'8px 13px', marginLeft:'auto', flexShrink:0, color:fgColor, whiteSpace:'nowrap' }}>
        F&G <b>{fg?.value||'—'}</b>
      </div>
    </div>
  );
}

// ── Tab bar — overview + lanes + scorecard ───────────────────────
const TABS = [
  { id:'overview', emoji:'👁',  label:'Overview' },
  { id:'prop',     emoji:'🏆', label:'Prop' },
  { id:'pred',     emoji:'🎲', label:'Predict' },
  // Smart$ tab hidden — internal data, too noisy for user
  { id:'memecoin', emoji:'🎯', label:'Coins' },
  { id:'hip3',     emoji:'⚡', label:'HIP-3' },
  // Wallets tab hidden — internal data
  { id:'lp',       emoji:'💧', label:'LP' },
  { id:'ton',      emoji:'💎', label:'TON' },
  { id:'score',    emoji:'📊', label:'Score' },
];
function TabBar({ active, set }) {
  return (
    <div style={{ display:'flex', borderBottom:'1px solid '+C.border, background:C.bg, position:'sticky', top:0, zIndex:20 }}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => set(t.id)} style={{
          flex:1, padding:'8px 2px 6px', border:'none',
          borderBottom: active===t.id ? '2px solid '+(LANE_COLORS[t.id]||C.purple) : '2px solid transparent',
          background:'transparent', color:active===t.id ? C.text : C.dim,
          cursor:'pointer', fontSize:9, letterSpacing:'.05em', transition:'all .1s',
          display:'flex', flexDirection:'column', alignItems:'center', gap:2,
        }}>
          <span style={{ fontSize:15 }}>{t.emoji}</span>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Call card ─────────────────────────────────────────────────────
function CallCard({ c }) {
  const long = c.direction === 'LONG';
  const dc = long ? C.green : C.red;
  const cc = c.confidence==='HIGH' ? C.green : c.confidence==='MEDIUM' ? C.amber : C.dim;
  const lane = getLane(c.source);
  const laneColor = LANE_COLORS[lane] || C.dim;
  const minsAgo = c.openedAt ? Math.round((Date.now()-new Date(c.openedAt))/60000) : null;

  const deeplink = c.extra?.dex || c.extra?.url ||
    (c.source?.includes('meteora') ? 'https://app.meteora.ag/dlmm' :
     getLane(c.source) === 'pred' ? 'https://polymarket.com' :
     c.source?.includes('hip3') ? `https://app.hyperliquid.xyz/trade/${c.asset}` :
     c.extra?.token ? `https://jup.ag/swap/SOL-${c.extra.token}` : null);

  const actionLabel = c.source?.includes('meteora') ? '💧 LP' :
    getLane(c.source) === 'pred' ? '🎲 Bet' :
    c.source?.includes('hip3') ? '⚡ Trade' :
    c.direction === 'LONG' ? '⚡ Buy' : '⚡ Short';

  return (
    <Card>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
        <div>
          <span style={{ fontWeight:700, fontSize:15 }}>
            <span style={{ color:dc }}>{long?'▲':'▼'} {c.direction}</span>{' '}{c.asset}
          </span>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          <Tag label={c.confidence} color={cc} />
          <Tag label={LANE_LABELS[lane]?.split(' ')[1]||lane} color={laneColor} />
        </div>
      </div>
      <div style={{ fontSize:11, color:C.dim, marginBottom:6 }}>
        Entry {fmtP(c.entry)} → Target {fmtP(c.target)} | Stop {fmtP(c.stop)}
        {c.rr ? <span style={{ color:C.text }}> · {c.rr}:1</span> : ''}
      </div>
      {c.edge && <div style={{ fontSize:11, color:C.text, lineHeight:1.5, marginBottom: c.extra?.positionType ? 4 : 8 }}>{c.edge.replace(/Suggested size:[^.]+\.?\s*/g,'').slice(0,120)}</div>}
      {c.extra?.positionType && (() => {
        const pt = c.extra.positionType;
        const pn = c.extra.positionNote;
        const ptColor = pt?.includes('ASK') ? C.green : pt?.includes('SKIP') ? C.red : C.cyan;
        const ptEmoji = pt?.includes('ASK') ? '🚀' : pt?.includes('SKIP') ? '⚠️' : '💧';
        return (
          <div style={{ fontSize:9, color:ptColor, background:ptColor+'10', border:'1px solid '+ptColor+'25', borderRadius:5, padding:'3px 7px', marginBottom:8 }}>
            {ptEmoji} <b>{pt}</b>{pn ? ` — ${pn.slice(0,70)}` : ''}
          </div>
        );
      })()}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
          <Tag label={(c.source||'').replace(/_/g,' ')} color={C.dim} />
          {minsAgo != null && <Tag label={minsAgo<60?minsAgo+'m':Math.round(minsAgo/60)+'h'} />}
        </div>
        {deeplink && (
          <button onClick={() => window.open(deeplink,'_blank')} style={{
            padding:'6px 12px', borderRadius:8, border:'none',
            background:laneColor+'22', color:laneColor, border:'1px solid '+laneColor+'44',
            fontSize:10, letterSpacing:'.1em', cursor:'pointer', fontFamily:'inherit', fontWeight:600,
          }}>{actionLabel}</button>
        )}
      </div>
    </Card>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────
function OverviewTab({ calls, prices, fg, paperData, gmgnSignals, funding, orderBook }) {
  const btcFunding = funding?.BTC?.fundingPct;
  const solFunding = funding?.SOL?.fundingPct;
  const btcBid = orderBook?.BTC?.totalBidLiquidity || 0;
  const btcAsk = orderBook?.BTC?.totalAskLiquidity || 0;
  const bidAskRatio = btcAsk > 0 ? (btcBid/btcAsk).toFixed(1) : '?';
  const marketBias = btcBid > btcAsk * 1.5 ? '🟢 BID HEAVY' : btcBid * 1.5 < btcAsk ? '🔴 ASK HEAVY' : '⚪ BALANCED';

  const topCalls = calls
    .filter(c => c.status === 'open' && c.confidence === 'HIGH')
    .sort((a,b) => (b.score||0) - (a.score||0))
    .slice(0, 5);

  const acc = paperData?.account || {};
  const bal = acc.currentBalance || 10000;
  const start = acc.startingBalance || 10000;
  const allTimePct = ((bal-start)/start*100).toFixed(1);
  const wins = acc.wins || 0;
  const losses = acc.losses || 0;
  const wr = (wins+losses) > 0 ? Math.round(wins/(wins+losses)*100) : null;
  const dd = acc.maxDrawdown || 0;
  const openPos = (paperData?.openPositions || []).length;

  const topGMGN = (gmgnSignals || []).slice(0, 3);

  return (
    <>
      {/* Market pulse */}
      <Card style={{ marginTop: 8 }}>
        <div style={{ fontSize: 9, letterSpacing: '.2em', color: C.dim, marginBottom: 8 }}>MARKET PULSE</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12 }}>😰 F&G: <b style={{ color: fg?.value < 35 ? C.red : fg?.value > 65 ? C.green : C.amber }}>{fg?.value || '?'} {fg?.label || ''}</b> {fg?.trend === 'rising' ? '↑' : fg?.trend === 'falling' ? '↓' : ''}</span>
          <span style={{ fontSize: 11, color: C.dim }}>{marketBias}</span>
        </div>
        <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.8 }}>
          BTC funding: <b style={{ color: parseFloat(btcFunding) < 0 ? C.green : C.red }}>{btcFunding}%</b> | OB: <b>{bidAskRatio}:1 bid</b><br/>
          SOL funding: <b style={{ color: parseFloat(solFunding) < 0 ? C.green : C.red }}>{solFunding}%</b>
        </div>
      </Card>

      {/* Consensus alert — highest priority */}
      {topCalls.some(c => c.source === 'consensus_tracker') && (
        <Card style={{ borderColor:'#00e5ff60', background:'#00e5ff08' }}>
          <div style={{ fontSize:9, letterSpacing:'.2em', color:'#00e5ff', marginBottom:6 }}>🐋 CONSENSUS ALERT</div>
          {topCalls.filter(c => c.source === 'consensus_tracker').slice(0,2).map((c, i) => {
            const dir = c.direction?.replace('BUY_','') || '?';
            const wn = c.extra?.wallets?.length || '?';
            return (
              <div key={i} style={{ fontSize:11, lineHeight:1.8 }}>
                {wn} smart wallet{wn > 1 ? 's' : ''}{c.extra?.signals?.length ? ' + ' + c.extra.signals.length + ' signal' : ''} agree: <b>{dir}</b> on {(c.asset||'').slice(0,60)}
              </div>
            );
          })}
        </Card>
      )}

      {/* Best signals right now */}
      <div style={{ fontSize: 9, letterSpacing: '.2em', color: C.dim, margin: '12px 0 8px' }}>BEST SIGNALS NOW</div>
      {topCalls.length === 0 ? (
        <Card><div style={{ color: C.dim, textAlign: 'center', fontSize: 12 }}>No HIGH confidence calls open</div></Card>
      ) : topCalls.map((c, i) => <CallCard key={i} c={c} />)}

      {/* Paper account summary */}
      <div style={{ fontSize: 9, letterSpacing: '.2em', color: C.dim, margin: '12px 0 8px' }}>PAPER ACCOUNT (PROP TRACK)</div>
      <Card>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div>
            <div style={{ fontSize: 8, color: C.dim }}>BALANCE</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>${bal.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: parseFloat(allTimePct) >= 0 ? C.green : C.red }}>{parseFloat(allTimePct) >= 0 ? '+' : ''}{allTimePct}%</div>
          </div>
          <div>
            <div style={{ fontSize: 8, color: C.dim }}>WIN RATE</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: wr === null ? C.dim : wr >= 65 ? C.green : C.amber }}>{wr !== null ? wr + '%' : '—'}</div>
            <div style={{ fontSize: 9, color: C.dim }}>{wins}W/{losses}L</div>
          </div>
          <div>
            <div style={{ fontSize: 8, color: C.dim }}>OPEN</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{openPos}</div>
            <div style={{ fontSize: 9, color: C.dim }}>positions</div>
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 10, color: C.dim }}>
          🎯 Target: 65% WR / &lt;5% DD / 100 trades — {(wins+losses)}/100 done
          {dd > 0.05 ? ' ⚠️ DD over limit' : wr !== null && wr >= 65 ? ' ✅ On track' : ' ⏳ Building...'}
        </div>
      </Card>

      {/* GMGN smart money */}
      {topGMGN.length > 0 && (
        <>
          <div style={{ fontSize: 9, letterSpacing: '.2em', color: C.dim, margin: '12px 0 8px' }}>🔥 GMGN SMART MONEY</div>
          {topGMGN.map((c, i) => (
            <Card key={i} style={{ padding: '10px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>{c.asset}</span>
                <Tag label={`${c.extra?.smartCount || '?'} 🧠`} color={C.purple} />
              </div>
              <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>${c.extra?.mcap ? (c.extra.mcap/1000).toFixed(0)+'k mcap' : '?'} | {c.edge?.slice(0,60)}</div>
            </Card>
          ))}
        </>
      )}
    </>
  );
}

// ── Lane tab template ─────────────────────────────────────────────
function LaneTab({ lane, calls, extra }) {
  const laneCalls = calls.filter(c => getLane(c.source) === lane);
  const color = LANE_COLORS[lane] || C.purple;

  return (
    <>
      {/* Stats header */}
      <Card style={{ marginTop:8, padding:'10px 14px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
          <b style={{ fontSize:13 }}>{LANE_LABELS[lane] || lane}</b>
          <LaneStats calls={calls} lane={lane} />
        </div>
        <div style={{ fontSize:11, color:C.dim }}>
          {lane==='memecoin' && 'Insider wallets · Jito bundles · KOL calls · news before price'}
          {lane==='lp' && 'Meteora DLMM · min 600% APR · vol/liq >8x · position type auto-detected'}
          {lane==='hip3' && 'Hyperliquid small markets · funding arb · oracle divergence · OI spikes'}
          {lane==='pred' && 'Polymarket vol spikes · longshots · smart wallet loads · BTC/SOL candle plays'}
          {lane==='news' && 'CEX listings · breaking catalysts · KOL contract posts'}
        </div>
      </Card>

      {/* Extra content (brains, pools, etc) */}
      {extra}

      {/* Calls — LP tab uses LPPools above instead of generic call cards */}
      {lane !== 'lp' && (laneCalls.length > 0
        ? laneCalls.slice(0, 10).map((c, i) => <CallCard key={i} c={c} />)
        : <div style={{ color:C.dim, padding:'28px 0', textAlign:'center', fontSize:13 }}>
            No active {lane} calls<br/>
            <span style={{ fontSize:11, opacity:.6 }}>Scanner runs every 10-20min</span>
          </div>
      )}
    </>
  );
}

// ── LP tab: position type helper ─────────────────────────────────
function getLpPos(feeApr, vol24h, liq, priceChange1h, volLiqRatio) {
  const p1h = priceChange1h || 0;
  const vlr = volLiqRatio || (vol24h && liq ? vol24h / liq : 0);
  if (p1h > 8)  return { type:'ONE-SIDED ASK 🚀', color:'#00ff88', note:`Price +${p1h.toFixed(0)}% — deposit only the token above price. Ride the pump + collect fees. No USDC, no IL on the way up.` };
  if (p1h < -8) return { type:'SKIP / BID-ONLY ⚠️', color:'#ff4444', note:`Price ${p1h.toFixed(0)}% — declining. Skip, or deposit USDC below price to DCA in + fees.` };
  if (p1h > 3 && vlr > 8) return { type:'TWO-SIDED TIGHT 💧', color:'#00d4ff', note:`Slight uptrend +${p1h.toFixed(0)}%. Tight ±3% range, both tokens. Fees from buys and sells.` };
  return { type:'TWO-SIDED WIDE 💧', color:'#00d4ff', note:`Ranging/stable (${p1h.toFixed(1)}% 1h). Standard ±10% range. Max fee capture.` };
}

// ── LP extra: live pools ──────────────────────────────────────────
function LPPools({ pools, calls }) {
  // Merge: pool cards from API + enrich with any missing from alpha-calls
  const lpCalls = (calls||[]).filter(c => c.source?.includes('meteora') && c.status === 'open');
  // Deduplicate by mint on frontend too — same token, multiple pools → keep highest liq
  const seenMints = new Map();
  const deduped = [...(pools||[])].filter(p => {
    if (!p.mint) return true;
    const liq = p.liq || 0;
    const apr = p.feeApr || 0;
    // Filter: liq must be >$25k if known, and APR <5000% (ghost pools have 9000%+ fake APR)
    if (liq > 0 && liq < 25000) return false;
    if (apr > 5000 && liq < 25000) return false;
    const existing = seenMints.get(p.mint);
    if (!existing || liq > (existing.liq || 0)) { seenMints.set(p.mint, p); return true; }
    return false;
  });
  const allPools = deduped;

  // Add any call that isn't already represented
  for (const c of lpCalls) {
    const pa = c.extra?.pairAddr;
    if (pa && !allPools.find(p => p.pairAddr === pa)) {
      allPools.push({
        symbol: c.asset,
        pairAddr: pa,
        feeApr: c.extra?.feeApr || 0,
        vol24h: c.extra?.vol24h || 0,
        liq: c.extra?.liq || 0,
        volLiqRatio: c.extra?.volLiqRatio || 0,
        ageHours: c.extra?.ageHours || 0,
        priceChange1h: c.extra?.priceChange1h || 0,
        positionType: c.extra?.positionType || null,
        positionNote: c.extra?.positionNote || null,
        insiderPresent: c.extra?.insiderPresent || false,
        url: c.extra?.dex || c.extra?.url,
        source: c.source,
        openedAt: c.openedAt,
      });
    }
  }

  // Stats row
  const totalApr = allPools.length ? Math.round(allPools.reduce((s,p)=>s+(p.feeApr||0),0)/allPools.length) : 0;
  const totalVol = allPools.reduce((s,p)=>s+(p.vol24h||0),0);

  return (
    <>
      {/* Stats strip */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, margin:'8px 0 12px' }}>
        {[
          { label:'OPEN POOLS', val: allPools.length, color: C.green },
          { label:'AVG APR', val: totalApr ? totalApr+'%' : '—', color: C.amber },
          { label:'TOTAL VOL', val: totalVol > 0 ? '$'+(totalVol/1000).toFixed(0)+'k' : '—', color: C.cyan },
        ].map(({label,val,color}) => (
          <Card key={label} style={{ marginBottom:0, padding:'8px 10px', textAlign:'center' }}>
            <div style={{ fontSize:8, letterSpacing:'.15em', color:C.dim, marginBottom:3 }}>{label}</div>
            <div style={{ fontSize:16, fontWeight:700, color }}>{val}</div>
          </Card>
        ))}
      </div>

      {/* Strategy key */}
      <Card style={{ padding:'8px 12px', marginBottom:8 }}>
        <div style={{ fontSize:9, letterSpacing:'.15em', color:C.dim, marginBottom:6 }}>POSITION TYPES</div>
        {[
          { emoji:'🚀', type:'ONE-SIDED ASK', desc:'Price pumping — deposit token only above price. Fees + upside, no IL drag.', color:'#00ff88' },
          { emoji:'💧', type:'TWO-SIDED TIGHT/WIDE', desc:'Ranging — both tokens, tight or wide range. Max fee capture both ways.', color:'#00d4ff' },
          { emoji:'⚠️', type:'SKIP / BID-ONLY', desc:'Declining — wait or deposit USDC below price to DCA + fees.', color:'#ff4444' },
        ].map(({emoji,type,desc,color}) => (
          <div key={type} style={{ display:'flex', gap:7, alignItems:'flex-start', marginBottom:5 }}>
            <span style={{ fontSize:13, lineHeight:1.3 }}>{emoji}</span>
            <div>
              <span style={{ fontSize:9, fontWeight:700, color, letterSpacing:'.05em' }}>{type}</span>
              <div style={{ fontSize:9, color:C.dim, lineHeight:1.4, marginTop:1 }}>{desc}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Pool cards */}
      {allPools.length === 0 ? (
        <div style={{ color:C.dim, padding:'24px 0', textAlign:'center', fontSize:12 }}>
          No LP opportunities right now<br/>
          <span style={{ fontSize:10, opacity:.6 }}>Scanner checks every 30min · min 600% APR · vol/liq &gt;8x</span>
        </div>
      ) : allPools.sort((a,b)=>(b.feeApr||0)-(a.feeApr||0)).map((p, i) => {
        const poolLink = p.pairAddr
          ? `https://app.meteora.ag/dlmm/${p.pairAddr}`
          : p.url || 'https://app.meteora.ag/dlmm';
        const vlr = p.volLiqRatio || (p.vol24h && p.liq ? p.vol24h/p.liq : 0);
        // Use stored positionType if available, else compute live
        const pos = p.positionType
          ? { type: p.positionType, color: p.positionType?.includes('ASK') ? '#00ff88' : p.positionType?.includes('SKIP') ? '#ff4444' : '#00d4ff', note: p.positionNote }
          : getLpPos(p.feeApr, p.vol24h, p.liq, p.priceChange1h, vlr);
        const p1h = p.priceChange1h || 0;
        return (
          <Card key={i} style={{ padding:'11px 14px', marginBottom:8 }}>
            {/* Header row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
              <span style={{ fontWeight:700, fontSize:16 }}>{p.symbol}</span>
              <span style={{ fontWeight:700, fontSize:14, color: p.feeApr>1000?C.green:p.feeApr>500?C.amber:C.dim }}>
                {p.feeApr?.toFixed(0)}% APR
              </span>
            </div>

            {/* Metrics row */}
            <div style={{ display:'flex', gap:10, fontSize:11, color:C.dim, marginBottom:7, flexWrap:'wrap' }}>
              {p.vol24h > 0 && <span>Vol <b style={{color:C.text}}>${(p.vol24h/1000).toFixed(0)}k</b></span>}
              {p.liq > 0 && <span>Liq <b style={{color:C.text}}>${(p.liq/1000).toFixed(0)}k</b></span>}
              {vlr > 0 && <span>V/L <b style={{color: vlr>10?C.green:vlr>5?C.amber:C.red}}>{vlr.toFixed(1)}x</b></span>}
              {p.ageHours > 0 && <span style={{color:C.dim}}>{Math.round(p.ageHours)}h old</span>}
              {p1h !== 0 && <span style={{color:p1h>0?C.green:C.red}}>{p1h>0?'+':''}{p1h.toFixed(1)}% 1h</span>}
            </div>

            {/* Position type badge */}
            <div style={{
              background: pos.color+'14', border:'1px solid '+pos.color+'35',
              borderRadius:7, padding:'7px 10px', marginBottom:8,
            }}>
              <div style={{ fontSize:11, fontWeight:700, color:pos.color, marginBottom:3 }}>{pos.type}</div>
              {pos.note && <div style={{ fontSize:10, color:C.dim, lineHeight:1.5 }}>{pos.note.slice(0,120)}</div>}
            </div>

            {/* Footer row */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:5 }}>
                {p.insiderPresent && <Tag label="INSIDER ⚡" color={C.purple} />}
                <Tag label="OPEN" color={C.amber} />
              </div>
              <button onClick={() => window.open(poolLink,'_blank')} style={{
                padding:'7px 14px', borderRadius:8, border:'1px solid '+pos.color+'55',
                background:pos.color+'20', color:pos.color, fontSize:10, letterSpacing:'.1em',
                cursor:'pointer', fontFamily:'inherit', fontWeight:700,
              }}>
                {pos.type?.includes('ASK') ? '🚀' : '💧'} Open Meteora
              </button>
            </div>
          </Card>
        );
      })}
    </>
  );
}

// ── Prop Challenge Tab — Tinder Swipe UI ──────────────────────────
function PropTab({ propData, calls, smartPositions }) {
  const pm = propData?.propmarket || {};

  const [cardIndex, setCardIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);   // 'left' | 'right' | null
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceModal, setPriceModal] = useState(null); // call being confirmed
  const [priceInput, setPriceInput] = useState('');
  const [sizeInput, setSizeInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Touch state
  const touchStart = useRef(null);
  const [dragX, setDragX] = useState(0);

  function showToast(msg, color = C.green) {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2500);
  }

  function calcEV(price, wr = 0.76) {
    if (!price || price <= 0 || price >= 1) return null;
    return wr * (1 - price) / price - (1 - wr);
  }

  const pmStart = pm.startingBalance || 5000;
  const pmBal   = pm.currentBalance  || pmStart;
  const pmHWM   = pm.highWaterMark   || pmStart;
  const pmFloor = pmHWM * 0.90;
  const pmDD    = Math.max(0, (pmHWM - pmBal) / pmHWM * 100);
  const pmProgress = Math.max(0, (pmBal - pmStart) / (pmStart * 0.20) * 100);
  const pmDaysLeft = pm.startDate
    ? Math.max(0, 30 - (Date.now() - new Date(pm.startDate)) / 86400000).toFixed(0)
    : 30;
  const closedTrades = (pm.trades || []).filter(t => t.closed && (t.outcome === 'win' || t.outcome === 'loss'));
  const winCount  = closedTrades.filter(t => t.outcome === 'win').length;
  const lossCount = closedTrades.filter(t => t.outcome === 'loss').length;
  const wr = closedTrades.length ? Math.round(winCount / closedTrades.length * 100) : null;

  // Active (placed but not resolved) trades
  const activeTrades = (pm.trades || []).filter(t => !t.closed);

  // Source signal stack for each call
  const PROP_SIGNAL_SOURCES = ['odds_misprice','poly_combo_triple','poly_combo_double','vol_spike','obi_sweep','compound_edge'];
  const propCalls = (calls || [])
    .filter(c => PROP_SIGNAL_SOURCES.includes(c.source) && c.status === 'open' && !c._placed)
    .filter(c => {
      const p = c.betPrice || c.entry || 0;
      // odds_misprice: accept 40-80¢ (mispricing can be in either direction)
      // everything else: 55¢+ YES only (our data shows NO bets = coin flip)
      if (c.source === 'odds_misprice') {
        if (p < 0.40 || p > 0.80) return false;
      } else {
        if (p < 0.55 || p > 0.80) return false;
        if (c.source === 'vol_spike' && c.direction === 'BUY_NO') return false;
      }
      if (!c.openedAt) return false;
      const age = (Date.now() - new Date(c.openedAt)) / 3600000;
      return age >= 0 && age < 12; // max 12h — prices move, stale = unreliable
    })
    .sort((a,b) => {
      // odds_misprice first (real edge), then combo, then vol_spike
      const rank = { odds_misprice:0, poly_combo_triple:1, poly_combo_double:2, vol_spike:3, obi_sweep:4, compound_edge:5 };
      const rA = rank[a.source]||9, rB = rank[b.source]||9;
      if (rA !== rB) return rA - rB;
      // Within same source, sort by gap size (odds_misprice) or recency
      const gapA = Math.abs(a.extra?.gap||0), gapB = Math.abs(b.extra?.gap||0);
      if (gapA !== gapB) return gapB - gapA;
      return new Date(b.openedAt||0) - new Date(a.openedAt||0);
    });

  const currentCall = propCalls[cardIndex] || null;

  // Swipe gesture handlers
  function onTouchStart(e) {
    touchStart.current = e.touches[0].clientX;
    setDragX(0);
  }
  function onTouchMove(e) {
    if (touchStart.current === null) return;
    const dx = e.touches[0].clientX - touchStart.current;
    setDragX(dx);
  }
  function onTouchEnd() {
    const dx = dragX;
    touchStart.current = null;
    setDragX(0);
    if (dx > 80) handleSwipeRight();
    else if (dx < -80) handleSwipeLeft();
  }

  function handleSwipeRight() {
    if (!currentCall) return;
    const entry = currentCall.betPrice || currentCall.entry || 0;
    const srcSizes = { odds_misprice:100, poly_combo_triple:150, poly_combo_double:100, vol_spike:75, obi_sweep:75, compound_edge:75, hip3_diverge:0 };
    const defaultSize = srcSizes[currentCall.source] || 75;
    setPriceInput(Math.round(entry * 100).toString());
    setSizeInput(defaultSize.toString());
    setPriceModal(currentCall);
    setSwipeDir('right');
    setTimeout(() => setSwipeDir(null), 400);
  }

  function handleSwipeLeft() {
    if (!currentCall) return;
    setSwipeDir('left');
    setTimeout(() => { setSwipeDir(null); advanceCard(); }, 350);
  }

  function advanceCard() {
    setCardIndex(i => i + 1);
  }

  async function confirmTrade() {
    if (!priceModal || submitting) return;
    const price = parseFloat(priceInput) / 100;
    const size  = parseFloat(sizeInput);
    if (!price || price < 0.20 || price > 0.80) { showToast('Price must be 20-80¢', C.red); return; }
    if (!size || size < 1) { showToast('Enter a bet size', C.red); return; }
    setSubmitting(true);
    try {
      const r = await fetch('/api/alpha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log-trade',
          callId: priceModal.id,
          actualEntry: price,
          betSize: size,
          direction: priceModal.direction,
          market: (priceModal.extra?.question || priceModal.asset || '').slice(0, 80),
        }),
      });
      const d = await r.json();
      if (d.success) {
        showToast(`✅ Bet logged! $${size} @ ${Math.round(price*100)}¢`);
        setPriceModal(null);
        advanceCard();
      } else if (d.error === 'Trade already logged') {
        showToast('Already logged', C.amber);
        setPriceModal(null);
        advanceCard();
      } else {
        showToast('Error: ' + d.error, C.red);
      }
    } catch { showToast('Network error', C.red); }
    setSubmitting(false);
  }

  async function resolveActiveTrade(callId, outcome) {
    const r = await fetch('/api/alpha', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resolve-trade', callId, outcome }),
    });
    const d = await r.json();
    if (d.success) showToast(`${outcome === 'win' ? '✅ WIN' : outcome === 'loss' ? '❌ LOSS' : '⏭️ MISSED'} — Balance: $${d.newBalance?.toFixed(2)}`);
    else showToast('Error: ' + d.error, C.red);
  }

  // Build the signal reason chips for a call
  function getSignalChips(call) {
    const chips = [];
    const src = call.source;
    // Odds mispricing — the primary signal now
    if (src === 'odds_misprice') {
      const gap = call.extra?.gap || 0;
      const sb = call.extra?.sbProb != null ? Math.round(call.extra.sbProb*100) : '?';
      const poly = call.extra?.polyProb != null ? Math.round(call.extra.polyProb*100) : '?';
      const books = call.extra?.books || 0;
      chips.push({ label: `📐 ${Math.abs(gap).toFixed(0)}% GAP vs Books`, color: C.green });
      chips.push({ label: `📚 Sportsbooks: ${sb}% | Poly: ${poly}%`, color: '#00d4ff' });
      chips.push({ label: `${books} bookmakers agree`, color: C.dim });
      return chips;
    }
    if (src === 'poly_combo_triple') chips.push({ label:'🔥🔥🔥 TRIPLE SIGNAL', color: C.green });
    else if (src === 'poly_combo_double') chips.push({ label:'⚡⚡ DOUBLE SIGNAL', color: C.green });
    if (src === 'vol_spike' || call.extra?.hasVolSpike) chips.push({ label:'📈 Vol Spike', color: C.green });
    if (src === 'obi_sweep' || call.extra?.hasOBI) chips.push({ label: `📊 OBI ${call.extra?.obiValue != null ? (call.extra.obiValue > 0 ? '+' : '') + call.extra.obiValue.toFixed(2) : ''}`, color: '#00d4ff' });
    if (call.extra?.traderName) chips.push({ label: `🐋 ${call.extra.traderName}`, color: C.amber });
    const edgeSnip = (call.edge || '').match(/(\d+)%.*?vol/i);
    if (edgeSnip) chips.push({ label: `${edgeSnip[0].slice(0,30)}`, color: C.dim });
    return chips;
  }

  function getDirectionLabel(call) {
    const dir = call.direction || '';
    const q = call.extra?.question || call.asset || '';
    const isVs = q.match(/ vs\.? /i);
    if (dir === 'BUY_YES') {
      if (isVs) return q.split(/ vs\.? /i)[0].split(':').pop().trim().split(' ').slice(0,3).join(' ') + ' to WIN';
      if (q.match(/Over/i)) return 'OVER';
      return 'YES';
    } else if (dir === 'BUY_NO') {
      if (isVs) return (q.split(/ vs\.? /i)[1] || '').trim().split(' ').slice(0,3).join(' ') + ' to WIN';
      if (q.match(/Over/i)) return 'UNDER';
      return 'NO';
    }
    return dir;
  }

  function Bar({ pct, color, h = 4 }) {
    return (
      <div style={{ background:'#1a1a1a', borderRadius:3, height:h, overflow:'hidden' }}>
        <div style={{ width:`${Math.min(100,pct||0)}%`, height:'100%', background:color }} />
      </div>
    );
  }

  return (
    <div style={{ paddingTop:8 }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:60, left:'50%', transform:'translateX(-50%)', zIndex:999,
          background:'#1a1a1a', border:`1px solid ${toast.color}`, borderRadius:10,
          padding:'10px 20px', fontSize:12, color:toast.color, fontWeight:700, pointerEvents:'none',
          boxShadow:'0 4px 20px rgba(0,0,0,0.5)' }}>
          {toast.msg}
        </div>
      )}

      {/* Account health bar */}
      <Card style={{ marginBottom:8 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
          <span style={{ fontSize:12, fontWeight:700, color:C.green }}>🎯 PROP.MARKET</span>
          <span style={{ fontSize:10, color:C.dim }}>{pmDaysLeft}d left · {wr !== null ? wr+'% WR' : 'no trades yet'}</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:4 }}>
          <span style={{ color:C.text, fontWeight:700 }}>${pmBal.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
          <span style={{ color:C.dim }}>target ${(pmStart*1.2).toLocaleString()}</span>
        </div>
        <Bar pct={pmProgress} color={C.green} h={5} />
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4, fontSize:9, color:C.dim }}>
          <span style={{ color: pmDD>8?C.red:pmDD>5?C.amber:C.dim }}>DD: {pmDD.toFixed(1)}% {pmDD>8?'🔴':pmDD>5?'⚠️':''}</span>
          <span>{winCount}W/{lossCount}L · floor ${pmFloor.toFixed(0)}</span>
        </div>
        {pmDD > 0 && <Bar pct={pmDD/10*100} color={pmDD>8?C.red:pmDD>5?C.amber:'#1a1a1a'} h={3} />}
      </Card>

      {/* Swipe card deck */}
      {propCalls.length === 0 ? (
        <Card style={{ textAlign:'center', padding:32 }}>
          <div style={{ fontSize:24, marginBottom:8 }}>〰️</div>
          <div style={{ fontSize:13, color:C.dim }}>No new signals right now</div>
          <div style={{ fontSize:10, color:C.dim, marginTop:6 }}>Scanner checks every 15 min</div>
          {cardIndex > 0 && (
            <button onClick={() => setCardIndex(0)}
              style={{ marginTop:16, padding:'8px 20px', borderRadius:8, background:'#1a1a1a',
                color:C.dim, border:'1px solid #333', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>
              ↺ Start over
            </button>
          )}
        </Card>
      ) : (
        <div style={{ position:'relative', marginBottom:12 }}>
          {/* Stack peek — next card behind */}
          {propCalls[cardIndex + 1] && (
            <div style={{ position:'absolute', top:6, left:8, right:8, height:'60px',
              background:'#111', borderRadius:14, border:'1px solid #222', zIndex:0 }} />
          )}

          {/* Current swipe card */}
          {currentCall && (
            <div
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{
                position:'relative', zIndex:1,
                background:'#0f0f0f', borderRadius:14,
                border: `2px solid ${dragX > 40 ? C.green : dragX < -40 ? C.red : '#222'}`,
                padding:16, userSelect:'none',
                transform: `translateX(${dragX * 0.5}px) rotate(${dragX * 0.02}deg)`,
                transition: swipeDir ? 'transform 0.35s ease, opacity 0.35s ease' : 'border-color 0.1s',
                opacity: swipeDir ? 0 : 1,
                boxShadow: dragX > 40 ? `0 0 20px ${C.green}40` : dragX < -40 ? `0 0 20px ${C.red}40` : 'none',
              }}
            >
              {/* Swipe hint labels */}
              {dragX > 40 && (
                <div style={{ position:'absolute', top:16, left:16, fontSize:22, fontWeight:900,
                  color:C.green, opacity: Math.min(1, (dragX-40)/60), border:`3px solid ${C.green}`,
                  borderRadius:8, padding:'4px 10px', transform:'rotate(-15deg)' }}>
                  PLACE IT
                </div>
              )}
              {dragX < -40 && (
                <div style={{ position:'absolute', top:16, right:16, fontSize:22, fontWeight:900,
                  color:C.red, opacity: Math.min(1, (-dragX-40)/60), border:`3px solid ${C.red}`,
                  borderRadius:8, padding:'4px 10px', transform:'rotate(15deg)' }}>
                  SKIP
                </div>
              )}

              {/* Signal source badge */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <div style={{ fontSize:9, color:C.green, letterSpacing:'.15em', fontWeight:700 }}>
                  {currentCall.source.replace('poly_combo_','').replace('_',' ').toUpperCase()}
                </div>
                <div style={{ fontSize:9, color:C.dim }}>
                  {cardIndex + 1} / {propCalls.length}
                </div>
              </div>

              {/* Market name */}
              <div style={{ fontSize:14, fontWeight:700, color:C.text, lineHeight:1.3, marginBottom:12 }}>
                {(currentCall.extra?.question || currentCall.asset || '').slice(0, 80)}
              </div>

              {/* THE BET */}
              <div style={{ fontSize:26, fontWeight:900, color:C.green, marginBottom:12, letterSpacing:'-0.5px' }}>
                {getDirectionLabel(currentCall)}
              </div>

              {/* Stats row */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:12 }}>
                {[
                  { label:'PRICE', val:`${Math.round((currentCall.betPrice||currentCall.entry||0)*100)}¢` },
                  { label:'PAYS', val:`${((currentCall.betPrice||currentCall.entry||0)>0 ? 1/(currentCall.betPrice||currentCall.entry||0) : 0).toFixed(2)}x` },
                  { label:'SIZE', val:`$${({ odds_misprice:100, poly_combo_triple:150, poly_combo_double:100, vol_spike:75, obi_sweep:75, compound_edge:75, hip3_diverge:0 }[currentCall.source] || 75)}` },
                ].map(({ label, val }) => (
                  <div key={label} style={{ background:'#141414', borderRadius:8, padding:'8px', textAlign:'center' }}>
                    <div style={{ fontSize:8, color:C.dim, letterSpacing:'.1em' }}>{label}</div>
                    <div style={{ fontSize:16, fontWeight:800, color:C.text }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Signal reason chips */}
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
                {getSignalChips(currentCall).map((chip, i) => (
                  <div key={i} style={{ fontSize:10, padding:'4px 10px', borderRadius:20,
                    background:chip.color+'18', color:chip.color,
                    border:`1px solid ${chip.color}40`, fontWeight:600 }}>
                    {chip.label}
                  </div>
                ))}
              </div>

              {/* Swipe hint */}
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.dim, paddingTop:8, borderTop:'1px solid #1a1a1a' }}>
                <span>← SKIP</span>
                <span style={{ fontSize:9 }}>swipe or tap buttons</span>
                <span>PLACE →</span>
              </div>

              {/* Tap buttons for non-touch */}
              <div style={{ display:'flex', gap:8, marginTop:10 }}>
                <button onClick={handleSwipeLeft}
                  style={{ flex:1, padding:'10px', borderRadius:10, background:C.red+'15',
                    color:C.red, border:`1px solid ${C.red}40`, fontSize:13, fontWeight:700,
                    cursor:'pointer', fontFamily:'inherit' }}>
                  ✕ Skip
                </button>
                <button onClick={handleSwipeRight}
                  style={{ flex:2, padding:'10px', borderRadius:10, background:C.green+'20',
                    color:C.green, border:`1px solid ${C.green}44`, fontSize:13, fontWeight:700,
                    cursor:'pointer', fontFamily:'inherit' }}>
                  ✓ Place Bet
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active trades drawer toggle */}
      {activeTrades.length > 0 && (
        <div>
          <button onClick={() => setDrawerOpen(o => !o)}
            style={{ width:'100%', padding:'12px 16px', borderRadius:10, background:'#0d1a0d',
              color:C.green, border:`1px solid ${C.green}30`, fontSize:12, fontWeight:700,
              cursor:'pointer', fontFamily:'inherit', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>📋 Active bets ({activeTrades.length})</span>
            <span style={{ fontSize:11 }}>{drawerOpen ? '▲ hide' : '▼ show'}</span>
          </button>

          {drawerOpen && (
            <div style={{ marginTop:4 }}>
              {activeTrades.map((t, i) => (
                <div key={i} style={{ padding:'12px', borderRadius:10, background:'#0a140a',
                  border:`1px solid ${C.green}25`, marginTop:6 }}>
                  <div style={{ fontSize:11, color:C.text, marginBottom:4 }}>
                    {(t.market || '').slice(0,50)}
                  </div>
                  <div style={{ fontSize:10, color:C.green, marginBottom:8 }}>
                    {t.direction?.replace('BUY_','')} · ${t.betSize} @ {Math.round((t.entryPrice||0)*100)}¢
                    <span style={{ color:C.dim }}> · +${t.potentialWin?.toFixed(2)||'?'} if win</span>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    {['win','loss','missed'].map(o => (
                      <button key={o} onClick={() => resolveActiveTrade(t.callId, o)}
                        style={{ flex:1, padding:'7px 4px', borderRadius:7, cursor:'pointer',
                          fontFamily:'inherit', fontSize:10, fontWeight:700,
                          background: o==='win'?C.green+'18':o==='loss'?C.red+'18':'#1a1a1a',
                          color: o==='win'?C.green:o==='loss'?C.red:C.dim,
                          border:`1px solid ${o==='win'?C.green:o==='loss'?C.red:'#333'}44` }}>
                        {o==='win'?'✅ WIN':o==='loss'?'❌ LOSS':'⏭️ MISS'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price entry modal */}
      {priceModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:100,
          display:'flex', alignItems:'flex-end', justifyContent:'center' }}
          onClick={(e) => { if (e.target === e.currentTarget) setPriceModal(null); }}>
          <div style={{ background:'#111', borderRadius:'16px 16px 0 0', padding:24,
            width:'100%', maxWidth:480, border:'1px solid #222', borderBottom:'none' }}>
            <div style={{ fontSize:12, color:C.dim, marginBottom:4 }}>Logging bet ✅</div>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:16, lineHeight:1.3 }}>
              {(priceModal.extra?.question || priceModal.asset || '').slice(0,60)}
            </div>

            <div style={{ marginBottom:12 }}>
              <label style={{ fontSize:10, color:C.dim, letterSpacing:'.1em', display:'block', marginBottom:6 }}>
                PRICE YOU GOT IN (¢)
              </label>
              <input
                type="number"
                value={priceInput}
                onChange={e => setPriceInput(e.target.value)}
                placeholder={`Signal price: ${Math.round((priceModal.betPrice||priceModal.entry||0)*100)}¢`}
                style={{ width:'100%', padding:'12px', borderRadius:8, background:'#0d0d0d',
                  border:'1px solid #333', color:C.text, fontSize:16, fontFamily:'inherit',
                  boxSizing:'border-box', outline:'none' }}
                autoFocus
              />
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:10, color:C.dim, letterSpacing:'.1em', display:'block', marginBottom:6 }}>
                BET SIZE ($)
              </label>
              <input
                type="number"
                value={sizeInput}
                onChange={e => setSizeInput(e.target.value)}
                style={{ width:'100%', padding:'12px', borderRadius:8, background:'#0d0d0d',
                  border:'1px solid #333', color:C.text, fontSize:16, fontFamily:'inherit',
                  boxSizing:'border-box', outline:'none' }}
              />
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setPriceModal(null)}
                style={{ flex:1, padding:'14px', borderRadius:10, background:'#1a1a1a',
                  color:C.dim, border:'1px solid #333', fontSize:13, fontWeight:700,
                  cursor:'pointer', fontFamily:'inherit' }}>
                Cancel
              </button>
              <button onClick={confirmTrade} disabled={submitting}
                style={{ flex:2, padding:'14px', borderRadius:10, background:C.green+'22',
                  color:C.green, border:`1px solid ${C.green}44`, fontSize:13, fontWeight:800,
                  cursor:'pointer', fontFamily:'inherit', opacity: submitting ? 0.5 : 1 }}>
                {submitting ? 'Logging...' : '✅ Confirm Bet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Propr pending note */}
      <Card style={{ marginTop:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:C.amber }}>🏆 PROPR — HyperLiquid</div>
            <div style={{ fontSize:9, color:C.dim, marginTop:2 }}>Needs VPN + $110 · hip3_diverge signals</div>
          </div>
          <div style={{ fontSize:9, padding:'3px 8px', borderRadius:8, background:C.amber+'20', color:C.amber, border:`1px solid ${C.amber}40` }}>⏳ PENDING</div>
        </div>
      </Card>

    </div>
  );
}

function ScoreTab({ calls }) {
  const closed = calls.filter(c=>c.status==='closed'&&(c.outcome==='win'||c.outcome==='loss'));
  const wins = closed.filter(c=>c.outcome==='win');
  const wr = closed.length ? Math.round(wins.length/closed.length*100) : null;
  const avgPnl = closed.length ? (closed.reduce((s,c)=>s+(c.pnlPct||0),0)/closed.length).toFixed(1) : null;

  const lanes = ['btc','pred','memecoin','hip3','lp','ton','news'];
  const laneStats = lanes.map(lane => {
    const lc = closed.filter(c => getLane(c.source)===lane);
    const lw = lc.filter(c=>c.outcome==='win');
    return { lane, total:lc.length, wins:lw.length, wr:lc.length?Math.round(lw.length/lc.length*100):null };
  }).filter(s=>s.total>0);

  return (
    <>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, margin:'8px 0 12px' }}>
        <Card style={{ marginBottom:0 }}>
          <div style={{ fontSize:9, letterSpacing:'.2em', color:C.dim, marginBottom:3 }}>WIN RATE</div>
          <div style={{ fontSize:22, fontWeight:700, color:wr==null?C.dim:wr>=60?C.green:wr>=40?C.amber:C.red }}>
            {wr!=null?wr+'%':'—'}
          </div>
          <div style={{ fontSize:10, color:C.dim }}>{wins.length}/{closed.length} resolved</div>
        </Card>
        <Card style={{ marginBottom:0 }}>
          <div style={{ fontSize:9, letterSpacing:'.2em', color:C.dim, marginBottom:3 }}>AVG P&L</div>
          <div style={{ fontSize:22, fontWeight:700, color:avgPnl==null?C.dim:parseFloat(avgPnl)>=0?C.green:C.red }}>
            {avgPnl!=null?(parseFloat(avgPnl)>=0?'+':'')+avgPnl+'%':'—'}
          </div>
        </Card>
      </div>

      {laneStats.length > 0 ? (
        <>
          <div style={{ fontSize:9, letterSpacing:'.2em', color:C.dim, marginBottom:8 }}>BY LANE</div>
          {laneStats.map(({lane,total,wins,wr}) => {
            const color = LANE_COLORS[lane]||C.dim;
            return (
              <Card key={lane} style={{ padding:'10px 14px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:12 }}>{LANE_LABELS[lane]||lane}</span>
                  <span style={{ fontWeight:700, color:wr>=60?C.green:wr>=40?C.amber:C.red }}>{wr}% <span style={{ color:C.dim, fontWeight:400 }}>({total} calls)</span></span>
                </div>
                <div style={{ width:'100%', height:4, background:'#1c1c1c', borderRadius:2 }}>
                  <div style={{ width:wr+'%', height:'100%', background:color, borderRadius:2 }} />
                </div>
              </Card>
            );
          })}
        </>
      ) : (
        <div style={{ color:C.dim, padding:'28px 0', textAlign:'center', lineHeight:1.8 }}>
          No resolved calls yet.<br/>
          <span style={{ fontSize:11 }}>Data builds as calls hit stop or target.</span>
        </div>
      )}

      {/* Recent closed calls log */}
      {closed.length > 0 && (
        <>
          <div style={{ fontSize:9, letterSpacing:'.2em', color:C.dim, marginBottom:8, marginTop:16 }}>CLOSED CALLS</div>
          {closed.slice().reverse().slice(0,8).map((c,i) => {
            const pnl = c.pnlPct;
            const pnlColor = pnl >= 0 ? C.green : C.red;
            const emoji = c.outcome === 'win' ? '✅' : '❌';
            const lane = getLane(c.source);
            return (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid '+C.border }}>
                <div>
                  <span style={{ fontSize:12 }}>{emoji} {c.direction} {c.asset}</span>
                  <div style={{ fontSize:10, color:C.dim }}>{(c.source||'').replace(/_/g,' ')} · {c.closedAt?.slice(5,16).replace('T',' ')}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontWeight:700, color:pnlColor }}>{pnl>=0?'+':''}{pnl?.toFixed(1)}%</div>
                  <div style={{ fontSize:10, color:LANE_COLORS[lane]||C.dim }}>{LANE_LABELS[lane]?.split(' ')[1]||lane}</div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Open calls summary */}
      <div style={{ fontSize:9, letterSpacing:'.2em', color:C.dim, marginBottom:8, marginTop:16 }}>OPEN CALLS BY LANE</div>
      {lanes.map(lane => {
        const open = calls.filter(c=>c.status==='open'&&getLane(c.source)===lane).length;
        if (!open) return null;
        return (
          <div key={lane} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid '+C.border, fontSize:12 }}>
            <span>{LANE_LABELS[lane]||lane}</span>
            <span style={{ color:LANE_COLORS[lane]||C.dim }}>{open} open</span>
          </div>
        );
      })}

      {/* Signal status */}
      <div style={{ fontSize:9, letterSpacing:'.2em', color:C.dim, marginBottom:8, marginTop:16 }}>SIGNAL STATUS</div>
      <div style={{ fontSize:11, color:C.green }}>✅ vol_spike: 76% WR (70W/22L) — BEST</div>
      <div style={{ fontSize:11, color:C.green }}>✅ hip3_diverge: 75% WR (27W/9L) — SOLID</div>
      <div style={{ fontSize:11, color:C.amber }}>⏳ poly_updown: rebuilding with 0.55 threshold</div>
      <div style={{ fontSize:11, color:C.amber }}>⏳ wallet_coord/gmgn: newly wired — building data</div>
      <div style={{ fontSize:11, color:C.red }}>❌ btc_5min: DISABLED (near-zero EV)</div>
      <div style={{ fontSize:11, color:C.red }}>❌ crypto_predict: DISABLED (-21.5% avg PnL)</div>
    </>
  );
}

// ── SmartMoney Tab ───────────────────────────────────────────────
function SmartMoneyTab({ calls, smartMoney }) {
  const positions = smartMoney?.wallets || {};
  const arbs      = smartMoney?.arbs || [];
  const updatedAt = smartMoney?.positionsUpdatedAt;

  const consensusCalls = calls.filter(c =>
    c.status === 'open' && c.source === 'consensus_tracker'
  );
  const arbCalls = calls.filter(c =>
    c.status === 'open' && c.source === 'cross_venue_arb'
  );
  const fundingCalls = calls.filter(c =>
    c.status === 'open' && c.source === 'funding_neutral'
  );

  const SMART_WALLET_PNL = {
    'Theo4': 22053934, 'Fredi9999': 16619507, 'Len9311238': 8709973,
    'RepTrump': 7532410, 'PrincessCaro': 6083643, 'walletmobile': 5942685,
  };

  const sortedWallets = Object.entries(positions)
    .sort(([a],[b]) => (SMART_WALLET_PNL[b]||0) - (SMART_WALLET_PNL[a]||0));

  return (
    <>
      {/* Consensus alerts */}
      {consensusCalls.length > 0 && (
        <>
          <div style={{ fontSize:9, letterSpacing:'.2em', color:'#00e5ff', margin:'12px 0 8px' }}>🐋 CONSENSUS SIGNALS</div>
          {consensusCalls.slice(0, 5).map((c, i) => {
            const dir = c.direction?.replace('BUY_','') || '?';
            const walletN = c.extra?.wallets?.length || '?';
            return (
              <Card key={i} style={{ borderColor:'#00e5ff40' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'#00e5ff' }}>🐋 BUY {dir}</span>
                  <Tag label={`${walletN} wallets`} color='#00e5ff' />
                </div>
                <div style={{ fontSize:11, marginTop:4 }}>{(c.asset||'').slice(0,80)}</div>
                <div style={{ fontSize:10, color:C.dim, marginTop:2 }}>
                  Entry: {Math.round((c.entry||0)*100)}¢ | {c.confidence}
                </div>
                {c.edge && <div style={{ fontSize:9, color:C.dim, marginTop:2 }}>{c.edge.slice(0,80)}</div>}
              </Card>
            );
          })}
        </>
      )}

      {/* Arb opportunities */}
      {(arbCalls.length > 0 || arbs.length > 0) && (
        <>
          <div style={{ fontSize:9, letterSpacing:'.2em', color:C.amber, margin:'12px 0 8px' }}>⚡ CROSS-VENUE ARB</div>
          {[...arbCalls, ...arbs.filter(a => !arbCalls.some(c => c.extra?.kalshiMarket === a.extra?.kalshiMarket))].slice(0, 5).map((item, i) => (
            <Card key={i} style={{ borderColor:C.amber+'40' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:11, fontWeight:700, color:C.amber }}>⚡ ARB</span>
                <Tag label={(item.extra?.edgePct||'?') + '% edge'} color={C.amber} />
              </div>
              <div style={{ fontSize:11, marginTop:4 }}>{(item.asset||'').slice(0,70)}</div>
              <div style={{ fontSize:10, color:C.dim, marginTop:2 }}>{(item.edge||'').slice(0,80)}</div>
              {item.extra?.kalshiMarket && (
                <div style={{ fontSize:9, color:C.dim, marginTop:2 }}>Kalshi: {item.extra.kalshiMarket}</div>
              )}
            </Card>
          ))}
        </>
      )}

      {/* Funding harvest */}
      {fundingCalls.length > 0 && (
        <>
          <div style={{ fontSize:9, letterSpacing:'.2em', color:C.green, margin:'12px 0 8px' }}>💰 FUNDING HARVEST</div>
          {fundingCalls.slice(0, 4).map((c, i) => (
            <Card key={i}>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontWeight:700 }}>SHORT {c.asset}</span>
                <Tag label={`${c.extra?.fundingAnn?.toFixed(0)||'?'}% ann`} color={C.green} />
              </div>
              <div style={{ fontSize:10, color:C.dim, marginTop:4 }}>{c.edge}</div>
            </Card>
          ))}
        </>
      )}

      {/* Smart wallet positions */}
      <div style={{ fontSize:9, letterSpacing:'.2em', color:C.dim, margin:'12px 0 8px' }}>
        TOP WALLET POSITIONS {updatedAt ? '· ' + new Date(updatedAt).toLocaleTimeString() : ''}
      </div>
      {sortedWallets.length === 0 ? (
        <Card><div style={{ color:C.dim, fontSize:12, textAlign:'center' }}>
          No positions loaded. Run consensus-tracker to populate.
        </div></Card>
      ) : sortedWallets.map(([name, pos]) => {
        const pnl = SMART_WALLET_PNL[name];
        return (
          <Card key={name}>
            <div style={{ fontWeight:700, fontSize:12, marginBottom:4 }}>
              {name} {pnl ? <span style={{ color:C.dim, fontWeight:400 }}>({(pnl/1e6).toFixed(1)}M PnL)</span> : ''}
            </div>
            {(pos||[]).slice(0,5).map((p, i) => (
              <div key={i} style={{ fontSize:10, color:C.dim, lineHeight:1.7 }}>
                {p.outcome === 'YES' ? '✅' : '❌'} "{(p.question||'').slice(0,55)}" @ {Math.round(p.price*100)}¢
                {p.value > 0 ? ` · $${Math.round(p.value).toLocaleString()}` : ''}
              </div>
            ))}
            {(pos||[]).length > 5 && <div style={{ fontSize:9, color:C.dim }}>+{pos.length-5} more</div>}
          </Card>
        );
      })}
    </>
  );
}

// ── Predict Tab — Polymarket predictions ─────────────────────────
function PredictTab({ calls, prices }) {
  // Polymarket Up/Down (BTC/ETH/SOL hourly candle markets)
  const polyUD = calls.filter(c => c.source === 'poly_updown');
  const polyUDOpen = polyUD.filter(c => c.status === 'open');
  const polyUDClosed = polyUD.filter(c => c.status === 'closed' && (c.outcome === 'win' || c.outcome === 'loss'));
  const polyUDWins = polyUDClosed.filter(c => c.outcome === 'win');
  const polyUDWr = polyUDClosed.length > 0 ? Math.round(polyUDWins.length / polyUDClosed.length * 100) : null;

  // Other Polymarket prediction calls
  const polyCalls = calls.filter(c => ['vol_spike','longshot_load','near_term_edge','poly_diverge'].includes(c.source));
  const polyOpen = polyCalls.filter(c => c.status === 'open');
  const polyClosed = polyCalls.filter(c => c.status === 'closed' && (c.outcome === 'win' || c.outcome === 'loss'));
  const polyWins = polyClosed.filter(c => c.outcome === 'win');
  const polyWr = polyClosed.length > 0 ? Math.round(polyWins.length / polyClosed.length * 100) : null;

  const wrColor = (wr) => wr == null ? C.dim : wr >= 60 ? C.green : wr >= 40 ? C.amber : C.red;

  return (
    <>
      {/* Polymarket Up/Down — real hourly candle markets */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginTop:16, marginBottom:8 }}>
        <div style={{ fontSize:9, letterSpacing:'.2em', color:C.dim }}>POLY UP/DOWN MARKETS</div>
        <div style={{ fontSize:9, color:C.amber }}>threshold: 0.55 · HIGH conf only</div>
      </div>
      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div>
            <div style={{ fontSize:8, color:C.dim }}>WIN RATE</div>
            <div style={{ fontSize:18, fontWeight:700, color:polyUDWr==null?C.dim:polyUDWr>=60?C.green:polyUDWr>=40?C.amber:C.red }}>
              {polyUDWr != null ? polyUDWr+'%' : '—'}
            </div>
            <div style={{ fontSize:9, color:C.dim }}>{polyUDWins.length}/{polyUDClosed.length}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:8, color:C.dim }}>OPEN</div>
            <div style={{ fontSize:16, fontWeight:700 }}>{polyUDOpen.length}</div>
            <div style={{ fontSize:9, color:C.dim }}>trades</div>
          </div>
        </div>

        {polyUDOpen.map((c,i) => {
          const e = c.extra || {};
          const isUp = e.predictedDirection === 'UP';
          const minsLeft = e.endDate ? Math.round((new Date(e.endDate) - Date.now()) / 60000) : null;
          const curPrices = prices || {};
          const coinPriceMap = { bitcoin: curPrices.bitcoin?.price, ethereum: curPrices.ethereum?.price, solana: curPrices.solana?.price };
          const curPrice = coinPriceMap[e.coin];
          const liqK = e.liquidity ? '$'+(e.liquidity/1000).toFixed(0)+'k liq' : '';
          return (
            <div key={i} style={{ padding:'8px 0', borderBottom:'1px solid '+C.border }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:12, fontWeight:700, color:isUp?C.green:C.red }}>
                  {e.emoji} {e.label} {isUp?'📈 UP':'📉 DOWN'}
                </span>
                <span style={{ fontSize:10, color:C.dim }}>
                  {minsLeft != null ? (minsLeft > 0 ? minsLeft+'min' : 'closing...') : ''}
                </span>
              </div>
              <div style={{ fontSize:10, color:C.dim, marginTop:2 }}>
                Entry {(e.entryProb*100).toFixed(0)}¢ | signal {e.signal?.toFixed(2)} | {liqK}
              </div>
              {curPrice && (
                <div style={{ fontSize:9, color:C.dim }}>
                  Now: ${e.coin === 'bitcoin' ? curPrice?.toFixed(0) : curPrice?.toFixed(2)}
                </div>
              )}
            </div>
          );
        })}

        {polyUDClosed.length > 0 && (
          <>
            <div style={{ fontSize:8, color:C.dim, letterSpacing:'.15em', marginTop:10, marginBottom:6 }}>RECENT</div>
            {polyUDClosed.slice().reverse().slice(0,4).map((c,i) => {
              const e = c.extra || {};
              return (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:10, padding:'3px 0', borderBottom:'1px solid '+C.border }}>
                  <span>{c.outcome==='win'?'✅':'❌'} {e.emoji} {e.predictedDirection}</span>
                  <span style={{ color:C.dim }}>{e.resolvedOutcome || '?'}</span>
                  <span style={{ color:(c.pnlPct||0)>0?C.green:C.red }}>{(c.pnlPct||0)>0?'+':''}{c.pnlPct}%</span>
                </div>
              );
            })}
          </>
        )}

        {polyUD.length === 0 && (
          <div style={{ color:C.dim, textAlign:'center', padding:'8px 0', fontSize:11 }}>
            Scanning for markets... checks every 30min
          </div>
        )}
      </Card>

      {/* Other Polymarket calls */}
      <div style={{ fontSize:9, letterSpacing:'.2em', color:C.dim, marginBottom:8, marginTop:16 }}>POLYMARKET SIGNALS</div>
      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
          <div>
            <div style={{ fontSize:8, color:C.dim }}>WIN RATE</div>
            <div style={{ fontSize:16, fontWeight:700, color:wrColor(polyWr) }}>
              {polyWr != null ? polyWr+'%' : '—'}
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:8, color:C.dim }}>OPEN</div>
            <div style={{ fontSize:16, fontWeight:700 }}>{polyOpen.length}</div>
          </div>
        </div>
        {polyOpen.slice(0,4).map((c,i) => {
          const isBuyYes = c.direction === 'BUY_YES';
          const cq = c.extra?.question || c.asset || '';
          const cIsVs = cq.match(/ vs\.? /i);
          let cBetLabel = isBuyYes ? 'YES' : 'NO';
          if (cIsVs) {
            const parts = cq.split(/ vs\.? /i);
            cBetLabel = isBuyYes
              ? parts[0].trim().split(' ').slice(-2).join(' ') + ' WIN'
              : (parts[1]||'').trim().split(/[^a-zA-Z0-9 ]/)[0].trim().split(' ').slice(0,2).join(' ') + ' WIN';
          }
          return (
            <div key={i} style={{ padding:'8px 0', borderBottom:'1px solid '+C.border }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <span style={{ fontSize:11, flex:1, marginRight:8 }}>{c.asset?.slice(0,45)}</span>
                <span style={{ fontSize:9, color:isBuyYes?C.green:C.amber, whiteSpace:'nowrap' }}>
                  {cBetLabel} {c.entry ? (c.entry*100).toFixed(0)+'¢' : ''}
                </span>
              </div>
              <div style={{ fontSize:9, color:C.dim, marginTop:2 }}>{c.edge?.slice(0,60)}</div>
            </div>
          );
        })}
        {polyOpen.length === 0 && (
          <div style={{ color:C.dim, textAlign:'center', padding:'8px 0', fontSize:11 }}>No active prediction calls</div>
        )}
      </Card>
    </>
  );
}

// ── Wallets Tab ───────────────────────────────────────────────────
function WalletsTab({ wallets }) {
  if (!wallets || wallets.length === 0) {
    return (
      <Card style={{ marginTop: 8 }}>
        <div style={{ color: C.dim, textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 13, marginBottom: 8 }}>Building wallet profiles...</div>
          <div style={{ fontSize: 11 }}>Insider hunter scans every 2h</div>
          <div style={{ fontSize: 11 }}>Finds early buyers of pumped tokens</div>
        </div>
      </Card>
    );
  }

  const patternColor = { insider: C.green, quick_flip: C.amber, degenerate: C.red, unknown: C.dim };
  const patternEmoji = { insider: '🎯', quick_flip: '⚡', degenerate: '🎰', unknown: '❓' };

  return (
    <>
      <Card style={{ marginTop: 8, padding: '10px 14px' }}>
        <div style={{ fontSize: 9, letterSpacing: '.2em', color: C.dim, marginBottom: 6 }}>TRACKED WALLETS</div>
        <div style={{ fontSize: 11, color: C.dim }}>
          Scoring based on: early entry timing, pump rate, repeat pattern, position size
        </div>
      </Card>
      {wallets.map((w, i) => {
        const wr = w.winRate;
        const pc = patternColor[w.patternType] || C.dim;
        const pe = patternEmoji[w.patternType] || '❓';
        const dist = w.outcomeDistribution || {};
        const distStr = Object.entries(dist).filter(([,v])=>v>0).map(([k,v])=>`${k}:${v}`).join(' ');
        return (
          <Card key={i}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <span style={{ fontWeight: 700 }}>{pe} {w.label}</span>
              <Tag label={w.patternType || 'unknown'} color={pc} />
            </div>
            <div style={{ fontSize: 11, color: C.dim, lineHeight: 1.8 }}>
              {w.address?.slice(0,8)}...{w.address?.slice(-4)} · {w.chain}<br/>
              WR: <b style={{ color: wr >= 60 ? C.green : wr >= 40 ? C.amber : C.red }}>{wr != null ? wr+'%' : '—'}</b>
              {' '}({w.wins}W/{w.losses}L) | score: {w.score}
              {w.pumpPct && <span> | found on {w.pumpPct}% pump</span>}
              {distStr && <div style={{ marginTop: 4, fontSize: 10, color: C.dim }}>{distStr}</div>}
              {w.avgHoldHours && <span> | avg hold: {w.avgHoldHours?.toFixed(1)}h</span>}
            </div>
          </Card>
        );
      })}
    </>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]     = useState('overview');
  const [data, setData]   = useState({ calls:[], prices:{}, fg:{}, pools:[], clusters:{}, brains:{}, walletCount:0, paper:null, gmgnSignals:[], hlData:{}, funding:{}, orderBook:{}, wallets:[], smartMoney:{}, propData:{} });
  const [loading, setLoading] = useState(true);
  const solAddr = null; // TON wallet connect coming soon

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const twa = window.Telegram.WebApp;
      twa.ready(); twa.expand();
      try { twa.setHeaderColor('#0a0a0a'); twa.setBackgroundColor('#0a0a0a'); } catch {}
    }
  }, []);

  const load = useCallback(async () => {
    const r = await Promise.allSettled([
      fetch('/api/alpha?action=calls').then(r=>r.json()),
      fetch('/api/alpha?action=market-intel').then(r=>r.json()),
      fetch('/api/alpha?action=meteora').then(r=>r.json()),
      fetch('/api/alpha?action=clusters').then(r=>r.json()),
      fetch('/api/alpha?action=brains').then(r=>r.json()),
      fetch('/api/alpha?action=paper').then(r=>r.json()),
      fetch('/api/alpha?action=gmgn').then(r=>r.json()),
      fetch('/api/alpha?action=hl').then(r=>r.json()),
      fetch('/api/alpha?action=wallets').then(r=>r.json()),
      fetch('/api/alpha?action=smart-money').then(r=>r.json()),
      fetch('/api/alpha?action=prop').then(r=>r.json()),
    ]);
    const [a,b,c,d,e,f,g,h,i2,j,k] = r;
    const intel = b.status==='fulfilled' ? b.value : {};
    const hlD   = h.status==='fulfilled' ? h.value : {};
    setData({
      calls:       a.status==='fulfilled' ? (a.value?.calls||[]) : [],
      prices:      intel.prices || {},
      fg:          intel.fear_greed || {},
      funding:     intel.funding || hlD.funding || {},
      orderBook:   intel.orderBook || {},
      pools:       c.status==='fulfilled' ? (c.value?.pools||[]) : [],
      clusters:    d.status==='fulfilled' ? (d.value?.clusters||{}) : {},
      walletCount: d.status==='fulfilled' ? (d.value?.walletCount||0) : 0,
      brains:      e.status==='fulfilled' ? e.value : {},
      paper:       f.status==='fulfilled' ? (f.value?.paper||null) : null,
      gmgnSignals: g.status==='fulfilled' ? (g.value?.signals||[]) : [],
      hlData:      hlD,
      wallets:     i2.status==='fulfilled' ? (i2.value?.wallets||[]) : [],
      smartMoney:  j.status==='fulfilled' ? (j.value||{}) : {},
      propData:    k.status==='fulfilled' ? (k.value?.propData||{}) : {},
    });
    setLoading(false);
  }, []);

  useEffect(() => { load(); const t = setInterval(load, 30000); return ()=>clearInterval(t); }, [load]);

  const openCalls = data.calls.filter(c=>c.status==='open');

  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:C.text, display:'flex', flexDirection:'column', maxWidth:480, margin:'0 auto' }}>

      {/* Header */}
      <div style={{ padding:'10px 16px 8px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid '+C.border }}>
        <div style={{ fontSize:17, fontWeight:700 }}>〰️ <span style={{ color:C.purple }}>Alfalfa</span></div>
        <span style={{
          fontSize:9, letterSpacing:'.15em', padding:'3px 10px', borderRadius:20,
          background:openCalls.length?C.green+'20':C.dim+'20',
          color:openCalls.length?C.green:C.dim,
          border:'1px solid '+(openCalls.length?C.green+'40':C.border),
        }}>
          {loading ? '●' : openCalls.length+' OPEN'}
        </span>
      </div>

      <PriceBar prices={data.prices} fg={data.fg} />
      <TabBar active={tab} set={setTab} />

      <div style={{ flex:1, padding:'0 14px 16px', overflowY:'auto' }}>
        {tab==='overview' && <OverviewTab calls={data.calls} prices={data.prices} fg={data.fg} paperData={data.paper} gmgnSignals={data.gmgnSignals} funding={data.funding} orderBook={data.orderBook} />}
        {tab==='prop'     && <PropTab propData={data.propData} calls={data.calls} smartPositions={data.smartMoney?.wallets} />}
        {tab==='pred'     && <PredictTab calls={data.calls} prices={data.prices} />}
        {false && tab==='smart' && <SmartMoneyTab calls={data.calls} smartMoney={data.smartMoney} />}
        {tab==='memecoin' && <LaneTab lane="memecoin" calls={data.calls} />}
        {tab==='wallets'  && <WalletsTab wallets={data.wallets} />}
        {tab==='hip3'     && <LaneTab lane="hip3" calls={data.calls} extra={
          <Card style={{ padding:'10px 14px', marginBottom:8 }}>
            <div style={{ fontSize:9, letterSpacing:'.2em', color:C.dim, marginBottom:6 }}>HIP-3 CONTEXT</div>
            <div style={{ fontSize:11, color:C.dim, lineHeight:1.8 }}>
              Historical WR: <b style={{ color:C.green }}>75%</b> (27W/9L)<br/>
              BTC funding: <b style={{ color: parseFloat(data.funding?.BTC?.fundingPct) < 0 ? C.green : C.red }}>{data.funding?.BTC?.fundingPct ?? '—'}%</b>{' '}
              ETH: <b style={{ color: parseFloat(data.funding?.ETH?.fundingPct) < 0 ? C.green : C.red }}>{data.funding?.ETH?.fundingPct ?? '—'}%</b>{' '}
              SOL: <b style={{ color: parseFloat(data.funding?.SOL?.fundingPct) < 0 ? C.green : C.red }}>{data.funding?.SOL?.fundingPct ?? '—'}%</b>
            </div>
          </Card>
        } />}
        {tab==='lp'       && <LaneTab lane="lp" calls={data.calls} extra={<LPPools pools={data.pools} calls={data.calls} />} />}
        {tab==='ton'      && <LaneTab lane="ton" calls={data.calls} />}
        {tab==='score'    && <ScoreTab calls={data.calls} />}
      </div>

      {/* Bridge */}
      <div style={{ padding:'10px 14px', borderTop:'1px solid '+C.border, background:C.bg, display:'flex', gap:8, alignItems:'center' }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, color:C.dim, letterSpacing:'.15em', marginBottom:1 }}>FUND</div>
          <div style={{ fontSize:11 }}>TON → SOL USDC via Mayan (~30s)</div>
        </div>
        <button onClick={()=>window.open('https://swap.mayan.finance/?sourceChain=ton&destinationChain=solana&targetToken=USDC','_blank')} style={{
          padding:'7px 14px', borderRadius:10, border:'1px solid '+C.cyan+'44',
          background:C.cyan+'22', color:C.cyan, fontSize:10, letterSpacing:'.1em',
          cursor:'pointer', fontFamily:'inherit', fontWeight:600,
        }}>💎 Bridge</button>
      </div>
    </div>
  );
}
