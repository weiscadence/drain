'use client';
import { useState, useEffect } from 'react';

const S = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#e8e0d0', fontFamily: 'monospace', padding: '24px' },
  header: { fontSize: 11, letterSpacing: '.35em', color: 'rgba(232,224,208,.4)', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 24 },
  card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20 },
  label: { fontSize: 10, letterSpacing: '.2em', color: 'rgba(232,224,208,.4)', marginBottom: 6 },
  value: { fontSize: 24, fontWeight: 700, marginBottom: 2 },
  sub: { fontSize: 11, color: 'rgba(232,224,208,.4)' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1a1a1a' },
  green: { color: '#00ff88' },
  red: { color: '#ff4444' },
  yellow: { color: '#f59e0b' },
};

function MetricCard({ label, value, sub, color }) {
  return (
    <div style={S.card}>
      <div style={S.label}>{label}</div>
      <div style={{ ...S.value, color: color || '#e8e0d0' }}>{value}</div>
      {sub && <div style={S.sub}>{sub}</div>}
    </div>
  );
}

export default function MarketIntelPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/alpha?action=market-intel')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));

    const t = setInterval(() => {
      fetch('/api/alpha?action=market-intel').then(r => r.json()).then(setData).catch(() => {});
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const prices = data?.prices || {};
  const fg = data?.fear_greed || {};
  const funding = data?.funding || {};
  const liq = data?.liquidations || {};

  const fgColor = (fg.value || 50) < 30 ? '#ff4444' : (fg.value || 50) > 70 ? '#00ff88' : '#f59e0b';

  return (
    <div style={S.page}>
      <div style={S.header}>← <a href="/ops-hub" style={{ color: 'inherit', textDecoration: 'none' }}>OPS HUB</a> / MARKET INTEL</div>
      <div style={S.title}>Market Intel</div>
      <div style={{ ...S.sub, marginBottom: 24 }}>Live derivatives · funding rates · order flow · sentiment</div>

      {loading && <div style={{ color: 'rgba(232,224,208,.4)' }}>Loading...</div>}

      {!loading && (
        <>
          <div style={S.grid}>
            <MetricCard label="BTC" value={`$${(prices.bitcoin?.price || 0).toLocaleString()}`} sub={`${prices.bitcoin?.change24h?.toFixed(1) || 0}% 24h`} color={prices.bitcoin?.change24h > 0 ? '#00ff88' : '#ff4444'} />
            <MetricCard label="ETH" value={`$${(prices.ethereum?.price || 0).toLocaleString()}`} sub={`${prices.ethereum?.change24h?.toFixed(1) || 0}% 24h`} color={prices.ethereum?.change24h > 0 ? '#00ff88' : '#ff4444'} />
            <MetricCard label="SOL" value={`$${(prices.solana?.price || 0).toLocaleString()}`} sub={`${prices.solana?.change24h?.toFixed(1) || 0}% 24h`} color={prices.solana?.change24h > 0 ? '#00ff88' : '#ff4444'} />
            <MetricCard label="FEAR & GREED" value={fg.value || '–'} sub={fg.label || ''} color={fgColor} />
          </div>

          {Object.keys(funding).length > 0 && (
            <>
              <div style={{ ...S.label, marginBottom: 12 }}>HYPERLIQUID FUNDING RATES (annualized)</div>
              <div style={S.card}>
                {Object.entries(funding).map(([asset, f]) => (
                  <div key={asset} style={S.row}>
                    <span style={{ fontWeight: 600 }}>{asset}</span>
                    <span style={{ fontFamily: 'monospace' }}>${(f.markPx || 0).toLocaleString()}</span>
                    <span style={{ color: (f.funding || 0) > 0.001 ? '#ff4444' : (f.funding || 0) < -0.001 ? '#00ff88' : '#888' }}>
                      {((f.funding || 0) * 24 * 365 * 100).toFixed(0)}% APR
                    </span>
                    <span style={{ color: '#888', fontSize: 11 }}>OI ${((f.openInterest || 0) * (f.markPx || 0) / 1e6).toFixed(0)}M</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ ...S.label, marginTop: 24, marginBottom: 12 }}>RECENT LIQUIDATIONS</div>
          <div style={S.card}>
            {(liq.recent || []).slice(0, 8).map((l, i) => (
              <div key={i} style={S.row}>
                <span style={{ color: l.side === 'LONG' ? '#ff4444' : '#00ff88' }}>{l.side === 'LONG' ? '🔴' : '🟢'} {l.coin}</span>
                <span>${(l.size || 0).toLocaleString()}</span>
                <span style={{ color: '#888', fontSize: 11 }}>{l.time || ''}</span>
              </div>
            ))}
            {!(liq.recent || []).length && <div style={{ color: 'rgba(232,224,208,.3)', padding: '12px 0' }}>No large liquidations recently</div>}
          </div>
        </>
      )}
    </div>
  );
}
