'use client';

import { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════
// WEIS — The House
// Modern wizard streetwear. Sacred geometry. Dark matter energy.
// Not for everyone. That's the point.
// ═══════════════════════════════════════════════════════════════════

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes rotateReverse {
    from { transform: rotate(0deg); }
    to   { transform: rotate(-360deg); }
  }
  @keyframes symbolFloat {
    0%,100% { transform: translateY(0px) scale(1); }
    50%      { transform: translateY(-12px) scale(1.02); }
  }
  @keyframes innerGlow {
    0%,100% { opacity: .5; }
    50%      { opacity: 1; }
  }
  @keyframes grain {
    0%,100% { transform: translate(0,0); }
    10%     { transform: translate(-1px,1px); }
    20%     { transform: translate(1px,-1px); }
    30%     { transform: translate(-2px,0); }
    40%     { transform: translate(1px,1px); }
    50%     { transform: translate(-1px,-2px); }
    60%     { transform: translate(2px,0); }
    70%     { transform: translate(-1px,2px); }
    80%     { transform: translate(1px,-1px); }
    90%     { transform: translate(-2px,1px); }
  }
  @keyframes ascend {
    0%   { opacity:0; transform:translateY(0) scale(1) rotate(var(--r)); }
    10%  { opacity:.7; }
    90%  { opacity:.1; }
    100% { opacity:0; transform:translateY(-250px) scale(.4) rotate(calc(var(--r) + 180deg)); }
  }
  @keyframes revealFade {
    from { opacity:0; transform:translateY(20px) letterSpacing:1em; }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes lineExpand {
    from { transform:scaleX(0); }
    to   { transform:scaleX(1); }
  }
  @keyframes breathe {
    0%,100% { opacity:.04; transform:scale(1); }
    50%     { opacity:.08; transform:scale(1.02); }
  }
  @keyframes dropReveal {
    from { opacity:0; transform:translateX(-10px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes pulseRing {
    0%   { transform:scale(1); opacity:.3; }
    100% { transform:scale(2); opacity:0; }
  }
  @keyframes scrollDot {
    0%,100% { transform:translateY(0); opacity:.4; }
    50%     { transform:translateY(8px); opacity:.9; }
  }
`;

// ── The Seal — rotating sacred geometry mark ─────────────────────
function WeisSeal({ size = 280 }) {
  return (
    <div style={{
      position: 'relative',
      width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'symbolFloat 6s ease-in-out infinite',
    }}>
      {/* Outer ring — slow rotate */}
      <svg
        style={{
          position: 'absolute', inset: 0,
          animation: 'rotateSlow 40s linear infinite',
        }}
        viewBox="0 0 280 280" width={size} height={size}
      >
        {/* Outer circle */}
        <circle cx="140" cy="140" r="135" fill="none" stroke="rgba(212,175,55,0.25)" strokeWidth=".8"/>
        {/* Tick marks */}
        {Array.from({length: 36}, (_, i) => {
          const a = (i * 10) * Math.PI / 180;
          const r1 = 130, r2 = i % 3 === 0 ? 122 : 126;
          return (
            <line key={i}
              x1={140 + Math.cos(a) * r1} y1={140 + Math.sin(a) * r1}
              x2={140 + Math.cos(a) * r2} y2={140 + Math.sin(a) * r2}
              stroke="rgba(212,175,55,0.35)" strokeWidth={i % 9 === 0 ? 1.2 : .6}
            />
          );
        })}
        {/* Rune text around ring */}
        {['W','E','I','S','·','R','E','T','U','R','N','·','T','O','·','S','E','N','D','E','R','·'].map((ch, i) => {
          const a = (i * (360/22) - 90) * Math.PI / 180;
          const r = 118;
          return (
            <text key={i}
              x={140 + Math.cos(a) * r}
              y={140 + Math.sin(a) * r}
              textAnchor="middle" dominantBaseline="middle"
              fontSize="9" fill="rgba(212,175,55,0.4)"
              fontFamily="ui-monospace,monospace"
              transform={`rotate(${i * (360/22)}, ${140 + Math.cos(a) * r}, ${140 + Math.sin(a) * r})`}
            >{ch}</text>
          );
        })}
      </svg>

      {/* Middle ring — reverse rotate */}
      <svg
        style={{
          position: 'absolute', inset: 0,
          animation: 'rotateReverse 25s linear infinite',
        }}
        viewBox="0 0 280 280" width={size} height={size}
      >
        {/* Flower of life inner circles */}
        {[0,60,120,180,240,300].map((deg, i) => {
          const rad = deg * Math.PI / 180;
          return (
            <circle key={i}
              cx={140 + Math.cos(rad) * 44} cy={140 + Math.sin(rad) * 44}
              r={44} fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth=".8"
            />
          );
        })}
        <circle cx="140" cy="140" r="44" fill="none" stroke="rgba(212,175,55,0.12)" strokeWidth=".8"/>
        {/* Second ring */}
        <circle cx="140" cy="140" r="88" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth=".6"/>
        {/* Triangle points */}
        <polygon
          points={[0,120,240].map(a => {
            const r = a * Math.PI / 180;
            return `${140 + Math.cos(r) * 80},${140 + Math.sin(r) * 80}`;
          }).join(' ')}
          fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth=".8"
        />
        <polygon
          points={[60,180,300].map(a => {
            const r = a * Math.PI / 180;
            return `${140 + Math.cos(r) * 80},${140 + Math.sin(r) * 80}`;
          }).join(' ')}
          fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth=".8"
        />
      </svg>

      {/* Center — static */}
      <svg
        style={{ position: 'absolute', inset: 0 }}
        viewBox="0 0 280 280" width={size} height={size}
      >
        {/* Center glow */}
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(212,175,55,0.15)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <circle cx="140" cy="140" r="50" fill="url(#centerGlow)"/>

        {/* W — large, elegant, center */}
        <text
          x="140" y="148"
          textAnchor="middle" dominantBaseline="middle"
          fontFamily='"Cormorant Garamond",Georgia,serif'
          fontWeight="300"
          fontSize="52"
          fill="rgba(232,224,208,0.9)"
          style={{ animation: 'innerGlow 4s ease-in-out infinite' }}
        >W</text>

        {/* Center dot */}
        <circle cx="140" cy="140" r="3" fill="rgba(212,175,55,0.6)"/>

        {/* Pulse rings */}
        {[1,2,3].map(i => (
          <circle key={i}
            cx="140" cy="140" r="20"
            fill="none" stroke="rgba(212,175,55,0.15)"
            style={{
              animation: `pulseRing ${3 + i}s ${i * 1.2}s ease-out infinite`,
              transformOrigin: '140px 140px',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// ── Floating particles ────────────────────────────────────────────
function Particles() {
  const count = 12;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {Array.from({length: count}, (_, i) => {
        const rotation = Math.random() * 360;
        const left = 5 + Math.random() * 90;
        const delay = Math.random() * 15;
        const dur = 12 + Math.random() * 12;
        const isGold = i % 3 !== 0;
        return (
          <div key={i} style={{
            position: 'absolute',
            bottom: '5%',
            left: `${left}%`,
            width: 1 + Math.random() * 2,
            height: 1 + Math.random() * 2,
            borderRadius: '50%',
            background: isGold ? 'rgba(212,175,55,0.6)' : 'rgba(140,200,255,0.4)',
            animation: `ascend ${dur}s ${delay}s linear infinite`,
            transform: `rotate(${rotation}deg)`,
          }} />
        );
      })}
    </div>
  );
}

// ── Film grain overlay ────────────────────────────────────────────
function Grain() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
      opacity: 0.6,
      mixBlendMode: 'overlay',
      animation: 'grain .15s steps(1) infinite',
    }} />
  );
}

// ── Drop item ─────────────────────────────────────────────────────
function Drop({ d, i, hov, setHov }) {
  const active = hov === i;
  return (
    <div
      onMouseEnter={() => setHov(i)}
      onMouseLeave={() => setHov(null)}
      style={{
        padding: '30px 0',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        cursor: 'default',
        animation: `dropReveal .7s ${i * .08}s ease-out both`,
        opacity: 0,
      }}
    >
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Number */}
        <div style={{
          fontFamily: '"Cormorant Garamond",Georgia,serif',
          fontSize: 13, fontStyle: 'italic',
          color: 'rgba(212,175,55,0.4)',
          minWidth: 36, paddingTop: 3, fontWeight: 300,
          letterSpacing: '.1em',
        }}>{d.n}</div>

        <div style={{ flex: 1 }}>
          {/* Name + status */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 10, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: '"Cormorant Garamond",Georgia,serif',
              fontSize: 'clamp(17px,2vw,21px)',
              fontWeight: 300, letterSpacing: '.05em',
              color: active ? '#fff' : 'rgba(235,228,215,.85)',
              transition: 'color .25s',
            }}>{d.name}</span>

            <span style={{
              fontFamily: 'ui-monospace,monospace',
              fontSize: 8, letterSpacing: '.35em',
              padding: '2px 9px',
              color: d.soon ? 'rgba(212,175,55,.6)' : 'rgba(140,180,255,.5)',
              border: `1px solid ${d.soon ? 'rgba(212,175,55,.2)' : 'rgba(140,180,255,.2)'}`,
            }}>{d.soon ? 'COMING SOON' : 'CONCEPT'}</span>

            {d.qty && <span style={{
              fontFamily: 'ui-monospace,monospace',
              fontSize: 8, letterSpacing: '.2em',
              color: 'rgba(255,255,255,.15)',
            }}>{d.qty} pieces</span>}
          </div>

          {/* Description */}
          <p style={{
            fontFamily: '"Cormorant Garamond",Georgia,serif',
            fontSize: 15, fontStyle: 'italic',
            color: 'rgba(230,222,208,.45)',
            lineHeight: 1.9, maxWidth: 540, marginBottom: 8,
          }}>{d.desc}</p>

          {/* Detail */}
          <div style={{
            fontFamily: 'ui-monospace,monospace',
            fontSize: 9, letterSpacing: '.1em',
            color: 'rgba(255,255,255,.15)',
          }}>{d.detail}</div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default function WeisPage() {
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState(null);

  useEffect(() => { const t = setTimeout(() => setVis(true), 100); return () => clearTimeout(t); }, []);

  const drops = [
    {
      n: '001', name: 'The Return to Sender Hoodie', soon: true, qty: 44,
      desc: '400gsm heavyweight black fleece. The tribal flame design ice-printed on the chest. Turquoise stone pendant hanging from the drawstring. Oversized. One size. This is the one.',
      detail: 'heavyweight fleece · iced print · turquoise pendant · brass loop · 44 pieces',
    },
    {
      n: '002', name: 'The Open Hand Shirt', soon: true, qty: 66,
      desc: 'Coral boxy tee. The palm print all-over — eye in the lips socket, two white spotted snakes curling outward. Back reads: Return What Is Not Mine. Screen printed four colors.',
      detail: '300gsm ringspun · 4-color screen · unisex · numbered · 66 pieces',
    },
    {
      n: '003', name: 'The Pendleton Throw', soon: true, qty: 33,
      desc: 'The blanket the hoodie rests on. Teal, red, orange, brown. Heavy wool blend, traditional geometric. WEIS woven label. Comes folded with a stick of palo santo tucked inside.',
      detail: 'wool blend · 60"×72" · WEIS label · with palo santo · 33 pieces',
    },
    {
      n: '004', name: 'The Altar Kit', soon: true, qty: 55,
      desc: 'Sagrado Corazón candle. Florida Water in amber glass. Palo santo bundle, white-cord tied. Malachite, tiger\'s eye, turquoise. Brass bell. Everything already on your altar, assembled and sent.',
      detail: 'cedar box · brass hardware · ethically sourced · numbered · 55 kits',
    },
    {
      n: '005', name: 'The Ethiopian Headrest', soon: true, qty: 22,
      desc: 'Carved rosewood. Pillar form. Geometric striations on the base. Each one sourced individually, slightly different. For sleep, for ceremony, for the altar. Comes with provenance card.',
      detail: 'hand-carved rosewood · ethically traded · provenance card · 22 pieces',
    },
    {
      n: '006', name: 'The Golconda Jacket', soon: false,
      desc: 'Vermillion satin bomber. Back: Islamic geometric arch embroidered in aged gold — the Golconda energy. Pendleton-pattern red silk lining. The whole room in a jacket.',
      detail: 'satin shell · gold embroidery · Pendleton silk lining · made to order',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#060408', color: '#ebe5d8', position: 'relative', overflowX: 'hidden' }}>
      <style>{CSS}</style>
      <Particles />
      <Grain />

      {/* Background sacred geometry — very faint */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        animation: 'breathe 10s ease-in-out infinite',
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(212,175,55,0.03) 0%, transparent 60%),
          radial-gradient(circle at 20% 80%, rgba(80,140,255,0.02) 0%, transparent 40%),
          radial-gradient(circle at 80% 20%, rgba(212,175,55,0.02) 0%, transparent 40%)
        `,
      }} />

      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60,
        padding: '20px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(to bottom, rgba(6,4,8,.97) 0%, transparent 100%)',
      }}>
        <a href="/" style={{
          fontFamily: 'ui-monospace,monospace', fontSize: 9,
          letterSpacing: '.4em', color: 'rgba(235,229,216,.2)',
          textDecoration: 'none',
        }}>← DRAIN.FUN</a>
        <a href="/freq" style={{
          fontFamily: 'ui-monospace,monospace', fontSize: 9,
          letterSpacing: '.4em', color: 'rgba(235,229,216,.2)',
          textDecoration: 'none',
        }}>FREQ →</a>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px',
        textAlign: 'center',
        position: 'relative', zIndex: 10,
      }}>
        {/* The Seal */}
        <div style={{ opacity: vis ? 1 : 0, transition: 'opacity 2s ease', marginBottom: 40 }}>
          <WeisSeal size={260} />
        </div>

        {/* WEIS */}
        <h1 style={{
          fontFamily: '"Cormorant Garamond",Georgia,serif',
          fontSize: 'clamp(80px,15vw,150px)',
          fontWeight: 300, letterSpacing: '.45em',
          lineHeight: 1, color: '#ebe5d8',
          animation: vis ? 'revealFade 1.4s .5s ease-out both' : 'none',
          opacity: 0,
          marginBottom: 24,
        }}>WEIS</h1>

        {/* Gold line */}
        <div style={{
          width: 60, height: 1,
          background: 'rgba(212,175,55,.4)',
          animation: vis ? 'lineExpand 1s 1.2s ease-out both' : 'none',
          transform: 'scaleX(0)',
          marginBottom: 20,
        }} />

        {/* Sanskrit line */}
        <p style={{
          fontFamily: '"Cormorant Garamond",Georgia,serif',
          fontSize: 16, fontStyle: 'italic',
          color: 'rgba(212,175,55,.55)',
          letterSpacing: '.12em',
          animation: vis ? 'revealFade 1s 1.5s ease-out both' : 'none',
          opacity: 0,
          marginBottom: 12,
        }}>श्री राधा &mdash; the house, the temple, the world</p>

        <p style={{
          fontFamily: 'ui-monospace,monospace',
          fontSize: 9, letterSpacing: '.5em',
          color: 'rgba(235,229,216,.18)',
          animation: vis ? 'revealFade 1s 2s ease-out both' : 'none',
          opacity: 0,
          marginBottom: 64,
        }}>SLOW &nbsp;·&nbsp; RARE &nbsp;·&nbsp; PROTECTED &nbsp;·&nbsp; SACRED</p>

        <div style={{ animation: 'scrollDot 2.5s ease-in-out infinite', fontSize: 16, color: 'rgba(235,229,216,.15)' }}>▾</div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* Thin gold line */}
        <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(212,175,55,.2),transparent)' }} />

        {/* Quote */}
        <div style={{ maxWidth: 660, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
          <p style={{
            fontFamily: '"Cormorant Garamond",Georgia,serif',
            fontSize: 'clamp(17px,2.2vw,22px)',
            fontWeight: 300, fontStyle: 'italic',
            color: 'rgba(235,229,216,.45)',
            lineHeight: 2.1,
          }}>
            "You don't buy WEIS.<br />
            You recognize it.<br />
            The candle that was already lit.<br />
            The stone already in your pocket.<br />
            WEIS makes the outside match what you've always carried."
          </p>
        </div>

        {/* Altar words */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px 80px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px', justifyContent: 'center' }}>
            {['Palo Santo','Florida Water','Malachite',"Tiger's Eye",'Turquoise','Sagrado Corazón','Rudraksha','Brass Bell','St. Michael','Shri Radha'].map((w, i) => (
              <span key={i} style={{
                fontFamily: 'ui-monospace,monospace', fontSize: 8,
                letterSpacing: '.3em', color: 'rgba(212,175,55,.22)',
                animation: `revealFade .5s ${i * .05}s ease-out both`,
                opacity: 0,
              }}>{w.toUpperCase()}</span>
            ))}
          </div>
        </div>

        {/* Drops */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px' }}>
          {/* Arch divider */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <svg width="140" height="22" viewBox="0 0 140 22" style={{ opacity: .2 }}>
              <path d="M 0 22 Q 70 -4 140 22" fill="none" stroke="#d4af37" strokeWidth=".7"/>
              <circle cx="70" cy="4" r="1.8" fill="#d4af37"/>
            </svg>
            <div style={{
              fontFamily: 'ui-monospace,monospace', fontSize: 8,
              letterSpacing: '.5em', color: 'rgba(212,175,55,.28)',
              marginTop: 10,
            }}>DROPS</div>
          </div>

          {drops.map((d, i) => <Drop key={i} d={d} i={i} hov={hov} setHov={setHov} />)}

          <div style={{ borderTop: '1px solid rgba(255,255,255,.05)', padding: '32px 0 80px', textAlign: 'center' }}>
            <p style={{
              fontFamily: 'ui-monospace,monospace', fontSize: 8,
              letterSpacing: '.3em', color: 'rgba(235,229,216,.14)',
              lineHeight: 2.2,
            }}>DROPS ANNOUNCED VIA FREQ &nbsp;·&nbsp; @WEISFREQ<br/>$DRAIN HOLDERS RECEIVE FIRST ACCESS</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 10,
        borderTop: '1px solid rgba(255,255,255,.04)',
        padding: '26px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontFamily: 'ui-monospace,monospace', fontSize: 8, letterSpacing: '.25em', color: 'rgba(235,229,216,.1)' }}>WEIS © MMXXVI</span>
        <span style={{
          fontFamily: '"Cormorant Garamond",Georgia,serif',
          fontSize: 18, fontWeight: 300, letterSpacing: '.4em',
          color: 'rgba(235,229,216,.15)',
        }}>W</span>
        <a href="/freq" style={{ fontFamily: 'ui-monospace,monospace', fontSize: 8, letterSpacing: '.25em', color: 'rgba(235,229,216,.1)', textDecoration: 'none' }}>FREQ →</a>
      </footer>
    </div>
  );
}
