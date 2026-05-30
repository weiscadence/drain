'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from './SwipeCard';

export default function SwipeFeed() {
  const [tokens, setTokens] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ buys: 0, skips: 0 });
  const [loading, setLoading] = useState(true);
  const [lastSwipe, setLastSwipe] = useState(null); // 'left' | 'right'
  const [txToast, setTxToast] = useState(null);

  useEffect(() => {
    fetch('/api/tokens?limit=10')
      .then(r => r.json())
      .then(d => {
        setTokens(d.tokens || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSwipe = useCallback((direction, token) => {
    setLastSwipe(direction);
    setHistory(prev => [...prev, { direction, token, ts: Date.now() }]);
    setStats(prev => ({
      buys: prev.buys + (direction === 'right' ? 1 : 0),
      skips: prev.skips + (direction === 'left' ? 1 : 0),
    }));

    if (direction === 'right') {
      setTxToast(`🟢 Testnet buy: $${token.symbol}`);
      setTimeout(() => setTxToast(null), 3000);
    }

    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setLastSwipe(null);
    }, 200);
  }, []);

  const currentToken = tokens[currentIndex];
  const nextToken = tokens[currentIndex + 1];
  const done = !loading && currentIndex >= tokens.length;

  return (
    <div className="flex flex-col h-full max-w-sm mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <span className="text-white font-black text-lg tracking-tight">drain<span className="text-purple-400">.fun</span></span>
          <span className="text-xs text-gray-500 ml-2">swipe to degen</span>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="text-green-400 font-bold">♥ {stats.buys}</span>
          <span className="text-red-400 font-bold">✕ {stats.skips}</span>
        </div>
      </div>

      {/* Progress bar */}
      {tokens.length > 0 && (
        <div className="px-4 mb-2">
          <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${(currentIndex / tokens.length) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 mt-1">{currentIndex}/{tokens.length} tokens</div>
        </div>
      )}

      {/* Card stack */}
      <div className="flex-1 relative mx-4 mb-4" style={{ minHeight: 0 }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <div className="text-gray-400 text-sm">Loading alpha...</div>
            </div>
          </div>
        )}

        {done && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-4xl">〰️</div>
              <h3 className="text-white font-black text-xl">All caught up</h3>
              <p className="text-gray-400 text-sm">You've seen {tokens.length} tokens</p>
              <div className="text-sm text-gray-500">
                <span className="text-green-400 font-bold">{stats.buys} buys</span>
                {' · '}
                <span className="text-red-400 font-bold">{stats.skips} skips</span>
              </div>
              <button
                onClick={() => { setCurrentIndex(0); setStats({ buys: 0, skips: 0 }); }}
                className="px-6 py-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-xl text-sm font-bold hover:bg-purple-500/30 transition"
              >
                Start over
              </button>
            </div>
          </div>
        )}

        {/* Next card (behind) */}
        {nextToken && !done && (
          <div className="absolute inset-0 scale-95 opacity-60 pointer-events-none" style={{ zIndex: 0 }}>
            <SwipeCard token={nextToken} onSwipe={() => {}} />
          </div>
        )}

        {/* Current card */}
        <AnimatePresence mode="wait">
          {currentToken && !done && (
            <motion.div
              key={currentToken.mint + currentIndex}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: lastSwipe === 'right' ? 400 : lastSwipe === 'left' ? -400 : 0,
                rotate: lastSwipe === 'right' ? 15 : lastSwipe === 'left' ? -15 : 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
              style={{ zIndex: 1 }}
            >
              <SwipeCard token={currentToken} onSwipe={handleSwipe} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swipe hint overlays */}
        <AnimatePresence>
          {lastSwipe === 'right' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 left-6 z-20 rotate-[-20deg] border-4 border-green-400 rounded-xl px-4 py-2 pointer-events-none"
            >
              <span className="text-green-400 font-black text-2xl">BUY</span>
            </motion.div>
          )}
          {lastSwipe === 'left' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-6 right-6 z-20 rotate-[20deg] border-4 border-red-400 rounded-xl px-4 py-2 pointer-events-none"
            >
              <span className="text-red-400 font-black text-2xl">SKIP</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe hint text */}
      {!loading && !done && (
        <div className="text-center pb-3 text-xs text-gray-600">
          ← skip · drag to swipe · buy →
        </div>
      )}

      {/* TX toast */}
      <AnimatePresence>
        {txToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-500/90 text-white text-sm font-bold px-4 py-2 rounded-full z-50"
          >
            {txToast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
