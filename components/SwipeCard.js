'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

function RiskBadge({ badge }) {
  const colors = {
    green: 'bg-green-500/20 text-green-400 border-green-500/50',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    red: 'bg-red-500/20 text-red-400 border-red-500/50',
    gray: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
  };
  return (
    <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${colors[badge.color] || colors.gray} tracking-wider`}>
      {badge.label}
    </span>
  );
}

// Generate a colorful gradient background from mint address
function mintToGradient(mint) {
  const h1 = (mint.charCodeAt(0) * 37 + mint.charCodeAt(1) * 13) % 360;
  const h2 = (h1 + 120) % 360;
  return `linear-gradient(135deg, hsl(${h1},70%,15%) 0%, #0a0a0a 50%, hsl(${h2},70%,12%) 100%)`;
}

export default function SwipeCard({ token, onSwipe, style }) {
  const [expanded, setExpanded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [bought, setBought] = useState(null);
  const [imgError, setImgError] = useState(false);

  const handleBuy = async (e) => {
    e.stopPropagation();
    setBuying(true);
    try {
      const res = await fetch('/api/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mint: token.mint, symbol: token.symbol, action: 'buy' }),
      });
      const data = await res.json();
      setBought(data);
      setTimeout(() => onSwipe('right', token), 1400);
    } catch {
      setBuying(false);
    }
  };

  const fmtNum = (n) => {
    if (!n) return '$—';
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
    return `$${n}`;
  };

  const bgGradient = mintToGradient(token.mint || 'abc');

  // Use DiceBear as fallback image
  const imageUrl = (!imgError && token.image)
    ? token.image
    : `https://api.dicebear.com/7.x/shapes/svg?seed=${token.symbol}&backgroundColor=0a0a0a&shapeColor=9333ea,06b6d4,22c55e`;

  return (
    <motion.div
      style={style}
      className="absolute inset-0 w-full h-full"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.75}
      onDragEnd={(_, info) => {
        if (info.offset.x > 110) onSwipe('right', token);
        else if (info.offset.x < -110) onSwipe('left', token);
      }}
    >
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col select-none cursor-grab active:cursor-grabbing border border-white/10"
        style={{ background: '#0f0f0f' }}
      >

        {/* ── HERO IMAGE (tall, full-bleed) ── */}
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ height: '52%', background: bgGradient }}
        >
          {/* Token image — large, centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={token.name}
              onError={() => setImgError(true)}
              className="w-36 h-36 rounded-2xl object-cover border border-white/10 shadow-2xl"
              style={{ imageRendering: 'auto' }}
            />
          </div>

          {/* Subtle vignette at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0f0f0f] to-transparent" />

          {/* PvP badge */}
          {token.pvpFlag && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-lg animate-pulse shadow-lg">
              ⚔️ PvP WAR
            </div>
          )}

          {/* Verified creator badge */}
          {token.creatorVerified && token.feeShare > 0 && (
            <div className="absolute top-3 left-3 bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-bold px-2 py-1 rounded-lg backdrop-blur-sm">
              ✓ {token.creator}
            </div>
          )}

          {/* Attention tag — overlaid on bottom of image */}
          {token.attentionTag && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
              <span className="text-xs text-cyan-300 font-semibold">🔥 {token.attentionTag}</span>
            </div>
          )}
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-3" style={{ minHeight: 0 }}>

          {/* Name + Risk */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-2xl font-black text-white leading-none">{token.name}</h2>
              <span className="text-sm text-gray-500">${token.symbol}</span>
            </div>
            <RiskBadge badge={token.rugcheck?.badge || { label: 'UNKNOWN', color: 'gray' }} />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { label: 'MCap', val: fmtNum(token.mcap) },
              { label: '24h Vol', val: fmtNum(token.volume24h) },
              { label: 'Age', val: token.age },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-2.5 border border-white/5">
                <div className="text-xs text-gray-500 mb-0.5">{s.label}</div>
                <div className="text-sm font-black text-white">{s.val}</div>
              </div>
            ))}
          </div>

          {/* Signals */}
          <div className="space-y-2">
            {/* Smart wallets */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-16 flex-shrink-0">Smart $</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{ width: `${Math.min(100, (token.smartWallets / 300) * 100)}%` }}
                />
              </div>
              <span className="text-xs text-purple-300 font-black w-20 text-right">{token.smartWallets} wallets</span>
            </div>

            {/* Sentiment */}
            {token.sentiment && (() => {
              const pct = Math.round(token.sentiment.score * 100);
              const label = token.sentiment.label;
              const color = label === 'bullish' ? '#22c55e' : label === 'bearish' ? '#ef4444' : '#eab308';
              return (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-16 flex-shrink-0">X Sentiment</span>
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <span className="text-xs font-black w-20 text-right" style={{ color }}>{label} {pct}%</span>
                </div>
              );
            })()}
          </div>

          {/* Rugcheck pills */}
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${token.rugcheck?.mutable ? 'bg-yellow-500/15 text-yellow-400' : 'bg-green-500/15 text-green-400'}`}>
              {token.rugcheck?.mutable ? '⚠ Mutable' : '✓ Immutable'}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${(token.rugcheck?.lpLocked || 0) > 80 ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
              {(token.rugcheck?.lpLocked || 0) > 80 ? `✓ LP locked` : `⚠ LP unlocked`}
            </span>
            {token.jitoMentions > 0 && (
              <span className="text-xs bg-purple-500/15 text-purple-300 px-2.5 py-1 rounded-lg font-bold">
                ⚡ {token.jitoMentions} Jito bundles
              </span>
            )}
            {token.feeShare > 0 && (
              <span className="text-xs bg-cyan-500/15 text-cyan-300 px-2.5 py-1 rounded-lg font-bold">
                💰 {token.feeShare}% fee share
              </span>
            )}
          </div>

          {/* Expanded: tweets */}
          {expanded && token.sentiment?.tweets && (
            <div className="space-y-2 pt-1">
              <div className="text-xs font-black text-gray-500 uppercase tracking-widest">Top X Mentions</div>
              {token.sentiment.tweets.slice(0, 3).map((t, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 text-xs border border-white/5">
                  <div className="flex justify-between mb-1">
                    <span className="text-cyan-400 font-bold">{t.author}</span>
                    <span className="text-gray-600">{t.likes.toLocaleString()} ♥</span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-xs text-gray-600 hover:text-gray-400 transition"
          >
            {expanded ? '↑ less' : '↓ more signals'}
          </button>
        </div>

        {/* ── ACTION BUTTONS ── */}
        <div className="px-4 pb-4 pt-2 flex gap-3 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onSwipe('left', token); }}
            className="flex-1 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-black text-lg hover:bg-red-500/20 active:scale-95 transition-all"
          >
            ✕ Skip
          </button>
          <button
            onClick={handleBuy}
            disabled={buying || !!bought}
            className="flex-1 py-3.5 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 font-black text-lg hover:bg-green-500/20 active:scale-95 transition-all disabled:opacity-40"
          >
            {buying ? '⋯' : bought ? '✓ Sent!' : '♥ Buy'}
          </button>
        </div>

        {/* Buy overlay */}
        {bought && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-green-500/15 backdrop-blur-sm flex items-center justify-center rounded-2xl"
          >
            <div className="text-center px-6">
              <div className="text-5xl mb-3">✅</div>
              <div className="text-white font-black text-lg">Testnet buy sent!</div>
              <div className="text-green-300 text-sm mt-1">{bought.message}</div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
