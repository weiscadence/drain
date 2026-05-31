'use client';
import { useState, useEffect } from 'react';

export default function WebUserBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show if NOT in Telegram webview
    const isTelegram = !!window?.Telegram?.WebApp?.initDataUnsafe?.user;
    const wasDismissed = sessionStorage.getItem('web_banner_dismissed');
    if (!isTelegram && !wasDismissed) {
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('web_banner_dismissed', '1');
    setDismissed(true);
    setShow(false);
  };

  const openBot = () => {
    window.open('https://t.me/DrainFunbot', '_blank');
  };

  if (!show || dismissed) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'flex-end',
    }}
      onClick={e => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div style={{
        width: '100%',
        background: '#0c0c18',
        borderRadius: '24px 24px 0 0',
        border: '1px solid rgba(168,85,247,0.35)',
        borderBottom: 'none',
        padding: '0 0 env(safe-area-inset-bottom, 24px)',
        overflow: 'hidden',
      }}>
        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'14px 0 6px' }}>
          <div style={{ width:40, height:4, borderRadius:99, background:'rgba(255,255,255,0.15)' }}/>
        </div>

        <div style={{ padding:'8px 24px 24px', textAlign:'center' }}>
          <div style={{ fontSize:48, marginBottom:12 }}>👻</div>
          <div style={{ fontSize:20, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace', letterSpacing:-1, marginBottom:8 }}>
            Hey, you found the web version
          </div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:20, fontFamily:'monospace' }}>
            DrainFun.xyz is built as a{' '}
            <span style={{ color:'#a855f7', fontWeight:700 }}>Telegram Mini App</span>.{' '}
            Your wallet is tied to your Telegram profile — no password, no seed phrase.
            <br/><br/>
            Open in Telegram to get your real wallet and start trading.
          </div>

          <button
            onClick={openBot}
            style={{ width:'100%', height:56, borderRadius:16, background:'linear-gradient(135deg, #a855f7, #7c3aed)', color:'#fff', fontSize:16, fontWeight:900, cursor:'pointer', border:'none', fontFamily:'JetBrains Mono, monospace', boxShadow:'0 4px 24px rgba(168,85,247,0.4)', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}
          >
            <span style={{fontSize:20}}>✈️</span> Open in Telegram
          </button>

          <button
            onClick={dismiss}
            style={{ width:'100%', height:44, borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'monospace' }}
          >
            Continue in browser (limited)
          </button>

          <div style={{ marginTop:14, fontSize:10, color:'rgba(255,255,255,0.2)', fontFamily:'monospace', letterSpacing:'0.1em' }}>
            @DrainFunbot · drainfun.xyz
          </div>
        </div>
      </div>
    </div>
  );
}
