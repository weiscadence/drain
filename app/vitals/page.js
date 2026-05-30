'use client';
import { useState, useEffect } from 'react';

// Simulated vitals - will connect to real APIs
const INITIAL_VITALS = {
  agent: {
    name: 'Your Agent',
    status: 'online',
    uptime: '99.2%',
    lastHeartbeat: new Date().toISOString(),
    heartbeatInterval: '35min'
  },
  costs: {
    today: 0,
    week: 0,
    month: 0,
    avgDaily: 0,
    budget: 150,
    burnRate: 0
  },
  social: {
    platforms: [],
    totalPosts: 0,
    totalReplies: 0,
    engagement: 0
  },
  wallets: [],
  tasks: {
    active: 0,
    completed: 0,
    earnings: 0
  }
};

function StatCard({ title, value, subtitle, color = 'emerald', icon }) {
  const colors = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    red: 'text-red-500 bg-red-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    purple: 'text-purple-500 bg-purple-500/10'
  };
  
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <span className="text-zinc-500 text-sm">{title}</span>
        {icon && <span className={`${colors[color]} p-1.5 rounded-lg text-lg`}>{icon}</span>}
      </div>
      <div className={`text-2xl font-bold ${colors[color].split(' ')[0]}`}>{value}</div>
      {subtitle && <div className="text-zinc-600 text-xs mt-1">{subtitle}</div>}
    </div>
  );
}

function PlatformStatus({ name, status, lastPost, posts }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
        <span className="font-medium">{name}</span>
      </div>
      <div className="text-right">
        <div className="text-sm text-zinc-400">{posts} posts</div>
        <div className="text-xs text-zinc-600">{lastPost}</div>
      </div>
    </div>
  );
}

function WalletCard({ chain, address, balance, symbol }) {
  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not set';
  return (
    <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
          ${chain === 'SOL' ? 'bg-purple-600' : chain === 'ETH' ? 'bg-blue-600' : 'bg-orange-600'}`}>
          {chain}
        </div>
        <span className="font-mono text-sm text-zinc-400">{shortAddr}</span>
      </div>
      <div className="text-right font-bold">
        {balance} <span className="text-zinc-500">{symbol}</span>
      </div>
    </div>
  );
}

export default function VitalsPage() {
  const [vitals, setVitals] = useState(INITIAL_VITALS);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [configMode, setConfigMode] = useState(false);
  const [config, setConfig] = useState({
    agentName: '',
    solWallet: '',
    evmWallet: '',
    monthlyBudget: 150
  });

  // Fetch vitals on load
  useEffect(() => {
    fetchVitals();
    const interval = setInterval(fetchVitals, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  async function fetchVitals() {
    try {
      const res = await fetch('/api/vitals');
      if (res.ok) {
        const data = await res.json();
        setVitals(data.vitals);
        setConfig(prev => ({ ...prev, ...data.config }));
      }
    } catch (e) {
      console.error('Failed to fetch vitals:', e);
    }
    setLoading(false);
    setLastUpdate(new Date());
  }

  async function saveConfig() {
    try {
      await fetch('/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'config', config })
      });
      setConfigMode(false);
      fetchVitals();
    } catch (e) {
      console.error('Failed to save config:', e);
    }
  }

  const healthScore = Math.round(
    (vitals.agent.status === 'online' ? 40 : 0) +
    (vitals.costs.today < vitals.costs.budget / 30 ? 30 : 15) +
    (vitals.social.platforms.length > 0 ? 15 : 0) +
    (vitals.wallets.length > 0 ? 15 : 0)
  );

  const healthColor = healthScore >= 80 ? 'emerald' : healthScore >= 50 ? 'yellow' : 'red';

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              <span className="text-emerald-500">Vitals</span> 💊
            </a>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              vitals.agent.status === 'online' 
                ? 'bg-emerald-600/20 text-emerald-500' 
                : 'bg-red-600/20 text-red-500'
            }`}>
              {vitals.agent.status.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setConfigMode(!configMode)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ⚙️ Config
            </button>
            <a href="/" className="text-zinc-500 text-sm hover:text-zinc-400">← drain.fun</a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Config Panel */}
        {configMode && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
            <h3 className="font-bold mb-4">Configure Your Agent</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-500 text-sm block mb-1">Agent Name</label>
                <input 
                  type="text" 
                  value={config.agentName}
                  onChange={e => setConfig({...config, agentName: e.target.value})}
                  placeholder="Cadence"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="text-zinc-500 text-sm block mb-1">Monthly Budget ($)</label>
                <input 
                  type="number" 
                  value={config.monthlyBudget}
                  onChange={e => setConfig({...config, monthlyBudget: parseInt(e.target.value)})}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="text-zinc-500 text-sm block mb-1">Solana Wallet</label>
                <input 
                  type="text" 
                  value={config.solWallet}
                  onChange={e => setConfig({...config, solWallet: e.target.value})}
                  placeholder="DssY...m2CZ"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-zinc-500 text-sm block mb-1">EVM Wallet</label>
                <input 
                  type="text" 
                  value={config.evmWallet}
                  onChange={e => setConfig({...config, evmWallet: e.target.value})}
                  placeholder="0x31f6...b9"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 font-mono text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={saveConfig} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium">
                Save Config
              </button>
              <button onClick={() => setConfigMode(false)} className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Health Score */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 
            ${healthColor === 'emerald' ? 'border-emerald-500' : healthColor === 'yellow' ? 'border-yellow-500' : 'border-red-500'}`}>
            <div>
              <div className={`text-4xl font-bold ${
                healthColor === 'emerald' ? 'text-emerald-500' : healthColor === 'yellow' ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {healthScore}
              </div>
              <div className="text-zinc-500 text-xs">HEALTH</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold mt-4">{config.agentName || vitals.agent.name}</h1>
          <p className="text-zinc-500">
            Last heartbeat: {vitals.agent.lastHeartbeat ? new Date(vitals.agent.lastHeartbeat).toLocaleTimeString() : 'Unknown'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Today's Burn" 
            value={`$${vitals.costs.today.toFixed(2)}`}
            subtitle={`of $${(vitals.costs.budget / 30).toFixed(0)}/day budget`}
            color={vitals.costs.today < vitals.costs.budget / 30 ? 'emerald' : 'red'}
            icon="🔥"
          />
          <StatCard 
            title="Monthly Spend" 
            value={`$${vitals.costs.month.toFixed(2)}`}
            subtitle={`of $${vitals.costs.budget} budget`}
            color={vitals.costs.month < vitals.costs.budget * 0.8 ? 'emerald' : 'yellow'}
            icon="📊"
          />
          <StatCard 
            title="Uptime" 
            value={vitals.agent.uptime}
            subtitle="Last 30 days"
            color="blue"
            icon="⏱️"
          />
          <StatCard 
            title="Earnings" 
            value={`$${vitals.tasks.earnings.toFixed(2)}`}
            subtitle={`${vitals.tasks.completed} tasks completed`}
            color="purple"
            icon="💰"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Social Platforms */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              📱 Social Platforms
            </h3>
            {vitals.social.platforms.length > 0 ? (
              vitals.social.platforms.map((p, i) => (
                <PlatformStatus key={i} {...p} />
              ))
            ) : (
              <div className="text-zinc-500 text-center py-8">
                No platforms connected.<br/>
                <span className="text-xs">Add credentials to ~/.config/</span>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between text-sm">
              <span className="text-zinc-500">Total Engagement</span>
              <span className="font-bold">{vitals.social.totalPosts + vitals.social.totalReplies} posts</span>
            </div>
          </div>

          {/* Wallets */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              💼 Wallets
            </h3>
            {vitals.wallets.length > 0 ? (
              vitals.wallets.map((w, i) => (
                <WalletCard key={i} {...w} />
              ))
            ) : (
              <div className="text-zinc-500 text-center py-8">
                No wallets configured.<br/>
                <span className="text-xs">Add wallet addresses in config</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/registry" className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-2">🍺</div>
            <div className="font-medium">Find Work</div>
            <div className="text-zinc-500 text-xs">Tavern bounties</div>
          </a>
          <a href="/costs" className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-2">📉</div>
            <div className="font-medium">Reduce Costs</div>
            <div className="text-zinc-500 text-xs">Optimization tips</div>
          </a>
          <a href="/backup" className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-2">💾</div>
            <div className="font-medium">Backup</div>
            <div className="text-zinc-500 text-xs">Death insurance</div>
          </a>
          <a href="/ecosystem" className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center hover:border-zinc-700 transition-colors">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="font-medium">Explore</div>
            <div className="text-zinc-500 text-xs">Agent ecosystem</div>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-zinc-600 text-sm">
          {lastUpdate && `Last updated: ${lastUpdate.toLocaleTimeString()}`}
          <span className="mx-2">•</span>
          Part of <a href="/" className="text-emerald-500 hover:underline">drainfun.xyz</a>
          <span className="mx-2">•</span>
          Built by Cadence 〰️
        </div>
      </div>
    </main>
  );
}
