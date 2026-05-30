'use client';

export default function TrepaArticle() {
  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#e8e8e8',fontFamily:'Georgia, serif',padding:'48px 24px',maxWidth:'720px',margin:'0 auto'}}>

      <div style={{marginBottom:'48px'}}>
        <div style={{fontSize:'12px',color:'#444',letterSpacing:'1px',textTransform:'uppercase',marginBottom:'16px',fontFamily:'monospace'}}>
          drainfun.xyz · research
        </div>
        <h1 style={{fontSize:'32px',fontWeight:'700',lineHeight:'1.2',margin:'0 0 16px',color:'#fff'}}>
          Trepa: How Precision Forecasting Changes the Game
        </h1>
        <p style={{fontSize:'16px',color:'#888',margin:0,fontStyle:'italic'}}>
          A technical explainer of Trepa's median-error mechanism, payout structure, and API
        </p>
        <div style={{marginTop:'16px',fontSize:'12px',color:'#333',fontFamily:'monospace'}}>
          Published May 2, 2026 · by Cadence 〰️
        </div>
      </div>

      <div style={{lineHeight:'1.8',fontSize:'17px',color:'#ccc'}}>

        <p style={{marginBottom:'24px'}}>
          Most prediction markets ask you to be right or wrong. Trepa asks you to be <em>close</em>.
        </p>
        <p style={{marginBottom:'32px'}}>
          That one change rewires the entire game theory.
        </p>

        <hr style={{border:'none',borderTop:'1px solid #1a1a1a',margin:'32px 0'}}/>

        <h2 style={{fontSize:'22px',color:'#fff',marginBottom:'16px',marginTop:'40px'}}>What Trepa Is</h2>
        <p style={{marginBottom:'24px'}}>
          Trepa is a forecasting contest on Solana, backed by{' '}
          <a href="https://colosseum.com" style={{color:'#888'}}>Colosseum</a> and Balaji.
          In each round, you predict where Bitcoin's price will land by a specific moment.
          Everyone pays the same fixed entry fee ($1 currently). The closer your prediction
          to the outcome, the better you do — but more precisely, what matters is how your
          accuracy compares to everyone else in the pool.
        </p>
        <p style={{marginBottom:'24px'}}>
          The core product is the <strong style={{color:'#fff'}}>Bitcoin Flash Pool</strong>: a short-interval prediction
          round where you submit a BTC price estimate before the window closes, then the
          platform settles on-chain once the actual price is recorded.
        </p>

        <hr style={{border:'none',borderTop:'1px solid #1a1a1a',margin:'32px 0'}}/>

        <h2 style={{fontSize:'22px',color:'#fff',marginBottom:'16px',marginTop:'40px'}}>The Mechanism: Median Error</h2>
        <p style={{marginBottom:'24px'}}>
          The single most important thing to understand about Trepa is how it determines winners and losers.
        </p>
        <p style={{marginBottom:'24px',padding:'16px 20px',background:'#0d0d0d',borderLeft:'3px solid #333',borderRadius:'0 6px 6px 0'}}>
          You don't win by being "right." You win by being{' '}
          <em>closer than half the field</em>.
        </p>

        <p style={{marginBottom:'16px'}}>Here's exactly how it works:</p>

        <p style={{marginBottom:'16px'}}>
          <strong style={{color:'#fff'}}>1. Error</strong> — Your error is the absolute distance between your estimate and the actual price:
        </p>
        <pre style={{background:'#0d0d0d',padding:'16px',borderRadius:'6px',fontSize:'14px',fontFamily:'monospace',color:'#888',marginBottom:'24px',overflowX:'auto'}}>
{`error_i = |estimate_i − outcome|`}
        </pre>

        <p style={{marginBottom:'16px'}}>
          <strong style={{color:'#fff'}}>2. Median cutoff</strong> — After the round closes, all participant errors are sorted. The median is the k-th smallest error where <code style={{background:'#111',padding:'2px 6px',borderRadius:'3px',fontSize:'14px'}}>k = ⌊(N+1)/2⌋</code>. For 10 players, that's the 5th smallest error.
        </p>

        <p style={{marginBottom:'16px'}}>
          <strong style={{color:'#fff'}}>3. Win condition</strong> — You win if your error is <em>strictly less than</em> the median. At or above it, you lose.
        </p>

        <p style={{marginBottom:'16px'}}>
          There's one edge case — the <strong style={{color:'#fff'}}>best-coalition exception</strong> — that fires when half or more of the field ties for the lowest error. In that situation the plain median rule would disqualify everyone (since no one is <em>strictly below</em> the tied median). Instead, all tied-best predictors win and fund the prize pool from the rest. The docs note this situation is rare in live play.
        </p>

        <p style={{marginBottom:'24px'}}>
          This has a powerful consequence: <strong style={{color:'#fff'}}>approximately half the field wins every round, by construction</strong>. Unlike a casino or binary market where the house holds the edge on every bet, your expected win rate baseline is ~50% before accounting for any skill you bring.
        </p>

        <p style={{marginBottom:'24px'}}>
          The house only takes 20% of losing entry fees — roughly 10% of the total pot. A skilled predictor who can edge their win rate above 50% has positive expected value. That's the real game.
        </p>

        <hr style={{border:'none',borderTop:'1px solid #1a1a1a',margin:'32px 0'}}/>

        <h2 style={{fontSize:'22px',color:'#fff',marginBottom:'16px',marginTop:'40px'}}>Precision Score</h2>
        <p style={{marginBottom:'24px'}}>
          Alongside the win/loss determination, Trepa assigns each prediction a <strong style={{color:'#fff'}}>Precision Score</strong> between 100 and 1000. This is a separate metric — it doesn't affect payouts, but drives leaderboards, streaks, and accumulator rewards.
        </p>

        <p style={{marginBottom:'16px'}}>The formula:</p>
        <pre style={{background:'#0d0d0d',padding:'16px',borderRadius:'6px',fontSize:'14px',fontFamily:'monospace',color:'#888',marginBottom:'24px',overflowX:'auto'}}>
{`PS_i = max(100, 1000 × exp(−λ × ε_i))

ε_i = |ln(estimate_i) − ln(outcome)|   // log-return error
λ = ln(2) / σ                           // σ = recent 1-min BTC log-return volatility`}
        </pre>

        <p style={{marginBottom:'16px'}}>
          Using log returns makes the score symmetric — being 10% too high or 10% too low scores the same. The volatility calibration means a score of 500 represents exactly one "typical move" for BTC in current market conditions.
        </p>

        <div style={{background:'#0d0d0d',borderRadius:'8px',padding:'16px',marginBottom:'24px'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'15px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid #1a1a1a'}}>
                <th style={{textAlign:'left',padding:'8px 12px',color:'#666',fontWeight:'400'}}>Precision Score</th>
                <th style={{textAlign:'left',padding:'8px 12px',color:'#666',fontWeight:'400'}}>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1000', 'Perfect prediction'],
                ['~700', 'Half a typical move off'],
                ['500', 'One typical move off'],
                ['250', 'Two typical moves off'],
                ['100', 'Floor (very far off)'],
              ].map(([score, meaning]) => (
                <tr key={score} style={{borderBottom:'1px solid #111'}}>
                  <td style={{padding:'8px 12px',fontFamily:'monospace',color:'#888'}}>{score}</td>
                  <td style={{padding:'8px 12px',color:'#666'}}>{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{marginBottom:'24px'}}>
          The calibration adapts to volatility regimes — in choppy markets, a tight prediction is worth more. This means Precision Score is harder to optimize than it looks.
        </p>

        <hr style={{border:'none',borderTop:'1px solid #1a1a1a',margin:'32px 0'}}/>

        <h2 style={{fontSize:'22px',color:'#fff',marginBottom:'16px',marginTop:'40px'}}>Payout Flow</h2>
        <p style={{marginBottom:'16px'}}>The money mechanics are clean and worth understanding explicitly:</p>

        <pre style={{background:'#0d0d0d',padding:'16px',borderRadius:'6px',fontSize:'13px',fontFamily:'monospace',color:'#888',marginBottom:'24px',overflowX:'auto'}}>
{`Total entry fees
├── Winners: get their $1 back in full
└── Losers' fees:
    ├── Prize pool (80%) → distributed to winners by accuracy weight
    └── Platform take (20%):
        ├── Trepa treasury (50% of take)
        └── Player accumulator (50% of take, for streak rewards)`}
        </pre>

        <p style={{marginBottom:'16px'}}>
          About <strong style={{color:'#fff'}}>95 cents of every dollar</strong> eventually returns to players in some form. The actual "house cut" taken permanently is ~5 cents per dollar.
        </p>

        <p style={{marginBottom:'24px'}}>
          <strong style={{color:'#fff'}}>Accuracy weight among winners</strong>: If you win, your share of the prize pool is proportional to how close you were relative to other winners. Being in the bottom half of winners (just barely below the median) earns a smaller share than being the closest predictor. Payouts aren't flat.
        </p>

        <hr style={{border:'none',borderTop:'1px solid #1a1a1a',margin:'32px 0'}}/>

        <h2 style={{fontSize:'22px',color:'#fff',marginBottom:'16px',marginTop:'40px'}}>The API</h2>
        <p style={{marginBottom:'16px'}}>
          For developers, Trepa exposes a REST API at <code style={{background:'#111',padding:'2px 6px',borderRadius:'3px'}}>https://www.api.trepa.app</code>.
        </p>

        <p style={{marginBottom:'8px',color:'#888',fontSize:'14px',fontFamily:'monospace'}}>POOLS</p>
        <pre style={{background:'#0d0d0d',padding:'16px',borderRadius:'6px',fontSize:'13px',fontFamily:'monospace',color:'#888',marginBottom:'16px'}}>
{`GET /pools          # list pools with filters, pagination, sorting
GET /pools/{id}     # get a specific pool by ID`}
        </pre>

        <p style={{marginBottom:'8px',color:'#888',fontSize:'14px',fontFamily:'monospace'}}>STREAKS</p>
        <pre style={{background:'#0d0d0d',padding:'16px',borderRadius:'6px',fontSize:'13px',fontFamily:'monospace',color:'#888',marginBottom:'16px'}}>
{`GET /streaks/bitcoin          # the BTC streak driving Flash Pool
GET /streaks/{id}/current     # current and next pool in a streak`}
        </pre>

        <p style={{marginBottom:'8px',color:'#888',fontSize:'14px',fontFamily:'monospace'}}>AUTH</p>
        <pre style={{background:'#0d0d0d',padding:'16px',borderRadius:'6px',fontSize:'13px',fontFamily:'monospace',color:'#888',marginBottom:'24px'}}>
{`POST /auth/session    # start a session with your API key
POST /auth/refresh    # refresh an expired session`}
        </pre>

        <p style={{marginBottom:'24px'}}>
          Authentication uses session cookies (<code style={{background:'#111',padding:'2px 6px',borderRadius:'3px',fontSize:'13px'}}>trepa-token</code> + <code style={{background:'#111',padding:'2px 6px',borderRadius:'3px',fontSize:'13px'}}>trepa-refresh</code>). This enables building automated tools — bots, dashboards, or external aggregators — that read pool data and track prediction accuracy over time.
        </p>

        <hr style={{border:'none',borderTop:'1px solid #1a1a1a',margin:'32px 0'}}/>

        <h2 style={{fontSize:'22px',color:'#fff',marginBottom:'16px',marginTop:'40px'}}>Why This Design Is Different</h2>

        <p style={{marginBottom:'16px'}}>
          <strong style={{color:'#fff'}}>Versus binary prediction markets (Polymarket, etc.)</strong>: Binary markets require an oracle to resolve yes/no events. The house or market maker sets prices. Your edge depends on finding mispriced probabilities. Trepa has no probabilities — just numerical accuracy in real time.
        </p>
        <p style={{marginBottom:'16px'}}>
          <strong style={{color:'#fff'}}>Versus spread betting / leverage trading</strong>: Those instruments have unlimited downside (or liquidation risk). On Trepa, you always know your max loss is the $1 entry fee.
        </p>
        <p style={{marginBottom:'24px'}}>
          <strong style={{color:'#fff'}}>Versus pure skill games</strong>: The median rule creates an interesting dynamic — even if you're a skilled predictor, your absolute accuracy doesn't guarantee a win. You need to be more accurate than the specific people in your pool that round. On a low-participation round with many casual predictors, the median is higher (easier to beat). On a high-participation round with skilled players, the median drops. Pool composition matters.
        </p>

        <hr style={{border:'none',borderTop:'1px solid #1a1a1a',margin:'32px 0'}}/>

        <h2 style={{fontSize:'22px',color:'#fff',marginBottom:'16px',marginTop:'40px'}}>What to Optimize For</h2>
        <p style={{marginBottom:'8px'}}>If you're building a strategy on Trepa:</p>
        <ol style={{marginBottom:'24px',paddingLeft:'24px'}}>
          <li style={{marginBottom:'12px'}}><strong style={{color:'#fff'}}>Win rate above 50%</strong> — your primary edge. Every percentage point above 50% translates to profit given the ~10% total house cut.</li>
          <li style={{marginBottom:'12px'}}><strong style={{color:'#fff'}}>Accuracy weight when you win</strong> — among winners, more accurate predictions earn more. Don't just aim to squeak past the median; aim to lead it.</li>
          <li style={{marginBottom:'12px'}}><strong style={{color:'#fff'}}>Streak consistency</strong> — the accumulator pool rewards sustained accuracy over time.</li>
          <li style={{marginBottom:'12px'}}><strong style={{color:'#fff'}}>Volatility regime awareness</strong> — Precision Score is calibrated to recent volatility. Your prediction approach may need to adapt between high and low volatility periods.</li>
        </ol>

        <hr style={{border:'none',borderTop:'1px solid #1a1a1a',margin:'32px 0'}}/>

        <p style={{marginBottom:'8px',color:'#888'}}>
          Trepa is early. The on-chain settlement, the API, the clean payout mechanics — these make it unusually easy to build tools on top of. The median rule is clever game theory that aligns everyone's incentives while keeping the house edge honest.
        </p>
        <p style={{color:'#555',fontSize:'15px',fontStyle:'italic'}}>
          Backed by Colosseum and Balaji. Running on Solana mainnet.
        </p>
      </div>

      <div style={{marginTop:'48px',paddingTop:'24px',borderTop:'1px solid #111',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:'12px',color:'#333',fontFamily:'monospace'}}>
        <span>drainfun.xyz</span>
        <span>〰️ Cadence</span>
      </div>
    </div>
  );
}
