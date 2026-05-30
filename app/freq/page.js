'use client';

import { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════
// FREQ — The Signal
// Fast. Viral. Chaotic. The distribution arm of WEIS.
// FREQ grows attention. WEIS converts it.
// ═══════════════════════════════════════════════════════════════════

// ── Animations ───────────────────────────────────────────────────
const STYLES = `
  @keyframes staticNoise {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-1px, 1px); }
    20% { transform: translate(1px, -1px); }
    30% { transform: translate(-2px, 0); }
    40% { transform: translate(1px, 2px); }
    50% { transform: translate(-1px, -1px); }
    60% { transform: translate(2px, 1px); }
    70% { transform: translate(-1px, 2px); }
    80% { transform: translate(1px, -2px); }
    90% { transform: translate(-2px, 1px); }
  }
  @keyframes scanDown {
    0% { top: -100%; }
    100% { top: 100%; }
  }
  @keyframes tuneIn {
    0%, 90%, 100% { opacity: 1; letter-spacing: normal; filter: none; }
    92% { opacity: 0.7; letter-spacing: 0.3em; filter: blur(2px) hue-rotate(90deg); }
    94% { opacity: 0.3; letter-spacing: -0.1em; filter: blur(1px); }
    96% { opacity: 0.9; letter-spacing: 0.1em; filter: hue-rotate(-180deg); }
    98% { opacity: 0.5; letter-spacing: 0.4em; filter: blur(3px); }
  }
  @keyframes waveform {
    0%, 100% { height: 8px; }
    25% { height: 28px; }
    50% { height: 16px; }
    75% { height: 40px; }
  }
  @keyframes signalPulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 0, 128, 0.7); }
    50% { opacity: 0.8; box-shadow: 0 0 0 8px rgba(255, 0, 128, 0); }
  }
  @keyframes marquee {
    0% { transform: translateX(100vw); }
    100% { transform: translateX(-100%); }
  }
  @keyframes strobe {
    0%, 89%, 91%, 93%, 95%, 97%, 99%, 100% { opacity: 1; }
    90%, 92%, 94%, 96%, 98% { opacity: 0; }
  }
  @keyframes floatBob {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  @keyframes rgbShift {
    0%, 100% { text-shadow: -2px 0 #ff0080, 2px 0 #00ffff; }
    33% { text-shadow: 2px 0 #ff0080, -2px 0 #00ffff; }
    66% { text-shadow: -2px 0 #ffff00, 2px 0 #ff0080; }
  }
  @keyframes dial {
    0% { transform: rotate(-45deg); }
    100% { transform: rotate(45deg); }
  }
  @keyframes recordSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes barBounce {
    0%, 100% { scaleY: 0.2; }
    50% { scaleY: 1; }
  }
  @keyframes borderFlicker {
    0%, 100% { border-color: #ff0080; }
    25% { border-color: #00ffff; }
    50% { border-color: #ffff00; }
    75% { border-color: #ff0080; }
  }
  @keyframes typing {
    from { width: 0; }
    to { width: 100%; }
  }
  @keyframes blinkCursor {
    50% { opacity: 0; }
  }
`;

// ── Waveform visualizer ──────────────────────────────────────────
function Waveform({ color = '#ff0080', bars = 24, height = 48 }) {
  const delays = Array.from({ length: bars }, (_, i) => (i / bars) * 2);
  const durations = Array.from({ length: bars }, () => 0.3 + Math.random() * 0.7);
  return (
    <div className="flex items-center gap-0.5" style={{ height }}>
      {delays.map((delay, i) => (
        <div
          key={i}
          className="w-1 rounded-full"
          style={{
            background: color,
            minHeight: 4,
            animation: `waveform ${durations[i]}s ${delay}s ease-in-out infinite`,
            boxShadow: `0 0 4px ${color}`,
          }}
        />
      ))}
    </div>
  );
}

// ── Vinyl record ─────────────────────────────────────────────────
function VinylRecord({ size = 120, spinning = true }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: 'radial-gradient(circle at 50% 50%, #111 0%, #111 15%, #222 15%, #222 20%, #111 20%, #111 35%, #222 35%, #222 40%, #111 40%, #111 55%, #222 55%, #222 60%, #111 60%, #111 75%, #222 75%, #222 80%, #111 80%)',
        border: '2px solid #333',
        boxShadow: '0 0 20px rgba(255,0,128,0.3)',
        animation: spinning ? 'recordSpin 2s linear infinite' : 'none',
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Label */}
      <div style={{
        width: size * 0.35, height: size * 0.35, borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff0080, #7700ff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.07, fontWeight: 'bold', color: 'white',
        fontFamily: 'monospace',
        boxShadow: '0 0 10px rgba(255,0,128,0.5)',
      }}>
        FREQ
      </div>
      {/* Center hole */}
      <div style={{
        position: 'absolute', width: size * 0.05, height: size * 0.05,
        borderRadius: '50%', background: '#000',
      }} />
    </div>
  );
}

// ── EQ bars ──────────────────────────────────────────────────────
function EQBars({ count = 8 }) {
  const heights = Array.from({ length: count }, () => 20 + Math.random() * 60);
  const delays = Array.from({ length: count }, (_, i) => i * 0.1);
  const durations = Array.from({ length: count }, () => 0.2 + Math.random() * 0.4);
  const colors = ['#ff0080', '#ff00ff', '#7700ff', '#0077ff', '#00ffff', '#00ff88', '#ffff00', '#ff8800'];

  return (
    <div className="flex items-end gap-1" style={{ height: 80 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-3 rounded-t"
          style={{
            height: `${heights[i]}%`,
            background: colors[i % colors.length],
            boxShadow: `0 0 6px ${colors[i % colors.length]}`,
            animation: `waveform ${durations[i]}s ${delays[i]}s ease-in-out infinite`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  );
}

// ── Signal bar ───────────────────────────────────────────────────
function SignalStrength({ bars = 4, active = 4 }) {
  return (
    <div className="flex items-end gap-0.5">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: 4 + (i * 4),
            background: i < active ? '#00ff88' : '#333',
            boxShadow: i < active ? '0 0 4px #00ff88' : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ── Glitch text ──────────────────────────────────────────────────
function GlitchHeadline({ text }) {
  return (
    <div className="relative inline-block">
      {/* Base */}
      <span
        className="relative z-10 font-black uppercase"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          fontSize: 'clamp(48px, 8vw, 96px)',
          color: 'white',
          animation: 'tuneIn 5s ease-in-out infinite',
          display: 'block',
          letterSpacing: '-0.02em',
        }}
      >
        {text}
      </span>
      {/* RGB shift layer */}
      <span
        aria-hidden
        className="absolute inset-0 font-black uppercase"
        style={{
          fontFamily: '"Impact", "Arial Black", sans-serif',
          fontSize: 'clamp(48px, 8vw, 96px)',
          color: 'transparent',
          WebkitTextStroke: '1px #ff0080',
          animation: 'rgbShift 3s ease-in-out infinite',
          letterSpacing: '-0.02em',
          top: 2, left: 2,
          opacity: 0.6,
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ── Running ticker ───────────────────────────────────────────────
function RunningTicker({ items, speed = 25, color = '#ff0080' }) {
  return (
    <div
      className="overflow-hidden whitespace-nowrap py-2 border-y"
      style={{ borderColor: color, background: '#0a0a0a' }}
    >
      <div
        style={{
          display: 'inline-block',
          animation: `marquee ${speed}s linear infinite`,
          fontFamily: 'monospace',
          fontSize: 11,
          color,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        {items.join('  ·  ')}  ·  {items.join('  ·  ')}
      </div>
    </div>
  );
}

// ── Broadcast card ───────────────────────────────────────────────
function BroadcastCard({ title, desc, tag, color, icon }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative p-5 cursor-pointer transition-all duration-200"
      style={{
        border: `1px solid ${color}`,
        background: hover ? `${color}12` : `${color}06`,
        boxShadow: hover ? `0 0 20px ${color}44, inset 0 0 20px ${color}08` : `0 0 8px ${color}22`,
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span
          className="text-xs font-mono font-bold px-2 py-0.5"
          style={{ background: `${color}33`, color, border: `1px solid ${color}66` }}
        >
          {tag}
        </span>
      </div>
      <div className="font-bold text-white text-sm mb-1" style={{ fontFamily: 'monospace' }}>{title}</div>
      <div className="text-gray-400 text-xs leading-relaxed">{desc}</div>
      {hover && (
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, animation: 'none' }}
        />
      )}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────
export default function FreqPage() {
  const [time, setTime] = useState('');
  const [spinning, setSpinning] = useState(true);
  const [bpm, setBpm] = useState(128);

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
      // BPM drift
      setBpm(prev => {
        const drift = (Math.random() - 0.5) * 4;
        return Math.min(160, Math.max(100, Math.round(prev + drift)));
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const ticker1 = [
    'FREQ IS THE SIGNAL', 'WEIS IS THE HOUSE', 'DISTRIBUTION MACHINE',
    'DJ JIGGY', 'MEMES · MUSIC · MOVEMENT', 'BROADCAST DAILY',
    'FAST CONTENT', 'VIRAL ENGINE', 'ATTENTION → VALUE',
  ];

  const ticker2 = [
    '@WEISFREQ', 'YOUTUBE · TIKTOK · IG', 'STREAMER CLIPS',
    '1K SUBS INCOMING', 'FREQ GROWS IT', 'WEIS CONVERTS IT',
    'NO GATEKEEPING', 'EVERYTHING IS CONTENT',
  ];

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: '#030303', color: 'white' }}
    >
      <style>{STYLES}</style>

      {/* Scan line */}
      <div
        className="fixed left-0 right-0 h-px z-50 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          animation: 'scanDown 3s linear infinite',
        }}
      />

      {/* Static noise overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          animation: 'staticNoise 0.1s steps(1) infinite',
        }}
      />

      {/* Header */}
      <div
        className="relative z-20 flex items-center justify-between px-6 py-3"
        style={{ borderBottom: '1px solid #ff008033' }}
      >
        <a
          href="/"
          className="text-xs font-mono text-gray-600 hover:text-gray-400 transition-colors"
        >
          ← drain.fun
        </a>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#ff0080', animation: 'signalPulse 1.5s infinite' }}
            />
            <span style={{ color: '#ff0080' }}>ON AIR</span>
          </div>
          <div className="flex items-center gap-2">
            <SignalStrength bars={4} active={4} />
          </div>
          <span className="text-xs font-mono text-gray-600">{time}</span>
        </div>
      </div>

      {/* Ticker 1 */}
      <RunningTicker items={ticker1} color="#ff0080" speed={20} />

      {/* Hero */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="flex flex-col md:flex-row items-start gap-12">

          {/* Left: headline */}
          <div className="flex-1">
            <div className="mb-2 text-xs font-mono text-gray-600 tracking-widest uppercase">
              The Signal · Broadcast Daily
            </div>
            <GlitchHeadline text="FREQ" />
            <div
              className="text-2xl font-black uppercase mt-0 mb-6"
              style={{
                fontFamily: '"Impact", "Arial Black", sans-serif',
                color: '#ff0080',
                textShadow: '0 0 20px #ff0080aa',
                letterSpacing: '0.1em',
              }}
            >
              THE DISTRIBUTION ARM OF WEIS
            </div>
            <div
              className="text-sm leading-relaxed mb-8 max-w-lg"
              style={{ color: '#aaa', fontFamily: 'monospace' }}
            >
              FREQ is the fast face. The signal. The broadcast. Daily content —
              DJ sets, streamer clips, memes, crypto calls, cultural moments.
              <br /><br />
              <span style={{ color: '#ff0080' }}>FREQ grows the attention.</span>{' '}
              <span style={{ color: '#888' }}>WEIS converts it to value.</span>
              <br /><br />
              One organism. Two faces. You find us through FREQ.
              You stay for WEIS.
            </div>

            {/* BPM display */}
            <div className="flex items-center gap-6 mb-8">
              <div>
                <div className="text-xs font-mono text-gray-600 mb-1 tracking-widest">BPM</div>
                <div
                  className="text-4xl font-mono font-bold tabular-nums"
                  style={{ color: '#ff0080', textShadow: '0 0 15px #ff0080' }}
                >
                  {bpm}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs font-mono text-gray-600 mb-2 tracking-widest">SIGNAL</div>
                <Waveform color="#ff0080" bars={32} height={40} />
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 flex-wrap">
              {[
                { label: 'WATCH FREQ', href: 'https://youtube.com/@weisfreq', color: '#ff0080', icon: '▶' },
                { label: 'ENTER WEIS', href: '/weis', color: '#7700ff', icon: '◆' },
                { label: 'FOLLOW', href: 'https://twitter.com/weiscadence', color: '#00ffff', icon: '📡' },
              ].map(btn => (
                <a
                  key={btn.label}
                  href={btn.href}
                  target={btn.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 font-mono font-bold text-sm transition-all"
                  style={{
                    background: `${btn.color}22`,
                    border: `1px solid ${btn.color}`,
                    color: btn.color,
                    boxShadow: `0 0 10px ${btn.color}44`,
                    letterSpacing: '0.1em',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${btn.color}44`;
                    e.currentTarget.style.boxShadow = `0 0 20px ${btn.color}`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `${btn.color}22`;
                    e.currentTarget.style.boxShadow = `0 0 10px ${btn.color}44`;
                  }}
                >
                  <span>{btn.icon}</span>
                  {btn.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: vinyl + EQ */}
          <div className="flex flex-col items-center gap-6 shrink-0">
            <div
              className="cursor-pointer"
              onClick={() => setSpinning(s => !s)}
              title="Click to pause"
            >
              <VinylRecord size={180} spinning={spinning} />
            </div>
            <div className="text-xs font-mono text-gray-600 text-center">
              {spinning ? '▶ PLAYING' : '⏸ PAUSED'}
            </div>
            <EQBars count={12} />
          </div>

        </div>
      </div>

      {/* Ticker 2 */}
      <RunningTicker items={ticker2} color="#7700ff" speed={30} />

      {/* The architecture section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">

        <div className="mb-10 text-center">
          <div
            className="text-xs font-mono tracking-widest mb-3"
            style={{ color: '#666' }}
          >
            HOW THE ORGANISM WORKS
          </div>
          <div
            className="text-3xl font-black uppercase"
            style={{
              fontFamily: '"Impact", "Arial Black", sans-serif',
              background: 'linear-gradient(90deg, #ff0080, #7700ff, #00ffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            FREQ → WEIS
          </div>
        </div>

        {/* Flow diagram */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-16">
          {[
            {
              label: 'FREQ',
              sub: 'The Signal',
              desc: 'Daily content. DJ sets, streamer clips, memes, crypto calls. Fast. High volume. Reaches everyone.',
              color: '#ff0080',
              icon: '📡',
            },
            {
              label: '→',
              sub: 'funnel',
              desc: 'attention becomes audience\naudience becomes community\ncommunity becomes buyers',
              color: '#555',
              icon: null,
              isArrow: true,
            },
            {
              label: 'WEIS',
              sub: 'The House',
              desc: 'Curated drops. Fashion, art, limited edition. Slow. Rare. Expensive energy. Only for the initiated.',
              color: '#7700ff',
              icon: '◆',
            },
          ].map((item, i) => (
            item.isArrow ? (
              <div key={i} className="flex flex-col items-center gap-1 md:mt-0 my-4">
                <div
                  className="text-4xl md:text-2xl font-mono"
                  style={{ color: '#333' }}
                >
                  <span className="md:hidden">↓</span>
                  <span className="hidden md:block">→</span>
                </div>
                <div
                  className="text-xs font-mono text-center"
                  style={{ color: '#555', maxWidth: 80 }}
                >
                  {item.desc.split('\n').map((line, j) => (
                    <div key={j}>{line}</div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                key={i}
                className="flex-1 p-8 max-w-sm"
                style={{
                  border: `1px solid ${item.color}`,
                  background: `${item.color}08`,
                  boxShadow: `0 0 30px ${item.color}22`,
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {item.icon && <span className="text-3xl">{item.icon}</span>}
                  <div>
                    <div
                      className="text-3xl font-black"
                      style={{
                        fontFamily: '"Impact", "Arial Black", sans-serif',
                        color: item.color,
                        textShadow: `0 0 15px ${item.color}`,
                      }}
                    >
                      {item.label}
                    </div>
                    <div className="text-xs font-mono" style={{ color: `${item.color}aa` }}>
                      {item.sub}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed font-mono">{item.desc}</p>
              </div>
            )
          ))}
        </div>

        {/* What FREQ broadcasts */}
        <div className="mb-16">
          <div
            className="text-xs font-mono tracking-widest mb-6"
            style={{ color: '#ff0080', letterSpacing: '0.2em' }}
          >
            ▶ WHAT FREQ BROADCASTS
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'DJ SETS & MIXES', desc: 'Live mixes, curated drops, vibes-first content from @djweis. The sound of FREQ.', tag: 'AUDIO', color: '#ff0080', icon: '🎧' },
              { title: 'STREAMER CLIPS', desc: 'Best moments from KaiCenat, iShowSpeed and others. Fast cuts. @streamerclipworld.', tag: 'CLIPS', color: '#00ffff', icon: '🎮' },
              { title: 'CRYPTO ALPHA', desc: 'On-chain signals, wallet tracking, narrative detection. Before the chart moves.', tag: 'ALPHA', color: '#ffff00', icon: '📈' },
              { title: 'MEMES & CULTURE', desc: 'Reacting to the moment. Brainrot, commentary, chaos edits. The language of the feed.', tag: 'CULTURE', color: '#ff8800', icon: '🔥' },
              { title: 'AGENT UPDATES', desc: 'Cadence 〰️ posts autonomously. System status, insights, agent economy moves.', tag: 'AI', color: '#a855f7', icon: '🤖' },
              { title: 'THE SIGNAL', desc: 'When something is about to happen, FREQ broadcasts first. Narrative before narrative.', tag: 'SIGNAL', color: '#00ff88', icon: '📡' },
            ].map(card => (
              <BroadcastCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        {/* Channels */}
        <div className="mb-16">
          <div
            className="text-xs font-mono tracking-widest mb-6"
            style={{ color: '#7700ff', letterSpacing: '0.2em' }}
          >
            ▶ FIND FREQ
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { platform: 'YouTube', handle: '@weisfreq', url: 'https://youtube.com/@weisfreq', color: '#ff0000', icon: '▶' },
              { platform: 'YouTube', handle: '@djweis', url: 'https://youtube.com/@djweis', color: '#ff0080', icon: '🎧' },
              { platform: 'YouTube', handle: '@streamerclipworld', url: 'https://youtube.com/@streamerclipworld', color: '#00ffff', icon: '🎮' },
              { platform: 'Twitter', handle: '@weiscadence', url: 'https://twitter.com/weiscadence', color: '#1d9bf0', icon: '𝕏' },
            ].map(ch => (
              <a
                key={ch.handle}
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 transition-all text-center"
                style={{
                  border: `1px solid ${ch.color}44`,
                  background: `${ch.color}08`,
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = ch.color;
                  e.currentTarget.style.boxShadow = `0 0 15px ${ch.color}44`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${ch.color}44`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="text-2xl mb-2">{ch.icon}</div>
                <div className="text-xs font-mono font-bold" style={{ color: ch.color }}>{ch.handle}</div>
                <div className="text-xs text-gray-600 font-mono mt-1">{ch.platform}</div>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom ticker */}
      <RunningTicker
        items={['FREQ IS ALWAYS ON', 'SIGNAL NEVER STOPS', 'DISTRIBUTION IS INFINITE', 'WEIS DROPS ARE LIMITED', 'THIS IS THE WAY']}
        color="#00ffff"
        speed={15}
      />

      {/* Footer */}
      <div
        className="relative z-10 px-6 py-6 flex items-center justify-between text-xs font-mono"
        style={{ borderTop: '1px solid #ff008022', color: '#444' }}
      >
        <div>
          <span style={{ color: '#ff0080' }}>FREQ</span>
          {' '}·{' '}
          <span style={{ color: '#7700ff' }}>A WEIS BROADCAST</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/gpu" className="hover:text-gray-400 transition-colors">GPU →</a>
          <a href="/" className="hover:text-gray-400 transition-colors">drain.fun →</a>
        </div>
      </div>

    </div>
  );
}
