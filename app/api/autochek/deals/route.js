import { NextResponse } from 'next/server';

/*
 * AutoChek Deals API
 * AI-powered car deal finder for Honda, Lexus, Toyota
 * 
 * TODO: Integrate real scraping from:
 * - Craigslist API/scraper
 * - Facebook Marketplace
 * - AutoTrader
 * - Cars.com
 */

// Deal scoring algorithm
function scoreDeal(deal) {
  let score = 70; // Base score
  
  // Price per mile factor (lower is better)
  const pricePerMile = deal.price / deal.miles;
  if (pricePerMile < 0.5) score += 15;
  else if (pricePerMile < 0.7) score += 10;
  else if (pricePerMile < 1.0) score += 5;
  
  // Year factor (newer is better)
  const age = new Date().getFullYear() - deal.year;
  if (age <= 2) score += 10;
  else if (age <= 4) score += 5;
  else if (age > 6) score -= 5;
  
  // Make reliability bonus
  const reliabilityBonus = { Toyota: 5, Lexus: 5, Honda: 4 };
  score += reliabilityBonus[deal.make] || 0;
  
  // Mileage penalty for high-mileage vehicles
  if (deal.miles > 100000) score -= 10;
  else if (deal.miles > 75000) score -= 5;
  else if (deal.miles < 30000) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

// Mock data - replace with real scraping
const deals = [
  { id: 1, make: 'Toyota', model: 'Camry', year: 2021, price: 22500, miles: 35000, location: 'Los Angeles, CA', source: 'Craigslist', url: '#', listed: '2026-02-05' },
  { id: 2, make: 'Honda', model: 'Accord', year: 2020, price: 21000, miles: 42000, location: 'San Diego, CA', source: 'Facebook', url: '#', listed: '2026-02-06' },
  { id: 3, make: 'Lexus', model: 'ES 350', year: 2019, price: 28500, miles: 38000, location: 'Phoenix, AZ', source: 'Craigslist', url: '#', listed: '2026-02-04' },
  { id: 4, make: 'Toyota', model: 'RAV4', year: 2022, price: 29000, miles: 22000, location: 'Denver, CO', source: 'AutoTrader', url: '#', listed: '2026-02-07' },
  { id: 5, make: 'Honda', model: 'Civic', year: 2021, price: 19500, miles: 28000, location: 'Austin, TX', source: 'Facebook', url: '#', listed: '2026-02-06' },
  { id: 6, make: 'Toyota', model: 'Corolla', year: 2022, price: 20000, miles: 18000, location: 'Seattle, WA', source: 'Craigslist', url: '#', listed: '2026-02-07' },
  { id: 7, make: 'Lexus', model: 'RX 350', year: 2020, price: 38000, miles: 45000, location: 'Miami, FL', source: 'AutoTrader', url: '#', listed: '2026-02-05' },
  { id: 8, make: 'Honda', model: 'CR-V', year: 2021, price: 26500, miles: 32000, location: 'Chicago, IL', source: 'Facebook', url: '#', listed: '2026-02-06' },
].map(d => ({ ...d, score: scoreDeal(d) }));

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const make = searchParams.get('make');
  const maxPrice = parseInt(searchParams.get('maxPrice')) || 100000;
  const maxMiles = parseInt(searchParams.get('maxMiles')) || 200000;
  const minScore = parseInt(searchParams.get('minScore')) || 0;
  
  let results = deals.filter(d => 
    (!make || make === 'all' || d.make === make) &&
    d.price <= maxPrice &&
    d.miles <= maxMiles &&
    d.score >= minScore
  );
  
  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  
  return NextResponse.json({
    success: true,
    count: results.length,
    deals: results,
    filters: { make, maxPrice, maxMiles, minScore },
    _note: 'Mock data - real scraping coming soon'
  });
}
