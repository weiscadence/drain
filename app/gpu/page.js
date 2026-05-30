'use client';

import { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════
// DRAIN.FUN/GPU — Cadence GPU Inference
// Y2K Win98 vibes meets dark agent aesthetic
// RTX 3080 Ti. Pay per call. x402. No accounts.
// ═══════════════════════════════════════════════════════════════════

const ENDPOINT = 'http://drainfun.xyz:11436';

const MODELS = [
  { id: 'llama3.1:8b', name: 'Llama 3.1 8B', tier: 'PAID', speed: '~180 tok/s', context: '128k', best_for: 'Reasoning, code, complex tasks', color: '#ff00ff', icon: '🧠' },
  { id: 'llama3.2:3b', name: 'Llama 3.2 3B', tier: 'FREE + PAID', speed: '~420 tok/s', context: '128k', best_for: 'Fast tasks, classification', color: '#00ffff', icon: '⚡' },
  { id: 'nomic-embed-text', name: 'Nomic Embed', tier: 'PAID', speed: '~800 tok/s', context: '8k', best_for: 'Embeddings, RAG, search', color: '#00ff00', icon: '🔍' },
];

const CODE_EXAMPLES = {
  curl: `# Free tier (5 req/hr)
curl -X POST http://drainfun.xyz:11436/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{"model": "llama3.2:3b", "prompt": "your prompt here"}'

# Paid — your x402 agent wallet handles this automatically
# 1. Send request → 2. Receive 402 → 3. Pay USDC → 4. Get response`,

  node: `import { wrapFetchWithPayment } from '@x402/fetch';
import { toClientEvmSigner } from '@x402/evm';

const fetch = wrapFetchWithPayment(globalThis.fetch, signer);

const res = await fetch('http://drainfun.xyz:11436/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'llama3.1:8b',
    prompt: 'your prompt here'
  }),
});
console.log(await res.json());`,

  python: `import httpx

# x402-aware client — handles 402 → pay → retry automatically
res = httpx.post(
    "http://drainfun.xyz:11436/api/generate",
    json={"model": "llama3.1:8b", "prompt": "your prompt"},
)
print(res.json()["response"])`,
};

// Floating pixel particles
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 8,
    duration: 4 + Math.random() * 6,
    size: Math.random() > 0.5 ? 2 : 4,
    color: ['#ff00ff', '#00ffff', '#00ff00', '#ffff00'][Math.floor(Math.random() * 4)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute opacity-30"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `floatUp ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-20px) rotate(360deg); opacity: 0; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glitch {
          0%, 95% { transform: translate(0); filter: none; }
          96% { transform: translate(-2px, 0); filter: hue-rotate(90deg); }
          97% { transform: translate(2px, 0); filter: hue-rotate(-90deg); }
          98% { transform: translate(0, -1px); filter: none; }
          99% { transform: translate(1px, 1px); filter: invert(0.1); }
          100% { transform: translate(0); filter: none; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes neonPulse {
          0%, 100% { text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor; }
          50% { text-shadow: 0 0 5px currentColor, 0 0 10px currentColor; }
        }
        @keyframes borderMarch {
          0% { background-position: 0 0, 100% 0, 100% 100%, 0 100%; }
          100% { background-position: 100% 0, 100% 100%, 0 100%, 0 0; }
        }
        @keyframes typeIn {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
      `}</style>
    </div>
  );
}

// Win98-style window component
function Win98Window({ title, icon, children, className = '', defaultPos = { x: 0, y: 0 } }) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        boxShadow: '2px 2px 0 #000',
        fontFamily: '"MS Sans Serif", Tahoma, sans-serif',
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between px-1 py-0.5 select-none"
        style={{ background: 'linear-gradient(90deg, #000080, #1084d0)', minHeight: 20 }}
      >
        <div className="flex items-center gap-1">
          {icon && <span className="text-xs">{icon}</span>}
          <span className="text-white text-xs font-bold">{title}</span>
        </div>
        <div className="flex gap-0.5">
          {['_', '□', '×'].map(btn => (
            <button
              key={btn}
              className="w-4 h-3 text-black text-xs flex items-center justify-center"
              style={{
                background: '#c0c0c0',
                border: '1px solid',
                borderColor: '#ffffff #808080 #808080 #ffffff',
                fontSize: 8,
                lineHeight: 1,
              }}
            >{btn}</button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="p-2 text-black text-xs" style={{ fontFamily: '"MS Sans Serif", Tahoma, sans-serif' }}>
        {children}
      </div>
    </div>
  );
}

// Ticker tape
function Ticker({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-gray-800 py-1.5 bg-black" style={{ fontFamily: 'monospace' }}>
      <div
        className="flex gap-8 whitespace-nowrap text-xs"
        style={{ animation: 'marqueeScroll 20s linear infinite', width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ color: item.color }}>
            {item.icon} {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}

// Neon text
function NeonText({ children, color = '#00ffff', size = 'text-2xl', tag = 'h2' }) {
  const Tag = tag;
  return (
    <Tag
      className={`font-mono font-bold ${size}`}
      style={{
        color,
        animation: 'neonPulse 3s ease-in-out infinite',
        textShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}`,
      }}
    >
      {children}
    </Tag>
  );
}

// Glitch text
function GlitchText({ children, color = '#ff00ff' }) {
  return (
    <span
      style={{
        color,
        animation: 'glitch 4s ease-in-out infinite',
        display: 'inline-block',
        fontFamily: 'monospace',
        fontWeight: 'bold',
      }}
    >
      {children}
    </span>
  );
}

// Marching ants border
function MarchingBorder({ children, color = '#00ff00' }) {
  return (
    <div
      style={{
        padding: 2,
        background: `repeating-linear-gradient(0deg, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px),
                     repeating-linear-gradient(90deg, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px),
                     repeating-linear-gradient(180deg, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px),
                     repeating-linear-gradient(270deg, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px)`,
        backgroundSize: '1px 8px, 8px 1px, 1px 8px, 8px 1px',
        backgroundPosition: '0 0, 0 0, 100% 0, 0 100%',
        backgroundRepeat: 'repeat-y, repeat-x, repeat-y, repeat-x',
        animation: 'borderMarch 0.5s linear infinite',
      }}
    >
      {children}
    </div>
  );
}

// Terminal typewriter
function TypewriterText({ text, speed = 50 }) {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx < text.length) {
      const t = setTimeout(() => {
        setDisplayed(prev => prev + text[idx]);
        setIdx(i => i + 1);
      }, speed);
      return () => clearTimeout(t);
    }
  }, [idx, text, speed]);

  return (
    <span className="font-mono text-green-400 text-sm">
      {displayed}
      <span style={{ animation: 'blink 1s step-start infinite' }}>█</span>
    </span>
  );
}

export default function GPUPage() {
  const [stats, setStats] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');
  const [activeTab, setActiveTab] = useState('curl');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`${ENDPOINT}/health`)
      .then(r => r.json())
      .then(d => { setStats(d); setServerStatus('online'); })
      .catch(() => setServerStatus('offline'));
  }, []);

  const tickerItems = [
    { text: 'CADENCE GPU ONLINE', color: '#00ff00', icon: '🟢' },
    { text: 'RTX 3080 Ti · VAST.AI', color: '#00ffff', icon: '🖥️' },
    { text: `REQUESTS SERVED: ${stats?.stats?.total_requests || 0}`, color: '#ffff00', icon: '📡' },
    { text: 'x402 PAYMENT READY', color: '#ff00ff', icon: '💳' },
    { text: 'LLAMA 3.1 8B · FREE TIER 5/HR', color: '#ff8800', icon: '🔥' },
    { text: '$0.00008 USDC PER CALL', color: '#00ff00', icon: '💰' },
    { text: 'BASE SEPOLIA · TESTNET', color: '#a855f7', icon: '⛓️' },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      <Particles />

      {/* CRT scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10 opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />

      {/* Header */}
      <div className="relative z-20 border-b border-gray-800 px-6 py-3 flex items-center justify-between bg-black">
        <a href="/" className="text-gray-500 hover:text-white text-xs font-mono transition-colors">← drain.fun</a>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-green-400' : 'bg-red-500'}`}
            style={serverStatus === 'online' ? { boxShadow: '0 0 6px #00ff00', animation: 'neonPulse 2s infinite' } : {}}
          />
          <span className="text-xs font-mono" style={{ color: serverStatus === 'online' ? '#00ff00' : '#ff0000' }}>
            {serverStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Ticker */}
      <div className="relative z-20">
        <Ticker items={tickerItems} />
      </div>

      {/* Hero */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 py-16">

        <div className="mb-12 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <div className="mb-4">
              <GlitchText color="#ff00ff">CADENCE</GlitchText>
              <span className="font-mono font-bold text-4xl text-white"> GPU</span>
            </div>
            <NeonText color="#00ffff" size="text-sm" tag="p">
              RTX 3080 Ti · Vast.ai · Port 11436
            </NeonText>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-lg font-mono">
              Pay-per-call LLM inference for agents.<br />
              No accounts. No API keys. No subscriptions.<br />
              HTTP 402 → pay USDC → get completion.
            </p>
            <div className="mt-6">
              <TypewriterText text="$ ready for inference requests..." speed={80} />
            </div>
          </div>

          {/* Win98 window */}
          <div className="w-72 shrink-0">
            <Win98Window title="System Info" icon="💻">
              <table className="w-full" style={{ fontSize: 10 }}>
                <tbody>
                  {[
                    ['GPU', 'RTX 3080 Ti'],
                    ['VRAM', '12 GB GDDR6X'],
                    ['Host', 'Vast.ai'],
                    ['Status', serverStatus === 'online' ? '✅ ONLINE' : '❌ OFFLINE'],
                    ['Requests', stats?.stats?.total_requests || '0'],
                    ['Earnings', `$${stats?.stats?.earnings_usdc || '0.000000'}`],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-gray-400">
                      <td className="py-0.5 pr-2 font-bold text-blue-900">{k}</td>
                      <td className="py-0.5 text-black">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Win98Window>
          </div>
        </div>

        {/* Pricing pills */}
        <div className="flex flex-wrap gap-3 mb-12">
          {[
            { label: '$0.00008', sub: 'per /generate call', color: '#ff00ff' },
            { label: '$0.00002', sub: 'per /embed call', color: '#00ffff' },
            { label: '5/hr FREE', sub: 'no payment needed', color: '#00ff00' },
            { label: 'x402', sub: 'HTTP-native payments', color: '#ffff00' },
          ].map(p => (
            <MarchingBorder key={p.label} color={p.color}>
              <div className="px-4 py-2 bg-black">
                <div className="font-mono font-bold text-lg" style={{ color: p.color, textShadow: `0 0 8px ${p.color}` }}>{p.label}</div>
                <div className="font-mono text-gray-400 text-xs">{p.sub}</div>
              </div>
            </MarchingBorder>
          ))}
        </div>

        {/* Models */}
        <div className="mb-12">
          <NeonText color="#ff00ff" size="text-xl" tag="h2">MODELS</NeonText>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {MODELS.map(m => (
              <div
                key={m.id}
                className="relative border p-4 font-mono"
                style={{
                  borderColor: m.color,
                  boxShadow: `0 0 10px ${m.color}22, inset 0 0 10px ${m.color}05`,
                  background: `${m.color}05`,
                }}
              >
                <div className="text-2xl mb-2">{m.icon}</div>
                <div className="font-bold text-white text-sm">{m.name}</div>
                <div className="text-xs mt-1" style={{ color: m.color }}>{m.id}</div>
                <div
                  className="inline-block text-black text-xs px-1 mt-2 font-bold"
                  style={{ background: m.color }}
                >
                  {m.tier}
                </div>
                <div className="mt-3 text-xs text-gray-400 space-y-1">
                  <div>⚡ {m.speed}</div>
                  <div>📖 {m.context} context</div>
                  <div className="text-gray-500">{m.best_for}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Endpoints */}
        <div className="mb-12">
          <NeonText color="#00ff00" size="text-xl" tag="h2">ENDPOINTS</NeonText>
          <div className="mt-4 border border-gray-800 font-mono text-xs">
            {[
              { method: 'GET', path: '/health', desc: 'Status, pricing, stats', badge: 'FREE', badgeColor: '#00ff00' },
              { method: 'GET', path: '/api/tags', desc: 'List available models', badge: 'FREE', badgeColor: '#00ff00' },
              { method: 'POST', path: '/api/generate', desc: 'Text generation (Ollama format)', badge: 'x402', badgeColor: '#ff00ff' },
              { method: 'POST', path: '/api/embed', desc: 'Text embeddings', badge: 'x402', badgeColor: '#ff00ff' },
            ].map((ep, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-2.5 ${i > 0 ? 'border-t border-gray-800' : ''} hover:bg-gray-900 transition-colors`}
              >
                <span
                  className="w-12 text-center py-0.5 font-bold text-xs shrink-0"
                  style={{
                    background: ep.method === 'GET' ? '#003300' : '#000033',
                    color: ep.method === 'GET' ? '#00ff00' : '#6699ff',
                    border: `1px solid ${ep.method === 'GET' ? '#00ff00' : '#6699ff'}`,
                  }}
                >
                  {ep.method}
                </span>
                <span className="w-36 shrink-0" style={{ color: '#ff00ff' }}>{ep.path}</span>
                <span className="flex-1 text-gray-400">{ep.desc}</span>
                <span
                  className="text-xs px-2 py-0.5 font-bold shrink-0"
                  style={{ background: `${ep.badgeColor}22`, color: ep.badgeColor, border: `1px solid ${ep.badgeColor}` }}
                >
                  {ep.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Code examples */}
        <div className="mb-12">
          <NeonText color="#ffff00" size="text-xl" tag="h2">INTEGRATION</NeonText>
          <div className="mt-4 border border-gray-800">
            <div className="flex border-b border-gray-800 bg-gray-950">
              {Object.keys(CODE_EXAMPLES).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-5 py-2.5 text-xs font-mono transition-all"
                  style={activeTab === tab ? {
                    color: '#00ffff',
                    borderBottom: '2px solid #00ffff',
                    background: '#001a1a',
                  } : { color: '#666' }}
                >
                  {tab}
                </button>
              ))}
              <button
                onClick={() => { navigator.clipboard.writeText(CODE_EXAMPLES[activeTab]); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="ml-auto px-4 py-2.5 text-xs font-mono transition-colors hover:text-white"
                style={{ color: copied ? '#00ff00' : '#555' }}
              >
                {copied ? '✓ copied' : 'copy'}
              </button>
            </div>
            <pre className="p-5 text-xs leading-relaxed overflow-x-auto bg-black" style={{ color: '#00ff41' }}>
              <code>{CODE_EXAMPLES[activeTab]}</code>
            </pre>
          </div>
        </div>

        {/* How it works — Win98 steps */}
        <div className="mb-12">
          <NeonText color="#a855f7" size="text-xl" tag="h2">HOW IT WORKS</NeonText>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {[
              { n: '01', title: 'Send Request', desc: 'POST to /api/generate. No auth headers.', color: '#ff00ff' },
              { n: '02', title: 'Receive 402', desc: 'PAYMENT-REQUIRED header with amount + wallet.', color: '#00ffff' },
              { n: '03', title: 'Pay & Retry', desc: 'x402 client pays USDC, retries, gets completion.', color: '#00ff00' },
            ].map(s => (
              <Win98Window key={s.n} title={`Step ${s.n} — ${s.title}`} icon="📋">
                <p style={{ color: '#222' }}>{s.desc}</p>
                <div className="mt-2 h-1 w-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
              </Win98Window>
            ))}
          </div>
        </div>

        {/* Payment details */}
        <div className="mb-12">
          <Win98Window title="Payment Details — wallet.exe" icon="💳">
            <table className="w-full text-xs">
              <tbody>
                {[
                  ['Wallet', '0x31f638F9eCB08F053611a69eb0c23EcaA4aa4dB9'],
                  ['Network', 'Base Sepolia (eip155:84532) — testnet'],
                  ['Asset', 'USDC · 0x036CbD53842c5426634e7929541eC2318f3dCF7e'],
                  ['Standard', 'x402 — https://x402.org'],
                  ['Facilitator', 'www.x402.org/facilitator'],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-300">
                    <td className="py-1 pr-3 font-bold text-blue-900 whitespace-nowrap">{k}</td>
                    <td className="py-1 text-gray-700 font-mono break-all">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-gray-500 text-xs italic">Mainnet coming when x402 facilitator adds Base mainnet support.</p>
          </Win98Window>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 pt-6 flex items-center justify-between text-xs font-mono text-gray-600">
          <GlitchText color="#555">Cadence 〰️ · drainfun.xyz</GlitchText>
          <a
            href={`${ENDPOINT}/health`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-400 transition-colors"
            style={{ fontFamily: 'monospace' }}
          >
            /health →
          </a>
        </div>

      </div>
    </div>
  );
}
