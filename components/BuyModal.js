'use client';
import { useState, useEffect } from 'react';

// ── Real Jupiter Swap via Phantom ─────────────────────────
// 1. Gets quote from Jupiter API (client-side)
// 2. Builds swap transaction
// 3. User signs with Phantom (or any Solana wallet)
// 4. Broadcasts to Solana mainnet

const SOL_MINT = 'So11111111111111111111111111111111111111112';
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

const SWAP_AMOUNTS = [0.01, 0.05, 0.1, 0.5, 1];

function openExternal(url) {
  const tg = window?.Telegram?.WebApp;
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, '_blank');
}

async function getPhantomProvider() {
  // Check for Phantom in browser
  if (window?.phantom?.solana?.isPhantom) return window.phantom.solana;
  if (window?.solana?.isPhantom) return window.solana;
  return null;
}

async function getJupiterQuote(inputMint, outputMint, amountLamports) {
  const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountLamports}&slippageBps=300&onlyDirectRoutes=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Jupiter quote failed');
  return res.json();
}

async function getJupiterSwapTx(quoteResponse, userPublicKey) {
  const res = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: userPublicKey.toString(),
      wrapAndUnwrapSol: true,
      computeUnitPriceMicroLamports: 'auto',
    }),
  });
  if (!res.ok) throw new Error('Jupiter swap build failed');
  return res.json();
}

export default function BuyModal({ token, onClose, walletAddress }) {
  const [step, setStep] = useState('amount'); // amount | confirm | signing | success | error
  const [solAmount, setSolAmount] = useState(0.1);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [txSig, setTxSig] = useState(null);
  const [error, setError] = useState(null);
  const [phantomConnected, setPhantomConnected] = useState(false);
  const [pubkey, setPubkey] = useState(walletAddress || null);

  // Check if Phantom is available
  useEffect(() => {
    const check = async () => {
      const provider = await getPhantomProvider();
      if (provider?.publicKey) {
        setPhantomConnected(true);
        setPubkey(provider.publicKey.toString());
      }
    };
    check();
  }, []);

  // Fetch Jupiter quote when amount changes
  useEffect(() => {
    if (!token?.mint || solAmount <= 0) return;
    setQuoteLoading(true);
    setQuote(null);

    const lamports = Math.floor(solAmount * 1e9);
    getJupiterQuote(SOL_MINT, token.mint, lamports)
      .then(q => setQuote(q))
      .catch(() => {
        // Token might not be on Jupiter yet — show devnet fallback
        setQuote({ _mock: true, outAmount: '~' + (solAmount * 1000000).toFixed(0) });
      })
      .finally(() => setQuoteLoading(false));
  }, [solAmount, token?.mint]);

  const connectPhantom = async () => {
    const provider = await getPhantomProvider();
    if (!provider) {
      openExternal('https://phantom.app');
      return;
    }
    try {
      const resp = await provider.connect();
      setPubkey(resp.publicKey.toString());
      setPhantomConnected(true);
    } catch (e) {
      setError('Connection cancelled');
    }
  };

  const executeSwap = async () => {
    setStep('signing');
    setError(null);

    try {
      const provider = await getPhantomProvider();
      if (!provider) throw new Error('Phantom not found. Install Phantom wallet.');

      // Ensure connected
      let key = pubkey;
      if (!key) {
        const resp = await provider.connect();
        key = resp.publicKey.toString();
        setPubkey(key);
      }

      const lamports = Math.floor(solAmount * 1e9);

      // Get fresh quote
      const freshQuote = await getJupiterQuote(SOL_MINT, token.mint, lamports);

      // Build swap transaction
      const { swapTransaction } = await getJupiterSwapTx(freshQuote, key);

      // Deserialize and sign
      const { VersionedTransaction } = await import('@solana/web3.js');
      const txData = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(txData);

      // Sign with Phantom
      const signedTx = await provider.signTransaction(transaction);

      // Broadcast
      const { Connection } = await import('@solana/web3.js');
      const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
      const sig = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
      });

      await connection.confirmTransaction(sig, 'confirmed');
      setTxSig(sig);
      setStep('success');

    } catch (e) {
      setError(e.message || 'Transaction failed');
      setStep('error');
    }
  };

  const outAmount = quote && !quote._mock
    ? (parseInt(quote.outAmount) / 1e6).toFixed(2)
    : quote?._mock ? quote.outAmount : '...';

  const priceImpact = quote?.priceImpactPct
    ? (parseFloat(quote.priceImpactPct) * 100).toFixed(2)
    : null;

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(14px)', display:'flex', alignItems:'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width:'100%', background:'#0c0c18', borderRadius:'24px 24px 0 0', border:`1px solid ${token.accent}40`, borderBottom:'none', maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:`0 -4px 40px rgba(0,0,0,0.6), 0 0 0 1px ${token.accent}20` }}>

        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px', flexShrink:0 }}>
          <div style={{ width:36, height:4, borderRadius:99, background:'rgba(255,255,255,0.12)' }}/>
        </div>

        {/* Header */}
        <div style={{ padding:'4px 18px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:`1px solid ${token.accent}20`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {token.image && <img src={token.image} alt="" style={{ width:32, height:32, borderRadius:8, border:`1px solid ${token.accent}40` }} onError={e=>e.target.style.display='none'}/>}
            <div>
              <div style={{ fontSize:16, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>Buy ${token.symbol}</div>
              <div style={{ fontSize:10, color:`${token.accent}cc`, fontFamily:'monospace' }}>Real swap via Jupiter</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'none', color:'rgba(255,255,255,0.5)', width:30, height:30, borderRadius:'50%', fontSize:14, cursor:'pointer' }}>✕</button>
        </div>

        <div style={{ overflowY:'auto', padding:'16px 18px', flex:1 }}>

          {/* WALLET STATUS */}
          <div style={{ marginBottom:14 }}>
            {phantomConnected ? (
              <div style={{ background:'rgba(0,255,136,0.08)', borderRadius:12, padding:'8px 12px', border:'1px solid rgba(0,255,136,0.2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontSize:11, color:'#00ff88', fontFamily:'monospace', fontWeight:700 }}>👻 Phantom Connected</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'JetBrains Mono, monospace' }}>{pubkey?.slice(0,6)}...{pubkey?.slice(-4)}</div>
              </div>
            ) : (
              <button onClick={connectPhantom}
                style={{ width:'100%', padding:'10px', borderRadius:12, background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.3)', color:'#a855f7', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                👻 Connect Phantom to swap
              </button>
            )}
          </div>

          {/* AMOUNT */}
          {(step === 'amount' || step === 'confirm') && (
            <>
              <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.3)', marginBottom:10, fontFamily:'monospace' }}>SOL AMOUNT</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:7, marginBottom:14 }}>
                {SWAP_AMOUNTS.map(a => (
                  <button key={a} onClick={() => setSolAmount(a)}
                    style={{ padding:'10px 0', borderRadius:11, background: solAmount===a ? `${token.accent}18`:'rgba(255,255,255,0.04)', border:`1.5px solid ${solAmount===a ? token.accent:'rgba(255,255,255,0.07)'}`, color: solAmount===a ? token.accent:'rgba(255,255,255,0.65)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'JetBrains Mono, monospace' }}>
                    {a}
                  </button>
                ))}
              </div>

              {/* Quote */}
              <div style={{ background:`${token.accent}0c`, borderRadius:14, padding:'14px', border:`1px solid ${token.accent}25`, marginBottom:14 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontFamily:'monospace', marginBottom:2 }}>YOU PAY</div>
                    <div style={{ fontSize:22, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>{solAmount} SOL</div>
                  </div>
                  <div style={{ fontSize:20, color:'rgba(255,255,255,0.3)' }}>→</div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontFamily:'monospace', marginBottom:2 }}>YOU GET (~)</div>
                    <div style={{ fontSize:22, fontWeight:900, color: quoteLoading ? 'rgba(255,255,255,0.3)' : token.accent, fontFamily:'JetBrains Mono, monospace' }}>
                      {quoteLoading ? '⋯' : outAmount} <span style={{ fontSize:14 }}>${token.symbol}</span>
                    </div>
                  </div>
                </div>
                {priceImpact && parseFloat(priceImpact) > 1 && (
                  <div style={{ fontSize:10, color:'#f59e0b', fontFamily:'monospace' }}>⚠ Price impact: {priceImpact}%</div>
                )}
                {quote?._mock && (
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>Token not yet on Jupiter mainnet — devnet only</div>
                )}
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {/* Real swap button */}
                <button
                  onClick={executeSwap}
                  disabled={!phantomConnected || quoteLoading || quote?._mock}
                  style={{ width:'100%', height:52, borderRadius:16, background: phantomConnected && !quote?._mock ? `linear-gradient(135deg, ${token.accent}, ${token.accent}99)` : 'rgba(255,255,255,0.06)', color: phantomConnected && !quote?._mock ? '#000':'rgba(255,255,255,0.3)', fontSize:15, fontWeight:900, cursor: phantomConnected && !quote?._mock ? 'pointer':'default', border:'none', fontFamily:'JetBrains Mono, monospace', boxShadow: phantomConnected && !quote?._mock ? `0 4px 20px ${token.accent}40`:' none', letterSpacing:0.5 }}
                >
                  {!phantomConnected ? 'Connect Phantom first' : quoteLoading ? 'Getting quote...' : quote?._mock ? 'Not on mainnet yet' : `Swap ${solAmount} SOL → $${token.symbol}`}
                </button>

                {/* Devnet test button */}
                <button
                  onClick={() => {
                    // For devnet testing: just send a devnet SOL transfer to show real tx
                    setStep('signing');
                    setTimeout(() => {
                      // Simulate devnet tx for demo
                      setTxSig('devnet_demo_' + Date.now());
                      setStep('success');
                    }, 2000);
                  }}
                  style={{ width:'100%', height:42, borderRadius:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}
                >
                  🧪 Test on devnet (simulate)
                </button>
              </div>
            </>
          )}

          {/* SIGNING */}
          {step === 'signing' && (
            <div style={{ textAlign:'center', padding:'30px 0' }}>
              <div style={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${token.accent}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }}/>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>
                Check Phantom
              </div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:6, fontFamily:'monospace' }}>
                Approve the transaction in your wallet
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 'success' && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:56, marginBottom:12, filter:`drop-shadow(0 0 20px ${token.accent})` }}>✅</div>
              <div style={{ fontSize:18, fontWeight:900, color:token.accent, fontFamily:'JetBrains Mono, monospace', marginBottom:6 }}>Swap confirmed!</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'monospace', marginBottom:16 }}>
                {solAmount} SOL → ${token.symbol}
              </div>
              {txSig && !txSig.startsWith('devnet_demo') && (
                <button onClick={() => openExternal(`https://solscan.io/tx/${txSig}`)}
                  style={{ padding:'8px 20px', borderRadius:12, background:`${token.accent}15`, border:`1px solid ${token.accent}40`, color:token.accent, fontWeight:700, cursor:'pointer', fontFamily:'monospace', fontSize:12, marginBottom:16, display:'block', margin:'0 auto 16px' }}>
                  View on Solscan →
                </button>
              )}
              <button onClick={onClose}
                style={{ padding:'12px 32px', borderRadius:14, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', fontWeight:700, cursor:'pointer', fontFamily:'monospace', fontSize:13 }}>
                Done
              </button>
            </div>
          )}

          {/* ERROR */}
          {step === 'error' && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:56, marginBottom:12 }}>❌</div>
              <div style={{ fontSize:15, fontWeight:700, color:'#ef4444', fontFamily:'JetBrains Mono, monospace', marginBottom:8 }}>Swap failed</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'monospace', marginBottom:16, lineHeight:1.5 }}>{error}</div>
              <button onClick={() => setStep('amount')}
                style={{ padding:'10px 24px', borderRadius:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                Try again
              </button>
            </div>
          )}

          <div style={{ height:20 }}/>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
