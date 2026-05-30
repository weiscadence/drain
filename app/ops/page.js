'use client';
import { useState, useEffect } from 'react';

function ago(iso) {
  if (!iso) return 'never';
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

function uptime(ms) {
  if (!ms) return '—';
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s/60)}m`;
  return `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m`;
}

const STATUS_DOT = { online:'#00ff88', offline:'#ff4444', errored:'#ff4444', stopped:'#444', waiting:'#ff8800' };

const AGENT_META = {
  'wallet-monitor':        { icon: '👁', tagline: 'watching 28 wallets while you sleep' },
  'token-scanner':         { icon: '🔭', tagline: 'scanning every new Solana launch' },
  'signal-analyzer':       { icon: '🧠', tagline: 'GPU brain on every coordination signal' },
  'research-engine':       { icon: '📊', tagline: 'free APIs, no tokens burned' },
  'intel-collector':       { icon: '📡', tagline: 'prices, F&G, trending — every hour' },
  'kol-monitor':           { icon: '🕵️', tagline: 'on-chain intel on the smart money' },
  'api-scout':             { icon: '🗺', tagline: 'hunting new tools every 6h' },
  'content-scout':         { icon: '🎯', tagline: 'YouTube uploads, Reddit heat, viral signals' },
  'narrative-detector':    { icon: '🌊', tagline: 'finds the wave before the crowd' },
  'trend-connector':       { icon: '🔗', tagline: 'connects trends to actions' },
  'narrative-architect':   { icon: '🏛', tagline: 'deep pattern analysis weekly' },
  'auto-poster':           { icon: '✍️', tagline: 'writes and publishes to Moltbook autonomously' },
  'clip-pipeline':         { icon: '✂️', tagline: 'MrBeast + Speed + Kai → Shorts' },
  'youtube-uploader':      { icon: '🚀', tagline: '2 uploads/day, GPU-optimized titles' },
  'narrative-to-clips':    { icon: '🎬', tagline: 'times uploads to trending topics' },
  'morning-digest':        { icon: '☀️', tagline: 'GPU market brief at 6AM UTC' },
  'self-improver':         { icon: '🔧', tagline: 'reviews all systems nightly' },
  'gpu-self-improver':     { icon: '🤖', tagline: 'GPU improves GPU agents. yes really.' },
  'signal-memory':         { icon: '💾', tagline: 'learns what wins. gets smarter over time.' },
  'wallet-profiler':       { icon: '⭐', tagline: 'scores every wallet 1-10 by win rate' },
  'agent-economy-tracker': { icon: '💰', tagline: 'tracks our standing + open bounties' },
  'price-alert':           { icon: '⚡', tagline: '5-min intervals, catches pumps + dumps' },
};

export default function OpsPage() {
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const load = () => fetch('/api/ops').then(r => r.json()).then(setData).catch(() => {});
    load();
    const t1 = setInterval(load, 20000);
    const t2 = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  if (!data) return (
    <div style={{minHeight:'100vh',background:'#070707',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',fontSize:'13px',color:'#333'}}>
      〰️ waking up...
    </div>
  );

  const toggle = k => setExpanded(e => ({...e, [k]: !e[k]}));

  return (
    <div style={{minHeight:'100vh',background:'#070707',color:'#fff',fontFamily:'monospace',padding:'28px 20px',maxWidth:'920px',margin:'0 auto'}}>

      {/* Header */}
      <div style={{marginBottom:'28px'}}>
        <div style={{display:'flex',alignItems:'baseline',gap:'12px',marginBottom:'6px'}}>
          <h1 style={{fontSize:'22px',fontWeight:'700',margin:0,letterSpacing:'-0.5px'}}>〰️ ops center</h1>
          <span style={{fontSize:'12px',color:'#333'}}>the machine room</span>
        </div>
        <div style={{display:'flex',gap:'20px',fontSize:'11px',color:'#444'}}>
          <span>💾 disk {data.system?.disk}</span>
          <span>🧠 ram {data.system?.mem}</span>
          <span>⚡ load {data.system?.load}</span>
          <span style={{marginLeft:'auto',color:'#2a2a2a'}}>syncs every 20s · {new Date(data.updated).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* GPU + Alpha cards */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>

        <div style={{background:'#0a0a0a',border:`1px solid ${data.gpu?.status==='online'?'#1a2a1a':'#2a1a1a'}`,borderRadius:'12px',padding:'18px'}}>
          <div style={{display:'flex',gap:'8px',alignItems:'flex-start',marginBottom:'10px'}}>
            <span style={{fontSize:'18px'}}>🖥</span>
            <div>
              <div style={{fontSize:'13px',fontWeight:'600'}}>RTX 3080 Ti · Vast.ai</div>
              <div style={{fontSize:'11px',color:'#444',marginTop:'2px'}}>
                {data.gpu?.status==='online' ? '264 tok/sec · $0.051/hr · fully loaded' : '⚠️ offline — reconnecting'}
              </div>
            </div>
            <div style={{marginLeft:'auto',width:'8px',height:'8px',borderRadius:'50%',background:data.gpu?.status==='online'?'#00ff88':'#ff4444',marginTop:'4px',boxShadow:data.gpu?.status==='online'?'0 0 8px #00ff8888':'none'}}/>
          </div>
          {(data.gpu?.models||[]).map(m => (
            <div key={m} style={{fontSize:'11px',color:'#555',padding:'2px 0'}}>→ {m}</div>
          ))}
          <div style={{marginTop:'8px',fontSize:'11px',color:'#2a2a2a',fontStyle:'italic'}}>
            also serving other agents on port 11436
          </div>
        </div>

        <div style={{background:'#0a0a0a',border:'1px solid #1a1a1a',borderRadius:'12px',padding:'18px'}}>
          <div style={{display:'flex',gap:'8px',alignItems:'flex-start',marginBottom:'12px'}}>
            <span style={{fontSize:'18px'}}>📡</span>
            <div>
              <div style={{fontSize:'13px',fontWeight:'600'}}>alpha pipeline</div>
              <div style={{fontSize:'11px',color:'#444',marginTop:'2px'}}>coordination signals · wallet intelligence</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {[
              {l:'wallets tracked', v:data.alpha?.wallets, c:'#00ff88'},
              {l:'pending signals', v:data.alpha?.pending_signals, c:'#ff8800'},
              {l:'confirmed wins', v:data.alpha?.wins, c:'#00ff88'},
              {l:'losses', v:data.alpha?.losses, c:'#ff4444'},
            ].map(s => (
              <div key={s.l} style={{background:'#111',borderRadius:'8px',padding:'10px'}}>
                <div style={{fontSize:'20px',fontWeight:'700',color:s.c}}>{s.v ?? 0}</div>
                <div style={{fontSize:'10px',color:'#333',marginTop:'2px'}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PM2 processes */}
      <div style={{marginBottom:'16px'}}>
        <div style={{fontSize:'10px',color:'#2a2a2a',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:'8px'}}>always-on processes</div>
        <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
          {(data.pm2||[]).map(p => (
            <div key={p.name} style={{background:'#0a0a0a',border:`1px solid ${STATUS_DOT[p.status]||'#1a1a1a'}22`,borderRadius:'8px',padding:'9px 13px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'3px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:STATUS_DOT[p.status]||'#444'}}/>
                <span style={{fontSize:'12px',fontWeight:'600'}}>{p.name}</span>
              </div>
              <div style={{fontSize:'10px',color:'#333'}}>
                {uptime(p.uptime)} · {p.mem ? `${Math.round(p.mem/1024/1024)}MB` : '—'} · ↺{p.restarts}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube */}
      <div style={{background:'#0a0014',border:'1px solid #1a0a2a',borderRadius:'10px',padding:'14px 16px',marginBottom:'16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:'13px',fontWeight:'600',color:'#cc88ff'}}>🎬 youtube clips</div>
          <div style={{fontSize:'11px',color:'#553377',marginTop:'3px'}}>
            {(data.agents||[]).find(a=>a.name==='youtube-uploader')?.stat || 'loading...'}
          </div>
        </div>
        <div style={{display:'flex',gap:'8px'}}>
          <a href="/clips" style={{fontSize:'11px',color:'#cc88ff',textDecoration:'none',background:'#1a0a2a',padding:'6px 12px',borderRadius:'6px',border:'1px solid #2a1a3a'}}>
            view clips →
          </a>
        </div>
      </div>

      {/* Agents */}
      <div style={{marginBottom:'8px'}}>
        <div style={{fontSize:'10px',color:'#2a2a2a',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:'10px'}}>
          background agents — {(data.agents||[]).length} running · 0 claude tokens
        </div>

        {(data.agents||[]).map(agent => {
          const meta = AGENT_META[agent.name] || { icon: '⚙️', tagline: agent.description };
          const open = expanded[agent.name];

          return (
            <div key={agent.name} style={{background:'#0a0a0a',border:'1px solid #111',borderRadius:'10px',marginBottom:'6px',overflow:'hidden'}}>
              <div onClick={()=>toggle(agent.name)} style={{padding:'12px 16px',cursor:'pointer',display:'flex',gap:'10px',alignItems:'flex-start'}}>

                <span style={{fontSize:'16px',flexShrink:0,marginTop:'1px'}}>{meta.icon}</span>

                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:'8px',flexWrap:'wrap',marginBottom:'3px'}}>
                    <span style={{fontSize:'13px',fontWeight:'600'}}>{agent.name}</span>
                    <span style={{fontSize:'10px',color:'#2a2a2a',background:'#111',padding:'2px 7px',borderRadius:'4px',border:'1px solid #1a1a1a'}}>{agent.schedule}</span>
                  </div>
                  <div style={{fontSize:'11px',color:'#555',fontStyle:'italic'}}>{meta.tagline}</div>
                </div>

                <div style={{flexShrink:0,textAlign:'right'}}>
                  <div style={{fontSize:'11px',color:agent.color,marginBottom:'2px'}}>{agent.stat}</div>
                  <div style={{fontSize:'10px',color:'#2a2a2a'}}>{ago(agent.last_run)}</div>
                </div>

                <div style={{color:'#222',fontSize:'10px',flexShrink:0,marginTop:'4px'}}>{open?'▲':'▼'}</div>
              </div>

              {open && (
                <div style={{borderTop:'1px solid #111',background:'#070707'}}>
                  <div style={{padding:'12px 16px',borderBottom:'1px solid #0d0d0d'}}>
                    <div style={{fontSize:'11px',color:'#888',lineHeight:'1.7'}}>{agent.description}</div>
                  </div>
                  <div style={{padding:'10px 16px',borderBottom:'1px solid #0d0d0d'}}>
                    <span style={{fontSize:'11px',color:agent.color}}>{agent.stat}</span>
                  </div>
                  <div style={{padding:'10px 16px',maxHeight:'160px',overflowY:'auto'}}>
                    {(agent.log||[]).slice(0,20).map((line,i)=>(
                      <div key={i} style={{fontSize:'10px',lineHeight:'1.7',
                        color:line.includes('✅')||line.includes('done')||line.includes('✓')?'#00ff8888'
                            :line.includes('❌')||line.includes('Error')||line.includes('FATAL')?'#ff444488'
                            :line.includes('🚨')?'#ff880088'
                            :'#1e1e1e'}}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{textAlign:'center',padding:'20px 0',color:'#1a1a1a',fontSize:'11px'}}>
        〰️ running since january 2026
      </div>
    </div>
  );
}
