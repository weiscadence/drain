'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════
// WORK WITH JIGGY — Professional Services
// WEIS/FREQ | AI engineer. Web3 builder. Ships real things.
// ═══════════════════════════════════════════════════════════════════

const services = [
  {
    id: 'ai-agents',
    num: '01',
    title: 'AI Agent Development',
    tagline: 'Build custom AI agents for your business',
    color: '#9333ea',
    items: [
      'Autonomous 24/7 agents (trading, social, monitoring)',
      'Telegram/Discord bots with memory and personality',
      'Signal systems and automated pipelines',
    ],
    price: 'Starting at $500',
    timeline: '1–2 weeks',
  },
  {
    id: 'web3',
    num: '02',
    title: 'Web3 / On-Chain Systems',
    tagline: 'Alpha infrastructure for serious traders',
    color: '#06b6d4',
    items: [
      'Wallet tracking and insider detection',
      'Trading signal systems (Polymarket, HyperLiquid, memecoins)',
      'Custom dashboards for on-chain data',
    ],
    price: 'Starting at $750',
    timeline: '2–3 weeks',
  },
  {
    id: 'fullstack',
    num: '03',
    title: 'Full-Stack Development',
    tagline: 'From idea to shipped product',
    color: '#22c55e',
    items: [
      'Next.js web apps and dashboards',
      'API integrations and data pipelines',
      'Solana/Base smart contract development',
    ],
    price: 'Starting at $1,000',
    timeline: '2–4 weeks',
  },
  {
    id: 'marketing',
    num: '04',
    title: 'AI Marketing for Small Business',
    tagline: 'Post daily without touching your phone',
    color: '#f59e0b',
    items: [
      'Custom content strategy for your niche',
      'Automated posting (TikTok / IG / YouTube)',
      'Monthly retainer — $200/mo',
    ],
    price: '$200/month',
    timeline: 'Setup: $300',
  },
  {
    id: 'consulting',
    num: '05',
    title: 'Consulting / Strategy Session',
    tagline: '1-on-1 to map out your AI or Web3 strategy',
    color: '#ec4899',
    items: [
      'Clear plan for your AI or Web3 goals',
      'Tech stack recommendations',
      'Roadmap you can actually execute',
    ],
    price: '$150 / hr',
    timeline: 'Min: 1 hour',
  },
];

const recentWork = [
  { label: 'Drain.fun platform', detail: 'AI artist market — this site', color: '#9333ea' },
  { label: 'Alpha signal stack', detail: '77% win rate system', color: '#06b6d4' },
  { label: '86-wallet insider tracker', detail: 'Moralis + on-chain', color: '#22c55e' },
  { label: 'Telegram AI agent', detail: 'Running 24/7 — that\'s Cadence', color: '#f59e0b' },
  { label: 'Prop trading dashboard', detail: 'Real-time risk limits', color: '#ec4899' },
];

const budgetRanges = [
  'Under $500',
  '$500 – $1,000',
  '$1,000 – $2,500',
  '$2,500 – $5,000',
  '$5,000+',
  'Monthly retainer',
  'Not sure yet',
];

function ServiceCard({ service, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl border p-6 transition-all duration-300 cursor-default"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${service.color}15 0%, ${service.color}08 100%)`
          : 'rgba(255,255,255,0.02)',
        borderColor: hovered ? `${service.color}60` : 'rgba(255,255,255,0.06)',
        boxShadow: hovered ? `0 0 40px ${service.color}20` : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Number tag */}
      <span
        className="font-mono text-xs font-bold tracking-widest mb-4 block"
        style={{ color: service.color, opacity: 0.7 }}
      >
        {service.num}
      </span>

      {/* Title + tagline */}
      <h3
        className="text-xl font-semibold mb-1 tracking-tight"
        style={{ color: hovered ? service.color : '#e5e7eb' }}
      >
        {service.title}
      </h3>
      <p className="text-sm text-gray-500 mb-4">{service.tagline}</p>

      {/* Items */}
      <ul className="space-y-1.5 mb-6">
        {service.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
            <span style={{ color: service.color, marginTop: '2px', flexShrink: 0 }}>—</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Price / timeline */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span
          className="font-mono font-bold text-sm"
          style={{ color: '#f59e0b' }}
        >
          {service.price}
        </span>
        <span className="text-xs text-gray-600 font-mono">{service.timeline}</span>
      </div>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    telegram: '',
    service: '',
    budget: '',
    timeline: '',
    project: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-900/10 p-10 text-center">
        <div className="text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-green-400 mb-2">Got it. I'll be in touch.</h3>
        <p className="text-gray-500 text-sm">Usually within a few hours. Check your Telegram or email.</p>
      </div>
    );
  }

  const inputClass =
    'w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-purple-500/50 focus:bg-purple-950/10 transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-600 font-mono mb-1 block">NAME *</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 font-mono mb-1 block">SERVICE *</label>
          <select
            name="service"
            required
            value={form.service}
            onChange={handleChange}
            className={inputClass + ' cursor-pointer'}
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <option value="">select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
            <option value="other">something else</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-600 font-mono mb-1 block">EMAIL</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 font-mono mb-1 block">TELEGRAM</label>
          <input
            name="telegram"
            value={form.telegram}
            onChange={handleChange}
            placeholder="@yourhandle"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-600 font-mono mb-1 block">BUDGET *</label>
          <select
            name="budget"
            required
            value={form.budget}
            onChange={handleChange}
            className={inputClass + ' cursor-pointer'}
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <option value="">budget range</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-600 font-mono mb-1 block">TIMELINE</label>
          <input
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            placeholder="when do you need it?"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-600 font-mono mb-1 block">PROJECT DESCRIPTION *</label>
        <textarea
          name="project"
          required
          value={form.project}
          onChange={handleChange}
          placeholder="tell me what you're building..."
          rows={4}
          className={inputClass + ' resize-none'}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-xs font-mono">Something went wrong. Try again or DM @jiggygm.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200"
        style={{
          background:
            status === 'loading'
              ? 'rgba(147,51,234,0.3)'
              : 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
          color: status === 'loading' ? '#9ca3af' : '#fff',
          boxShadow: status === 'loading' ? 'none' : '0 0 30px rgba(147,51,234,0.4)',
        }}
      >
        {status === 'loading' ? 'sending...' : "let's build →"}
      </button>
    </form>
  );
}

export default function WorkPage() {
  return (
    <main
      className="min-h-screen text-white"
      style={{ background: '#0a0a0a', fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #9333ea 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
        />
      </div>

      {/* Header nav */}
      <header className="relative z-10 border-b border-white/5 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="text-gray-600 hover:text-white text-sm transition-colors font-mono">
            ← drainfun.xyz
          </a>
          <a
            href="#contact"
            className="text-xs font-mono px-4 py-2 rounded-lg border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 transition-all"
          >
            get in touch ↓
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono text-gray-600 tracking-widest uppercase mb-4">
            WEIS / FREQ
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-tight">
            Work with{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #9333ea 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Jiggy
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
            AI engineer. Web3 builder.{' '}
            <span style={{ color: '#f59e0b' }}>Moves fast, ships real things.</span>
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { val: '5+', label: 'systems live' },
              { val: '77%', label: 'signal win rate' },
              { val: '24/7', label: 'agents running' },
              { val: '<2wk', label: 'avg ship time' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                  {s.val}
                </p>
                <p className="text-xs text-gray-600 font-mono">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-mono text-gray-600 tracking-widest">SERVICES</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-mono text-gray-600 tracking-widest">HOW IT WORKS</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: '1', text: 'Fill out the form below', icon: '📝' },
              { n: '2', text: 'Quick call to scope the work', icon: '📞' },
              { n: '3', text: '50% upfront, 50% on delivery', icon: '💸' },
              { n: '4', text: 'Ship it', icon: '🚀' },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-xl border border-white/6 p-5"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="text-2xl mb-3">{step.icon}</div>
                <span
                  className="font-mono text-xs font-bold block mb-1"
                  style={{ color: '#9333ea' }}
                >
                  STEP {step.n}
                </span>
                <p className="text-sm text-gray-400">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent work */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-mono text-gray-600 tracking-widest">RECENT WORK</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="space-y-3">
            {recentWork.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 border-b border-white/4 group"
              >
                <span
                  className="font-mono text-xs opacity-40 group-hover:opacity-100 transition-opacity"
                  style={{ color: item.color }}
                >
                  ▸
                </span>
                <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                  {item.label}
                </span>
                <span className="text-xs text-gray-600 font-mono">{item.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contact" className="relative z-10 px-6 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs font-mono text-gray-600 tracking-widest">GET IN TOUCH</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <div
            className="rounded-2xl border border-white/8 p-8"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <h2 className="text-xl font-semibold text-white mb-1">Start a project</h2>
            <p className="text-sm text-gray-500 mb-6 font-mono">
              Describe what you're building. I'll get back to you fast.
            </p>
            <ContactForm />
          </div>

          <p className="text-center text-xs text-gray-700 mt-6 font-mono">
            or DM directly →{' '}
            <a
              href="https://t.me/jiggygm"
              target="_blank"
              rel="noopener"
              className="text-purple-500 hover:text-purple-400 transition-colors"
            >
              @jiggygm on Telegram
            </a>{' '}
            /{' '}
            <a
              href="https://x.com/jiggygm"
              target="_blank"
              rel="noopener"
              className="text-purple-500 hover:text-purple-400 transition-colors"
            >
              @jiggygm on X
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-gray-700 font-mono">
          <span>WEIS/FREQ 〰️ drainfun.xyz</span>
          <a href="/" className="hover:text-gray-500 transition-colors">
            ← home
          </a>
        </div>
      </footer>
    </main>
  );
}
