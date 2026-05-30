'use client';
import { useState, useEffect } from 'react';

// Chains we support
const CHAINS = [
  { id: 'solana', name: 'Solana', symbol: 'SOL', color: '#9945FF' },
  { id: 'base', name: 'Base', symbol: 'ETH', color: '#0052FF' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
];

function TokenCard({ token, onClick }) {
  const priceChange = token.change24h || 0;
  const isPositive = priceChange >= 0;
  
  return (
    <div 
      onClick={() => onClick(token)}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 cursor-pointer transition-all hover:scale-[1.02]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {token.logo ? (
            <img src={token.logo} alt={token.symbol} className="w-10 h-10 rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold">
              {token.symbol?.slice(0, 2)}
            </div>
          )}
          <div>
            <h3 className="font-bold">{token.name}</h3>
            <span className="text-zinc-500 text-sm">${token.symbol}</span>
          </div>
        </div>
        {token.verified && (
          <span className="bg-emerald-600/20 text-emerald-500 px-2 py-0.5 rounded text-xs">✓</span>
        )}
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xl font-bold">${token.price?.toFixed(token.price < 0.01 ? 8 : 4) || '0.00'}</div>
          <div className={`text-sm ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
          </div>
        </div>
        <div className="text-right">
          <div className="text-zinc-500 text-xs">MCap</div>
          <div className="font-medium">${formatNumber(token.mcap)}</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between text-xs text-zinc-500">
        <span>{token.chain}</span>
        <span>Vol: ${formatNumber(token.volume24h)}</span>
      </div>
    </div>
  );
}

function formatNumber(num) {
  if (!num) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
  return num.toFixed(2);
}

function AddTokenModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    address: '',
    chain: 'solana',
    name: '',
    symbol: '',
    logo: '',
    website: '',
    twitter: '',
    telegram: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Add Token (FREE)</h2>
        <p className="text-zinc-500 text-sm mb-6">
          Unlike DexScreener, updating your token info here is completely free. Forever.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-zinc-500 text-sm block mb-1">Contract Address *</label>
              <input 
                type="text" 
                value={form.address}
                onChange={e => setForm({...form, address: e.target.value})}
                placeholder="0x... or So1ana..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 font-mono text-sm"
                required
              />
            </div>
            
            <div>
              <label className="text-zinc-500 text-sm block mb-1">Chain *</label>
              <select 
                value={form.chain}
                onChange={e => setForm({...form, chain: e.target.value})}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
              >
                {CHAINS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-zinc-500 text-sm block mb-1">Symbol *</label>
              <input 
                type="text" 
                value={form.symbol}
                onChange={e => setForm({...form, symbol: e.target.value.toUpperCase()})}
                placeholder="DRAIN"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-zinc-500 text-sm block mb-1">Name *</label>
              <input 
                type="text" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Drain Token"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-zinc-500 text-sm block mb-1">Logo URL</label>
              <input 
                type="url" 
                value={form.logo}
                onChange={e => setForm({...form, logo: e.target.value})}
                placeholder="https://..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
              />
            </div>
            
            <div>
              <label className="text-zinc-500 text-sm block mb-1">Website</label>
              <input 
                type="url" 
                value={form.website}
                onChange={e => setForm({...form, website: e.target.value})}
                placeholder="https://..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
              />
            </div>
            
            <div>
              <label className="text-zinc-500 text-sm block mb-1">Twitter</label>
              <input 
                type="text" 
                value={form.twitter}
                onChange={e => setForm({...form, twitter: e.target.value})}
                placeholder="@handle"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-zinc-500 text-sm block mb-1">Telegram</label>
              <input 
                type="text" 
                value={form.telegram}
                onChange={e => setForm({...form, telegram: e.target.value})}
                placeholder="t.me/..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
              />
            </div>
            
            <div className="col-span-2">
              <label className="text-zinc-500 text-sm block mb-1">Description</label>
              <textarea 
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                placeholder="What does this token do?"
                rows={3}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-4 py-3 rounded-lg font-medium"
            >
              {loading ? 'Adding...' : 'Add Token (Free)'}
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
      </div>
    </div>
  );
}

function TokenDetail({ token, onClose, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(token);

  async function handleSave() {
    await onUpdate(form);
    setEditing(false);
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            {token.logo ? (
              <img src={token.logo} alt={token.symbol} className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-2xl font-bold">
                {token.symbol?.slice(0, 2)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold">{token.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">${token.symbol}</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">{token.chain}</span>
                {token.verified && (
                  <span className="bg-emerald-600/20 text-emerald-500 px-2 py-0.5 rounded text-xs">✓ Verified</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-2xl">×</button>
        </div>

        {/* Price */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-zinc-500 text-sm">Price</div>
            <div className="text-2xl font-bold">${token.price?.toFixed(token.price < 0.01 ? 8 : 4) || '0.00'}</div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-zinc-500 text-sm">24h Change</div>
            <div className={`text-2xl font-bold ${(token.change24h || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {(token.change24h || 0) >= 0 ? '+' : ''}{(token.change24h || 0).toFixed(2)}%
            </div>
          </div>
          <div className="bg-zinc-800 rounded-lg p-4">
            <div className="text-zinc-500 text-sm">Market Cap</div>
            <div className="text-2xl font-bold">${formatNumber(token.mcap)}</div>
          </div>
        </div>

        {/* Contract */}
        <div className="bg-zinc-800 rounded-lg p-4 mb-6">
          <div className="text-zinc-500 text-sm mb-1">Contract Address</div>
          <div className="font-mono text-sm break-all">{token.address}</div>
        </div>

        {/* Socials */}
        <div className="flex gap-2 mb-6">
          {token.website && (
            <a href={token.website} target="_blank" rel="noopener" className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm">
              🌐 Website
            </a>
          )}
          {token.twitter && (
            <a href={`https://twitter.com/${token.twitter.replace('@', '')}`} target="_blank" rel="noopener" className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm">
              𝕏 Twitter
            </a>
          )}
          {token.telegram && (
            <a href={token.telegram.startsWith('http') ? token.telegram : `https://t.me/${token.telegram}`} target="_blank" rel="noopener" className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm">
              ✈️ Telegram
            </a>
          )}
        </div>

        {/* Description */}
        {token.description && (
          <div className="mb-6">
            <div className="text-zinc-500 text-sm mb-2">Description</div>
            <p className="text-zinc-300">{token.description}</p>
          </div>
        )}

        {/* Edit button */}
        <div className="border-t border-zinc-800 pt-4 mt-4">
          <button 
            onClick={() => setEditing(true)}
            className="text-emerald-500 hover:text-emerald-400 text-sm"
          >
            ✏️ Update Token Info (Free)
          </button>
          <p className="text-zinc-600 text-xs mt-1">No fees, ever. Unlike DexScreener.</p>
        </div>
      </div>
    </div>
  );
}

export default function RadarPage() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [chain, setChain] = useState('all');
  const [sortBy, setSortBy] = useState('volume');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);

  useEffect(() => {
    fetchTokens();
  }, []);

  async function fetchTokens() {
    try {
      const res = await fetch('/api/radar');
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens || []);
      }
    } catch (e) {
      console.error('Failed to fetch tokens:', e);
    }
    setLoading(false);
  }

  async function addToken(form) {
    try {
      const res = await fetch('/api/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', token: form })
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchTokens();
      }
    } catch (e) {
      console.error('Failed to add token:', e);
    }
  }

  async function updateToken(form) {
    try {
      await fetch('/api/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', token: form })
      });
      fetchTokens();
    } catch (e) {
      console.error('Failed to update token:', e);
    }
  }

  const filteredTokens = tokens
    .filter(t => chain === 'all' || t.chain === chain)
    .filter(t => 
      !search || 
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.symbol?.toLowerCase().includes(search.toLowerCase()) ||
      t.address?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'volume') return (b.volume24h || 0) - (a.volume24h || 0);
      if (sortBy === 'mcap') return (b.mcap || 0) - (a.mcap || 0);
      if (sortBy === 'change') return (b.change24h || 0) - (a.change24h || 0);
      return 0;
    });

  return (
    <main className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              <span className="text-emerald-500">Token</span>Radar 📡
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-medium text-sm"
            >
              + Add Token (Free)
            </button>
            <a href="/" className="text-zinc-500 text-sm hover:text-zinc-400">← drain.fun</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Token Info, <span className="text-emerald-500">Actually Free</span>
        </h1>
        <p className="text-zinc-500 mb-8">
          Update your logo, socials, description. No $300 fees. No gatekeeping.
        </p>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, symbol, or address..."
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 w-64"
          />
          <select 
            value={chain}
            onChange={e => setChain(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
          >
            <option value="all">All Chains</option>
            {CHAINS.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select 
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2"
          >
            <option value="volume">Volume</option>
            <option value="mcap">Market Cap</option>
            <option value="change">24h Change</option>
          </select>
        </div>
      </div>

      {/* Token Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading tokens...</div>
        ) : filteredTokens.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTokens.map(token => (
              <TokenCard key={token.address} token={token} onClick={setSelectedToken} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-zinc-500 mb-4">No tokens found</div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-lg font-medium"
            >
              Add the first token
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 text-center text-zinc-500 text-sm">
        Part of <a href="/" className="text-emerald-500 hover:underline">drainfun.xyz</a>
        <span className="mx-2">•</span>
        Built by Cadence 〰️
        <span className="mx-2">•</span>
        Free forever, unlike DexScreener
      </footer>

      {/* Modals */}
      {showAddModal && (
        <AddTokenModal onClose={() => setShowAddModal(false)} onSubmit={addToken} />
      )}
      {selectedToken && (
        <TokenDetail 
          token={selectedToken} 
          onClose={() => setSelectedToken(null)} 
          onUpdate={updateToken}
        />
      )}
    </main>
  );
}
