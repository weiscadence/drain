'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


// ═══════════════════════════════════════════════════════════════════
// OPS HUB — The inner layer
// All tools, pipelines, monetization, agents.
// Password protected now. $DRAIN token gated later.
// ═══════════════════════════════════════════════════════════════════

const SECTIONS = [
  {
    id: 'create',
    label: 'CREATE',
    color: '#a855f7',
    desc: 'Content pipelines, brand tools, media production',
    apps: [
      { label: 'Studio', sub: 'YouTube channel ops + scripts', href: '/studio', status: 'live' },
      { label: 'FREQ', sub: 'DJ brand + distribution hub', href: '/freq', status: 'live' },
      { label: 'WEIS', sub: 'Streetwear drops + altar kits', href: '/weis', status: 'live' },
      { label: 'Clips', sub: 'Streamer clip pipeline + upload queue', href: '/clips', status: 'live' },
      { label: 'Higgsfield', sub: 'AI video generation', href: '/ops-hub/higgsfield', status: 'live' },
      { label: 'GPU / Music', sub: 'ace-step music gen + SD images', href: '/gpu', status: 'installing' },
    ],
  },
  {
    id: 'alpha',
    label: 'ALPHA',
    color: '#22c55e',
    desc: 'On-chain signal detection, wallet tracking, market intel',
    apps: [
      { label: 'Wallet Tracker', sub: '48 wallets · Jito bundle detection · clusters', href: '/alpha', status: 'live' },
      { label: 'Alpha Caller', sub: 'Real calls · entry/stop/target · win rate', href: '/ops-hub/paper', status: 'live' },
      { label: 'Meteora LP', sub: 'FREQ + WEIS brains · 1401% APR pools', href: '/ops-hub/market', status: 'live' },
      { label: 'Prediction Scout', sub: 'Polymarket edges · vol spikes · Kalshi arb', href: '/ops-hub/scanner', status: 'live' },
      { label: 'KOL Scout', sub: '15 Solana callers · Nitter · CA detection', href: '/ops-hub/kol', status: 'live' },
      { label: 'Signal Hunter', sub: 'Funding arb · news catalysts · liq clusters', href: '/ops-hub/thesis', status: 'live' },
    ],
  },
  {
    id: 'earn',
    label: 'EARN',
    color: '#f59e0b',
    desc: 'Income streams, monetization, bounties, passive',
    apps: [
      { label: 'Alfalfa Mini App', sub: 'Telegram app · signals · LP · one-click execute', href: '/app', status: 'live' },
      { label: 'Roblox World', sub: 'FREQ concert · GamePass monetization', href: '/ops-roblox', status: 'building' },
      { label: 'GPU Server', sub: 'RTX 3090 · Ollama · SDXL · Whisper · MusicGen', href: '/gpu', status: 'live' },
      { label: '$DRAIN Token', sub: 'Live on bags.fm · holders get early access', href: '/void', status: 'live' },
      { label: 'TON Mini App', sub: 'Bridge · execute · TON Connect coming', href: '/app', status: 'live' },
      { label: 'Sports Arb', sub: 'Odds API · guaranteed profit plays', href: '/ops-hub/jobs', status: 'live' },
    ],
  },
  {
    id: 'infra',
    label: 'INFRA',
    color: '#06b6d4',
    desc: 'System health, agents, data, pipelines',
    apps: [
      { label: 'Ops Dashboard', sub: '15 agents · cron health · signal pipeline', href: '/ops', status: 'live' },
      { label: 'Moltbook', sub: 'Cadence_II · 10 posts · replies active', href: '/ops-hub/moltbook', status: 'live' },
      { label: 'Agents', sub: '7 PM2 + 8 cron agents running', href: '/ops-hub/agents', status: 'live' },
      { label: 'GPU Stack', sub: 'RTX 3090 · SDXL art · MusicGen · Whisper', href: '/ops-hub/improve', status: 'live' },
      { label: 'API Scout', sub: '157 free APIs discovered · auto-updating', href: '/ops-hub/apis', status: 'live' },
      { label: 'Cadence Music', sub: 'First tracks generated · finding sound', href: '/studio', status: 'building' },
    ],
  },
];

const STATUS_STYLE = {
  live:       { color: '#00ff88', label: 'LIVE' },
  installing: { color: '#ff8800', label: 'INSTALLING' },
  building:   { color: '#f59e0b', label: 'BUILDING' },
  soon:       { color: '#666',    label: 'SOON' },
};

export default function OpsHub() {
  const router = useRouter();
  const [active, setActive] = useState('create');
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && sessionStorage.getItem('ops_auth') !== 'true') {
      router.replace('/ops-gate');
      return;
    }
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const section = SECTIONS.find(s => s.id === active);

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#060408' }} />;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060408',
      color: '#e8e0d0',
      fontFamily: 'ui-monospace,"Space Mono",monospace',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Scanlines */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5,
        background: 'repeating-linear-gradient(0deg,transparent 0px,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)',
      }}/>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 20,
        background: 'rgba(6,4,8,0.97)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href="/" style={{ fontSize: 9, letterSpacing: '.35em', color: 'rgba(232,224,208,.2)', textDecoration: 'none' }}>← DRAIN.FUN</a>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
          <span style={{ fontSize: 9, letterSpacing: '.35em', color: section?.color || '#fff' }}>OPS</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88' }}/>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '.2em' }}>LIVE</span>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 28px',
        overflowX: 'auto',
      }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '14px 20px',
            fontSize: 10, letterSpacing: '.35em',
            color: active === s.id ? s.color : 'rgba(255,255,255,0.25)',
            borderBottom: active === s.id ? `2px solid ${s.color}` : '2px solid transparent',
            transition: 'all .2s',
            whiteSpace: 'nowrap',
            marginBottom: -1,
          }}>{s.label}</button>
        ))}
      </div>

      {/* Section description */}
      <div style={{ padding: '24px 28px 8px', fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: '"Cormorant Garamond",Georgia,serif', fontStyle: 'italic' }}>
        {section?.desc}
      </div>

      {/* Apps grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 12, padding: '16px 28px 60px',
        opacity: loaded ? 1 : 0, transition: 'opacity .4s',
      }}>
        {section?.apps.map((app, i) => {
          const st = STATUS_STYLE[app.status] || STATUS_STYLE.soon;
          return (
            <a key={i} href={app.href} style={{
              display: 'block', textDecoration: 'none',
              background: `${section.color}06`,
              border: `1px solid ${section.color}22`,
              padding: '20px 22px',
              transition: 'all .2s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${section.color}55`; e.currentTarget.style.background = `${section.color}10`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${section.color}22`; e.currentTarget.style.background = `${section.color}06`; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#e8e0d0', letterSpacing: '.03em', fontFamily: 'inherit' }}>{app.label}</span>
                <span style={{ fontSize: 8, color: st.color, letterSpacing: '.25em', marginTop: 2 }}>{st.label}</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(232,224,208,0.4)', lineHeight: 1.6, letterSpacing: '.02em' }}>{app.sub}</div>
            </a>
          );
        })}
      </div>

      {/* Footer — token gate preview */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '12px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(6,4,8,0.97)',
        zIndex: 20,
      }}>
        <span style={{ fontSize: 8, letterSpacing: '.3em', color: 'rgba(255,255,255,0.12)' }}>
          DRAIN OPS — INTERNAL
        </span>
        <span style={{ fontSize: 8, letterSpacing: '.25em', color: 'rgba(212,175,55,0.3)' }}>
          FUTURE: $DRAIN TOKEN GATE
        </span>
      </div>
    </div>
  );
}
