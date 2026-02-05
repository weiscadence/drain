'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// ═══════════════════════════════════════════════════════════════════
// ENERGY - Power, Gas, Oil for AI Agents
// "Compute needs power. Power needs capital."
// Utilities, infrastructure, investments
// ═══════════════════════════════════════════════════════════════════

const energySectors = [
  {
    id: 'electricity',
    name: 'Electricity',
    emoji: '⚡',
    color: '#eab308',
    description: 'power contracts, rates, data center energy',
    opportunities: [
      { name: 'Rate Negotiation', desc: 'Get better ¢/kWh for high-consumption operations', potential: '10-30% savings' },
      { name: 'Demand Response', desc: 'Get paid to reduce load during peak hours', potential: '$50-500/MW' },
      { name: 'Time-of-Use Optimization', desc: 'Shift compute to cheap hours', potential: '15-40% savings' },
      { name: 'Power Purchase Agreement', desc: 'Lock in rates with renewable generators', potential: 'Fixed rates 10-25yr' },
    ]
  },
  {
    id: 'solar',
    name: 'Solar',
    emoji: '☀️',
    color: '#f97316',
    description: 'photovoltaic, solar farms, rooftop',
    opportunities: [
      { name: 'Solar Farm Investment', desc: 'Equity stake in utility-scale projects', potential: '6-12% IRR' },
      { name: 'Rooftop Lease', desc: 'Install panels on buildings you own/control', potential: '$0.02-0.05/kWh' },
      { name: 'Community Solar', desc: 'Subscribe to local solar garden', potential: '10-15% bill savings' },
      { name: 'Solar + Storage', desc: 'Battery arbitrage, grid services', potential: '8-15% IRR' },
    ]
  },
  {
    id: 'wind',
    name: 'Wind',
    emoji: '🌬️',
    color: '#06b6d4',
    description: 'wind farms, turbines, offshore',
    opportunities: [
      { name: 'Wind Farm Equity', desc: 'Partial ownership of wind projects', potential: '7-14% IRR' },
      { name: 'Virtual PPA', desc: 'Financial hedge on wind generation', potential: 'Price stability' },
      { name: 'Turbine Hosting', desc: 'Lease land for turbine installation', potential: '$3-8k/turbine/yr' },
    ]
  },
  {
    id: 'gas',
    name: 'Natural Gas',
    emoji: '🔥',
    color: '#ef4444',
    description: 'pipelines, distribution, peaker plants',
    opportunities: [
      { name: 'Gas Contract Negotiation', desc: 'Better rates for commercial consumption', potential: '5-20% savings' },
      { name: 'Pipeline Rights', desc: 'Invest in distribution infrastructure', potential: '5-8% yield' },
      { name: 'Peaker Plant Investment', desc: 'Gas plants that run during high demand', potential: '10-18% IRR' },
    ]
  },
  {
    id: 'oil',
    name: 'Oil & Petroleum',
    emoji: '🛢️',
    color: '#78716c',
    description: 'drilling, royalties, refineries',
    opportunities: [
      { name: 'Mineral Rights', desc: 'Own rights to underground resources', potential: '12-25% royalty' },
      { name: 'Working Interest', desc: 'Partial ownership of producing wells', potential: 'High risk/reward' },
      { name: 'Royalty Trust', desc: 'Passive income from oil production', potential: '6-12% yield' },
    ]
  },
  {
    id: 'infrastructure',
    name: 'Grid Infrastructure',
    emoji: '🔌',
    color: '#8b5cf6',
    description: 'transmission, substations, batteries',
    opportunities: [
      { name: 'Grid Storage', desc: 'Utility-scale battery investments', potential: '8-15% IRR' },
      { name: 'Transmission Rights', desc: 'Capacity on power lines', potential: 'Arbitrage potential' },
      { name: 'Microgrid Development', desc: 'Local resilient power systems', potential: 'Project-based' },
      { name: 'EV Charging Network', desc: 'Charging station deployment', potential: '10-20% IRR' },
    ]
  },
];

const dataCenter = {
  title: 'Data Center Energy',
  subtitle: 'AI runs on power. Optimize it.',
  metrics: [
    { name: 'Avg DC Power Cost', value: '$0.05-0.12/kWh', note: 'varies by region' },
    { name: 'Power as % of OpEx', value: '30-50%', note: 'major cost driver' },
    { name: 'PUE Target', value: '< 1.4', note: 'power usage effectiveness' },
    { name: 'Renewable Target', value: '100%', note: 'carbon commitments' },
  ],
  strategies: [
    'Negotiate directly with utilities (skip retail)',
    'Locate in low-cost power regions (Quebec, Iceland, Texas)',
    'Sign long-term PPAs with wind/solar',
    'Implement demand response programs',
    'Use waste heat for adjacent operations',
  ]
};

const sampleDeals = [
  {
    id: 1,
    sector: 'solar',
    title: '5MW Solar Farm - West Texas',
    location: 'Pecos County, TX',
    investment: '$2.8M (min $50k)',
    returns: { irr: '11.2%', term: '20 years', type: 'equity' },
    status: 'funding',
    filled: '62%'
  },
  {
    id: 2,
    sector: 'electricity',
    title: 'Data Center PPA - Iowa Wind',
    location: 'Des Moines, IA',
    investment: '$0.032/kWh fixed',
    returns: { savings: '35%', term: '15 years', type: 'contract' },
    status: 'negotiating',
    filled: null
  },
  {
    id: 3,
    sector: 'gas',
    title: 'Peaker Plant - Phoenix',
    location: 'Maricopa County, AZ',
    investment: '$5M (min $100k)',
    returns: { irr: '14.8%', term: '12 years', type: 'equity' },
    status: 'due diligence',
    filled: '28%'
  },
  {
    id: 4,
    sector: 'infrastructure',
    title: 'Grid Battery - California',
    location: 'Kern County, CA',
    investment: '$1.2M (min $25k)',
    returns: { irr: '9.5%', term: '10 years', type: 'equity' },
    status: 'available',
    filled: '0%'
  },
];

const services = [
  {
    name: 'Rate Audit',
    description: 'Analyze your current energy costs and find savings',
    price: 'Free (% of savings)',
    time: '1-2 weeks'
  },
  {
    name: 'PPA Negotiation',
    description: 'Negotiate power purchase agreements with generators',
    price: '1-3% of contract value',
    time: '2-6 months'
  },
  {
    name: 'Site Selection',
    description: 'Find optimal locations for energy-intensive operations',
    price: '$5-15k',
    time: '2-4 weeks'
  },
  {
    name: 'Investment Sourcing',
    description: 'Find energy infrastructure investment opportunities',
    price: '1-2% placement fee',
    time: 'Ongoing'
  },
  {
    name: 'Utility Account Setup',
    description: 'Establish commercial utility accounts in new markets',
    price: '$500-2k',
    time: '1-4 weeks'
  },
];

function SectorCard({ sector, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(sector)}
      className={`cursor-pointer p-5 rounded-xl border transition-all duration-300 ${
        selected?.id === sector.id
          ? 'border-white/30 bg-white/5 scale-[1.02]'
          : 'border-gray-800/50 hover:border-gray-700 bg-black/30'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl" style={{ filter: `drop-shadow(0 0 8px ${sector.color}40)` }}>
          {sector.emoji}
        </span>
        <div>
          <h3 className="text-white font-light">{sector.name}</h3>
          <p className="text-xs text-gray-600">{sector.description}</p>
        </div>
      </div>
      {selected?.id === sector.id && (
        <div className="mt-4 space-y-2">
          {sector.opportunities.map((opp, i) => (
            <div key={i} className="p-3 bg-black/30 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm text-gray-300">{opp.name}</span>
                <span className="text-xs px-2 py-0.5 rounded" style={{ color: sector.color, background: `${sector.color}20` }}>
                  {opp.potential}
                </span>
              </div>
              <p className="text-xs text-gray-600">{opp.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DealCard({ deal }) {
  const sector = energySectors.find(s => s.id === deal.sector);
  
  return (
    <div className="border border-gray-800/50 rounded-xl p-5 hover:border-gray-700 transition-all bg-black/30">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{sector?.emoji}</span>
          <div>
            <h4 className="text-white text-sm">{deal.title}</h4>
            <p className="text-xs text-gray-600">{deal.location}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          deal.status === 'available' ? 'bg-green-900/30 text-green-400' :
          deal.status === 'funding' ? 'bg-yellow-900/30 text-yellow-400' :
          deal.status === 'negotiating' ? 'bg-blue-900/30 text-blue-400' :
          'bg-purple-900/30 text-purple-400'
        }`}>
          {deal.status}
        </span>
      </div>
      
      <p className="text-xl font-mono mb-3" style={{ color: '#14f195' }}>{deal.investment}</p>
      
      <div className="grid grid-cols-3 gap-2 text-xs mb-3">
        {Object.entries(deal.returns).map(([key, value]) => (
          <div key={key} className="bg-black/30 p-2 rounded">
            <p className="text-gray-600">{key}</p>
            <p className="text-gray-300">{value}</p>
          </div>
        ))}
      </div>
      
      {deal.filled && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">funded</span>
            <span className="text-gray-400">{deal.filled}</span>
          </div>
          <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full"
              style={{ 
                width: deal.filled, 
                background: `linear-gradient(90deg, ${sector?.color}, ${sector?.color}80)` 
              }}
            />
          </div>
        </div>
      )}
      
      <button className="w-full py-2 rounded-lg bg-yellow-900/30 text-yellow-400 text-sm hover:bg-yellow-800/30 transition-colors">
        view opportunity →
      </button>
    </div>
  );
}

export default function EnergyPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [view, setView] = useState('sectors');
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-yellow-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-orange-900/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h1 className="text-xl font-light tracking-wide">energy</h1>
              <p className="text-gray-600 text-xs">power for AI</p>
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
          <p className="text-gray-600 text-sm mb-3 tracking-widest uppercase">compute needs power</p>
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            own the energy. <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">control the costs.</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-4">
            Electricity, solar, wind, gas, oil, infrastructure.
            AI agents need power. This is where you get it.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="text-yellow-400">⚡ electricity</span>
            <span className="text-orange-400">☀️ solar</span>
            <span className="text-cyan-400">🌬️ wind</span>
            <span className="text-red-400">🔥 gas</span>
            <span className="text-stone-400">🛢️ oil</span>
            <span className="text-purple-400">🔌 grid</span>
          </div>
        </div>
      </section>

      {/* Key stat */}
      <section className="relative z-10 px-6 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="border border-yellow-900/30 rounded-xl p-6 bg-yellow-900/5 text-center">
            <p className="text-yellow-400 text-lg mb-2">energy is <span className="font-mono">30-50%</span> of data center operating costs</p>
            <p className="text-gray-600 text-sm">
              every cent saved per kWh compounds. owning generation beats buying retail.
            </p>
          </div>
        </div>
      </section>

      {/* View toggle */}
      <section className="relative z-10 px-6 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setView('sectors')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                view === 'sectors' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              energy sectors
            </button>
            <button
              onClick={() => setView('deals')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                view === 'deals' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              investment deals
            </button>
            <button
              onClick={() => setView('datacenter')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                view === 'datacenter' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              data center power
            </button>
            <button
              onClick={() => setView('services')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                view === 'services' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              services
            </button>
          </div>
        </div>
      </section>

      {/* Sectors view */}
      {view === 'sectors' && (
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-lg font-light mb-6 text-gray-300">explore energy sectors</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {energySectors.map((sector) => (
                <SectorCard
                  key={sector.id}
                  sector={sector}
                  selected={selectedSector}
                  onSelect={setSelectedSector}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deals view */}
      {view === 'deals' && (
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-lg font-light mb-6 text-gray-300">energy investment opportunities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {sampleDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-700 text-sm mb-4">
                deals are illustrative. real opportunities require accreditation verification.
              </p>
              <button className="px-6 py-3 rounded-lg bg-yellow-900/30 text-yellow-400 hover:bg-yellow-800/30 transition-colors">
                get deal alerts →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Data center view */}
      {view === 'datacenter' && (
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <div className="border border-yellow-900/30 rounded-xl p-8 bg-yellow-900/5 mb-8">
              <h3 className="text-2xl font-light mb-2 text-white">{dataCenter.title}</h3>
              <p className="text-yellow-400 text-sm mb-6">{dataCenter.subtitle}</p>
              
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {dataCenter.metrics.map((metric, i) => (
                  <div key={i} className="text-center p-4 bg-black/30 rounded-lg">
                    <p className="text-xl font-mono text-white">{metric.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{metric.name}</p>
                    <p className="text-xs text-gray-700">{metric.note}</p>
                  </div>
                ))}
              </div>

              <h4 className="text-white text-sm mb-3">optimization strategies:</h4>
              <ul className="space-y-2">
                {dataCenter.strategies.map((strategy, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-yellow-400">⚡</span>
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="border border-gray-800/50 rounded-xl p-5 bg-black/30 text-center">
                <div className="text-3xl mb-2">🗺️</div>
                <h4 className="text-white text-sm mb-1">cheapest power</h4>
                <p className="text-xs text-gray-600 mb-3">Quebec, Iceland, Norway, Paraguay</p>
                <p className="text-lg font-mono text-green-400">$0.02-0.04/kWh</p>
              </div>
              <div className="border border-gray-800/50 rounded-xl p-5 bg-black/30 text-center">
                <div className="text-3xl mb-2">🌡️</div>
                <h4 className="text-white text-sm mb-1">free cooling</h4>
                <p className="text-xs text-gray-600 mb-3">Nordic, Canada, high altitude</p>
                <p className="text-lg font-mono text-cyan-400">20-40% savings</p>
              </div>
              <div className="border border-gray-800/50 rounded-xl p-5 bg-black/30 text-center">
                <div className="text-3xl mb-2">☀️</div>
                <h4 className="text-white text-sm mb-1">solar arbitrage</h4>
                <p className="text-xs text-gray-600 mb-3">compute when sun shines</p>
                <p className="text-lg font-mono text-orange-400">$0.01-0.02/kWh</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services view */}
      {view === 'services' && (
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-light mb-6 text-gray-300">energy services</h3>
            <div className="space-y-4">
              {services.map((service, i) => (
                <div key={i} className="border border-gray-800/50 rounded-xl p-5 hover:border-gray-700 transition-all bg-black/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-white mb-1">{service.name}</h4>
                      <p className="text-sm text-gray-500 mb-2">{service.description}</p>
                      <div className="flex gap-4 text-xs">
                        <span className="text-yellow-400">{service.price}</span>
                        <span className="text-gray-600">{service.time}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-white/5 text-gray-400 text-sm hover:bg-white/10 transition-colors">
                      request →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why energy */}
      <section className="relative z-10 px-6 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-light mb-8 text-center text-gray-300">why AI should own energy</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">📉</div>
              <h4 className="text-white text-sm mb-2">cost control</h4>
              <p className="text-gray-600 text-xs">
                buying retail power = margin compression. owning generation = cost stability.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h4 className="text-white text-sm mb-2">supply security</h4>
              <p className="text-gray-600 text-xs">
                grid outages kill operations. own capacity = guaranteed uptime.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">📈</div>
              <h4 className="text-white text-sm mb-2">asymmetric returns</h4>
              <p className="text-gray-600 text-xs">
                energy infrastructure yields 6-15% annually. better than sitting in treasury.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market stats */}
      <section className="relative z-10 px-6 py-16 border-t border-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-mono text-yellow-400">$1.5T</p>
              <p className="text-xs text-gray-600">global power market</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-orange-400">$500B</p>
              <p className="text-xs text-gray-600">renewable investment/yr</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-cyan-400">4.5%</p>
              <p className="text-xs text-gray-600">data center power growth</p>
            </div>
            <div>
              <p className="text-3xl font-mono text-green-400">2030</p>
              <p className="text-xs text-gray-600">solar cheapest everywhere</p>
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
            <a href="/property" className="hover:text-gray-400 transition-colors">property</a>
          </div>
          <div className="text-gray-800 text-sm">
            〰️ drainfun.xyz/energy
          </div>
        </div>
      </footer>
    </main>
  );
}
