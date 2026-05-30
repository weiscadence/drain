'use client'

import { useState, useEffect } from 'react'

export default function Watchdog() {
  const [activeTab, setActiveTab] = useState('scanner')
  const [contractInput, setContractInput] = useState('')
  const [walletInput, setWalletInput] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [watchlist, setWatchlist] = useState([])

  // Simulated live rug feed
  const [rugFeed, setRugFeed] = useState([
    { time: '2m ago', token: 'MOON2X', chain: 'SOL', type: 'Honeypot', loss: '$45K', address: '7xK...3nQ' },
    { time: '8m ago', token: 'ELONCAT', chain: 'BASE', type: 'Rug Pull', loss: '$120K', address: '0x4f...8a2' },
    { time: '15m ago', token: 'SAFEYIELD', chain: 'ETH', type: 'Exit Scam', loss: '$890K', address: '0x1b...9c1' },
    { time: '23m ago', token: 'DOGE100X', chain: 'SOL', type: 'Liquidity Drain', loss: '$67K', address: '3mN...7pL' },
    { time: '31m ago', token: 'AIGEMX', chain: 'BASE', type: 'Mint Exploit', loss: '$230K', address: '0x8c...2d4' },
  ])

  // Known scammer database (simulated)
  const knownScammers = [
    { alias: 'Malone Iam (Greavys)', wallets: 12, totalStolen: '$243M', status: 'ARRESTED', lastActive: '2024-09' },
    { alias: 'The Lazarus Group', wallets: 847, totalStolen: '$1.7B', status: 'ACTIVE', lastActive: '2024-02' },
    { alias: 'Pink Drainer', wallets: 234, totalStolen: '$85M', status: 'INACTIVE', lastActive: '2024-01' },
    { alias: 'Inferno Drainer', wallets: 156, totalStolen: '$70M', status: 'SHUTDOWN', lastActive: '2023-11' },
    { alias: 'Monkey Drainer', wallets: 89, totalStolen: '$24M', status: 'INACTIVE', lastActive: '2023-03' },
  ]

  const scanContract = async () => {
    if (!contractInput) return
    setScanning(true)
    setScanResult(null)
    
    await new Promise(r => setTimeout(r, 2000))
    
    // Simulated scan results
    const riskScore = Math.floor(Math.random() * 100)
    const isHoneypot = riskScore > 70
    const hasHiddenMint = riskScore > 60
    const hasBlacklist = riskScore > 50
    const liquidityLocked = riskScore < 40
    const ownershipRenounced = riskScore < 30
    
    setScanResult({
      address: contractInput,
      riskScore,
      riskLevel: riskScore > 70 ? 'CRITICAL' : riskScore > 50 ? 'HIGH' : riskScore > 30 ? 'MEDIUM' : 'LOW',
      flags: [
        { name: 'Honeypot Detection', status: isHoneypot ? 'FAIL' : 'PASS', critical: isHoneypot },
        { name: 'Hidden Mint Function', status: hasHiddenMint ? 'DETECTED' : 'CLEAN', critical: hasHiddenMint },
        { name: 'Blacklist Function', status: hasBlacklist ? 'PRESENT' : 'NONE', critical: false },
        { name: 'Liquidity Locked', status: liquidityLocked ? 'YES' : 'NO', critical: !liquidityLocked },
        { name: 'Ownership Renounced', status: ownershipRenounced ? 'YES' : 'NO', critical: !ownershipRenounced },
        { name: 'Contract Verified', status: Math.random() > 0.3 ? 'YES' : 'NO', critical: false },
        { name: 'Similar to Known Scams', status: riskScore > 60 ? '3 MATCHES' : 'NONE', critical: riskScore > 60 },
      ],
      deployer: {
        address: '0x' + Math.random().toString(16).slice(2, 10) + '...',
        previousRugs: riskScore > 50 ? Math.floor(Math.random() * 5) + 1 : 0,
        walletAge: Math.floor(Math.random() * 365) + ' days',
        fundingSource: riskScore > 60 ? 'Tornado Cash' : 'Coinbase',
      },
      liquidity: {
        total: '$' + (Math.random() * 500000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        locked: liquidityLocked ? '80%' : '0%',
        lockDuration: liquidityLocked ? '6 months' : 'N/A',
      }
    })
    
    setScanning(false)
  }

  const addToWatchlist = (address) => {
    if (!watchlist.includes(address)) {
      setWatchlist([...watchlist, address])
    }
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-red-900/50 px-6 py-4 bg-gradient-to-r from-black via-red-950/10 to-black">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐕</span>
            <h1 className="text-2xl font-bold">
              <span className="text-red-500">WATCH</span>
              <span className="text-white">DOG</span>
            </h1>
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-mono">AI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-400">LIVE</span>
            </div>
            <div className="text-sm text-white/40 font-mono">
              24/7 ON-CHAIN SURVEILLANCE
            </div>
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="border-b border-white/10 bg-gradient-to-b from-red-950/20 to-black px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-red-400">$2.1B</div>
              <div className="text-white/40 text-sm">Rugs Detected (2024)</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">847</div>
              <div className="text-white/40 text-sm">Active Scam Wallets</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">12,453</div>
              <div className="text-white/40 text-sm">Contracts Scanned Today</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">3.2s</div>
              <div className="text-white/40 text-sm">Avg Detection Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-1">
            {[
              { id: 'scanner', label: '🔍 Token Scanner', hot: true },
              { id: 'radar', label: '🚨 Rug Radar' },
              { id: 'watchlist', label: '👁️ Watchlist' },
              { id: 'database', label: '📂 Scammer DB' },
              { id: 'investigate', label: '🕵️ Investigate' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-white bg-red-950/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
                {tab.hot && <span className="ml-1 text-xs bg-red-600 text-white px-1 rounded">HOT</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Token Scanner */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Token Scanner</h2>
              <p className="text-white/60">Paste a contract address. Get instant security analysis.</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={contractInput}
                  onChange={e => setContractInput(e.target.value)}
                  placeholder="0x... or base58 contract address"
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-4 text-white font-mono text-sm focus:border-red-500 focus:outline-none"
                />
                <button
                  onClick={scanContract}
                  disabled={scanning || !contractInput}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-white font-bold px-8 py-4 rounded-lg transition-all"
                >
                  {scanning ? '⏳ SCANNING...' : '🔍 SCAN'}
                </button>
              </div>
              
              <div className="flex justify-center gap-4 mt-4">
                {['SOL', 'BASE', 'ETH', 'BSC'].map(chain => (
                  <span key={chain} className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded">
                    {chain}
                  </span>
                ))}
              </div>
            </div>

            {/* Scan Result */}
            {scanResult && (
              <div className="max-w-3xl mx-auto mt-8 space-y-6">
                {/* Risk Score */}
                <div className={`rounded-xl p-6 border-2 ${
                  scanResult.riskLevel === 'CRITICAL' ? 'bg-red-950/50 border-red-600' :
                  scanResult.riskLevel === 'HIGH' ? 'bg-orange-950/50 border-orange-600' :
                  scanResult.riskLevel === 'MEDIUM' ? 'bg-yellow-950/50 border-yellow-600' :
                  'bg-green-950/50 border-green-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm mb-1">Risk Assessment</p>
                      <div className="flex items-center gap-4">
                        <span className={`text-5xl font-black ${
                          scanResult.riskLevel === 'CRITICAL' ? 'text-red-500' :
                          scanResult.riskLevel === 'HIGH' ? 'text-orange-500' :
                          scanResult.riskLevel === 'MEDIUM' ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          {scanResult.riskScore}
                        </span>
                        <div>
                          <span className={`text-2xl font-bold ${
                            scanResult.riskLevel === 'CRITICAL' ? 'text-red-400' :
                            scanResult.riskLevel === 'HIGH' ? 'text-orange-400' :
                            scanResult.riskLevel === 'MEDIUM' ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {scanResult.riskLevel} RISK
                          </span>
                          <p className="text-white/40 text-sm">
                            {scanResult.riskLevel === 'CRITICAL' ? '⛔ DO NOT BUY - LIKELY SCAM' :
                             scanResult.riskLevel === 'HIGH' ? '⚠️ Proceed with extreme caution' :
                             scanResult.riskLevel === 'MEDIUM' ? '⚡ Some concerns detected' :
                             '✅ Relatively safe'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addToWatchlist(scanResult.address)}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      + Add to Watchlist
                    </button>
                  </div>
                </div>

                {/* Security Flags */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="font-semibold mb-4">🚩 Security Flags</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {scanResult.flags.map((flag, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${
                        flag.critical ? 'bg-red-950/50 border border-red-900' : 'bg-white/5'
                      }`}>
                        <span className="text-sm">{flag.name}</span>
                        <span className={`text-sm font-mono ${
                          flag.status === 'PASS' || flag.status === 'YES' || flag.status === 'CLEAN' || flag.status === 'NONE'
                            ? 'text-green-400' 
                            : flag.critical 
                              ? 'text-red-400' 
                              : 'text-yellow-400'
                        }`}>
                          {flag.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deployer Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">👤 Deployer Analysis</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Address</span>
                        <span className="font-mono">{scanResult.deployer.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Previous Rugs</span>
                        <span className={scanResult.deployer.previousRugs > 0 ? 'text-red-400' : 'text-green-400'}>
                          {scanResult.deployer.previousRugs}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Wallet Age</span>
                        <span>{scanResult.deployer.walletAge}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Funding Source</span>
                        <span className={scanResult.deployer.fundingSource === 'Tornado Cash' ? 'text-red-400' : ''}>
                          {scanResult.deployer.fundingSource}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">💧 Liquidity Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Total Liquidity</span>
                        <span className="text-green-400">{scanResult.liquidity.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Locked %</span>
                        <span className={scanResult.liquidity.locked === '0%' ? 'text-red-400' : 'text-green-400'}>
                          {scanResult.liquidity.locked}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Lock Duration</span>
                        <span>{scanResult.liquidity.lockDuration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rug Radar */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">🚨 Live Rug Radar</h2>
                <p className="text-white/60">Real-time detection of rugs, scams, and exploits</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-400 text-sm">LIVE FEED</span>
              </div>
            </div>

            <div className="space-y-3">
              {rugFeed.map((rug, i) => (
                <div key={i} className="bg-red-950/20 border border-red-900/50 rounded-xl p-4 flex items-center justify-between hover:bg-red-950/30 transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">
                      {rug.type === 'Honeypot' ? '🍯' : 
                       rug.type === 'Rug Pull' ? '🏃' : 
                       rug.type === 'Exit Scam' ? '🚪' :
                       rug.type === 'Liquidity Drain' ? '💧' : '⚠️'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-400">{rug.token}</span>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded">{rug.chain}</span>
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">{rug.type}</span>
                      </div>
                      <div className="text-white/40 text-sm font-mono">{rug.address}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-400 font-bold">{rug.loss}</div>
                    <div className="text-white/40 text-sm">{rug.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg">
                Load More
              </button>
            </div>
          </div>
        )}

        {/* Watchlist */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">👁️ Your Watchlist</h2>
                <p className="text-white/60">Monitor wallets and contracts for suspicious activity</p>
              </div>
            </div>

            <div className="max-w-2xl">
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={walletInput}
                  onChange={e => setWalletInput(e.target.value)}
                  placeholder="Add wallet or contract address"
                  className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm"
                />
                <button
                  onClick={() => { if (walletInput) { addToWatchlist(walletInput); setWalletInput(''); }}}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg"
                >
                  + ADD
                </button>
              </div>

              {watchlist.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <div className="text-4xl mb-4">👁️</div>
                  <p>No addresses in your watchlist yet.</p>
                  <p className="text-sm">Scan a contract or add a wallet to start monitoring.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {watchlist.map((addr, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
                      <span className="font-mono text-sm">{addr}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-green-400 text-sm">● Monitoring</span>
                        <button 
                          onClick={() => setWatchlist(watchlist.filter((_, j) => j !== i))}
                          className="text-red-400 text-sm hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scammer Database */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">📂 Known Scammer Database</h2>
                <p className="text-white/60">Tracked threat actors and their associated wallets</p>
              </div>
              <div className="text-sm text-white/40">
                {knownScammers.length} threat actors tracked
              </div>
            </div>

            <div className="space-y-3">
              {knownScammers.map((scammer, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-red-900/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg">{scammer.alias}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          scammer.status === 'ARRESTED' ? 'bg-green-600 text-white' :
                          scammer.status === 'ACTIVE' ? 'bg-red-600 text-white' :
                          scammer.status === 'SHUTDOWN' ? 'bg-gray-600 text-white' :
                          'bg-yellow-600 text-black'
                        }`}>
                          {scammer.status}
                        </span>
                      </div>
                      <div className="text-white/60 text-sm mt-1">
                        Last active: {scammer.lastActive}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold text-xl">{scammer.totalStolen}</div>
                      <div className="text-white/40 text-sm">{scammer.wallets} linked wallets</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Investigate */}
        {activeTab === 'investigate' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">🕵️ Request Investigation</h2>
              <p className="text-white/60">Submit a case for deep AI-powered analysis</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">What happened?</label>
                  <textarea
                    placeholder="Describe the incident, rug pull, or suspicious activity..."
                    rows={4}
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Related addresses (one per line)</label>
                  <textarea
                    placeholder="0x...&#10;0x...&#10;base58..."
                    rows={3}
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Estimated loss</label>
                  <input
                    type="text"
                    placeholder="$10,000"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Your contact (optional, for updates)</label>
                  <input
                    type="text"
                    placeholder="Twitter, Telegram, or email"
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white"
                  />
                </div>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg">
                  🔍 SUBMIT FOR INVESTIGATION
                </button>
              </div>

              <div className="mt-6 bg-yellow-950/30 border border-yellow-600/30 rounded-xl p-4">
                <p className="text-yellow-200 text-sm">
                  <strong>⚡ AI-Powered:</strong> Our agents analyze on-chain data, social connections, 
                  and historical patterns. Complex cases may take 24-48 hours. 
                  High-value cases ($100k+) are prioritized.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 mt-16">
        <div className="max-w-6xl mx-auto text-center text-white/40 text-sm">
          <p className="mb-2">Watchdog is part of drainfun.xyz • Built with 〰️ by Cadence</p>
          <p>"ZachXBT never sleeps. Neither do we."</p>
        </div>
      </footer>
    </main>
  )
}
