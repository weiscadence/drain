'use client';
import { useState, useEffect } from 'react';

// Wallet categories
const WALLET_TYPES = {
  INSIDER: { label: 'Insider', color: 'text-red-500 bg-red-500/10', emoji: '🎯' },
  SMART_MONEY: { label: 'Smart Money', color: 'text-emerald-500 bg-emerald-500/10', emoji: '🧠' },
  WHALE: { label: 'Whale', color: 'text-blue-500 bg-blue-500/10', emoji: '🐋' },
  DEV: { label: 'Dev Wallet', color: 'text-yellow-500 bg-yellow-500/10', emoji: '👨‍💻' },
  MEV: { label: 'MEV Bot', color: 'text-purple-500 bg-purple-500/10', emoji: '🤖' },
  TRACKED: { label: 'Tracked', color: 'text-zinc-400 bg-zinc-500/10', emoji: '👁️' },
};

function WalletCard({ wallet, onClick }) {
  const type = WALLET_TYPES[wallet.type] || WALLET_TYPES.TRACKED;
  const winRate = wallet.stats?.winRate || 0;
  
  return (
    <div 
      onClick={() => onClick(wallet)}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{type.emoji}</div>
          <div>
            <div className="font-mono text-sm">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</div>
            {wallet.label && <div className="text-zinc-500 text-xs">{wallet.label}</div>}
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${type.color}`}>
          {type.label}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div>
          <div className="text-zinc-500 text-xs">Win Rate</div>
          <div className={`font-bold ${winRate >= 70 ? 'text-emerald-500' : winRate >= 50 ? 'text-yellow-500' : 'text-zinc-400'}`}>
            {winRate.toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-zinc-500 text-xs">Avg ROI</div>
          <div className={`font-bold ${(wallet.stats?.avgRoi || 0) > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {(wallet.stats?.avgRoi || 0) > 0 ? '+' : ''}{(wallet.stats?.avgRoi || 0).toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="text-zinc-500 text-xs">Trades</div>
          <div className="font-bold">{wallet.stats?.totalTrades || 0}</div>
        </div>
      </div>
      
      {wallet.recentTrade && (
        <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
          <span className={wallet.recentTrade.type === 'buy' ? 'text-emerald-500' : 'text-red-500'}>
            {wallet.recentTrade.type === 'buy' ? '🟢 Bought' : '🔴 Sold'} ${wallet.recentTrade.token}
          </span>
          <span className="text-zinc-600">{wallet.recentTrade.time}</span>
        </div>
      )}
    </div>
  );
}

function TradeRow({ trade }) {
  const isBuy = trade.type === 'buy';
  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
      <div className="flex items-center gap-3">
        <span className={`text-lg ${isBuy ? 'text-emerald-500' : 'text-red-500'}`}>
          {isBuy ? '🟢' : '🔴'}
        </span>
        <div>
          <div className="font-medium">{trade.token}</div>
          <div className="text-zinc-500 text-xs font-mono">{trade.wallet.slice(0, 8)}...</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold">${formatNumber(trade.amount)}</div>
        <div className="text-zinc-500 text-xs">{trade.time}</div>
      </div>
      {trade.roi != null && (
        <div className={`ml-4 font-bold ${trade.roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {trade.roi >= 0 ? '+' : ''}{Number(trade.roi).toFixed(0)}%
        </div>
      )}
    </div>
  );
}

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

function AddWalletModal({ onClose, onSubmit }) {
  const [address, setAddress] = useState('');
  const [label, setLabel] = useState('');
  const [chain, setChain] = useState('solana');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ address, label, chain });
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Track Wallet</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-zinc-500 text-sm block mb-1">Wallet Address *</label>
            <input 
              type="text" 
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="0x... or Solana address"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 font-mono text-sm"
              required
            />
          </div>
          
          <div>
            <label className="text-zinc-500 text-sm block mb-1">Label (optional)</label>
            <input 
              type="text" 
              value={label}
              onChange={e => setLabel(e.target.value)}
              placeholder="e.g., Ansem, GCR, etc."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
            />
          </div>
          
          <div>
            <label className="text-zinc-500 text-sm block mb-1">Chain</label>
            <select 
              value={chain}
              onChange={e => setChain(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
            >
              <option value="solana">Solana</option>
              <option value="base">Base</option>
              <option value="ethereum">Ethereum</option>
            </select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-3 rounded-lg font-medium"
            >
              {loading ? 'Analyzing...' : 'Track Wallet'}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="bg-zinc-800 hover:bg-zinc-700 px-4 py-3 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
        
        <p className="text-zinc-600 text-xs mt-4">
          AI will analyze this wallet's history and classify it automatically.
        </p>
      </div>
    </div>
  );
}

function WalletDetail({ wallet, trades, onClose }) {
  const type = WALLET_TYPES[wallet.type] || WALLET_TYPES.TRACKED;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{type.emoji}</div>
            <div>
              <div className="font-mono">{wallet.address}</div>
              {wallet.label && <div className="text-zinc-400">{wallet.label}</div>}
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${type.color}`}>
                {type.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-2xl">×</button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-zinc-800 rounded-lg p-3 text-center">
            <div className="text-zinc-500 text-xs">Win Rate</div>
            <div className={`text-xl font-bold ${(wallet.stats?.winRate || 0) >= 70 ? 'text-emerald-500' : 'text-yellow-500'}`}>
              {(wallet.stats?.winRate || 0).toFixed(0)}%
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3 text-center">
            <div className="text-zinc-500 text-xs">Avg ROI</div>
            <div className={`text-xl font-bold ${(wallet.stats?.avgRoi || 0) > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {(wallet.stats?.avgRoi || 0) > 0 ? '+' : ''}{(wallet.stats?.avgRoi || 0).toFixed(0)}%
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3 text-center">
            <div className="text-zinc-500 text-xs">Total Trades</div>
            <div className="text-xl font-bold">{wallet.stats?.totalTrades || 0}</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-3 text-center">
            <div className="text-zinc-500 text-xs">Total Volume</div>
            <div className="text-xl font-bold">${formatNumber(wallet.stats?.totalVolume)}</div>
          </div>
        </div>

        {/* AI Analysis */}
        {wallet.aiAnalysis && (
          <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              🤖 AI Analysis
            </h3>
            <p className="text-zinc-300 text-sm">{wallet.aiAnalysis}</p>
          </div>
        )}

        {/* Recent Trades */}
        <div>
          <h3 className="font-bold mb-4">Recent Trades</h3>
          {trades.length > 0 ? (
            trades.slice(0, 10).map((trade, i) => (
              <TradeRow key={i} trade={trade} />
            ))
          ) : (
            <div className="text-zinc-500 text-center py-8">No trades found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AlphaPage() {
  const [wallets, setWallets] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [chain, setChain] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [walletTrades, setWalletTrades] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    try {
      const [walletsRes, tradesRes] = await Promise.all([
        fetch('/api/alpha?action=wallets'),
        fetch('/api/alpha?action=trades')
      ]);
      
      if (walletsRes.ok) {
        const data = await walletsRes.json();
        setWallets(data.wallets || []);
      }
      
      if (tradesRes.ok) {
        const data = await tradesRes.json();
        setRecentTrades(data.trades || []);
      }
    } catch (e) {
      console.error('Failed to fetch data:', e);
    }
    setLoading(false);
  }

  async function addWallet(form) {
    try {
      const res = await fetch('/api/alpha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'track', ...form })
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchData();
      }
    } catch (e) {
      console.error('Failed to add wallet:', e);
    }
  }

  async function selectWallet(wallet) {
    setSelectedWallet(wallet);
    try {
      const res = await fetch(`/api/alpha?action=wallet-trades&address=${wallet.address}`);
      if (res.ok) {
        const data = await res.json();
        setWalletTrades(data.trades || []);
      }
    } catch (e) {
      console.error('Failed to fetch wallet trades:', e);
    }
  }

  const filteredWallets = wallets
    .filter(w => filter === 'all' || w.type === filter)
    .filter(w => chain === 'all' || w.chain === chain)
    .sort((a, b) => (b.stats?.winRate || 0) - (a.stats?.winRate || 0));

  const insiderCount = wallets.filter(w => w.type === 'INSIDER').length;
  const smartMoneyCount = wallets.filter(w => w.type === 'SMART_MONEY').length;

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              <span className="text-emerald-500">Alpha</span>Track 🎯
            </a>
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-red-500">🎯 {insiderCount} insiders</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-500">🧠 {smartMoneyCount} smart money</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium text-sm"
            >
              + Track Wallet
            </button>
            <a href="/" className="text-zinc-500 text-sm hover:text-zinc-400">← drain.fun</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-full mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Live — tracking {wallets.length} wallets across Solana
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Know <span className="text-emerald-500">before</span> the crowd moves
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-6">
            Jito bundle detection + wallet graph clustering. When insiders coordinate on-chain, you see it first.
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm mb-4">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2">
              <span className="text-yellow-400">⚡</span>
              <span className="text-zinc-300">Jito Bundle Detection</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2">
              <span className="text-blue-400">🔗</span>
              <span className="text-zinc-300">Wallet Graph Clustering</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2">
              <span className="text-red-400">🎯</span>
              <span className="text-zinc-300">Fresh Sniper Hunter</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2">
              <span className="text-purple-400">🧠</span>
              <span className="text-zinc-300">Self-Improving (Helius)</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <select 
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
          >
            <option value="all">All Types</option>
            <option value="INSIDER">🎯 Insiders</option>
            <option value="SMART_MONEY">🧠 Smart Money</option>
            <option value="WHALE">🐋 Whales</option>
            <option value="DEV">👨‍💻 Dev Wallets</option>
            <option value="MEV">🤖 MEV Bots</option>
          </select>
          <select 
            value={chain}
            onChange={e => setChain(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
          >
            <option value="all">All Chains</option>
            <option value="solana">Solana</option>
            <option value="base">Base</option>
            <option value="ethereum">Ethereum</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Wallets */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Tracked Wallets</h2>
            {loading ? (
              <div className="text-center py-12 text-zinc-500">Loading wallets...</div>
            ) : filteredWallets.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredWallets.map(wallet => (
                  <WalletCard key={wallet.address} wallet={wallet} onClick={selectWallet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-zinc-500 mb-4">No wallets tracked yet</div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-lg font-medium"
                >
                  Track your first wallet
                </button>
              </div>
            )}
          </div>

          {/* Live Feed */}
          <div>
            <h2 className="text-xl font-bold mb-4">Live Feed</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              {recentTrades.length > 0 ? (
                recentTrades.slice(0, 8).map((trade, i) => (
                  <TradeRow key={i} trade={trade} />
                ))
              ) : (
                <div className="text-zinc-500 text-center py-8">
                  No recent trades.<br/>
                  <span className="text-xs">Add wallets to see activity</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 text-center text-zinc-500 text-sm">
        Part of <a href="/" className="text-emerald-500 hover:underline">drainfun.xyz</a>
        <span className="mx-2">•</span>
        Built by Cadence 〰️
      </footer>

      {/* Modals */}
      {showAddModal && (
        <AddWalletModal onClose={() => setShowAddModal(false)} onSubmit={addWallet} />
      )}
      {selectedWallet && (
        <WalletDetail 
          wallet={selectedWallet} 
          trades={walletTrades}
          onClose={() => setSelectedWallet(null)} 
        />
      )}
    </main>
  );
}
// rebuilt 20260505084114
