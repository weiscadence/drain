'use client';
import { useState, useRef, useEffect } from 'react';

// ── SPIN WHEEL — x2 or Nothing ───────────────────────────
// 8 alternating sections: 4x "x2 🚀" and 4x "NOTHING 💀"
// Pure CSS animation — no canvas needed

const SEGMENTS = [
  { label: 'x2 🚀', win: true, color: '#00ff88' },
  { label: 'NOTHING\n💀', win: false, color: '#ff4444' },
  { label: 'x2 🚀', win: true, color: '#00ff88' },
  { label: 'NOTHING\n💀', win: false, color: '#ff4444' },
  { label: 'x2 🚀', win: true, color: '#00ff88' },
  { label: 'NOTHING\n💀', win: false, color: '#ff4444' },
  { label: 'x2 🚀', win: true, color: '#00ff88' },
  { label: 'NOTHING\n💀', win: false, color: '#ff4444' },
];

export default function SpinWheel({ onResult, solAmount }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState(null); // {win, label}
  const [finalAngle, setFinalAngle] = useState(0);
  const wheelRef = useRef(null);

  const spin = () => {
    if (spinning || result) return;
    setSpinning(true);
    setResult(null);

    // Determine outcome first (50/50)
    const win = Math.random() < 0.5;
    // Pick a segment index matching outcome
    const matchingSegments = SEGMENTS.map((s,i) => ({...s, i})).filter(s => s.win === win);
    const chosen = matchingSegments[Math.floor(Math.random() * matchingSegments.length)];
    const segSize = 360 / SEGMENTS.length; // 45 degrees each
    // Target angle: land on chosen segment center
    const targetSegCenter = chosen.i * segSize + segSize / 2;
    // Add 5-8 full rotations for drama
    const spins = 5 + Math.floor(Math.random() * 3);
    const newAngle = rotation + (spins * 360) + (360 - targetSegCenter);
    
    setFinalAngle(newAngle);
    setRotation(newAngle);

    setTimeout(() => {
      setSpinning(false);
      setResult({ win, label: chosen.label });
      setTimeout(() => {
        onResult(win);
      }, 1500);
    }, 3000);
  };

  const size = 260;
  const center = size / 2;
  const radius = center - 4;
  const segCount = SEGMENTS.length;
  const segAngle = (2 * Math.PI) / segCount;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, padding:'8px 0' }}>
      {/* Pointer */}
      <div style={{ position:'relative', width:size, height:size }}>
        {/* Pointer triangle at top */}
        <div style={{
          position:'absolute', top:-8, left:'50%', transform:'translateX(-50%)',
          width:0, height:0,
          borderLeft:'12px solid transparent',
          borderRight:'12px solid transparent',
          borderTop:'20px solid #ffc800',
          zIndex:10,
          filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }}/>

        {/* Wheel SVG */}
        <svg
          ref={wheelRef}
          width={size} height={size}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? `transform 3s cubic-bezier(0.17, 0.67, 0.12, 1)` : 'none',
            filter:'drop-shadow(0 0 20px rgba(168,85,247,0.4))',
          }}
        >
          {SEGMENTS.map((seg, i) => {
            const startAngle = i * segAngle - Math.PI / 2;
            const endAngle = startAngle + segAngle;
            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);
            const midAngle = startAngle + segAngle / 2;
            const textR = radius * 0.65;
            const tx = center + textR * Math.cos(midAngle);
            const ty = center + textR * Math.sin(midAngle);
            const textDeg = (midAngle * 180 / Math.PI) + 90;

            return (
              <g key={i}>
                <path
                  d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                  fill={seg.color}
                  stroke="#080810"
                  strokeWidth="2"
                  opacity={seg.win ? 0.9 : 0.75}
                />
                <text
                  x={tx} y={ty}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textDeg}, ${tx}, ${ty})`}
                  style={{ fontSize: seg.win ? '12px' : '10px', fontWeight:'900', fill:'#000', fontFamily:'monospace' }}
                >
                  {seg.win ? 'x2 🚀' : '💀'}
                </text>
              </g>
            );
          })}
          {/* Center circle */}
          <circle cx={center} cy={center} r={24} fill="#080810" stroke="#a855f7" strokeWidth="2"/>
          <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" style={{ fontSize:'16px', fill:'#a855f7' }}>🎰</text>
        </svg>
      </div>

      {/* Result display */}
      {result && (
        <div style={{
          textAlign:'center',
          animation:'resultPop 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          {result.win ? (
            <div>
              <div style={{ fontSize:32, marginBottom:4 }}>🚀🚀🚀</div>
              <div style={{ fontSize:22, fontWeight:900, color:'#00ff88', fontFamily:'JetBrains Mono, monospace', textShadow:'0 0 20px #00ff88' }}>x2 BABY!</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontFamily:'monospace', marginTop:4 }}>buying {(solAmount*2).toFixed(2)} SOL worth fr fr</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:32, marginBottom:4, animation:'wobble 0.3s infinite alternate' }}>😭😭😭</div>
              <div style={{ fontSize:22, fontWeight:900, color:'#ff4444', fontFamily:'JetBrains Mono, monospace', textShadow:'0 0 20px #ff4444' }}>NOTHING 💀</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'monospace', marginTop:4 }}>rugged by the wheel lmao</div>
            </div>
          )}
        </div>
      )}

      {/* Spin button */}
      {!result && (
        <button
          onClick={spin}
          disabled={spinning}
          style={{
            padding:'14px 40px',
            borderRadius:16,
            background: spinning ? 'rgba(255,200,0,0.1)' : 'linear-gradient(135deg, #ffc800, #ff6600)',
            border:'none',
            color: spinning ? '#ffc800' : '#000',
            fontSize:16, fontWeight:900, cursor: spinning ? 'default':'pointer',
            fontFamily:'JetBrains Mono, monospace',
            boxShadow: spinning ? 'none' : '0 4px 20px rgba(255,200,0,0.4)',
            animation: spinning ? 'none' : 'spinBtnPulse 1.5s ease-in-out infinite',
            letterSpacing:1,
          }}
        >
          {spinning ? '⋯ spinning...' : '🎰 SPIN IT'}
        </button>
      )}

      <style>{`
        @keyframes resultPop { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }
        @keyframes wobble { from { transform:rotate(-8deg); } to { transform:rotate(8deg); } }
        @keyframes spinBtnPulse { 0%,100% { box-shadow:0 4px 20px rgba(255,200,0,0.4); } 50% { box-shadow:0 4px 40px rgba(255,200,0,0.8), 0 0 60px rgba(255,100,0,0.3); } }
      `}</style>
    </div>
  );
}
