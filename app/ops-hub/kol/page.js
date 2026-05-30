'use client';
import { useState, useEffect } from 'react';

const S = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#e8e0d0', fontFamily: 'monospace', padding: '24px' },
  header: { fontSize: 11, letterSpacing: '.35em', color: 'rgba(232,224,208,.4)', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  sub: { fontSize: 12, color: 'rgba(232,224,208,.4)', marginBottom: 24 },
  card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20, marginBottom: 12 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #111' },
  tag: (c) => ({ fontSize: 9, letterSpacing: '.15em', padding: '2px 8px', borderRadius: 4, background: c + '22', color: c }),
};

const TRACKED_KOLS = [
  { handle: 'blknoiz06', weight: 10, focus: 'Solana OG · early memes' },
  { handle: 'Murad_aw', weight: 10, focus: 'SOL ecosystem · gems' },
  { handle: 'inversebrah', weight: 9, focus: 'on-chain alpha · DeFi' },
  { handle: 'weremeow', weight: 9, focus: 'Solana memecoins' },
  { handle: 'gainzy222', weight: 9, focus: 'Solana plays · calls' },
  { handle: 'CryptoNobler', weight: 9, focus: 'technical + on-chain' },
  { handle: 'DegenSpartan', weight: 9, focus: 'DeFi · early calls' },
  { handle: 'AltcoinSherpa', weight: 8, focus: 'altcoin cycles · charts' },
  { handle: 'SolJakey', weight: 8, focus: 'Solana alpha' },
  { handle: 'CryptoTea_', weight: 8, focus: 'market moves · news' },
  { handle: 'TheCryptoLark', weight: 7, focus: 'research · education' },
  { handle: 'rajgokal', weight: 7, focus: 'Solana co-founder' },
  { handle: 'aeyakovenko', weight: 7, focus: 'Solana co-founder' },
];

export default function KOLPage() {
  const [intel, setIntel] = useState(null);

  useEffect(() => {
    fetch('/api/alpha?action=kol-intel')
      .then(r => r.json())
      .then(d => setIntel(d))
      .catch(() => {});
  }, []);

  const hotTokens = intel?.latest?.hot_tokens || [];
  const summary = intel?.latest?.summary || '';

  return (
    <div style={S.page}>
      <div style={S.header}>← <a href="/ops-hub" style={{ color: 'inherit', textDecoration: 'none' }}>OPS HUB</a> / KOL MONITOR</div>
      <div style={S.title}>KOL Monitor</div>
      <div style={S.sub}>15 top Solana callers · Nitter scraped every 10min · CA detection active</div>

      {hotTokens.length > 0 && (
        <>
          <div style={{ fontSize: 11, letterSpacing: '.2em', color: 'rgba(232,224,208,.4)', marginBottom: 12 }}>HOT TOKENS (LAST 4H)</div>
          <div style={S.card}>
            {hotTokens.slice(0, 8).map((t, i) => (
              <div key={i} style={S.row}>
                <strong>{t.token || t}</strong>
                <span style={{ fontSize: 11, color: '#888' }}>{t.mentions || 1} mention{(t.mentions || 1) > 1 ? 's' : ''}</span>
                <span style={S.tag('#f59e0b')}>{t.mentions >= 5 ? 'HIGH' : t.mentions >= 3 ? 'MED' : 'LOW'}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {summary && (
        <div style={{ ...S.card, marginBottom: 24, color: 'rgba(232,224,208,.7)', lineHeight: 1.6 }}>
          <div style={{ fontSize: 10, letterSpacing: '.2em', color: 'rgba(232,224,208,.4)', marginBottom: 8 }}>LATEST SUMMARY</div>
          {summary}
        </div>
      )}

      <div style={{ fontSize: 11, letterSpacing: '.2em', color: 'rgba(232,224,208,.4)', marginBottom: 12 }}>TRACKED KOLS ({TRACKED_KOLS.length})</div>
      <div style={S.card}>
        {TRACKED_KOLS.map((k, i) => (
          <div key={i} style={S.row}>
            <div>
              <a href={`https://twitter.com/${k.handle}`} target="_blank" rel="noreferrer" style={{ color: '#e8e0d0', textDecoration: 'none', fontWeight: 600 }}>@{k.handle}</a>
              <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>{k.focus}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 60, height: 4, background: '#222', borderRadius: 2 }}>
                <div style={{ width: `${k.weight * 10}%`, height: '100%', background: k.weight >= 9 ? '#00ff88' : k.weight >= 7 ? '#f59e0b' : '#888', borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 10, color: '#888' }}>{k.weight}/10</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
