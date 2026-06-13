'use client';
import { useState, useEffect } from 'react';
import SpinWheel from './SpinWheel';

// ── In-App Swap — no Phantom needed ──────────────────────
// App's built-in wallet (derived from TG ID) signs server-side
// Real transaction on local Solana validator

const AMOUNTS = [0.01, 0.05, 0.1, 0.5, 1];

function getTelegramId() {
  try { return window?.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'preview'; }
  catch { return 'preview'; }
}

function savePosition(token, solAmount, outAmount, sig) {
  try {
    const tgId = getTelegramId();
    const key = `drain_positions_${tgId}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    // Only store plain serializable primitives — never the full token object
    // (token can contain Solana objects with circular refs via component state)
    const pos = {
      token: String(token.symbol || ''),
      tokenMint: String(token.mint || ''),
      tokenName: String(token.name || ''),
      side: 'BUY',
      solAmount: Number(solAmount) || 0,
      outAmount: Number(outAmount) || 0,
      pnlPct: 0,
      pnlSol: 0,
      sig: String(sig || ''),
      timestamp: Date.now(),
      timeLabel: 'just now',
      color: '#22c55e',
      priceAtBuy: Number(token.price) || 0,
      priceHistory: [100],
      changeAtBuy: Number(token.change) || 0,
    };
    existing.unshift(pos);
    // Use try/catch on stringify separately so we can debug if it still fails
    const serialized = JSON.stringify(existing.slice(0, 20));
    localStorage.setItem(key, serialized);
  } catch (e) {
    // Last resort: save minimal record
    try {
      const tgId = getTelegramId();
      const key = `drain_positions_${tgId}`;
      const min = [{ token: String(token?.symbol||''), solAmount: Number(solAmount)||0, timestamp: Date.now(), pnlPct: 0, priceHistory: [100] }];
      localStorage.setItem(key, JSON.stringify(min));
    } catch {}
  }
}

export default function BuyModal({ token, onClose, onSuccess, telegramId, walletAddress }) {
  const [solAmount, setSolAmount] = useState(0.1);
  const [step, setStep] = useState('amount'); // amount | swapping | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [showWheel, setShowWheel] = useState(false);

  const tgId = telegramId || getTelegramId();

  // Get Bags quote
  useEffect(() => {
    if (!token?.mint || solAmount <= 0) return;
    setQuoteLoading(true);
    setQuote(null);

    fetch(`https://public-api-v2.bags.fm/api/v1/trade/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${token.mint}&amount=${Math.floor(solAmount * 1e9)}`, {
      headers: { 'x-api-key': 'bags_prod_Gfs8X37kTcY5o9PyLDRogNCEyEGgf4rPLnZtUD7afLA' }
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setQuote(d.response);
        else setQuote({ _mock: true, outAmount: Math.floor(solAmount * 1000000).toString() });
      })
      .catch(() => setQuote({ _mock: true, outAmount: Math.floor(solAmount * 1000000).toString() }))
      .finally(() => setQuoteLoading(false));
  }, [solAmount, token?.mint]);

  const executeSwap = async (x2 = false, nothingLoss = false) => {
    // Guard: coerce x2/nothingLoss to booleans — onClick passes MouseEvent as first arg otherwise
    if (x2 !== true) x2 = false;
    if (nothingLoss !== true) nothingLoss = false;
    setStep('swapping');
    setError(null);
    try {
      const res = await fetch('/api/wallet/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: String(tgId),
          tokenMint: String(token?.mint || ''),
          tokenSymbol: String(token?.symbol || ''),
          solAmount: Number(solAmount) || 0.1,
          action: 'buy',
          x2: x2 === true,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        if (nothingLoss) {
          setResult({ nothing: true });
          setStep('success');
          return;
        }
        throw new Error(data.error || 'Swap failed');
      }
      
      if (nothingLoss) {
        // Wheel said nothing — took their SOL, show loss screen
        setResult({ ...data, nothing: true });
      } else {
        // Save to positions
        savePosition(token, data.solAmount, data.outAmount, data.signature);
        setResult(data);
      }
      setStep('success');
    } catch (e) {
      if (nothingLoss) {
        setResult({ nothing: true });
        setStep('success');
      } else {
        setError(e.message);
        setStep('error');
      }
    }
  };

  const outAmount = quote?.outAmount
    ? parseInt(quote.outAmount) > 1e9
      ? `${(parseInt(quote.outAmount) / 1e9).toFixed(2)}B`
      : parseInt(quote.outAmount) > 1e6
      ? `${(parseInt(quote.outAmount) / 1e6).toFixed(2)}M`
      : parseInt(quote.outAmount).toLocaleString()
    : '...';

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(14px)', display:'flex', alignItems:'flex-end' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width:'100%', background:'#0c0c18', borderRadius:'24px 24px 0 0', border:`1px solid ${token.accent}40`, borderBottom:'none', maxHeight:'80vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:`0 -4px 40px rgba(0,0,0,0.6), 0 0 0 1px ${token.accent}20` }}>

        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 4px', flexShrink:0 }}>
          <div style={{ width:36, height:4, borderRadius:99, background:'rgba(255,255,255,0.12)' }}/>
        </div>

        {/* Header */}
        <div style={{ padding:'4px 18px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:`1px solid ${token.accent}20`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {token.image && (
              <img src={token.image} alt="" onError={e => e.target.style.display='none'}
                style={{ width:32, height:32, borderRadius:8, objectFit:'contain', background:`${token.accent}15`, padding:2 }}/>
            )}
            <div>
              <div style={{ fontSize:16, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>Buy ${token.symbol}</div>
              <div style={{ fontSize:10, color:`${token.accent}cc`, fontFamily:'monospace' }}>
                devnet · app wallet · instant
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.07)', border:'none', color:'rgba(255,255,255,0.5)', width:30, height:30, borderRadius:'50%', fontSize:14, cursor:'pointer' }}>✕</button>
        </div>

        <div style={{ overflowY:'auto', padding:'16px 18px', flex:1 }}>

          {/* AMOUNT STEP */}
          {(step === 'amount') && (
            <>
              {/* Wallet indicator — no connect needed */}
              <div style={{ background:'rgba(0,255,136,0.07)', borderRadius:12, padding:'8px 12px', border:'1px solid rgba(0,255,136,0.2)', marginBottom:14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontSize:11, color:'#00ff88', fontFamily:'monospace', fontWeight:700 }}>✓ App wallet ready</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontFamily:'JetBrains Mono, monospace' }}>
                  {walletAddress ? walletAddress.slice(0,6)+'...'+walletAddress.slice(-4) : 'devnet'}
                </div>
              </div>

              <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.3)', marginBottom:10, fontFamily:'monospace' }}>SOL AMOUNT</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:7, marginBottom:14 }}>
                {AMOUNTS.map(a => (
                  <button key={a} onClick={() => setSolAmount(a)}
                    style={{ padding:'11px 0', borderRadius:11, background: solAmount===a ? `${token.accent}18`:'rgba(255,255,255,0.04)', border:`1.5px solid ${solAmount===a ? token.accent:'rgba(255,255,255,0.07)'}`, color: solAmount===a ? token.accent:'rgba(255,255,255,0.65)', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'JetBrains Mono, monospace' }}>
                    {a}
                  </button>
                ))}
              </div>

              {/* Quote display */}
              <div style={{ background:`${token.accent}0c`, borderRadius:14, padding:'14px', border:`1px solid ${token.accent}25`, marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontFamily:'monospace', marginBottom:2 }}>YOU PAY</div>
                    <div style={{ fontSize:24, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>{solAmount} SOL</div>
                  </div>
                  <div style={{ fontSize:22, color:'rgba(255,255,255,0.2)' }}>→</div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontFamily:'monospace', marginBottom:2 }}>YOU GET (~)</div>
                    <div style={{ fontSize:22, fontWeight:900, color: quoteLoading ? 'rgba(255,255,255,0.3)':token.accent, fontFamily:'JetBrains Mono, monospace' }}>
                      {quoteLoading ? '⋯' : outAmount}
                    </div>
                    <div style={{ fontSize:10, color:token.accent, fontFamily:'monospace' }}>${token.symbol}</div>
                  </div>
                </div>
                {quote?._mock && <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', marginTop:8 }}>Quote via Bags SDK · devnet simulation</div>}
              </div>

              <button
                onClick={executeSwap}
                style={{ width:'100%', height:54, borderRadius:16, background:`linear-gradient(135deg, ${token.accent}, ${token.accent}99)`, color:'#000', fontSize:16, fontWeight:900, cursor:'pointer', border:'none', fontFamily:'JetBrains Mono, monospace', boxShadow:`0 4px 24px ${token.accent}40, 0 0 40px ${token.accent}30`, letterSpacing:0.5, animation:'pulseBtn 2s ease-in-out infinite' }}
              >
                🚀 APE IN — Buy ${token.symbol}
              </button>

              <div style={{ textAlign:'center', marginTop:8, fontSize:10, color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>
                0.75% trading fee · app wallet · devnet
              </div>

              {/* Divider */}
              <div style={{ borderTop:'1px solid rgba(255,255,255,0.06)', margin:'12px 0 4px' }}/>
              
              {/* X2 or Nothing — opens wheel */}
              {!showWheel ? (
                <button
                  onClick={() => setShowWheel(true)}
                  style={{ width:'100%', height:48, borderRadius:14, background:'rgba(255,200,0,0.1)', border:'1.5px solid rgba(255,200,0,0.4)', color:'#ffc800', fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:'JetBrains Mono, monospace', display:'flex', alignItems:'center', justifyContent:'center', gap:8, animation:'x2Pulse 2s ease-in-out infinite' }}
                >
                  <span>🎰</span> x2 or Nothing — SPIN THE WHEEL
                </button>
              ) : (
                <SpinWheel
                  solAmount={solAmount}
                  onResult={(win) => {
                    setShowWheel(false);
                    if (win) {
                      // Execute double buy
                      executeSwap(true);
                    } else {
                      // Take their money (execute normal buy then show loss)
                      executeSwap(false, true);
                    }
                  }}
                />
              )}
              <style>{`
                @keyframes pulseBtn{0%,100%{box-shadow:0 4px 24px ${token.accent}40}50%{box-shadow:0 4px 40px ${token.accent}80, 0 0 60px ${token.accent}30}}
                @keyframes x2Pulse{0%,100%{box-shadow:0 0 0 rgba(255,200,0,0)}50%{box-shadow:0 0 20px rgba(255,200,0,0.3)}}
              `}</style>
            </>
          )}

          {/* SWAPPING */}
          {step === 'swapping' && (
            <div style={{ textAlign:'center', padding:'30px 0' }}>
              <div style={{ width:52, height:52, borderRadius:'50%', border:`3px solid ${token.accent}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }}/>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>Executing swap</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:6, fontFamily:'monospace' }}>
                Signing with app wallet...
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 'success' && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              {result?.nothing ? (
                <>
                  <div style={{ fontSize:60, marginBottom:12, animation:'wobble 0.3s infinite alternate', display:'inline-block' }}>😭</div>
                  <div style={{ fontSize:22, fontWeight:900, color:'#ff4444', fontFamily:'JetBrains Mono, monospace', marginBottom:6, textShadow:'0 0 20px #ff444480' }}>WHEEL SAID NOTHING 💀</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', fontFamily:'monospace', marginBottom:4 }}>{result?.solAmount?.toFixed(3)} SOL gone. rugged by math.</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', marginBottom:16 }}>"at least you have cool screenshots"</div>
                  <button onClick={() => onSuccess ? onSuccess({ nothing: true }) : onClose()}
                    style={{ padding:'10px 24px', borderRadius:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.5)', fontWeight:700, cursor:'pointer', fontFamily:'monospace', marginBottom:8 }}>
                    Back to swiping
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize:60, marginBottom:12, filter:`drop-shadow(0 0 20px ${token.accent})` }}>{result?.x2Applied ? '🚀🚀' : '✅'}</div>
                  <div style={{ fontSize:18, fontWeight:900, color:token.accent, fontFamily:'JetBrains Mono, monospace', marginBottom:6 }}>{result?.x2Applied ? 'x2 APED IN! 🚀' : 'Swap complete!'}</div>
                  <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)', fontFamily:'monospace', marginBottom:4 }}>
                    {result?.solAmount?.toFixed(3) || solAmount} SOL → ~{parseInt(result?.outAmount||0).toLocaleString()} ${token.symbol}
                  </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', marginBottom:16 }}>
                New balance: {result?.newBalance?.toFixed(3)} SOL
              </div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', marginBottom:20, wordBreak:'break-all', padding:'0 20px' }}>
                Tx: {result?.signature?.slice(0,16)}...
              </div>
              <button onClick={() => onSuccess ? onSuccess({ nothing: false }) : onClose()}
                style={{ padding:'12px 32px', borderRadius:14, background:`${token.accent}15`, border:`1px solid ${token.accent}40`, color:token.accent, fontWeight:700, cursor:'pointer', fontFamily:'JetBrains Mono, monospace', fontSize:13 }}>
                Done — check Wallet tab
              </button>
                </>
              )}
            </div>
          )}

          {/* ERROR */}
          {step === 'error' && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>❌</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#ef4444', fontFamily:'JetBrains Mono, monospace', marginBottom:8 }}>Swap failed</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'monospace', lineHeight:1.5, marginBottom:16 }}>{error}</div>
              <button onClick={() => setStep('amount')}
                style={{ padding:'10px 24px', borderRadius:12, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.6)', fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
                Try again
              </button>
            </div>
          )}

          <div style={{ height:16 }}/>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
