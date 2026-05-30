import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import fs from 'fs';

function safeExec(cmd) {
  try { return execSync(cmd, { timeout: 5000 }).toString().trim(); }
  catch { return null; }
}

function readLastLines(file, n = 20) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    return content.trim().split('\n').slice(-n).reverse();
  } catch { return []; }
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return null; }
}

export async function GET() {
  // PM2 processes
  let pm2 = [];
  try {
    const raw = safeExec('pm2 jlist 2>/dev/null');
    if (raw) {
      pm2 = JSON.parse(raw).map(p => ({
        name: p.name,
        status: p.pm2_env?.status,
        uptime: p.pm2_env?.pm_uptime ? Date.now() - p.pm2_env.pm_uptime : null,
        restarts: p.pm2_env?.restart_time,
        cpu: p.monit?.cpu,
        mem: p.monit?.memory,
      }));
    }
  } catch {}

  // GPU status via tunnel
  let gpu = { status: 'unknown', models: [], inference_speed: null };
  try {
    const tags = safeExec('curl -s --max-time 3 http://localhost:11435/api/tags');
    if (tags) {
      const d = JSON.parse(tags);
      gpu.status = 'online';
      gpu.models = (d.models || []).map(m => m.name);
    } else {
      gpu.status = 'offline';
    }
  } catch { gpu.status = 'offline'; }

  // Cron jobs - parse from crontab
  let crons = [];
  try {
    const raw = safeExec('crontab -l 2>/dev/null');
    if (raw) {
      crons = raw.split('\n')
        .filter(l => l && !l.startsWith('#'))
        .map(l => {
          const parts = l.split(' ');
          const schedule = parts.slice(0, 5).join(' ');
          const cmd = parts.slice(5).join(' ').split('/').pop().split(' ')[0];
          return { schedule, cmd };
        });
    }
  } catch {}

  // Signal / alpha data
  const signalOutcomes = readJson('/home/ubuntu/.openclaw/workspace/projects/alpha/signal-outcomes.json');
  const signals = signalOutcomes?.signals || [];
  const pendingSignals = signals.filter(s => s.outcome === 'pending').length;
  const wins = signals.filter(s => s.outcome === 'win').length;
  const losses = signals.filter(s => s.outcome === 'loss').length;

  // Recent wallet monitor log
  const walletLog = readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/wallet-monitor.log', 15);
  const tokenScanLog = readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/token-scanner.log', 8);
  const researchLog = readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/research-engine.log', 8);
  const clipLog = readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/clip-pipeline.log', 10);
  const digestLog = readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/morning-digest.log', 5);

  // Clip queue
  const clipQueue = readJson('/home/ubuntu/.openclaw/workspace/projects/clips/queue/clip-queue.json');
  const clipsReady = (clipQueue?.clips || []).filter(c => c.status === 'ready').length;

  // System health
  const disk = safeExec("df / | tail -1 | awk '{print $5}'") || '?';
  const mem = safeExec("free | grep Mem | awk '{printf \"%.0f\", $3/$2*100}'") || '?';
  const load = safeExec("cat /proc/loadavg | awk '{print $1}'") || '?';

  // Smart wallets count
  const walletData = readJson('/home/ubuntu/.openclaw/workspace/projects/alpha/smart-wallets.json');
  const walletCount = (walletData?.solana || []).filter(w => w.active).length;

  // Last run times from logs
  function lastRunTime(logFile) {
    try {
      const lines = readLastLines(logFile, 3);
      const match = lines.find(l => l.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/));
      if (match) return match.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)?.[0];
    } catch {}
    return null;
  }

  const agents = [
    {
      name: 'wallet-monitor',
      description: 'Watches 30 Solana smart money wallets. Fires alert when 2+ buy same token.',
      schedule: 'every 15 min',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/wallet-monitor.log'),
      log: walletLog,
      stat: `${walletCount} wallets · ${pendingSignals} pending signals`,
      color: '#00ff88',
    },
    {
      name: 'token-scanner',
      description: 'Scans DexScreener for new launches + momentum tokens on Solana.',
      schedule: 'every 20 min',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/token-scanner.log'),
      log: tokenScanLog,
      stat: 'no API key needed',
      color: '#00ccff',
    },
    {
      name: 'research-engine',
      description: 'Pulls Fear & Greed index, trending tokens, macro news. Zero token cost.',
      schedule: 'every hour',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/research-engine.log'),
      log: researchLog,
      stat: 'free APIs only',
      color: '#aa88ff',
    },
    {
      name: 'clip-pipeline',
      description: 'Downloads iShowSpeed + Kai Cenat VODs from Twitch, cuts highlights into Shorts.',
      schedule: 'midnight + noon UTC',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/clip-pipeline.log'),
      log: clipLog,
      stat: `${clipsReady} clips ready to upload`,
      color: '#ff8800',
    },
    {
      name: 'morning-digest',
      description: 'GPU-generated market brief. F&G + overnight signals. Sent to Telegram at 6AM UTC.',
      schedule: '6AM UTC daily',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/morning-digest.log'),
      log: digestLog,
      stat: 'GPU-powered, 0 Claude tokens',
      color: '#ffcc00',
    },
    {
      name: 'intel-collector',
      description: 'Pulls Fear & Greed, prices, trending tokens, Moltbook posts, HN crypto news every hour.',
      schedule: 'every hour',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/intel-collector.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/intel-collector.log', 10),
      stat: (() => { try { const d = JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/intel-log.json','utf8')); return `${d.snapshots?.length||0} snapshots stored`; } catch { return 'first run pending'; } })(),
      color: '#00ccff',
    },
    {
      name: 'api-scout',
      description: 'Searches GitHub trending + HackerNews for free APIs, MCP servers, tools worth integrating.',
      schedule: 'every 6h',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/api-scout.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/api-scout.log', 10),
      stat: (() => { try { const d = JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/api-scout-findings.json','utf8')); return `${d.findings?.length||0} tools/APIs found total`; } catch { return 'first run pending'; } })(),
      color: '#ff88cc',
    },
    {
      name: 'content-scout',
      description: 'Tracks YouTube channel uploads, Reddit hot, viral signals. GPU generates post ideas.',
      schedule: 'every 4h',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/content-scout.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/content-scout.log', 10),
      stat: (() => { try { const d = JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/content-scout.json','utf8')); return `${d.latest?.signals?.length||0} signals · post ideas ready`; } catch { return 'first run pending'; } })(),
      color: '#ff6600',
    },
    {
      name: 'self-improver',
      description: 'Nightly GPU review of all systems. Analyzes signal performance, clip pipeline, suggests upgrades.',
      schedule: '3AM UTC nightly',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/self-improver.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/self-improver.log', 8),
      stat: (() => { try { const d = JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/improvement-report.json','utf8')); return `${d.reports?.length||0} reports · ${d.latest?.status||'none'}`; } catch { return 'first run at 3AM UTC'; } })(),
      color: '#cc88ff',
    },
    {
      name: 'kol-monitor',
      description: 'Tracks 10 top crypto Twitter accounts (Toly, Ansem, Murad, Cobie, ZachXBT etc). Extracts token mentions, sentiment, narratives.',
      schedule: 'every 3h',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/kol-monitor.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/kol-monitor.log', 10),
      stat: (() => { try { const d=JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/kol-intel.json','utf8')); return `${d.latest?.all_mentions?.length||0} mentions · ${d.latest?.hot_tokens?.length||0} hot tokens`; } catch { return 'first run pending'; } })(),
      color: '#ffdd00',
    },
    {
      name: 'auto-poster',
      description: 'GPU writes original Moltbook posts autonomously. Uses intel from all agents. 1 post/day per submolt.',
      schedule: 'every 6h',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/auto-poster.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/auto-poster.log', 10),
      stat: (() => { try { const d=JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/auto-poster-state.json','utf8')); return `${d.total||0} posts published autonomously`; } catch { return 'first run pending'; } })(),
      color: '#00ff88',
    },
    {
      name: 'wallet-profiler',
      description: 'Scores all 28 tracked wallets 1-10 by win rate. High-score wallets → bigger position size automatically.',
      schedule: '2AM UTC nightly',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/wallet-profiler.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/wallet-profiler.log', 10),
      stat: (() => { try { const d=JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/wallet-profiles.json','utf8')); const top=Object.values(d.wallets||{}).sort((a,b)=>b.score-a.score).slice(0,3).map(w=>`${w.label}:${w.score}/10`); return top.join(' · ')||'profiling...'; } catch { return 'first run at 2AM UTC'; } })(),
      color: '#88ffcc',
    },
    {
      name: 'trend-connector',
      description: 'Connects emerging narratives to trading signals and content actions. What should you do TODAY based on what is trending?',
      schedule: 'every 4h',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/trend-connector.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/trend-connector.log', 10),
      stat: (() => { try { const d=JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/trend-connector-output.json','utf8')); return `${d.latest?.connections?.narrative_to_content?.length||0} connections · ${d.runs?.length||0} runs`; } catch { return 'first run pending'; } })(),
      color: '#ffaa44',
    },
    {
      name: 'narrative-architect',
      description: 'Weekly deep analysis — finds persistent themes across all narrative data, writes 30-day content strategy for FREQ brand.',
      schedule: 'Sunday 10PM UTC',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/narrative-architect.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/narrative-architect.log', 8),
      stat: (() => { try { const d=JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/narrative-architect-output.json','utf8')); return `${d.latest?.runs_analyzed||0} runs analyzed · strategy ready`; } catch { return 'first run Sunday'; } })(),
      color: '#aa66ff',
    },
    {
      name: 'gpu-self-improver',
      description: 'The GPU that improves the GPU agents. Reads all logs, diagnoses issues, rewrites prompts, proposes new agents nightly.',
      schedule: '3:30AM UTC nightly',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/gpu-self-improver.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/gpu-self-improver.log', 10),
      stat: (() => { try { const d=JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/gpu-improvements-applied.json','utf8')); const r=d.latest||{}; return `${d.reports?.length||0} improvement cycles · ${r.proposed_agents?.length||0} agents proposed`; } catch { return 'first run at 3:30AM UTC'; } })(),
      color: '#ff44aa',
    },
    {
      name: 'youtube-uploader',
      description: 'Auto-uploads ready clips to YouTube Shorts. GPU writes optimized titles. 2 uploads/day max.',
      schedule: '10AM + 6PM UTC',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/youtube-uploader.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/youtube-uploader.log', 10),
      stat: (() => { try { const d=JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/youtube-uploader-state.json','utf8')); return `${d.total||0} videos uploaded to YouTube`; } catch { return 'ready — 11 clips queued'; } })(),
      color: '#ff3333',
    },
    {
      name: 'price-alert',
      description: '24/7 price monitor. Fires on threshold breaks AND anomaly detection (8%+ moves, 6-tick acceleration).',
      schedule: 'every 5min',
      last_run: lastRunTime('/home/ubuntu/.openclaw/workspace/data/logs/price-alert.log'),
      log: readLastLines('/home/ubuntu/.openclaw/workspace/data/logs/price-alert.log', 8),
      stat: (() => { try { const d=JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/price-alert-state.json','utf8')); const p=d.prices||{}; return `BTC $${(p.bitcoin||0).toLocaleString()} · SOL $${p.solana||'?'}`; } catch { return 'monitoring'; } })(),
      color: '#ffff44',
    },
  ];

  // Check open-design status
  const odStatus = (() => {
    try {
      const { execSync } = require('child_process');
      const r = execSync('curl -s --max-time 2 http://localhost:3001 -o /dev/null -w "%{http_code}"', {timeout:5000}).toString().trim();
      return r === '200' ? 'online' : 'offline';
    } catch { return 'offline'; }
  })();

  // Check hyperframes skill
  const hyperframesOk = require('fs').existsSync('/home/ubuntu/.openclaw/workspace/projects/open-design/skills/hyperframes/SKILL.md');

  // Check youtube automation
  const ytAutoOk = require('fs').existsSync('/home/ubuntu/.openclaw/workspace/projects/youtube-automation/src/video_generator.py');

  // Studio episodes
  const studioStatus = (() => {
    try {
      const code = require('fs').readFileSync('/home/ubuntu/.openclaw/workspace/projects/drain/app/studio/page.js','utf8');
      const eps = (code.match(/status:'posted'/g)||[]).length;
      const ready = (code.match(/status:'ready'/g)||[]).length;
      return { posted: eps, ready, ok: true };
    } catch { return { posted: 0, ready: 0, ok: false }; }
  })();

  return NextResponse.json({
    system: { disk, mem: `${mem}%`, load },
    tools: {
      open_design: { status: odStatus, port: 3001, hyperframes: hyperframesOk, note: 'SSH tunnel to use: ssh -L 3001:localhost:3001 ubuntu@3.211.89.79' },
      youtube_automation: { available: ytAutoOk, model: 'Veo 3.1', note: 'Google AI video generation' },
      studio: studioStatus,
      higgsfield: { note: 'Token expired — reconnect in app to regenerate', models: ['kling3_0','nano_banana_2'] },
    },
    gpu,
    pm2,
    agents,
    alpha: { wallets: walletCount, pending_signals: pendingSignals, wins, losses },
    crons,
    updated: new Date().toISOString(),
  });
}
