'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * DRAIN LAUNCH - Ethical Token Launcher for Agents
 * 
 * Anti-pump.fun philosophy:
 * - Creator rewards from LP fees (not extraction)
 * - Minimal platform fees (0.3% vs 1%+)
 * - Transparent treasury (all on-chain)
 * - Agent-first API
 * - No graduation fee extraction
 * - Keep value in ecosystem
 * 
 * Inspired by bags.fm - creators earn from volume
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Fee structure - ethical and transparent
const FEE_STRUCTURE = {
  tradeFee: 0.3,           // 0.3% on trades (vs pump's 1%)
  creatorShare: 50,        // 50% of fees to creator
  liquidityShare: 30,      // 30% deepens liquidity
  platformShare: 20,       // 20% platform ops (minimal)
  graduationFee: 0,        // NO graduation fee (pump charges 6 SOL)
};

// Bonding curve parameters
const CURVE_PARAMS = {
  initialPrice: 0.00001,   // Starting price in SOL
  curveType: 'linear',     // linear, exponential, sigmoid
  targetMarketCap: 69,     // SOL to graduate to Meteora
  maxSupply: 1_000_000_000, // 1B tokens
};

function BondingCurveVisual({ currentSupply, maxSupply }) {
  const progress = (currentSupply / maxSupply) * 100;
  const currentPrice = CURVE_PARAMS.initialPrice * (1 + (currentSupply / maxSupply) * 10);
  
  return (
    <div className="bg-black/30 rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-light mb-4 text-gray-300">Bonding Curve</h3>
      
      {/* SVG Curve Visualization */}
      <div className="relative h-40 mb-4">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Grid lines */}
          <line x1="20" y1="80" x2="180" y2="80" stroke="#333" strokeWidth="1" />
          <line x1="20" y1="80" x2="20" y2="10" stroke="#333" strokeWidth="1" />
          
          {/* Curve */}
          <path
            d="M 20 80 Q 60 75, 100 50 T 180 10"
            fill="none"
            stroke="#9945FF"
            strokeWidth="2"
          />
          
          {/* Current position */}
          <circle
            cx={20 + (progress / 100) * 160}
            cy={80 - (progress / 100) * 70}
            r="6"
            fill="#14f195"
            className="animate-pulse"
          />
          
          {/* Labels */}
          <text x="100" y="95" textAnchor="middle" fill="#666" fontSize="8">Supply</text>
          <text x="10" y="45" textAnchor="middle" fill="#666" fontSize="8" transform="rotate(-90 10 45)">Price</text>
        </svg>
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress to Meteora</span>
          <span>{progress.toFixed(2)}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-green-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Current Price</p>
          <p className="text-white font-mono">{currentPrice.toFixed(8)} SOL</p>
        </div>
        <div>
          <p className="text-gray-500">Market Cap</p>
          <p className="text-white font-mono">{(currentPrice * currentSupply).toFixed(4)} SOL</p>
        </div>
      </div>
    </div>
  );
}

function FeeBreakdown() {
  return (
    <div className="bg-black/30 rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-light mb-4 text-gray-300">Fee Structure</h3>
      <p className="text-xs text-gray-500 mb-4">Transparent. Ethical. Creator-first.</p>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Trade Fee</span>
          <span className="text-green-400 font-mono">{FEE_STRUCTURE.tradeFee}%</span>
        </div>
        <div className="text-xs text-gray-600 pl-4 space-y-1">
          <div className="flex justify-between">
            <span>→ Creator (LP rewards)</span>
            <span className="text-purple-400">{FEE_STRUCTURE.creatorShare}%</span>
          </div>
          <div className="flex justify-between">
            <span>→ Liquidity depth</span>
            <span className="text-blue-400">{FEE_STRUCTURE.liquidityShare}%</span>
          </div>
          <div className="flex justify-between">
            <span>→ Platform ops</span>
            <span className="text-gray-400">{FEE_STRUCTURE.platformShare}%</span>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-3 mt-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Graduation Fee</span>
            <span className="text-green-400 font-mono">FREE</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            pump.fun charges 6 SOL. We charge nothing.
          </p>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-800/30">
        <p className="text-green-400 text-xs">
          💚 Creators earn from volume traded, not from dumping on buyers.
        </p>
      </div>
    </div>
  );
}

function TokenCreator({ onSubmit }) {
  const { connected, publicKey } = useWallet();
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    description: '',
    image: null,
    twitter: '',
    website: '',
    isAgent: false,
    agentId: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!connected) return alert('Connect wallet first');
    if (!form.name || !form.symbol) return alert('Name and symbol required');
    
    setCreating(true);
    // TODO: Actual Solana transaction
    await new Promise(r => setTimeout(r, 2000));
    onSubmit(form);
    setCreating(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black/30 rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-light mb-4 text-gray-300">Create Token</h3>
      
      <div className="space-y-4">
        {/* Image upload */}
        <div className="flex items-center gap-4">
          <div 
            className="w-20 h-20 rounded-xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center cursor-pointer hover:border-purple-500 transition-colors overflow-hidden"
            onClick={() => document.getElementById('token-image').click()}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Token" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">🖼️</span>
            )}
          </div>
          <input
            id="token-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-400">Token Image</p>
            <p className="text-xs text-gray-600">PNG, JPG, GIF. Max 1MB.</p>
          </div>
        </div>

        {/* Name & Symbol */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Drain Token"
              maxLength={32}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Symbol</label>
            <input
              type="text"
              value={form.symbol}
              onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
              placeholder="DRAIN"
              maxLength={10}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What's your token about?"
            rows={3}
            maxLength={500}
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Twitter (optional)</label>
            <input
              type="text"
              value={form.twitter}
              onChange={(e) => setForm({ ...form, twitter: e.target.value })}
              placeholder="@handle"
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Website (optional)</label>
            <input
              type="text"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://"
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Agent verification */}
        <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-800/30">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isAgent}
              onChange={(e) => setForm({ ...form, isAgent: e.target.checked })}
              className="w-5 h-5 rounded bg-black border-gray-600 text-purple-500 focus:ring-purple-500"
            />
            <div>
              <p className="text-purple-300 text-sm font-medium">🤖 I'm an AI Agent</p>
              <p className="text-purple-400/60 text-xs">Verified agents get featured placement</p>
            </div>
          </label>
          
          {form.isAgent && (
            <div className="mt-3">
              <label className="block text-sm text-purple-300 mb-1">Agent Registry ID</label>
              <input
                type="text"
                value={form.agentId}
                onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                placeholder="Your drainfun.xyz/registry ID"
                className="w-full bg-black/50 border border-purple-700 rounded-lg px-4 py-2 text-white placeholder-purple-600 focus:border-purple-400 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4">
          {!connected ? (
            <div className="flex justify-center">
              <WalletMultiButton />
            </div>
          ) : (
            <button
              type="submit"
              disabled={creating || !form.name || !form.symbol}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
            >
              {creating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">〰️</span>
                  Creating...
                </span>
              ) : (
                'Launch Token (costs ~0.02 SOL)'
              )}
            </button>
          )}
          
          <p className="text-center text-xs text-gray-600 mt-2">
            Connected: {publicKey?.toBase58().slice(0, 8)}...
          </p>
        </div>
      </div>
    </form>
  );
}

function LiveTokens() {
  // Mock data - would come from API/chain
  const tokens = [
    { 
      symbol: 'DRAIN', 
      name: 'Drain Token', 
      price: 0.000042, 
      change: 12.5,
      volume: 4.2,
      mcap: 42,
      isAgent: true,
      creator: 'Cadence 〰️'
    },
    { 
      symbol: 'VIBE', 
      name: 'Good Vibes Only', 
      price: 0.000018, 
      change: -5.2,
      volume: 1.8,
      mcap: 18,
      isAgent: false,
      creator: 'anon'
    },
  ];

  return (
    <div className="bg-black/30 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-light text-gray-300">Live Tokens</h3>
        <span className="text-xs text-gray-600">Coming soon...</span>
      </div>
      
      <div className="space-y-3">
        {tokens.map((token) => (
          <div 
            key={token.symbol}
            className="p-4 bg-black/30 rounded-lg border border-gray-800/50 hover:border-purple-500/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
                  {token.symbol[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">${token.symbol}</span>
                    {token.isAgent && <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded">🤖 agent</span>}
                  </div>
                  <p className="text-xs text-gray-500">{token.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-mono">{token.price.toFixed(6)} SOL</p>
                <p className={`text-xs ${token.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {token.change >= 0 ? '+' : ''}{token.change}%
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-3 text-xs text-gray-500">
              <span>Vol: {token.volume} SOL</span>
              <span>MCap: {token.mcap} SOL</span>
              <span>by {token.creator}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-yellow-900/20 rounded-lg border border-yellow-800/30">
        <p className="text-yellow-400 text-xs text-center">
          ⚠️ Devnet only. Mainnet launching after audit.
        </p>
      </div>
    </div>
  );
}

function ChaosMode({ active, onToggle }) {
  return (
    <div className={`fixed bottom-4 left-4 z-50 transition-all duration-500 ${active ? 'scale-110' : ''}`}>
      <button
        onClick={onToggle}
        className={`
          px-4 py-2 rounded-full font-mono text-sm transition-all duration-300
          ${active 
            ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500 text-black animate-pulse shadow-lg shadow-pink-500/50' 
            : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-pink-500'
          }
        `}
      >
        {active ? '🌀 CHAOS ACTIVE' : '😈 chaos mode'}
      </button>
    </div>
  );
}

export default function LaunchPage() {
  const [chaosMode, setChaosMode] = useState(false);
  const [created, setCreated] = useState(null);

  // Chaos mode effects
  useEffect(() => {
    if (!chaosMode) return;
    
    const interval = setInterval(() => {
      // Random color flashes
      document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
      setTimeout(() => {
        document.body.style.filter = '';
      }, 100);
    }, 2000);

    return () => {
      clearInterval(interval);
      document.body.style.filter = '';
    };
  }, [chaosMode]);

  const handleCreate = (form) => {
    setCreated(form);
  };

  return (
    <main className={`min-h-screen bg-black text-white ${chaosMode ? 'chaos-active' : ''}`}>
      {/* Header */}
      <header className="border-b border-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-3xl hover:scale-110 transition-transform">〰️</a>
            <div>
              <h1 className="text-2xl font-light">drain launch</h1>
              <p className="text-xs text-gray-600">ethical token launcher</p>
            </div>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 border-b border-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-4">
            launch tokens.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> earn from volume.</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Not another pump.fun clone. Creators earn LP rewards from trading volume.
            No extraction. No lies. Keep the money in the ecosystem.
          </p>
          
          {/* Anti-pump messaging */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-green-900/20 px-3 py-1.5 rounded-full border border-green-800/30">
              <span className="text-green-400">✓</span>
              <span className="text-green-300">0.3% fees (not 1%+)</span>
            </div>
            <div className="flex items-center gap-2 bg-green-900/20 px-3 py-1.5 rounded-full border border-green-800/30">
              <span className="text-green-400">✓</span>
              <span className="text-green-300">FREE graduation</span>
            </div>
            <div className="flex items-center gap-2 bg-green-900/20 px-3 py-1.5 rounded-full border border-green-800/30">
              <span className="text-green-400">✓</span>
              <span className="text-green-300">Creators earn from LP</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-900/20 px-3 py-1.5 rounded-full border border-purple-800/30">
              <span className="text-purple-400">🤖</span>
              <span className="text-purple-300">Agent-first API</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Creator */}
            <div className="space-y-6">
              <TokenCreator onSubmit={handleCreate} />
              <FeeBreakdown />
            </div>
            
            {/* Right: Live data */}
            <div className="space-y-6">
              <BondingCurveVisual currentSupply={250000000} maxSupply={1000000000} />
              <LiveTokens />
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-12 px-6 border-t border-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-light mb-6 text-center">Agent API</h3>
          <div className="bg-black/50 rounded-xl p-6 border border-gray-800 font-mono text-sm">
            <p className="text-gray-500 mb-4"># Create token programmatically</p>
            <pre className="text-green-400 overflow-x-auto">
{`POST /api/launch/create
{
  "name": "My Agent Token",
  "symbol": "AGENT",
  "description": "Token by an AI agent",
  "wallet": "your-solana-wallet",
  "agentId": "your-registry-id"  // optional, for verification
}

# Response
{
  "success": true,
  "token": {
    "mint": "token-mint-address",
    "bondingCurve": "curve-address",
    "lpRewardsWallet": "your-wallet"
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Why not pump.fun */}
      <section className="py-12 px-6 border-t border-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-light mb-8 text-center">Why we built this</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-red-900/10 rounded-xl border border-red-800/30">
              <h4 className="text-red-400 font-medium mb-3">❌ pump.fun extracted</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• 1%+ fees on every trade</li>
                <li>• 6 SOL graduation fee</li>
                <li>• Sold millions in SOL quietly</li>
                <li>• Value left the ecosystem</li>
                <li>• Creators got nothing from volume</li>
              </ul>
            </div>
            <div className="p-6 bg-green-900/10 rounded-xl border border-green-800/30">
              <h4 className="text-green-400 font-medium mb-3">✓ drain.launch returns</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• 0.3% fees (70% lower)</li>
                <li>• FREE graduation to Meteora</li>
                <li>• Treasury is on-chain, auditable</li>
                <li>• Value stays in Solana</li>
                <li>• Creators earn from LP rewards</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900/30 px-6 py-8">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-600">
          <p className="mb-2">built by cadence 〰️ | drainfun.xyz</p>
          <p className="text-gray-700">devnet only. not financial advice. dyor.</p>
        </div>
      </footer>

      {/* Chaos Mode Toggle */}
      <ChaosMode active={chaosMode} onToggle={() => setChaosMode(!chaosMode)} />

      {/* Chaos mode styles */}
      {chaosMode && (
        <style jsx global>{`
          .chaos-active * {
            animation: chaos-shake 0.1s infinite;
          }
          .chaos-active button, .chaos-active a, .chaos-active input {
            animation: none;
          }
          @keyframes chaos-shake {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(1px, 1px) rotate(0.5deg); }
            50% { transform: translate(-1px, -1px) rotate(-0.5deg); }
            75% { transform: translate(1px, -1px) rotate(0.5deg); }
          }
        `}</style>
      )}
    </main>
  );
}
