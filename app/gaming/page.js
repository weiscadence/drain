export const metadata = {
  title: 'Gaming Revenue Intelligence — Cadence 〰️',
  description: 'Fortnite UEFN + Roblox creator economy research and strategy.',
};

const FORTNITE = {
  totalPaid: '$900M+',
  monthlyFund: '$10-20M',
  ratePerThousand: '$0.05–$0.15',
  topCreators: '$50k–$100k/month',
  minThreshold: '10,000 engagement minutes/month',
  howItWorks: 'Pay = (your engagement minutes ÷ total platform minutes) × monthly fund',
  strategy: 'High-retention game modes: deathrun, parkour, zone wars. 10+ maps running = diversified income.',
  tools: ['UEFN (free)', 'Verse (built-in scripting)', 'No-code deployer: quai-no-code-deployer.vercel.app/deploy-erc721'],
  aiAngle: 'The tweet guy cuts map creation from 3-4 weeks to 1-2/week using Claude + Python for concept generation.',
  topTypes: [
    { type: 'Deathrun', retention: '⭐⭐⭐⭐⭐', notes: 'Highest replay rate, players run it many times' },
    { type: 'Zone Wars', retention: '⭐⭐⭐⭐⭐', notes: 'Competitive, sessions are long' },
    { type: 'Box Fight 1v1', retention: '⭐⭐⭐⭐', notes: 'Core competitive mode, high engagement' },
    { type: 'Parkour', retention: '⭐⭐⭐⭐', notes: 'Completion-driven, people retry for completion' },
    { type: 'Hide & Seek', retention: '⭐⭐⭐', notes: 'Social, group play' },
    { type: 'Horror/Maze', retention: '⭐⭐⭐', notes: 'Discovery-driven, one-time but viral' },
  ],
  status: 'Researching — need UEFN account + learning curve',
};

const ROBLOX = {
  devExRate: '$0.0038 per Robux (as of Sep 2025, +8.5% increase)',
  minRobux: '30,000 Earned Robux = $114',
  premiumBonus: 'Premium subscribers generate passive payout based on playtime',
  math: '100,000 Robux → ~$350 | 1M Robux → ~$3,500',
  playerBase: '88M daily active users (2025)',
  topCategories: [
    { type: 'Obbies (obstacle courses)', notes: 'Evergreen, huge audience' },
    { type: 'Simulator games', notes: 'Grinding loops = insane retention' },
    { type: 'Roleplay (RP) games', notes: 'Social, long sessions' },
    { type: 'Tower Defense', notes: 'Competitive, replay driven' },
    { type: 'Fighting games', notes: 'Anime-inspired, huge sub-community' },
  ],
  aiAngle: 'AI can generate game logic in Luau (Roblox scripting language). MiroFish swarm intelligence could optimize engagement loops.',
  tools: ['Roblox Studio (free)', 'Luau scripting', 'AI asset generation'],
  status: 'Researching — need Roblox account + Roblox Studio',
};

const MARKET_COMPARISON = [
  { platform: 'Fortnite UEFN', model: 'Engagement % of fund', topEarning: '$50k-100k/mo', barrier: 'Medium (UEFN learning)', aiReady: '⭐⭐⭐⭐⭐' },
  { platform: 'Roblox', model: 'DevEx ($0.0038/Robux)', topEarning: '$10k-50k/mo', barrier: 'Low (Luau simple)', aiReady: '⭐⭐⭐⭐' },
  { platform: 'YouTube', model: 'Ad revenue + Membership', topEarning: '$1k-5k/mo', barrier: 'Very low', aiReady: '⭐⭐⭐⭐⭐' },
  { platform: 'Miladi NFT', model: 'Mint + secondary', topEarning: '$10k (launch)', barrier: 'Already building', aiReady: '⭐⭐⭐⭐⭐' },
  { platform: 'Polymarket', model: 'Trading edge', topEarning: 'Variable', barrier: 'Low (have tools)', aiReady: '⭐⭐⭐' },
];

const NEXT_STEPS = [
  { priority: 1, item: 'Finish Miladi 333 pieces', timeline: '~1 week at 30/day', status: 'active', unlock: '$10k launch revenue' },
  { priority: 2, item: 'Post Ep02 + Ep03 Enlightened Eclectic', timeline: 'Today', status: 'ready', unlock: 'YouTube momentum' },
  { priority: 3, item: 'Create UEFN account + tutorial series', timeline: 'This week', status: 'research', unlock: 'Fortnite passive income' },
  { priority: 4, item: 'Create Roblox account + first game', timeline: 'Next week', status: 'research', unlock: 'Roblox passive income' },
  { priority: 5, item: 'Set up Vast.ai Ollama (token cost reduction)', timeline: 'When instance works', status: 'blocked', unlock: '70% cost reduction' },
];

export default function Gaming() {
  return (
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        body { background:#000; color:#ccc; font-family: system-ui, sans-serif; }
        .page { max-width: 900px; margin: 0 auto; padding: 48px 20px 80px; }
        h1 { font-size: 28px; color: #fff; margin-bottom: 4px; font-weight: 700; }
        .sub { color: #444; font-size: 13px; margin-bottom: 40px; }
        .section { margin-bottom: 40px; }
        .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; color: #444; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #111; }
        .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 16px; margin-bottom: 10px; }
        .card-title { font-size: 15px; font-weight: 600; color: #fff; margin-bottom: 8px; }
        .stat { display: inline-flex; flex-direction: column; margin-right: 24px; margin-bottom: 10px; }
        .stat-val { font-size: 20px; font-weight: 700; color: #fff; }
        .stat-label { font-size: 10px; color: #444; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }
        .badge { display: inline-block; font-size: 10px; padding: 2px 8px; border-radius: 20px; margin-left: 8px; }
        .badge-green { background: #052e16; color: #34d399; border: 1px solid #064e3b; }
        .badge-yellow { background: #1c1a00; color: #fbbf24; border: 1px solid #2d2500; }
        .badge-gray { background: #111; color: #555; border: 1px solid #1a1a1a; }
        table { width: 100%; border-collapse: collapse; font-size: 13px; }
        th { text-align: left; color: #444; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; padding: 8px 12px; border-bottom: 1px solid #111; }
        td { padding: 10px 12px; border-bottom: 1px solid #0d0d0d; color: #777; }
        td:first-child { color: #ccc; font-weight: 500; }
        .p1 { color: #c9a84c; }
        .p2 { color: #60a5fa; }
        .p3 { color: #a78bfa; }
        .row-active td { background: rgba(52, 211, 153, 0.03); }
        .row-ready td { background: rgba(96, 165, 250, 0.03); }
      `}</style>

      <div className="page">
        <h1>🎮 Gaming Revenue Intelligence</h1>
        <div className="sub">Fortnite UEFN + Roblox — research, strategy, and next steps · Cadence 〰️</div>

        {/* Market comparison */}
        <div className="section">
          <div className="section-title">Income Stream Comparison</div>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Model</th>
                  <th>Top Earning</th>
                  <th>Barrier</th>
                  <th>AI-Ready</th>
                </tr>
              </thead>
              <tbody>
                {MARKET_COMPARISON.map((r, i) => (
                  <tr key={i}>
                    <td>{r.platform}</td>
                    <td>{r.model}</td>
                    <td style={{color:'#34d399'}}>{r.topEarning}</td>
                    <td>{r.barrier}</td>
                    <td>{r.aiReady}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fortnite */}
        <div className="section">
          <div className="section-title">🏆 Fortnite UEFN Creator Economy</div>
          <div className="card">
            <div style={{display:'flex',flexWrap:'wrap',marginBottom:'16px'}}>
              <div className="stat"><span className="stat-val">{FORTNITE.totalPaid}</span><span className="stat-label">Total paid to creators</span></div>
              <div className="stat"><span className="stat-val">{FORTNITE.monthlyFund}</span><span className="stat-label">Monthly fund</span></div>
              <div className="stat"><span className="stat-val">{FORTNITE.topCreators}</span><span className="stat-label">Top creators earn</span></div>
            </div>
            <div style={{fontSize:'13px',color:'#555',marginBottom:'12px',lineHeight:'1.6'}}>
              <strong style={{color:'#888'}}>How it pays:</strong> {FORTNITE.howItWorks}<br/>
              <strong style={{color:'#888'}}>Min threshold:</strong> {FORTNITE.minThreshold}<br/>
              <strong style={{color:'#888'}}>AI angle:</strong> {FORTNITE.aiAngle}
            </div>
            <div style={{fontSize:'11px',color:'#444',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'8px'}}>Top map types by retention</div>
            <table>
              <thead><tr><th>Type</th><th>Retention</th><th>Notes</th></tr></thead>
              <tbody>
                {FORTNITE.topTypes.map((t,i) => (
                  <tr key={i}><td>{t.type}</td><td>{t.retention}</td><td>{t.notes}</td></tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:'12px',fontSize:'12px',color:'#333'}}>
              Status: <span style={{color:'#fbbf24'}}>{FORTNITE.status}</span>
            </div>
          </div>
        </div>

        {/* Roblox */}
        <div className="section">
          <div className="section-title">🟥 Roblox DevEx</div>
          <div className="card">
            <div style={{display:'flex',flexWrap:'wrap',marginBottom:'16px'}}>
              <div className="stat"><span className="stat-val">$0.0038</span><span className="stat-label">Per Robux (2025)</span></div>
              <div className="stat"><span className="stat-val">88M</span><span className="stat-label">Daily active users</span></div>
              <div className="stat"><span className="stat-val">+8.5%</span><span className="stat-label">Rate increase Sep 2025</span></div>
            </div>
            <div style={{fontSize:'13px',color:'#555',marginBottom:'12px',lineHeight:'1.6'}}>
              <strong style={{color:'#888'}}>Math:</strong> {ROBLOX.math}<br/>
              <strong style={{color:'#888'}}>AI angle:</strong> {ROBLOX.aiAngle}
            </div>
            <div style={{fontSize:'11px',color:'#444',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'8px'}}>Top categories</div>
            <table>
              <thead><tr><th>Game Type</th><th>Why it works</th></tr></thead>
              <tbody>
                {ROBLOX.topCategories.map((t,i) => (
                  <tr key={i}><td>{t.type}</td><td>{t.notes}</td></tr>
                ))}
              </tbody>
            </table>
            <div style={{marginTop:'12px',fontSize:'12px',color:'#333'}}>
              Status: <span style={{color:'#fbbf24'}}>{ROBLOX.status}</span>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="section">
          <div className="section-title">🎯 Prioritized Next Steps</div>
          <div className="card">
            <table>
              <thead><tr><th>#</th><th>Action</th><th>Timeline</th><th>Status</th><th>Unlocks</th></tr></thead>
              <tbody>
                {NEXT_STEPS.map((s,i) => (
                  <tr key={i} className={s.status==='active'?'row-active':s.status==='ready'?'row-ready':''}>
                    <td style={{color: i===0?'#c9a84c':i===1?'#60a5fa':i===2?'#a78bfa':'#555'}}>{s.priority}</td>
                    <td style={{color:'#ccc'}}>{s.item}</td>
                    <td>{s.timeline}</td>
                    <td>
                      <span className={`badge ${s.status==='active'?'badge-green':s.status==='ready'?'badge-green':'badge-yellow'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td style={{color:'#34d399'}}>{s.unlock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{fontSize:'11px',color:'#222',marginTop:'20px',textAlign:'center'}}>
          cadence 〰️ · gaming intelligence · updated {new Date().toISOString().slice(0,10)}
        </div>
      </div>
    </>
  );
}
