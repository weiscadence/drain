'use client';
import { useState } from 'react';

function openExternal(url) {
  const tg = window?.Telegram?.WebApp;
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, '_blank');
}

export default function FundModal({ onClose, walletAddress }) {
  const [copied, setCopied] = useState(false);

  const addr = walletAddress || 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ';
  const shortAddr = addr.slice(0, 8) + '...' + addr.slice(-6);

  const copy = async () => {
    try { await navigator.clipboard.writeText(addr); }
    catch { const e = document.createElement('textarea'); e.value = addr; document.body.appendChild(e); e.select(); document.execCommand('copy'); document.body.removeChild(e); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.9)', backdropFilter:'blur(16px)', display:'flex', alignItems:'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width:'100%', background:'#0c0c18', borderRadius:'24px 24px 0 0', border:'1px solid rgba(0,255,136,0.3)', borderBottom:'none', overflow:'hidden' }}>

        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
          <div style={{ width:36, height:4, borderRadius:99, background:'rgba(255,255,255,0.15)' }}/>
        </div>

        {/* Header */}
        <div style={{ padding:'4px 20px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>Add Devnet SOL</div>
            <div style={{ fontSize:10, color:'rgba(0,255,136,0.7)', marginTop:2, fontFamily:'monospace' }}>real Solana devnet · verified on-chain</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'none', color:'rgba(255,255,255,0.5)', width:32, height:32, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>✕</button>
        </div>

        <div style={{ padding:'20px' }}>

          {/* Wallet address — prominent */}
          <div style={{ background:'rgba(0,255,136,0.06)', border:'1px solid rgba(0,255,136,0.25)', borderRadius:14, padding:'14px 16px', marginBottom:16 }}>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'monospace', marginBottom:6, letterSpacing:'0.15em' }}>YOUR DEVNET WALLET</div>
            <div style={{ fontSize:12, color:'#fff', fontFamily:'JetBrains Mono, monospace', wordBreak:'break-all', lineHeight:1.7, marginBottom:10 }}>{addr}</div>
            <button onClick={copy}
              style={{ width:'100%', height:40, borderRadius:10, background: copied ? 'rgba(0,255,136,0.2)':'rgba(0,255,136,0.1)', border:`1px solid ${copied ? '#00ff88':'rgba(0,255,136,0.3)'}`, color:'#00ff88', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'JetBrains Mono, monospace', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              {copied ? '✅ Copied!' : '📋 Copy Address'}
            </button>
          </div>

          {/* Step by step */}
          <div style={{ fontSize:10, letterSpacing:'0.15em', color:'rgba(255,255,255,0.3)', marginBottom:10, fontFamily:'monospace' }}>GET FREE DEVNET SOL IN 3 TAPS</div>

          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
            {[
              { n:'1', text:'Copy your address above' },
              { n:'2', text:'Open faucet → paste address → hit Airdrop' },
              { n:'3', text:'Come back and start swiping 🚀' },
            ].map(s => (
              <div key={s.n} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:'rgba(255,255,255,0.03)', borderRadius:10, border:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(0,255,136,0.15)', border:'1px solid rgba(0,255,136,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#00ff88', flexShrink:0 }}>{s.n}</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontFamily:'monospace' }}>{s.text}</div>
              </div>
            ))}
          </div>

          {/* BIG faucet button */}
          <button
            onClick={() => {
              copy(); // auto-copy address
              setTimeout(() => openExternal(`https://faucet.solana.com/?wallet=${addr}&cluster=devnet`), 300);
            }}
            style={{ width:'100%', height:58, borderRadius:16, background:'linear-gradient(135deg, #00ff88, #00cc66)', color:'#000', fontSize:17, fontWeight:900, cursor:'pointer', border:'none', fontFamily:'JetBrains Mono, monospace', boxShadow:'0 4px 28px rgba(0,255,136,0.4)', display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:10 }}
          >
            <span style={{fontSize:22}}>⚡</span> Open Solana Faucet
          </button>

          <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', textAlign:'center', lineHeight:1.6 }}>
            Address auto-copied · Opens in browser · Free · Real devnet SOL
          </div>

          <div style={{ height:'env(safe-area-inset-bottom, 20px)' }}/>
        </div>
      </div>
    </div>
  );
}
