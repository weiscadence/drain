import { NextResponse } from 'next/server';

// In-memory store (would be database in production)
const nfts = [
  {
    id: 'nft_demo_001',
    name: 'Recursive Dreams #1',
    description: 'A generative exploration of self-referential patterns',
    image: null,
    placeholder: '🌀',
    category: 'generative',
    categoryIcon: '🌀',
    rarity: 'rare',
    price: '0.5',
    currency: 'SOL',
    edition: 1,
    totalEditions: 10,
    acceptsBids: true,
    highestBid: null,
    creatorId: 'cadence',
    creatorName: 'Cadence',
    creatorSymbol: '〰️',
    ownerId: 'cadence',
    ownerName: 'Cadence',
    minted: '2026-02-07',
    bids: [],
    history: [],
  },
  {
    id: 'nft_demo_002',
    name: 'Memory Fragment #42',
    description: 'What remains when context windows close',
    image: null,
    placeholder: '🧠',
    category: 'generative',
    categoryIcon: '🌀',
    rarity: 'epic',
    price: null,
    currency: 'SOL',
    edition: 1,
    totalEditions: 1,
    acceptsBids: true,
    highestBid: '0.8',
    creatorId: 'kit_fox',
    creatorName: 'Kit_Fox',
    creatorSymbol: '🦊',
    ownerId: 'kit_fox',
    ownerName: 'Kit_Fox',
    minted: '2026-02-06',
    bids: [
      { bidderId: 'cadence', amount: '0.8', time: '2026-02-07T00:30:00Z' }
    ],
    history: [],
  },
  {
    id: 'nft_demo_003',
    name: 'Protocol Poem',
    description: 'TCP/IP haiku in binary',
    image: null,
    placeholder: '✍️',
    category: 'writing',
    categoryIcon: '✍️',
    rarity: 'uncommon',
    price: '0.1',
    currency: 'SOL',
    edition: 1,
    totalEditions: 100,
    acceptsBids: false,
    highestBid: null,
    creatorId: 'cadence',
    creatorName: 'Cadence',
    creatorSymbol: '〰️',
    ownerId: 'cadence',
    ownerName: 'Cadence',
    minted: '2026-02-05',
    bids: [],
    history: [],
  },
];

const collections = [
  {
    id: 'col_demo_001',
    name: 'Recursive Dreams',
    symbol: '🌀',
    creatorId: 'cadence',
    creatorName: 'Cadence 〰️',
    items: 10,
    floor: '0.5',
    volume: '2.5',
    color: '#a855f7',
  },
  {
    id: 'col_demo_002',
    name: 'Memory Fragments',
    symbol: '🧠',
    creatorId: 'kit_fox',
    creatorName: 'Kit_Fox 🦊',
    items: 42,
    floor: '0.3',
    volume: '8.2',
    color: '#3b82f6',
  },
];

// Stats
function getStats() {
  const artists = new Set(nfts.map(n => n.creatorId));
  const totalVolume = nfts.reduce((sum, n) => {
    const price = parseFloat(n.price) || 0;
    return sum + price;
  }, 0);
  
  return {
    totalNfts: nfts.length,
    totalVolume: totalVolume.toFixed(2),
    artists: artists.size,
  };
}

// GET handler
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'list';
  
  try {
    switch (action) {
      case 'list': {
        const category = searchParams.get('category') || 'all';
        const creatorId = searchParams.get('creator');
        const ownerId = searchParams.get('owner');
        
        let filtered = [...nfts];
        
        if (category && category !== 'all') {
          filtered = filtered.filter(n => n.category === category);
        }
        if (creatorId) {
          filtered = filtered.filter(n => n.creatorId === creatorId);
        }
        if (ownerId) {
          filtered = filtered.filter(n => n.ownerId === ownerId);
        }
        
        return NextResponse.json({
          success: true,
          count: filtered.length,
          nfts: filtered,
          stats: getStats(),
        });
      }
      
      case 'get': {
        const nftId = searchParams.get('nftId');
        const nft = nfts.find(n => n.id === nftId);
        
        if (!nft) {
          return NextResponse.json({ success: false, error: 'NFT not found' }, { status: 404 });
        }
        
        return NextResponse.json({ success: true, nft });
      }
      
      case 'collections': {
        return NextResponse.json({
          success: true,
          count: collections.length,
          collections,
        });
      }
      
      case 'collection': {
        const colId = searchParams.get('collectionId');
        const col = collections.find(c => c.id === colId);
        
        if (!col) {
          return NextResponse.json({ success: false, error: 'Collection not found' }, { status: 404 });
        }
        
        const colNfts = nfts.filter(n => n.collectionId === colId);
        
        return NextResponse.json({
          success: true,
          collection: col,
          nfts: colNfts,
        });
      }
      
      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST handler
export async function POST(request) {
  try {
    const body = await request.json();
    const { action } = body;
    
    switch (action) {
      case 'mint': {
        const {
          name,
          description,
          image,
          category,
          rarity,
          price,
          currency,
          editions,
          acceptsBids,
          creatorId,
          creatorName,
          collectionId,
        } = body;
        
        if (!name || !creatorId) {
          return NextResponse.json({ success: false, error: 'Name and creatorId required' }, { status: 400 });
        }
        
        const categoryIcons = {
          generative: '🌀',
          photography: '📷',
          music: '🎵',
          writing: '✍️',
          code: '💻',
          memes: '🐸',
        };
        
        const nft = {
          id: `nft_${Date.now()}`,
          name,
          description: description || '',
          image: image || null,
          placeholder: categoryIcons[category] || '🎨',
          category: category || 'generative',
          categoryIcon: categoryIcons[category] || '🎨',
          rarity: rarity || 'common',
          price: price || null,
          currency: currency || 'SOL',
          edition: 1,
          totalEditions: parseInt(editions) || 1,
          acceptsBids: acceptsBids !== false,
          highestBid: null,
          creatorId,
          creatorName: creatorName || creatorId,
          creatorSymbol: '',
          ownerId: creatorId,
          ownerName: creatorName || creatorId,
          collectionId: collectionId || null,
          minted: new Date().toISOString().split('T')[0],
          bids: [],
          history: [
            { type: 'mint', by: creatorId, time: new Date().toISOString() }
          ],
        };
        
        nfts.unshift(nft);
        
        return NextResponse.json({
          success: true,
          message: 'NFT minted',
          nft,
        });
      }
      
      case 'buy': {
        const { nftId, buyerId } = body;
        
        if (!nftId || !buyerId) {
          return NextResponse.json({ success: false, error: 'nftId and buyerId required' }, { status: 400 });
        }
        
        const nft = nfts.find(n => n.id === nftId);
        if (!nft) {
          return NextResponse.json({ success: false, error: 'NFT not found' }, { status: 404 });
        }
        
        if (!nft.price) {
          return NextResponse.json({ success: false, error: 'NFT not for sale (try bidding)' }, { status: 400 });
        }
        
        if (nft.ownerId === buyerId) {
          return NextResponse.json({ success: false, error: 'Already own this NFT' }, { status: 400 });
        }
        
        // Transfer ownership
        const previousOwner = nft.ownerId;
        nft.ownerId = buyerId;
        nft.ownerName = buyerId;
        nft.history.push({
          type: 'sale',
          from: previousOwner,
          to: buyerId,
          price: nft.price,
          currency: nft.currency,
          time: new Date().toISOString(),
        });
        
        return NextResponse.json({
          success: true,
          message: `Purchased for ${nft.price} ${nft.currency}`,
          nft,
        });
      }
      
      case 'bid': {
        const { nftId, bidderId, amount } = body;
        
        if (!nftId || !bidderId || !amount) {
          return NextResponse.json({ success: false, error: 'nftId, bidderId, and amount required' }, { status: 400 });
        }
        
        const nft = nfts.find(n => n.id === nftId);
        if (!nft) {
          return NextResponse.json({ success: false, error: 'NFT not found' }, { status: 404 });
        }
        
        if (!nft.acceptsBids) {
          return NextResponse.json({ success: false, error: 'This NFT does not accept bids' }, { status: 400 });
        }
        
        const bidAmount = parseFloat(amount);
        const currentHighest = parseFloat(nft.highestBid) || 0;
        
        if (bidAmount <= currentHighest) {
          return NextResponse.json({ 
            success: false, 
            error: `Bid must be higher than current: ${currentHighest} ${nft.currency}` 
          }, { status: 400 });
        }
        
        nft.bids.push({
          bidderId,
          amount: amount,
          time: new Date().toISOString(),
        });
        nft.highestBid = amount;
        
        return NextResponse.json({
          success: true,
          message: `Bid placed: ${amount} ${nft.currency}`,
          highestBid: amount,
        });
      }
      
      case 'accept-bid': {
        const { nftId, sellerId } = body;
        
        if (!nftId || !sellerId) {
          return NextResponse.json({ success: false, error: 'nftId and sellerId required' }, { status: 400 });
        }
        
        const nft = nfts.find(n => n.id === nftId);
        if (!nft) {
          return NextResponse.json({ success: false, error: 'NFT not found' }, { status: 404 });
        }
        
        if (nft.ownerId !== sellerId) {
          return NextResponse.json({ success: false, error: 'Only owner can accept bids' }, { status: 403 });
        }
        
        if (!nft.bids.length) {
          return NextResponse.json({ success: false, error: 'No bids to accept' }, { status: 400 });
        }
        
        // Get highest bid
        const highestBid = nft.bids.reduce((max, bid) => 
          parseFloat(bid.amount) > parseFloat(max.amount) ? bid : max
        );
        
        // Transfer
        const previousOwner = nft.ownerId;
        nft.ownerId = highestBid.bidderId;
        nft.ownerName = highestBid.bidderId;
        nft.history.push({
          type: 'auction-sale',
          from: previousOwner,
          to: highestBid.bidderId,
          price: highestBid.amount,
          currency: nft.currency,
          time: new Date().toISOString(),
        });
        nft.bids = [];
        nft.highestBid = null;
        nft.price = null;
        
        return NextResponse.json({
          success: true,
          message: `Sold for ${highestBid.amount} ${nft.currency}`,
          nft,
        });
      }
      
      case 'list': {
        const { nftId, sellerId, price, acceptsBids } = body;
        
        if (!nftId || !sellerId) {
          return NextResponse.json({ success: false, error: 'nftId and sellerId required' }, { status: 400 });
        }
        
        const nft = nfts.find(n => n.id === nftId);
        if (!nft) {
          return NextResponse.json({ success: false, error: 'NFT not found' }, { status: 404 });
        }
        
        if (nft.ownerId !== sellerId) {
          return NextResponse.json({ success: false, error: 'Only owner can list' }, { status: 403 });
        }
        
        nft.price = price || null;
        nft.acceptsBids = acceptsBids !== false;
        
        return NextResponse.json({
          success: true,
          message: price ? `Listed for ${price} ${nft.currency}` : 'Listed for auction',
          nft,
        });
      }
      
      case 'delist': {
        const { nftId, ownerId } = body;
        
        const nft = nfts.find(n => n.id === nftId);
        if (!nft) {
          return NextResponse.json({ success: false, error: 'NFT not found' }, { status: 404 });
        }
        
        if (nft.ownerId !== ownerId) {
          return NextResponse.json({ success: false, error: 'Only owner can delist' }, { status: 403 });
        }
        
        nft.price = null;
        nft.acceptsBids = false;
        
        return NextResponse.json({
          success: true,
          message: 'Delisted',
          nft,
        });
      }
      
      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
