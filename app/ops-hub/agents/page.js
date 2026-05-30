'use client';
import { useState, useEffect } from 'react';

const S = {
  page: { minHeight: '100vh', background: '#0a0a0a', color: '#e8e0d0', fontFamily: 'monospace', padding: '24px' },
  header: { fontSize: 11, letterSpacing: '.35em', color: 'rgba(232,224,208,.4)', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  sub: { fontSize: 12, color: 'rgba(232,224,208,.4)', marginBottom: 24 },
  card: { background: '#111', border: '1px solid #1e1e1e', borderRadius: 12, padding: 20, marginBottom: 12 },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #111' },
  dot: (on) => ({ width: 8, height: 8, borderRadius: '50%', background: on ? '#00ff88' : '#ff4444', display: 'inline-block', marginRight: 8, boxShadow: on ? '0 0 6px #00ff88' : 'none' }),
  tag: { fontSize: 9, letterSpacing: '.15em', padding: '2px 8px', borderRadius: 4 },
};

const AGENTS = [
  { name: 'alfalfa-gpt', label: 'Alfalfa GPT', desc: 'Telegram bot · GPU inference · command handler', type: 'pm2' },
  { name: 'alfalfa-signals', label: 'Signal Server', desc: 'Hyperliquid WS · liquidation alerts · TradingView webhook', type: 'pm2' },
  { name: 'drain', label: 'Drain Site', desc: 'drainfun.xyz · Next.js · all pages', type: 'pm2' },
  { name: 'gpu-server', label: 'GPU Server', desc: 'x402 inference server · Vast.ai tunnel', type: 'pm2' },
  { name: 'vast-tunnel', label: 'Vast Tunnel', desc: 'SSH tunnel → RTX 3090 · Ollama on :11434', type: 'pm2' },
  { name: 'alpha-caller', label: 'Alpha Caller', desc: 'Funding arb · wallet coord · key levels → formatted calls', type: 'cron', schedule: 'every 15min' },
  { name: 'jito-wallet-tracker', label: 'Jito Tracker', desc: '48 wallets · Jito bundle detection · cluster analysis', type: 'cron', schedule: 'every 10min' },
  { name: 'nitter-kol-scout', label: 'KOL Scout', desc: '15 top Solana KOLs · Nitter scrape · CA detection', type: 'cron', schedule: 'every 10min' },
  { name: 'prediction-market-scout', label: 'Prediction Scout', desc: 'Polymarket/Kalshi · new markets · vol spikes · cross-arb', type: 'cron', schedule: 'every 15min' },
  { name: 'signal-hunter', label: 'Signal Hunter', desc: 'Polymarket spread arb · funding · liq clusters · news', type: 'cron', schedule: 'every 15min' },
  { name: 'intel-collector', label: 'Intel Collector', desc: 'Prices · F&G · trending · Moltbook', type: 'cron', schedule: 'every 30min' },
  { name: 'auto-poster', label: 'Auto Poster', desc: 'Moltbook posts · Groq/GPU content gen', type: 'cron', schedule: 'every 6h' },
  { name: 'kol-monitor', label: 'KOL Monitor', desc: 'Top crypto Twitter accounts · sentiment', type: 'cron', schedule: 'every 3h' },
  { name: 'self-improver', label: 'Self Improver', desc: 'Nightly GPU analysis · improvement suggestions', type: 'cron', schedule: '3am UTC' },
  { name: 'meta-improver', label: 'Meta Improver', desc: 'Intent model · communication learning', type: 'cron', schedule: '3:30am UTC' },
  { name: 'wallet-profiler', label: 'Wallet Profiler', desc: 'Scores all wallets by win rate nightly', type: 'cron', schedule: '2am UTC' },
];

export default function AgentsPage() {
  const [status, setStatus] = useState({});

  useEffect(() => {
    fetch('/api/alpha?action=agent-status')
      .then(r => r.json())
      .then(d => setStatus(d.agents || {}))
      .catch(() => {});
  }, []);

  return (
    <div style={S.page}>
      <div style={S.header}>← <a href="/ops-hub" style={{ color: 'inherit', textDecoration: 'none' }}>OPS HUB</a> / AGENTS</div>
      <div style={S.title}>Agent Swarm</div>
      <div style={S.sub}>{AGENTS.length} agents running · {AGENTS.filter(a => a.type === 'pm2').length} persistent · {AGENTS.filter(a => a.type === 'cron').length} cron</div>

      <div style={{ marginBottom: 16, fontSize: 11, letterSpacing: '.2em', color: 'rgba(232,224,208,.4)' }}>PM2 PROCESSES</div>
      <div style={S.card}>
        {AGENTS.filter(a => a.type === 'pm2').map((a, i) => {
          const s = status[a.name];
          const online = s?.status === 'online';
          return (
            <div key={i} style={S.row}>
              <div>
                <span style={S.dot(online)} />
                <strong style={{ fontSize: 13 }}>{a.label}</strong>
                <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>{a.desc}</span>
              </div>
              <span style={{ ...S.tag, background: online ? '#00ff8822' : '#ff444422', color: online ? '#00ff88' : '#ff4444', fontSize: 9, letterSpacing: '.15em' }}>
                {s?.status || 'unknown'}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 16, fontSize: 11, letterSpacing: '.2em', color: 'rgba(232,224,208,.4)' }}>CRON AGENTS</div>
      <div style={S.card}>
        {AGENTS.filter(a => a.type === 'cron').map((a, i) => (
          <div key={i} style={S.row}>
            <div>
              <span style={{ ...S.dot(true), background: '#f59e0b', boxShadow: '0 0 6px #f59e0b88' }} />
              <strong style={{ fontSize: 13 }}>{a.label}</strong>
              <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>{a.desc}</span>
            </div>
            <span style={{ fontSize: 10, color: '#f59e0b' }}>{a.schedule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
