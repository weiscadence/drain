'use client';
import { useState, useEffect } from 'react';

const S = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#e8e0d0', fontFamily: 'monospace', padding: '24px' },
  header: { fontSize: 11, letterSpacing: '.35em', color: 'rgba(232,224,208,.4)', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  sub: { fontSize: 12, color: 'rgba(232,224,208,.4)', marginBottom: 24 },
  card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20, marginBottom: 12 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid #111', gap: 8 },
  tag: (c) => ({ fontSize: 9, letterSpacing: '.15em', padding: '2px 8px', borderRadius: 4, background: c + '22', color: c, whiteSpace: 'nowrap' }),
};

export default function APIsPage() {
  const [findings, setFindings] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/alpha?action=api-findings')
      .then(r => r.json())
      .then(d => setFindings(d.findings || []))
      .catch(() => {});
  }, []);

  const categories = ['all', ...new Set(findings.map(f => f.source || 'other'))];
  const display = filter === 'all' ? findings : findings.filter(f => f.source === filter);

  return (
    <div style={S.page}>
      <div style={S.header}>← <a href="/ops-hub" style={{ color: 'inherit', textDecoration: 'none' }}>OPS HUB</a> / API SCOUT</div>
      <div style={S.title}>API Scout</div>
      <div style={S.sub}>Auto-discovers free APIs, MCPs, tools every 6h · {findings.length} found so far</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? '#1e1e1e' : 'transparent', border: '1px solid #222', borderRadius: 6, padding: '5px 12px', color: filter === c ? '#e8e0d0' : '#666', cursor: 'pointer', fontSize: 10, letterSpacing: '.1em' }}>
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={S.card}>
        {display.slice(0, 50).map((f, i) => (
          <div key={i} style={S.row}>
            <div style={{ flex: 1 }}>
              <a href={f.url} target="_blank" rel="noreferrer" style={{ color: '#e8e0d0', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>
                {f.title || f.name}
              </a>
              {f.description && <div style={{ fontSize: 11, color: '#888', marginTop: 4, lineHeight: 1.4 }}>{f.description.slice(0, 120)}</div>}
              {f.matched_keywords?.length > 0 && (
                <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {f.matched_keywords.slice(0, 4).map((k, j) => <span key={j} style={S.tag('#888')}>{k}</span>)}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span style={S.tag(f.source === 'github' ? '#7c3aed' : f.source === 'hackernews' ? '#f59e0b' : '#00ff88')}>{f.source || 'other'}</span>
              {f.relevance > 0 && <span style={{ fontSize: 10, color: '#555' }}>rel: {f.relevance}</span>}
            </div>
          </div>
        ))}
        {display.length === 0 && <div style={{ color: 'rgba(232,224,208,.3)', padding: 16 }}>No findings yet. API Scout runs every 6h.</div>}
      </div>
    </div>
  );
}
