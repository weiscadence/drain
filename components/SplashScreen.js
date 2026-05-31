'use client';
import { useState, useEffect, useCallback } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('in');

  const done = useCallback(() => onDone(), [onDone]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 200);
    const t2 = setTimeout(() => setPhase('out'), 2000);
    const t3 = setTimeout(done, 2450);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [done]);

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'#080810',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      transition:'opacity 0.4s ease',
      opacity: phase === 'out' ? 0 : 1,
    }}>
      {/* Background glow */}
      <div style={{
        position:'absolute', width:320, height:320, borderRadius:'50%',
        background:'radial-gradient(ellipse, rgba(168,85,247,0.2) 0%, transparent 70%)',
        transition:'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        transform: phase === 'in' ? 'scale(0)' : 'scale(1)',
        pointerEvents:'none',
      }}/>

      {/* Logo — clean crisp text, no SVG blur */}
      <div style={{
        textAlign:'center',
        transition:'all 0.45s cubic-bezier(0.34,1.56,0.64,1)',
        transform: phase === 'in' ? 'scale(0.6) translateY(16px)' : phase === 'out' ? 'scale(1.05) translateY(-8px)' : 'scale(1) translateY(0)',
        opacity: phase === 'in' ? 0 : 1,
      }}>
        {/* DRAINFUN — big Impact font */}
        <div style={{
          fontFamily:'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
          fontSize:72,
          fontWeight:900,
          letterSpacing:'-3px',
          lineHeight:1,
          background:'linear-gradient(135deg, #a855f7 0%, #06b6d4 50%, #22c55e 100%)',
          WebkitBackgroundClip:'text',
          WebkitTextFillColor:'transparent',
          backgroundClip:'text',
          filter:'drop-shadow(0 0 20px rgba(168,85,247,0.5))',
        }}>
          DRAINFUN
        </div>

        {/* .xyz — amber, slightly rotated, tight to the right */}
        <div style={{
          fontFamily:'Impact, sans-serif',
          fontSize:28,
          color:'#f59e0b',
          letterSpacing:'-1px',
          marginTop:-6,
          textAlign:'right',
          paddingRight:8,
          filter:'drop-shadow(0 0 10px rgba(245,158,11,0.6))',
          transform:'rotate(-3deg)',
          display:'block',
        }}>
          .xyz
        </div>

        {/* Tagline */}
        <div style={{
          marginTop:16,
          fontFamily:'JetBrains Mono, monospace',
          fontSize:11,
          color:'rgba(255,255,255,0.4)',
          letterSpacing:'0.35em',
          textTransform:'uppercase',
        }}>
          Tinder for Memecoins 🎰
        </div>
      </div>

      {/* Loading bar */}
      <div style={{
        position:'absolute', bottom:56,
        width:100, height:2,
        background:'rgba(255,255,255,0.07)',
        borderRadius:99, overflow:'hidden',
      }}>
        <div style={{
          height:'100%', borderRadius:99,
          background:'linear-gradient(90deg, #a855f7, #22d3ee)',
          animation:'loadBar 2s ease-in-out forwards',
        }}/>
      </div>

      <style>{`@keyframes loadBar{0%{width:0%}70%{width:75%}100%{width:100%}}`}</style>
    </div>
  );
}
