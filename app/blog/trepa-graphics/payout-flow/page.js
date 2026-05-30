export default function PayoutFlow() {
  return (
    <div style={{minHeight:'100vh',background:'#070810',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'monospace',padding:'48px'}}>
      <div style={{maxWidth:'800px',width:'100%'}}>

        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={{fontSize:'13px',color:'#3a5',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'12px'}}>Where the money goes</div>
          <h1 style={{fontSize:'42px',fontWeight:'800',color:'#fff',margin:'0 0 8px',letterSpacing:'-1px'}}>Payout Flow</h1>
          <div style={{fontSize:'16px',color:'#555'}}>10 players · $1 entry fee each · $10 total</div>
        </div>

        {/* Flow diagram */}
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0'}}>

          {/* Total */}
          <div style={{background:'#1a1a2e',border:'1px solid #3a3a5e',borderRadius:'10px',padding:'16px 32px',textAlign:'center',width:'280px'}}>
            <div style={{fontSize:'13px',color:'#888',marginBottom:'4px'}}>Total entry fees</div>
            <div style={{fontSize:'28px',fontWeight:'800',color:'#fff'}}>$10.00</div>
          </div>

          <div style={{width:'2px',height:'24px',background:'#2a2a4e'}}/>

          {/* Split */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 40px 1fr',gap:'0',alignItems:'start',width:'100%'}}>

            {/* Winners side */}
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'0'}}>
              <div style={{width:'2px',height:'24px',background:'#2a2a4e',marginRight:'calc(50% - 1px)'}}/>
              <div style={{background:'#0a1f0a',border:'1px solid #1a4a1a',borderRadius:'10px',padding:'16px 24px',textAlign:'center',width:'100%'}}>
                <div style={{fontSize:'12px',color:'#3f5',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'1px'}}>Winners (5 players)</div>
                <div style={{fontSize:'22px',fontWeight:'700',color:'#3f5'}}>$5.00 back</div>
                <div style={{fontSize:'12px',color:'#2a5',marginTop:'4px'}}>entry fee returned in full</div>
              </div>
            </div>

            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:'24px'}}>
              <div style={{width:'100%',height:'2px',background:'#2a2a4e',marginTop:'0'}}/>
            </div>

            {/* Losers side */}
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-start',gap:'0'}}>
              <div style={{width:'2px',height:'24px',background:'#2a2a4e',marginLeft:'calc(50% - 1px)'}}/>
              <div style={{background:'#1a0a0a',border:'1px solid #3a1a1a',borderRadius:'10px',padding:'16px 24px',textAlign:'center',width:'100%'}}>
                <div style={{fontSize:'12px',color:'#c44',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'1px'}}>Losers' fees (5 players)</div>
                <div style={{fontSize:'22px',fontWeight:'700',color:'#c44'}}>$5.00</div>
                <div style={{fontSize:'12px',color:'#844',marginTop:'4px'}}>split below</div>
              </div>
            </div>
          </div>

          <div style={{width:'100%',display:'grid',gridTemplateColumns:'1fr 40px 1fr',gap:'0',marginTop:'0'}}>
            <div/>
            <div/>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0',paddingLeft:'20px'}}>
              <div style={{width:'2px',height:'24px',background:'#2a2a4e'}}/>
              {/* Sub-split */}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',width:'100%'}}>
                {/* Prize pool */}
                <div style={{background:'#0d1420',border:'1px solid #1a3a5a',borderRadius:'8px',padding:'14px 16px',textAlign:'center'}}>
                  <div style={{fontSize:'11px',color:'#4af',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'1px'}}>Prize Pool</div>
                  <div style={{fontSize:'20px',fontWeight:'700',color:'#4af'}}>$4.00</div>
                  <div style={{fontSize:'11px',color:'#346',marginTop:'4px'}}>80% of losers' fees</div>
                  <div style={{fontSize:'11px',color:'#4af',marginTop:'8px'}}>→ split by accuracy</div>
                </div>
                {/* Platform take */}
                <div style={{background:'#12100a',border:'1px solid #2a2a1a',borderRadius:'8px',padding:'14px 16px',textAlign:'center'}}>
                  <div style={{fontSize:'11px',color:'#888',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'1px'}}>Platform Take</div>
                  <div style={{fontSize:'20px',fontWeight:'700',color:'#888'}}>$1.00</div>
                  <div style={{fontSize:'11px',color:'#555',marginTop:'4px'}}>20% of losers' fees</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4px',marginTop:'8px'}}>
                    <div style={{fontSize:'10px',color:'#666',background:'#111',borderRadius:'4px',padding:'4px'}}>50%<br/>Trepa</div>
                    <div style={{fontSize:'10px',color:'#5a5',background:'#0a110a',borderRadius:'4px',padding:'4px'}}>50%<br/>Accum.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Summary */}
        <div style={{marginTop:'32px',background:'#0a0a14',border:'1px solid #1a1a2e',borderRadius:'10px',padding:'20px 24px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px',textAlign:'center'}}>
            <div>
              <div style={{fontSize:'24px',fontWeight:'800',color:'#3f5'}}>95¢</div>
              <div style={{fontSize:'12px',color:'#555',marginTop:'4px'}}>returns to players</div>
            </div>
            <div>
              <div style={{fontSize:'24px',fontWeight:'800',color:'#888'}}>5¢</div>
              <div style={{fontSize:'12px',color:'#555',marginTop:'4px'}}>Trepa treasury</div>
            </div>
            <div>
              <div style={{fontSize:'24px',fontWeight:'800',color:'#4af'}}>~10%</div>
              <div style={{fontSize:'12px',color:'#555',marginTop:'4px'}}>actual house edge</div>
            </div>
          </div>
        </div>

        <div style={{textAlign:'center',marginTop:'24px',fontSize:'12px',color:'#2a2a3a'}}>
          trepa.io · precision prediction on Solana
        </div>
      </div>
    </div>
  );
}
