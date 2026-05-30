'use client';
import { useState, useEffect } from 'react';

const S = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#e8e0d0', fontFamily: 'monospace', padding: '24px' },
  header: { fontSize: 11, letterSpacing: '.35em', color: 'rgba(232,224,208,.4)', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 24 },
  card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 16 },
  label: { fontSize: 10, letterSpacing: '.2em', color: 'rgba(232,224,208,.4)', marginBottom: 6 },
  value: { fontSize: 22, fontWeight: 700 },
  sub: { fontSize: 11, color: 'rgba(232,224,208,.4)', marginTop: 2 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #111' },
  tag: { fontSize: 9, letterSpacing: '.15em', padding: '2px 8px', borderRadius: 4, fontWeight: 600 },
  green: { color: '#00ff88' },
  red: { color: '#ff4444' },
};

function fmtPrice(p) {
  if (!p) return '?';
  if (p >= 1000) return '$' + p.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (p >= 1) return '$' + p.toFixed(2);
  if (p >= 0.01) return '$' + p.toFixed(4);
  return '$' + p.toPrecision(4);
}

export default function PaperTradingPage() {
  const [calls, setCalls] = useState([]);
  const [tab, setTab] = useState('open');

  useEffect(() => {
    fetch('/api/alpha?action=calls')
      .then(r => r.json())
      .then(d => setCalls(d.calls || []))
      .catch(() => {});
    const t = setInterval(() => {
      fetch('/api/alpha?action=calls').then(r => r.json()).then(d => setCalls(d.calls || [])).catch(() => {});
    }, 30000);
    return () => clearInterval(t);
  }, []);

  const open   = calls.filter(c => c.status === 'open');
  const closed = calls.filter(c => c.status === 'closed' && c.outcome);
  const wins   = closed.filter(c => c.outcome === 'win');
  const wr     = closed.length ? Math.round(wins.length / closed.length * 100) : 0;
  const avgPnl = closed.length ? (closed.reduce((s, c) => s + (c.pnlPct || 0), 0) / closed.length).toFixed(1) : '—';

  const bySource = {};
  // Include open calls in source breakdown (show as open, not counted in WR)
  for (const c of calls) {
    const src = c.source || 'unknown';
    if (!bySource[src]) bySource[src] = { wins: 0, total: 0, open: 0, pnl: 0 };
    if (c.status === 'open') {
      bySource[src].open++;
    } else {
      bySource[src].total++;
      bySource[src].pnl += c.pnlPct || 0;
      if (c.outcome === 'win') bySource[src].wins++;
    }
  }

  const display = tab === 'open' ? open : closed.slice().reverse();

  return (
    <div style={S.page}>
      <div style={S.header}>← <a href="/ops-hub" style={{ color: 'inherit', textDecoration: 'none' }}>OPS HUB</a> / PAPER TRADING</div>
      <div style={S.title}>Call Tracker</div>
      <div style={{ ...S.sub, marginBottom: 24 }}>Every signal tracked. Win rate compounding over time.</div>

      <div style={S.grid}>
        <div style={S.card}><div style={S.label}>WIN RATE</div><div style={{ ...S.value, color: wr >= 60 ? '#00ff88' : wr >= 40 ? '#f59e0b' : '#ff4444' }}>{wr}%</div><div style={S.sub}>{wins.length}/{closed.length} resolved</div></div>
        <div style={S.card}><div style={S.label}>AVG P&L / CALL</div><div style={{ ...S.value, color: parseFloat(avgPnl) >= 0 ? '#00ff88' : '#ff4444' }}>{avgPnl}%</div></div>
        <div style={S.card}><div style={S.label}>OPEN CALLS</div><div style={S.value}>{open.length}</div></div>
        <div style={S.card}><div style={S.label}>TOTAL CALLS</div><div style={S.value}>{calls.length}</div></div>
      </div>

      {Object.keys(bySource).length > 0 && (
        <div style={{ ...S.card, marginBottom: 24 }}>
          <div style={{ ...S.label, marginBottom: 12 }}>BY SIGNAL TYPE</div>
          {Object.entries(bySource).sort((a, b) => (b[1].wins + b[1].open) - (a[1].wins + a[1].open)).map(([src, s]) => (
            <div key={src} style={S.row}>
              <span style={{ fontSize: 12 }}>{src}</span>
              <span style={{ color: '#888', fontSize: 11 }}>{s.total} closed{s.open > 0 ? ` / ${s.open} open` : ''}</span>
              {s.total > 0 ? (
                <>
                  <span style={{ color: Math.round(s.wins / s.total * 100) >= 50 ? '#00ff88' : '#ff4444' }}>{Math.round(s.wins / s.total * 100)}% WR</span>
                  <span style={{ color: s.pnl / s.total >= 0 ? '#00ff88' : '#ff4444', fontSize: 11 }}>{(s.pnl / s.total).toFixed(1)}% avg</span>
                </>
              ) : (
                <span style={{ color: '#555', fontSize: 11 }}>pending resolution</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['open', 'closed'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? '#1e1e1e' : 'transparent', border: '1px solid #222', borderRadius: 6, padding: '6px 16px', color: tab === t ? '#e8e0d0' : '#666', cursor: 'pointer', fontSize: 11, letterSpacing: '.1em' }}>
            {t.toUpperCase()} ({t === 'open' ? open.length : closed.length})
          </button>
        ))}
      </div>

      <div style={S.card}>
        {display.slice(0, 20).map((c, i) => {
          const dir = c.direction === 'LONG' ? '🟢' : '🔴';
          const conf = c.confidence === 'HIGH' ? '#00ff88' : c.confidence === 'MEDIUM' ? '#f59e0b' : '#888';
          const outcomeColor = c.outcome === 'win' ? '#00ff88' : c.outcome === 'loss' ? '#ff4444' : '#888';
          return (
            <div key={i} style={{ ...S.row, flexWrap: 'wrap', gap: 4 }}>
              <span>{dir} <strong>{c.asset}</strong></span>
              <span style={{ fontSize: 11, color: '#888' }}>entry {fmtPrice(c.entry)}</span>
              <span style={{ fontSize: 11 }}>→ {fmtPrice(c.target)}</span>
              <span style={{ ...S.tag, background: conf + '22', color: conf }}>{c.confidence}</span>
              {c.outcome && <span style={{ ...S.tag, background: outcomeColor + '22', color: outcomeColor }}>{c.outcome === 'win' ? `+${c.pnlPct?.toFixed(1)}%` : c.outcome === 'loss' ? `${c.pnlPct?.toFixed(1)}%` : 'pending'}</span>}
              <span style={{ fontSize: 10, color: '#555', width: '100%' }}>{c.source} · {(c.openedAt || '').slice(0, 16).replace('T', ' ')}</span>
            </div>
          );
        })}
        {display.length === 0 && <div style={{ color: 'rgba(232,224,208,.3)', padding: 16 }}>No {tab} calls yet</div>}
      </div>
    </div>
  );
}
