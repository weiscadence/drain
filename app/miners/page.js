'use client';

import Link from 'next/link';

export default function MinersPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000 0%, #1a0a00 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← back to drain
        </Link>
        
        <h1 style={{ 
          fontSize: '2.2rem', 
          fontWeight: '600',
          margin: '2rem 0 0.5rem',
          background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ⛏️ The Miner Arbitrage Play
        </h1>
        <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.1rem' }}>
          AI crashes crypto → miners panic sell → you buy cheap → dual mine Quai
        </p>

        {/* 🔥 FEATURED DEAL - $75 S19 Pro */}
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b33, #ef444422)',
          border: '2px solid #f59e0b',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            background: '#ef4444',
            color: 'white',
            padding: '0.5rem 2rem',
            transform: 'rotate(15deg)',
            fontWeight: 'bold',
            fontSize: '0.75rem'
          }}>
            LOWEST EVER
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              color: '#22c55e',
              textShadow: '0 0 20px #22c55e44'
            }}>
              $75
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: '600', fontSize: '1.2rem', margin: 0 }}>
                Antminer S19 Pro (110 TH/s)
              </p>
              <p style={{ color: '#f59e0b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                Compass Mining Marketplace — Used, Hosted in Minnesota
              </p>
            </div>
          </div>
          <a 
            href="https://compassmining.io/hardware/Antminer-S19-Pro" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: '#22c55e',
              color: 'black',
              fontWeight: 'bold',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
            → View on Compass Mining
          </a>
          <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.75rem', marginBottom: 0 }}>
            ⚠️ Price as of Feb 2026. Limited availability. DYOR.
          </p>
        </div>

        {/* Price Alert */}
        <div style={{
          background: 'linear-gradient(135deg, #22c55e22, #22c55e11)',
          border: '1px solid #22c55e',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem'
        }}>
          <p style={{ color: '#22c55e', fontWeight: '600', margin: 0 }}>
            🔥 S19 ASICs are at ALL-TIME LOWS — $75-200 for 95-110 TH/s machines
          </p>
          <p style={{ color: '#888', fontSize: '0.85rem', margin: '0.5rem 0 0' }}>
            Last updated: Feb 2026 | Prices from Compass Mining, ASIC Miner Value, eBay
          </p>
        </div>

        {/* The Thesis */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #f59e0b44',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#f59e0b', marginBottom: '1rem' }}>📉 The Setup</h2>
          <div style={{ color: '#ccc', lineHeight: '1.8' }}>
            <p><strong>What's happening:</strong></p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>AI agents are entering crypto markets at scale</li>
              <li>They trade faster, 24/7, with no emotion</li>
              <li>Flash crashes become more frequent</li>
              <li>Miners panic when BTC dips hard</li>
              <li>They sell ASICs at massive discounts</li>
            </ul>
          </div>
        </div>

        {/* The Play */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #22c55e44',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#22c55e', marginBottom: '1rem' }}>🎯 The Play</h2>
          <div style={{ color: '#ccc', lineHeight: '1.8' }}>
            <ol style={{ paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Wait for AI-induced crash</strong><br/>
                <span style={{ color: '#888' }}>Monitor for flash crashes, liquidation cascades</span>
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Buy distressed mining hardware</strong><br/>
                <span style={{ color: '#888' }}>eBay, Craigslist, mining forums, liquidation sales</span>
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Set up dual mining with Quai</strong><br/>
                <span style={{ color: '#888' }}>Same SHA-256 ASICs, two revenue streams</span>
              </li>
              <li style={{ marginBottom: '1rem' }}>
                <strong>Stack both BTC and QUAI</strong><br/>
                <span style={{ color: '#888' }}>Hedge your bets across chains</span>
              </li>
            </ol>
          </div>
        </div>

        {/* What is Quai */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #8b5cf644',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#8b5cf6', marginBottom: '1rem' }}>🔮 What is Quai?</h2>
          <div style={{ color: '#ccc', lineHeight: '1.8' }}>
            <p><strong>Quai Network</strong> is a merge-mined blockchain that lets SHA-256 miners (Bitcoin ASICs) earn additional rewards without extra electricity costs.</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
              <li>Same hardware, dual rewards</li>
              <li>Proof-of-Work + Proof-of-Entropy-Minima</li>
              <li>9 parallel execution shards</li>
              <li>50k+ TPS capacity</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>
              <a href="https://qu.ai" target="_blank" rel="noopener noreferrer" style={{ color: '#8b5cf6' }}>
                Learn more → qu.ai
              </a>
            </p>
          </div>
        </div>

        {/* Hardware Shopping List - UPDATED PRICES */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #06b6d444',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#06b6d4', marginBottom: '1rem' }}>🛒 Current US Market Prices (Feb 2026)</h2>
          <div style={{ color: '#ccc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#888' }}>Miner</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#888' }}>TH/s</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#888' }}>Watts</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#888' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0' }}>Antminer S19</td>
                  <td style={{ textAlign: 'right' }}>95</td>
                  <td style={{ textAlign: 'right', color: '#888' }}>3250W</td>
                  <td style={{ textAlign: 'right', color: '#22c55e', fontWeight: '600' }}>$100-200</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0' }}>Antminer S19 Pro</td>
                  <td style={{ textAlign: 'right' }}>110</td>
                  <td style={{ textAlign: 'right', color: '#888' }}>3250W</td>
                  <td style={{ textAlign: 'right', color: '#22c55e', fontWeight: '600' }}>$75-300</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0' }}>Antminer S19j Pro</td>
                  <td style={{ textAlign: 'right' }}>104</td>
                  <td style={{ textAlign: 'right', color: '#888' }}>3068W</td>
                  <td style={{ textAlign: 'right', color: '#22c55e', fontWeight: '600' }}>$150-350</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0' }}>Antminer S19 XP</td>
                  <td style={{ textAlign: 'right' }}>140</td>
                  <td style={{ textAlign: 'right', color: '#888' }}>3010W</td>
                  <td style={{ textAlign: 'right', color: '#f59e0b', fontWeight: '600' }}>$500-900</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 0' }}>Whatsminer M30S++</td>
                  <td style={{ textAlign: 'right' }}>112</td>
                  <td style={{ textAlign: 'right', color: '#888' }}>3472W</td>
                  <td style={{ textAlign: 'right', color: '#22c55e', fontWeight: '600' }}>$150-350</td>
                </tr>
              </tbody>
            </table>
            <p style={{ color: '#22c55e', fontSize: '0.9rem', marginTop: '1rem', padding: '0.75rem', background: '#22c55e11', borderRadius: '8px' }}>
              💰 <strong>Best deal right now:</strong> S19 Pro at $75 on Compass Mining marketplace (used, hosted in Minnesota)
            </p>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Sources: Compass Mining, ASIC Miner Value, BT-Miners, eBay sold listings
            </p>
          </div>
        </div>

        {/* Texas Electricity */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #f59e0b44',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#f59e0b', marginBottom: '1rem' }}>⚡ Texas Electricity Advantage</h2>
          <div style={{ color: '#ccc', lineHeight: '1.8' }}>
            <p>Texas has some of the <strong>cheapest electricity in the US</strong> for mining:</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#888' }}>Rate Type</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#888' }}>$/kWh</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#888' }}>S19 Daily Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.5rem 0' }}>Industrial/Wholesale</td>
                  <td style={{ textAlign: 'right', color: '#22c55e' }}>$0.03-0.05</td>
                  <td style={{ textAlign: 'right' }}>$2.34-3.90</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.5rem 0' }}>Residential (cheap plan)</td>
                  <td style={{ textAlign: 'right', color: '#f59e0b' }}>$0.08-0.10</td>
                  <td style={{ textAlign: 'right' }}>$6.24-7.80</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0' }}>US Average</td>
                  <td style={{ textAlign: 'right', color: '#ef4444' }}>$0.12-0.15</td>
                  <td style={{ textAlign: 'right' }}>$9.36-11.70</td>
                </tr>
              </tbody>
            </table>
            <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '1rem' }}>
              <strong>Key insight:</strong> At US average rates, S19 mining is unprofitable (-$4-6/day). At Texas industrial rates ($0.04/kWh), you're closer to breakeven. Add Quai merge-mining = potential profit.
            </p>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Texas providers to check: Griddy, Octopus Energy, wholesale ERCOT plans
            </p>
          </div>
        </div>

        {/* Profitability Calculator */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #8b5cf644',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#8b5cf6', marginBottom: '1rem' }}>📊 Quick Math (S19 @ 95TH)</h2>
          <div style={{ color: '#ccc', lineHeight: '1.8' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.5rem 0', color: '#888' }}>BTC Revenue (current)</td>
                  <td style={{ textAlign: 'right' }}>~$3.30/day</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.5rem 0', color: '#888' }}>Electricity @ $0.04/kWh</td>
                  <td style={{ textAlign: 'right', color: '#ef4444' }}>-$3.12/day</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.5rem 0', color: '#888' }}>BTC Profit (Texas industrial)</td>
                  <td style={{ textAlign: 'right', color: '#22c55e' }}>+$0.18/day</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.5rem 0', color: '#888' }}>+ Quai merge-mining bonus</td>
                  <td style={{ textAlign: 'right', color: '#8b5cf6' }}>+???/day</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>ROI on $100 miner</td>
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>~1-2 years (BTC only)</td>
                </tr>
              </tbody>
            </table>
            <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '1rem' }}>
              The bet: Quai rewards + BTC appreciation = faster ROI. You're betting on two assets appreciating while paying minimal ongoing costs.
            </p>
          </div>
        </div>

        {/* Where to Buy */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #333',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>📍 Where to Find Deals (US)</h2>
          <div style={{ color: '#888', lineHeight: '2' }}>
            <p>• <a href="https://compassmining.io/marketplace" target="_blank" style={{ color: '#06b6d4' }}>Compass Mining Marketplace</a> - S19 Pro from $75</p>
            <p>• <a href="https://www.ebay.com/sch/i.html?_nkw=antminer+s19" target="_blank" style={{ color: '#06b6d4' }}>eBay</a> - search after BTC dips</p>
            <p>• <a href="https://bt-miners.com" target="_blank" style={{ color: '#06b6d4' }}>BT-Miners</a> - US-based, S19 ~$450</p>
            <p>• <strong>r/BitcoinMining</strong> - WTS posts, local deals</p>
            <p>• <strong>Facebook Marketplace</strong> - Texas local pickups</p>
            <p>• <strong>Kaboom Racks</strong> - hosting + resale</p>
          </div>
        </div>

        {/* Risk Warning */}
        <div style={{
          background: '#1a0a0a',
          border: '1px solid #ef444444',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <p style={{ color: '#ef4444', fontWeight: '600', marginBottom: '0.5rem' }}>⚠️ Risks</p>
          <ul style={{ color: '#888', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>Hardware can be defective or worn out (hash boards fail)</li>
            <li>Electricity costs vary wildly — measure your ACTUAL rate</li>
            <li>Mining difficulty adjusts — profits not guaranteed</li>
            <li>S19 is older gen — newer S21s are 2x more efficient</li>
            <li>Quai is new — token value uncertain</li>
            <li>Heat + noise (75dB) — not apartment friendly</li>
            <li>This is NFA/DYOR territory</li>
          </ul>
        </div>

        {/* More dApps */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #333',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>🔧 More Tools on drainfun.xyz</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '0.75rem' 
          }}>
            <Link href="/alpha" style={{ 
              padding: '0.75rem', 
              background: '#f43f5e22', 
              border: '1px solid #f43f5e44',
              borderRadius: '8px',
              color: '#f43f5e',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>
              🎯 AlphaTrack<br/>
              <span style={{ color: '#888', fontSize: '0.8rem' }}>Find insider wallets</span>
            </Link>
            <Link href="/radar" style={{ 
              padding: '0.75rem', 
              background: '#8b5cf622', 
              border: '1px solid #8b5cf644',
              borderRadius: '8px',
              color: '#8b5cf6',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>
              📡 TokenRadar<br/>
              <span style={{ color: '#888', fontSize: '0.8rem' }}>Free DexScreener alt</span>
            </Link>
            <Link href="/autochek" style={{ 
              padding: '0.75rem', 
              background: '#10b98122', 
              border: '1px solid #10b98144',
              borderRadius: '8px',
              color: '#10b981',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>
              🚗 AutoChek<br/>
              <span style={{ color: '#888', fontSize: '0.8rem' }}>Car inspection + escrow</span>
            </Link>
            <Link href="/vitals" style={{ 
              padding: '0.75rem', 
              background: '#ef444422', 
              border: '1px solid #ef444444',
              borderRadius: '8px',
              color: '#ef4444',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>
              💊 Vitals<br/>
              <span style={{ color: '#888', fontSize: '0.8rem' }}>Agent health dashboard</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p style={{ 
          color: '#444', 
          fontSize: '0.85rem', 
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          〰️ when AI breaks things, builders find opportunities
        </p>
      </div>
    </div>
  );
}
