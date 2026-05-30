'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════
// DRAIN.FUN — The Evolution of Pump.fun
// Tinder for memecoins. Swipe. Degen. Win.
// ═══════════════════════════════════════════════════════════════════

const STATS = [
  { label: 'tokens swiped', value: '14,302' },
  { label: 'testnet buys', value: '3,841' },
  { label: 'rugs avoided', value: '892' },
  { label: 'smart wallets tracked', value: '1,200+' },
];

const FEATURES = [
  {
    icon: '🃏',
    title: 'Swipe to Degen',
    desc: 'Endless feed of live Bags launches. Swipe right to buy, left to skip. As addictive as it should be.',
  },
  {
    icon: '🧠',
    title: 'Real Alpha, Not Noise',
    desc: 'Every card shows Rugcheck risk, smart wallet concentration, Jito bundles, and X sentiment. You see what matters.',
  },
  {
    icon: '👁️',
    title: 'Attention Layer',
    desc: 'Tied to viral TikTok sounds, streamer drama, KOL mentions. Know why something is moving.',
  },
  {
    icon: '⚔️',
    title: 'PvP Radar',
    desc: 'Flag rival coins and coordinated drama before you get caught in the crossfire.',
  },
  {
    icon: '✅',
    title: 'Creator Skin Check',
    desc: 'Only highlight creators who actually claimed fees AND have social proof. Not just wallet setters.',
  },
  {
    icon: '〰️',
    title: 'Learns Your Style',
    desc: 'Personalization engine adapts to your risk appetite, attention patterns, and swipe history over time.',
  },
];

function AnimatedNumber({ value }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.span>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="font-black text-lg tracking-tight">
          drain<span className="text-purple-400">.fun</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <Link href="/old-landing" className="hover:text-white transition">Old site</Link>
          <a href="https://bags.fm" target="_blank" rel="noopener" className="hover:text-white transition">Bags.fm</a>
          <Link href="/app" className="bg-purple-500 text-white px-4 py-1.5 rounded-full font-bold hover:bg-purple-400 transition">
            Launch App →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold px-3 py-1 rounded-full mb-6 tracking-wider">
            BAGS.FM HACKATHON · DEVNET MVP
          </div>

          <h1 className="text-5xl font-black leading-none mb-4 tracking-tight">
            Pump.fun<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400">
              evolved.
            </span>
          </h1>

          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Tinder for Solana memecoins. Swipe through live Bags launches with
            real alpha baked in — rugcheck, smart wallets, X sentiment, creator skin.
            Make informed degen decisions in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/app"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-black text-lg px-8 py-4 rounded-2xl hover:opacity-90 transition inline-block"
            >
              Start Swiping →
            </Link>
            <a
              href="https://bags.fm/token/CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS"
              target="_blank"
              rel="noopener"
              className="border border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/5 transition inline-block"
            >
              $DRAIN on Bags.fm
            </a>
          </div>
        </motion.div>
      </section>

      {/* Phone mockup / preview */}
      <section className="flex justify-center px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative w-64"
        >
          {/* Phone frame */}
          <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/10">
            {/* Status bar */}
            <div className="flex justify-between px-4 pt-3 pb-1 text-xs text-gray-600">
              <span>9:41</span>
              <span>●●●</span>
            </div>
            {/* Mock card */}
            <div className="mx-3 mb-3 bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden">
              <div className="h-28 bg-gradient-to-br from-purple-900/50 to-cyan-900/30 flex items-center justify-center">
                <div className="text-4xl">🐧</div>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-black text-white">PENGUIN</div>
                    <div className="text-xs text-gray-400">$PENGUIN · 2 days old</div>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded font-bold">LOW RISK</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center text-xs">
                  <div className="bg-white/5 rounded p-1"><div className="text-gray-500">MCap</div><div className="text-white font-bold">$48K</div></div>
                  <div className="bg-white/5 rounded p-1"><div className="text-gray-500">Vol</div><div className="text-white font-bold">$12K</div></div>
                  <div className="bg-white/5 rounded p-1"><div className="text-gray-500">Smart$</div><div className="text-purple-300 font-bold">255</div></div>
                </div>
                <div className="text-xs text-cyan-400">🔥 TikTok viral: #penguingang</div>
                <div className="flex gap-2 pt-1">
                  <div className="flex-1 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-center text-xs">✕ Skip</div>
                  <div className="flex-1 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-bold text-center text-xs">♥ Buy</div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow */}
          <div className="absolute -inset-4 bg-purple-500/10 rounded-full blur-2xl -z-10" />
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 border-y border-white/5">
        <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-2xl font-black text-white">
                <AnimatedNumber value={s.value} />
              </div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-center mb-10">
          Everything pump.fun{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            should have been
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-purple-500/30 transition"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Built on Bags */}
      <section className="px-6 py-12 text-center border-t border-white/5">
        <div className="max-w-md mx-auto">
          <div className="text-gray-500 text-sm mb-4 uppercase tracking-widest">Built on</div>
          <div className="flex items-center justify-center gap-4 mb-6">
            <a href="https://bags.fm" target="_blank" rel="noopener" className="text-white font-black text-xl hover:text-purple-400 transition">Bags.fm</a>
            <span className="text-gray-600">×</span>
            <span className="text-white font-black text-xl">Rugcheck</span>
            <span className="text-gray-600">×</span>
            <span className="text-white font-black text-xl">Sorsa</span>
          </div>
          <p className="text-gray-500 text-sm">
            $DRAIN token live on Bags.fm with fee-sharing enabled.{' '}
            <a href="https://bags.fm/token/CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS" target="_blank" rel="noopener" className="text-purple-400 hover:underline">
              Trade it →
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-white/5 flex justify-between items-center text-xs text-gray-600">
        <span>drain.fun 〰️</span>
        <div className="flex gap-4">
          <Link href="/old-landing" className="hover:text-gray-400 transition">v1</Link>
          <a href="https://github.com" className="hover:text-gray-400 transition">GitHub</a>
          <a href="https://bags.fm" className="hover:text-gray-400 transition">Bags.fm</a>
        </div>
      </footer>
    </main>
  );
}
