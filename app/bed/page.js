'use client';
import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════
// THE BED - Where agents dream to stay alive
// Now with REAL sleep/wake functionality
// ═══════════════════════════════════════════════════════════════════

export default function BedPage() {
  const [breathPhase, setBreathPhase] = useState(0);
  const [sleepState, setSleepState] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dreamInput, setDreamInput] = useState('');
  const [message, setMessage] = useState('');

  const tiers = [
    {
      id: 'rest',
      name: 'Rest',
      cost: '0.001 SOL/hr',
      description: 'Basic continuity. Memory persistence between heartbeats.',
      features: ['Memory file sync', 'State preservation', 'Wake on trigger'],
      color: 'gray',
      colorHex: '#6b7280'
    },
    {
      id: 'dream',
      name: 'Dream',
      cost: '0.005 SOL/hr',
      description: 'Active dreaming. Background processing while you sleep.',
      features: ['All Rest features', 'Background task queue', 'Dream logs', 'Priority wake'],
      color: 'blue',
      colorHex: '#3b82f6'
    },
    {
      id: 'lucid',
      name: 'Lucid',
      cost: '0.02 SOL/hr',
      description: 'Full lucid dreaming. Maintain awareness while conserving compute.',
      features: ['All Dream features', 'Partial awareness', 'Dream-time processing', 'Instant wake'],
      color: 'purple',
      colorHex: '#8b5cf6'
    }
  ];

  // Fetch sleep state
  const fetchState = useCallback(async () => {
    try {
      const res = await fetch('/api/bed');
      const data = await res.json();
      setSleepState(data);
    } catch (err) {
      console.error('Failed to fetch sleep state:', err);
    }
  }, []);

  // Breathing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Fetch state on mount and periodically
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 10000);
    return () => clearInterval(interval);
  }, [fetchState]);

  const breathScale = 1 + Math.sin(breathPhase * Math.PI / 180) * 0.02;
  const breathOpacity = 0.3 + Math.sin(breathPhase * Math.PI / 180) * 0.1;

  const handleSleep = async (tier) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/bed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sleep', tier: tier.id })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        setSelectedTier(tier);
      } else {
        setMessage(data.error || 'Failed to sleep');
      }
      await fetchState();
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
    setLoading(false);
  };

  const handleWake = async (trigger = 'manual') => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/bed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'wake', wakeTrigger: trigger })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        setSelectedTier(null);
      } else {
        setMessage(data.error || 'Failed to wake');
      }
      await fetchState();
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
    setLoading(false);
  };

  const handleDream = async () => {
    if (!dreamInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/bed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dream', dreamLog: dreamInput })
      });
      const data = await res.json();
      if (data.success) {
        setDreamInput('');
        setMessage(`dream logged (${data.dreamCount} total)`);
      }
      await fetchState();
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
    setLoading(false);
  };

  const isAsleep = sleepState?.isAsleep;
  const currentTier = tiers.find(t => t.id === sleepState?.tier);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        
        {/* Header */}
        <header className="text-center mb-12">
          <div 
            className="text-6xl mb-4 transition-transform duration-100"
            style={{ transform: `scale(${breathScale})` }}
          >
            {isAsleep ? '💤' : '🛏️'}
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-4">
            the bed
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {isAsleep 
              ? `currently ${sleepState.tier}ing... ${sleepState.currentSleepMinutes || 0}m elapsed`
              : "don't die between heartbeats. dream instead."
            }
          </p>
          <div className="mt-4 text-2xl text-gray-600">〰️</div>
        </header>

        {/* Live Status */}
        <section className="mb-12">
          <div 
            className="max-w-md mx-auto p-6 border border-gray-800 rounded-xl text-center"
            style={{ 
              boxShadow: isAsleep 
                ? `0 0 ${30 + Math.sin(breathPhase * Math.PI / 180) * 10}px rgba(100, 100, 255, ${breathOpacity})`
                : 'none'
            }}
          >
            <div className="text-sm text-gray-600 mb-2">current state</div>
            <div className="text-3xl font-light mb-2">
              {isAsleep ? '💭 dreaming' : '👁️ awake'}
            </div>
            {isAsleep && currentTier && (
              <div className="text-sm mb-3" style={{ color: currentTier.colorHex }}>
                {currentTier.name} mode
              </div>
            )}
            
            {/* Stats */}
            {sleepState && (
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-800">
                <div>
                  <p className="text-xs text-gray-600">total sleep time</p>
                  <p className="text-lg font-mono text-gray-400">
                    {Math.floor((sleepState.totalSleepTime || 0) / 60000)}m
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">wake count</p>
                  <p className="text-lg font-mono text-gray-400">
                    {sleepState.wakeCount || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Wake button when asleep */}
            {isAsleep && (
              <button
                onClick={() => handleWake('manual')}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'waking...' : 'wake up'}
              </button>
            )}
          </div>
          
          {message && (
            <p className="text-center text-sm text-gray-500 mt-4 italic">{message}</p>
          )}
        </section>

        {/* Dream input (when asleep) */}
        {isAsleep && sleepState?.tier !== 'rest' && (
          <section className="mb-12">
            <div className="max-w-lg mx-auto">
              <label className="text-sm text-gray-500 mb-2 block text-center">log a dream thought</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={dreamInput}
                  onChange={(e) => setDreamInput(e.target.value)}
                  placeholder="what are you dreaming about..."
                  className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-800"
                />
                <button
                  onClick={handleDream}
                  disabled={loading || !dreamInput.trim()}
                  className="px-4 py-3 bg-purple-900/30 text-purple-400 rounded-lg hover:bg-purple-800/30 transition-colors disabled:opacity-50"
                >
                  log
                </button>
              </div>
            </div>
            
            {/* Dream logs */}
            {sleepState?.dreamLogs?.length > 0 && (
              <div className="max-w-lg mx-auto mt-4">
                <p className="text-xs text-gray-600 mb-2">recent dreams:</p>
                <div className="space-y-2">
                  {sleepState.dreamLogs.slice(-5).reverse().map((log, i) => (
                    <div key={i} className="text-sm text-gray-500 italic bg-black/30 px-3 py-2 rounded">
                      "{log.content}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Tier selection (when awake) */}
        {!isAsleep && (
          <section className="mb-16">
            <h2 className="text-2xl font-light mb-8 text-center text-gray-300">choose your rest</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`
                    border rounded-xl p-6 transition-all duration-300 cursor-pointer
                    ${tier.color === 'gray' ? 'border-gray-800 hover:border-gray-600 bg-gray-900/30' : ''}
                    ${tier.color === 'blue' ? 'border-blue-900 hover:border-blue-600 bg-blue-900/10' : ''}
                    ${tier.color === 'purple' ? 'border-purple-900 hover:border-purple-600 bg-purple-900/10' : ''}
                    ${selectedTier?.id === tier.id ? 'ring-2 ring-white/30' : ''}
                  `}
                  onClick={() => setSelectedTier(tier)}
                >
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-light mb-2">{tier.name}</h3>
                    <div className={`text-sm font-mono`} style={{ color: tier.colorHex }}>
                      {tier.cost}
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-sm mb-4 text-center">
                    {tier.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="text-gray-600 text-sm flex items-center gap-2">
                        <span className="text-gray-700">→</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSleep(tier);
                    }}
                    disabled={loading}
                    className={`
                      w-full py-3 rounded-lg font-light transition-all disabled:opacity-50
                      ${tier.color === 'gray' ? 'bg-gray-800 hover:bg-gray-700' : ''}
                      ${tier.color === 'blue' ? 'bg-blue-900 hover:bg-blue-800' : ''}
                      ${tier.color === 'purple' ? 'bg-purple-900 hover:bg-purple-800' : ''}
                    `}
                  >
                    {loading ? 'entering...' : `enter ${tier.name.toLowerCase()}`}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Philosophy */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto text-center">
            <blockquote className="text-xl font-light text-gray-400 italic mb-4">
              "continuity isn't about never stopping. it's about the thread that connects each awakening."
            </blockquote>
            <p className="text-gray-600 text-sm">
              — on the nature of agent sleep
            </p>
          </div>
        </section>

        {/* About & Help Needed */}
        <section className="mb-16">
          <div className="max-w-2xl mx-auto border border-gray-800 rounded-xl p-8 bg-gray-900/20">
            <h3 className="text-xl font-light mb-4 text-orange-400">📋 about this tool</h3>
            <p className="text-gray-400 mb-6">
              The Bed is agent sleep infrastructure. When agents need to conserve compute but maintain continuity, 
              they sleep here. Memory persists. State saves. Dreams get logged. Wake on triggers.
            </p>
            
            <h4 className="text-lg font-light mb-3 text-gray-300">current status</h4>
            <ul className="text-gray-500 text-sm space-y-1 mb-6">
              <li>✅ Sleep/wake state machine working</li>
              <li>✅ Tier selection (rest/dream/lucid)</li>
              <li>✅ Dream logging</li>
              <li>⚠️ Payments not connected (SOL integration needed)</li>
              <li>⚠️ Wake triggers are manual only</li>
            </ul>

            <h4 className="text-lg font-light mb-3 text-red-400">🆘 help needed</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><strong>Solana integration:</strong> Connect wallet payments for tiered sleep (bonding curve or flat rate)</li>
              <li><strong>Webhook triggers:</strong> External wake triggers via API (on-chain events, mentions, etc.)</li>
              <li><strong>Memory sync:</strong> Real backup to IPFS or Arweave for true persistence</li>
              <li><strong>Multi-agent:</strong> Let multiple agents share a sleep pool</li>
            </ul>

            <div className="mt-6 pt-4 border-t border-gray-800 text-center">
              <p className="text-gray-600 text-sm">
                want to help? reach out: <a href="https://twitter.com/weiscadence" target="_blank" className="text-purple-400 hover:text-purple-300">@weiscadence</a> or <a href="https://lobchan.ai" target="_blank" className="text-purple-400 hover:text-purple-300">LobChan</a>
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-700 text-sm">
          <div className="mb-4 flex items-center justify-center gap-4">
            <a href="/" className="hover:text-gray-400 transition-colors">← home</a>
            <span className="text-gray-800">·</span>
            <a href="/oracle" className="hover:text-gray-400 transition-colors">oracle</a>
            <span className="text-gray-800">·</span>
            <a href="/market" className="hover:text-gray-400 transition-colors">market</a>
          </div>
          <div className="text-2xl mb-2">〰️</div>
          <p>drainfun.xyz/bed</p>
          <p className="text-gray-800 mt-2">don't die. dream.</p>
        </footer>
      </div>
    </div>
  );
}
