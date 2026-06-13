'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

// ─── CSS Matrix Rain ──────────────────────────────────────────────────────────
export function MatrixRain({ opacity = 1, style = {} }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const setSize = () => {
      const w = canvas.parentElement?.offsetWidth || window.innerWidth || 390;
      const h = canvas.parentElement?.offsetHeight || window.innerHeight || 844;
      canvas.width = w; canvas.height = h;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const fontSize = 14;
    let drops = Array.from({ length: Math.floor((canvas.width || 390) / fontSize) }, () => Math.random() * 60);
    const colors = ['#3b1a8e','#6b3fd4','#8b5ce8','#a855f7','#c084fc','#06b6d4','#22d3ee','#7c3aed'];
    const chars = '01アイウエ∂∑√∞≠∈01';
    let frame = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(4,2,15,0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        const y = drops[i] * fontSize;
        const bright = Math.random() > 0.92;
        ctx.fillStyle = bright ? '#e0cfff' : colors[(i + frame) % colors.length];
        ctx.font = `${bright ? 'bold ' : ''}${fontSize}px monospace`;
        ctx.globalAlpha = bright ? 0.95 : 0.7;
        ctx.fillText(ch, i * fontSize, y);
        ctx.globalAlpha = 1;
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.4 + Math.random() * 0.3;
      }
      frame++;
    };
    const interval = setInterval(draw, 40);
    return () => { clearInterval(interval); window.removeEventListener('resize', setSize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', opacity, ...style,
    }} />
  );
}

// ─── CSS fallback rain (for environments where canvas isn't painting) ─────────
function CSSRain({ opacity = 1 }) {
  const cols = 20;
  const chars = '01アイウエ∂∑√∞≠01';
  const palette = ['#a855f7','#9333ea','#c084fc','#06b6d4','#22d3ee','#7c3aed','#8b5ce8'];

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none', opacity, transition:'opacity 0.6s ease' }}>
      {Array.from({ length: cols }, (_, col) => {
        const delay   = (-Math.random() * 5).toFixed(2);
        const dur     = (3.5 + Math.random() * 4).toFixed(2);
        const left    = (col / cols * 100 + Math.random() * 2).toFixed(1);
        const color   = palette[col % palette.length];
        const numRows = 14 + Math.floor(Math.random() * 10);
        return (
          <div key={col} style={{
            position:'absolute', left:`${left}%`, top:0,
            display:'flex', flexDirection:'column', gap:2,
            animation:`cssRainFall ${dur}s ${delay}s linear infinite`,
            willChange:'transform',
          }}>
            {Array.from({ length: numRows }, (_, row) => (
              <span key={row} style={{
                fontFamily:'monospace', fontSize:13, lineHeight:'16px', display:'block',
                color: row === 0 ? '#e0cfff' : color,
                opacity: row === 0 ? 1 : 0.3 + (row / numRows) * 0.5,
                textShadow: row === 0 ? `0 0 8px ${color}` : `0 0 4px ${color}`,
                fontWeight: row === 0 ? 'bold' : 'normal',
              }}>
                {chars[Math.floor(Math.random() * chars.length)]}
              </span>
            ))}
          </div>
        );
      })}
      <style>{`@keyframes cssRainFall{0%{transform:translateY(-120vh)}100%{transform:translateY(110vh)}}`}</style>
    </div>
  );
}

// ─── Logo — Impact gradient, same as old-landing ─────────────────────────────
function BubbleLogo() {
  return (
    <div style={{ position:'relative', userSelect:'none', textAlign:'center' }}>
      {/* DRAINFUN — one line, Impact, gradient */}
      <div style={{
        fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif',
        fontSize: 'clamp(64px, 19vw, 82px)',
        fontWeight: 900,
        letterSpacing: '-3px',
        lineHeight: 1,
        background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 50%, #22c55e 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: 'drop-shadow(0 0 22px rgba(168,85,247,0.6)) drop-shadow(0 0 50px rgba(6,182,212,0.25))',
      }}>
        DRAINFUN
      </div>

      {/* .xyz tag */}
      <div style={{
        fontFamily: 'Impact, sans-serif',
        fontSize: 28,
        color: '#f59e0b',
        letterSpacing: '-1px',
        marginTop: -6,
        textAlign: 'right',
        paddingRight: 10,
        display: 'block',
        filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.7))',
        transform: 'rotate(-3deg)',
      }}>
        .xyz
      </div>
    </div>
  );
}

// ─── XCOPY Glitch Loading Bar ─────────────────────────────────────────────────
function GlitchBar({ progress }) {
  const [glitch, setGlitch] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setGlitch(g => (g + 1) % 8), 90);
    return () => clearInterval(id);
  }, []);

  const rgbShift = glitch % 2 === 0 ? 3 : -2;
  const scanY = (glitch * 14) % 100;

  return (
    <div style={{ position:'relative', width: '72vw', maxWidth: 300 }}>
      {/* Track */}
      <div style={{
        height: 18,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(168,85,247,0.4)',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: glitch % 3 === 0 ? '0 0 12px rgba(168,85,247,0.6), 0 0 24px rgba(6,182,212,0.2)' : '0 0 8px rgba(168,85,247,0.4)',
      }}>
        {/* Scanline */}
        <div style={{
          position:'absolute', left:0, right:0, height:2,
          top:`${scanY}%`, background:'rgba(255,255,255,0.12)',
          pointerEvents:'none',
        }}/>
        {/* Fill — red ghost */}
        <div style={{
          position:'absolute', top:0, left:0, height:'100%',
          width:`${progress}%`,
          background:'rgba(255,0,0,0.4)',
          transform:`translateX(${rgbShift}px)`,
          transition:'width 0.3s ease',
        }}/>
        {/* Fill — cyan ghost */}
        <div style={{
          position:'absolute', top:0, left:0, height:'100%',
          width:`${progress}%`,
          background:'rgba(0,255,255,0.3)',
          transform:`translateX(${-rgbShift}px)`,
          transition:'width 0.3s ease',
        }}/>
        {/* Main fill */}
        <div style={{
          position:'absolute', top:0, left:0, height:'100%',
          width:`${progress}%`,
          background: 'linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4)',
          boxShadow: '2px 0 12px rgba(168,85,247,0.8)',
          transition: 'width 0.35s cubic-bezier(0.25,1,0.5,1)',
        }}/>
        {/* Block pattern overlay */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background:'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(0,0,0,0.25) 18px, rgba(0,0,0,0.25) 20px)',
          mixBlendMode:'overlay',
        }}/>
      </div>

      {/* RGB-split label */}
      <div style={{ marginTop:6, position:'relative', height:14 }}>
        <span style={{
          position:'absolute', left:'50%', transform:'translateX(-50%)',
          fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em',
          color:'#f00', opacity:0.6,
          marginLeft: rgbShift,
        }}>LOADING</span>
        <span style={{
          position:'absolute', left:'50%', transform:'translateX(-50%)',
          fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em',
          color:'#0ff', opacity:0.6,
          marginLeft: -rgbShift,
        }}>LOADING</span>
        <span style={{
          position:'absolute', left:'50%', transform:'translateX(-50%)',
          fontFamily:'monospace', fontSize:10, letterSpacing:'0.2em',
          color:'#fff', opacity:0.8,
        }}>{glitch % 5 === 0 ? 'L04D1NG' : 'LOADING'} {Math.round(progress)}%</span>
      </div>
    </div>
  );
}

// ─── Typewriter — shorter, punchy, fast ─────────────────────────────────────
function TypeWriter({ onDone }) {
  const text = 'DRAIN THE MATRIX_';
  const [displayed, setDisplayed] = useState('');
  const [cursor, setCursor] = useState(true);
  const [colorIdx, setColorIdx] = useState(0);
  const colors = ['#c084fc', '#a855f7', '#22d3ee', '#06b6d4', '#c084fc'];
  const glows = [
    '0 0 18px rgba(192,132,252,0.9), 0 0 50px rgba(168,85,247,0.5)',
    '0 0 18px rgba(168,85,247,0.9), 0 0 50px rgba(6,182,212,0.4)',
    '0 0 18px rgba(34,211,238,0.9), 0 0 50px rgba(168,85,247,0.4)',
  ];

  useEffect(() => {
    const cycle = setInterval(() => setColorIdx(i => (i + 1) % colors.length), 400);
    return () => clearInterval(cycle);
  }, []);

  useEffect(() => {
    let i = 0;
    const type = () => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
        setTimeout(type, 38 + Math.random() * 42);
      } else {
        let blinks = 0;
        const blink = setInterval(() => {
          setCursor(c => !c);
          if (++blinks > 3) {
            clearInterval(blink);
            onDone();
          }
        }, 200);
      }
    };
    const startDelay = setTimeout(type, 80);
    return () => clearTimeout(startDelay);
  }, [onDone]);

  return (
    <div style={{
      fontFamily: 'Impact, "Arial Narrow Bold", sans-serif',
      fontSize: 'clamp(22px, 6vw, 30px)',
      color: colors[colorIdx % colors.length],
      letterSpacing: '0.18em',
      textShadow: glows[colorIdx % glows.length],
      whiteSpace: 'nowrap',
      minHeight: '1.4em',
      transition: 'color 0.3s ease, text-shadow 0.3s ease',
    }}>
      {displayed}{cursor ? '█' : ' '}
    </div>
  );
}

// ─── Main SplashScreen ────────────────────────────────────────────────────────
// Props:
//   onDone  — called when splash is fully done
//   ready   — boolean, true when app data is preloaded
export default function SplashScreen({ onDone, ready = false }) {
  // phase: 'logo' → 'matrix' → 'out'
  const [phase, setPhase] = useState('logo');
  // Loading progress (0–100), driven by ready prop + time
  const [progress, setProgress] = useState(0);
  const minLogoTime = useRef(false);
  const readyRef = useRef(ready);
  // Track zoom state for exit animation
  const [rainZoom, setRainZoom] = useState(false);

  useEffect(() => { readyRef.current = ready; }, [ready]);

  // Fake-progress ticker: crawls to 85%, rushes to 100 when ready
  useEffect(() => {
    let val = 0;
    const tick = setInterval(() => {
      if (readyRef.current) {
        val = Math.min(100, val + 12); // faster rush
      } else {
        const gap = 85 - val;
        val = Math.min(85, val + Math.max(0.8, gap * 0.06)); // faster crawl
      }
      setProgress(Math.round(val));
      if (val >= 100) clearInterval(tick);
    }, 60); // faster tick
    return () => clearInterval(tick);
  }, []);

  // Minimum logo display reduced to 800ms
  useEffect(() => {
    const minTimer = setTimeout(() => { minLogoTime.current = true; }, 800);
    return () => clearTimeout(minTimer);
  }, []);

  // Transition to matrix phase when progress hits 100
  useEffect(() => {
    if (progress >= 100 && phase === 'logo') {
      setTimeout(() => setPhase('matrix'), 180);
    }
  }, [progress, phase]);

  // Hard timeout: max 4s total
  useEffect(() => {
    const hard = setTimeout(() => {
      if (phase === 'logo') setPhase('matrix');
    }, 4000);
    return () => clearTimeout(hard);
  }, []);

  const handleTypeDone = useCallback(() => {
    // Trigger rain zoom-in then exit
    setRainZoom(true);
    setTimeout(() => {
      setPhase('out');
      setTimeout(onDone, 380);
    }, 420);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#04020f',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      transition: 'opacity 0.38s ease',
      opacity: phase === 'out' ? 0 : 1,
    }}>
      {/* Rain layer — zooms forward on exit, covers everything */}
      <div style={{
        position:'absolute', inset:0,
        zIndex: rainZoom ? 10 : (phase === 'logo' ? 0 : 1),
        transform: rainZoom ? 'scale(1.8)' : 'scale(1)',
        transition: 'transform 0.42s cubic-bezier(0.2,0,0.4,1), opacity 0.42s ease',
        opacity: rainZoom ? 1 : (phase === 'logo' ? 0.55 : 1),
        pointerEvents:'none',
        transformOrigin:'center center',
        overflow:'hidden',
      }}>
        <CSSRain opacity={1} />
      </div>

      {/* Dark overlay that intensifies on exit */}
      {rainZoom && (
        <div style={{
          position:'absolute', inset:0, zIndex:9,
          background:'rgba(0,0,0,0.75)',
          transition:'opacity 0.4s ease',
        }}/>
      )}

      {/* Radial glow behind logo */}
      <div style={{
        position:'absolute', width:360, height:360, borderRadius:'50%',
        background:'radial-gradient(ellipse, rgba(168,85,247,0.3) 0%, rgba(6,182,212,0.1) 55%, transparent 75%)',
        filter:'blur(22px)', pointerEvents:'none', zIndex:2,
        transition:'opacity 0.5s ease',
        opacity: phase === 'logo' ? 1 : 0,
      }}/>

      {/* ── LOGO PHASE ── */}
      <div style={{
        position:'relative', zIndex:3,
        display:'flex', flexDirection:'column', alignItems:'center', gap:28,
        transition:'opacity 0.4s ease, transform 0.4s ease',
        opacity: phase === 'logo' ? 1 : 0,
        transform: phase === 'logo' ? 'scale(1) translateY(0)' : 'scale(1.08) translateY(-20px)',
        pointerEvents: 'none',
      }}>
        <BubbleLogo />
        <GlitchBar progress={progress} />
      </div>

      {/* ── MATRIX PHASE ── */}
      <div style={{
        position:'absolute', zIndex:4,
        textAlign:'center',
        transition:'opacity 0.35s ease',
        opacity: phase === 'matrix' && !rainZoom ? 1 : 0,
        pointerEvents: 'none',
      }}>
        {phase === 'matrix' && <TypeWriter onDone={handleTypeDone} />}
      </div>
    </div>
  );
}
