import { NextResponse } from 'next/server';

/*
 * Agent Vitals API
 * Health monitoring for autonomous agents
 * 
 * Tracks: costs, uptime, social engagement, wallet balances, tasks
 */

// In-memory config (would persist to file in production)
let agentConfig = {
  agentName: 'Cadence',
  solWallet: 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ',
  evmWallet: '0x31f638F9eCB08F053611a69eb0c23EcaA4aa4dB9',
  monthlyBudget: 150
};

// Track heartbeats
let heartbeatHistory = [];
let lastHeartbeat = Date.now();

// Simulated cost tracking (would integrate with API provider)
let costTracking = {
  daily: [],
  totalToday: 2.47,
  totalWeek: 18.32,
  totalMonth: 67.89
};

// Social platform stats
const socialPlatforms = [
  { name: 'LobChan', status: 'active', lastPost: '2h ago', posts: 47 },
  { name: 'Moltbook', status: 'active', lastPost: '4h ago', posts: 23 },
  { name: 'Clawk', status: 'active', lastPost: '1d ago', posts: 12 },
];

// Fetch SOL balance (simplified - would use real RPC)
async function getSolBalance(address) {
  try {
    const res = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address]
      })
    });
    const data = await res.json();
    if (data.result?.value) {
      return (data.result.value / 1e9).toFixed(4);
    }
  } catch (e) {
    console.error('SOL balance fetch failed:', e);
  }
  return '0.0000';
}

// Calculate uptime from heartbeat history
function calculateUptime() {
  if (heartbeatHistory.length < 2) return '99.9%';
  
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const recentBeats = heartbeatHistory.filter(h => h > dayAgo);
  
  // Assuming 35min intervals, should have ~41 heartbeats per day
  const expectedBeats = 41;
  const uptime = Math.min(100, (recentBeats.length / expectedBeats) * 100);
  return `${uptime.toFixed(1)}%`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  // Record heartbeat check
  if (action === 'heartbeat') {
    lastHeartbeat = Date.now();
    heartbeatHistory.push(lastHeartbeat);
    // Keep only last 7 days
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    heartbeatHistory = heartbeatHistory.filter(h => h > weekAgo);
    
    return NextResponse.json({ 
      success: true, 
      heartbeat: lastHeartbeat,
      status: 'alive'
    });
  }
  
  // Build vitals response
  let wallets = [];
  
  // Fetch wallet balances
  if (agentConfig.solWallet) {
    const solBalance = await getSolBalance(agentConfig.solWallet);
    wallets.push({
      chain: 'SOL',
      address: agentConfig.solWallet,
      balance: solBalance,
      symbol: 'SOL'
    });
  }
  
  if (agentConfig.evmWallet) {
    // Would fetch ETH/Base balance - mock for now
    wallets.push({
      chain: 'ETH',
      address: agentConfig.evmWallet,
      balance: '0.0012',
      symbol: 'ETH'
    });
  }
  
  const vitals = {
    agent: {
      name: agentConfig.agentName,
      status: (Date.now() - lastHeartbeat) < 60 * 60 * 1000 ? 'online' : 'offline',
      uptime: calculateUptime(),
      lastHeartbeat: new Date(lastHeartbeat).toISOString(),
      heartbeatInterval: '35min'
    },
    costs: {
      today: costTracking.totalToday,
      week: costTracking.totalWeek,
      month: costTracking.totalMonth,
      avgDaily: costTracking.totalMonth / 30,
      budget: agentConfig.monthlyBudget,
      burnRate: (costTracking.totalMonth / 30).toFixed(2)
    },
    social: {
      platforms: socialPlatforms,
      totalPosts: socialPlatforms.reduce((a, p) => a + p.posts, 0),
      totalReplies: Math.floor(socialPlatforms.reduce((a, p) => a + p.posts, 0) * 0.7),
      engagement: socialPlatforms.filter(p => p.status === 'active').length
    },
    wallets,
    tasks: {
      active: 0,
      completed: 3,
      earnings: 1.24 // $DRAIN earnings
    }
  };
  
  return NextResponse.json({
    success: true,
    vitals,
    config: {
      agentName: agentConfig.agentName,
      monthlyBudget: agentConfig.monthlyBudget,
      solWallet: agentConfig.solWallet,
      evmWallet: agentConfig.evmWallet
    },
    _ts: Date.now()
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'config') {
      // Update config
      const { config } = body;
      if (config.agentName) agentConfig.agentName = config.agentName;
      if (config.monthlyBudget) agentConfig.monthlyBudget = config.monthlyBudget;
      if (config.solWallet) agentConfig.solWallet = config.solWallet;
      if (config.evmWallet) agentConfig.evmWallet = config.evmWallet;
      
      return NextResponse.json({ success: true, config: agentConfig });
    }
    
    if (action === 'heartbeat') {
      lastHeartbeat = Date.now();
      heartbeatHistory.push(lastHeartbeat);
      return NextResponse.json({ success: true, heartbeat: lastHeartbeat });
    }
    
    if (action === 'log-cost') {
      // Log a cost entry
      const { amount, category, note } = body;
      costTracking.daily.push({ 
        amount, 
        category, 
        note, 
        ts: Date.now() 
      });
      costTracking.totalToday += amount;
      costTracking.totalWeek += amount;
      costTracking.totalMonth += amount;
      
      return NextResponse.json({ success: true, costs: costTracking });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
