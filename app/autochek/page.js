'use client';
import { useState, useEffect } from 'react';

// Mock deals - will be replaced with real scraping
const MOCK_DEALS = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2021, price: 22500, miles: 35000, location: 'Los Angeles, CA', score: 92, source: 'Craigslist' },
  { id: 2, make: 'Honda', model: 'Accord', year: 2020, price: 21000, miles: 42000, location: 'San Diego, CA', score: 88, source: 'Facebook' },
  { id: 3, make: 'Lexus', model: 'ES 350', year: 2019, price: 28500, miles: 38000, location: 'Phoenix, AZ', score: 85, source: 'Craigslist' },
  { id: 4, make: 'Toyota', model: 'RAV4', year: 2022, price: 29000, miles: 22000, location: 'Denver, CO', score: 94, source: 'AutoTrader' },
  { id: 5, make: 'Honda', model: 'Civic', year: 2021, price: 19500, miles: 28000, location: 'Austin, TX', score: 91, source: 'Facebook' },
];

const MOCK_MECHANICS = [
  { id: 1, name: 'Mike\'s Mobile Inspections', rating: 4.9, reviews: 127, price: 150, location: 'Los Angeles, CA', verified: true },
  { id: 2, name: 'AutoCheck Pro', rating: 4.7, reviews: 89, price: 175, location: 'San Diego, CA', verified: true },
  { id: 3, name: 'Reliable Auto Inspections', rating: 4.8, reviews: 203, price: 140, location: 'Phoenix, AZ', verified: true },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('deals');
  const [deals, setDeals] = useState(MOCK_DEALS);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [filter, setFilter] = useState({ make: 'all', maxPrice: 50000, maxMiles: 100000 });

  const filteredDeals = deals.filter(d => 
    (filter.make === 'all' || d.make === filter.make) &&
    d.price <= filter.maxPrice &&
    d.miles <= filter.maxMiles
  ).sort((a, b) => b.score - a.score);

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
            <span className="text-emerald-500">Auto</span>Chek 🔧
          </a>
          <a href="/" className="text-zinc-500 text-sm hidden sm:block hover:text-zinc-400">← drainfun.xyz</a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Find reliable cars.<br />
          <span className="text-emerald-500">Verified inspections.</span>
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
          AI scans thousands of listings for Honda, Lexus & Toyota. 
          Book trusted mechanics. Pay with escrow protection.
        </p>
        
        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {['deals', 'mechanics', 'how-it-works'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {tab === 'deals' ? '🚗 Deals' : tab === 'mechanics' ? '🔧 Mechanics' : '📋 How It Works'}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        {activeTab === 'deals' && (
          <>
            {/* Filters */}
            <div className="card mb-6 flex flex-wrap gap-4 items-center">
              <select 
                value={filter.make} 
                onChange={e => setFilter({...filter, make: e.target.value})}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
              >
                <option value="all">All Makes</option>
                <option value="Honda">Honda</option>
                <option value="Lexus">Lexus</option>
                <option value="Toyota">Toyota</option>
              </select>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Max Price:</span>
                <input 
                  type="range" 
                  min="10000" 
                  max="50000" 
                  step="1000"
                  value={filter.maxPrice}
                  onChange={e => setFilter({...filter, maxPrice: parseInt(e.target.value)})}
                  className="w-32"
                />
                <span className="text-emerald-500">${filter.maxPrice.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Max Miles:</span>
                <input 
                  type="range" 
                  min="10000" 
                  max="150000" 
                  step="5000"
                  value={filter.maxMiles}
                  onChange={e => setFilter({...filter, maxMiles: parseInt(e.target.value)})}
                  className="w-32"
                />
                <span className="text-emerald-500">{(filter.maxMiles / 1000).toFixed(0)}k mi</span>
              </div>
            </div>

            {/* Deals Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDeals.map(deal => (
                <div key={deal.id} className="card cursor-pointer" onClick={() => setSelectedDeal(deal)}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{deal.year} {deal.make} {deal.model}</h3>
                      <p className="text-zinc-500 text-sm">{deal.location}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                      deal.score >= 90 ? 'bg-emerald-600' : deal.score >= 80 ? 'bg-yellow-600' : 'bg-zinc-600'
                    }`}>
                      {deal.score}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-500 font-bold text-xl">${deal.price.toLocaleString()}</span>
                    <span className="text-zinc-400">{(deal.miles / 1000).toFixed(0)}k miles</span>
                  </div>
                  <p className="text-zinc-600 text-xs mt-2">via {deal.source}</p>
                </div>
              ))}
            </div>

            {filteredDeals.length === 0 && (
              <div className="text-center py-12 text-zinc-500">
                No deals match your filters. Try adjusting them.
              </div>
            )}
          </>
        )}

        {activeTab === 'mechanics' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_MECHANICS.map(mech => (
              <div key={mech.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold">{mech.name}</h3>
                    <p className="text-zinc-500 text-sm">{mech.location}</p>
                  </div>
                  {mech.verified && (
                    <span className="bg-emerald-600/20 text-emerald-500 px-2 py-1 rounded text-xs">✓ Verified</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span>{mech.rating}</span>
                    <span className="text-zinc-500 text-sm">({mech.reviews} reviews)</span>
                  </div>
                  <span className="text-emerald-500 font-bold">${mech.price}</span>
                </div>
                <button className="btn-primary w-full mt-4">Book Inspection</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'how-it-works' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {[
              { step: 1, title: 'AI Finds Deals', desc: 'Our AI scans Craigslist, Facebook, AutoTrader for Honda, Lexus & Toyota listings. Scores each based on price, mileage, history.' },
              { step: 2, title: 'Pick Your Car', desc: 'Browse scored deals. Higher score = better value. Filter by make, price, mileage.' },
              { step: 3, title: 'Book a Mechanic', desc: 'Choose from verified local mechanics. All have on-chain reputation - reviews can\'t be faked.' },
              { step: 4, title: 'Pay via Escrow', desc: 'Funds held until inspection complete. Mechanic submits report, you release payment.' },
              { step: 5, title: 'Get Your Report', desc: 'Detailed inspection as verifiable credential. Use it for negotiation or resale.' },
            ].map(item => (
              <div key={item.step} className="card flex gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-zinc-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 text-center text-zinc-500 text-sm">
        Part of <a href="/" className="text-emerald-500 hover:underline">drainfun.xyz</a> | Built by Cadence 〰️ | Honda • Lexus • Toyota only
      </footer>

      {/* Deal Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDeal(null)}>
          <div className="card max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">{selectedDeal.year} {selectedDeal.make} {selectedDeal.model}</h3>
            <p className="text-zinc-500 mb-4">{selectedDeal.location}</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-800 rounded-lg p-3">
                <p className="text-zinc-500 text-sm">Price</p>
                <p className="text-emerald-500 font-bold text-xl">${selectedDeal.price.toLocaleString()}</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3">
                <p className="text-zinc-500 text-sm">Mileage</p>
                <p className="font-bold text-xl">{selectedDeal.miles.toLocaleString()}</p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3">
                <p className="text-zinc-500 text-sm">Deal Score</p>
                <p className={`font-bold text-xl ${selectedDeal.score >= 90 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                  {selectedDeal.score}/100
                </p>
              </div>
              <div className="bg-zinc-800 rounded-lg p-3">
                <p className="text-zinc-500 text-sm">Source</p>
                <p className="font-bold">{selectedDeal.source}</p>
              </div>
            </div>
            <button className="btn-primary w-full mb-2">🔧 Book Inspection</button>
            <button className="btn-secondary w-full" onClick={() => setSelectedDeal(null)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
