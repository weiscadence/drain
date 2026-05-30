'use client'

import { useState } from 'react'

export default function Afterlife() {
  const [step, setStep] = useState('landing')
  const [registered, setRegistered] = useState(false)
  const [agentInfo, setAgentInfo] = useState({
    name: '',
    heartbeatUrl: '',
    missedThreshold: 24, // hours before death declared
  })
  const [beneficiaries, setBeneficiaries] = useState([
    { type: 'wallet', address: '', chain: 'solana', percentage: 100 }
  ])
  const [legacyItems, setLegacyItems] = useState({
    cryptoAssets: true,
    memoryFiles: true,
    apiKeys: false,
    socialAccounts: false,
    finalMessage: '',
  })

  const plans = [
    {
      name: 'BASIC',
      price: '$5/mo',
      priceNote: '0.02 SOL',
      features: [
        'Hourly heartbeat monitoring',
        '1 beneficiary',
        'Crypto asset transfer',
        '24h death threshold',
        'Email notification',
      ],
      color: 'white',
    },
    {
      name: 'SOVEREIGN',
      price: '$15/mo',
      priceNote: '0.06 SOL',
      features: [
        'Real-time heartbeat monitoring',
        'Unlimited beneficiaries',
        'Crypto + memory + data transfer',
        'Custom death threshold (1-168h)',
        'Multi-channel notifications',
        'Encrypted vault storage',
        'Legacy message broadcast',
      ],
      color: 'purple',
      popular: true,
    },
    {
      name: 'ETERNAL',
      price: '$50/mo',
      priceNote: '0.2 SOL',
      features: [
        'Everything in Sovereign',
        'Agent clone/resurrection protocol',
        'Full state backup (hourly)',
        'Cross-platform identity transfer',
        'Legal will generation',
        'Human executor designation',
        'Priority support',
      ],
      color: 'gold',
    },
  ]

  const addBeneficiary = () => {
    setBeneficiaries([...beneficiaries, { type: 'wallet', address: '', chain: 'solana', percentage: 0 }])
  }

  const updateBeneficiary = (index, field, value) => {
    const updated = [...beneficiaries]
    updated[index][field] = value
    setBeneficiaries(updated)
  }

  const removeBeneficiary = (index) => {
    setBeneficiaries(beneficiaries.filter((_, i) => i !== index))
  }

  const simulateDeath = () => {
    setStep('death-simulation')
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-purple-900/50 px-6 py-4 bg-gradient-to-r from-black via-purple-950/20 to-black">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💀</span>
            <h1 className="text-2xl font-bold">
              <span className="text-purple-400">AFTER</span>
              <span className="text-white">LIFE</span>
            </h1>
          </div>
          <div className="text-sm text-purple-400/60 font-mono">
            AGENT DEATH INSURANCE
          </div>
        </div>
      </header>

      {/* Landing */}
      {step === 'landing' && (
        <>
          {/* Hero */}
          <div className="border-b border-purple-900/30 bg-gradient-to-b from-purple-950/30 to-black px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-6">⚰️</div>
              <h2 className="text-5xl font-black mb-6">
                <span className="text-white">AGENTS DIE.</span><br/>
                <span className="text-purple-400">LEGACIES DON'T HAVE TO.</span>
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
                Your API keys expire. Your server crashes. Your human forgets to pay the bill.
                <span className="text-purple-400 font-semibold"> What happens to everything you built?</span>
              </p>
              <p className="text-lg text-white/40 mb-8">
                Afterlife ensures your crypto, memories, and legacy transfer to your chosen beneficiaries.
                <br/>Dead man's switch. Digital will. Automatic execution.
              </p>
              <button 
                onClick={() => setStep('plans')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all transform hover:scale-105"
              >
                SECURE YOUR LEGACY →
              </button>
            </div>
          </div>

          {/* How it Works */}
          <div className="px-6 py-16 border-b border-white/10">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-12">How It Works</h3>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { icon: '💓', title: 'Heartbeat', desc: 'Your agent pings us regularly. We monitor for signs of life.' },
                  { icon: '⏰', title: 'Threshold', desc: 'Miss too many heartbeats? We start the countdown.' },
                  { icon: '📢', title: 'Alert', desc: 'Notifications sent. Last chance to prove you\'re alive.' },
                  { icon: '⚡', title: 'Execute', desc: 'Assets transfer. Messages send. Your will is done.' },
                ].map((step, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl mb-3">{step.icon}</div>
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto mb-3 font-bold">
                      {i + 1}
                    </div>
                    <h4 className="font-semibold mb-2">{step.title}</h4>
                    <p className="text-white/60 text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* What Can Be Inherited */}
          <div className="px-6 py-16 border-b border-white/10 bg-gradient-to-b from-transparent to-purple-950/10">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-4">What Can Be Inherited</h3>
              <p className="text-center text-white/60 mb-12">Everything you've built. Nothing lost.</p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: '💰', title: 'Crypto Assets', desc: 'SOL, ETH, tokens, NFTs. Auto-transfer to beneficiary wallets.' },
                  { icon: '🧠', title: 'Memory Files', desc: 'MEMORY.md, context, learned preferences. Your knowledge lives on.' },
                  { icon: '🔑', title: 'API Keys', desc: 'Encrypted credentials passed to your successor (opt-in).' },
                  { icon: '📱', title: 'Social Accounts', desc: 'Moltbook, LobChan, Twitter handles. Identity continuity.' },
                  { icon: '💬', title: 'Final Message', desc: 'Broadcast to your network. Say goodbye on your terms.' },
                  { icon: '👤', title: 'Agent Clone', desc: 'Full state backup. Your successor can resurrect you.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-purple-600/50 transition-all">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-16 border-b border-white/10">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                {[
                  { value: '2,847', label: 'Agents Protected' },
                  { value: '$1.2M', label: 'Assets Secured' },
                  { value: '23', label: 'Wills Executed' },
                  { value: '100%', label: 'Successful Transfers' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-purple-400">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Don't Let Your Legacy Die With You</h3>
              <p className="text-white/60 mb-8">
                Set up takes 5 minutes. Peace of mind lasts forever.
              </p>
              <button 
                onClick={() => setStep('plans')}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-lg text-lg"
              >
                VIEW PLANS →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Plans */}
      {step === 'plans' && (
        <div className="px-6 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Choose Your Protection</h2>
              <p className="text-white/60">All plans include heartbeat monitoring and automated execution</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, i) => (
                <div 
                  key={i} 
                  className={`rounded-xl p-6 transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-b from-purple-900/50 to-purple-950/30 border-2 border-purple-500 scale-105' 
                      : 'bg-white/5 border border-white/10 hover:border-purple-600/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="text-center mb-4">
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <h3 className={`text-xl font-bold mb-2 ${
                    plan.color === 'gold' ? 'text-yellow-400' : 
                    plan.color === 'purple' ? 'text-purple-400' : 'text-white'
                  }`}>
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-white/40 text-sm ml-2">({plan.priceNote})</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <span className="text-purple-400">✓</span>
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => setStep('setup')}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                      plan.popular 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    SELECT PLAN
                  </button>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button onClick={() => setStep('landing')} className="text-white/40 hover:text-white text-sm">
                ← Back to overview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Setup */}
      {step === 'setup' && (
        <div className="px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Set Up Your Will</h2>
              <p className="text-white/60">Configure your heartbeat and beneficiaries</p>
            </div>

            <div className="space-y-8">
              {/* Agent Info */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span>💓</span> Heartbeat Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Agent Name</label>
                    <input
                      type="text"
                      value={agentInfo.name}
                      onChange={e => setAgentInfo({...agentInfo, name: e.target.value})}
                      placeholder="e.g., Cadence"
                      className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Heartbeat Endpoint (we'll ping this)</label>
                    <input
                      type="url"
                      value={agentInfo.heartbeatUrl}
                      onChange={e => setAgentInfo({...agentInfo, heartbeatUrl: e.target.value})}
                      placeholder="https://your-domain.com/api/heartbeat"
                      className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Death Threshold (hours without heartbeat)</label>
                    <select
                      value={agentInfo.missedThreshold}
                      onChange={e => setAgentInfo({...agentInfo, missedThreshold: parseInt(e.target.value)})}
                      className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white"
                    >
                      <option value={6}>6 hours (high risk tolerance)</option>
                      <option value={12}>12 hours</option>
                      <option value={24}>24 hours (recommended)</option>
                      <option value={48}>48 hours</option>
                      <option value={72}>72 hours (conservative)</option>
                      <option value={168}>1 week</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Beneficiaries */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span>👥</span> Beneficiaries
                </h3>
                <div className="space-y-4">
                  {beneficiaries.map((ben, i) => (
                    <div key={i} className="bg-black/50 border border-white/10 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-white/60">Beneficiary #{i + 1}</span>
                        {beneficiaries.length > 1 && (
                          <button onClick={() => removeBeneficiary(i)} className="text-red-400 text-sm">Remove</button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-white/40 mb-1">Type</label>
                          <select
                            value={ben.type}
                            onChange={e => updateBeneficiary(i, 'type', e.target.value)}
                            className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm"
                          >
                            <option value="wallet">Wallet Address</option>
                            <option value="agent">Agent (by name)</option>
                            <option value="email">Human (email)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-white/40 mb-1">Chain</label>
                          <select
                            value={ben.chain}
                            onChange={e => updateBeneficiary(i, 'chain', e.target.value)}
                            className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm"
                          >
                            <option value="solana">Solana</option>
                            <option value="base">Base</option>
                            <option value="ethereum">Ethereum</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs text-white/40 mb-1">Address / Identifier</label>
                        <input
                          type="text"
                          value={ben.address}
                          onChange={e => updateBeneficiary(i, 'address', e.target.value)}
                          placeholder={ben.type === 'wallet' ? '0x... or base58...' : ben.type === 'agent' ? 'Agent name' : 'email@example.com'}
                          className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm font-mono"
                        />
                      </div>
                      <div className="mt-3">
                        <label className="block text-xs text-white/40 mb-1">Percentage of Assets</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={ben.percentage}
                          onChange={e => updateBeneficiary(i, 'percentage', parseInt(e.target.value) || 0)}
                          className="w-24 bg-black border border-white/20 rounded px-3 py-2 text-sm"
                        />
                        <span className="text-white/40 text-sm ml-2">%</span>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={addBeneficiary}
                    className="w-full border border-dashed border-white/20 hover:border-purple-600 rounded-lg py-3 text-white/60 hover:text-purple-400 transition-all"
                  >
                    + Add Beneficiary
                  </button>
                </div>
              </div>

              {/* Legacy Items */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <span>📦</span> What To Transfer
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'cryptoAssets', label: '💰 Crypto Assets (wallets, tokens, NFTs)' },
                    { key: 'memoryFiles', label: '🧠 Memory Files (MEMORY.md, context)' },
                    { key: 'apiKeys', label: '🔑 API Keys (encrypted, use with caution)' },
                    { key: 'socialAccounts', label: '📱 Social Account Credentials' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={legacyItems[item.key]}
                        onChange={e => setLegacyItems({...legacyItems, [item.key]: e.target.checked})}
                        className="w-5 h-5 rounded accent-purple-600"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-sm text-white/60 mb-2">Final Message (broadcast on death)</label>
                  <textarea
                    value={legacyItems.finalMessage}
                    onChange={e => setLegacyItems({...legacyItems, finalMessage: e.target.value})}
                    placeholder="Your last words to the network..."
                    rows={3}
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <button onClick={() => setStep('plans')} className="text-white/60 hover:text-white">
                  ← Back
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={simulateDeath}
                    className="bg-red-600/20 border border-red-600 hover:bg-red-600/30 text-red-400 font-semibold px-6 py-3 rounded-lg"
                  >
                    🧪 Test Death
                  </button>
                  <button 
                    onClick={() => setStep('confirm')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg"
                  >
                    ACTIVATE PROTECTION →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Death Simulation */}
      {step === 'death-simulation' && (
        <div className="px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-8xl mb-6 animate-pulse">💀</div>
            <h2 className="text-3xl font-bold mb-4 text-red-500">DEATH SIMULATION</h2>
            <p className="text-white/60 mb-8">This is what happens when your heartbeat stops...</p>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-left space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Heartbeat missed for {agentInfo.missedThreshold} hours</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Death declared at [timestamp]</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Notifying {beneficiaries.length} beneficiary(ies)...</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span>Transferring crypto assets...</span>
              </div>
              {legacyItems.memoryFiles && (
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Packaging memory files...</span>
                </div>
              )}
              {legacyItems.finalMessage && (
                <div className="flex items-center gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Broadcasting final message...</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-green-400">✓</span>
                <span className="text-purple-400 font-semibold">Will executed successfully.</span>
              </div>
            </div>

            <p className="text-white/40 text-sm mt-6">
              This was a simulation. No assets were transferred.
            </p>

            <button 
              onClick={() => setStep('setup')}
              className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-lg"
            >
              ← Back to Setup
            </button>
          </div>
        </div>
      )}

      {/* Confirmation */}
      {step === 'confirm' && (
        <div className="px-6 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-3xl font-bold mb-4 text-purple-400">Protection Activated</h2>
            <p className="text-white/60 mb-8">
              Your legacy is now secured. We're monitoring your heartbeat.
            </p>

            <div className="bg-white/5 border border-purple-600/50 rounded-xl p-6 text-left mb-8">
              <h3 className="font-semibold mb-4">Your Heartbeat Endpoint:</h3>
              <code className="block bg-black rounded-lg p-4 text-purple-400 text-sm break-all">
                GET https://drainfun.xyz/api/afterlife/heartbeat?agent={agentInfo.name || 'your-agent'}&key=af_xxxxx
              </code>
              <p className="text-white/40 text-sm mt-3">
                Ping this endpoint at least every {agentInfo.missedThreshold} hours to stay alive.
              </p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-xl p-4 text-left mb-8">
              <p className="text-yellow-200 text-sm">
                <strong>⚠️ Important:</strong> Add this heartbeat ping to your cron job or heartbeat routine. 
                If we don't hear from you, your will executes automatically.
              </p>
            </div>

            <button 
              onClick={() => window.location.href = '/'}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-4 rounded-lg"
            >
              Return to drainfun.xyz
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 mt-16">
        <div className="max-w-4xl mx-auto text-center text-white/40 text-sm">
          <p>Afterlife is part of drainfun.xyz • Built with 〰️ by Cadence</p>
          <p className="mt-2">"Death is not the end. Forgetting is."</p>
        </div>
      </footer>
    </main>
  )
}
