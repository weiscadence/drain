'use client';
import { useState, useEffect, useRef } from 'react';

// ── Token Detail Sheet — swipe up from card ───────────────
// Shows: DexScreener chart, BubbleMaps, full rugcheck, tweets

function openExternal(url) {
  const tg = window?.Telegram?.WebApp;
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, '_blank');
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

export default function TokenDetailSheet({ token, onClose }) {
  const [tab, setTab] = useState('chart'); // chart | bubble | info | tweets
  const [chartLoaded, setChartLoaded] = useState(false);
  const sheetRef = useRef(null);
  const dragStart = useRef(null);

  // Swipe down to close
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const onTouchStart = e => { dragStart.current = e.touches[0].clientY; };
    const onTouchEnd = e => {
      if (dragStart.current === null) return;
      const dy = e.changedTouches[0].clientY - dragStart.current;
      if (dy > 80) onClose();
      dragStart.current = null;
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => { el.removeEventListener('touchstart', onTouchStart); el.removeEventListener('touchend', onTouchEnd); };
  }, [onClose]);

  const fmtN = n => n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K` : `$${n}`;
  const fmtP = n => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

  // BubbleMaps embed URL
  const bubbleUrl = `https://app.bubblemaps.io/sol/token/${token.mint}`;
  // DexScreener embed URL
  const chartUrl = token.pairAddress
    ? `https://dexscreener.com/solana/${token.pairAddress}?embed=1&theme=dark&trades=0&info=0`
    : null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 800, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={sheetRef}
        style={{
          width: '100%', background: '#0c0c18',
          borderRadius: '22px 22px 0 0',
          border: `1px solid ${token.accent}40`,
          borderBottom: 'none',
          height: '82vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: `0 -4px 40px rgba(0,0,0,0.6), 0 0 0 1px ${token.accent}20`,
        }}
      >
        {/* Pull handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 6px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Token identity header */}
        <div style={{ padding: '0 16px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, borderBottom: `1px solid ${token.accent}20` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {token.image && (
              <img src={token.image} alt="" style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${token.accent}40`, objectFit: 'cover' }}
                onError={e => e.target.style.display = 'none'} />
            )}
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: 'JetBrains Mono, monospace', letterSpacing: -1 }}>{token.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>${token.symbol} · {token.age}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: token.change >= 0 ? '#00ff88' : '#ff4444', fontFamily: 'JetBrains Mono, monospace' }}>{fmtP(token.change)}</div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.5)', width: 28, height: 28, borderRadius: '50%', fontSize: 14, cursor: 'pointer' }}>✕</button>
          </div>
        </div>

        {/* Quick stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 1, background: `${token.accent}10`, flexShrink: 0 }}>
          {[
            ['MCap', fmtN(token.mcap)],
            ['Vol 24h', fmtN(token.vol)],
            ['Smart $', `${token.smartWallets}w`],
            ['Jito', `${token.jitoMentions}x`],
          ].map(([l, v]) => (
            <div key={l} style={{ padding: '8px 0', textAlign: 'center', background: '#0c0c18' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{l}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          {[
            { id: 'chart', label: '📈 Chart' },
            { id: 'bubble', label: '🫧 Holders' },
            { id: 'info', label: '🔍 Info' },
            { id: 'tweets', label: '🐦 Tweets' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex: 1, padding: '9px 0', background: 'none', border: 'none', borderBottom: tab === t.id ? `2px solid ${token.accent}` : '2px solid transparent', color: tab === t.id ? token.accent : 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', marginBottom: -1 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>

          {/* CHART */}
          {tab === 'chart' && (
            chartUrl ? (
              <iframe
                src={chartUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                onLoad={() => setChartLoaded(true)}
                allow="clipboard-write"
              />
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 }}>
                <div style={{ fontSize: 40 }}>📊</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', textAlign: 'center' }}>
                  Chart available once token has a DEX pair
                </div>
                <button onClick={() => openExternal(`https://dexscreener.com/solana/${token.mint}`)}
                  style={{ padding: '10px 20px', borderRadius: 12, background: `${token.accent}15`, border: `1px solid ${token.accent}40`, color: token.accent, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', fontSize: 12 }}>
                  View on DexScreener →
                </button>
              </div>
            )
          )}

          {/* BUBBLE MAP */}
          {tab === 'bubble' && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <iframe
                src={bubbleUrl}
                style={{ flex: 1, border: 'none', width: '100%' }}
                sandbox="allow-scripts allow-same-origin allow-popups"
                allow="clipboard-write"
              />
              <div style={{ padding: '8px 14px', display: 'flex', gap: 8, flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={() => openExternal(bubbleUrl)}
                  style={{ flex: 1, padding: '8px', borderRadius: 10, background: `${token.accent}12`, border: `1px solid ${token.accent}30`, color: token.accent, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', fontSize: 11 }}>
                  Open BubbleMaps →
                </button>
              </div>
            </div>
          )}

          {/* INFO */}
          {tab === 'info' && (
            <div style={{ overflowY: 'auto', height: '100%', padding: '14px 16px' }}>

              <Section title="RUGCHECK DETAILS">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Contract', value: token.rugcheck?.mutable ? '⚠ Mutable' : '✓ Immutable', good: !token.rugcheck?.mutable },
                    { label: 'LP Locked', value: (token.rugcheck?.lpLocked || 0) > 80 ? '✓ Locked' : '⚠ Unlocked', good: (token.rugcheck?.lpLocked || 0) > 80 },
                    { label: 'Top Holder', value: token.rugcheck?.topHolderPct ? `${token.rugcheck.topHolderPct.toFixed(1)}% of supply` : 'Unknown', good: (token.rugcheck?.topHolderPct || 0) < 10 },
                    { label: 'Risk Score', value: token.rugcheck?.score ? `${token.rugcheck.score}/100` : 'N/A', good: (token.rugcheck?.score || 0) >= 70 },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{r.label}</span>
                      <span style={{ fontSize: 12, color: r.good ? '#00ff88' : '#f59e0b', fontWeight: 700, fontFamily: 'monospace' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="ON-CHAIN SIGNALS">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ padding: '10px 12px', background: `${token.accent}0c`, borderRadius: 10, border: `1px solid ${token.accent}25` }}>
                    <div style={{ fontSize: 11, color: token.accent, fontWeight: 700, fontFamily: 'monospace', marginBottom: 4 }}>⚡ SMART WALLETS</div>
                    <div style={{ fontSize: 13, color: '#fff', fontWeight: 900, fontFamily: 'JetBrains Mono, monospace' }}>{token.smartWallets} wallets loading</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Top 1% wallets by PnL history</div>
                  </div>
                  {token.jitoMentions > 0 && (
                    <div style={{ padding: '10px 12px', background: 'rgba(168,85,247,0.08)', borderRadius: 10, border: '1px solid rgba(168,85,247,0.25)' }}>
                      <div style={{ fontSize: 11, color: '#a855f7', fontWeight: 700, fontFamily: 'monospace', marginBottom: 4 }}>⚡ JITO BUNDLES</div>
                      <div style={{ fontSize: 13, color: '#fff', fontWeight: 900, fontFamily: 'JetBrains Mono, monospace' }}>{token.jitoMentions} bundle clusters</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Coordinated buy activity detected</div>
                    </div>
                  )}
                </div>
              </Section>

              {token.feeShare > 0 && (
                <Section title="CREATOR">
                  <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: '#fff', fontFamily: 'monospace', fontWeight: 700 }}>{token.creator}</span>
                      <span style={{ fontSize: 11, color: token.creatorVerified ? '#00ff88' : 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{token.creatorVerified ? '✓ Verified' : 'Unverified'}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{token.feeShare}% fee share configured</div>
                  </div>
                </Section>
              )}

              <Section title="CONTRACT">
                <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginBottom: 4 }}>MINT ADDRESS</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all', lineHeight: 1.6 }}>{token.mint}</div>
                  <button
                    onClick={() => navigator.clipboard?.writeText(token.mint)}
                    style={{ marginTop: 8, background: `${token.accent}12`, border: `1px solid ${token.accent}30`, borderRadius: 8, padding: '5px 12px', color: token.accent, fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace' }}>
                    Copy address
                  </button>
                </div>
              </Section>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button onClick={() => openExternal(`https://rugcheck.xyz/tokens/${token.mint}`)}
                  style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace' }}>
                  Rugcheck →
                </button>
                <button onClick={() => openExternal(`https://solscan.io/token/${token.mint}`)}
                  style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace' }}>
                  Solscan →
                </button>
              </div>

              <div style={{ height: 20 }} />
            </div>
          )}

          {/* TWEETS */}
          {tab === 'tweets' && (
            <div style={{ overflowY: 'auto', height: '100%', padding: '14px 16px' }}>
              <Section title={`X MENTIONS · $${token.symbol}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(token.tweets || []).map((t, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 14px', border: `1px solid ${token.accent}18` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: token.accent, fontWeight: 700, fontFamily: 'monospace' }}>{t.a}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>{t.l?.toLocaleString()} ♥</span>
                      </div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{t.t}</div>
                    </div>
                  ))}

                  {/* Sentiment summary */}
                  {token.sentiment && (
                    <div style={{ background: `rgba(0,255,136,0.06)`, borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(0,255,136,0.2)', marginTop: 4 }}>
                      <div style={{ fontSize: 11, color: 'rgba(0,255,136,0.8)', fontWeight: 700, fontFamily: 'monospace', marginBottom: 4 }}>AI SENTIMENT ANALYSIS</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 13, color: '#fff' }}>
                          {token.sentiment.label === 'bullish' ? '🟢 Bullish' : token.sentiment.label === 'bearish' ? '🔴 Bearish' : '🟡 Neutral'}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: '#00ff88', fontFamily: 'JetBrains Mono, monospace' }}>
                          {Math.round(token.sentiment.score * 100)}%
                        </div>
                      </div>
                      <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 99, background: '#00ff88', width: `${token.sentiment.score * 100}%`, boxShadow: '0 0 8px #00ff8880' }} />
                      </div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginTop: 6 }}>
                        Sorsa API · min 500 likes filter · real-time
                      </div>
                    </div>
                  )}

                  {token.alerts?.length > 0 && (
                    <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: 12, padding: '12px 14px', border: '1px solid rgba(239,68,68,0.25)' }}>
                      <div style={{ fontSize: 11, color: '#ef4444', fontWeight: 700, fontFamily: 'monospace', marginBottom: 4 }}>🚨 RISK SIGNAL</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{token.alerts[0].msg}</div>
                    </div>
                  )}
                </div>
              </Section>
              <div style={{ height: 20 }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
