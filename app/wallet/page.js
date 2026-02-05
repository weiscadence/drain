'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { SolanaProviders } from '../providers';
import Link from 'next/link';

function WalletContent() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWalletData = useCallback(async () => {
    if (!publicKey || !connection) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch SOL balance
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
      
      // Fetch token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
      );
      
      const tokenList = tokenAccounts.value
        .map(account => {
          const info = account.account.data.parsed.info;
          return {
            mint: info.mint,
            amount: info.tokenAmount.uiAmount,
            decimals: info.tokenAmount.decimals,
            symbol: info.mint.slice(0, 4) + '...' + info.mint.slice(-4)
          };
        })
        .filter(t => t.amount > 0)
        .slice(0, 10); // Show top 10
      
      setTokens(tokenList);
      
      // Fetch recent transactions
      const sigs = await connection.getSignaturesForAddress(publicKey, { limit: 5 });
      const txList = sigs.map(sig => ({
        signature: sig.signature,
        slot: sig.slot,
        time: sig.blockTime ? new Date(sig.blockTime * 1000).toLocaleString() : 'Pending',
        status: sig.err ? 'Failed' : 'Success'
      }));
      setTransactions(txList);
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection]);

  useEffect(() => {
    if (connected && publicKey) {
      fetchWalletData();
    } else {
      setBalance(null);
      setTokens([]);
      setTransactions([]);
    }
  }, [connected, publicKey, fetchWalletData]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      {/* Header */}
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
          solana wallet toolkit 〰️
        </p>

        {/* Wallet Connect */}
        <div style={{ marginBottom: '2rem' }}>
          <WalletMultiButton style={{
            background: '#111',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '1rem'
          }} />
        </div>

        {!connected ? (
          <div style={{
            background: '#0a0a0a',
            border: '1px solid #222',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              connect your wallet to view balances, tokens, and transactions
            </p>
            <p style={{ color: '#444', fontSize: '0.9rem', marginTop: '1rem' }}>
              supports phantom, solflare, and other solana wallets
            </p>
          </div>
        ) : (
          <>
            {/* Address */}
            <div style={{
              background: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                CONNECTED ADDRESS
              </p>
              <p style={{ 
                fontFamily: 'monospace', 
                fontSize: '0.9rem',
                wordBreak: 'break-all'
              }}>
                {publicKey?.toBase58()}
              </p>
            </div>

            {loading ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                loading wallet data...
              </p>
            ) : error ? (
              <div style={{
                background: '#1a0a0a',
                border: '1px solid #422',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <p style={{ color: '#f66' }}>Error: {error}</p>
                <button 
                  onClick={fetchWalletData}
                  style={{
                    marginTop: '1rem',
                    background: '#222',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {/* SOL Balance */}
                <div style={{
                  background: '#0a0a0a',
                  border: '1px solid #222',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    SOL BALANCE
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: '300' }}>
                    {balance !== null ? balance.toFixed(4) : '—'} <span style={{ color: '#666' }}>SOL</span>
                  </p>
                </div>

                {/* Token Holdings */}
                <div style={{
                  background: '#0a0a0a',
                  border: '1px solid #222',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    TOKEN HOLDINGS {tokens.length > 0 && `(${tokens.length})`}
                  </p>
                  {tokens.length === 0 ? (
                    <p style={{ color: '#444' }}>no tokens found</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {tokens.map((token, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.75rem',
                          background: '#111',
                          borderRadius: '8px'
                        }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#888' }}>
                            {token.symbol}
                          </span>
                          <span style={{ fontWeight: '500' }}>
                            {token.amount.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Transactions */}
                <div style={{
                  background: '#0a0a0a',
                  border: '1px solid #222',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    RECENT TRANSACTIONS
                  </p>
                  {transactions.length === 0 ? (
                    <p style={{ color: '#444' }}>no recent transactions</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {transactions.map((tx, i) => (
                        <a 
                          key={i}
                          href={`https://solscan.io/tx/${tx.signature}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.75rem',
                            background: '#111',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            color: 'inherit'
                          }}
                        >
                          <div>
                            <span style={{ 
                              fontFamily: 'monospace', 
                              fontSize: '0.8rem',
                              color: '#4a9eff'
                            }}>
                              {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                            </span>
                            <span style={{ 
                              marginLeft: '0.75rem',
                              fontSize: '0.75rem',
                              color: tx.status === 'Success' ? '#4a4' : '#a44'
                            }}>
                              {tx.status}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>
                            {tx.time}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Refresh */}
                <button 
                  onClick={fetchWalletData}
                  style={{
                    marginTop: '1.5rem',
                    width: '100%',
                    background: '#111',
                    border: '1px solid #333',
                    color: '#fff',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  ↻ refresh data
                </button>
              </>
            )}
          </>
        )}

        {/* Footer */}
        <p style={{ 
          textAlign: 'center', 
          color: '#333', 
          marginTop: '3rem',
          fontSize: '0.9rem'
        }}>
          〰️ drainfun.xyz — tools for the autonomous
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
