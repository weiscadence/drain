'use client';
import { useState, useEffect } from 'react';

export default function FundModal({ onClose, walletAddress }) {
  const [step, setStep] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const addr = walletAddress || 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ';

  const copy = async () => {
    try { await navigator.clipboard.writeText(addr); }
    catch { const e = document.createElement('textarea'); e.value = addr; document.body.appendChild(e); e.select(); document.execCommand('copy'); document.body.removeChild(e); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const requestFunds = async () => {
    setStep('loading');
    setError(null);
    try {
      const res = await fetch('/api/wallet/airdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, amount: 2 }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Airdrop failed');
      setResult(data);
      setStep('success');
      // Auto-close after 2.5s so balance refreshes immediately
      setTimeout(onClose, 2500);
    } catch (e) {
      setError(e.message);
      setStep('error');
    }
  };

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.9)', backdropFilter:'blur(16px)', display:'flex', alignItems:'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width:'100%', background:'#0c0c18', borderRadius:'24px 24px 0 0', border:'1px solid rgba(0,255,136,0.3)', borderBottom:'none', overflow:'hidden' }}>

        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px' }}>
          <div style={{ width:36, height:4, borderRadius:99, background:'rgba(255,255,255,0.15)' }}/>
        </div>

        <div style={{ padding:'4px 20px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>
              {step === 'success' ? '💰 Funded!' : 'Get Test SOL'}
            </div>
            <div style={{ fontSize:10, color:'rgba(0,255,136,0.7)', marginTop:2, fontFamily:'monospace' }}>
              instant · free · devnet
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'none', color:'rgba(255,255,255,0.5)', width:32, height:32, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>✕</button>
        </div>

        <div style={{ padding:'20px' }}>

          {/* SUCCESS */}
          {step === 'success' && (
            <div style={{ textAlign:'center', padding:'10px 0 20px' }}>
              <div style={{ fontSize:56, marginBottom:12, filter:'drop-shadow(0 0 20px #00ff88)' }}>💰</div>
              <div style={{ fontSize:20, fontWeight:900, color:'#00ff88', fontFamily:'JetBrains Mono, monospace', marginBottom:6 }}>
                {result?.amount} SOL sent!
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontFamily:'monospace', marginBottom:4 }}>
                New balance: {result?.newBalance?.toFixed(3)} SOL
              </div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', marginBottom:20, wordBreak:'break-all', padding:'0 20px' }}>
                Tx: {result?.signature?.slice(0,20)}...
              </div>
              <button onClick={onClose}
                style={{ padding:'12px 32px', borderRadius:14, background:'rgba(0,255,136,0.12)', border:'1px solid rgba(0,255,136,0.4)', color:'#00ff88', fontWeight:700, cursor:'pointer', fontFamily:'JetBrains Mono, monospace', fontSize:14 }}>
                Let's trade 🚀
              </button>
            </div>
          )}

          {/* IDLE / ERROR */}
          {(step === 'idle' || step === 'error') && (
            <>
              {/* Wallet */}
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'12px 14px', marginBottom:16 }}>
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', letterSpacing:'0.15em', marginBottom:6 }}>YOUR WALLET</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontFamily:'JetBrains Mono, monospace', wordBreak:'break-all', marginBottom:8 }}>{addr}</div>
                <button onClick={copy}
                  style={{ background: copied ? 'rgba(0,255,136,0.15)':'rgba(255,255,255,0.06)', border:`1px solid ${copied ? 'rgba(0,255,136,0.4)':'rgba(255,255,255,0.1)'}`, borderRadius:8, padding:'6px 14px', color: copied ? '#00ff88':'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>

              {error && (
                <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:12, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#ef4444', fontFamily:'monospace', lineHeight:1.5 }}>
                  ⚠ {error}
                </div>
              )}

              {/* BIG instant button */}
              <button
                onClick={requestFunds}
                style={{ width:'100%', height:62, borderRadius:18, background:'linear-gradient(135deg, #00ff88, #00cc66)', color:'#000', fontSize:18, fontWeight:900, cursor:'pointer', border:'none', fontFamily:'JetBrains Mono, monospace', boxShadow:'0 6px 32px rgba(0,255,136,0.5)', display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:10 }}
              >
                <span style={{fontSize:24}}>⚡</span> Get 2 SOL Free — Instant
              </button>

              <div style={{ fontSize:11, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', textAlign:'center', lineHeight:1.6 }}>
                Powered by our devnet faucet · No signup · No limits
              </div>
            </>
          )}

          {/* LOADING */}
          {step === 'loading' && (
            <div style={{ textAlign:'center', padding:'30px 0' }}>
              <div style={{ width:52, height:52, borderRadius:'50%', border:'3px solid #00ff88', borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }}/>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>Sending SOL...</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:6, fontFamily:'monospace' }}>signing from faucet wallet</div>
            </div>
          )}

          <div style={{ height:'env(safe-area-inset-bottom, 20px)' }}/>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
