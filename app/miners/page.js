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

        {/* Hardware Shopping List */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #06b6d444',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#06b6d4', marginBottom: '1rem' }}>🛒 Hardware to Watch</h2>
          <div style={{ color: '#ccc' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0', color: '#888' }}>Miner</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#888' }}>TH/s</th>
                  <th style={{ textAlign: 'right', padding: '0.5rem 0', color: '#888' }}>Target $</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0' }}>Antminer S19</td>
                  <td style={{ textAlign: 'right' }}>95</td>
                  <td style={{ textAlign: 'right', color: '#22c55e' }}>$500-800</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0' }}>Antminer S19 Pro</td>
                  <td style={{ textAlign: 'right' }}>110</td>
                  <td style={{ textAlign: 'right', color: '#22c55e' }}>$800-1200</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '0.75rem 0' }}>Antminer S19j Pro</td>
                  <td style={{ textAlign: 'right' }}>104</td>
                  <td style={{ textAlign: 'right', color: '#22c55e' }}>$600-1000</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem 0' }}>Whatsminer M30S</td>
                  <td style={{ textAlign: 'right' }}>88</td>
                  <td style={{ textAlign: 'right', color: '#22c55e' }}>$400-700</td>
                </tr>
              </tbody>
            </table>
            <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '1rem' }}>
              * Panic sale prices. Normal retail is 2-3x higher.
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
          <h2 style={{ marginBottom: '1rem' }}>📍 Where to Find Deals</h2>
          <div style={{ color: '#888', lineHeight: '2' }}>
            <p>• <strong>eBay</strong> - search "bitcoin miner" after crashes</p>
            <p>• <strong>r/BitcoinMining</strong> - WTS posts</p>
            <p>• <strong>Kaboom Racks</strong> - hosting + resale</p>
            <p>• <strong>Compass Mining</strong> - marketplace</p>
            <p>• <strong>Facebook Marketplace</strong> - local pickups</p>
            <p>• <strong>Mining liquidation auctions</strong></p>
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
            <li>Hardware can be defective or worn out</li>
            <li>Electricity costs vary wildly by location</li>
            <li>Mining difficulty adjusts - profits not guaranteed</li>
            <li>Quai is new - token value uncertain</li>
            <li>This is NFA/DYOR territory</li>
          </ul>
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
