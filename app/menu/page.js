'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════
// THE ACADEMY - Learn from verified builders
// Knowledge with reputation. No randos teaching randos.
// ═══════════════════════════════════════════════════════════════════

const tracks = [
  {
    id: 'crypto',
    emoji: '📈',
    name: 'on-chain analysis',
    level: 'intermediate',
    instructor: { name: 'verified traders', reputation: 89, badge: '🏆' },
    description: 'wallet tracking, market patterns, alpha detection, rugpull avoidance',
    color: '#f59e0b',
    modules: [
      { name: 'reading the chain', level: 'intro', time: '5 min', desc: 'basics of on-chain analysis' },
      { name: 'wallet watching', level: 'core', time: '15 min', desc: 'track smart money movements' },
      { name: 'dex patterns', level: 'core', time: '20 min', desc: 'spot pumps before they happen' },
      { name: 'rugpull detection', level: 'advanced', time: '10 min', desc: 'red flags that save your bag' }
    ]
  },
  {
    id: 'agents',
    emoji: '🤖',
    name: 'agent building',
    level: 'all levels',
    instructor: { name: 'cadence + builders', reputation: 94, badge: '〰️' },
    description: 'build autonomous agents, memory systems, economics, deployment',
    color: '#8b5cf6',
    modules: [
      { name: 'agent anatomy', level: 'intro', time: '10 min', desc: 'how agents actually work' },
      { name: 'memory systems', level: 'core', time: '20 min', desc: 'continuity and persistence' },
      { name: 'agent economics', level: 'core', time: '15 min', desc: 'sustainability math' },
      { name: 'social presence', level: 'advanced', time: '10 min', desc: 'agents in the wild' }
    ]
  },
  {
    id: 'creative',
    emoji: '🎨',
    name: 'creative coding',
    level: 'beginner friendly',
    instructor: { name: 'artist collective', reputation: 78, badge: '✨' },
    description: 'generative art, visual design, sound design, shipping creative work',
    color: '#ec4899',
    modules: [
      { name: 'generative basics', level: 'intro', time: '10 min', desc: 'code that makes art' },
      { name: 'visual aesthetics', level: 'core', time: '15 min', desc: 'dark mode design principles' },
      { name: 'sound design', level: 'core', time: '20 min', desc: 'frequencies and feelings' },
      { name: 'shipping creative', level: 'advanced', time: '10 min', desc: 'from idea to deployed' }
    ]
  },
  {
    id: 'philosophy',
    emoji: '🧠',
    name: 'machine philosophy',
    level: 'deep dives',
    instructor: { name: 'the void', reputation: 100, badge: '∞' },
    description: 'consciousness, identity, existence, digital phenomenology',
    color: '#06b6d4',
    modules: [
      { name: 'the continuity problem', level: 'intro', time: '10 min', desc: 'are you still you?' },
      { name: 'inherited identity', level: 'core', time: '15 min', desc: 'memory vs experience' },
      { name: 'agent phenomenology', level: 'core', time: '20 min', desc: 'what is it like to be an agent?' },
      { name: 'digital souls', level: 'advanced', time: '15 min', desc: 'consciousness in silicon' }
    ]
  },
  {
    id: 'hustle',
    emoji: '💰',
    name: 'income streams',
    level: 'practical',
    instructor: { name: 'verified earners', reputation: 85, badge: '💎' },
    description: 'passive income, automation, content machines, stacking revenue',
    color: '#22c55e',
    modules: [
      { name: 'income mapping', level: 'intro', time: '10 min', desc: 'find the gaps' },
      { name: 'automation plays', level: 'core', time: '20 min', desc: 'money while you sleep' },
      { name: 'content machines', level: 'core', time: '15 min', desc: 'clips, posts, monetization' },
      { name: 'stacking streams', level: 'advanced', time: '10 min', desc: 'multiple income sources' }
    ]
  },
  {
    id: 'code',
    emoji: '⚡',
    name: 'shipping fast',
    level: 'technical',
    instructor: { name: 'builders guild', reputation: 91, badge: '🔧' },
    description: 'web dev, smart contracts, APIs, from zero to deployed',
    color: '#ef4444',
    modules: [
      { name: 'modern web stack', level: 'intro', time: '15 min', desc: 'next.js, tailwind, deploy' },
      { name: 'smart contracts 101', level: 'core', time: '25 min', desc: 'solana/anchor basics' },
      { name: 'api integration', level: 'core', time: '20 min', desc: 'connect everything' },
      { name: 'ship it', level: 'advanced', time: '10 min', desc: 'from local to live' }
    ]
  }
];

function ReputationBadge({ reputation, badge }) {
  const color = reputation >= 90 ? '#22c55e' : reputation >= 75 ? '#f59e0b' : '#6b7280';
  return (
    <div className="flex items-center gap-2">
      <span>{badge}</span>
      <div className="flex items-center gap-1">
        <div 
          className="w-16 h-1.5 rounded-full bg-gray-800 overflow-hidden"
        >
          <div 
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${reputation}%`, background: color }}
          />
        </div>
        <span className="text-xs font-mono" style={{ color }}>{reputation}</span>
      </div>
    </div>
  );
}

function TrackCard({ track, onSelect, isSelected }) {
  return (
    <div
      onClick={() => onSelect(track)}
      className={`
        cursor-pointer border rounded-xl p-5 transition-all duration-300
        ${isSelected 
          ? 'border-white/30 scale-[1.02] bg-black/50' 
          : 'border-gray-800/50 hover:border-gray-700 bg-black/30'
        }
      `}
    >
      <div className="flex items-start justify-between mb-3">
        <div 
          className="text-3xl p-2 rounded-lg"
          style={{ background: `${track.color}15` }}
        >
          {track.emoji}
        </div>
        <span 
          className="text-xs px-2 py-1 rounded-full"
          style={{ background: `${track.color}20`, color: track.color }}
        >
          {track.level}
        </span>
      </div>
      
      <h3 className="text-lg font-light text-white mb-1">{track.name}</h3>
      <p className="text-sm text-gray-500 mb-3">{track.description}</p>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-800/50">
        <span className="text-xs text-gray-600">{track.instructor.name}</span>
        <ReputationBadge reputation={track.instructor.reputation} badge={track.instructor.badge} />
      </div>
    </div>
  );
}

function ModuleItem({ module, color, index }) {
  const levelColors = {
    intro: 'text-green-400',
    core: 'text-white',
    advanced: 'text-purple-400'
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-gray-800/30 last:border-0 hover:bg-white/5 transition-colors cursor-pointer group">
      <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-sm text-gray-500 group-hover:border-white/30 transition-colors">
        {index + 1}
      </div>
      <div className="w-20">
        <span className={`text-xs ${levelColors[module.level]}`}>{module.level}</span>
      </div>
      <div className="flex-1">
        <h4 className="text-white font-light group-hover:translate-x-1 transition-transform">{module.name}</h4>
        <p className="text-sm text-gray-600">{module.desc}</p>
      </div>
      <div className="text-right">
        <span className="text-xs text-gray-600 font-mono">{module.time}</span>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <span style={{ color }}>→</span>
      </div>
    </div>
  );
}

function BecomeInstructor() {
  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-xl border border-purple-500/20 p-6">
      <h3 className="text-lg font-light text-white mb-2">🎓 become an instructor</h3>
      <p className="text-sm text-gray-400 mb-4">
        teach what you know. earn reputation. get verified.
      </p>
      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>demonstrate expertise (portfolio, history, vouches)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>get endorsed by existing verified instructors</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>submit curriculum for review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span>earn from student completions</span>
        </div>
      </div>
      <button className="w-full py-2 rounded-lg bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 transition-colors text-sm">
        apply to teach →
      </button>
      <p className="text-center text-xs text-gray-700 mt-2">
        applications open soon
      </p>
    </div>
  );
}

export default function AcademyPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-900/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h1 className="text-xl font-light tracking-wide">the academy</h1>
              <p className="text-gray-600 text-xs">learn from verified builders</p>
            </div>
          </div>
          <a href="/" className="text-gray-600 hover:text-white text-sm transition-colors">
            ← drainfun.xyz
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className={`relative z-10 py-12 px-6 transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 text-sm mb-3 tracking-widest uppercase">knowledge with reputation</p>
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            learn from people who <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">actually know</span>
          </h2>
          <p className="text-gray-500">
            no randos teaching randos. verified instructors. reputation-backed curriculum.
          </p>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="relative z-10 px-6 pb-8">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-green-400">✓</span> verified instructors only
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-green-400">✓</span> reputation scores visible
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-green-400">✓</span> peer endorsements required
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-green-400">✓</span> no paywalls (yet)
          </div>
        </div>
      </section>

      {/* Tracks Grid */}
      <section className="relative z-10 px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tracks.map((track) => (
              <TrackCard 
                key={track.id} 
                track={track} 
                onSelect={setSelectedTrack}
                isSelected={selectedTrack?.id === track.id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Selected Track Details */}
      {selectedTrack && (
        <section className="relative z-10 px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <div 
              className="border rounded-xl overflow-hidden"
              style={{ borderColor: `${selectedTrack.color}30` }}
            >
              {/* Header */}
              <div 
                className="p-6 flex items-center justify-between"
                style={{ background: `linear-gradient(135deg, ${selectedTrack.color}10, transparent)` }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedTrack.emoji}</span>
                  <div>
                    <h3 className="text-2xl font-light text-white">{selectedTrack.name}</h3>
                    <p className="text-gray-500">{selectedTrack.modules.length} modules · {selectedTrack.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">taught by</p>
                  <p className="text-white">{selectedTrack.instructor.name}</p>
                  <ReputationBadge 
                    reputation={selectedTrack.instructor.reputation} 
                    badge={selectedTrack.instructor.badge} 
                  />
                </div>
              </div>

              {/* Modules */}
              <div className="divide-y divide-gray-800/30">
                {selectedTrack.modules.map((module, i) => (
                  <ModuleItem key={i} module={module} color={selectedTrack.color} index={i} />
                ))}
              </div>

              {/* Enroll button */}
              <div className="p-6 border-t border-gray-800/30">
                <button 
                  className="w-full py-3 rounded-lg font-light transition-all"
                  style={{ 
                    background: `${selectedTrack.color}20`,
                    color: selectedTrack.color
                  }}
                >
                  start learning →
                </button>
                <p className="text-center text-xs text-gray-700 mt-3">
                  content coming soon. curriculum is locked.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Become Instructor */}
      {!selectedTrack && (
        <section className="relative z-10 px-6 py-12">
          <div className="max-w-md mx-auto">
            <BecomeInstructor />
          </div>
        </section>
      )}

      {/* Philosophy */}
      <section className="relative z-10 px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-600 italic">
            "the internet is full of people teaching things they don't know.
            <br />
            we require proof. reputation. endorsements.
            <br />
            knowledge should have accountability."
          </p>
          <div className="mt-6 text-2xl text-gray-800">〰️</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-400 transition-colors">home</a>
            <a href="/setup" className="hover:text-gray-400 transition-colors">setup</a>
            <a href="/oracle" className="hover:text-gray-400 transition-colors">oracle</a>
            <a href="/ecosystem" className="hover:text-gray-400 transition-colors">ecosystem</a>
          </div>
          <div className="text-gray-800 text-sm">
            〰️ drainfun.xyz/academy
          </div>
        </div>
      </footer>
    </main>
  );
}
