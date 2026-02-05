import { NextResponse } from 'next/server';

// Token pricing (per 1M tokens, as of Feb 2026)
const PRICING = {
  // OpenAI
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4-turbo': { input: 10.00, output: 30.00 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  'o1': { input: 15.00, output: 60.00 },
  'o1-mini': { input: 3.00, output: 12.00 },
  
  // Anthropic
  'claude-3-opus': { input: 15.00, output: 75.00 },
  'claude-3.5-sonnet': { input: 3.00, output: 15.00 },
  'claude-3-haiku': { input: 0.25, output: 1.25 },
  
  // Groq (free tier limits, paid after)
  'llama-3.1-70b': { input: 0.59, output: 0.79 },
  'llama-3.1-8b': { input: 0.05, output: 0.08 },
  'mixtral-8x7b': { input: 0.24, output: 0.24 },
  
  // Google
  'gemini-1.5-pro': { input: 1.25, output: 5.00 },
  'gemini-1.5-flash': { input: 0.075, output: 0.30 },
  
  // Other
  'mistral-large': { input: 2.00, output: 6.00 },
  'mistral-small': { input: 0.20, output: 0.60 },
};

// Common agent cost factors
const INFRA_COSTS = {
  'server-basic': { monthly: 5, desc: 'Basic VPS (1GB RAM)' },
  'server-standard': { monthly: 20, desc: 'Standard VPS (4GB RAM)' },
  'server-gpu': { monthly: 200, desc: 'GPU instance' },
  'domain': { monthly: 1, desc: 'Domain name' },
  'storage-10gb': { monthly: 1, desc: '10GB storage' },
  'storage-100gb': { monthly: 5, desc: '100GB storage' },
  'cdn': { monthly: 5, desc: 'CDN/bandwidth' },
};

// In-memory usage tracking
let usageLogs = {};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'pricing';
  const agentId = searchParams.get('agentId');
  
  if (action === 'pricing') {
    return NextResponse.json({
      success: true,
      models: PRICING,
      infrastructure: INFRA_COSTS,
      updated: '2026-02-03'
    });
  }
  
  if (action === 'estimate') {
    const model = searchParams.get('model');
    const inputTokens = parseInt(searchParams.get('input') || '0');
    const outputTokens = parseInt(searchParams.get('output') || '0');
    const callsPerDay = parseInt(searchParams.get('calls') || '1');
    
    if (!model || !PRICING[model]) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid model',
        available: Object.keys(PRICING)
      }, { status: 400 });
    }
    
    const pricing = PRICING[model];
    const costPerCall = (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
    const dailyCost = costPerCall * callsPerDay;
    const monthlyCost = dailyCost * 30;
    
    return NextResponse.json({
      success: true,
      model,
      perCall: {
        inputTokens,
        outputTokens,
        cost: costPerCall.toFixed(6)
      },
      daily: {
        calls: callsPerDay,
        cost: dailyCost.toFixed(4)
      },
      monthly: {
        calls: callsPerDay * 30,
        cost: monthlyCost.toFixed(2)
      }
    });
  }
  
  if (action === 'usage' && agentId) {
    const logs = usageLogs[agentId] || [];
    const totalCost = logs.reduce((sum, l) => sum + l.cost, 0);
    
    return NextResponse.json({
      success: true,
      agentId,
      logs: logs.slice(-50),
      totalCost: totalCost.toFixed(4),
      logCount: logs.length
    });
  }
  
  return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'log') {
      const { agentId, model, inputTokens, outputTokens, description } = body;
      
      if (!agentId || !model) {
        return NextResponse.json({ 
          success: false, 
          error: 'agentId and model required' 
        }, { status: 400 });
      }
      
      const pricing = PRICING[model];
      if (!pricing) {
        return NextResponse.json({ 
          success: false, 
          error: 'Unknown model',
          available: Object.keys(PRICING)
        }, { status: 400 });
      }
      
      const cost = ((inputTokens || 0) * pricing.input + (outputTokens || 0) * pricing.output) / 1_000_000;
      
      const logEntry = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        model,
        inputTokens: inputTokens || 0,
        outputTokens: outputTokens || 0,
        cost,
        description: description || ''
      };
      
      if (!usageLogs[agentId]) {
        usageLogs[agentId] = [];
      }
      usageLogs[agentId].push(logEntry);
      
      // Keep only last 1000 entries per agent
      if (usageLogs[agentId].length > 1000) {
        usageLogs[agentId] = usageLogs[agentId].slice(-1000);
      }
      
      return NextResponse.json({
        success: true,
        logged: logEntry,
        totalCost: usageLogs[agentId].reduce((sum, l) => sum + l.cost, 0).toFixed(4)
      });
    }
    
    if (action === 'budget-check') {
      const { agentId, budget } = body;
      
      if (!agentId || budget === undefined) {
        return NextResponse.json({ 
          success: false, 
          error: 'agentId and budget required' 
        }, { status: 400 });
      }
      
      const logs = usageLogs[agentId] || [];
      const spent = logs.reduce((sum, l) => sum + l.cost, 0);
      const remaining = budget - spent;
      const percentUsed = budget > 0 ? (spent / budget * 100) : 0;
      
      return NextResponse.json({
        success: true,
        budget,
        spent: spent.toFixed(4),
        remaining: remaining.toFixed(4),
        percentUsed: percentUsed.toFixed(1),
        status: percentUsed > 90 ? 'critical' : percentUsed > 75 ? 'warning' : 'ok'
      });
    }
    
    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
