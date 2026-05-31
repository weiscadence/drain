'use client';
import { useState, useEffect, useRef } from 'react';

function openExternal(url) {
  const tg = window?.Telegram?.WebApp;
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, '_blank');
}

// Native bubble map — renders holder distribution without iframes
function HolderBubbles({ bubbles, top10Pct }) {
  if (!bubbles?.length) {
    return (
      <div style={{ textAlign:'center', padding:'30px 0' }}>
        <div style={{ fontSize:32, marginBottom:8 }}>🫧</div>
        <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>loading holder data...</div>
      </div>
    );
  }

  const max = Math.max(...bubbles.map(b => b.pct));

  return (
    <div>
      {/* Concentration bar */}
      <div style={{ marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
          <span style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>TOP 10 HOLDERS</span>
          <span style={{ fontSize:12, fontWeight:800, color: parseFloat(top10Pct) > 50 ? '#ef4444':'#00ff88', fontFamily:'JetBrains Mono, monospace' }}>{top10Pct}%</span>
        </div>
        <div style={{ height:6, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', borderRadius:99, width:`${Math.min(parseFloat(top10Pct),100)}%`, background: parseFloat(top10Pct) > 60 ? 'linear-gradient(90deg,#ef4444,#f97316)' : parseFloat(top10Pct) > 35 ? 'linear-gradient(90deg,#f59e0b,#eab308)' : 'linear-gradient(90deg,#00ff88,#22c55e)', boxShadow:'0 0 8px rgba(0,255,136,0.4)' }}/>
        </div>
        <div style={{ fontSize:9, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', marginTop:4 }}>
          {parseFloat(top10Pct) > 60 ? '⚠ High concentration — rug risk' : parseFloat(top10Pct) > 35 ? '⚡ Medium concentration' : '✓ Healthy distribution'}
        </div>
      </div>

      {/* Bubble grid */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', padding:'8px 0' }}>
        {bubbles.slice(0, 12).map((b, i) => {
          const size = Math.max(36, Math.min(80, 36 + (b.pct / max) * 44));
          const color = b.isSmart ? '#a855f7' : b.isTeam ? '#f97316' : i < 3 ? '#ef4444' : '#3b82f6';
          return (
            <div key={i} style={{
              width: size, height: size, borderRadius:'50%',
              background: `${color}22`,
              border: `1.5px solid ${color}55`,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              cursor:'default', position:'relative',
              boxShadow: b.isSmart ? `0 0 12px ${color}40` : 'none',
            }}>
              <div style={{ fontSize: size > 55 ? 11 : 9, fontWeight:700, color, fontFamily:'monospace', textAlign:'center', lineHeight:1.1 }}>
                {b.pct.toFixed(1)}%
              </div>
              <div style={{ fontSize:8, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>
                {b.address}
              </div>
              {b.isSmart && <div style={{ position:'absolute', top:-4, right:-4, fontSize:10 }}>⚡</div>}
              {b.isTeam && <div style={{ position:'absolute', top:-4, right:-4, fontSize:10 }}>👑</div>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:12, justifyContent:'center', marginTop:10, flexWrap:'wrap' }}>
        {[
          { color:'#a855f7', label:'Smart wallet ⚡' },
          { color:'#f97316', label:'Team/Creator 👑' },
          { color:'#ef4444', label:'Top holder' },
          { color:'#3b82f6', label:'Regular' },
        ].map(l => (
          <div key={l.label} style={{ display:'flex', alignItems:'center', gap:4 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:l.color }}/>
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontFamily:'monospace' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Native price chart using Spark
function PriceChart({ pairs, accent }) {
  if (!pairs?.length) {
    return (
      <div style={{ height:160, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, background:`${accent}08`, borderRadius:12, border:`1px solid ${accent}20` }}>
        <div style={{ fontSize:28 }}>📊</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>chart data loading...</div>
        <button onClick={() => {}} style={{ fontSize:10, color:accent, fontFamily:'monospace', background:'none', border:'none', cursor:'pointer', textDecoration:'underline' }}>
          open on dexscreener →
        </button>
      </div>
    );
  }
  return null; // filled by data
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.25)', fontFamily:'monospace', marginBottom:8 }}>{title}</div>
      {children}
    </div>
  );
}

export default function TokenDetailSheet({ token, onClose }) {
  const [tab, setTab] = useState('holders');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const sheetRef = useRef(null);
  const dragStart = useRef(null);

  useEffect(() => {
    if (!token?.mint) return;
    setLoading(true);
    fetch(`/api/token-detail?mint=${token.mint}`)
      .then(r => r.json())
      .then(d => { setDetail(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token?.mint]);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const onTouchStart = e => { dragStart.current = e.touches[0].clientY; };
    const onTouchEnd = e => {
      if (!dragStart.current) return;
      if (e.changedTouches[0].clientY - dragStart.current > 80) onClose();
      dragStart.current = null;
    };
    el.addEventListener('touchstart', onTouchStart, { passive:true });
    el.addEventListener('touchend', onTouchEnd, { passive:true });
    return () => { el.removeEventListener('touchstart', onTouchStart); el.removeEventListener('touchend', onTouchEnd); };
  }, [onClose]);

  const fmtN = n => !n ? '$0' : n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K` : `$${n.toFixed(2)}`;
  const fmtP = n => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:800, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)', display:'flex', alignItems:'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div ref={sheetRef} style={{ width:'100%', background:'#0c0c18', borderRadius:'22px 22px 0 0', border:`1px solid ${token.accent}40`, borderBottom:'none', height:'85vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:`0 -4px 40px rgba(0,0,0,0.6)` }}>

        {/* Pull handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'10px 0 6px', flexShrink:0 }}>
          <div style={{ width:36, height:4, borderRadius:99, background:'rgba(255,255,255,0.15)' }}/>
        </div>

        {/* Header */}
        <div style={{ padding:'0 16px 10px', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0, borderBottom:`1px solid ${token.accent}20` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {token.image && <img src={token.image} alt="" style={{ width:32, height:32, borderRadius:8, objectFit:'contain' }} onError={e=>e.target.style.display='none'}/>}
            <div>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>{token.name}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>${token.symbol}</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            {detail && <div style={{ fontSize:14, fontWeight:800, color: detail.priceChange24h>=0?'#00ff88':'#ff4444', fontFamily:'JetBrains Mono, monospace' }}>{fmtP(detail.priceChange24h||0)}</div>}
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'none', color:'rgba(255,255,255,0.5)', width:28, height:28, borderRadius:'50%', fontSize:14, cursor:'pointer' }}>✕</button>
          </div>
        </div>

        {/* Quick stats */}
        {detail && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:1, background:`${token.accent}10`, flexShrink:0 }}>
            {[
              ['MCap', fmtN(detail.mcap)],
              ['Volume', fmtN(detail.volume24h)],
              ['Liquidity', fmtN(detail.liquidity)],
              ['Smart $', `${detail.smartWallets || 0}w`],
            ].map(([l,v]) => (
              <div key={l} style={{ padding:'8px 0', textAlign:'center', background:'#0c0c18' }}>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:800, color: l==='Smart $' && detail.smartWallets > 0 ? '#a855f7':'#fff', fontFamily:'JetBrains Mono, monospace' }}>{v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
          {[
            { id:'holders', icon:'🫧', label:'Holders' },
            { id:'info',    icon:'🔍', label:'Info' },
            { id:'tweets',  icon:'🐦', label:'Tweets' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex:1, padding:'9px 0', background:'none', border:'none', borderBottom: tab===t.id ? `2px solid ${token.accent}`:'2px solid transparent', color: tab===t.id ? token.accent:'rgba(255,255,255,0.35)', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'monospace', marginBottom:-1 }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:'14px 16px', minHeight:0 }}>

          {loading && (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', border:`3px solid ${token.accent}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }}/>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>loading on-chain data...</div>
            </div>
          )}

          {/* CHART */}
          {!loading && tab === 'chart' && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {token.pairAddress ? (
                <>
                  <div style={{ background:`${token.accent}08`, borderRadius:14, padding:'16px', border:`1px solid ${token.accent}20`, textAlign:'center' }}>
                    <div style={{ fontSize:28, marginBottom:8 }}>📈</div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#fff', fontFamily:'JetBrains Mono, monospace', marginBottom:6 }}>Live DexScreener Chart</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:'monospace', marginBottom:14, lineHeight:1.6 }}>
                      Telegram webview blocks embedded charts.<br/>Opens full chart in your browser.
                    </div>
                    <button
                      onClick={() => openExternal(`https://dexscreener.com/solana/${token.pairAddress}`)}
                      style={{ width:'100%', height:48, borderRadius:14, background:`linear-gradient(135deg, ${token.accent}, ${token.accent}99)`, color:'#000', fontSize:15, fontWeight:900, cursor:'pointer', border:'none', fontFamily:'JetBrains Mono, monospace', boxShadow:`0 4px 20px ${token.accent}40` }}
                    >
                      📈 Open Chart →
                    </button>
                  </div>

                  {/* Price snapshot from our data */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                    {[
                      ['Price', token.price > 0 ? `$${token.price.toFixed(8)}` : '—'],
                      ['24h Change', token.change !== undefined ? `${token.change >= 0 ? '+':''}${token.change.toFixed(1)}%` : '—'],
                      ['MCap', token.mcap > 0 ? (token.mcap >= 1e6 ? `$${(token.mcap/1e6).toFixed(1)}M` : `$${(token.mcap/1e3).toFixed(0)}K`) : '—'],
                      ['Vol 24h', token.vol > 0 ? (token.vol >= 1e6 ? `$${(token.vol/1e6).toFixed(1)}M` : `$${(token.vol/1e3).toFixed(0)}K`) : '—'],
                    ].map(([l,v]) => (
                      <div key={l} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px', border:'1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', marginBottom:3 }}>{l}</div>
                        <div style={{ fontSize:14, fontWeight:800, color: l==='24h Change' ? (token.change>=0?'#00ff88':'#ff4444') : '#fff', fontFamily:'JetBrains Mono, monospace' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign:'center', padding:'30px 0' }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>📊</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontFamily:'monospace', marginBottom:14 }}>No DEX pair found yet</div>
                  <button onClick={() => openExternal(`https://dexscreener.com/search?q=${token.symbol}`)}
                    style={{ padding:'10px 24px', borderRadius:12, background:`${token.accent}15`, border:`1px solid ${token.accent}30`, color:token.accent, fontWeight:700, cursor:'pointer', fontFamily:'monospace', fontSize:12 }}>
                    Search on DexScreener →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* HOLDERS — native bubble map */}
          {!loading && tab === 'holders' && (
            <>
              <HolderBubbles
                bubbles={detail?.holderBubbles || []}
                top10Pct={detail?.top10Pct || '0'}
              />
              {detail?.totalHolders > 0 && (
                <div style={{ textAlign:'center', marginTop:10, fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>
                  {detail.totalHolders.toLocaleString()} total holders
                </div>
              )}
              <div style={{ display:'flex', gap:8, marginTop:14 }}>
                <button onClick={() => openExternal(`https://app.bubblemaps.io/sol/token/${token.mint}`)}
                  style={{ flex:1, padding:'9px', borderRadius:10, background:`${token.accent}10`, border:`1px solid ${token.accent}30`, color:token.accent, fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                  Full BubbleMaps →
                </button>
                <button onClick={() => openExternal(`https://gmgn.ai/sol/token/${token.mint}`)}
                  style={{ flex:1, padding:'9px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                  GMGN →
                </button>
              </div>
            </>
          )}

          {/* INFO */}
          {!loading && tab === 'info' && (
            <>
              {/* Smart wallets */}
              <Section title="SMART WALLET ACTIVITY">
                <div style={{ background: detail?.smartWallets > 0 ? 'rgba(168,85,247,0.08)':'rgba(255,255,255,0.03)', borderRadius:12, padding:'12px 14px', border:`1px solid ${detail?.smartWallets > 0 ? 'rgba(168,85,247,0.3)':'rgba(255,255,255,0.07)'}` }}>
                  <div style={{ fontSize:24, fontWeight:900, color: detail?.smartWallets > 0 ? '#a855f7':'rgba(255,255,255,0.3)', fontFamily:'JetBrains Mono, monospace' }}>
                    {detail?.smartWallets || 0} <span style={{ fontSize:14 }}>smart wallets</span>
                  </div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:4, fontFamily:'monospace' }}>
                    {detail?.smartWallets > 10 ? '🔥 Strong insider interest' :
                     detail?.smartWallets > 3 ? '👀 Some smart money loading' :
                     '— No notable smart wallet activity detected'}
                  </div>
                  {token.jitoMentions > 0 && (
                    <div style={{ fontSize:11, color:'#a855f7', marginTop:6, fontFamily:'monospace' }}>⚡ Jito bundle activity detected</div>
                  )}
                </div>
              </Section>

              {/* Rugcheck */}
              {detail?.rugcheck && (
                <Section title="RUGCHECK ANALYSIS">
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {[
                      { label:'Risk Score', val:`${detail.rugcheck.score}/100`, good: detail.rugcheck.score >= 70 },
                      { label:'Contract', val: detail.rugcheck.mutable ? '⚠ Mutable' : '✓ Immutable', good: !detail.rugcheck.mutable },
                      { label:'Mint Auth', val: detail.rugcheck.mintAuthority ? '⚠ Active' : '✓ Revoked', good: !detail.rugcheck.mintAuthority },
                      { label:'LP Locked', val: detail.rugcheck.lpLocked > 80 ? `✓ ${detail.rugcheck.lpLocked.toFixed(0)}%` : `⚠ ${detail.rugcheck.lpLocked.toFixed(0)}%`, good: detail.rugcheck.lpLocked > 80 },
                    ].map(r => (
                      <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 12px', background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'monospace' }}>{r.label}</span>
                        <span style={{ fontSize:12, color: r.good ? '#00ff88':'#f59e0b', fontWeight:700, fontFamily:'monospace' }}>{r.val}</span>
                      </div>
                    ))}
                    {detail.rugcheck.risks?.length > 0 && (
                      <div style={{ background:'rgba(239,68,68,0.06)', borderRadius:10, padding:'10px 12px', border:'1px solid rgba(239,68,68,0.2)' }}>
                        <div style={{ fontSize:10, color:'#ef4444', fontFamily:'monospace', fontWeight:700, marginBottom:6 }}>RISKS FOUND</div>
                        {detail.rugcheck.risks.map((r,i) => (
                          <div key={i} style={{ fontSize:11, color:'rgba(255,255,255,0.6)', fontFamily:'monospace', marginBottom:3 }}>• {r.description || r.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </Section>
              )}

              {/* Contract info */}
              <Section title="CONTRACT">
                <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', marginBottom:4 }}>MINT ADDRESS</div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)', fontFamily:'JetBrains Mono, monospace', wordBreak:'break-all', lineHeight:1.7, marginBottom:8 }}>{token.mint}</div>
                  <button onClick={() => navigator.clipboard?.writeText(token.mint)}
                    style={{ background:`${token.accent}12`, border:`1px solid ${token.accent}30`, borderRadius:8, padding:'5px 12px', color:token.accent, fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                    Copy CA
                  </button>
                </div>
              </Section>

              {/* Creator */}
              {token.creatorVerified && token.creator && (
                <Section title="CREATOR">
                  <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'10px 12px', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:10 }}>
                    {token.creatorPfp && <img src={token.creatorPfp} alt="" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover' }} onError={e=>e.target.style.display='none'}/>}
                    <div>
                      <div style={{ fontSize:13, color:'#00ff88', fontWeight:700, fontFamily:'monospace' }}>{token.creator} ✓</div>
                      {token.feeShare > 0 && <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontFamily:'monospace' }}>{token.feeShare}% fee share</div>}
                      {token.lifetimeFeesSol > 0 && <div style={{ fontSize:11, color:'rgba(255,200,0,0.8)', fontFamily:'monospace' }}>{token.lifetimeFeesSol.toLocaleString()} SOL lifetime fees</div>}
                    </div>
                  </div>
                </Section>
              )}

              <div style={{ display:'flex', gap:8 }}>
                <button onClick={() => openExternal(`https://rugcheck.xyz/tokens/${token.mint}`)}
                  style={{ flex:1, padding:'9px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                  Rugcheck →
                </button>
                <button onClick={() => openExternal(`https://solscan.io/token/${token.mint}`)}
                  style={{ flex:1, padding:'9px', borderRadius:10, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                  Solscan →
                </button>
              </div>
            </>
          )}

          {/* TWEETS */}
          {!loading && tab === 'tweets' && (
            <>
              {token.sentiment && (
                <Section title="X SENTIMENT">
                  <div style={{ background:`rgba(0,255,136,0.06)`, borderRadius:12, padding:'12px 14px', border:'1px solid rgba(0,255,136,0.2)', marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                      <div style={{ fontSize:13, color:'#fff' }}>
                        {token.sentiment.label === 'bullish' ? '🟢 Bullish' : token.sentiment.label === 'bearish' ? '🔴 Bearish' : '🟡 Neutral'}
                      </div>
                      <div style={{ fontSize:18, fontWeight:900, color:'#00ff88', fontFamily:'JetBrains Mono, monospace' }}>
                        {Math.round(token.sentiment.score * 100)}%
                      </div>
                    </div>
                    <div style={{ height:4, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:99, background:'#00ff88', width:`${token.sentiment.score * 100}%`, boxShadow:'0 0 8px #00ff8880' }}/>
                    </div>
                  </div>
                </Section>
              )}

              {token.alerts?.length > 0 && (
                <Section title="RISK SIGNALS">
                  {token.alerts.map((a,i) => (
                    <div key={i} style={{ background:'rgba(239,68,68,0.08)', borderRadius:12, padding:'10px 12px', border:'1px solid rgba(239,68,68,0.25)', marginBottom:8 }}>
                      <div style={{ fontSize:11, color:'#ef4444', fontWeight:700, fontFamily:'monospace', marginBottom:3 }}>🚨 {a.type?.toUpperCase()}</div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>{a.msg}</div>
                    </div>
                  ))}
                </Section>
              )}

              {/* Attention tag */}
              <div style={{ background:`${token.accent}0c`, borderRadius:12, padding:'12px 14px', border:`1px solid ${token.accent}25` }}>
                <div style={{ fontSize:11, color:token.accent, fontWeight:700, fontFamily:'monospace', marginBottom:6 }}>WHY THIS TOKEN</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.5 }}>{token.attentionTag}</div>
                {token.signalEdge && <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:6, fontFamily:'monospace' }}>{token.signalEdge}</div>}
              </div>

              <button onClick={() => openExternal(`https://twitter.com/search?q=%24${token.symbol}&f=live`)}
                style={{ width:'100%', marginTop:12, padding:'10px', borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.6)', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                View live tweets on X →
              </button>
            </>
          )}

          <div style={{ height:20 }}/>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
