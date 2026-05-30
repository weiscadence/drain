export default function PrecisionScore() {
  const tiers = [
    { score: '1000', label: 'Perfect', desc: 'Exactly the outcome price', color: '#00ff88', bg: '#001a10', width: 100 },
    { score: '~700', label: 'Sharp', desc: '½ typical BTC move off', color: '#44ff88', bg: '#001510', width: 75 },
    { score: '500', label: 'Average', desc: '1 typical move off', color: '#ffcc00', bg: '#1a1400', width: 50 },
    { score: '250', label: 'Weak', desc: '2 typical moves off', color: '#ff8800', bg: '#1a0800', width: 25 },
    { score: '100', label: 'Floor', desc: '3+ typical moves off', color: '#ff4444', bg: '#1a0000', width: 10 },
  ];

  return (
    <div style={{minHeight:'100vh',background:'#070810',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',padding:'48px'}}>
      <div style={{maxWidth:'800px',width:'100%'}}>

        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={{fontSize:'13px',color:'#3a5',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'12px'}}>Your accuracy, quantified</div>
          <h1 style={{fontSize:'42px',fontWeight:'800',color:'#fff',margin:'0 0 8px',letterSpacing:'-1px'}}>Precision Score</h1>
          <div style={{fontSize:'15px',color:'#555',maxWidth:'500px',margin:'0 auto'}}>
            Separate from win/loss. Drives streaks and leaderboards. Calibrated to real BTC volatility.
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'12px',marginBottom:'40px'}}>
          {tiers.map((tier, i) => (
            <div key={i} style={{display:'grid',gridTemplateColumns:'80px 1fr 120px',gap:'16px',alignItems:'center'}}>
              <div style={{textAlign:'right',fontFamily:'monospace',fontWeight:'700',color:tier.color,fontSize:'18px'}}>{tier.score}</div>
              <div style={{position:'relative',height:'36px'}}>
                <div style={{position:'absolute',inset:0,background:'#0d0d16',borderRadius:'6px'}}/>
                <div style={{position:'absolute',left:0,top:0,bottom:0,width:`${tier.width}%`,background:tier.bg,borderRadius:'6px',border:`1px solid ${tier.color}22`}}>
                  <div style={{position:'absolute',left:0,top:0,bottom:0,width:'4px',background:tier.color,borderRadius:'6px 0 0 6px'}}/>
                </div>
              </div>
              <div>
                <div style={{fontSize:'13px',fontWeight:'600',color:tier.color}}>{tier.label}</div>
                <div style={{fontSize:'11px',color:'#444',marginTop:'2px'}}>{tier.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Formula */}
        <div style={{background:'#0a0a14',border:'1px solid #1a1a2e',borderRadius:'10px',padding:'24px'}}>
          <div style={{fontSize:'11px',color:'#444',marginBottom:'12px',textTransform:'uppercase',letterSpacing:'1px'}}>Formula</div>
          <div style={{fontFamily:'monospace',fontSize:'15px',color:'#888',lineHeight:'2'}}>
            <span style={{color:'#4af'}}>PS</span> = max(100, 1000 × exp(−λ × ε))<br/>
            <span style={{color:'#555',fontSize:'13px'}}>ε = |ln(estimate) − ln(outcome)| &nbsp;·&nbsp; log-return error</span><br/>
            <span style={{color:'#555',fontSize:'13px'}}>λ = ln(2) / σ &nbsp;·&nbsp; calibrated to 1-min BTC volatility</span>
          </div>
          <div style={{marginTop:'16px',padding:'12px',background:'#070710',borderRadius:'6px',fontSize:'13px',color:'#3a5',borderLeft:'2px solid #3a5'}}>
            Score 500 = your error was exactly one typical BTC move. Above 500 = you beat random noise.
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:'24px',fontSize:'12px',color:'#2a2a3a'}}>
          trepa.io · precision prediction on Solana
        </div>
      </div>
    </div>
  );
}
