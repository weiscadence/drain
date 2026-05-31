'use client';
import { useState, useEffect } from 'react';

function GraffitiLogo() {
  return (
    <svg viewBox="0 0 400 95" style={{ width:'100%', maxWidth:340, height:'auto' }}>
      <defs>
        <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <filter id="splashGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Drips */}
      <path d="M45 55 Q45 75 43 92" stroke="#a855f7" strokeWidth="3" fill="none" opacity="0.6"/>
      <path d="M95 58 Q95 72 94 80" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.5"/>
      <path d="M180 56 Q180 80 178 98" stroke="#22c55e" strokeWidth="4" fill="none" opacity="0.7"/>
      <path d="M290 55 Q290 68 289 76" stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.4"/>
      <path d="M350 57 Q350 75 348 90" stroke="#06b6d4" strokeWidth="3" fill="none" opacity="0.6"/>

      {/* Outline for depth */}
      <text x="202" y="52" textAnchor="middle"
        style={{ fontFamily:'Impact, Haettenschweiler, sans-serif', fontSize:'52px', fontWeight:'bold', fill:'none', stroke:'rgba(0,0,0,0.6)', strokeWidth:'5px', letterSpacing:'-2px' }}
      >DRAINFUN</text>

      {/* Main text */}
      <text x="200" y="50" textAnchor="middle"
        style={{ fontFamily:'Impact, Haettenschweiler, sans-serif', fontSize:'52px', fontWeight:'bold', fill:'url(#splashGrad)', filter:'url(#splashGlow)', letterSpacing:'-2px' }}
      >DRAINFUN</text>

      {/* .xyz tag */}
      <text x="358" y="52"
        style={{ fontFamily:'Impact, sans-serif', fontSize:'20px', fill:'#f59e0b', transform:'rotate(-8deg)', transformOrigin:'358px 52px', filter:'url(#splashGlow)' }}
      >.xyz</text>

      {/* Underline */}
      <path d="M50 62 Q200 58 350 62" stroke="url(#splashGrad)" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Tagline */}
      <text x="200" y="82" textAnchor="middle"
        style={{ fontFamily:'monospace', fontSize:'11px', fill:'rgba(255,255,255,0.45)', letterSpacing:'0.3em' }}
      >TINDER FOR MEMECOINS 🎰</text>
    </svg>
  );
}

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in'); // in | show | out

  useEffect(() => {
    // in → show at 400ms, show → out at 1800ms, out → done at 2300ms
    const t1 = setTimeout(() => setPhase('show'), 400);
    const t2 = setTimeout(() => setPhase('out'), 1900);
    const t3 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#080810',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 0.4s ease',
      opacity: phase === 'out' ? 0 : 1,
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 70%)',
        transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
        transform: phase === 'in' ? 'scale(0.3)' : 'scale(1)',
      }}/>

      {/* Logo container */}
      <div style={{
        padding: '0 32px',
        transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        transform: phase === 'in' ? 'scale(0.4) translateY(20px)' : phase === 'out' ? 'scale(1.08) translateY(-10px)' : 'scale(1) translateY(0)',
        opacity: phase === 'in' ? 0 : 1,
        filter: phase === 'show' ? 'drop-shadow(0 0 30px rgba(168,85,247,0.5))' : 'none',
      }}>
        <GraffitiLogo />
      </div>

      {/* Loading bar */}
      <div style={{
        position: 'absolute', bottom: 60,
        width: 120, height: 2,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 99, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 99,
          background: 'linear-gradient(90deg, #a855f7, #22d3ee)',
          animation: 'loadBar 1.8s ease-in-out forwards',
        }}/>
      </div>

      <style>{`
        @keyframes loadBar {
          0% { width: 0%; }
          60% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
