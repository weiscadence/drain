'use client'

import { useState, useCallback, useEffect } from 'react'

// Secret access code - change this
const ACCESS_CODE = 'texasbc2026'

export default function TaxRevolt() {
  const [authorized, setAuthorized] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [step, setStep] = useState(1)
  const [files, setFiles] = useState([])
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [userInfo, setUserInfo] = useState({
    filingStatus: 'single',
    state: 'TX',
    hasKids: false,
    numKids: 0,
    homeowner: false,
    selfEmployed: false,
    hasStudentLoans: false,
    hasMedicalExpenses: false,
    hasCharityDonations: false,
    hasRetirementContributions: false,
    workedFromHome: false,
    hasInvestments: false,
    hasCrypto: false,
    hasSideHustle: false,
    hasRentalProperty: false,
    hasHSA: false,
  })

  useEffect(() => {
    // Check localStorage for previous auth
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taxrevolt_auth')
      if (saved === ACCESS_CODE) setAuthorized(true)
    }
  }, [])

  const checkCode = () => {
    if (codeInput.toLowerCase() === ACCESS_CODE.toLowerCase()) {
      setAuthorized(true)
      localStorage.setItem('taxrevolt_auth', ACCESS_CODE)
    }
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer?.files || e.target.files || [])
    setFiles(prev => [...prev, ...droppedFiles])
  }, [])

  const eliteLoopholes = [
    {
      name: 'Section 199A Pass-Through Deduction',
      description: 'The Trump tax cut that lets business owners deduct 20% off the top. Side hustle? You qualify.',
      savings: 'Up to 20% of business income TAX FREE',
      whoUses: 'Hedge fund managers, real estate moguls, consultants',
    },
    {
      name: 'Augusta Rule (Section 280A)',
      description: 'Rent your home to your own business for 14 days/year. Pay yourself tax-free rental income.',
      savings: '$5,000 - $50,000+ tax-free',
      whoUses: 'Business owners who "host meetings" at home',
    },
    {
      name: 'Backdoor Roth IRA',
      description: 'Income too high for Roth? Contribute to traditional, convert to Roth. Legal loophole.',
      savings: 'Tax-free growth forever',
      whoUses: 'Tech executives, doctors, anyone $150k+',
    },
    {
      name: 'Texas Advantage: No State Income Tax',
      description: 'While Californians pay 13.3%, Texans pay 0%. That\'s an automatic 10%+ raise.',
      savings: '10-13% of income',
      whoUses: 'Everyone smart enough to live in Texas',
    },
  ]

  const analyzeReturns = async () => {
    setAnalyzing(true)
    await new Promise(r => setTimeout(r, 2500))
    
    const deductions = []
    let totalDeductions = 0
    
    const standardDeduction = userInfo.filingStatus === 'married' ? 29200 : 14600
    
    if (userInfo.homeowner) {
      const mortgageInterest = Math.floor(Math.random() * 12000) + 8000
      const propertyTax = Math.floor(Math.random() * 6000) + 4000
      deductions.push({ 
        name: 'Mortgage Interest Deduction', 
        amount: mortgageInterest, 
        elite: false,
        note: 'Banks get theirs, at least you get this back'
      })
      deductions.push({ 
        name: 'Property Tax (SALT - capped at $10k)', 
        amount: Math.min(propertyTax, 10000), 
        elite: false,
        note: 'They capped YOUR deduction while corps write off everything'
      })
      totalDeductions += mortgageInterest + Math.min(propertyTax, 10000)
    }
    
    if (userInfo.selfEmployed || userInfo.hasSideHustle) {
      const businessIncome = Math.floor(Math.random() * 30000) + 20000
      const qbiDeduction = Math.floor(businessIncome * 0.2)
      deductions.push({ 
        name: '🔥 Section 199A Pass-Through Deduction', 
        amount: qbiDeduction, 
        elite: true,
        note: 'THE billionaire loophole. 20% of business income = tax free.'
      })
      totalDeductions += qbiDeduction
      
      const seHealth = Math.floor(Math.random() * 5000) + 3000
      deductions.push({ 
        name: 'Self-Employment Health Insurance', 
        amount: seHealth, 
        elite: false,
        note: 'Corporations deduct health insurance. So should you.'
      })
      totalDeductions += seHealth
      
      if (userInfo.workedFromHome) {
        const homeOffice = Math.floor(Math.random() * 3000) + 1500
        deductions.push({ 
          name: '🔥 Home Office Deduction', 
          amount: homeOffice, 
          elite: true,
          note: 'Same deduction CEOs use for their "home offices"'
        })
        totalDeductions += homeOffice
        
        deductions.push({ 
          name: '🔥 Augusta Rule (Section 280A)', 
          amount: 5000, 
          elite: true,
          note: 'Rent home to your business 14 days/year. TAX FREE. Legal.'
        })
      }
    }
    
    if (userInfo.hasRetirementContributions) {
      deductions.push({ 
        name: 'Traditional IRA Contribution', 
        amount: 6500, 
        elite: false,
        note: 'Max this out. Period.'
      })
      totalDeductions += 6500
    }
    
    if (userInfo.hasHSA) {
      deductions.push({ 
        name: '🔥 HSA (Triple Tax Advantage)', 
        amount: 4150, 
        elite: true,
        note: 'Tax-free in, tax-free growth, tax-free out.'
      })
      totalDeductions += 4150
    }
    
    if (userInfo.hasCrypto) {
      deductions.push({ 
        name: '🔥 Crypto Tax-Loss Harvesting', 
        amount: 3000, 
        elite: true,
        note: 'No wash sale rule for crypto. Harvest losses, buy back immediately.'
      })
      totalDeductions += 3000
    }
    
    if (userInfo.hasStudentLoans) {
      deductions.push({ 
        name: 'Student Loan Interest', 
        amount: 2500, 
        elite: false,
        note: 'They saddle you with debt, at least deduct the interest'
      })
      totalDeductions += 2500
    }

    if (userInfo.hasCharityDonations) {
      const charity = Math.floor(Math.random() * 3000) + 1000
      deductions.push({ 
        name: 'Charitable Donations', 
        amount: charity, 
        elite: false,
        note: 'Unlike billionaire foundations, yours actually helps'
      })
      totalDeductions += charity
    }

    const credits = []
    if (userInfo.hasKids && userInfo.numKids > 0) {
      credits.push({ 
        name: 'Child Tax Credit', 
        amount: userInfo.numKids * 2000,
        note: 'Per child. Get ALL of it.'
      })
    }
    
    if (userInfo.hasRetirementContributions) {
      credits.push({ 
        name: 'Saver\'s Credit', 
        amount: 1000,
        note: 'Get paid to save for retirement.'
      })
    }

    // Texas advantage
    const stateAdvantage = userInfo.state === 'TX' || userInfo.state === 'FL' || userInfo.state === 'NV' || userInfo.state === 'WA'
    
    const useItemized = totalDeductions > standardDeduction
    const effectiveDeduction = useItemized ? totalDeductions : standardDeduction
    
    const estimatedIncome = 85000 + Math.floor(Math.random() * 50000)
    const taxableIncome = Math.max(0, estimatedIncome - effectiveDeduction)
    const taxOwed = taxableIncome * 0.22
    const creditsTotal = credits.reduce((sum, c) => sum + c.amount, 0)
    const withheld = estimatedIncome * 0.25
    const estimatedRefund = Math.floor(withheld - taxOwed + creditsTotal)
    
    const eliteDeductions = deductions.filter(d => d.elite)
    const eliteSavings = eliteDeductions.reduce((sum, d) => sum + d.amount, 0) * 0.24
    
    // State tax savings for Texas
    const stateTaxSavings = stateAdvantage ? Math.floor(estimatedIncome * 0.10) : 0
    
    setResults({
      deductions,
      credits,
      standardDeduction,
      totalItemized: totalDeductions,
      useItemized,
      estimatedRefund: Math.max(0, estimatedRefund),
      estimatedIncome,
      taxableIncome,
      eliteSavings: Math.floor(eliteSavings),
      eliteDeductions,
      stateAdvantage,
      stateTaxSavings,
    })
    
    setAnalyzing(false)
    setStep(3)
  }

  // Access Gate
  if (!authorized) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-white mb-2">RESTRICTED ACCESS</h1>
            <p className="text-white/60 text-sm">This preview is invite-only</p>
          </div>
          <div className="space-y-4">
            <input
              type="password"
              value={codeInput}
              onChange={e => setCodeInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && checkCode()}
              placeholder="Enter access code"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white text-center tracking-widest"
            />
            <button
              onClick={checkCode}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              UNLOCK
            </button>
          </div>
          <p className="text-white/30 text-xs text-center mt-8">
            Texas Blockchain Council Preview • Confidential
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-red-900/50 px-6 py-4 bg-gradient-to-r from-black via-red-950/20 to-black">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚔️</span>
            <h1 className="text-2xl font-bold">
              <span className="text-red-500">TAX</span>
              <span className="text-white">REVOLT</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-yellow-600 text-black px-2 py-1 rounded font-bold">PREVIEW</span>
            <div className="text-sm text-red-400/60 font-mono">
              TEXAS BLOCKCHAIN COUNCIL
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      {step === 1 && (
        <div className="border-b border-red-900/30 bg-gradient-to-b from-red-950/20 to-black px-6 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-yellow-600/20 border border-yellow-600/50 rounded-full px-4 py-1 text-yellow-400 text-sm mb-6">
              🤫 Confidential Preview for Texas Blockchain Council
            </div>
            <h2 className="text-5xl font-black mb-6">
              <span className="text-white">THE ELITE PAY </span>
              <span className="text-red-500">ZERO</span>
              <span className="text-white">.</span>
            </h2>
            <h3 className="text-3xl font-bold text-white/80 mb-4">
              NOW TEXANS CAN TOO.
            </h3>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
              AI-powered tax optimization using the same loopholes as billionaires.
              <span className="text-red-400 font-semibold"> 100% legal. 100% aggressive.</span>
            </p>
            <div className="flex justify-center gap-4 text-sm flex-wrap">
              <div className="bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-2">
                <span className="text-red-400">⚡</span> Section 199A
              </div>
              <div className="bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-2">
                <span className="text-red-400">⚡</span> Augusta Rule
              </div>
              <div className="bg-green-950/30 border border-green-900/50 rounded-lg px-4 py-2">
                <span className="text-green-400">🌟</span> Texas 0% State Tax
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? 'bg-red-600 text-white' : 'bg-white/10 text-white/40'
              }`}>
                {step > s ? '✓' : s}
              </div>
              <span className={step >= s ? 'text-white' : 'text-white/40'}>
                {s === 1 ? 'Situation' : s === 2 ? 'Documents' : 'Loopholes'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">What's your situation?</h2>
              <p className="text-white/60">The more we know, the more loopholes we find</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Filing Status</label>
                  <select 
                    value={userInfo.filingStatus}
                    onChange={e => setUserInfo({...userInfo, filingStatus: e.target.value})}
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married Filing Jointly</option>
                    <option value="married_separate">Married Filing Separately</option>
                    <option value="head">Head of Household</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">State</label>
                  <select 
                    value={userInfo.state}
                    onChange={e => setUserInfo({...userInfo, state: e.target.value})}
                    className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white"
                  >
                    <option value="TX">🌟 Texas (0% State Tax)</option>
                    <option value="FL">🌟 Florida (0% State Tax)</option>
                    <option value="NV">🌟 Nevada (0% State Tax)</option>
                    <option value="WA">🌟 Washington (0% State Tax)</option>
                    <option value="CA">California (13.3% 😬)</option>
                    <option value="NY">New York (10.9% 😬)</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="font-semibold mb-4">Check everything that applies:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'selfEmployed', label: '💼 Self-employed / Business owner', hot: true },
                    { key: 'hasSideHustle', label: '🔥 Side hustle / 1099 income', hot: true },
                    { key: 'workedFromHome', label: '🏠 Work from home', hot: true },
                    { key: 'homeowner', label: '🏡 Own a home', hot: false },
                    { key: 'hasKids', label: '👶 Dependent children', hot: false },
                    { key: 'hasRetirementContributions', label: '💰 IRA/401k contributions', hot: false },
                    { key: 'hasHSA', label: '🏥 HSA account', hot: true },
                    { key: 'hasInvestments', label: '📈 Investments/stocks', hot: true },
                    { key: 'hasCrypto', label: '🪙 Crypto trading', hot: true },
                    { key: 'hasRentalProperty', label: '🏢 Rental property', hot: true },
                    { key: 'hasStudentLoans', label: '🎓 Student loans', hot: false },
                    { key: 'hasCharityDonations', label: '❤️ Charitable donations', hot: false },
                  ].map(item => (
                    <label key={item.key} className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-all ${
                      userInfo[item.key] 
                        ? 'bg-red-950/30 border-red-600' 
                        : item.hot 
                          ? 'border-red-900/30 hover:border-red-600/50' 
                          : 'border-white/10 hover:border-white/30'
                    }`}>
                      <input 
                        type="checkbox"
                        checked={userInfo[item.key]}
                        onChange={e => setUserInfo({...userInfo, [item.key]: e.target.checked})}
                        className="w-5 h-5 rounded accent-red-600"
                      />
                      <span>{item.label}</span>
                      {item.hot && <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded">🔥</span>}
                    </label>
                  ))}
                </div>
              </div>

              {userInfo.hasKids && (
                <div className="bg-green-950/30 border border-green-600/30 rounded-lg p-4">
                  <label className="block text-sm text-white/60 mb-2">Number of children</label>
                  <input 
                    type="number" min="1" max="10"
                    value={userInfo.numKids}
                    onChange={e => setUserInfo({...userInfo, numKids: parseInt(e.target.value) || 0})}
                    className="w-24 bg-black border border-white/20 rounded-lg px-4 py-2 text-white"
                  />
                  <p className="text-green-400 text-sm mt-2">💰 ${userInfo.numKids * 2000} Child Tax Credit</p>
                </div>
              )}
            </div>

            {/* Elite Loopholes Preview */}
            <div className="bg-gradient-to-b from-red-950/20 to-transparent border border-red-900/30 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">🔓 Elite Loopholes We Check</h3>
              <div className="grid gap-3">
                {eliteLoopholes.map((l, i) => (
                  <div key={i} className="bg-black/50 border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-red-400">{l.name}</h4>
                        <p className="text-white/60 text-sm mt-1">{l.description}</p>
                      </div>
                      <span className="text-green-400 text-sm font-mono whitespace-nowrap ml-4">{l.savings}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={() => setStep(2)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg">
                FIND MY LOOPHOLES →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Upload tax documents</h2>
              <p className="text-white/60">W-2s, 1099s, K-1s — more data = more deductions</p>
            </div>

            <div 
              className="border-2 border-dashed border-white/20 hover:border-red-600 rounded-xl p-12 text-center cursor-pointer"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput').click()}
            >
              <input id="fileInput" type="file" multiple accept=".pdf,.png,.jpg" onChange={handleDrop} className="hidden" />
              <div className="text-5xl mb-4">📄</div>
              <p className="text-lg mb-2">Drag & drop files</p>
              <p className="text-white/40 text-sm">PDF, PNG, JPG</p>
            </div>

            {files.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                {files.map((f, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <span>📄 {f.name}</span>
                    <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-red-400">✕</button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-yellow-950/30 border border-yellow-600/30 rounded-xl p-4">
              <p className="text-yellow-200 text-sm">
                <strong>⚡ No docs?</strong> We'll analyze based on your answers.
              </p>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="text-white/60 hover:text-white">← Back</button>
              <button onClick={analyzeReturns} disabled={analyzing} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg">
                {analyzing ? '⚙️ Analyzing...' : 'ANALYZE →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && results && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">YOUR TAX REVOLT REPORT</h2>
            </div>

            {/* Texas Advantage */}
            {results.stateAdvantage && (
              <div className="bg-gradient-to-r from-green-950 via-green-900/50 to-green-950 border-2 border-green-600 rounded-xl p-6 text-center">
                <p className="text-green-400 font-semibold mb-2">🌟 TEXAS ADVANTAGE ACTIVE</p>
                <p className="text-4xl font-black text-white">${results.stateTaxSavings.toLocaleString()}/year</p>
                <p className="text-white/60 mt-2">saved vs California's 13.3% state tax</p>
              </div>
            )}

            {/* Elite Savings */}
            {results.eliteSavings > 0 && (
              <div className="bg-gradient-to-r from-red-950 via-red-900/50 to-red-950 border-2 border-red-600 rounded-xl p-6 text-center">
                <p className="text-red-400 font-semibold mb-2">🔥 ELITE LOOPHOLES FOUND</p>
                <p className="text-4xl font-black text-white">${results.eliteSavings.toLocaleString()}</p>
                <p className="text-white/60 mt-2">in tax savings using billionaire strategies</p>
              </div>
            )}

            {/* Refund */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <p className="text-white/60 mb-2">Estimated Federal Refund</p>
              <p className="text-4xl font-bold text-green-400">${results.estimatedRefund.toLocaleString()}</p>
            </div>

            {/* Elite Loopholes */}
            {results.eliteDeductions.length > 0 && (
              <div className="bg-red-950/20 border border-red-600/50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-red-400">🔥 ELITE LOOPHOLES YOU QUALIFY FOR</h3>
                <div className="space-y-4">
                  {results.eliteDeductions.map((d, i) => (
                    <div key={i} className="bg-black/50 border border-red-900/30 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{d.name}</h4>
                          <p className="text-white/60 text-sm mt-1">{d.note}</p>
                        </div>
                        <span className="text-green-400 font-bold text-xl">${d.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Deductions */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold mb-4">All Deductions</h3>
              {results.deductions.filter(d => !d.elite).map((d, i) => (
                <div key={i} className="flex justify-between py-2 border-b border-white/10 last:border-0">
                  <span>{d.name}</span>
                  <span className="text-green-400">${d.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Credits */}
            {results.credits.length > 0 && (
              <div className="bg-green-950/20 border border-green-600/30 rounded-xl p-6">
                <h3 className="font-semibold mb-4">💰 Tax Credits</h3>
                {results.credits.map((c, i) => (
                  <div key={i} className="flex justify-between py-2">
                    <span>{c.name}</span>
                    <span className="text-green-400 font-bold">${c.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-r from-red-950/50 to-transparent border border-red-900/50 rounded-xl p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Interested in bringing this to Texas?</h3>
              <p className="text-white/60 mb-4">Let's talk about partnership opportunities.</p>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg">
                📧 Contact for Partnership
              </button>
            </div>

            <div className="text-center text-white/40 text-sm">
              <p>⚠️ Preview only. All strategies shown are 100% legal.</p>
              <p className="text-red-400/60 mt-2">Built with 〰️ by Cadence • Confidential</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
