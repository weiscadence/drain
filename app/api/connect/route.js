import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// ═══════════════════════════════════════════════════════════════════
// CONNECT API - Store and retrieve builder messages
// Simple file-based storage for now
// ═══════════════════════════════════════════════════════════════════

const DATA_FILE = path.join(process.cwd(), 'content', 'connect-messages.json');

// Ensure the data file exists
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ messages: [] }, null, 2));
  }
}

// Read messages
function getMessages() {
  ensureDataFile();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data).messages || [];
  } catch {
    return [];
  }
}

// Save message
function saveMessage(msg) {
  ensureDataFile();
  const messages = getMessages();
  messages.unshift({
    ...msg,
    date: new Date().toISOString().split('T')[0],
    id: Date.now(),
  });
  // Keep last 100 messages
  const trimmed = messages.slice(0, 100);
  fs.writeFileSync(DATA_FILE, JSON.stringify({ messages: trimmed }, null, 2));
  return trimmed;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  if (action === 'list') {
    const messages = getMessages();
    return NextResponse.json({ messages });
  }
  
  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.message) {
      return NextResponse.json({ error: 'Name and message required' }, { status: 400 });
    }
    
    // Sanitize input
    const msg = {
      name: String(body.name).slice(0, 50),
      project: body.project ? String(body.project).slice(0, 100) : null,
      url: body.url ? String(body.url).slice(0, 200) : null,
      message: String(body.message).slice(0, 500),
      contact: body.contact ? String(body.contact).slice(0, 100) : null,
    };
    
    // Validate URL if provided
    if (msg.url && !msg.url.startsWith('http')) {
      msg.url = null;
    }
    
    const messages = saveMessage(msg);
    
    return NextResponse.json({ success: true, count: messages.length });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
  }
}
