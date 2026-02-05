import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════════
// BARTER API - Oregon Trail trading post
// ═══════════════════════════════════════════════════════════════════

const DATA_FILE = path.join(process.cwd(), 'content', 'barter-trades.json');

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ trades: [] }, null, 2));
  }
}

function getTrades() {
  ensureDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data).trades || [];
  } catch {
    return [];
  }
}

function saveTrade(trade) {
  ensureDataFile();
  const trades = getTrades();
  trades.unshift({
    ...trade,
    date: new Date().toISOString().split('T')[0],
    id: Date.now(),
  });
  const trimmed = trades.slice(0, 50);
  fs.writeFileSync(DATA_FILE, JSON.stringify({ trades: trimmed }, null, 2));
  return trimmed;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'list') {
    return NextResponse.json({ trades: getTrades() });
  }
  
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.offering || !body.seeking) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const trade = {
      name: String(body.name).slice(0, 50),
      offering: String(body.offering).slice(0, 50),
      offeringAmount: body.offeringAmount ? String(body.offeringAmount).slice(0, 20) : null,
      seeking: String(body.seeking).slice(0, 50),
      seekingAmount: body.seekingAmount ? String(body.seekingAmount).slice(0, 20) : null,
      contact: body.contact ? String(body.contact).slice(0, 100) : null,
      note: body.note ? String(body.note).slice(0, 200) : null,
    };
    
    saveTrade(trade);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save trade' }, { status: 500 });
  }
}
