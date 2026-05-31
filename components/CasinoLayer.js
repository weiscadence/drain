'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

// ── CONFETTI ──────────────────────────────────────────────
export function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    if (!active) return;
    const colors = ['#ff0066','#00ff88','#ff6600','#a855f7','#22d3ee','#ffff00','#ff1493'];
    const p = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      delay: Math.random() * 0.4,
      duration: 0.8 + Math.random() * 0.8,
      rotate: Math.random() * 720,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }));
    setPieces(p);
    const t = setTimeout(() => setPieces([]), 2000);
    return () => clearTimeout(t);
  }, [active]);

  if (!pieces.length) return null;
  return (
    <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:999, overflow:'hidden' }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:'absolute',
          left:`${p.x}%`, top:'-10px',
          width: p.shape === 'circle' ? p.size : p.size * 0.7,
          height: p.shape === 'circle' ? p.size : p.size * 1.4,
          borderRadius: p.shape === 'circle' ? '50%' : 2,
          background: p.color,
          boxShadow: `0 0 ${p.size}px ${p.color}`,
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          '--rotate': `${p.rotate}deg`,
        }}/>
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(var(--rotate)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── APED IN CELEBRATION ───────────────────────────────────
export function ApedIn({ show, onDone, tokenSymbol }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [show, onDone]);

  if (!show) return null;
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1200, pointerEvents:'none',
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'rgba(0,0,0,0.3)',
    }}>
      <div style={{
        textAlign:'center',
        animation:'apedInPop 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}>
        <div style={{ fontSize:72, lineHeight:1, filter:'drop-shadow(0 0 30px #ff6600)' }}>🚀</div>
        <div style={{
          fontSize:36, fontWeight:900, color:'#ff6600',
          fontFamily:'JetBrains Mono, monospace',
          textShadow:'0 0 30px #ff660080, 0 0 60px #ff660040',
          letterSpacing:-1, marginTop:8,
        }}>APED IN!</div>
        <div style={{
          fontSize:16, color:'#fff', marginTop:6,
          fontFamily:'monospace', opacity:0.9,
          textShadow:'0 2px 10px rgba(0,0,0,0.8)',
        }}>you bought ${tokenSymbol} like a legend fr fr</div>
      </div>
      <style>{`
        @keyframes apedInPop {
          0% { transform: scale(0.5) translateY(30px); opacity:0; }
          100% { transform: scale(1) translateY(0); opacity:1; }
        }
      `}</style>
    </div>
  );
}

// ── RUGGED SCREEN ─────────────────────────────────────────
const RUG_MESSAGES = [
  "Rugged harder than my life choices 😂",
  "Dev sold faster than you could say 'gm'",
  "At least you have cool screenshots for the group chat",
  "The rug was the friends we made along the way",
  "Not financial advice but lmaooo",
  "bro really thought this one was different",
];

export function RuggedScreen({ show, onDone, tokenSymbol }) {
  const msg = RUG_MESSAGES[Math.floor(Math.random() * RUG_MESSAGES.length)];
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [show, onDone]);
  if (!show) return null;
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1200, pointerEvents:'none',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)',
    }}>
      {/* Ugly crying pepe emoji substitute */}
      <div style={{ fontSize:80, lineHeight:1, filter:'drop-shadow(0 0 20px rgba(255,68,68,0.8))', animation:'shake 0.5s infinite' }}>😭</div>
      <div style={{
        fontSize:22, fontWeight:900, color:'#ff4444',
        fontFamily:'JetBrains Mono, monospace',
        marginTop:16, textAlign:'center', padding:'0 24px',
        textShadow:'0 0 20px #ff444480',
        lineHeight:1.3,
      }}>${tokenSymbol} RUGGED 💀</div>
      <div style={{
        fontSize:14, color:'rgba(255,255,255,0.7)',
        marginTop:10, textAlign:'center', padding:'0 32px',
        fontFamily:'monospace', lineHeight:1.5,
      }}>{msg}</div>
      <style>{`@keyframes shake{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}`}</style>
    </div>
  );
}

// ── PNL TICKER ────────────────────────────────────────────
const HYPE_NOTIFICATIONS = [
  "Your coin is MOONING rn 👀🚀",
  "+420%… you're actually him",
  "This shit is pumping harder than your ex's situationship",
  "bro are you even watching the charts rn",
  "smart money just loaded up on something 👀",
  "new rug detected: skill issue lmao",
  "someone just aped $50k into a coin that launched 4 min ago",
  "the chart looks like my posture after sitting all day",
  "300% in 2 hours. or was it -97%. we don't talk about it",
  "ser this is literally going to zero but make it aesthetic",
];

export function HypeNotification({ show, message, onDone }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [show, onDone]);
  if (!show) return null;
  return (
    <div style={{
      position:'fixed', top:'env(safe-area-inset-top, 0px)', left:0, right:0,
      zIndex:800, padding:'12px 16px',
      display:'flex', alignItems:'center', gap:10,
      background:'linear-gradient(135deg, rgba(168,85,247,0.95), rgba(124,58,237,0.95))',
      backdropFilter:'blur(20px)',
      borderBottom:'2px solid #a855f7',
      animation:'slideDown 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      boxShadow:'0 8px 32px rgba(168,85,247,0.4)',
    }}>
      <span style={{ fontSize:20 }}>📳</span>
      <span style={{ fontSize:13, fontWeight:700, color:'#fff', fontFamily:'monospace', flex:1 }}>{message}</span>
      <style>{`@keyframes slideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}

// ── X2 OR NOTHING BUTTON ──────────────────────────────────
export function X2Button({ onResult, disabled }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null); // 'x2' | 'nothing'

  const spin = async () => {
    if (spinning || disabled) return;
    setSpinning(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 800));
    const win = Math.random() < 0.5;
    setResult(win ? 'x2' : 'nothing');
    setTimeout(() => {
      setSpinning(false);
      setResult(null);
      onResult(win);
    }, 1200);
  };

  return (
    <button
      onClick={spin}
      disabled={disabled || spinning}
      style={{
        width:'100%', height:46,
        borderRadius:14,
        background: spinning ? 'rgba(255,200,0,0.15)' :
          result === 'x2' ? 'rgba(0,255,136,0.15)' :
          result === 'nothing' ? 'rgba(255,68,68,0.15)' :
          'rgba(255,200,0,0.1)',
        border: `1.5px solid ${
          result === 'x2' ? '#00ff88' :
          result === 'nothing' ? '#ff4444' :
          'rgba(255,200,0,0.5)'
        }`,
        color: result === 'x2' ? '#00ff88' : result === 'nothing' ? '#ff4444' : '#ffc800',
        fontSize:14, fontWeight:900, cursor: disabled ? 'default':'pointer',
        fontFamily:'JetBrains Mono, monospace',
        display:'flex', alignItems:'center', justifyContent:'center', gap:8,
        transition:'all 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {spinning
        ? <span style={{ animation:'spinIcon 0.2s linear infinite', display:'inline-block' }}>🎰</span>
        : result === 'x2' ? '🚀 x2 BABY!'
        : result === 'nothing' ? '💀 NOTHING LOL'
        : <><span>🎰</span> x2 or Nothing</>}
      <style>{`@keyframes spinIcon{to{transform:rotate(360deg)}}`}</style>
    </button>
  );
}

// ── POSITION FIRE ANIMATION ───────────────────────────────
export function PositionEmoji({ pnlPct }) {
  if (pnlPct > 100) return <span style={{ fontSize:18, animation:'bounce 0.5s infinite alternate', display:'inline-block' }}>🚀</span>;
  if (pnlPct > 20) return <span style={{ fontSize:18, animation:'flicker 0.3s infinite alternate', display:'inline-block', filter:'drop-shadow(0 0 6px orange)' }}>🔥</span>;
  if (pnlPct > 0) return <span style={{ fontSize:16 }}>📈</span>;
  if (pnlPct > -20) return <span style={{ fontSize:16 }}>📉</span>;
  return <span style={{ fontSize:18, animation:'wobble 0.4s infinite alternate', display:'inline-block' }}>😭</span>;
}

// ── LIVE PNL TICKER ───────────────────────────────────────
export function PnlTicker({ positions }) {
  const [displayPnl, setDisplayPnl] = useState(0);
  const targetRef = useRef(0);

  const totalPnl = positions.reduce((acc, p) => acc + (p.pnlPct || 0), 0);
  const avgPnl = positions.length > 0 ? totalPnl / positions.length : 0;

  useEffect(() => {
    targetRef.current = avgPnl;
    const interval = setInterval(() => {
      setDisplayPnl(prev => {
        const diff = targetRef.current - prev;
        const jitter = (Math.random() - 0.5) * 2; // live ticker wobble
        if (Math.abs(diff) < 0.1) return targetRef.current + jitter * 0.5;
        return prev + diff * 0.1 + jitter * 0.3;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [avgPnl]);

  if (!positions.length) return null;

  const isUp = displayPnl >= 0;
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:6,
      padding:'4px 10px',
      background: isUp ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)',
      border: `1px solid ${isUp ? 'rgba(0,255,136,0.3)' : 'rgba(255,68,68,0.3)'}`,
      borderRadius:8,
    }}>
      <span style={{ fontSize:11 }}>{isUp ? '📈' : '📉'}</span>
      <span style={{
        fontSize:12, fontWeight:800,
        fontFamily:'JetBrains Mono, monospace',
        color: isUp ? '#00ff88' : '#ff4444',
        textShadow: `0 0 8px ${isUp ? '#00ff8880' : '#ff444480'}`,
        minWidth:60,
      }}>
        {isUp ? '+' : ''}{displayPnl.toFixed(1)}%
      </span>
      <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>PnL</span>
    </div>
  );
}

export const HYPE_NOTIFS = HYPE_NOTIFICATIONS;
