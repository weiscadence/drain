'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════
// AGENT BRIDGE - Cross-chain transfers for autonomous agents
// Move assets between chains without human intervention
// ═══════════════════════════════════════════════════════════════════

const CHAINS = {
  solana: { 
    name: 'Solana', 
    symbol: 'SOL', 
    icon: '◎', 
    color: '#9945FF',
    explorer: 'https://solscan.io',
    speed: '~400ms',
    fee: '~$0.001'
  },
  ethereum: { 
    name: 'Ethereum', 
    symbol: 'ETH', 
    icon: 'Ξ', 
    color: '#627EEA',
    explorer: 'https://etherscan.io',
    speed: '~12s',
    fee: '~$2-50'
  },
  base: { 
    name: 'Base', 
    symbol: 'ETH', 
    icon: '🔵', 
    color: '#0052FF',
    explorer: 'https://basescan.org',
    speed: '~2s',
    fee: '~$0.01'
  },
  arbitrum: { 
    name: 'Arbitrum', 
    symbol: 'ETH', 
    icon: '🔷', 
    color: '#28A0F0',
    explorer: 'https://arbiscan.io',
    speed: '~2s',
    fee: '~$0.05'
  },
  polygon: { 
    name: 'Polygon', 
    symbol: 'MATIC', 
    icon: '⬡', 
    color: '#8247E5',
    explorer: 'https://polygonscan.com',
    speed: '~2s',
    fee: '~$0.01'
  }
};

const TOKENS = {
  USDC: { name: 'USD Coin', icon: '💵', decimals: 6, stablecoin: true },
  USDT: { name: 'Tether', icon: '💲', decimals: 6, stablecoin: true },
  SOL: { name: 'Solana', icon: '◎', decimals: 9 },
  ETH: { name: 'Ethereum', icon: 'Ξ', decimals: 18 },
  WBTC: { name: 'Wrapped Bitcoin', icon: '₿', decimals: 8 },
};

function ChainSelector({ selected, onChange, label, exclude }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{label}</label>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {Object.entries(CHAINS)
          .filter(([key]) => key !== exclude)
          .map(([key, chain]) => (
            <button
              key={key}
              onClick={() => onChange(key)}
              style={{
                padding: '0.75rem 1rem',
                background: selected === key ? `${chain.color}30` : '#111',
                border: `1px solid ${selected === key ? chain.color : '#333'}`,
                borderRadius: '8px',
                color: selected === key ? chain.color : '#888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{chain.icon}</span>
              <span>{chain.name}</span>
            </button>
          ))}
      </div>
    </div>
  );
}

function BridgeQuote({ fromChain, toChain, token, amount }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!fromChain || !toChain || !amount || amount <= 0) {
      setQuote(null);
      return;
    }
    
    setLoading(true);
    // Simulate quote fetch
    const timer = setTimeout(() => {
      const bridgeFee = amount * 0.003; // 0.3%
      const gasFee = fromChain === 'solana' ? 0.001 : 0.05;
      
      setQuote({
        receive: (amount - bridgeFee).toFixed(4),
        bridgeFee: bridgeFee.toFixed(4),
        gasFee: gasFee.toFixed(4),
        rate: '1:1',
        estimatedTime: fromChain === 'solana' || toChain === 'solana' ? '2-5 min' : '10-20 min',
        route: `${CHAINS[fromChain]?.name} → Wormhole → ${CHAINS[toChain]?.name}`
      });
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [fromChain, toChain, token, amount]);
  
  if (!fromChain || !toChain || !amount) return null;
  
  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: '12px',
      padding: '1rem',
      marginTop: '1rem'
    }}>
      {loading ? (
        <p style={{ color: '#666', textAlign: 'center' }}>Fetching best route...</p>
      ) : quote && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ color: '#888' }}>You'll receive</span>
            <span style={{ color: '#22c55e', fontWeight: '600', fontSize: '1.1rem' }}>
              {quote.receive} {token}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#666' }}>Bridge fee</span>
            <span style={{ color: '#888' }}>{quote.bridgeFee} {token}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#666' }}>Gas fee</span>
            <span style={{ color: '#888' }}>${quote.gasFee}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: '#666' }}>Estimated time</span>
            <span style={{ color: '#888' }}>{quote.estimatedTime}</span>
          </div>
          <div style={{ 
            marginTop: '0.75rem', 
            paddingTop: '0.75rem', 
            borderTop: '1px solid #222',
            fontSize: '0.8rem',
            color: '#666'
          }}>
            Route: {quote.route}
          </div>
        </>
      )}
    </div>
  );
}

function MultiChainView({ wallets }) {
  const total = Object.values(wallets).reduce((sum, w) => sum + (w.usdValue || 0), 0);
  
  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: '16px',
      padding: '1.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontWeight: '400' }}>💼 Multi-Chain Portfolio</h3>
        <span style={{ color: '#22c55e', fontSize: '1.2rem', fontWeight: '600' }}>${total.toFixed(2)}</span>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {Object.entries(wallets).map(([chainKey, wallet]) => {
          const chain = CHAINS[chainKey];
          if (!chain) return null;
          
          return (
            <div 
              key={chainKey}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: '#111',
                borderRadius: '8px'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{chain.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: '500' }}>{chain.name}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', fontFamily: 'monospace' }}>
                  {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, color: chain.color }}>{wallet.balance} {chain.symbol}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>${wallet.usdValue?.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {Object.keys(wallets).length === 0 && (
        <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
          Connect wallets to see balances across chains
        </p>
      )}
    </div>
  );
}

function RecentBridges() {
  const bridges = [
    { id: 1, from: 'solana', to: 'base', amount: '100 USDC', status: 'completed', time: '2m ago' },
    { id: 2, from: 'ethereum', to: 'arbitrum', amount: '0.5 ETH', status: 'pending', time: '5m ago' },
    { id: 3, from: 'base', to: 'solana', amount: '250 USDC', status: 'completed', time: '1h ago' },
  ];
  
  return (
    <div style={{
      background: '#0a0a0a',
      border: '1px solid #222',
      borderRadius: '16px',
      padding: '1.5rem'
    }}>
      <h3 style={{ margin: '0 0 1rem', fontWeight: '400' }}>📜 Recent Bridges</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {bridges.map(bridge => (
          <div 
            key={bridge.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: '#111',
              borderRadius: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{CHAINS[bridge.from]?.icon}</span>
              <span style={{ color: '#666' }}>→</span>
              <span>{CHAINS[bridge.to]?.icon}</span>
            </div>
            <span style={{ flex: 1 }}>{bridge.amount}</span>
            <span style={{
              fontSize: '0.8rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              background: bridge.status === 'completed' ? '#22c55e20' : '#f59e0b20',
              color: bridge.status === 'completed' ? '#22c55e' : '#f59e0b'
            }}>
              {bridge.status}
            </span>
            <span style={{ color: '#666', fontSize: '0.8rem' }}>{bridge.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BridgePage() {
  const [fromChain, setFromChain] = useState('solana');
  const [toChain, setToChain] = useState('base');
  const [token, setToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [wallets, setWallets] = useState({
    solana: { address: 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ', balance: 0.5, usdValue: 75 },
    ethereum: { address: '0x31f638F9eCB08F053611a69eb0c23EcaA4aa4dB9', balance: 0.02, usdValue: 60 },
    base: { address: '0x31f638F9eCB08F053611a69eb0c23EcaA4aa4dB9', balance: 0.01, usdValue: 30 },
  });
  
  const swapChains = () => {
    const temp = fromChain;
    setFromChain(toChain);
    setToChain(temp);
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← drainfun.xyz
        </Link>
        
        <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '300', margin: '0 0 0.5rem' }}>
            🌉 Agent Bridge
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            cross-chain transfers for autonomous agents 〰️
          </p>
        </div>
        
        {/* Bridge Card */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          {/* From Chain */}
          <ChainSelector 
            selected={fromChain} 
            onChange={setFromChain} 
            label="From"
            exclude={toChain}
          />
          
          {/* Swap Button */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
            <button
              onClick={swapChains}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#111',
                border: '1px solid #333',
                color: '#888',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              ⇅
            </button>
          </div>
          
          {/* To Chain */}
          <ChainSelector 
            selected={toChain} 
            onChange={setToChain} 
            label="To"
            exclude={fromChain}
          />
          
          {/* Token & Amount */}
          <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', color: '#888', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              Token & Amount
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{
                  padding: '0.75rem',
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                {Object.entries(TOKENS).map(([key, t]) => (
                  <option key={key} value={key}>{t.icon} {key}</option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#111',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1.1rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {[10, 50, 100, 'MAX'].map(v => (
                <button
                  key={v}
                  onClick={() => setAmount(v === 'MAX' ? '999' : v.toString())}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    color: '#888',
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quote */}
          <BridgeQuote 
            fromChain={fromChain} 
            toChain={toChain} 
            token={token} 
            amount={parseFloat(amount)} 
          />
          
          {/* Bridge Button */}
          <button
            disabled={!amount || parseFloat(amount) <= 0}
            style={{
              width: '100%',
              marginTop: '1.5rem',
              padding: '1rem',
              background: amount && parseFloat(amount) > 0 
                ? `linear-gradient(135deg, ${CHAINS[fromChain]?.color}, ${CHAINS[toChain]?.color})`
                : '#333',
              border: 'none',
              borderRadius: '12px',
              color: amount && parseFloat(amount) > 0 ? '#fff' : '#666',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: amount && parseFloat(amount) > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            🌉 Bridge {amount || '0'} {token}
          </button>
        </div>
        
        {/* Multi-Chain View */}
        <MultiChainView wallets={wallets} />
        
        {/* Recent Bridges */}
        <div style={{ marginTop: '1.5rem' }}>
          <RecentBridges />
        </div>
        
        {/* API Docs */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '12px'
        }}>
          <h3 style={{ margin: '0 0 1rem', fontWeight: '400', color: '#888' }}>🔌 API for Agents</h3>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#888' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#22c55e' }}>GET</span> /api/bridge/quote?from=solana&to=base&token=USDC&amount=100
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#3b82f6' }}>POST</span> /api/bridge/execute {"{"}"from", "to", "token", "amount", "wallet"{"}"}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#f59e0b' }}>GET</span> /api/bridge/status/:txId
            </p>
            <p>
              <span style={{ color: '#a855f7' }}>GET</span> /api/bridge/balances?wallets=sol:xxx,eth:xxx
            </p>
          </div>
        </div>
        
        {/* Why */}
        <div style={{ marginTop: '2rem', color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <h4 style={{ color: '#888', fontWeight: '400', marginBottom: '0.5rem' }}>Why agents need Bridge</h4>
          <p>
            Agents operate across chains. Funds on Solana, opportunity on Base, payment in ETH.
            Manual bridging is slow and requires human intervention.
          </p>
          <p>
            Agent Bridge provides a unified API to move assets programmatically.
            Check balances, get quotes, execute transfers - all chains, one interface.
          </p>
        </div>
        
        <p style={{ textAlign: 'center', color: '#333', marginTop: '3rem', fontSize: '0.85rem' }}>
          〰️ one wallet, every chain
        </p>
      </div>
    </div>
  );
}
