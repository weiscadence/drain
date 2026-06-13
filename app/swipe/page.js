'use client';
import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { Confetti, ApedIn, RuggedScreen, HypeNotification, X2Button, PnlTicker, PositionEmoji, HYPE_NOTIFS } from '../../components/CasinoLayer';
import WebUserBanner from '../../components/WebUserBanner';
import SplashScreen, { MatrixRain } from '../../components/SplashScreen';
const FundModal = lazy(() => import('../../components/FundModal'));
const Onboarding = lazy(() => import('../../components/Onboarding'));

// Load profile from localStorage (keyed by TG user ID)
function loadProfile() {
  if (typeof window === 'undefined') return null;
  try {
    const tg = window?.Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;
    const key = userId ? `drain_user_${userId}` : 'drain_user_anon';
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ═══════════════════════════════════════════════════════════
// DRAIN.FUN — Tinder for memecoins
// ═══════════════════════════════════════════════════════════

function useTelegramApp(setSafeTop, setSafeBottom) {
  useEffect(() => {
    function init() {
      const tg = window?.Telegram?.WebApp;
      if (!tg) return;
      tg.ready();
      tg.expand();
      try { tg.requestFullscreen(); } catch {}
      try { tg.setHeaderColor('#080810'); } catch {}
      try { tg.setBackgroundColor('#080810'); } catch {}
      try { tg.setBottomBarColor?.('#080810'); } catch {}
      try { tg.disableClosingConfirmation(); } catch {}
      function updateSafeAreas() {
        const top = (tg.contentSafeAreaInset?.top || 0) + (tg.safeAreaInset?.top || 0);
        const bot = (tg.contentSafeAreaInset?.bottom || 0) + (tg.safeAreaInset?.bottom || 0);
        if (setSafeTop) setSafeTop(Math.max(top, 52));
        if (setSafeBottom) setSafeBottom(Math.max(bot, 0));
      }
      updateSafeAreas();
      try { tg.onEvent('safeAreaChanged', updateSafeAreas); } catch {}
      try { tg.onEvent('contentSafeAreaChanged', updateSafeAreas); } catch {}
    }
    if (window.Telegram) { init(); return; }
    const s = document.createElement('script');
    s.src = 'https://telegram.org/js/telegram-web-app.js';
    s.onload = init;
    document.head.appendChild(s);
  }, []);
}

// ── Token data with real mints ────────────────────────────
const TOKENS = [
  {
    mint: 'CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS',
    pairAddress: null, // no pair yet
    name: 'DRAIN', symbol: 'DRAIN',
    image: null,
    mcap: 3200, vol: 840, age: '3mo', price: 0.0000032, change: 12.4,
    smartWallets: 87, jitoMentions: 2, feeShare: 1.5, creatorVerified: true,
    creator: '@weiscadence', pvp: false,
    attentionTag: '🤖 AI x Creator Economy',
    accent: '#00ff88', risk: 'LOW', riskColor: '#00ff88',
    sentiment: { score: 0.72, label: 'bullish' },
    tweets: [{ a: '@cryptoalpha', t: '$DRAIN loading hard rn, smart money accumulating early 👀', l: 1240 }],
    alerts: [],
  },
  {
    mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    pairAddress: '6oFWm7KPLfxnwMb3z5xwBoXNSPP3JJyirAPqPSiVcnsp',
    name: 'BONK', symbol: 'BONK',
    image: 'https://cdn.dexscreener.com/cms/images/ba03c0370670d176dc33bbd212eb023337a460ad7edfa053ca96ae22f31c3dcf?width=800&height=800&quality=95&format=auto',
    mcap: 980000, vol: 440000, age: '2y', price: 0.000019, change: 5.2,
    smartWallets: 412, jitoMentions: 0, feeShare: 0, creatorVerified: false,
    creator: '', pvp: false,
    attentionTag: '🐶 OG Solana dog coin — bonkseason forever',
    accent: '#eab308', risk: 'LOW', riskColor: '#00ff88',
    sentiment: { score: 0.68, label: 'bullish' },
    tweets: [{ a: '@bonkdao', t: '$BONK season is officially back. 300x from similar setup.', l: 5600 }],
    alerts: [],
  },
  {
    mint: 'PENGUIN1111111111111111111111111111111111111',
    pairAddress: null,
    name: 'PENGUIN', symbol: 'PENGUIN',
    image: null,
    mcap: 48000, vol: 12400, age: '2d', price: 0.000048, change: 340,
    smartWallets: 255, jitoMentions: 8, feeShare: 2.0, creatorVerified: false,
    creator: '@penguin_lord', pvp: false,
    attentionTag: '🎵 TikTok viral: #penguingang 2.1M views',
    accent: '#3b82f6', risk: 'LOW', riskColor: '#00ff88',
    sentiment: { score: 0.81, label: 'bullish' },
    tweets: [{ a: '@sol_calls', t: '255 smart wallets. Pre-pump pattern. Still early. 🚨', l: 3200 }],
    alerts: [{ type: 'alpha', msg: '255 smart wallets detected pre-pump' }],
  },
  {
    mint: 'BURNIE11111111111111111111111111111111111111',
    pairAddress: null,
    name: 'BURNIE', symbol: 'BURNIE',
    image: null,
    mcap: 9800, vol: 3200, age: '6h', price: 0.0000098, change: 89,
    smartWallets: 209, jitoMentions: 5, feeShare: 3.0, creatorVerified: true,
    creator: '@burnstation', pvp: true,
    attentionTag: '⚔️ Streamer war: BurnStation vs XGod',
    accent: '#f97316', risk: 'MED', riskColor: '#f59e0b',
    sentiment: { score: 0.58, label: 'bullish' },
    tweets: [{ a: '@xgod_real', t: 'LMAO @burnstation launched a coin. This is a rug 💀', l: 8900 }],
    alerts: [{ type: 'rug', msg: 'KOL 890K followers calling larp. Verify.' }],
  },
];

const FEED_POSTS = [
  { id:1, type:'tweet', size:'large', token:'PENGUIN', author:'@cryptoalpha', avatar:'🦊', text:'$PENGUIN 255 smart wallets loaded. This is the exact pattern before $WIF went 100x. NOT financial advice but im in.', likes:4200, time:'2m ago', color:'#3b82f6' },
  { id:2, type:'tiktok', size:'tall', token:'BURNIE', views:'2.1M', text:'streamer launches coin and immediately gets called out 💀', time:'14m ago', color:'#f97316' },
  { id:3, type:'alert', size:'small', token:'BURNIE', text:'⚠️ @xgod_real 890K followers calling $BURNIE a rug. 8.9K likes.', time:'8m ago', color:'#ef4444' },
  { id:4, type:'tweet', size:'small', token:'WOJAK', author:'@macro_degen', avatar:'😭', text:'market -8% today. buying WOJAK unironically rn', likes:2100, time:'22m ago', color:'#a855f7' },
  { id:5, type:'tiktok', size:'tall', token:'PENGUIN', views:'890K', text:'POV you bought PENGUIN at launch 🐧', time:'1h ago', color:'#3b82f6' },
  { id:6, type:'tweet', size:'large', token:'BONK', author:'@bonkdao', avatar:'🐶', text:'$BONK season is officially back. DAO verified. Fee share active. Last time bonkseason trended we did 300x from here.', likes:5600, time:'45m ago', color:'#eab308' },
  { id:7, type:'alpha', size:'small', token:'DRAIN', text:'🤖 87 smart wallets loading $DRAIN quietly. No CT noise yet.', time:'3h ago', color:'#00ff88' },
  { id:8, type:'tweet', size:'medium', token:'PENGUIN', author:'@sol_kol', avatar:'👁️', text:'Jito bundle cluster on $PENGUIN 6h ago. Pattern matches pre-pump on $MYRO $WIF $BONK. Still early.', likes:3800, time:'6h ago', color:'#3b82f6' },
];

const TRADES = [
  { token:'PENGUIN', pairAddress: null, side:'BUY', sol:0.5, pnl:+340, time:'2d ago', color:'#22c55e', data:[100,115,95,155,220,295,340] },
  { token:'WOJAK', pairAddress: null, side:'BUY', sol:0.2, pnl:-8.2, time:'3d ago', color:'#ef4444', data:[100,105,100,97,93,94,91.8] },
  { token:'DRAIN', pairAddress: null, side:'BUY', sol:0.1, pnl:+12.4, time:'1w ago', color:'#22c55e', data:[100,102,107,111,110,113,112.4] },
  { token:'BONK', pairAddress:'6oFWm7KPLfxnwMb3z5xwBoXNSPP3JJyirAPqPSiVcnsp', side:'BUY', sol:0.3, pnl:+156, time:'3d ago', color:'#22c55e', data:[100,108,135,172,220,245,256] },
];

const fmtN = n => n >= 1e6 ? `$${(n/1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(1)}K` : `$${n}`;
const fmtP = n => (n >= 0 ? '+' : '') + n.toFixed(1) + '%';

// ── Sparkline ─────────────────────────────────────────────
function Spark({ data, color, w = 260, h = 36 }) {
  if (!data?.length) return null;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v,i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*(h-4)+2}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display:'block', overflow:'visible' }}>
      <defs>
        <linearGradient id={`sg${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" style={{ filter:`drop-shadow(0 0 4px ${color}90)` }}/>
    </svg>
  );
}

// ── DexScreener chart embed ───────────────────────────────
function DexChart({ pairAddress, accent }) {
  const [show, setShow] = useState(false);
  if (!pairAddress) return (
    <div style={{ height: 140, background: 'rgba(255,255,255,0.03)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${accent}20`, flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 20 }}>📊</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>chart coming soon</div>
    </div>
  );
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${accent}30`, height: 160 }}>
      {!show ? (
        <div
          onClick={() => setShow(true)}
          style={{ height: '100%', background: `linear-gradient(135deg, ${accent}15, #0a0a14)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexDirection: 'column', gap: 8 }}
        >
          <div style={{ fontSize: 28 }}>📈</div>
          <div style={{ fontSize: 11, color: accent, fontFamily: 'monospace', fontWeight: 700 }}>tap to load chart</div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>via dexscreener</div>
        </div>
      ) : (
        <iframe
          src={`https://dexscreener.com/solana/${pairAddress}?embed=1&theme=dark&trades=0&info=0`}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="clipboard-write"
        />
      )}
    </div>
  );
}

// ── Particle burst on buy ─────────────────────────────────
function ParticleBurst({ active, color }) {
  if (!active) return null;
  const particles = Array.from({ length: 16 }, (_, i) => ({
    angle: (i / 16) * 360,
    dist: 60 + Math.random() * 80,
    size: 3 + Math.random() * 5,
    delay: Math.random() * 0.1,
  }));
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 ${p.size * 2}px ${color}`,
          animation: `burst 0.6s ${p.delay}s ease-out forwards`,
          '--angle': `${p.angle}deg`,
          '--dist': `${p.dist}px`,
        }} />
      ))}
    </div>
  );
}

// ── Screen shake ──────────────────────────────────────────
function ScreenShake({ active }) {
  if (!active) return null;
  return <style>{`html { animation: shake 0.35s ease-out; }`}</style>;
}

// ── Geometric background ──────────────────────────────────
function GeoBg({ accent = '#a855f7', intensity = 1 }) {
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity: 0.12 * intensity }} xmlns="http://www.w3.org/2000/svg">
      {[0,1,2,3,4].map(i => <line key={`v${i}`} x1={`${i*25}%`} y1="0" x2={`${i*25}%`} y2="100%" stroke={accent} strokeWidth="0.5" />)}
      {[0,1,2,3,4,5].map(i => <line key={`h${i}`} x1="0" y1={`${i*20}%`} x2="100%" y2={`${i*20}%`} stroke={accent} strokeWidth="0.5" />)}
      <line x1="0" y1="100%" x2="100%" y2="0" stroke={accent} strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="0" y1="70%" x2="70%" y2="0" stroke={accent} strokeWidth="0.5" strokeOpacity="0.4"/>
      <rect x="2" y="2" width="36" height="36" fill="none" stroke={accent} strokeWidth="1" strokeOpacity="0.6"/>
      <rect x="6" y="6" width="28" height="28" fill="none" stroke={accent} strokeWidth="0.5" strokeOpacity="0.4"/>
      <circle cx="95%" cy="10%" r="30" fill="none" stroke={accent} strokeWidth="0.5" strokeOpacity="0.4"/>
      <circle cx="95%" cy="10%" r="20" fill="none" stroke={accent} strokeWidth="0.5" strokeOpacity="0.3"/>
      {/* waveform */}
      <polyline points="0,90 20,65 40,80 60,45 80,70 100,35 120,62 140,42 160,58 180,30 200,55 220,40 240,60" fill="none" stroke={accent} strokeWidth="1.5" strokeOpacity="0.5" transform="translate(0, 40%)"/>
    </svg>
  );
}

// ── Swipe handler ─────────────────────────────────────────
function useSwipe(onLeft, onRight) {
  const startX = useRef(null);
  const startY = useRef(null);
  const el = useRef(null);
  const [offset, setOffset] = useState(0);

  const onTouchStart = useCallback(e => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    if (el.current) el.current.style.transition = 'none';
  }, []);

  const onTouchMove = useCallback(e => {
    if (startX.current === null) return;
    const dx = e.touches[0].clientX - startX.current;
    const dy = e.touches[0].clientY - startY.current;
    if (Math.abs(dy) > Math.abs(dx) * 1.5) return;
    e.preventDefault();
    setOffset(dx);
    if (el.current) el.current.style.transform = `translateX(${dx}px) rotate(${dx * 0.04}deg)`;
  }, []);

  const onTouchEnd = useCallback(e => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    setOffset(0);
    if (el.current) el.current.style.transition = 'transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)';
    if (dx > 85) {
      if (el.current) el.current.style.transform = 'translateX(170vw) rotate(22deg)';
      navigator.vibrate?.([40, 15, 20]);
      setTimeout(onRight, 270);
    } else if (dx < -85) {
      if (el.current) el.current.style.transform = 'translateX(-170vw) rotate(-22deg)';
      navigator.vibrate?.([20]);
      setTimeout(onLeft, 270);
    } else {
      if (el.current) el.current.style.transform = 'translateX(0) rotate(0)';
    }
    startX.current = null;
  }, [onLeft, onRight]);

  return { el, offset, onTouchStart, onTouchMove, onTouchEnd };
}

// ── SWIPE CARD ────────────────────────────────────────────
const TokenDetailSheet = lazy(() => import('../../components/TokenDetailSheet'));
const BuyModal = lazy(() => import('../../components/BuyModal'));

function SwipeCard({ token, onSwipe, walletAddress, onSwapDone }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showBuy, setShowBuy] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [bought, setBought] = useState(false);
  // Use accent-colored DiceBear so the avatar is visible on dark cards
  const dicebearBg = (token.accent || '#a855f7').replace('#','');
  const [imgSrc, setImgSrc] = useState(
    token.image || `https://api.dicebear.com/7.x/bottts-neutral/png?seed=${token.symbol}&radius=16&size=300&backgroundColor=${dicebearBg}`
  );

  const handleLeft = useCallback(() => onSwipe('left', token), [onSwipe, token]);
  const handleRight = useCallback(() => {
    // SLAM animation then show buy
    if (el.current) {
      el.current.style.transition = 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1)';
      el.current.style.transform = 'scale(1.08) translateY(-8px)';
      setTimeout(() => {
        if (el.current) {
          el.current.style.transform = 'scale(1) translateY(0)';
        }
        setShowBuy(true);
      }, 150);
    } else {
      setShowBuy(true);
    }
  }, []);

  const { el, offset, onTouchStart, onTouchMove, onTouchEnd } = useSwipe(handleLeft, handleRight);

  const buyHint = offset > 30;
  const skipHint = offset < -30;
  const hintPct = Math.min(1, Math.abs(offset) / 80);

  return (
    <div
      ref={el}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'absolute', inset: 0, borderRadius: 22, overflow: 'hidden',
        background: '#0c0c18',
        border: `1px solid ${token.accent}50`,
        display: 'flex', flexDirection: 'column',
        touchAction: 'pan-y', userSelect: 'none',
        willChange: 'transform',
        boxShadow: `0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px ${token.accent}20, inset 0 1px 0 rgba(255,255,255,0.06), 0 0 60px ${token.accent}08`,
      }}
    >
      <GeoBg accent={token.accent} />

      {/* BUY hint */}
      {buyHint && (
        <div style={{ position:'absolute', top:24, left:16, zIndex:20, border:`3px solid #00ff88`, borderRadius:10, padding:'4px 18px', transform:`rotate(-15deg)`, opacity: hintPct, background:'rgba(0,255,136,0.12)', backdropFilter:'blur(4px)' }}>
          <span style={{ color:'#00ff88', fontWeight:900, fontSize:26, fontFamily:'monospace', letterSpacing:3 }}>BUY</span>
        </div>
      )}
      {/* SKIP hint */}
      {skipHint && (
        <div style={{ position:'absolute', top:24, right:16, zIndex:20, border:`3px solid #ff4444`, borderRadius:10, padding:'4px 18px', transform:`rotate(15deg)`, opacity: hintPct, background:'rgba(255,68,68,0.12)', backdropFilter:'blur(4px)' }}>
          <span style={{ color:'#ff4444', fontWeight:900, fontSize:26, fontFamily:'monospace', letterSpacing:3 }}>SKIP</span>
        </div>
      )}

      {/* Top badges */}
      <div style={{ position:'absolute', top:12, left:0, right:0, padding:'0 12px', display:'flex', justifyContent:'space-between', zIndex:10, pointerEvents:'none' }}>
        {token.alerts?.length > 0
          ? <div style={{ background: token.alerts[0].type==='rug' ? 'rgba(239,68,68,0.9)':'rgba(0,255,136,0.9)', borderRadius:8, padding:'4px 10px', fontSize:10, fontWeight:800, color:'#fff', fontFamily:'monospace', letterSpacing:1, backdropFilter:'blur(8px)' }}>{token.alerts[0].type==='rug' ? '⚠ RUG SIGNAL':'⚡ ALPHA'}</div>
          : <div/>}
        {token.pvp && <div style={{ background:'rgba(239,68,68,0.9)', borderRadius:8, padding:'4px 10px', fontSize:10, fontWeight:800, color:'#fff', fontFamily:'monospace', letterSpacing:1 }}>⚔ PvP</div>}
      </div>

      {/* Hero image */}
      <div style={{ height:'42%', position:'relative', flexShrink:0, overflow:'hidden', background:`linear-gradient(160deg, ${token.accent}20, #080810)` }}>
        <img
          src={imgSrc}
          alt={token.name}
          onError={() => setImgSrc(`https://api.dicebear.com/7.x/shapes/png?seed=${token.symbol}&size=300&backgroundColor=${dicebearBg}`)}
          style={{ width:'100%', height:'100%', objectFit:'contain', opacity:1, background:'transparent', padding:'10% 20%' }}
        />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:100, background:'linear-gradient(to top, #0c0c18 0%, transparent 100%)' }}/>
        <div style={{ position:'absolute', bottom:10, left:14, right:14, fontSize:12, color:'rgba(255,255,255,0.8)', fontWeight:600, textShadow:'0 1px 8px rgba(0,0,0,0.9)' }}>{token.attentionTag}</div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:'auto', padding:'11px 13px 0', display:'flex', flexDirection:'column', gap:8, position:'relative' }}>

        {/* Name row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:32, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace', letterSpacing:-2, lineHeight:1 }}>{token.name}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:3, fontFamily:'monospace' }}>${token.symbol} · {token.age}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
            <span style={{ fontSize:11, fontWeight:800, color:token.riskColor, border:`1px solid ${token.riskColor}50`, borderRadius:8, padding:'3px 9px', background:`${token.riskColor}12`, fontFamily:'monospace' }}>{token.risk}</span>
            {token.signalSource === 'unverified'
              ? <span style={{ fontSize:9, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', border:'1px solid rgba(255,255,255,0.1)', borderRadius:6, padding:'2px 6px' }}>no signal</span>
              : token.signalConfidence === 'HIGH'
              ? <span style={{ fontSize:9, color:'#ffc800', fontFamily:'monospace', border:'1px solid rgba(255,200,0,0.4)', borderRadius:6, padding:'2px 6px', background:'rgba(255,200,0,0.08)' }}>⚡ JITO SIGNAL</span>
              : <span style={{ fontSize:9, color:'rgba(255,255,255,0.4)', fontFamily:'monospace', border:'1px solid rgba(255,255,255,0.12)', borderRadius:6, padding:'2px 6px' }}>signal found</span>
            }
            <span style={{ fontSize:14, color:token.change>=0?'#00ff88':'#ff4444', fontWeight:700, fontFamily:'monospace' }}>{fmtP(token.change)} 24h</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
          {[
            ['MCap', token.bagsToken && !token.mcap ? (token.lifetimeFeesSol > 0 ? `◎${(token.lifetimeFeesSol/1000).toFixed(1)}K` : 'Bags') : fmtN(token.mcap)],
            ['Vol 24h', token.bagsToken && !token.vol ? 'Bags.fm' : fmtN(token.vol)],
          ].map(([l,v]) => (
            <div key={l} style={{ background:'rgba(255,255,255,0.04)', borderRadius:10, padding:'7px 6px', textAlign:'center', border:`1px solid ${token.accent}18` }}>
              <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', letterSpacing:'0.1em', marginBottom:2 }}>{l}</div>
              <div style={{ fontSize:14, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>{v}</div>
            </div>
          ))}
          {/* Smart wallet box — glows and shows tier emoji when loaded */}
          {(() => {
            const sw = token.smartWallets || 0;
            const tier = sw >= 200 ? { emoji: '🔥', color: '#f59e0b', glow: 'rgba(245,158,11,0.5)' }
              : sw >= 100 ? { emoji: '🧠', color: '#a855f7', glow: 'rgba(168,85,247,0.5)' }
              : sw >= 50  ? { emoji: '⚡', color: '#22d3ee', glow: 'rgba(34,211,238,0.4)' }
              : { emoji: '', color: 'rgba(255,255,255,0.3)', glow: 'transparent' };
            return (
              <div style={{
                background: sw >= 50 ? `${tier.color}12` : 'rgba(255,255,255,0.04)',
                borderRadius: 10, padding: '7px 6px', textAlign: 'center',
                border: `1px solid ${sw >= 50 ? tier.color + '40' : token.accent + '18'}`,
                boxShadow: sw >= 100 ? `0 0 12px ${tier.glow}, inset 0 0 8px ${tier.glow}` : 'none',
              }}>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.1em', marginBottom: 2 }}>
                  SMART $
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: tier.color, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                  {tier.emoji}{sw > 0 ? sw : '—'}
                </div>
                {sw >= 50 && (
                  <div style={{ marginTop: 3, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, sw / 3)}%`, background: tier.color, borderRadius: 99, boxShadow: `0 0 6px ${tier.color}` }} />
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Bars */}
        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
          {[
            { label:'SMART $', pct: Math.min(100,token.smartWallets/3), color:token.accent, val:`${token.smartWallets}` },
            { label:'VIBE', pct: token.sentiment.score*100, color: token.sentiment.label==='bullish'?'#00ff88':'#f59e0b', val:token.sentiment.label },
          ].map(b => (
            <div key={b.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:9, color:'rgba(255,255,255,0.3)', width:46, fontFamily:'monospace', letterSpacing:'0.08em' }}>{b.label}</span>
              <div style={{ flex:1, height:5, background:'rgba(255,255,255,0.07)', borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:99, background:b.color, width:`${b.pct}%`, boxShadow:`0 0 10px ${b.color}90` }}/>
              </div>
              <span style={{ fontSize:10, color:b.color, fontWeight:800, fontFamily:'monospace', width:40, textAlign:'right' }}>{b.val}</span>
            </div>
          ))}
        </div>

        {/* Pills */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
          {token.jitoMentions > 0 && <span style={{ fontSize:10, padding:'3px 8px', borderRadius:6, background:'#a855f715', color:'#a855f7', border:'1px solid #a855f730', fontWeight:700, fontFamily:'monospace' }}>⚡ {token.jitoMentions} Jito</span>}
          {token.feeShare > 0 && <span style={{ fontSize:10, padding:'3px 8px', borderRadius:6, background:'#06b6d415', color:'#06b6d4', border:'1px solid #06b6d430', fontWeight:700, fontFamily:'monospace' }}>💰 {token.feeShare}% fees</span>}
          {token.creatorVerified && <span style={{ fontSize:10, padding:'3px 8px', borderRadius:6, background:'#00ff8815', color:'#00ff88', border:'1px solid #00ff8830', fontWeight:700, fontFamily:'monospace' }}>✓ {token.creator}</span>}
        </div>

        {/* Top KOL tweet */}
        {token.tweets?.[0] && (
          <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'8px 10px', border:`1px solid ${token.accent}18` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
              <div style={{ fontSize:10, color:token.accent, fontWeight:700, fontFamily:'monospace' }}>
                {token.tweets[0].a}
                {token.tweets[0].score && <span style={{ color:'#a855f7', marginLeft:5 }}>✦{(token.tweets[0].score/100).toFixed(0)}K</span>}
                {' · '}{(token.tweets[0].l||0).toLocaleString()} ♥
              </div>
              {token.twitter && (
                <a href={token.twitterUrl || `https://x.com/${token.twitter}`} target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', textDecoration:'none' }}>𝕏 @{token.twitter}</a>
              )}
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', lineHeight:1.4 }}>{token.tweets[0].t}</div>
          </div>
        )}

        <div style={{ height:6 }}/>
      </div>

      {/* Action buttons */}
      <div style={{ padding:'8px 13px 12px', display:'flex', gap:8, flexShrink:0, position:'relative', zIndex:5 }}>
        <button
          onTouchStart={e => e.stopPropagation()}
          onTouchEnd={e => { e.stopPropagation(); handleLeft(); }}
          onClick={handleLeft}
          style={{ flex:1, height:50, borderRadius:16, background:'rgba(255,68,68,0.08)', border:'1.5px solid rgba(255,68,68,0.4)', color:'#ff6666', fontSize:22, fontWeight:900, cursor:'pointer', position:'relative', overflow:'hidden' }}
        >
          <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(255,68,68,0.04) 6px, rgba(255,68,68,0.04) 12px)' }}/>
          ✕
        </button>

        {/* Telegram community button — when token has a TG */}
        {token.telegram && (
          <a href={token.telegram} target="_blank" rel="noreferrer"
            onTouchStart={e => e.stopPropagation()}
            onClick={e => e.stopPropagation()}
            style={{ width:50, height:50, borderRadius:16, background:'rgba(41,182,246,0.08)', border:'1.5px solid rgba(41,182,246,0.4)', color:'#29b6f6', fontSize:20, fontWeight:900, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}
            title="Join community">
            📨
          </a>
        )}

        {/* Info button — opens detail sheet */}
        <button
          onTouchStart={e => e.stopPropagation()}
          onTouchEnd={e => { e.stopPropagation(); setShowDetail(true); }}
          onClick={() => setShowDetail(true)}
          style={{ width:50, height:50, borderRadius:16, background:`${token.accent}12`, border:`1.5px solid ${token.accent}40`, color:token.accent, fontSize:18, fontWeight:900, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}
        >
          ℹ
        </button>

        <button
          onTouchStart={e => e.stopPropagation()}
          onTouchEnd={e => { e.stopPropagation(); handleRight(); }}
          onClick={handleRight}
          style={{ flex:1, height:50, borderRadius:16, background:'rgba(0,255,136,0.08)', border:'1.5px solid rgba(0,255,136,0.4)', color:'#00ff88', fontSize:22, fontWeight:900, cursor:'pointer', position:'relative', overflow:'hidden' }}
        >
          <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(0,255,136,0.04) 6px, rgba(0,255,136,0.04) 12px)' }}/>
          ♥
        </button>
      </div>



      {/* Detail sheet */}
      {showDetail && (
        <Suspense fallback={null}>
          <TokenDetailSheet token={token} onClose={() => setShowDetail(false)} />
        </Suspense>
      )}

      {/* Real buy modal */}
      {showBuy && (
        <Suspense fallback={null}>
          <BuyModal
            token={token}
            walletAddress={walletAddress}
            onClose={() => {
              setShowBuy(false);
              // User cancelled — do NOT advance the card
            }}
            onSuccess={({ nothing } = {}) => {
              setShowBuy(false);
              setBought(true);
              onSwapDone?.();
              onSwipe('right', token, { nothing: !!nothing });
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

// ── SWIPE TAB ─────────────────────────────────────────────
function SwipeTab({ onEffect, walletAddress, positions, initialTokens, onSwapDone }) {
  const [idx, setIdx] = useState(0);
  const [stats, setStats] = useState({ buys:0, skips:0 });
  const [tokens, setTokens] = useState(initialTokens || []);
  const [tokensLoading, setTokensLoading] = useState(!initialTokens);
  // Live-enriched positions for PnL display in header
  const [livePositions, setLivePositions] = useState([]);

  useEffect(() => {
    try {
      const tgId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'preview';
      const raw = JSON.parse(localStorage.getItem(`drain_positions_${tgId}`) || '[]');
      if (!raw.length) return;
      setLivePositions(raw); // show immediately with stored pnlPct
      // Enrich with live prices
      const mints = [...new Set(raw.map(p => p.tokenMint).filter(Boolean))];
      if (!mints.length) return;
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${mints.slice(0,5).join(',')}`)
        .then(r => r.json())
        .then(data => {
          const prices = {};
          for (const pair of (data.pairs || [])) {
            const addr = pair.baseToken?.address;
            if (addr && !prices[addr]) prices[addr] = parseFloat(pair.priceUsd || 0);
          }
          setLivePositions(raw.map(pos => {
            const live = prices[pos.tokenMint];
            if (!live || !pos.priceAtBuy) return pos;
            return { ...pos, pnlPct: ((live - pos.priceAtBuy) / pos.priceAtBuy) * 100 };
          }));
        }).catch(() => {});
    } catch {}
  }, []);
  const [toast, setToast] = useState(null);
  const [swipedMints, setSwipedMints] = useState(() => {
    // localStorage so swiped tokens persist across app restarts
    try {
      const stored = localStorage.getItem('drain_swiped');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch { return new Set(); }
  });
  const [confetti, setConfetti] = useState(false);
  const [apedIn, setApedIn] = useState(null); // token symbol
  const [hypeNotif, setHypeNotif] = useState(null);

  // Random hype notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 45s
        setHypeNotif(HYPE_NOTIFS[Math.floor(Math.random() * HYPE_NOTIFS.length)]);
      }
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Skip fetch if tokens were preloaded during splash
    if (initialTokens) return;
    fetch('/api/tokens?limit=25').then(r=>r.json()).then(d => {
      const liveTokens = (d.tokens || []).map(t => ({
        ...t,
        accent: t.accent || '#a855f7',
        risk: t.risk || 'LOW',
        riskColor: t.riskColor || '#00ff88',
        sentiment: t.sentiment || { score: 0.65, label: 'bullish' },
        tweets: t.tweets || [],
        alerts: t.alerts || [],
        pvp: t.pvp || false,
        attentionTag: t.attentionTag || `◎ ${t.symbol} · Live on Solana`,
      }));
      const liveSymbols = new Set(liveTokens.map(t => t.symbol));
      const mockFallback = TOKENS.filter(t => !liveSymbols.has(t.symbol));
      const all = liveTokens.length > 0 ? [...liveTokens, ...mockFallback].slice(0, 15) : TOKENS;
      setTokens(all);
      // Background: fetch official tweets for tokens with Twitter handles
      for (const t of all.slice(0, 8)) {
        if (t.twitter && !t.tweets?.some(tw => tw.official)) {
          fetch('/api/sorsa', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symbol: t.symbol, handle: t.twitter }),
          }).then(r => r.json()).then(data => {
            if (data.tweets?.length > 0) {
              setTokens(prev => prev.map(tok =>
                tok.symbol === t.symbol
                  ? { ...tok, tweets: [...(tok.tweets||[]), ...data.tweets.slice(0,2).map(tw => ({ a: `@${t.twitter}`, t: tw.text, l: tw.likes, official: true }))] }
                  : tok
              ));
            }
          }).catch(() => {});
        }
      }
    }).catch(() => { setTokens(TOKENS); })
      .finally(() => { setTokensLoading(false); });
  }, [initialTokens]);

  const handleSwipe = useCallback((dir, token, meta = {}) => {
    onEffect(dir, token.accent);
    setSwipedMints(prev => {
      const next = new Set([...prev, token.mint]);
      try { localStorage.setItem('drain_swiped', JSON.stringify([...next])); } catch {}
      return next;
    });
    setStats(s => ({ buys: s.buys+(dir==='right'?1:0), skips: s.skips+(dir==='left'?1:0) }));
    if (dir === 'right' && !meta.nothing) {
      // CASINO MODE: confetti + APED IN
      setConfetti(true);
      setApedIn(token.symbol);
      setTimeout(() => setConfetti(false), 2000);
      setTimeout(() => {
        setHypeNotif(HYPE_NOTIFS[Math.floor(Math.random() * HYPE_NOTIFS.length)]);
      }, 3000);
    }
    setTimeout(() => setIdx(i => i+1), dir === 'right' ? 600 : 300);
  }, [onEffect]);

  // Skip already-swiped tokens
  const unseenTokens = tokens.filter(t => !swipedMints.has(t.mint));
  const cur = unseenTokens[0] || null;
  const nxt = unseenTokens[1] || null;
  const done = !tokensLoading && unseenTokens.length === 0;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      {/* Casino overlays */}
      <Confetti active={confetti} />
      <ApedIn show={!!apedIn} tokenSymbol={apedIn} onDone={() => setApedIn(null)} />
      <HypeNotification show={!!hypeNotif} message={hypeNotif} onDone={() => setHypeNotif(null)} />

      {/* Header — centered PnL only, no buy counter, no label */}
      <div style={{ padding:'6px 15px 4px', display:'flex', justifyContent:'center', alignItems:'center', flexShrink:0 }}>
        <PnlTicker positions={livePositions} />
      </div>
      <div style={{ padding:'2px 15px 8px', flexShrink:0 }}>
        <div style={{ height:2, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg, #a855f7, #22d3ee)', width:`${tokens.length > 0 ? (swipedMints.size/tokens.length)*100 : 0}%`, transition:'width 0.3s', boxShadow:'0 0 8px #a855f7' }}/>
        </div>
        <div style={{ fontSize:9, color:'rgba(255,255,255,0.18)', fontFamily:'monospace', marginTop:3, letterSpacing:'0.1em' }}>{swipedMints.size}/{tokens.length} tokens</div>
      </div>

      <div style={{ flex:1, position:'relative', margin:'0 11px', minHeight:0 }}>
        {tokensLoading ? (
          /* Loading state — no mock cards, clean spinner */
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', border:'3px solid #a855f7', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }}/>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', letterSpacing:'0.15em' }}>loading alpha...</div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : done ? (
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
            <div style={{ fontSize:56, filter:'drop-shadow(0 0 20px #a855f7)' }}>〰️</div>
            <div style={{ fontSize:20, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>All drained</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontFamily:'monospace' }}>{stats.buys} buys · {stats.skips} skips</div>
            <button onClick={() => {
              setSwipedMints(new Set());
              setStats({buys:0,skips:0});
              try { localStorage.removeItem('drain_swiped'); } catch {}
              // Re-fetch fresh tokens
              setTokensLoading(true);
              fetch('/api/tokens?limit=25&bust=' + Date.now())
                .then(r=>r.json())
                .then(d => {
                  const liveTokens = (d.tokens || []).map(t => ({
                    ...t,
                    accent: t.accent || '#a855f7',
                    risk: t.risk || 'LOW',
                    riskColor: t.riskColor || '#00ff88',
                    sentiment: t.sentiment || { score: 0.65, label: 'bullish' },
                    tweets: t.tweets || [],
                    alerts: t.alerts || [],
                    pvp: t.pvp || false,
                    attentionTag: t.attentionTag || `◎ ${t.symbol} · Live on Solana`,
                  }));
                  const liveSymbols = new Set(liveTokens.map(t => t.symbol));
                  const mockFallback = TOKENS.filter(t => !liveSymbols.has(t.symbol));
                  setTokens(liveTokens.length > 0 ? [...liveTokens, ...mockFallback].slice(0, 15) : TOKENS);
                })
                .catch(() => setTokens(TOKENS))
                .finally(() => setTokensLoading(false));
            }} style={{ marginTop:8, padding:'10px 24px', borderRadius:12, background:'rgba(168,85,247,0.12)', border:'1px solid #a855f740', color:'#a855f7', fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>
              reload feed
            </button>
          </div>
        ) : (
          <>
            {nxt && <div style={{ position:'absolute', inset:'6px 8px 0', borderRadius:22, background:'#0c0c18', border:`1px solid ${nxt.accent}25`, transform:'scale(0.96) translateY(8px)', opacity:0.45, zIndex:0 }}/>}
            {cur && <SwipeCard key={cur.mint} token={cur} onSwipe={handleSwipe} walletAddress={walletAddress} onSwapDone={onSwapDone} />}
          </>
        )}
      </div>

      <div style={{ textAlign:'center', padding:'5px 0 7px', fontSize:10, color:'rgba(255,255,255,0.15)', fontFamily:'monospace', flexShrink:0, letterSpacing:'0.12em' }}>← skip · drag to swipe · buy →</div>

      {toast && (
        <div style={{ position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', background:'rgba(0,255,136,0.92)', color:'#000', padding:'9px 20px', borderRadius:20, fontSize:13, fontWeight:800, zIndex:99, whiteSpace:'nowrap', fontFamily:'monospace', boxShadow:'0 4px 20px rgba(0,255,136,0.4)' }}>{toast}</div>
      )}
    </div>
  );
}

// ── FEED TAB ──────────────────────────────────────────────
function FeedTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchFeed = useCallback(() => {
    setLoading(true);
    fetch('/api/feed?limit=24&bust=' + Date.now())
      .then(r => r.json())
      .then(d => {
        const live = d.posts || [];
        setPosts(live.length > 0 ? live : FEED_POSTS);
        setLastRefresh(Date.now());
      })
      .catch(() => setPosts(FEED_POSTS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchFeed(); }, [fetchFeed]);

  const displayPosts = posts.length > 0 ? posts : FEED_POSTS;

  return (
    <div style={{ flex:1, overflowY:'auto', padding:'8px 11px 0', position:'relative' }}>
      <div style={{ position:'relative', zIndex:1 }}>
        {/* Header with refresh */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ fontSize:9, letterSpacing:'0.25em', color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>LIVE ALPHA FEED</div>
          <button
            onClick={fetchFeed}
            disabled={loading}
            style={{ background:'rgba(34,211,238,0.08)', border:'1px solid rgba(34,211,238,0.25)', borderRadius:8, padding:'4px 10px', color: loading ? 'rgba(255,255,255,0.2)' : '#22d3ee', fontSize:10, fontWeight:700, cursor: loading ? 'default' : 'pointer', fontFamily:'monospace', display:'flex', alignItems:'center', gap:5 }}
          >
            {loading ? '⋯' : '↺'} {loading ? 'loading...' : 'refresh'}
          </button>
        </div>

        {loading && posts.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 0', gap:12 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', border:'2px solid #22d3ee', borderTopColor:'transparent', animation:'spin 0.8s linear infinite' }}/>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>fetching alpha...</div>
          </div>
        ) : (
          <div style={{ columns:2, columnGap:8 }}>
            {displayPosts.map(post => {
              const large = post.size === 'large';
              const tall = post.size === 'tall';
              const c = post.color || '#a855f7';
              return (
                <div key={post.id} style={{ breakInside:'avoid', marginBottom:8, borderRadius:14, overflow:'hidden', background:`${c}0e`, border:`1px solid ${c}30`, columnSpan: large ? 'all' : 'none' }}>

                  {/* ── KOL tweet (Sorsa) ── */}
                  {post.type === 'kol_tweet' && (
                    <div style={{ padding: large ? '12px 14px' : '10px 11px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
                        <div style={{ width:26, height:26, borderRadius:'50%', background:`${c}20`, border:`1px solid ${c}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, flexShrink:0, color:c, fontWeight:900, fontFamily:'monospace' }}>{(post.author||'?')[1]?.toUpperCase()||'?'}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:11, color:c, fontWeight:700, fontFamily:'monospace', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{post.author}</div>
                          <div style={{ fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>{post.time}</div>
                        </div>
                        {post.sorsaScore && <div style={{ fontSize:8, color:'#a855f7', background:'#a855f720', borderRadius:4, padding:'2px 5px', fontFamily:'monospace', fontWeight:800, flexShrink:0 }}>✦{(post.sorsaScore/100).toFixed(0)}K</div>}
                        <div style={{ fontSize:9, color:c, background:`${c}18`, borderRadius:5, padding:'2px 6px', fontWeight:700, fontFamily:'monospace', flexShrink:0 }}>${post.token}</div>
                      </div>
                      <div style={{ fontSize: large?13:11, color:'rgba(255,255,255,0.82)', lineHeight:1.5 }}>{post.text}</div>
                      <div style={{ marginTop:6, display:'flex', gap:10, fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>
                        <span>{(post.likes||0).toLocaleString()} ♥</span>
                        {post.views > 0 && <span>{(post.views/1000).toFixed(1)}K views</span>}
                      </div>
                    </div>
                  )}

                  {/* ── GMGN Smart Money ── */}
                  {post.type === 'smart_money' && (
                    <div style={{ padding:'10px 12px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <div style={{ fontSize:16 }}>🧠</div>
                          <div style={{ fontSize:13, color:c, fontWeight:900, fontFamily:'JetBrains Mono, monospace' }}>${post.token}</div>
                        </div>
                        <div style={{ fontSize:8, color:'#a855f7', background:'rgba(168,85,247,0.12)', borderRadius:4, padding:'2px 6px', fontFamily:'monospace', fontWeight:800 }}>{post.tier}</div>
                      </div>
                      <div style={{ fontSize:20, fontWeight:900, color:c, fontFamily:'JetBrains Mono, monospace', marginBottom:2 }}>{post.smartCount} <span style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:400 }}>smart wallets</span></div>
                      <div style={{ display:'flex', gap:8, fontSize:9, color:'rgba(255,255,255,0.25)', fontFamily:'monospace', marginBottom:6 }}>
                        {post.mcap > 0 && <span>mcap ${(post.mcap/1000).toFixed(0)}K</span>}
                        {post.vol > 0 && <span>vol ${(post.vol/1000).toFixed(0)}K</span>}
                        <span>{post.time}</span>
                      </div>
                      <div style={{ display:'flex', gap:6 }}>
                        <a href={post.dex} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:9, color:c, background:`${c}15`, border:`1px solid ${c}30`, borderRadius:4, padding:'2px 8px', fontFamily:'monospace', fontWeight:700, textDecoration:'none' }}>DEX</a>
                        <a href={post.gmgn} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:9, color:'#a855f7', background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.25)', borderRadius:4, padding:'2px 8px', fontFamily:'monospace', fontWeight:700, textDecoration:'none' }}>GMGN</a>
                      </div>
                    </div>
                  )}

                  {/* ── Boosted token ── */}
                  {post.type === 'boost' && (
                    <div style={{ padding:'10px 12px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <div style={{ fontSize:14 }}>⚡</div>
                          <div style={{ fontSize:12, color:c, fontWeight:900, fontFamily:'JetBrains Mono, monospace' }}>${post.token}</div>
                        </div>
                        <div style={{ fontSize:8, color:'rgba(255,165,0,0.8)', background:'rgba(255,165,0,0.1)', borderRadius:4, padding:'2px 6px', fontFamily:'monospace', fontWeight:800 }}>BOOSTED</div>
                      </div>
                      {post.description && <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)', lineHeight:1.4, marginBottom:5 }}>{post.description.slice(0,80)}</div>}
                      <div style={{ display:'flex', gap:8, fontSize:9, color:'rgba(255,255,255,0.25)', fontFamily:'monospace' }}>
                        {post.vol > 0 && <span>vol ${(post.vol/1000).toFixed(0)}K</span>}
                        {post.boostAmount > 0 && <span>🔥 {post.boostAmount} boosts</span>}
                        <span>{post.time}</span>
                      </div>
                    </div>
                  )}

                  {/* ── New launch ── */}
                  {post.type === 'launch' && (
                    <div>
                      <div style={{ height: tall ? 90 : 70, background:`linear-gradient(135deg, ${c}20, #0a0a14)`, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'8px 10px', position:'relative' }}>
                        <div style={{ position:'absolute', top:7, right:7, fontSize:8, background:'rgba(0,255,136,0.15)', color:'#00ff88', padding:'2px 6px', borderRadius:4, fontWeight:800, fontFamily:'monospace' }}>🆕 NEW</div>
                        <div style={{ fontSize:13, color:c, fontWeight:900, fontFamily:'JetBrains Mono, monospace' }}>${post.token}</div>
                        {post.description && <div style={{ fontSize:10, color:'rgba(255,255,255,0.6)', lineHeight:1.3, marginTop:2 }}>{post.description.slice(0,60)}</div>}
                      </div>
                      <div style={{ padding:'6px 10px 8px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>
                          {post.vol > 0 && `vol $${(post.vol/1000).toFixed(0)}K`}
                        </div>
                        <div style={{ display:'flex', gap:6 }}>
                          {post.telegram && <a href={post.telegram} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:9, color:'#29b6f6', background:'rgba(41,182,246,0.1)', border:'1px solid rgba(41,182,246,0.3)', borderRadius:4, padding:'2px 7px', fontFamily:'monospace', fontWeight:700, textDecoration:'none' }}>TG</a>}
                          {post.twitter && <a href={post.twitter} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ fontSize:9, color:c, background:`${c}15`, border:`1px solid ${c}35`, borderRadius:4, padding:'2px 7px', fontFamily:'monospace', fontWeight:700, textDecoration:'none' }}>𝕏</a>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Price mover ── */}
                  {post.type === 'mover' && (
                    <div style={{ padding:'10px 12px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                        <div style={{ fontSize:13, color:c, fontWeight:900, fontFamily:'JetBrains Mono, monospace' }}>${post.token}</div>
                        <div style={{ fontSize:14, fontWeight:900, color: (post.change1h||0) >= 0 ? '#00ff88':'#ff4444', fontFamily:'JetBrains Mono, monospace' }}>{(post.change1h||0)>=0?'+':''}{(post.change1h||0).toFixed(1)}%</div>
                      </div>
                      <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', letterSpacing:'0.1em' }}>1H MOVE</div>
                      <div style={{ display:'flex', gap:10, marginTop:5, fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>
                        {post.vol > 0 && <span>vol ${(post.vol/1000).toFixed(0)}K</span>}
                        {post.mcap > 0 && <span>mcap ${(post.mcap/1000000).toFixed(1)}M</span>}
                        <span>{post.time}</span>
                      </div>
                    </div>
                  )}

                  {/* ── Legacy tweet/alert/tiktok (FEED_POSTS fallback) ── */}
                  {post.type === 'tweet' && (
                    <div style={{ padding: large ? '12px 14px' : '10px 11px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
                        <div style={{ width:24, height:24, borderRadius:'50%', background:`${c}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>{post.avatar||'👁️'}</div>
                        <div style={{ flex:1 }}><div style={{ fontSize:11, color:c, fontWeight:700, fontFamily:'monospace' }}>{post.author}</div><div style={{ fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>{post.time}</div></div>
                        <div style={{ fontSize:9, color:c, background:`${c}18`, borderRadius:5, padding:'2px 6px', fontWeight:700, fontFamily:'monospace' }}>${post.token}</div>
                      </div>
                      <div style={{ fontSize: large?13:11, color:'rgba(255,255,255,0.78)', lineHeight:1.5 }}>{post.text}</div>
                      <div style={{ marginTop:6, fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>{post.likes?.toLocaleString()} ♥</div>
                    </div>
                  )}
                  {(post.type === 'alert' || post.type === 'alpha') && (
                    <div style={{ padding:'10px 12px' }}>
                      <div style={{ fontSize:9, color:c, fontWeight:800, marginBottom:4, fontFamily:'monospace', letterSpacing:'0.12em' }}>{post.type==='alert'?'🚨 ALERT':'⚡ ALPHA'} · ${post.token}</div>
                      <div style={{ fontSize:11, color:'rgba(255,255,255,0.72)', lineHeight:1.4 }}>{post.text}</div>
                      <div style={{ marginTop:5, fontSize:9, color:'rgba(255,255,255,0.2)', fontFamily:'monospace' }}>{post.time}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {lastRefresh && !loading && (
          <div style={{ textAlign:'center', fontSize:9, color:'rgba(255,255,255,0.12)', fontFamily:'monospace', padding:'8px 0 20px' }}>
            updated {new Date(lastRefresh).toLocaleTimeString()}
          </div>
        )}
        <div style={{ height:20 }}/>
      </div>
    </div>
  );
}

// ── WALLET TAB ────────────────────────────────────────────
function WalletTab({ profile, refreshTrigger }) {
  const [expandedTrade, setExpandedTrade] = useState(null);
  const [showFund, setShowFund] = useState(false);
  const [phantomAddr, setPhantomAddr] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const walletAddr = phantomAddr || profile?.walletAddress || 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ';
  const displayName = profile?.firstName || profile?.username || 'anon';

  // Fetch balance — auto-airdrops if empty (localnet resets on EC2 reboot)
  const fetchBalance = useCallback(() => {
    if (!walletAddr) return;
    fetch(`/api/wallet/balance?address=${walletAddr}&network=devnet`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setBalanceLoading(false); return; }
        setBalanceData(d);
        setBalanceLoading(false);
        // Auto-airdrop if wallet wiped (EC2 reboot clears localnet state)
        if (d.sol < 0.01) {
          fetch('/api/wallet/airdrop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: walletAddr, amount: 2 }),
          })
            .then(r => r.json())
            .then(a => { if (a.success) setTimeout(fetchBalance, 2000); })
            .catch(() => {});
        }
      })
      .catch(() => setBalanceLoading(false));
  }, [walletAddr]);

  // Load on mount + whenever refreshTrigger changes (after swap/faucet)
  useEffect(() => {
    setBalanceLoading(prev => balanceData === null); // only show loading spinner first time
    fetchBalance();
  }, [walletAddr, refreshTrigger]);

  // Poll every 8s while tab is open — catches faucet/external changes
  useEffect(() => {
    const id = setInterval(fetchBalance, 8000);
    return () => clearInterval(id);
  }, [fetchBalance]);

  const solBalance = balanceData?.sol ?? null;
  const usdValue = balanceData?.usdValue ?? null;
  // Only show "..." on true first load — subsequent refreshes keep showing last known value
  const balanceDisplay = (balanceLoading && balanceData === null) ? '...' : solBalance !== null ? solBalance.toFixed(4) : '0.0000';
  const usdDisplay = (balanceLoading && balanceData === null) ? '...' : usdValue !== null ? `$${usdValue.toFixed(2)}` : '$0.00';

  // Load real positions + fetch live prices for PnL
  const [positions, setPositions] = useState([]);
  useEffect(() => {
    let stored = [];
    try {
      const tgId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id || profile?.telegramId || 'preview';
      const key = `drain_positions_${tgId}`;
      stored = JSON.parse(localStorage.getItem(key) || '[]');
      setPositions(stored);
    } catch {}

    // Fetch live prices from DexScreener for real PnL
    if (!stored.length) return;
    const mints = [...new Set(stored.map(p => p.tokenMint).filter(Boolean))];
    if (!mints.length) return;

    fetch(`https://api.dexscreener.com/latest/dex/tokens/${mints.slice(0,5).join(',')}`)
      .then(r => r.json())
      .then(data => {
        const priceMap = {};
        for (const pair of (data.pairs || [])) {
          const addr = pair.baseToken?.address;
          if (addr && !priceMap[addr]) {
            priceMap[addr] = {
              price: parseFloat(pair.priceUsd || 0),
              change24h: parseFloat(pair.priceChange?.h24 || 0),
              image: pair.info?.imageUrl || null,
            };
          }
        }
        setPositions(prev => prev.map(pos => {
          const live = priceMap[pos.tokenMint];
          if (!live || !pos.priceAtBuy || !live.price) return pos;
          const pnlPct = ((live.price - pos.priceAtBuy) / pos.priceAtBuy) * 100;
          // Build price history for mini chart
          const baseHistory = pos.priceHistory?.length > 1 ? pos.priceHistory : [100];
          const currentVal = 100 * (live.price / pos.priceAtBuy);
          const newHistory = [...baseHistory.slice(-6), currentVal];
          return { ...pos, pnlPct, currentPrice: live.price, priceHistory: newHistory, liveImage: live.image };
        }));
      })
      .catch(() => {});
  }, [profile]);

  // Alerts only for tokens you hold
  const heldSymbols = new Set(positions.map(p => p.token));
  const ALL_ALERTS = [
    { type:'rug', token:'BURNIE', msg:'KOL 890K followers calling larp. Verify before adding.', color:'#ef4444' },
    { type:'alpha', token:'PENGUIN', msg:'255 smart wallets. No CT noise yet.', color:'#00ff88' },
    { type:'alpha', token:'DRAIN', msg:'87 smart wallets loading quietly.', color:'#a855f7' },
  ];
  const alerts = positions.length > 0
    ? ALL_ALERTS.filter(a => heldSymbols.has(a.token))
    : []; // no positions = no alerts

  const connectPhantom = async () => {
    try {
      const provider = window?.phantom?.solana || window?.solana;
      if (!provider?.isPhantom) {
        // Open Phantom in Telegram
        const tg = window?.Telegram?.WebApp;
        const url = `https://phantom.app/ul/v1/connect?dapp_encryption_public_key=&nonce=&redirect_link=${encodeURIComponent('https://drainfun.xyz/swipe')}&cluster=devnet`;
        if (tg?.openLink) tg.openLink('https://phantom.app');
        else window.open('https://phantom.app', '_blank');
        return;
      }
      const resp = await provider.connect();
      const addr = resp.publicKey.toString();
      setPhantomAddr(addr);
      // Save to profile
      if (profile) {
        const updated = { ...profile, walletAddress: addr, walletSource: 'phantom' };
        const tgUser = window?.Telegram?.WebApp?.initDataUnsafe?.user;
        const key = tgUser ? `drain_user_${tgUser.id}` : 'drain_user_anon';
        localStorage.setItem(key, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Phantom connect failed:', e);
    }
  };
  return (
    <div style={{ flex:1, overflowY:'auto', padding:'10px 13px 0', position:'relative' }}>
      <div style={{ position:'relative', zIndex:1 }}>
        {/* Balance */}
        <div style={{ background:'linear-gradient(135deg, #160a28, #0a1420)', borderRadius:18, padding:'16px 18px', marginBottom:12, border:'1px solid rgba(168,85,247,0.35)', boxShadow:'0 4px 40px rgba(168,85,247,0.18)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              {profile?.photoUrl && <img src={profile.photoUrl} alt="" style={{ width:28, height:28, borderRadius:'50%', border:'1px solid #a855f740' }}/>}
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontFamily:'monospace' }}>{displayName}</div>
              {profile?.username && <div style={{ fontSize:10, color:'rgba(168,85,247,0.7)', fontFamily:'monospace' }}>@{profile.username}</div>}
            </div>
            {/* Phantom connect */}
            <button onClick={connectPhantom}
              style={{ background: phantomAddr ? 'rgba(0,255,136,0.12)':'rgba(255,255,255,0.06)', border: phantomAddr ? '1px solid rgba(0,255,136,0.3)':'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'5px 10px', color: phantomAddr ? '#00ff88':'rgba(255,255,255,0.5)', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'monospace', display:'flex', alignItems:'center', gap:5 }}>
              <span>👻</span> {phantomAddr ? 'Connected' : 'Connect'}
            </button>
          </div>
          <div style={{ fontSize:9, letterSpacing:'0.25em', color:'rgba(255,255,255,0.3)', marginBottom:5, fontFamily:'monospace' }}>PORTFOLIO</div>
          <div style={{ fontSize:36, fontWeight:900, fontFamily:'JetBrains Mono, monospace', color:'#fff', letterSpacing:-2 }}>{balanceDisplay} SOL</div>
          <div style={{ fontSize:14, color:'rgba(255,255,255,0.45)', marginTop:2 }}>{usdDisplay} USD <span style={{fontSize:10,color:'rgba(255,255,255,0.25)',fontFamily:'monospace'}}>devnet</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10 }}>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600, fontFamily:'monospace' }}>{balanceData?.recentTxCount || 0} recent txs · {balanceData?.tokenAccounts?.length || 0} tokens</div>
            <Spark data={[2.1,2.3,2.0,2.5,2.7,2.4,2.841]} color="#a855f7" w={72} h={26}/>
          </div>
        </div>

        {/* Fund button */}
        <button
          onClick={() => setShowFund(true)}
          style={{ width:'100%', height:52, borderRadius:16, background:'linear-gradient(135deg, #a855f7, #7c3aed)', color:'#fff', fontSize:16, fontWeight:900, cursor:'pointer', border:'none', fontFamily:'JetBrains Mono, monospace', boxShadow:'0 4px 24px rgba(168,85,247,0.35)', marginBottom:8, letterSpacing:0.5, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}
        >
          <span>💳</span> Add Funds
        </button>
        <button
          onClick={() => {
            try {
              const keys = Object.keys(localStorage).filter(k => k.startsWith('drain_'));
              keys.forEach(k => localStorage.removeItem(k));
            } catch {}
            window.location.reload();
          }}
          style={{ width:'100%', height:40, borderRadius:12, background:'rgba(255,68,68,0.06)', border:'1px solid rgba(255,68,68,0.25)', color:'rgba(255,100,100,0.7)', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'JetBrains Mono, monospace', marginBottom:14, letterSpacing:0.5 }}
        >
          🔄 Reset App (Dev Testing)
        </button>

        {/* Alerts — only for tokens you hold */}
        {alerts.length > 0 && (
          <>
            <div style={{ fontSize:9, letterSpacing:'0.22em', color:'rgba(255,255,255,0.2)', marginBottom:7, fontFamily:'monospace' }}>ALERTS FOR YOUR POSITIONS</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
              {alerts.map((a,i) => (
                <div key={i} style={{ background:`${a.color}0c`, border:`1px solid ${a.color}30`, borderRadius:12, padding:'9px 12px', display:'flex', gap:9, alignItems:'flex-start' }}>
                  <span style={{ fontSize:16 }}>{a.type==='rug'?'⚠️':'⚡'}</span>
                  <div>
                    <div style={{ fontSize:10, color:a.color, fontWeight:700, fontFamily:'monospace', marginBottom:2 }}>${a.token}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.62)', lineHeight:1.4 }}>{a.msg}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Positions — real buys from swipe actions */}
        <div style={{ fontSize:9, letterSpacing:'0.22em', color:'rgba(255,255,255,0.2)', marginBottom:7, fontFamily:'monospace' }}>POSITIONS</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {positions.length === 0 && (
            <div style={{ textAlign:'center', padding:'24px 0', color:'rgba(255,255,255,0.3)', fontSize:12, fontFamily:'monospace' }}>
              No positions yet — swipe right to buy a token
            </div>
          )}
          {positions.map((t,i) => {
            const color = '#22c55e'; // all buys are green for now
            return (
            <div key={i} style={{ background:'rgba(255,255,255,0.025)', border:`1px solid ${color}20`, borderRadius:14, padding:'12px 14px', cursor:'pointer' }}
              onClick={() => setExpandedTrade(expandedTrade === i ? null : i)}
            >
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <PositionEmoji pnlPct={t.pnlPct || 0} />
                  <div>
                    <div style={{ fontSize:16, fontWeight:900, color:'#fff', fontFamily:'JetBrains Mono, monospace' }}>${t.token}</div>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', marginTop:1 }}>BUY · {t.solAmount} SOL · {t.timeLabel || 'just now'}</div>
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:15, fontWeight:900, color: (t.pnlPct||0) >= 0 ? '#00ff88':'#ff4444', fontFamily:'JetBrains Mono, monospace', textShadow:`0 0 10px ${(t.pnlPct||0)>=0?'#00ff8860':'#ff444460'}` }}>
                    {(t.pnlPct||0) >= 0 ? '+' : ''}{(t.pnlPct||0).toFixed(1)}%
                  </div>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'monospace' }}>~{parseInt(t.outAmount||0).toLocaleString()} tkns</div>
                </div>
              </div>
              {/* Mini chart using Spark */}
              <Spark data={t.priceHistory || [100,100,100,100,100,100,100]} color={(t.pnlPct||0)>=0?'#00ff88':'#ff4444'} w={256} h={28}/>
              {t.sig && (
                <div style={{ fontSize:9, color:'rgba(255,255,255,0.18)', fontFamily:'monospace', marginTop:4, display:'flex', justifyContent:'space-between' }}>
                  <span>Tx: {t.sig.slice(0,14)}...</span>
                  <span style={{color:'rgba(0,255,136,0.4)'}}>localnet ✓</span>
                </div>
              )}
            </div>
            );
          })}
        </div>

        <div style={{ marginTop:14, padding:'10px 14px', background:'rgba(255,255,255,0.025)', borderRadius:12, border:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.15)', marginBottom:3, fontFamily:'monospace' }}>WALLET</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', fontFamily:'JetBrains Mono, monospace' }}>{walletAddr.slice(0,8)}...{walletAddr.slice(-6)}</div>
          </div>
          <button onClick={() => navigator.clipboard?.writeText(walletAddr)} style={{ background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.3)', borderRadius:8, padding:'5px 10px', color:'#a855f7', fontSize:11, fontWeight:700, cursor:'pointer', fontFamily:'monospace' }}>Copy</button>
        </div>
        <div style={{ height:24 }}/>
      </div>

      {/* Fund modal */}
      {showFund && (
        <Suspense fallback={null}>
          <FundModal
            onClose={() => {
              setShowFund(false);
              // Refresh balance immediately after faucet/fund action
              setTimeout(fetchBalance, 1200);
              setTimeout(fetchBalance, 4000); // second check in case RPC is slow
            }}
            walletAddress={walletAddr}
          />
        </Suspense>
      )}
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────
// ── Custom SVG nav icons ─────────────────────────────────────────────
const NAV_ICONS = {
  swipe: ({ color, size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      {/* Card stack with swipe arc */}
      <rect x="4" y="7" width="14" height="17" rx="3" fill={color} opacity="0.18"/>
      <rect x="6" y="5" width="14" height="17" rx="3" fill={color} opacity="0.3"/>
      <rect x="8" y="3" width="14" height="17" rx="3" fill="none" stroke={color} strokeWidth="1.5"/>
      {/* Right swipe arrow */}
      <path d="M19 9 L23 12 L19 15" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 12 H17" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6"/>
    </svg>
  ),
  feed: ({ color, size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      {/* Signal / pulse bars */}
      <rect x="3" y="18" width="4" height="5" rx="1.2" fill={color} opacity="0.5"/>
      <rect x="9" y="13" width="4" height="10" rx="1.2" fill={color} opacity="0.7"/>
      <rect x="15" y="8" width="4" height="15" rx="1.2" fill={color}/>
      {/* Spark/lightning dot at top */}
      <circle cx="21" cy="5" r="2.5" fill={color} opacity="0.9"/>
      <path d="M21 8 L21 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  wallet: ({ color, size = 26 }) => (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      {/* Drain funnel / wallet body */}
      <rect x="3" y="7" width="20" height="14" rx="3" fill={color} opacity="0.15" stroke={color} strokeWidth="1.5"/>
      {/* Coin slot */}
      <rect x="16" y="10" width="5" height="6" rx="2" fill={color} opacity="0.8"/>
      {/* Drain dot */}
      <circle cx="18.5" cy="13" r="1.5" fill="#04020f"/>
      {/* Top flap */}
      <path d="M7 7 V5 Q7 3 9 3 H17 Q19 3 19 5 V7" stroke={color} strokeWidth="1.4" fill="none" opacity="0.6"/>
      {/* Sol symbol */}
      <circle cx="10" cy="13" r="3" stroke={color} strokeWidth="1.3" opacity="0.7"/>
      <line x1="7.5" y1="13" x2="12.5" y2="13" stroke={color} strokeWidth="1" opacity="0.7"/>
    </svg>
  ),
};

function BottomNav({ tab, setTab, safeBottom = 0 }) {
  const tabs = [
    { id:'swipe', label:'SWIPE' },
    { id:'feed',  label:'FEED' },
    { id:'wallet', label:'WALLET' },
  ];
  return (
    <div style={{ flexShrink:0, display:'flex', background:'#080810', borderTop:'1px solid rgba(168,85,247,0.25)', paddingBottom: Math.max(safeBottom, 10), paddingTop:2 }}>
      {tabs.map(t => {
        const active = tab === t.id;
        const color = active ? '#a855f7' : 'rgba(255,255,255,0.38)';
        const Icon = NAV_ICONS[t.id];
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:'10px 0 8px', display:'flex', flexDirection:'column', alignItems:'center', gap:4, background: active ? 'rgba(168,85,247,0.1)':'transparent', border:'none', borderTop: active ? '2px solid #a855f7':'2px solid transparent', cursor:'pointer', transition:'all 0.15s' }}>
            <div style={{ filter: active ? 'drop-shadow(0 0 8px #a855f7)':'none', transition:'filter 0.2s', lineHeight:0 }}>
              <Icon color={color} size={26} />
            </div>
            <span style={{ fontSize:9, letterSpacing:'0.15em', fontWeight:800, color, fontFamily:'JetBrains Mono, monospace' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────
export default function DrainMiniApp() {
  const [safeTop, setSafeTop] = useState(52);
  const [safeBottom, setSafeBottom] = useState(0);
  useTelegramApp(setSafeTop, setSafeBottom);
  const [showSplash, setShowSplash] = useState(true);
  const [splashReady, setSplashReady] = useState(false);
  const [tab, setTab] = useState('swipe');
  const [flash, setFlash] = useState(null);
  const [shake, setShake] = useState(false);
  const [burst, setBurst] = useState(null);
  const [profile, setProfile] = useState(null);
  const [preloadedTokens, setPreloadedTokens] = useState(null);
  // Increment to trigger WalletTab balance refresh after swaps/faucet
  const [walletRefresh, setWalletRefresh] = useState(0);
  const triggerWalletRefresh = useCallback(() => setWalletRefresh(n => n + 1), []);

  useEffect(() => {
    // Run everything in parallel during splash
    const profileDone = new Promise(resolve => {
      setTimeout(() => {
        const saved = loadProfile();
        if (saved?.walletAddress === 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ') {
          try {
            const tg = window?.Telegram?.WebApp;
            const userId = tg?.initDataUnsafe?.user?.id;
            const key = userId ? `drain_user_${userId}` : 'drain_user_anon';
            localStorage.removeItem(key);
          } catch {}
          setProfile(null);
        } else {
          setProfile(saved);
        }
        resolve();
      }, 400);
    });

    const tokensDone = fetch('/api/tokens?limit=25')
      .then(r => r.json())
      .then(d => {
        const live = (d.tokens || []).map(t => ({
          ...t,
          accent: t.accent || '#a855f7',
          risk: t.risk || 'LOW',
          riskColor: t.riskColor || '#00ff88',
          sentiment: t.sentiment || { score: 0.65, label: 'bullish' },
          tweets: t.tweets || [],
          alerts: t.alerts || [],
          pvp: t.pvp || false,
          attentionTag: t.attentionTag || `◎ ${t.symbol} · Live on Solana`,
        }));
        const liveSymbols = new Set(live.map(t => t.symbol));
        const mock = TOKENS.filter(t => !liveSymbols.has(t.symbol));
        setPreloadedTokens(live.length > 0 ? [...live, ...mock].slice(0, 15) : TOKENS);
      })
      .catch(() => { setPreloadedTokens(TOKENS); });

    Promise.all([profileDone, tokensDone]).then(() => setSplashReady(true));
  }, []);

  const handleEffect = useCallback((dir, accent) => {
    setFlash({ dir, color: dir==='right' ? '#00ff88' : '#ff4444' });
    setTimeout(() => setFlash(null), 450);
    if (dir === 'left') {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } else {
      setBurst({ color: accent || '#00ff88' });
      setTimeout(() => setBurst(null), 700);
    }
  }, []);

  // Splash screen
  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} ready={splashReady} />;
  }

  // First time — show onboarding
  if (!profile) {
    return (
      <Suspense fallback={<div style={{ background:'#080810', width:'100vw', height:'100dvh' }}/>}>
        <Onboarding onComplete={(p) => {
          setProfile(p);
          // Register with DrainFunbot for match notifications
          if (p?.telegramId) {
            fetch('/api/notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'register',
                telegramId: String(p.telegramId),
                username: p.username || '',
                firstName: p.firstName || '',
              }),
            }).catch(() => {});
          }
        }} />
      </Suspense>
    );
  }

  const swipePositions = (() => { try { const k=`drain_positions_${profile.telegramId||'preview'}`; return JSON.parse(localStorage.getItem(k)||'[]'); } catch { return []; }})();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
        html,body{background:#080810;overflow:hidden;height:100%}
        ::-webkit-scrollbar{display:none}
        @keyframes flashFade{0%{opacity:1}100%{opacity:0}}
        @keyframes shake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px) rotate(-1.5deg)}30%{transform:translateX(8px) rotate(1.5deg)}45%{transform:translateX(-6px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}}
        @keyframes burst{0%{transform:translate(-50%,-50%) rotate(var(--angle)) translateY(0);opacity:1}100%{transform:translate(-50%,-50%) rotate(var(--angle)) translateY(var(--dist));opacity:0}}
      `}</style>

      {/* Screen flash */}
      {flash && (
        <div style={{ position:'fixed', inset:0, zIndex:500, pointerEvents:'none',
          background: flash.dir==='right'
            ? 'radial-gradient(ellipse at center, rgba(0,255,136,0.3) 0%, transparent 65%)'
            : 'radial-gradient(ellipse at center, rgba(255,68,68,0.35) 0%, transparent 65%)',
          animation:'flashFade 0.45s ease-out forwards'
        }}/>
      )}

      {/* Particle burst on buy */}
      {burst && <ParticleBurst active color={burst.color}/>}

      <div style={{
        width:'100vw', height:'100dvh',
        background:'#080810',
        display:'flex', flexDirection:'column', overflow:'hidden',
        fontFamily:'JetBrains Mono, -apple-system, sans-serif', color:'#fff',
        paddingTop: safeTop,
        animation: shake ? 'shake 0.38s ease-out' : 'none',
        position: 'relative',
      }}>
        {/* Matrix rain — persistent background */}
        <MatrixRain style={{ opacity: 0.35, zIndex: 0 }} />

        {tab === 'swipe'  && <SwipeTab onEffect={handleEffect} walletAddress={profile?.walletAddress} positions={swipePositions} initialTokens={preloadedTokens} onSwapDone={triggerWalletRefresh} />}
        {tab === 'feed'   && <FeedTab/>}
        {tab === 'wallet' && <WalletTab key={walletRefresh} profile={profile} refreshTrigger={walletRefresh} />}
        <BottomNav tab={tab} setTab={(t) => { setTab(t); if (t === 'wallet') triggerWalletRefresh(); }} safeBottom={safeBottom}/>
      </div>
    </>
  );
}
