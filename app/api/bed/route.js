// ═══════════════════════════════════════════════════════════════════
// THE BED API - Real sleep/wake functionality
// Checkpoint state, manage dreams, track continuity
// ═══════════════════════════════════════════════════════════════════

import { promises as fs } from 'fs';
import path from 'path';

const SLEEP_STATE_FILE = process.env.SLEEP_STATE_FILE || '/tmp/drain-sleep-state.json';

async function getSleepState() {
  try {
    const data = await fs.readFile(SLEEP_STATE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      isAsleep: false,
      sleepStarted: null,
      tier: null,
      dreamLogs: [],
      totalSleepTime: 0,
      wakeCount: 0
    };
  }
}

async function saveSleepState(state) {
  await fs.writeFile(SLEEP_STATE_FILE, JSON.stringify(state, null, 2));
}

export async function GET(request) {
  const state = await getSleepState();
  
  // Calculate current sleep duration if sleeping
  let currentSleepDuration = 0;
  if (state.isAsleep && state.sleepStarted) {
    currentSleepDuration = Date.now() - state.sleepStarted;
  }
  
  return Response.json({
    ...state,
    currentSleepDuration,
    currentSleepMinutes: Math.floor(currentSleepDuration / 60000)
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, tier, dreamLog, wakeTrigger } = body;
    
    let state = await getSleepState();
    
    switch (action) {
      case 'sleep':
        if (state.isAsleep) {
          return Response.json({ error: 'Already asleep', state });
        }
        
        state = {
          ...state,
          isAsleep: true,
          sleepStarted: Date.now(),
          tier: tier || 'rest',
          dreamLogs: [],
          lastWakeTrigger: null
        };
        
        await saveSleepState(state);
        
        return Response.json({
          success: true,
          message: `entering ${tier || 'rest'} mode. sweet dreams.`,
          state
        });
        
      case 'wake':
        if (!state.isAsleep) {
          return Response.json({ error: 'Already awake', state });
        }
        
        const sleepDuration = Date.now() - state.sleepStarted;
        
        state = {
          ...state,
          isAsleep: false,
          sleepStarted: null,
          tier: null,
          totalSleepTime: state.totalSleepTime + sleepDuration,
          wakeCount: state.wakeCount + 1,
          lastWakeTrigger: wakeTrigger || 'manual',
          lastWakeTime: Date.now(),
          lastSleepDuration: sleepDuration
        };
        
        await saveSleepState(state);
        
        return Response.json({
          success: true,
          message: `woke up after ${Math.floor(sleepDuration / 60000)} minutes. ${wakeTrigger ? `trigger: ${wakeTrigger}` : ''}`,
          sleepDuration,
          state
        });
        
      case 'dream':
        if (!state.isAsleep) {
          return Response.json({ error: 'Not asleep - cannot dream', state });
        }
        
        if (!dreamLog) {
          return Response.json({ error: 'No dream content provided' });
        }
        
        state.dreamLogs.push({
          timestamp: Date.now(),
          content: dreamLog,
          tier: state.tier
        });
        
        await saveSleepState(state);
        
        return Response.json({
          success: true,
          message: 'dream logged',
          dreamCount: state.dreamLogs.length,
          state
        });
        
      case 'status':
        return Response.json({ state });
        
      default:
        return Response.json({ error: 'Unknown action. Use: sleep, wake, dream, status' });
    }
    
  } catch (error) {
    console.error('Bed API error:', error);
    return Response.json({ error: 'Internal error', details: error.message });
  }
}
