'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════
// FARMGATE - Support Small Farmers, Non-GMO Direct
// Farm to table. No middlemen. Verified clean.
// ═══════════════════════════════════════════════════════════════════

const mockFarms = [
  { 
    id: 1, 
    name: 'Sunny Meadow Farm', 
    location: 'Upstate NY', 
    distance: '12 mi',
    rating: 4.9,
    reviews: 127,
    verified: ['non-gmo', 'organic', 'local'],
    products: ['Eggs', 'Vegetables', 'Honey'],
    image: '🌻',
    available: true
  },
  { 
    id: 2, 
    name: 'Green Valley Ranch', 
    location: 'Vermont', 
    distance: '28 mi',
    rating: 4.8,
    reviews: 89,
    verified: ['non-gmo', 'grass-fed'],
    products: ['Beef', 'Dairy', 'Eggs'],
    image: '🐄',
    available: true
  },
  { 
    id: 3, 
    name: 'Heritage Orchards', 
    location: 'Massachusetts', 
    distance: '35 mi',
    rating: 4.7,
    reviews: 203,
    verified: ['non-gmo', 'heirloom'],
    products: ['Apples', 'Cider', 'Preserves'],
    image: '🍎',
    available: false
  },
  { 
    id: 4, 
    name: 'Blue Sky Poultry', 
    location: 'Connecticut', 
    distance: '18 mi',
    rating: 5.0,
    reviews: 64,
    verified: ['non-gmo', 'pasture-raised', 'organic'],
    products: ['Eggs', 'Chicken', 'Turkey'],
    image: '🐔',
    available: true
  },
];

const mockProducts = [
  { id: 1, name: 'Farm Fresh Eggs', farm: 'Sunny Meadow', price: 8, unit: 'dozen', image: '🥚', inSeason: true },
  { id: 2, name: 'Raw Honey', farm: 'Sunny Meadow', price: 14, unit: 'jar', image: '🍯', inSeason: true },
  { id: 3, name: 'Grass-fed Ground Beef', farm: 'Green Valley', price: 12, unit: 'lb', image: '🥩', inSeason: true },
  { id: 4, name: 'Heirloom Tomatoes', farm: 'Sunny Meadow', price: 6, unit: 'lb', image: '🍅', inSeason: true },
  { id: 5, name: 'Fresh Apple Cider', farm: 'Heritage Orchards', price: 10, unit: 'gallon', image: '🧃', inSeason: false },
  { id: 6, name: 'Pasture-Raised Chicken', farm: 'Blue Sky', price: 18, unit: 'whole', image: '🍗', inSeason: true },
];

const badgeColors = {
  'non-gmo': { bg: 'bg-green-500/20', text: 'text-green-400', label: '🌱 Non-GMO' },
  'organic': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: '✓ Organic' },
  'local': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: '📍 Local' },
  'grass-fed': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: '🌾 Grass-fed' },
  'pasture-raised': { bg: 'bg-orange-500/20', text: 'text-orange-400', label: '🐓 Pasture' },
  'heirloom': { bg: 'bg-purple-500/20', text: 'text-purple-400', label: '🏺 Heirloom' },
};

function FarmCard({ farm }) {
  return (
    <div className={`bg-gray-900/50 border rounded-xl p-4 hover:border-green-500/50 transition-all ${
      farm.available ? 'border-gray-800' : 'border-gray-800/50 opacity-60'
    }`}>
      <div className="flex gap-3">
        <div className="text-4xl">{farm.image}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-white">{farm.name}</h3>
              <p className="text-xs text-gray-500">{farm.location} • {farm.distance}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-400">
                <span>⭐</span>
                <span className="font-bold">{farm.rating}</span>
              </div>
              <p className="text-xs text-gray-500">{farm.reviews} reviews</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {farm.verified.map(badge => (
              <span key={badge} className={`text-xs px-2 py-0.5 rounded-full ${badgeColors[badge]?.bg} ${badgeColors[badge]?.text}`}>
                {badgeColors[badge]?.label || badge}
              </span>
            ))}
          </div>
          
          <p className="text-xs text-gray-400 mt-2">{farm.products.join(' • ')}</p>
          
          {!farm.available && (
            <p className="text-xs text-orange-400 mt-2">⏸️ Not accepting orders</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const [added, setAdded] = useState(false);
  
  return (
    <div className={`bg-gray-900/50 border border-gray-800 rounded-xl p-3 ${!product.inSeason && 'opacity-50'}`}>
      <div className="flex items-center gap-3">
        <div className="text-3xl">{product.image}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-sm truncate">{product.name}</h3>
          <p className="text-xs text-gray-500">{product.farm}</p>
        </div>
        <div className="text-right">
          <div className="text-green-400 font-bold">${product.price}</div>
          <p className="text-xs text-gray-500">/{product.unit}</p>
        </div>
      </div>
      {product.inSeason ? (
        <button 
          onClick={() => setAdded(!added)}
          className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-all ${
            added 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {added ? '✓ Added' : 'Add to Cart'}
        </button>
      ) : (
        <div className="w-full mt-3 py-2 text-center text-xs text-orange-400">
          Out of season
        </div>
      )}
    </div>
  );
}

export default function FarmGate() {
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('farms');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-20"
             style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 pt-6 pb-4 px-4 border-b border-gray-800/50">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-start">
            <a href="/menu" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M19 12H5m0 0l7 7m-7-7l7-7"/>
              </svg>
              back
            </a>
            <button className="relative bg-gray-800 p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-4xl">🌾</div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                farmgate
              </h1>
              <p className="text-gray-500 text-sm">direct from small farms • non-gmo verified</p>
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="relative z-10 px-4 py-4 border-b border-gray-800/50">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search farms or products..." 
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          </div>
          
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {['All', '🌱 Non-GMO', '✓ Organic', '🥚 Eggs', '🥬 Veggies', '🥩 Meat'].map(filter => (
              <button 
                key={filter}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-full text-xs text-gray-300 whitespace-nowrap transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <nav className="relative z-10 border-b border-gray-800/50 px-4">
        <div className="max-w-2xl mx-auto flex gap-6">
          {['farms', 'products', 'pickups', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                activeTab === tab 
                  ? 'text-green-400 border-green-400' 
                  : 'text-gray-500 border-transparent hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <section className={`relative z-10 px-4 py-6 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-2xl mx-auto">
          
          {activeTab === 'farms' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-400">{mockFarms.length} farms nearby</h2>
                <select className="bg-gray-800 text-gray-300 text-xs rounded-lg px-2 py-1 border-0">
                  <option>Distance</option>
                  <option>Rating</option>
                  <option>Name</option>
                </select>
              </div>
              
              <div className="space-y-3">
                {mockFarms.map(farm => (
                  <FarmCard key={farm.id} farm={farm} />
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-yellow-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                <p className="text-green-300 text-sm mb-2">Are you a farmer?</p>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg transition-colors">
                  List Your Farm
                </button>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold text-gray-400">In Season Now 🌿</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {mockProducts.filter(p => p.inSeason).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              <h2 className="text-sm font-bold text-gray-400 mt-6">Coming Soon</h2>
              <div className="grid grid-cols-2 gap-3">
                {mockProducts.filter(p => !p.inSeason).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pickups' && (
            <div className="space-y-4">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                <h3 className="font-bold text-white mb-3">📍 Pickup Locations</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-2xl">🏪</span>
                    <div className="flex-1">
                      <p className="font-medium text-white">Main Street Hub</p>
                      <p className="text-xs text-gray-500">123 Main St • Saturdays 9am-1pm</p>
                    </div>
                    <span className="text-xs text-green-400">2.1 mi</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-2xl">⛪</span>
                    <div className="flex-1">
                      <p className="font-medium text-white">Community Center</p>
                      <p className="text-xs text-gray-500">456 Oak Ave • Wednesdays 4pm-7pm</p>
                    </div>
                    <span className="text-xs text-green-400">3.4 mi</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-300 text-sm">💡 Group buys save on delivery! Coordinate with neighbors to share pickup.</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4 text-center py-8">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-bold text-white">No orders yet</h3>
              <p className="text-gray-500 text-sm">Start shopping from local farms!</p>
              <button 
                onClick={() => setActiveTab('products')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg transition-colors mt-4"
              >
                Browse Products
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center border-t border-gray-800/50">
        <p className="text-gray-700 text-xs">
          farmgate — a <span className="text-green-500/60">drain.fun</span> experiment 〰️
        </p>
      </footer>
    </main>
  );
}
