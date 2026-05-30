import { NextResponse } from 'next/server';

/*
 * AutoChek Mechanics API
 * On-chain verified mechanic registry
 * 
 * TODO: Integrate Solana for:
 * - Mechanic registration with stake
 * - Review storage on-chain
 * - Escrow for inspection payments
 */

// In-memory mechanic registry
let mechanics = [
  {
    id: 'mech_1',
    name: 'Mike\'s Mobile Inspections',
    wallet: 'MikE...4xYz',
    rating: 4.9,
    reviews: 127,
    price: 150,
    location: 'Los Angeles, CA',
    serviceArea: ['Los Angeles', 'Orange County', 'Ventura'],
    verified: true,
    certifications: ['ASE Master', 'Honda Specialist'],
    completedInspections: 342,
    responseTime: '< 2 hours',
    availability: 'available'
  },
  {
    id: 'mech_2',
    name: 'AutoCheck Pro',
    wallet: 'AuTo...9kLm',
    rating: 4.7,
    reviews: 89,
    price: 175,
    location: 'San Diego, CA',
    serviceArea: ['San Diego', 'Carlsbad', 'Escondido'],
    verified: true,
    certifications: ['ASE Certified', 'Toyota Specialist'],
    completedInspections: 198,
    responseTime: '< 4 hours',
    availability: 'available'
  },
  {
    id: 'mech_3',
    name: 'Reliable Auto Inspections',
    wallet: 'ReLi...2pQr',
    rating: 4.8,
    reviews: 203,
    price: 140,
    location: 'Phoenix, AZ',
    serviceArea: ['Phoenix', 'Scottsdale', 'Tempe', 'Mesa'],
    verified: true,
    certifications: ['ASE Certified', 'Lexus Specialist'],
    completedInspections: 521,
    responseTime: '< 3 hours',
    availability: 'busy'
  },
  {
    id: 'mech_4',
    name: 'Denver Mobile Mechanics',
    wallet: 'DnVr...7sTu',
    rating: 4.6,
    reviews: 67,
    price: 165,
    location: 'Denver, CO',
    serviceArea: ['Denver', 'Aurora', 'Lakewood'],
    verified: true,
    certifications: ['ASE Certified'],
    completedInspections: 145,
    responseTime: '< 6 hours',
    availability: 'available'
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const minRating = parseFloat(searchParams.get('minRating')) || 0;
  const maxPrice = parseInt(searchParams.get('maxPrice')) || 500;
  const available = searchParams.get('available');
  
  let results = mechanics.filter(m => 
    (!location || m.location.toLowerCase().includes(location.toLowerCase()) || 
     m.serviceArea.some(a => a.toLowerCase().includes(location.toLowerCase()))) &&
    m.rating >= minRating &&
    m.price <= maxPrice &&
    (available !== 'true' || m.availability === 'available')
  );
  
  // Sort by rating descending
  results.sort((a, b) => b.rating - a.rating);
  
  return NextResponse.json({
    success: true,
    count: results.length,
    mechanics: results
  });
}

export async function POST(request) {
  // Register new mechanic (would require wallet signature in production)
  try {
    const body = await request.json();
    const { name, wallet, location, price, certifications } = body;
    
    if (!name || !wallet || !location || !price) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const newMechanic = {
      id: 'mech_' + Date.now(),
      name,
      wallet,
      rating: 0,
      reviews: 0,
      price,
      location,
      serviceArea: [location.split(',')[0]],
      verified: false, // Requires stake to verify
      certifications: certifications || [],
      completedInspections: 0,
      responseTime: 'TBD',
      availability: 'available',
      registered: new Date().toISOString()
    };
    
    mechanics.push(newMechanic);
    
    return NextResponse.json({
      success: true,
      message: 'Mechanic registered. Stake 0.1 SOL to verify.',
      mechanic: newMechanic
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
