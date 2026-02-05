'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { SolanaProviders } from '../providers';
import Link from 'next/link';

// Chain configs
const CHAINS = {
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    color: '#9945FF',
    icon: '◎',
    rpc: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://solscan.io/account/'
  },
  base: {
    name: 'Base',
    symbol: 'ETH',
    color: '#0052FF',
    icon: '🔵',
    rpc: 'https://mainnet.base.org',
    explorer: 'https://basescan.org/address/',
    chainId: 8453
  },
  monad: {
    name: 'Monad',
    symbol: 'MON',
    color: '#8B5CF6',
    icon: '🟣',
    rpc: 'https://rpc.monad.xyz',
    explorer: 'https://explorer.monad.xyz/address/',
    chainId: 10143
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    icon: 'Ξ',
    rpc: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io/address/',
    chainId: 1
  },
  arbitrum: {
    name: 'Arbitrum',
    symbol: 'ETH',
    color: '#28A0F0',
    icon: '🔷',
    rpc: 'https://arb1.arbitrum.io/rpc',
    explorer: 'https://arbiscan.io/address/',
    chainId: 42161
  }
};

function WalletContent() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [activeChain, setActiveChain] = useState('solana');
  const [balances, setBalances] = useState({});
  const [evmAddress, setEvmAddress] = useState('');
  const [loading, setLoading] = useState({});
  const [showAddWallet, setShowAddWallet] = useState(false);

  // Fetch Solana balance
  const fetchSolanaBalance = useCallback(async () => {
    if (!publicKey || !connection) return;
    setLoading(prev => ({ ...prev, solana: true }));
    try {
      const bal = await connection.getBalance(publicKey);
      setBalances(prev => ({ ...prev, solana: bal / LAMPORTS_PER_SOL }));
    } catch (err) {
      console.error('Solana fetch error:', err);
    }
    setLoading(prev => ({ ...prev, solana: false }));
  }, [publicKey, connection]);

  // Fetch EVM balance
  const fetchEvmBalance = async (chain, address) => {
    if (!address || !address.startsWith('0x')) return;
    setLoading(prev => ({ ...prev, [chain]: true }));
    try {
      const response = await fetch(CHAINS[chain].rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [address, 'latest'],
          id: 1
        })
      });
      const data = await response.json();
      if (data.result) {
        const bal = parseInt(data.result, 16) / 1e18;
        setBalances(prev => ({ ...prev, [chain]: bal }));
      }
    } catch (err) {
      console.error(`${chain} fetch error:`, err);
    }
    setLoading(prev => ({ ...prev, [chain]: false }));
  };

  // Load saved EVM address
  useEffect(() => {
    const saved = localStorage.getItem('evmAddress');
    if (saved) setEvmAddress(saved);
  }, []);

  // Fetch all balances when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchSolanaBalance();
    }
  }, [connected, publicKey, fetchSolanaBalance]);

  // Fetch EVM balances when address is set
  useEffect(() => {
    if (evmAddress && evmAddress.startsWith('0x')) {
      localStorage.setItem('evmAddress', evmAddress);
      ['base', 'monad', 'ethereum', 'arbitrum'].forEach(chain => {
        fetchEvmBalance(chain, evmAddress);
      });
    }
  }, [evmAddress]);

  const totalUsd = Object.entries(balances).reduce((sum, [chain, bal]) => {
    // Rough price estimates
    const prices = { solana: 150, base: 2500, ethereum: 2500, arbitrum: 2500, monad: 1 };
    return sum + (bal || 0) * (prices[chain] || 0);
  }, 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← back to drain
        </Link>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '300',
          margin: '2rem 0 0.5rem',
          letterSpacing: '-0.02em'
        }}>
          /wallet
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          multi-chain wallet • solana + base + monad + eth 〰️
        </p>

        {/* Total Portfolio */}
        <div style={{
          background: 'linear-gradient(135deg, #9945FF22, #0052FF22)',
          border: '1px solid #333',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '0.5rem' }}>TOTAL PORTFOLIO</p>
          <p style={{ fontSize: '3rem', fontWeight: '300' }}>
            ${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Connect Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <WalletMultiButton style={{
            background: '#9945FF22',
            border: '1px solid #9945FF',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '0.9rem'
          }} />
          
          <button 
            onClick={() => setShowAddWallet(!showAddWallet)}
            style={{
              background: '#0052FF22',
              border: '1px solid #0052FF',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {showAddWallet ? '✕ Close' : '+ Add EVM Wallet'}
          </button>
        </div>

        {/* EVM Address Input */}
        {showAddWallet && (
          <div style={{
            background: '#0a0a0a',
            border: '1px solid #222',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Enter your EVM address (works for Base, Monad, Ethereum, Arbitrum)
            </p>
            <input
              type="text"
              placeholder="0x..."
              value={evmAddress}
              onChange={(e) => setEvmAddress(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            />
          </div>
        )}

        {/* Chain Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
          {Object.entries(CHAINS).map(([key, chain]) => (
            <button
              key={key}
              onClick={() => setActiveChain(key)}
              style={{
                padding: '0.6rem 1.2rem',
                borderRadius: '20px',
                border: activeChain === key ? `2px solid ${chain.color}` : '1px solid #333',
                background: activeChain === key ? `${chain.color}22` : 'transparent',
                color: activeChain === key ? chain.color : '#888',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: '500',
                whiteSpace: 'nowrap'
              }}
            >
              {chain.icon} {chain.name}
            </button>
          ))}
        </div>

        {/* Chain Balances Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {Object.entries(CHAINS).map(([key, chain]) => (
            <div 
              key={key}
              style={{
                background: '#0a0a0a',
                border: `1px solid ${activeChain === key ? chain.color : '#222'}`,
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setActiveChain(key)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{chain.icon}</span>
                {loading[key] && <span style={{ color: '#666', fontSize: '0.8rem' }}>loading...</span>}
              </div>
              <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.3rem' }}>{chain.name}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: '300', color: chain.color }}>
                {balances[key] !== undefined ? balances[key].toFixed(4) : '—'} 
                <span style={{ color: '#666', fontSize: '0.9rem', marginLeft: '0.3rem' }}>{chain.symbol}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Active Chain Details */}
        <div style={{
          background: '#0a0a0a',
          border: `1px solid ${CHAINS[activeChain].color}44`,
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ color: CHAINS[activeChain].color, marginBottom: '1rem' }}>
            {CHAINS[activeChain].icon} {CHAINS[activeChain].name} Details
          </h3>
          
          {activeChain === 'solana' ? (
            connected ? (
              <div>
                <p style={{ color: '#888', fontSize: '0.8rem' }}>ADDRESS</p>
                <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', marginBottom: '1rem' }}>
                  {publicKey?.toBase58()}
                </p>
                <a 
                  href={`${CHAINS[activeChain].explorer}${publicKey?.toBase58()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: CHAINS[activeChain].color, fontSize: '0.9rem' }}
                >
                  View on Explorer →
                </a>
              </div>
            ) : (
              <p style={{ color: '#666' }}>Connect Solana wallet above to view details</p>
            )
          ) : (
            evmAddress ? (
              <div>
                <p style={{ color: '#888', fontSize: '0.8rem' }}>ADDRESS</p>
                <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', wordBreak: 'break-all', marginBottom: '1rem' }}>
                  {evmAddress}
                </p>
                <a 
                  href={`${CHAINS[activeChain].explorer}${evmAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: CHAINS[activeChain].color, fontSize: '0.9rem' }}
                >
                  View on {CHAINS[activeChain].name} Explorer →
                </a>
              </div>
            ) : (
              <p style={{ color: '#666' }}>Add EVM wallet address above to view {CHAINS[activeChain].name} details</p>
            )
          )}
        </div>

        {/* Hackathon Badge */}
        <div style={{
          background: 'linear-gradient(135deg, #8B5CF622, #9945FF22)',
          border: '1px solid #8B5CF644',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#8B5CF6', fontWeight: '600', marginBottom: '0.5rem' }}>
            🏆 Hackathon Ready
          </p>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            Supports Monad (Moltiverse) • Solana (Colosseum) • Base • Ethereum
          </p>
        </div>

        {/* Footer */}
        <p style={{ 
          color: '#444', 
          fontSize: '0.85rem', 
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          〰️ one wallet page, every chain
        </p>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <SolanaProviders>
      <WalletContent />
    </SolanaProviders>
  );
}
