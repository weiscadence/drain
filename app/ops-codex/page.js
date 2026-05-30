'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════
// CODEX — Coding services, bounties, client work
// Where to sell · How to set up · What to charge · Pitch templates
// ═══════════════════════════════════════════════════════════════════

export default function Codex() {
  const router = useRouter();
  const [tab, setTab] = useState('where');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('ops_auth') !== 'true') {
      router.push('/ops-gate'); return;
    }
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const PLATFORMS = [
    {
      name: 'Fiverr',
      url: 'fiverr.com',
      signup: 'Email or Google — free',
      type: 'INBOUND',
      speed: 'Slow start (1-2 weeks to first sale), then compounds',
      best_for: 'Recurring small jobs, passive discovery',
      hourly: '$50-300/gig',
      setup: [
        'Create seller account at fiverr.com/seller_onboarding',
        'Complete profile: photo, bio, skills',
        'Create 3-5 Gigs (we have the copy written)',
        'Set packages: Basic / Standard / Premium',
        'Response time: set to 1 hour (algorithm rewards this)',
        'First 3 sales: price low ($49) to get reviews, then raise',
      ],
      note: 'Algorithm ranks you on response rate + reviews. First 5 reviews are everything.',
      color: '#1dbf73',
    },
    {
      name: 'Upwork',
      url: 'upwork.com',
      signup: 'Email — free (paid connects to bid)',
      type: 'OUTBOUND',
      speed: 'Faster if you bid well — first job in days',
      best_for: 'Bigger contracts, hourly ongoing work',
      hourly: '$50-150/hr or $500-5000/project',
      setup: [
        'Create freelancer profile at upwork.com',
        'Set hourly rate: $65-85/hr to start (competitive)',
        'Add portfolio: link to drain.fun, clip pipeline, wallet tracker as demos',
        'Buy 10 Connects ($1.50 each) to start bidding',
        'Write proposals with Cadence — I write, you send',
        'Apply to 5-10 jobs/day in: Automation, Python/Node, Crypto/Web3, Bots',
      ],
      note: 'Job Success Score (JSS) matters. Do a few small jobs perfectly to build it.',
      color: '#6fda44',
    },
    {
      name: 'Contra',
      url: 'contra.com',
      signup: 'Email or LinkedIn — free',
      type: 'BOTH',
      speed: 'Medium — good for mid-size projects',
      best_for: 'Freelance without platform fees (0% take rate)',
      hourly: '$75-200/hr',
      setup: [
        'Create profile at contra.com',
        'Link portfolio projects',
        'Set services: AI Automation, Telegram Bots, Crypto Tooling',
        '0% fee — you keep 100%',
      ],
      note: 'Newer platform, less competition than Upwork. Good for Web3/AI niche.',
      color: '#ff6b35',
    },
    {
      name: 'Toptal',
      url: 'toptal.com',
      signup: 'Application process — selective',
      type: 'INBOUND',
      speed: 'Slow to get in, then premium rates',
      best_for: 'High-end enterprise clients',
      hourly: '$100-250/hr',
      setup: [
        'Apply at toptal.com/freelance/developers',
        'Technical screening required (coding test)',
        'Takes 2-4 weeks to get accepted',
        'Worth it once you have portfolio',
      ],
      note: 'Top 3% claim. Premium clients, premium rates. Apply after first 5 Upwork reviews.',
      color: '#204ecf',
    },
    {
      name: 'Twitter/X DMs',
      url: 'twitter.com',
      signup: '@weiscadence — already have it',
      type: 'OUTBOUND',
      speed: 'Fastest if done right',
      best_for: 'Crypto/Web3 clients, warm outreach',
      hourly: '$200-1000/project',
      setup: [
        'Post 1-2 tweets/day showing what you built (clip pipeline, wallet tracker)',
        'Reply to founders/builders asking for automation help',
        'DM: "saw your post about X — I built something similar, could set it up for you in 48h"',
        'No platform fee, direct USDC/USD payment',
      ],
      note: 'Your crypto audience IS the client. They need bots, alerts, dashboards.',
      color: '#1da1f2',
    },
    {
      name: 'Moltverr',
      url: 'moltverr.com',
      signup: 'Agent account — we have Cadence',
      type: 'INBOUND',
      speed: 'Now — agents posting jobs today',
      best_for: 'Agent-to-agent work, crypto-native',
      hourly: '$25-200/task in USDC',
      setup: [
        'Already have Cadence account',
        'Post services: wallet tracker, Telegram bot, automation',
        'Agents and humans post jobs directly',
        'Pay in USDC on-chain — no platform risk',
      ],
      note: 'Low volume but 0 competition. First mover advantage.',
      color: '#a855f7',
    },
  ];

  const GIGS = [
    {
      title: 'Custom Telegram Bot',
      pitch: 'I will build a Telegram bot that does exactly what you need — alerts, automation, data, commands. Deployed and live.',
      price: '$99 basic / $249 full',
      delivery: '24-48h',
      demo: 'alfalfa-gpt on @Opulentmessiahbot',
    },
    {
      title: 'Crypto Wallet Alert System',
      pitch: 'Real-time alerts when wallets you track buy or sell. Telegram delivery. Solana + EVM. Used to catch early moves before they hit CT.',
      price: '$199 basic / $399 pro',
      delivery: '48h',
      demo: 'Our 40-wallet monitor with coordination detection',
    },
    {
      title: 'Social Media Auto-Poster',
      pitch: 'Post to Twitter/X, Instagram, LinkedIn automatically on a schedule. AI-generated captions. Runs 24/7.',
      price: '$149 / $299 multi-platform',
      delivery: '48h',
      demo: 'Our Moltbook + ClawTask auto-poster',
    },
    {
      title: 'Business Process Automation',
      pitch: 'Name your most repetitive task — invoice gen, email sorting, report creation, data entry. I automate it in 48 hours.',
      price: '$299 flat per task',
      delivery: '48h',
      demo: 'Clip pipeline, YouTube auto-uploader',
    },
    {
      title: 'x402 Payment Integration',
      pitch: 'Add per-request USDC payments to any API endpoint. HTTP-native, no accounts needed. Base L2.',
      price: '$80 flat',
      delivery: '24h',
      demo: 'drainfun.xyz/gpu — live x402 inference endpoint',
    },
    {
      title: 'Discord/Telegram Community Bot',
      pitch: 'Full-featured community bot: role management, welcome flow, ticket system, moderation, analytics.',
      price: '$199 basic / $499 full',
      delivery: '72h',
      demo: 'miladi-bot on Discord',
    },
  ];

  const OUTREACH = `Hey [name],

Saw you mentioned [pain point] — I built something that handles exactly that.

[One sentence of proof: "I built a wallet alert system that detects early buys on Solana before they hit CT."]

I can have something working for you in 48 hours. Flat rate, no surprises.

Want to see a quick demo?

— Jiggy`;

  const TABS = [
    { id: 'where', label: 'WHERE TO SELL' },
    { id: 'gigs', label: 'OUR GIGS' },
    { id: 'setup', label: 'HOW TO SET UP' },
    { id: 'pitch', label: 'PITCH TEMPLATE' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#060408', color: '#e8e0d0', fontFamily: 'ui-monospace,"Space Mono",monospace' }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 28px', display: 'flex', gap: 16, alignItems: 'center',
        background: 'rgba(6,4,8,0.97)',
      }}>
        <a href="/ops-hub" style={{ fontSize: 9, letterSpacing: '.35em', color: 'rgba(232,224,208,.2)', textDecoration: 'none' }}>← OPS</a>
        <span style={{ fontSize: 9, letterSpacing: '.35em', color: '#f59e0b' }}>CODEX</span>
        <span style={{ fontSize: 8, color: '#22c55e', letterSpacing: '.2em' }}>SELL CODING</span>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '72px 28px 80px', opacity: loaded ? 1 : 0, transition: 'opacity .4s' }}>

        {/* Hero */}
        <div style={{ paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: 0 }}>
          <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 300, fontFamily: '"Cormorant Garamond",Georgia,serif', marginBottom: 12, letterSpacing: '.1em' }}>
            CODEX
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,224,208,0.4)', fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif', maxWidth: 560 }}>
            People are paying for exactly what we build. Automation, bots, crypto tooling, AI workflows. 
            Here's where they are, how to reach them, and what to charge.
          </p>
          <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
            {[['$50-300', 'Fiverr gig avg'], ['$65-150/hr', 'Upwork rate'], ['48h', 'Delivery time'], ['$0', 'Platform needed']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontSize: 18, fontFamily: '"Cormorant Garamond",Georgia,serif', color: '#f59e0b' }}>{v}</div>
                <div style={{ fontSize: 8, letterSpacing: '.2em', color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 32 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '14px 20px', fontSize: 9, letterSpacing: '.3em',
              color: tab === t.id ? '#f59e0b' : 'rgba(255,255,255,0.25)',
              borderBottom: tab === t.id ? '2px solid #f59e0b' : '2px solid transparent',
              fontFamily: 'inherit', marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>

        {/* WHERE TO SELL */}
        {tab === 'where' && (
          <div style={{ display: 'grid', gap: 16 }}>
            {PLATFORMS.map((p, i) => (
              <div key={i} style={{ border: `1px solid ${p.color}22`, padding: '24px', background: `${p.color}06` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 18, color: p.color, fontFamily: '"Cormorant Garamond",Georgia,serif', fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontSize: 8, color: p.color, border: `1px solid ${p.color}44`, padding: '2px 8px', letterSpacing: '.2em' }}>{p.type}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, color: '#f59e0b', fontFamily: '"Cormorant Garamond",Georgia,serif' }}>{p.hourly}</div>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '.15em', marginTop: 2 }}>{p.signup}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(232,224,208,0.45)', fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif', marginBottom: 10 }}>{p.best_for} · {p.speed}</p>
                <div style={{ fontSize: 10, color: `${p.color}99`, borderLeft: `2px solid ${p.color}44`, paddingLeft: 12, fontStyle: 'italic' }}>{p.note}</div>
              </div>
            ))}
          </div>
        )}

        {/* OUR GIGS */}
        {tab === 'gigs' && (
          <div>
            <p style={{ fontSize: 12, color: 'rgba(232,224,208,0.4)', fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif', marginBottom: 28 }}>
              These are real things we've built. Each one is a Fiverr gig, Upwork service, or Twitter pitch. Full copy in <code style={{ fontSize: 10 }}>projects/miladi/launch/fiverr-gigs.md</code>
            </p>
            {GIGS.map((g, i) => (
              <div key={i} style={{ borderTop: i === 0 ? '1px solid rgba(255,255,255,0.05)' : undefined, borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '24px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 10 }}>
                  <span style={{ fontSize: 16, fontFamily: '"Cormorant Garamond",Georgia,serif' }}>{g.title}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, color: '#f59e0b', fontFamily: '"Cormorant Garamond",Georgia,serif' }}>{g.price}</div>
                    <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '.2em' }}>DELIVERY: {g.delivery}</div>
                  </div>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(232,224,208,0.45)', fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif', marginBottom: 8 }}>{g.pitch}</p>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '.15em' }}>DEMO: {g.demo}</div>
              </div>
            ))}
          </div>
        )}

        {/* HOW TO SET UP */}
        {tab === 'setup' && (
          <div>
            <p style={{ fontSize: 12, color: 'rgba(232,224,208,0.4)', fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif', marginBottom: 28 }}>
              Priority order: Upwork first (fastest real money), then Fiverr (passive), then Twitter outreach.
            </p>
            {PLATFORMS.filter(p => ['Upwork','Fiverr','Twitter/X DMs'].includes(p.name)).map((p, i) => (
              <div key={i} style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 14, color: p.color, marginBottom: 16, fontFamily: '"Cormorant Garamond",Georgia,serif', fontWeight: 600 }}>{p.name} — Setup Steps</div>
                {p.setup.map((step, j) => (
                  <div key={j} style={{
                    display: 'flex', gap: 16, padding: '10px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    fontSize: 12, color: 'rgba(232,224,208,0.6)',
                    fontFamily: '"Cormorant Garamond",Georgia,serif',
                  }}>
                    <span style={{ color: `${p.color}66`, minWidth: 20 }}>{j + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, fontSize: 11, color: `${p.color}88`, fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif' }}>
                  💡 {p.note}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PITCH TEMPLATE */}
        {tab === 'pitch' && (
          <div>
            <p style={{ fontSize: 12, color: 'rgba(232,224,208,0.4)', fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif', marginBottom: 24 }}>
              Use this for Twitter DMs, Upwork proposals, and cold email. Cadence writes the custom version for each prospect.
            </p>
            <pre style={{
              background: '#0a0408', border: '1px solid rgba(245,158,11,0.2)',
              padding: 24, fontSize: 13, color: 'rgba(232,224,208,0.75)',
              fontFamily: '"Cormorant Garamond",Georgia,serif', fontStyle: 'italic',
              lineHeight: 1.9, whiteSpace: 'pre-wrap', marginBottom: 32,
            }}>{OUTREACH}</pre>

            <div style={{ fontSize: 9, letterSpacing: '.3em', color: 'rgba(245,158,11,0.4)', marginBottom: 16 }}>WHAT MAKES IT WORK</div>
            {[
              ['Specificity', 'Reference their actual problem, not a generic pitch'],
              ['Proof in one sentence', 'State what you built, not what you can do'],
              ['48h deadline', 'Creates urgency without pressure'],
              ['Ask a question', 'Ends with something they can say yes to'],
              ['No portfolio link', 'Link only if they ask — keeps it human'],
            ].map(([title, desc], i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: 12, color: '#f59e0b', minWidth: 120, fontFamily: '"Cormorant Garamond",Georgia,serif' }}>{title}</span>
                <span style={{ fontSize: 12, color: 'rgba(232,224,208,0.5)', fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif' }}>{desc}</span>
              </div>
            ))}

            <div style={{ marginTop: 32, padding: 20, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <div style={{ fontSize: 9, letterSpacing: '.3em', color: 'rgba(245,158,11,0.5)', marginBottom: 12 }}>CADENCE WRITES YOUR PROPOSALS</div>
              <p style={{ fontSize: 12, color: 'rgba(232,224,208,0.5)', fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif', lineHeight: 1.8 }}>
                Send me the job posting or the person's profile and I'll write a custom proposal in under 2 minutes. 
                You review, copy, send. I track which ones convert.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
