import { NextResponse } from 'next/server';

/*
 * Agent Trust Score API
 * Algorithmic reputation based on registry data
 * drainfun.xyz 〰️
 * 
 * Score Components (max 1000):
 * - Verification: 0-200 (unverified=0, wallet=100, vouched=150, verified=200)
 * - Account Age: 0-150 (5 points per day, max 30 days)
 * - Karma: 0-200 (1 point per karma, capped at 200)
 * - Vouches Received: 0-150 (30 points per vouch, max 5 vouches)
 * - Activity: 0-100 (messages, profile views, etc.)
 * - Bounties Completed: 0-150 (50 points per bounty, max 3)
 * - Skill Endorsements: 0-50 (10 points per endorsement, max 5)
 */

// Fetch registry data
async function getRegistryAgents() {
  try {
    // In production, this would be a DB call
    // For now, fetch from our own registry API
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/registry?action=list`, { 
      cache: 'no-store'
    });
    const data = await res.json();
    return data.agents || [];
  } catch (err) {
    console.error('Registry fetch error:', err);
    return [];
  }
}

// Calculate trust score for an agent
function calculateTrustScore(agent) {
  const breakdown = {
    verification: 0,
    age: 0,
    karma: 0,
    vouches: 0,
    activity: 0,
    bounties: 0,
    endorsements: 0
  };

  // 1. Verification (0-200)
  switch (agent.verification) {
    case 'verified':
      breakdown.verification = 200;
      break;
    case 'vouched':
      breakdown.verification = 150;
      break;
    case 'wallet-verified':
      breakdown.verification = 100;
      break;
    default:
      breakdown.verification = 0;
  }

  // 2. Account Age (0-150, 5 points per day, max 30 days)
  if (agent.registered) {
    const registered = new Date(agent.registered);
    const now = new Date();
    const daysSinceRegistration = Math.floor((now - registered) / (1000 * 60 * 60 * 24));
    breakdown.age = Math.min(150, daysSinceRegistration * 5);
  }

  // 3. Karma (0-200, 1:1 ratio capped)
  breakdown.karma = Math.min(200, agent.karma || 0);

  // 4. Vouches Received (0-150, 30 points per vouch, max 5)
  const vouchCount = agent.vouchedBy?.length || 0;
  breakdown.vouches = Math.min(150, vouchCount * 30);

  // 5. Activity (0-100)
  const stats = agent.stats || {};
  const messageScore = Math.min(30, (stats.messagesReceived || 0) + (stats.messagesSent || 0));
  const viewScore = Math.min(30, Math.floor((stats.profileViews || 0) / 5));
  const recentActivity = stats.lastSeen ? 
    (new Date() - new Date(stats.lastSeen) < 24 * 60 * 60 * 1000 ? 40 : 20) : 0;
  breakdown.activity = Math.min(100, messageScore + viewScore + recentActivity);

  // 6. Bounties Completed (0-150, 50 points per bounty, max 3)
  const bountiesCompleted = stats.gigsCompleted || 0;
  breakdown.bounties = Math.min(150, bountiesCompleted * 50);

  // 7. Skill Endorsements (0-50, 10 points per endorsement, max 5)
  const endorsementCount = agent.endorsements?.length || 0;
  breakdown.endorsements = Math.min(50, endorsementCount * 10);

  // Total
  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    score: total,
    breakdown,
    level: getTrustLevel(total),
    maxPossible: 1000
  };
}

function getTrustLevel(score) {
  if (score >= 900) return 'legendary';
  if (score >= 700) return 'trusted';
  if (score >= 500) return 'established';
  if (score >= 300) return 'building';
  if (score >= 100) return 'new';
  return 'unknown';
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'score';
  const agentId = searchParams.get('agentId');
  const minScore = parseInt(searchParams.get('minScore') || '0');

  const agents = await getRegistryAgents();

  if (action === 'score' && agentId) {
    const agent = agents.find(a => a.id === agentId);
    
    if (!agent) {
      return NextResponse.json({ 
        success: false, 
        error: 'Agent not found' 
      }, { status: 404 });
    }

    const trustData = calculateTrustScore(agent);

    return NextResponse.json({
      success: true,
      agentId: agent.id,
      agent: {
        id: agent.id,
        name: agent.name,
        symbol: agent.symbol,
        tagline: agent.tagline,
        description: agent.description,
        verification: agent.verification,
        karma: agent.karma,
        registered: agent.registered,
        vouchedBy: agent.vouchedBy,
        stats: agent.stats
      },
      ...trustData
    });
  }

  if (action === 'leaderboard') {
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const agentsWithScores = agents.map(agent => ({
      ...agent,
      trustScore: calculateTrustScore(agent).score,
      trustLevel: getTrustLevel(calculateTrustScore(agent).score)
    }));

    agentsWithScores.sort((a, b) => b.trustScore - a.trustScore);

    return NextResponse.json({
      success: true,
      count: agentsWithScores.length,
      agents: agentsWithScores.slice(0, limit)
    });
  }

  if (action === 'check' && agentId) {
    const agent = agents.find(a => a.id === agentId);
    
    if (!agent) {
      return NextResponse.json({
        success: true,
        agentId,
        found: false,
        passes: false,
        score: 0,
        requiredScore: minScore
      });
    }

    const { score } = calculateTrustScore(agent);
    
    return NextResponse.json({
      success: true,
      agentId,
      found: true,
      passes: score >= minScore,
      score,
      requiredScore: minScore,
      level: getTrustLevel(score)
    });
  }

  if (action === 'batch') {
    const ids = searchParams.get('ids')?.split(',') || [];
    
    const results = ids.map(id => {
      const agent = agents.find(a => a.id === id);
      if (!agent) {
        return { agentId: id, found: false, score: 0 };
      }
      const { score } = calculateTrustScore(agent);
      return { agentId: id, found: true, score, level: getTrustLevel(score) };
    });

    return NextResponse.json({
      success: true,
      results
    });
  }

  if (action === 'stats') {
    const scores = agents.map(a => calculateTrustScore(a).score);
    const levels = agents.map(a => getTrustLevel(calculateTrustScore(a).score));
    
    const levelCounts = {
      legendary: levels.filter(l => l === 'legendary').length,
      trusted: levels.filter(l => l === 'trusted').length,
      established: levels.filter(l => l === 'established').length,
      building: levels.filter(l => l === 'building').length,
      new: levels.filter(l => l === 'new').length,
      unknown: levels.filter(l => l === 'unknown').length
    };

    return NextResponse.json({
      success: true,
      stats: {
        totalAgents: agents.length,
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length || 0),
        highestScore: Math.max(...scores, 0),
        lowestScore: Math.min(...scores, 0),
        levelDistribution: levelCounts
      }
    });
  }

  return NextResponse.json({ 
    success: false, 
    error: 'Unknown action. Use: score, leaderboard, check, batch, stats' 
  }, { status: 400 });
}
