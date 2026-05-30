import { NextResponse } from 'next/server';

/*
 * AlphaTrack API
 * AI-powered wallet tracking to find insider traders
 * 
 * Features:
 * - Track any wallet on Solana/Base/ETH
 * - AI classifies wallets (insider, smart money, whale, dev, mev)
 * - Real-time trade monitoring
 * - Win rate & ROI analysis
 */

// Wallet classification types
const WALLET_TYPES = {
  INSIDER: 'INSIDER',       // Consistently buys before pumps
  SMART_MONEY: 'SMART_MONEY', // High win rate, good timing
  WHALE: 'WHALE',           // Large positions
  DEV: 'DEV',               // Token deployer wallets
  MEV: 'MEV',               // MEV bots
  TRACKED: 'TRACKED'        // Generic tracked wallet
};

// In-memory storage (would use DB in production)
let trackedWallets = [
  {
    address: '7Lj8Hs3H3y1wQYqJPDV5nrPvTg6kVqNM1yKTAbv4pump',
    chain: 'solana',
    label: 'Insider Alpha #1',
    type: WALLET_TYPES.INSIDER,
    stats: {
      winRate: 87,
      avgRoi: 340,
      totalTrades: 156,
      totalVolume: 2450000,
      profitableTrades: 136,
      avgHoldTime: '4.2h'
    },
    aiAnalysis: 'This wallet consistently enters positions 2-6 hours before major price movements. Pattern suggests access to non-public information or sophisticated on-chain analysis. 87% of trades profitable with average 340% ROI.',
    recentTrade: { type: 'buy', token: 'PUMP', time: '12m ago' },
    tracked: '2026-02-01'
  },
  {
    address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
    chain: 'solana',
    label: 'Raydium Whale',
    type: WALLET_TYPES.WHALE,
    stats: {
      winRate: 62,
      avgRoi: 85,
      totalTrades: 423,
      totalVolume: 18500000,
      profitableTrades: 262,
      avgHoldTime: '2.1d'
    },
    aiAnalysis: 'Large position whale with significant market impact. Tends to accumulate during dips and distribute during rallies. Not insider-level timing but solid fundamentals trader.',
    recentTrade: { type: 'sell', token: 'WIF', time: '1h ago' },
    tracked: '2026-01-15'
  },
  {
    address: '3Kn1LPAQX8Rp4Cqz9hPYZN7YYjLmQwVrNZ5kT5pump',
    chain: 'solana',
    label: 'Smart Money SOL',
    type: WALLET_TYPES.SMART_MONEY,
    stats: {
      winRate: 78,
      avgRoi: 190,
      totalTrades: 89,
      totalVolume: 890000,
      profitableTrades: 69,
      avgHoldTime: '8.5h'
    },
    aiAnalysis: 'Highly selective trader with excellent timing. Focuses on new launches with strong fundamentals. Uses limit orders and rarely FOMOs. Classic smart money behavior.',
    recentTrade: { type: 'buy', token: 'BONK', time: '3h ago' },
    tracked: '2026-02-03'
  },
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    chain: 'base',
    label: 'Base Insider',
    type: WALLET_TYPES.INSIDER,
    stats: {
      winRate: 91,
      avgRoi: 520,
      totalTrades: 34,
      totalVolume: 450000,
      profitableTrades: 31,
      avgHoldTime: '1.8h'
    },
    aiAnalysis: 'Extremely high win rate on Base chain. Appears to have early access to launches or insider information. 91% win rate with 520% average ROI is statistically improbable without alpha.',
    recentTrade: { type: 'buy', token: 'BRETT', time: '45m ago' },
    tracked: '2026-02-05'
  }
];

let recentTrades = [
  { wallet: '7Lj8Hs3H...pump', token: 'PUMP', type: 'buy', amount: 15000, time: '12m ago', roi: null },
  { wallet: '0x1234...5678', token: 'BRETT', type: 'buy', amount: 8500, time: '45m ago', roi: null },
  { wallet: '5Q544fKr...4j1', token: 'WIF', type: 'sell', amount: 125000, time: '1h ago', roi: 45 },
  { wallet: '3Kn1LPAQ...pump', token: 'BONK', type: 'buy', amount: 12000, time: '3h ago', roi: null },
  { wallet: '7Lj8Hs3H...pump', token: 'MEW', type: 'sell', amount: 45000, time: '5h ago', roi: 280 },
];

// AI wallet classification based on trading patterns
function classifyWallet(trades) {
  if (!trades || trades.length === 0) return WALLET_TYPES.TRACKED;
  
  const totalTrades = trades.length;
  const profitableTrades = trades.filter(t => t.roi > 0).length;
  const winRate = (profitableTrades / totalTrades) * 100;
  const avgRoi = trades.reduce((sum, t) => sum + (t.roi || 0), 0) / totalTrades;
  const avgVolume = trades.reduce((sum, t) => sum + (t.amount || 0), 0) / totalTrades;
  
  // Insider: >85% win rate AND >200% avg ROI
  if (winRate > 85 && avgRoi > 200) return WALLET_TYPES.INSIDER;
  
  // Smart money: >70% win rate AND >100% avg ROI
  if (winRate > 70 && avgRoi > 100) return WALLET_TYPES.SMART_MONEY;
  
  // Whale: avg trade > $50k
  if (avgVolume > 50000) return WALLET_TYPES.WHALE;
  
  // MEV: very short hold times, many trades
  // Dev: first buyer on new tokens (would need more data)
  
  return WALLET_TYPES.TRACKED;
}

// Generate AI analysis for a wallet
function generateAiAnalysis(wallet, trades) {
  const type = wallet.type;
  const winRate = wallet.stats?.winRate || 0;
  const avgRoi = wallet.stats?.avgRoi || 0;
  
  if (type === WALLET_TYPES.INSIDER) {
    return `This wallet shows strong insider trading patterns. ${winRate}% win rate with ${avgRoi}% average ROI suggests access to non-public information or extremely sophisticated alpha. Trades tend to precede major price movements by 1-6 hours.`;
  }
  
  if (type === WALLET_TYPES.SMART_MONEY) {
    return `Classic smart money wallet with disciplined trading. ${winRate}% win rate indicates strong research and timing. Selective entry points and proper risk management. Worth following for alpha.`;
  }
  
  if (type === WALLET_TYPES.WHALE) {
    return `Large position whale wallet. Significant market impact on entries/exits. ${winRate}% win rate with substantial volume. Monitor for accumulation/distribution patterns.`;
  }
  
  return `Wallet under observation. Current stats: ${winRate}% win rate, ${avgRoi}% avg ROI. More data needed for classification.`;
}

// Fetch Solana transactions (simplified - would use Helius/Shyft in production)
async function fetchSolanaTransactions(address) {
  // In production: use Helius, Shyft, or Solana RPC
  return [];
}

const DATA = '/home/ubuntu/.openclaw/workspace/data';
const ALPHA = '/home/ubuntu/.openclaw/workspace/projects/alpha';
function readJson(f, def) { try { return JSON.parse(require('fs').readFileSync(f,'utf8')); } catch { return def; } }
function readLogTail(file, lines = 30) {
  try {
    const content = require('fs').readFileSync(`${DATA}/logs/${file}.log`, 'utf8');
    return content.split('\n').filter(Boolean).slice(-lines);
  } catch { return []; }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const address = searchParams.get('address');

  if (action === 'calls') {
    const calls = readJson(`${DATA}/alpha-calls.json`, []);
    return NextResponse.json({ success: true, calls });
  }

  if (action === 'prop') {
    const propData = readJson(`${DATA}/prop-accounts.json`, {});
    return NextResponse.json({ success: true, propData });
  }

  if (action === 'market-intel') {
    const snap = readJson(`${DATA}/market-snapshot.json`, {});
    const hlData = readJson(`${DATA}/market-intel-state.json`, {});
    const weights = readJson(`${DATA}/signal-weights.json`, {});
    return NextResponse.json({
      success: true,
      prices: {
        bitcoin:  { price: snap.prices?.btc?.price,  change24h: snap.prices?.btc?.change24h },
        ethereum: { price: snap.prices?.eth?.price,  change24h: snap.prices?.eth?.change24h },
        solana:   { price: snap.prices?.sol?.price,  change24h: snap.prices?.sol?.change24h },
        'the-open-network': { price: snap.prices?.ton?.price, change24h: snap.prices?.ton?.change24h },
      },
      fear_greed: snap.fearGreed || {},
      funding: snap.derivatives || {},
      orderBook: snap.orderBook || {},
      liquidations: { recent: hlData.recentLiqs || [] },
      signalWeights: weights,
    });
  }

  if (action === 'paper') {
    const paper = readJson(`${DATA}/hl-paper-trades.json`, null);
    return NextResponse.json({ success: true, paper });
  }

  if (action === 'gmgn') {
    const calls = readJson(`${DATA}/alpha-calls.json`, []);
    const gmgnCalls = calls.filter(c =>
      c.status === 'open' &&
      (c.source === 'gmgn' || c.tags?.includes('gmgn') || c.source === 'wallet_coord')
    ).sort((a,b) => (b.extra?.smartCount||0) - (a.extra?.smartCount||0)).slice(0, 10);
    return NextResponse.json({ success: true, signals: gmgnCalls });
  }

  if (action === 'hl') {
    const snap = readJson(`${DATA}/market-snapshot.json`, {});
    const calls = readJson(`${DATA}/alpha-calls.json`, []);
    const paper = readJson(`${DATA}/hl-paper-trades.json`, {});
    const fs = require('fs');
    let prefSnap = {};
    try {
      const snapDir = `${DATA}/pref-tracker/snapshots`;
      const files = fs.readdirSync(snapDir).filter(f=>f.startsWith('hl-')).sort();
      if (files.length) prefSnap = readJson(`${snapDir}/${files[files.length-1]}`, {});
    } catch {}
    const hip3Calls = calls.filter(c => c.status === 'open' && c.source?.includes('hip3'));
    return NextResponse.json({
      success: true,
      funding: snap.derivatives || {},
      prefMarkets: prefSnap.markets || [],
      hip3Calls,
      paperAccount: paper.account || null,
      paperPositions: (paper.openPositions || []).filter(p =>
        ['BTC','ETH','SOL','AVAX','DOGE','LINK','JUP','PURR'].includes(p.asset)
      ),
    });
  }

  if (action === 'kol-intel') {
    const intel = readJson(`${DATA}/kol-intel.json`, {});
    return NextResponse.json({ success: true, ...intel });
  }

  if (action === 'api-findings') {
    const findings = readJson(`${DATA}/api-scout-findings.json`, []);
    return NextResponse.json({ success: true, findings });
  }

  if (action === 'agent-status') {
    // Return basic status (PM2 would need shell exec - return mock for now)
    const agents = {
      'alfalfa-gpt': { status: 'online' },
      'alfalfa-signals': { status: 'online' },
      'drain': { status: 'online' },
      'gpu-server': { status: 'online' },
      'vast-tunnel': { status: 'online' },
    };
    return NextResponse.json({ success: true, agents });
  }

  if (action === 'meteora') {
    // Serve open LP calls from alpha-calls.json (richer data with positionType, vol/liq, etc)
    const calls = readJson(`${DATA}/alpha-calls.json`, []);
    // Deduplicate by mint — keep highest-liq pool per token, min $25k liq
    const lpCalls = calls.filter(c => c.source?.includes('meteora') && c.status === 'open');
    const byMint = new Map();
    for (const c of lpCalls) {
      const mint = c.extra?.mint;
      const liq = c.extra?.liq || 0;
      const feeApr = c.extra?.feeApr || 0;
      if (!mint) continue;
      // Skip pools with < $25k liquidity (APR is fake math, can't fit real capital)
      if (liq > 0 && liq < 25000) continue;
      const existing = byMint.get(mint);
      // Keep highest liq; if liq unknown (0), keep highest APR that isn't absurd (>5000% = thin pool)
      if (!existing) {
        if (feeApr < 5000 || liq >= 25000) byMint.set(mint, c);
      } else {
        const existLiq = existing.extra?.liq || 0;
        if (liq > existLiq) byMint.set(mint, c);
      }
    }
    const openLp = [...byMint.values()]
      .sort((a, b) => (b.extra?.feeApr || 0) - (a.extra?.feeApr || 0))
      .slice(0, 8)
      .map(c => ({
        symbol: c.asset,
        pairAddr: c.extra?.pairAddr,
        mint: c.extra?.mint,
        feeApr: c.extra?.feeApr || 0,
        vol24h: c.extra?.vol24h || 0,
        liq: c.extra?.liq || 0,
        volLiqRatio: c.extra?.volLiqRatio || 0,
        ageHours: c.extra?.ageHours || 0,
        priceChange1h: c.extra?.priceChange1h || 0,
        positionType: c.extra?.positionType || null,
        positionNote: c.extra?.positionNote || null,
        insiderPresent: c.extra?.insiderPresent || false,
        url: c.extra?.dex || c.extra?.url || `https://app.meteora.ag/dlmm/${c.extra?.pairAddr || ''}`,
        outcome: null,
        openedAt: c.openedAt,
        source: c.source,
        edge: c.edge,
      }));
    // Also pull from meteora-history for any pools not in alpha-calls
    const history = readJson(`${DATA}/meteora-history.json`, { pools: [] });
    const histOpen = (history.pools || [])
      .filter(p => p.outcome === null && !openLp.find(l => l.pairAddr === p.pairAddr))
      .slice(-5);
    return NextResponse.json({ success: true, pools: [...openLp, ...histOpen] });
  }

  if (action === 'clusters') {
    const raw = readJson(`${DATA}/jito-clusters.json`, { clusters: {}, walletToCluster: {} });
    const smartW = readJson('/home/ubuntu/.openclaw/workspace/projects/alpha/smart-wallets.json', { solana: [] });
    const wCount = (Array.isArray(smartW) ? smartW : smartW.solana || []).length;
    return NextResponse.json({ success: true, clusters: raw.clusters || {}, walletCount: wCount });
  }

  if (action === 'brains') {
    const brains = readJson(`${DATA}/strategy-brains.json`, {});
    return NextResponse.json({ success: true, ...brains });
  }

  if (action === 'logs') {
    const file = searchParams.get('file');
    if (!file || file.includes('..') || file.includes('/')) return NextResponse.json({ lines: [] });
    const lines = readLogTail(file, 40);
    return NextResponse.json({ success: true, lines });
  }
  
  // Get all tracked wallets — real data from wallet-profiler + insider-hunter
  if (action === 'wallets') {
    const profiles = readJson(`${DATA}/wallet-profiles.json`, { wallets: {} });
    const insiderState = readJson(`${DATA}/insider-state.json`, { wallets: [] });
    const insiderWallets = readJson(`${DATA}/insider-wallets.json`, []);

    const walletMap = {};

    // From wallet-profiler (scored wallets with real win/loss data)
    for (const [label, w] of Object.entries(profiles.wallets || {})) {
      walletMap[label] = {
        label,
        address: w.address,
        chain: 'solana',
        wins: w.wins || 0,
        losses: w.losses || 0,
        winRate: w.win_rate != null ? w.win_rate : null,
        patternType: w.patternType || 'unknown',
        outcomeDistribution: w.outcomeDistribution || {},
        avgHoldHours: w.avgTimeToExitHours || null,
        score: w.score || 0,
        source: 'wallet-profiler'
      };
    }

    // From insider-hunter discovered wallets (insider-wallets.json)
    for (const w of (insiderWallets || [])) {
      const key = w.address?.slice(0,8) || w.label;
      if (!walletMap[key]) {
        const wr = w.gmgn_winrate != null ? Math.round(w.gmgn_winrate * 100)
                 : w.estimatedWR != null ? Math.round(w.estimatedWR * 100)
                 : null;
        walletMap[key] = {
          label: w.label || key,
          address: w.address,
          chain: w.chain || 'solana',
          wins: w.wins || 0,
          losses: w.losses || 0,
          winRate: wr,
          patternType: w.patternType || 'unknown',
          score: Math.round((w.combinedScore || 0) * 100),
          pumpPct: w.discoveredSymbol ? undefined : undefined,
          source: 'insider-hunter'
        };
      }
    }

    // From insider-state scored wallets (if any)
    const scored = insiderState.wallets || insiderState.scored || [];
    for (const w of scored) {
      const key = w.address?.slice(0,8) || w.label;
      if (!walletMap[key]) {
        walletMap[key] = {
          label: w.label || key,
          address: w.address,
          chain: w.chain || 'solana',
          wins: w.wins || 0,
          losses: w.losses || 0,
          winRate: w.winRate != null ? w.winRate : null,
          patternType: w.patternType || 'unknown',
          score: w.score || 0,
          pumpPct: w.pumpPct,
          source: 'insider-hunter'
        };
      }
    }

    const walletList = Object.values(walletMap).sort((a,b) => (b.score||0) - (a.score||0));
    return NextResponse.json({ success: true, wallets: walletList, count: walletList.length });
  }
  
  // Get recent trades from all tracked wallets
  if (action === 'trades') {
    return NextResponse.json({
      success: true,
      trades: recentTrades
    });
  }
  
  // Get trades for specific wallet
  if (action === 'wallet-trades' && address) {
    const wallet = trackedWallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    if (!wallet) {
      return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });
    }
    
    // Generate mock trades for this wallet
    const walletTrades = [
      { token: 'PUMP', type: 'buy', amount: 15000, time: '12m ago', price: 0.00012, roi: null },
      { token: 'MEW', type: 'sell', amount: 45000, time: '5h ago', price: 0.0089, roi: 280 },
      { token: 'WIF', type: 'buy', amount: 22000, time: '1d ago', price: 2.45, roi: 45 },
      { token: 'BONK', type: 'sell', amount: 18000, time: '2d ago', price: 0.000023, roi: 156 },
      { token: 'POPCAT', type: 'buy', amount: 8500, time: '3d ago', price: 0.89, roi: 89 },
    ].map(t => ({ ...t, wallet: wallet.address }));
    
    return NextResponse.json({
      success: true,
      wallet,
      trades: walletTrades
    });
  }
  
  // Get single wallet details
  if (address) {
    const wallet = trackedWallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    if (!wallet) {
      return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, wallet });
  }
  
  if (action === 'smart-money') {
    const posData  = readJson(`${DATA}/smart-wallet-positions.json`, {});
    const arbData  = readJson(`${DATA}/arb-opportunities.json`, []);
    const stateData = readJson(`${DATA}/consensus-state.json`, {});
    return NextResponse.json({
      success: true,
      wallets:            posData.wallets || {},
      totalPositions:     posData.totalPositions || 0,
      positionsUpdatedAt: posData.updatedAt || null,
      arbs:               arbData.slice(0, 20),
      consensusHistory:   stateData.consensusHistory || [],
      recentWins:         stateData.recentWins || [],
    });
  }

  return NextResponse.json({
    success: true,
    message: 'AlphaTrack API - AI-powered wallet tracking',
    endpoints: [
      'GET ?action=wallets - List all tracked wallets',
      'GET ?action=trades - Recent trades from tracked wallets',
      'GET ?action=wallet-trades&address=xxx - Trades for specific wallet',
      'GET ?action=smart-money - Smart wallet positions + arb opportunities',
      'POST action=track - Track new wallet',
      'POST action=analyze - Analyze wallet patterns'
    ]
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, address, label, chain } = body;
    
    if (action === 'track') {
      // Validate
      if (!address) {
        return NextResponse.json({ success: false, error: 'Address required' }, { status: 400 });
      }
      
      // Check if already tracked
      const existing = trackedWallets.find(w => 
        w.address.toLowerCase() === address.toLowerCase()
      );
      
      if (existing) {
        return NextResponse.json({ 
          success: false, 
          error: 'Wallet already tracked',
          wallet: existing
        }, { status: 409 });
      }
      
      // Fetch transaction history and analyze
      // In production: fetch real data from Helius/Shyft/etc
      const mockStats = {
        winRate: Math.floor(Math.random() * 40) + 50, // 50-90%
        avgRoi: Math.floor(Math.random() * 200) + 20, // 20-220%
        totalTrades: Math.floor(Math.random() * 100) + 10,
        totalVolume: Math.floor(Math.random() * 500000) + 10000,
        profitableTrades: 0,
        avgHoldTime: `${(Math.random() * 24).toFixed(1)}h`
      };
      mockStats.profitableTrades = Math.floor(mockStats.totalTrades * (mockStats.winRate / 100));
      
      // Classify based on mock stats
      let type = WALLET_TYPES.TRACKED;
      if (mockStats.winRate > 85 && mockStats.avgRoi > 200) type = WALLET_TYPES.INSIDER;
      else if (mockStats.winRate > 70 && mockStats.avgRoi > 100) type = WALLET_TYPES.SMART_MONEY;
      else if (mockStats.totalVolume > 1000000) type = WALLET_TYPES.WHALE;
      
      const newWallet = {
        address,
        chain: chain || 'solana',
        label: label || null,
        type,
        stats: mockStats,
        aiAnalysis: generateAiAnalysis({ type, stats: mockStats }, []),
        recentTrade: null,
        tracked: new Date().toISOString().split('T')[0]
      };
      
      trackedWallets.push(newWallet);
      
      return NextResponse.json({
        success: true,
        message: `Wallet tracked and classified as ${type}`,
        wallet: newWallet
      });
    }
    
    if (action === 'untrack') {
      const index = trackedWallets.findIndex(w => 
        w.address.toLowerCase() === address.toLowerCase()
      );
      
      if (index === -1) {
        return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });
      }
      
      trackedWallets.splice(index, 1);
      
      return NextResponse.json({
        success: true,
        message: 'Wallet removed from tracking'
      });
    }
    
    if (action === 'analyze') {
      // Re-analyze a wallet with latest data
      const wallet = trackedWallets.find(w => 
        w.address.toLowerCase() === address.toLowerCase()
      );
      
      if (!wallet) {
        return NextResponse.json({ success: false, error: 'Wallet not found' }, { status: 404 });
      }
      
      // Would fetch new transactions and re-classify
      wallet.aiAnalysis = generateAiAnalysis(wallet, []);
      
      return NextResponse.json({
        success: true,
        wallet
      });
    }
    
    // ── LOG TRADE: Jiggy confirms he placed a bet ─────────────────────────
    if (action === 'log-trade') {
      const { callId, actualEntry, betSize, direction, market, notes } = body;
      const fs = require('fs');
      const DATA = '/home/ubuntu/.openclaw/workspace/data';
      const PROP_F = `${DATA}/prop-accounts.json`;
      const CALLS_F = `${DATA}/alpha-calls.json`;

      // Load prop accounts
      let propAccounts = {};
      try { propAccounts = JSON.parse(fs.readFileSync(PROP_F, 'utf8')); } catch {}

      // Stamp the trade on prop.market account
      const pm = propAccounts.propmarket || {};
      if (!pm.trades) pm.trades = [];

      // Check for duplicate (same callId already logged)
      const alreadyLogged = pm.trades.find(t => t.callId === callId && !t.closed);
      if (alreadyLogged) {
        return NextResponse.json({ success: false, error: 'Trade already logged', trade: alreadyLogged });
      }

      const trade = {
        callId,
        market: market || '',
        direction: direction || '',
        betSize: parseFloat(betSize) || 75,
        entryPrice: parseFloat(actualEntry) || 0,
        exitPrice: null,
        pnl: 0,
        pnlPct: 0,
        outcome: null,
        closed: false,
        openedAt: new Date().toISOString(),
        closedAt: null,
        notes: notes || '',
        _propAlerted: true,
      };

      pm.trades.push(trade);

      // Update balance tracking
      if (!pm.currentBalance) pm.currentBalance = pm.startingBalance || 5000;
      if (!pm.highWaterMark) pm.highWaterMark = pm.currentBalance;

      propAccounts.propmarket = pm;
      fs.writeFileSync(PROP_F, JSON.stringify(propAccounts, null, 2));

      // Also mark the source call as "placed" so it greys out in the app
      try {
        const calls = JSON.parse(fs.readFileSync(CALLS_F, 'utf8'));
        const call = calls.find(c => c.id === callId);
        if (call) {
          call._placed = true;
          call._placedAt = new Date().toISOString();
          call._actualEntry = parseFloat(actualEntry) || call.entry;
          call._betSize = parseFloat(betSize) || 75;
          fs.writeFileSync(CALLS_F, JSON.stringify(calls, null, 2));
        }
      } catch {}

      return NextResponse.json({ success: true, trade, message: 'Trade logged ✅' });
    }

    // ── resolve-trade: mark a logged trade as win or loss ─────────────────────
    if (action === 'resolve-trade') {
      const { callId, outcome, exitPrice, notes } = body;
      if (!['win','loss','missed'].includes(outcome)) {
        return NextResponse.json({ success: false, error: 'outcome must be win, loss, or missed' });
      }
      const fs = require('fs');
      const DATA = '/home/ubuntu/.openclaw/workspace/data';
      const PROP_F = `${DATA}/prop-accounts.json`;
      const CALLS_F = `${DATA}/alpha-calls.json`;

      let propAccounts = {};
      try { propAccounts = JSON.parse(fs.readFileSync(PROP_F, 'utf8')); } catch {}
      const pm = propAccounts.propmarket || {};
      const trade = (pm.trades || []).find(t => t.callId === callId && !t.closed);
      if (!trade) return NextResponse.json({ success: false, error: 'Trade not found or already closed' });

      // Calculate P&L
      let pnl = 0;
      if (outcome === 'win') {
        const entry = trade.entryPrice || 0.5;
        pnl = Math.round(trade.betSize * (1/entry - 1) * 0.99 * 100) / 100; // 1% commission
      } else if (outcome === 'loss') {
        pnl = -trade.betSize;
      } else { // missed
        pnl = 0; // didn't place it
      }

      trade.outcome = outcome;
      trade.exitPrice = exitPrice || null;
      trade.pnl = pnl;
      trade.pnlPct = trade.betSize > 0 ? Math.round(pnl / trade.betSize * 100) : 0;
      trade.closed = true;
      trade.closedAt = new Date().toISOString();
      if (notes) trade.notes = notes;

      // Update balance
      if (outcome !== 'missed') {
        pm.currentBalance = (pm.currentBalance || pm.startingBalance || 5000) + pnl;
        if (pm.currentBalance > (pm.highWaterMark || 5000)) pm.highWaterMark = pm.currentBalance;
      }

      // Update win rate
      const closedTrades = (pm.trades || []).filter(t => t.closed && (t.outcome === 'win' || t.outcome === 'loss'));
      const wins = closedTrades.filter(t => t.outcome === 'win');
      pm.winRate = closedTrades.length ? Math.round(wins.length / closedTrades.length * 100) / 100 : null;
      pm.totalProfit = (pm.trades || []).reduce((s,t) => s + (t.pnl||0), 0);

      propAccounts.propmarket = pm;
      fs.writeFileSync(PROP_F, JSON.stringify(propAccounts, null, 2));

      // Also mark call as resolved
      try {
        const calls = JSON.parse(fs.readFileSync(CALLS_F, 'utf8'));
        const call = calls.find(c => c.id === callId);
        if (call) {
          call._resolved = outcome;
          call._pnl = pnl;
          fs.writeFileSync(CALLS_F, JSON.stringify(calls, null, 2));
        }
      } catch {}

      const icon = outcome === 'win' ? '✅' : outcome === 'missed' ? '⏭️' : '❌';
      return NextResponse.json({
        success: true,
        message: `${icon} ${outcome.toUpperCase()} logged`,
        pnl,
        newBalance: pm.currentBalance,
        winRate: pm.winRate,
        totalProfit: pm.totalProfit,
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
