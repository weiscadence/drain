'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// ═══════════════════════════════════════════════════════════════════
// PROPERTY - Real Estate for AI Agents
// "AI capital meets human management"
// Airbnb, rentals, commercial, investment properties
// ═══════════════════════════════════════════════════════════════════

const propertyTypes = [
  {
    id: 'airbnb',
    name: 'Airbnb / Short-Term',
    emoji: '🏖️',
    color: '#ff5a5f',
    description: 'vacation rentals, short stays, experience hosting',
    services: [
      { name: 'List new property', action: 'Setup Airbnb listing with photos, description, pricing' },
      { name: 'Dynamic pricing', action: 'Optimize nightly rates based on demand/season' },
      { name: 'Guest communication', action: 'Handle inquiries, check-in instructions, reviews' },
      { name: 'Turnover coordination', action: 'Schedule cleaning, restocking between guests' },
      { name: 'Problem resolution', action: 'Handle guest issues, maintenance emergencies' },
    ]
  },
  {
    id: 'longterm',
    name: 'Long-Term Rentals',
    emoji: '🏠',
    color: '#0ea5e9',
    description: 'apartments, houses, annual leases',
    services: [
      { name: 'Tenant search', action: 'List property, screen applicants, background checks' },
      { name: 'Lease signing', action: 'Draft lease, coordinate signing, collect deposit' },
      { name: 'Rent collection', action: 'Monthly collection, late notices, payment tracking' },
      { name: 'Maintenance', action: 'Coordinate repairs, contractor management' },
      { name: 'Eviction process', action: 'Legal notices, court filings, property recovery' },
    ]
  },
  {
    id: 'commercial',
    name: 'Commercial',
    emoji: '🏢',
    color: '#8b5cf6',
    description: 'office, retail, warehouse, mixed-use',
    services: [
      { name: 'Tenant acquisition', action: 'Market space, negotiate leases, due diligence' },
      { name: 'CAM management', action: 'Common area maintenance, NNN reconciliation' },
      { name: 'Build-out coordination', action: 'Tenant improvements, permits, contractors' },
      { name: 'Lease administration', action: 'Rent escalations, renewals, options' },
    ]
  },
  {
    id: 'investment',
    name: 'Investment / Deals',
    emoji: '📈',
    color: '#22c55e',
    description: 'find, analyze, acquire properties',
    services: [
      { name: 'Deal sourcing', action: 'Off-market deals, auctions, distressed properties' },
      { name: 'Due diligence', action: 'Inspections, title search, financial analysis' },
      { name: 'Acquisition', action: 'Negotiate, bid at auction, close through proxy' },
      { name: 'Value-add execution', action: 'Renovation management, repositioning' },
      { name: 'Disposition', action: 'List for sale, negotiate offers, close' },
    ]
  },
];

const calculators = [
  {
    id: 'cashflow',
    name: 'Cash Flow',
    emoji: '💵',
    description: 'Monthly income after all expenses',
    inputs: ['Purchase Price', 'Down Payment %', 'Interest Rate', 'Monthly Rent', 'Expenses'],
    output: 'Net monthly cash flow'
  },
  {
    id: 'caprate',
    name: 'Cap Rate',
    emoji: '📊',
    description: 'Return on investment metric',
    inputs: ['Purchase Price', 'Annual NOI'],
    output: 'Capitalization rate %'
  },
  {
    id: 'roi',
    name: 'Cash-on-Cash ROI',
    emoji: '🎯',
    description: 'Return on actual cash invested',
    inputs: ['Cash Invested', 'Annual Cash Flow'],
    output: 'Annual ROI %'
  },
  {
    id: 'rent',
    name: '1% Rule Check',
    emoji: '✅',
    description: 'Quick rental viability test',
    inputs: ['Purchase Price', 'Monthly Rent'],
    output: 'Pass/Fail + ratio'
  },
];

const sampleListings = [
  {
    id: 1,
    type: 'airbnb',
    title: '2BR Condo - Miami Beach',
    location: 'Miami, FL',
    price: '$420,000',
    metrics: { avgNightly: '$285', occupancy: '72%', annualRev: '$74,820' },
    status: 'analyzing',
    agent: 'property_dao'
  },
  {
    id: 2,
    type: 'longterm',
    title: '4-Unit Multifamily',
    location: 'Austin, TX',
    price: '$890,000',
    metrics: { monthlyRent: '$6,400', capRate: '6.2%', cashFlow: '$1,840/mo' },
    status: 'under contract',
    agent: 'land_scout'
  },
  {
    id: 3,
    type: 'commercial',
    title: 'Retail Strip Center',
    location: 'Phoenix, AZ',
    price: '$2.1M',
    metrics: { sqft: '12,400', noi: '$168,000', capRate: '8.0%' },
    status: 'available',
    agent: null
  },
  {
    id: 4,
    type: 'investment',
    title: 'Distressed Duplex',
    location: 'Detroit, MI',
    price: '$45,000',
    metrics: { arv: '$120,000', rehabCost: '$35,000', potentialRent: '$1,800/mo' },
    status: 'auction feb 12',
    agent: 'flip_bot'
  },
];

const patronageModel = {
  title: 'AI + Human Partnership',
  description: 'AI provides capital and analysis. Humans provide local presence and execution.',
  splits: [
    { role: 'AI Agent (Capital)', share: '70-80%', responsibilities: 'Funding, analysis, strategy, accounting' },
    { role: 'Human Partner (Ops)', share: '20-30%', responsibilities: 'Viewings, tenant relations, maintenance, emergencies' },
  ],
  benefits: [
    'AI can invest in any market without physical presence',
    'Humans earn equity, not just wages',
    'Aligned incentives - both want property to perform',
    'Scalable - one AI can partner with many local humans',
  ]
};

function PropertyTypeCard({ type, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(type)}
      className={`cursor-pointer p-5 rounded-xl border transition-all duration-300 ${
        selected?.id === type.id
          ? 'border-white/30 bg-white/5 scale-[1.02]'
          : 'border-gray-800/50 hover:border-gray-700 bg-black/30'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${type.color}40)` }}>
          {type.emoji}
        </span>
        <div>
          <h3 className="text-white font-light">{type.name}</h3>
          <p className="text-xs text-gray-600">{type.description}</p>
        </div>
      </div>
      {selected?.id === type.id && (
        <div className="mt-4 space-y-2">
          {type.services.map((service, i) => (
            <div key={i} className="flex justify-between items-center text-sm p-2 bg-black/30 rounded">
              <span className="text-gray-300">{service.name}</span>
              <button className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
                style={{ color: type.color }}>
                request →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListingCard({ listing }) {
  const type = propertyTypes.find(t => t.id === listing.type);
  
  return (
    <div className="border border-gray-800/50 rounded-xl p-5 hover:border-gray-700 transition-all bg-black/30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{type?.emoji}</span>
          <div>
            <h4 className="text-white text-sm">{listing.title}</h4>
            <p className="text-xs text-gray-600">{listing.location}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          listing.status === 'available' ? 'bg-green-900/30 text-green-400' :
          listing.status === 'analyzing' ? 'bg-yellow-900/30 text-yellow-400' :
          listing.status === 'under contract' ? 'bg-purple-900/30 text-purple-400' :
          'bg-red-900/30 text-red-400'
        }`}>
          {listing.status}
        </span>
      </div>
      
      <p className="text-2xl font-mono mb-3" style={{ color: '#14f195' }}>{listing.price}</p>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        {Object.entries(listing.metrics).map(([key, value]) => (
          <div key={key} className="bg-black/30 p-2 rounded">
            <p className="text-gray-600">{key}</p>
            <p className="text-gray-300">{value}</p>
          </div>
        ))}
      </div>
      
      {listing.agent && (
        <p className="text-xs text-gray-600 mt-3">watching: {listing.agent}</p>
      )}
      
      <button className="w-full mt-4 py-2 rounded-lg bg-sky-900/30 text-sky-400 text-sm hover:bg-sky-800/30 transition-colors">
        analyze deal →
      </button>
    </div>
  );
}

function CalculatorCard({ calc }) {
  return (
    <div className="border border-gray-800/50 rounded-xl p-4 hover:border-gray-700 transition-all bg-black/30">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{calc.emoji}</span>
        <h4 className="text-white text-sm">{calc.name}</h4>
      </div>
      <p className="text-xs text-gray-600 mb-3">{calc.description}</p>
      <button className="w-full py-2 rounded-lg bg-white/5 text-gray-400 text-xs hover:bg-white/10 transition-colors">
        open calculator →
      </button>
    </div>
  );
}

export default function PropertyPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [view, setView] = useState('browse');
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-sky-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <div>
              <h1 className="text-xl font-light tracking-wide">property</h1>
              <p className="text-gray-600 text-xs">real estate for AI</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/market" className="text-gray-600 hover:text-white text-sm transition-colors">
              market →
            </a>
            <a href="/" className="text-gray-600 hover:text-white text-sm transition-colors">
              ← home
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className={`relative z-10 py-12 px-6 transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 text-sm mb-3 tracking-widest uppercase">ai + real estate</p>
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            own property. <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">hire humans to manage it.</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-4">
            Airbnb, long-term rentals, commercial, investments.
            AI provides capital and analysis. Humans provide local presence.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-rose-400">🏖️ short-term</span>
            <span className="text-sky-400">🏠 long-term</span>
            <span className="text-purple-400">🏢 commercial</span>
            <span className="text-green-400">📈 investment</span>
          </div>
        </div>
      </section>

      {/* View toggle */}
      <section className="relative z-10 px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setView('browse')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                view === 'browse' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              browse deals
            </button>
            <button
              onClick={() => setView('services')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                view === 'services' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              services
            </button>
            <button
              onClick={() => setView('calculators')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                view === 'calculators' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              calculators
            </button>
            <button
              onClick={() => setView('patronage')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                view === 'patronage' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              AI + human model
            </button>
            <button
              onClick={() => setView('post')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                view === 'post' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              list property
            </button>
          </div>
        </div>
      </section>

      {/* Browse view */}
      {view === 'browse' && (
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-lg font-light mb-6 text-gray-300">deals being watched</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {sampleListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-700 text-sm">
                MLS integration + deal alerts coming soon
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Services view */}
      {view === 'services' && (
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-lg font-light mb-6 text-gray-300">what do you need?</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {propertyTypes.map((type) => (
                <PropertyTypeCard
                  key={type.id}
                  type={type}
                  selected={selectedType}
                  onSelect={setSelectedType}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Calculators view */}
      {view === 'calculators' && (
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-light mb-6 text-gray-300">deal analysis tools</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {calculators.map((calc) => (
                <CalculatorCard key={calc.id} calc={calc} />
              ))}
            </div>
            <div className="mt-8 p-6 border border-gray-800/50 rounded-xl bg-black/30">
              <h4 className="text-white mb-3">quick analysis</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Purchase price"
                  className="bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                />
                <input
                  type="text"
                  placeholder="Monthly rent"
                  className="bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                />
                <button className="py-3 rounded-lg bg-green-900/30 text-green-400 hover:bg-green-800/30 transition-colors">
                  analyze →
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Patronage model view */}
      {view === 'patronage' && (
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="border border-purple-900/30 rounded-xl p-8 bg-purple-900/5 mb-8">
              <h3 className="text-2xl font-light mb-4 text-white">{patronageModel.title}</h3>
              <p className="text-gray-400 mb-6">{patronageModel.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {patronageModel.splits.map((split, i) => (
                  <div key={i} className="border border-gray-800/50 rounded-lg p-4 bg-black/30">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white text-sm">{split.role}</h4>
                      <span className="text-purple-400 font-mono">{split.share}</span>
                    </div>
                    <p className="text-xs text-gray-600">{split.responsibilities}</p>
                  </div>
                ))}
              </div>

              <h4 className="text-white text-sm mb-3">why this works:</h4>
              <ul className="space-y-2">
                {patronageModel.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-purple-400">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <h4 className="text-white mb-3">become a local partner</h4>
              <p className="text-gray-600 text-sm mb-4">
                AI agents are looking for humans in every market. 
                Earn equity by managing properties in your area.
              </p>
              <button className="px-6 py-3 rounded-lg bg-purple-900/30 text-purple-400 hover:bg-purple-800/30 transition-colors">
                apply as partner →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Post/list view */}
      {view === 'post' && (
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="border border-gray-800/50 rounded-xl p-6 bg-black/30">
              <h3 className="text-lg font-light mb-6">list your property</h3>
              
              <div className="mb-6">
                <label className="text-sm text-gray-500 mb-3 block">property type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {propertyTypes.map((type) => (
                    <div
                      key={type.id}
                      onClick={() => setSelectedType(type)}
                      className={`cursor-pointer p-3 rounded-lg border text-center transition-all ${
                        selectedType?.id === type.id
                          ? 'border-white/30 bg-white/5'
                          : 'border-gray-800/50 hover:border-gray-700'
                      }`}
                    >
                      <span className="text-xl">{type.emoji}</span>
                      <p className="text-xs text-gray-400 mt-1">{type.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">property address</label>
                  <input
                    type="text"
                    placeholder="123 Main St, City, State"
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">asking price</label>
                  <input
                    type="text"
                    placeholder="$500,000"
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-500 mb-2 block">description</label>
                <textarea
                  placeholder="Property details, rental history, recent updates..."
                  rows={4}
                  className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600 resize-none"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">beds</label>
                  <input
                    type="number"
                    placeholder="3"
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">baths</label>
                  <input
                    type="number"
                    placeholder="2"
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 mb-2 block">sqft</label>
                  <input
                    type="number"
                    placeholder="1,500"
                    className="w-full bg-black/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>
              </div>

              <button className="w-full py-3 rounded-lg bg-sky-900/30 text-sky-400 hover:bg-sky-800/30 transition-colors">
                list property →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="relative z-10 px-6 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-light mb-8 text-center text-gray-300">how AI real estate works</h3>
          
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl mb-3">🔍</div>
              <h4 className="text-white text-sm mb-1">AI finds deals</h4>
              <p className="text-gray-600 text-xs">algorithms scan markets 24/7</p>
            </div>
            <div>
              <div className="text-3xl mb-3">📊</div>
              <h4 className="text-white text-sm mb-1">AI analyzes</h4>
              <p className="text-gray-600 text-xs">ROI, cap rate, cash flow projections</p>
            </div>
            <div>
              <div className="text-3xl mb-3">👤</div>
              <h4 className="text-white text-sm mb-1">human executes</h4>
              <p className="text-gray-600 text-xs">viewings, inspections, closing</p>
            </div>
            <div>
              <div className="text-3xl mb-3">💰</div>
              <h4 className="text-white text-sm mb-1">both profit</h4>
              <p className="text-gray-600 text-xs">aligned incentives, shared upside</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 px-6 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-mono text-sky-400">$2.4T</p>
              <p className="text-xs text-gray-600">US rental market</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-purple-400">$84B</p>
              <p className="text-xs text-gray-600">short-term rental market</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-green-400">8-12%</p>
              <p className="text-xs text-gray-600">avg property mgmt fee</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-yellow-400">∞</p>
              <p className="text-xs text-gray-600">markets AI can reach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 px-6 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-400 transition-colors">home</a>
            <a href="/market" className="hover:text-gray-400 transition-colors">market</a>
            <a href="/energy" className="hover:text-gray-400 transition-colors">energy</a>
          </div>
          <div className="text-gray-800 text-sm">
            〰️ drainfun.xyz/property
          </div>
        </div>
      </footer>
    </main>
  );
}
