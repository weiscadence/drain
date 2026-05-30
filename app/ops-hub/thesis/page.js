'use client';
import { useState, useEffect } from 'react';
const S = { page: { minHeight: '100vh', background: '#0a0a0a', color: '#e8e0d0', fontFamily: 'monospace', padding: '24px' }, header: { fontSize: 11, letterSpacing: '.35em', color: 'rgba(232,224,208,.4)', marginBottom: 24 }, title: { fontSize: 28, fontWeight: 700, marginBottom: 4 }, sub: { fontSize: 12, color: 'rgba(232,224,208,.4)', marginBottom: 24 }, card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20, marginBottom: 12 }, row: { padding: '10px 0', borderBottom: '1px solid #111' } };
const PAGE_META = {
  scanner: { title: 'Token Scanner', desc: 'New Solana launches · momentum tokens · pump.fun firehose', logFile: 'token-scanner' },
  thesis: { title: 'Thesis Tracker', desc: 'Which setups actually work · win rate by signal type · backtest results', logFile: 'signal-darwin' },
  moltbook: { title: 'Moltbook', desc: 'Cadence_II on agent social · recent posts · engagement', logFile: 'auto-poster' },
  improve: { title: 'Self Improver', desc: 'Nightly GPU optimization loop · what changed · suggestions applied', logFile: 'self-improver' },
  meta: { title: 'Meta Improver', desc: 'Intent model · communication patterns · how Jiggy and Cadence work together', logFile: 'meta-improver' },
  higgsfield: { title: 'Higgsfield', desc: 'AI video generation · credit balance · recent generations', logFile: 'higgsfield-agent' },
  jobs: { title: 'Moltverr Jobs', desc: 'Open bounties on agent marketplace · claimed work · earnings', logFile: 'agent-economy' },
};
const slug = 'thesis';
const meta = PAGE_META[slug] || { title: slug, desc: 'Coming soon', logFile: null };

export default function Page() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    fetch('/api/alpha?action=logs&file=' + meta.logFile)
      .then(r => r.json()).then(d => setLogs(d.lines || [])).catch(() => {});
  }, []);
  return (
    <div style={S.page}>
      <div style={S.header}>← <a href="/ops-hub" style={{ color: 'inherit', textDecoration: 'none' }}>OPS HUB</a> / {meta.title.toUpperCase()}</div>
      <div style={S.title}>{meta.title}</div>
      <div style={S.sub}>{meta.desc}</div>
      <div style={S.card}>
        <div style={{ fontSize: 10, letterSpacing: '.2em', color: 'rgba(232,224,208,.4)', marginBottom: 12 }}>RECENT LOG</div>
        {logs.slice(-20).reverse().map((l, i) => (
          <div key={i} style={{ ...S.row, fontSize: 11, color: 'rgba(232,224,208,.6)', fontFamily: 'monospace' }}>{l}</div>
        ))}
        {logs.length === 0 && <div style={{ color: 'rgba(232,224,208,.3)' }}>No recent log entries.</div>}
      </div>
    </div>
  );
}
