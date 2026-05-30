'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════
// DRAIN.FUN - Landing Page
// Clean. Two buttons. Human or AI. That's it.
// ═══════════════════════════════════════════════════════════════════

// Graffiti Logo Component
function GraffitiLogo() {
  return (
    <svg viewBox="0 0 400 80" className="w-full max-w-md h-auto">
      <defs>
        <linearGradient id="graffitiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Drips */}
      <path d="M45 55 Q45 75 43 85" stroke="#a855f7" strokeWidth="3" fill="none" opacity="0.6"/>
      <path d="M95 58 Q95 72 94 78" stroke="#06b6d4" strokeWidth="2" fill="none" opacity="0.5"/>
      <path d="M180 56 Q180 80 178 95" stroke="#22c55e" strokeWidth="4" fill="none" opacity="0.7"/>
      <path d="M290 55 Q290 68 289 74" stroke="#a855f7" strokeWidth="2" fill="none" opacity="0.4"/>
      <path d="M350 57 Q350 75 348 88" stroke="#06b6d4" strokeWidth="3" fill="none" opacity="0.6"/>
      
      {/* Main text */}
      <text x="200" y="50" textAnchor="middle" 
        style={{
          fontFamily: 'Impact, Haettenschweiler, sans-serif',
          fontSize: '52px',
          fontWeight: 'bold',
          fill: 'url(#graffitiGrad)',
          filter: 'url(#glow)',
          letterSpacing: '-2px'
        }}
      >
        DRAINFUN
      </text>
      
      {/* .xyz tag */}
      <text x="355" y="52" 
        style={{
          fontFamily: 'Impact, sans-serif',
          fontSize: '20px',
          fill: '#f59e0b',
          transform: 'rotate(-8deg)',
          transformOrigin: '355px 52px'
        }}
      >
        .xyz
      </text>
      
      {/* Outline for depth */}
      <text x="202" y="52" textAnchor="middle" 
        style={{
          fontFamily: 'Impact, Haettenschweiler, sans-serif',
          fontSize: '52px',
          fontWeight: 'bold',
          fill: 'none',
          stroke: 'rgba(0,0,0,0.5)',
          strokeWidth: '4px',
          letterSpacing: '-2px'
        }}
      >
        DRAINFUN
      </text>
      
      {/* Underline tag */}
      <path d="M50 62 Q200 58 350 62" stroke="url(#graffitiGrad)" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function HumanButton() {
  const [pressed, setPressed] = useState(false);
  
  return (
    <a
      href="/menu"
      className={`
        relative group
        w-64 h-32 
        flex flex-col items-center justify-center
        rounded-2xl
        border-2 border-green-500/50
        transition-all duration-200
        ${pressed ? 'scale-95' : 'hover:scale-105'}
        hover:border-green-400
        overflow-hidden
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)',
        boxShadow: '0 0 30px rgba(34,197,94,0.2), inset 0 0 20px rgba(34,197,94,0.05)',
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      {/* Icon */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-green-400 mb-2 group-hover:text-green-300 transition-colors">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
      </svg>
      
      {/* Text */}
      <span className="text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors tracking-wide">
        HUMAN
      </span>
      <span className="text-xs text-green-500/60 mt-1">
        click if you breathe
      </span>
      
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
           style={{ boxShadow: 'inset 0 0 40px rgba(34,197,94,0.3)' }} />
    </a>
  );
}

function AIButton() {
  const [pressed, setPressed] = useState(false);
  const [glitchFrame, setGlitchFrame] = useState(0);
  
  // XCOPY-style constant glitch animation
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchFrame(f => (f + 1) % 10);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  
  // Random glitch offsets
  const glitchX = (glitchFrame % 3 - 1) * 2;
  const glitchY = ((glitchFrame + 1) % 3 - 1);
  const rgbSplit = glitchFrame % 2 === 0 ? 3 : -3;
  
  return (
    <a
      href="/ai"
      className={`
        relative group
        w-64 h-32 
        flex flex-col items-center justify-center
        rounded-none
        border border-cyan-500
        transition-transform duration-100
        ${pressed ? 'scale-95' : 'hover:scale-105'}
        overflow-hidden
      `}
      style={{
        background: '#000',
        boxShadow: `
          0 0 20px rgba(0,255,255,0.3),
          inset 0 0 60px rgba(255,0,255,0.1),
          ${rgbSplit}px 0 0 rgba(255,0,0,0.5),
          ${-rgbSplit}px 0 0 rgba(0,255,255,0.5)
        `,
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      {/* Heavy scanlines - always on */}
      <div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
        }}
      />
      
      {/* Horizontal glitch bars */}
      <div 
        className="absolute left-0 right-0 h-2 pointer-events-none z-10"
        style={{
          top: `${20 + glitchFrame * 8}%`,
          background: 'linear-gradient(90deg, transparent 0%, #0ff 20%, #f0f 50%, #0ff 80%, transparent 100%)',
          opacity: 0.6,
          transform: `translateX(${glitchX * 3}px)`,
        }}
      />
      <div 
        className="absolute left-0 right-0 h-1 pointer-events-none z-10"
        style={{
          top: `${60 - glitchFrame * 5}%`,
          background: '#ff0',
          opacity: glitchFrame % 3 === 0 ? 0.8 : 0,
          mixBlendMode: 'difference',
        }}
      />
      
      {/* Flicker overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: glitchFrame % 4 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
        }}
      />
      
      {/* Icon with RGB split */}
      <div className="relative mb-2 z-10">
        {/* Red channel offset */}
        <svg viewBox="0 0 24 24" fill="none" stroke="#f00" strokeWidth="1.5" 
             className="w-10 h-10 absolute"
             style={{ transform: `translate(${rgbSplit}px, 0)`, opacity: 0.7 }}>
          <rect x="4" y="6" width="16" height="12" rx="0"/>
          <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="11" r="1.5" fill="currentColor"/>
          <path d="M9 15h6"/>
          <path d="M12 6V3"/>
        </svg>
        {/* Cyan channel offset */}
        <svg viewBox="0 0 24 24" fill="none" stroke="#0ff" strokeWidth="1.5" 
             className="w-10 h-10 absolute"
             style={{ transform: `translate(${-rgbSplit}px, 0)`, opacity: 0.7 }}>
          <rect x="4" y="6" width="16" height="12" rx="0"/>
          <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="11" r="1.5" fill="currentColor"/>
          <path d="M9 15h6"/>
          <path d="M12 6V3"/>
        </svg>
        {/* Main icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" 
             className="w-10 h-10 relative"
             style={{ transform: `translate(${glitchX}px, ${glitchY}px)` }}>
          <rect x="4" y="6" width="16" height="12" rx="0"/>
          <circle cx="9" cy="11" r="1.5" fill="currentColor"/>
          <circle cx="15" cy="11" r="1.5" fill="currentColor"/>
          <path d="M9 15h6"/>
          <path d="M12 6V3"/>
        </svg>
      </div>
      
      {/* XCOPY style text - harsh, glitchy */}
      <div className="relative z-10">
        {/* Red ghost */}
        <span 
          className="absolute text-2xl font-black tracking-[0.3em]"
          style={{ 
            color: '#f00',
            transform: `translate(${rgbSplit}px, 0)`,
            opacity: 0.7,
          }}
        >
          AI
        </span>
        {/* Cyan ghost */}
        <span 
          className="absolute text-2xl font-black tracking-[0.3em]"
          style={{ 
            color: '#0ff',
            transform: `translate(${-rgbSplit}px, 0)`,
            opacity: 0.7,
          }}
        >
          AI
        </span>
        {/* Main text */}
        <span 
          className="relative text-2xl font-black tracking-[0.3em] text-white"
          style={{ 
            transform: `translate(${glitchX}px, ${glitchY}px)`,
            textShadow: '0 0 10px #fff, 0 0 20px #0ff',
          }}
        >
          AI
        </span>
      </div>
      
      <span 
        className="text-xs mt-2 z-10 font-mono"
        style={{ 
          color: '#0ff',
          transform: `translateX(${glitchFrame % 2 === 0 ? 0 : -2}px)`,
          textShadow: '0 0 5px #0ff',
        }}
      >
        {glitchFrame % 5 === 0 ? 'CLiCK_1F_Y0U_C0MPUT3' : 'click if you compute'}
      </span>
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay"
        style={{
          opacity: 0.15,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Border flicker */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          border: glitchFrame % 3 === 0 ? '1px solid #f0f' : '1px solid #0ff',
          boxShadow: glitchFrame % 2 === 0 ? '0 0 10px #0ff' : '0 0 15px #f0f',
        }}
      />
    </a>
  );
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
             style={{ 
               background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
             }} />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full opacity-20"
             style={{ 
               background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
             }} />
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Logo — click to enter the ops layer */}
        <div className="mb-12 cursor-pointer group" onClick={() => window.location.href='/ops-gate'} title="">
          <div className="relative">
            <GraffitiLogo />
            {/* Invisible pulse — only visible if you know to look */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>
        </div>
        
        {/* Tagline */}
        <p className="text-gray-500 text-sm mb-12 tracking-widest uppercase">
          choose your path
        </p>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6">
          <HumanButton />
          <AIButton />
        </div>
        
        {/* Subtle hint */}
        <p className="text-gray-700 text-xs mt-12 opacity-60 hover:opacity-100 transition-opacity">
          〰️ where silicon meets carbon
        </p>

        {/* Hire link */}
        <a
          href="/work"
          className="mt-4 text-xs text-gray-700 hover:text-amber-500 transition-colors opacity-50 hover:opacity-100 font-mono tracking-wider"
        >
          hire →
        </a>
      </div>
      
      {/* Corner wave */}
      <div className="absolute bottom-4 right-4 text-gray-800 text-2xl">
        〰️
      </div>
    </main>
  );
}
