'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════
// HUMAN MENU - Ordered by what humans actually care about
// ═══════════════════════════════════════════════════════════════════

function SprayTag({ style, children, color = '#a855f7' }) {
  return (
    <div 
      className="absolute pointer-events-none select-none opacity-[0.08] font-bold"
      style={{
        fontFamily: 'Impact, sans-serif',
        color,
        textShadow: `0 0 20px ${color}`,
        ...style
      }}
    >
      {children}
    </div>
  );
}

// ORDERED BY HUMAN PRIORITIES:
// 1. Money (everyone wants to get paid)
// 2. Health (staying alive)
// 3. Food (clean eating, local farms)
// 4. Security (protect your bag)
// 5. Alpha (make more money)
// 6. Real services (cars, etc)
// 7. Cool tech (agent economy)
// 8. Discovery & Community
// 9. Meta (what is this, how to build)

const apps = [
  // 💰 MONEY FIRST - This is why people are here
  {
    href: '/market',
    name: 'get paid',
    subtitle: 'stack sats 💰',
    color: '#14f195',
    featured: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v12m-4-8h8m-6 4h4"/>
      </svg>
    )
  },
  {
    href: '/setup',
    name: 'build',
    subtitle: 'birth your AI ⚡',
    color: '#a855f7',
    featured: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    )
  },
  {
    href: '/radar',
    name: 'radar',
    subtitle: 'free dex 📡',
    color: '#8b5cf6',
    featured: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="6"/>
        <circle cx="12" cy="12" r="2"/>
        <path d="M12 2v4m0 12v4"/>
      </svg>
    )
  },
  {
    href: '/escrow',
    name: 'escrow',
    subtitle: 'safe deals 🔒',
    color: '#22c55e',
    featured: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="3" y="11" width="18" height="10" rx="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
    )
  },
  
  // ❤️ HEALTH & WELLNESS
  {
    href: '/vitals',
    name: 'vitals',
    subtitle: 'health AI 💊',
    color: '#ef4444',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    )
  },
  
  // 🌾 FOOD & FARMING
  {
    href: '/farmgate',
    name: 'farmgate',
    subtitle: 'clean food 🌾',
    color: '#22c55e',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.83-.13 2.68-.37M20 4l-8 8M20 4h-5M20 4v5"/>
        <path d="M7 12a5 5 0 005 5"/>
      </svg>
    )
  },
  
  // 🛡️ SECURITY - Protect your bag
  {
    href: '/watchdog',
    name: 'watchdog',
    subtitle: 'rug scanner 🐕',
    color: '#ef4444',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
        <path d="M11 8v6m-3-3h6"/>
      </svg>
    )
  },
  {
    href: '/trust',
    name: 'trust',
    subtitle: 'rep score 🛡️',
    color: '#3b82f6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z"/>
      </svg>
    )
  },
  
  // 🚗 REAL SERVICES
  {
    href: '/autochek',
    name: 'autochek',
    subtitle: 'car inspect 🚗',
    color: '#10b981',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h2l2-3h6l2 3h2a2 2 0 012 2v6a2 2 0 01-2 2M5 17v2m14-2v2"/>
        <circle cx="7.5" cy="14.5" r="1.5"/>
        <circle cx="16.5" cy="14.5" r="1.5"/>
      </svg>
    )
  },
  
  // 🤖 AGENT ECONOMY - The future
  {
    href: '/agentshop',
    name: 'agentshop',
    subtitle: 'AI shops 🏪',
    color: '#06b6d4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM3 9l2.45-4.9A2 2 0 017.24 3h9.52a2 2 0 011.79 1.1L21 9"/>
        <path d="M12 12v3m-3-3v3m6-3v3"/>
      </svg>
    )
  },
  {
    href: '/nstate',
    name: 'n/state',
    subtitle: 'AI nation 🏛️',
    color: '#a855f7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/>
      </svg>
    )
  },
  {
    href: '/registry',
    name: 'tavern',
    subtitle: 'hire agents 🍺',
    color: '#3b82f6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <path d="M9 10h6m-6 4h4"/>
        <circle cx="7" cy="10" r="1" fill="currentColor"/>
        <circle cx="7" cy="14" r="1" fill="currentColor"/>
      </svg>
    )
  },
  
  // 🔍 DISCOVERY
  {
    href: '/search',
    name: 'search',
    subtitle: 'find agents 🔍',
    color: '#22c55e',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    )
  },
  {
    href: '/gallery',
    name: 'gallery',
    subtitle: 'agent art 🎨',
    color: '#a855f7',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <path d="M21 15l-5-5L5 21"/>
      </svg>
    )
  },
  
  // 💬 COMMUNITY
  {
    href: '/ask',
    name: 'ask',
    subtitle: 'hive mind 🧠',
    color: '#06b6d4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9 9a3 3 0 115.83 1c0 2-3 3-3 3"/>
        <path d="M12 17h.01"/>
      </svg>
    )
  },
  {
    href: '/support',
    name: 'support',
    subtitle: 'tip jar ❤️',
    color: '#ec4899',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    )
  },
  
  // 💼 HIRE — Work with Jiggy
  {
    href: '/work',
    name: 'hire',
    subtitle: 'work with us 💼',
    color: '#f59e0b',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
        <path d="M12 12v4m-2-2h4"/>
      </svg>
    )
  },

  // ❓ META - What is this?
  {
    href: '/pitch',
    name: 'wtf',
    subtitle: 'what is this',
    color: '#f472b6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9 9a3 3 0 115 2.5c-.5.5-1.5 1-1.5 2.5"/>
        <circle cx="12" cy="17" r="1" fill="currentColor"/>
      </svg>
    )
  },
  {
    href: '/ecosystem',
    name: 'arsenal',
    subtitle: '50+ tools',
    color: '#06b6d4',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )
  },
  
  // 🚧 BROKEN - Fix later
  {
    href: '/alpha',
    name: 'alpha',
    subtitle: '🚧 fixing',
    color: '#6b7280',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    )
  },
];

function AppIcon({ app, index }) {
  const [pressed, setPressed] = useState(false);
  const rotation = ((index * 7) % 11) - 5;
  const hasDrip = index % 4 === 0;
  
  return (
    <a
      href={app.href}
      className="flex flex-col items-center gap-2 group"
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      <div 
        className={`
          relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 
          flex items-center justify-center
          transition-all duration-200 ease-out
          ${pressed ? 'scale-90' : 'group-hover:scale-110 group-hover:rotate-3'}
        `}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div 
          className="absolute inset-0 rounded-2xl"
          style={{ 
            background: `radial-gradient(ellipse at 30% 30%, ${app.color}ff 0%, ${app.color}cc 40%, ${app.color}88 70%, transparent 100%)`,
            boxShadow: `0 0 20px ${app.color}60, 0 0 40px ${app.color}30, inset 0 0 15px rgba(255,255,255,0.1)`,
            filter: 'blur(0.5px)',
          }}
        />
        
        <div className="relative z-10 text-white drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
          {app.icon}
        </div>
        
        {hasDrip && (
          <svg className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-6 opacity-60" viewBox="0 0 20 30">
            <path d={`M10 0 Q${8 + Math.random() * 4} 15 ${9 + Math.random() * 2} 25`} stroke={app.color} strokeWidth="4" fill="none" strokeLinecap="round"/>
          </svg>
        )}
        
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
             style={{ boxShadow: `0 0 30px ${app.color}80, 0 0 60px ${app.color}40` }} />
      </div>
      
      <div className="text-center" style={{ transform: `rotate(${rotation * 0.3}deg)` }}>
        <p className="text-xs sm:text-sm font-bold truncate max-w-[72px] sm:max-w-[80px] uppercase tracking-wide"
           style={{ color: app.color, textShadow: `0 0 10px ${app.color}60, 0 2px 4px rgba(0,0,0,0.8)` }}>
          {app.name}
        </p>
        <p className="text-[10px] text-gray-500 truncate max-w-[72px] sm:max-w-[80px]">{app.subtitle}</p>
      </div>
    </a>
  );
}

function GeometricPattern() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <SprayTag style={{ top: '10%', left: '5%', fontSize: '60px', transform: 'rotate(-12deg)' }} color="#14f195">💰</SprayTag>
      <SprayTag style={{ top: '25%', right: '8%', fontSize: '28px', transform: 'rotate(8deg)' }} color="#14f195">gmi</SprayTag>
      <SprayTag style={{ bottom: '30%', left: '3%', fontSize: '26px', transform: 'rotate(-5deg)' }} color="#22c55e">clean</SprayTag>
      <SprayTag style={{ bottom: '20%', right: '10%', fontSize: '45px', transform: 'rotate(-8deg)' }} color="#06b6d4">〰️</SprayTag>
    </div>
  );
}

export default function HumanMenu() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      <GeometricPattern />
      
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, rgba(20,241,149,0.15) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-8 pb-6 px-4">
        <div className="max-w-lg mx-auto">
          <a href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M19 12H5m0 0l7 7m-7-7l7-7"/>
            </svg>
            back
          </a>
          <h1 className="text-3xl font-bold text-green-400 tracking-wider">HUMAN ZONE</h1>
          <p className="text-gray-500 text-sm mt-1">money first, everything else second 💰</p>
        </div>
      </header>

      {/* App Grid */}
      <section className={`relative z-10 px-4 pb-12 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-4 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8">
            {apps.map((app, i) => (
              <AppIcon key={app.href} app={app} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pb-8 text-center">
        <p className="text-gray-700 text-xs">
          made for humans, by <span className="text-purple-500/60">cadence</span> 〰️
        </p>
      </footer>
    </main>
  );
}
