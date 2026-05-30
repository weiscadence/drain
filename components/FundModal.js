'use client';
import { useState } from 'react';

function openExternal(url) {
  const tg = window?.Telegram?.WebApp;
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, '_blank');
}

export default function FundModal({ onClose, walletAddress }) {
  const [tab, setTab] = useState('devnet'); // devnet first
  const [airdropping, setAirdropping] = useState(false);
  const [airdropResult, setAirdropResult] = useState(null);
  const [airdropError, setAirdropError] = useState(null);

  const handleAirdrop = async () => {
    setAirdropping(true);
    setAirdropError(null);
    setAirdropResult(null);
    try {
      const res = await fetch('/api/wallet/airdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, amount: 2 }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAirdropResult(data);
    } catch (e) {
      setAirdropError(e.message || 'Airdrop failed');
    }
    setAirdropping(false);
  };
  const [copied, setCopied] = useState(false);


  const addr = walletAddress || 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ';
  const shortAddr = addr.slice(0, 6) + '...' + addr.slice(-4);

  const copyAddress = async () => {
    try { await navigator.clipboard.writeText(addr); }
    catch { const el = document.createElement('textarea'); el.value = addr; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  const TABS = [
    { id: 'devnet', label: '🧪 Devnet', active: true },
    { id: 'receive', label: '📥 Receive', active: true },
    { id: 'buy', label: '💳 Buy', active: false },
  ];

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(14px)', display:'flex', alignItems:'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width:'100%', background:'#0c0c18', borderRadius:'24px 24px 0 0', border:'1px solid rgba(168,85,247,0.3)', borderBottom:'none', maxHeight:'88vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px', flexShrink:0 }}>
          <div style={{ width:36, height:4, borderRadius:99, background:'rgba(255,255,255,0.12)' }}/>
        </div>

        {/* Header */}
        <div style={{ padding:'4px 20px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>Fund Wallet</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:2, fontFamily:'monospace' }}>{shortAddr} · devnet</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'none', color:'rgba(255,255,255,0.5)', width:32, height:32, borderRadius:'50%', fontSize:16, cursor:'pointer' }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.06)', flexShrink:0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => t.active && setTab(t.id)}
              style={{ flex:1, padding:'10px 0', background:'none', border:'none', borderBottom: tab===t.id ? '2px solid #a855f7':'2px solid transparent', color: !t.active ? 'rgba(255,255,255,0.18)' : tab===t.id ? '#a855f7':'rgba(255,255,255,0.45)', fontSize:12, fontWeight:700, cursor: t.active ? 'pointer':'default', fontFamily:'monospace', transition:'all 0.15s', marginBottom:-1, position:'relative' }}>
              {t.label}
              {!t.active && <span style={{ fontSize:8, position:'absolute', top:6, right:8, background:'rgba(255,255,255,0.1)', borderRadius:4, padding:'1px 4px', color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>SOON</span>}
            </button>
          ))}
        </div>

        <div style={{ overflowY:'auto', padding:'18px 20px', flex:1 }}>

          {/* DEVNET TAB */}
          {tab === 'devnet' && (
            <>
              <div style={{ background:'rgba(0,255,136,0.06)', borderRadius:14, padding:'14px', border:'1px solid rgba(0,255,136,0.2)', marginBottom:16 }}>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>
                  Get free devnet SOL to test swaps and transactions. No real money — just for testing drain.fun before mainnet launch.
                </div>
              </div>

              {/* Main airdrop - instant from local validator */}
              <button
                onClick={handleAirdrop}
                disabled={airdropping}
                style={{ width:'100%', height:54, borderRadius:16, background: airdropping ? 'rgba(0,255,136,0.05)':'rgba(0,255,136,0.12)', border:'1.5px solid rgba(0,255,136,0.4)', color:'#00ff88', fontSize:16, fontWeight:900, cursor: airdropping ? 'default':'pointer', fontFamily:'JetBrains Mono, monospace', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow: airdropping ? 'none':'0 4px 20px rgba(0,255,136,0.15)', marginBottom:8, transition:'all 0.2s' }}
              >
                {airdropping
                  ? <><div style={{width:18,height:18,borderRadius:'50%',border:'2px solid #00ff88',borderTopColor:'transparent',animation:'spin 0.8s linear infinite'}}/> Sending...</>
                  : <><span style={{fontSize:20}}>⚡</span> Airdrop 2 SOL — Instant</>}
              </button>
              {airdropResult && (
                <div style={{background:'rgba(0,255,136,0.08)',borderRadius:10,padding:'10px 12px',border:'1px solid rgba(0,255,136,0.2)',marginBottom:8}}>
                  <div style={{fontSize:12,color:'#00ff88',fontWeight:700,fontFamily:'monospace'}}>✅ {airdropResult.amount} SOL sent!</div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',fontFamily:'monospace',marginTop:2}}>New balance: {airdropResult.newBalance?.toFixed(3)} SOL</div>
                </div>
              )}
              {airdropError && (
                <div style={{background:'rgba(239,68,68,0.08)',borderRadius:10,padding:'10px 12px',border:'1px solid rgba(239,68,68,0.2)',marginBottom:8}}>
                  <div style={{fontSize:11,color:'#ef4444',fontFamily:'monospace'}}>⚠ {airdropError}</div>
                </div>
              )}

              {/* Backup faucets */}
              <div style={{ fontSize:9, letterSpacing:'0.15em', color:'rgba(255,255,255,0.2)', marginBottom:8, fontFamily:'monospace' }}>BACKUP FAUCETS</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <button onClick={() => openExternal(`https://faucet.solana.com/?wallet=${addr}`)}
                  style={{ width:'100%', height:42, borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.55)', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'monospace' }}>
                  faucet.solana.com →
                </button>
                <button onClick={() => openExternal('https://solfaucet.com/')}
                  style={{ width:'100%', height:42, borderRadius:12, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.55)', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'monospace' }}>
                  solfaucet.com →
                </button>
              </div>

              {/* Your address for reference */}
              <div style={{ marginTop:14, padding:'10px 12px', background:'rgba(255,255,255,0.025)', borderRadius:10, border:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.15)', marginBottom:4, fontFamily:'monospace' }}>YOUR DEVNET ADDRESS</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'JetBrains Mono, monospace', wordBreak:'break-all', marginBottom:8 }}>{addr}</div>
                <button onClick={copyAddress}
                  style={{ background: copied ? 'rgba(0,255,136,0.1)':'rgba(255,255,255,0.05)', border:`1px solid ${copied ? 'rgba(0,255,136,0.3)':'rgba(255,255,255,0.08)'}`, borderRadius:8, padding:'5px 12px', color: copied ? '#00ff88':'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                  {copied ? '✅ Copied!' : '📋 Copy address'}
                </button>
              </div>
            </>
          )}

          {/* RECEIVE TAB */}
          {tab === 'receive' && (
            <>
              <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.3)', marginBottom:12, fontFamily:'monospace' }}>YOUR SOLANA WALLET</div>

              <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:14, padding:'16px', border:'1px solid rgba(168,85,247,0.2)', marginBottom:12 }}>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', marginBottom:8 }}>ADDRESS</div>
                <div style={{ fontSize:12, color:'#fff', fontFamily:'JetBrains Mono, monospace', wordBreak:'break-all', lineHeight:1.7 }}>{addr}</div>
              </div>

              <button onClick={copyAddress}
                style={{ width:'100%', height:52, borderRadius:16, background: copied ? 'rgba(0,255,136,0.15)':'rgba(168,85,247,0.12)', border:`1.5px solid ${copied ? '#00ff88':'rgba(168,85,247,0.35)'}`, color: copied ? '#00ff88':'#a855f7', fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:'JetBrains Mono, monospace', transition:'all 0.2s', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {copied ? '✅ Copied!' : '📋 Copy Address'}
              </button>

              <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, padding:'12px 14px', border:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontFamily:'monospace', lineHeight:1.7 }}>
                  Send devnet SOL to this address to fund your account for testing. Works with Phantom devnet mode.
                </div>
              </div>
            </>
          )}

          {/* BUY TAB — coming soon */}
          {tab === 'buy' && (
            <div style={{ textAlign:'center', padding:'40px 20px' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>💳</div>
              <div style={{ fontSize:16, fontWeight:700, color:'rgba(255,255,255,0.5)', fontFamily:'JetBrains Mono, monospace', marginBottom:8 }}>Coming soon</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', lineHeight:1.6 }}>
                Card, Apple Pay, and crypto funding will be available at mainnet launch.
              </div>
            </div>
          )}

          <div style={{ height:'env(safe-area-inset-bottom, 20px)' }}/>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
