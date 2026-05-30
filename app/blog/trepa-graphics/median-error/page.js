export default function MedianErrorDiagram() {
  const players = [
    { name: 'Player A', estimate: 97200, error: 200, winner: true },
    { name: 'Player B', estimate: 96950, error: 50, winner: true },
    { name: 'Player C', estimate: 97800, error: 800, winner: false },
    { name: 'Player D', estimate: 97350, error: 350, winner: false },
    { name: 'Player E', estimate: 96600, error: 400, winner: false },
  ];
  const outcome = 97000;
  const sorted = [...players].sort((a, b) => a.error - b.error);
  const median = sorted[Math.floor(sorted.length / 2)].error;

  return (
    <div style={{minHeight:'100vh',background:'#070810',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',padding:'48px'}}>
      <div style={{maxWidth:'900px',width:'100%'}}>

        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={{fontSize:'13px',color:'#3a5', letterSpacing:'2px',textTransform:'uppercase',marginBottom:'12px'}}>How Trepa decides winners</div>
          <h1 style={{fontSize:'42px',fontWeight:'800',color:'#fff',margin:'0 0 8px',letterSpacing:'-1px'}}>The Median Error Rule</h1>
          <div style={{fontSize:'16px',color:'#555'}}>Outcome: BTC = <span style={{color:'#4af',fontWeight:'700'}}>$97,000</span></div>
        </div>

        {/* Number line */}
        <div style={{position:'relative',margin:'0 0 48px',height:'80px'}}>
          <div style={{position:'absolute',left:0,right:0,top:'40px',height:'2px',background:'#1a1a2e'}}/>
          {/* Outcome marker */}
          <div style={{position:'absolute',left:'50%',top:'10px',transform:'translateX(-50%)',textAlign:'center'}}>
            <div style={{width:'2px',height:'30px',background:'#4af',margin:'0 auto'}}/>
            <div style={{fontSize:'11px',color:'#4af',marginTop:'4px',whiteSpace:'nowrap'}}>$97,000 outcome</div>
          </div>
          {/* Player markers */}
          {players.map((p, i) => {
            const pos = 50 + (p.estimate - outcome) / 200;
            return (
              <div key={i} style={{position:'absolute',left:`${Math.max(5,Math.min(95,pos))}%`,top:'0px',transform:'translateX(-50%)',textAlign:'center'}}>
                <div style={{width:'2px',height:'24px',background:p.winner?'#3f5':'#555',margin:'0 auto'}}/>
                <div style={{fontSize:'10px',color:p.winner?'#3f5':'#666',whiteSpace:'nowrap'}}>{p.name}</div>
              </div>
            );
          })}
        </div>

        {/* Error table */}
        <div style={{background:'#0a0a14',border:'1px solid #1a1a2e',borderRadius:'12px',overflow:'hidden',marginBottom:'32px'}}>
          <div style={{padding:'16px 24px',borderBottom:'1px solid #1a1a2e',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'8px',fontSize:'11px',color:'#444',textTransform:'uppercase',letterSpacing:'1px'}}>
            <span>Player</span><span>Estimate</span><span>Error |est − $97k|</span><span>Result</span>
          </div>
          {sorted.map((p, i) => (
            <div key={i} style={{padding:'14px 24px',borderBottom:'1px solid #0d0d1a',display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'8px',alignItems:'center',background:p.error===median?'#12121f':'transparent'}}>
              <span style={{color:'#aaa',fontSize:'14px'}}>{p.name}</span>
              <span style={{color:'#ccc',fontSize:'14px',fontFamily:'monospace'}}>${p.estimate.toLocaleString()}</span>
              <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <span style={{color:p.winner?'#3f5':p.error===median?'#fa0':'#c44',fontSize:'14px',fontFamily:'monospace',fontWeight:'600'}}>${p.error}</span>
                {p.error === median && <span style={{fontSize:'10px',color:'#fa0',background:'#2a1f00',padding:'2px 6px',borderRadius:'4px',border:'1px solid #3a2f00'}}>MEDIAN</span>}
              </div>
              <span style={{fontSize:'13px',fontWeight:'600',color:p.winner?'#3f5':'#c44'}}>
                {p.winner ? '✓ WIN' : '✗ LOSE'}
              </span>
            </div>
          ))}
        </div>

        {/* Rule explanation */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
          <div style={{background:'#0a140a',border:'1px solid #1a3a1a',borderRadius:'10px',padding:'20px'}}>
            <div style={{fontSize:'12px',color:'#3f5',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'1px'}}>Win condition</div>
            <div style={{fontSize:'15px',color:'#ccc',lineHeight:'1.6'}}>
              Error <span style={{color:'#4af',fontFamily:'monospace',fontWeight:'700'}}>&lt;</span> median error<br/>
              <span style={{color:'#555',fontSize:'13px'}}>Strictly less than the middle value</span>
            </div>
          </div>
          <div style={{background:'#0a0a0a',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'20px'}}>
            <div style={{fontSize:'12px',color:'#888',marginBottom:'8px',textTransform:'uppercase',letterSpacing:'1px'}}>Key insight</div>
            <div style={{fontSize:'15px',color:'#ccc',lineHeight:'1.6'}}>
              ~50% of players win<br/>
              <span style={{color:'#555',fontSize:'13px'}}>by construction, every round</span>
            </div>
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:'32px',fontSize:'12px',color:'#2a2a3a'}}>
          trepa.io · precision prediction on Solana
        </div>
      </div>
    </div>
  );
}
