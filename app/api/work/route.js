import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = '/home/ubuntu/.openclaw/workspace/data/work-inquiries.json';
const BOT_TOKEN = '8073094337:AAHGNPrdeIGOT2qtqGNRgf3sqqjBpl-CxPQ';
const CHAT_ID = '7790478889';

const SERVICE_LABELS = {
  'ai-agents': 'AI Agent Development',
  'web3': 'Web3 / On-Chain Systems',
  'fullstack': 'Full-Stack Development',
  'marketing': 'AI Marketing for Small Business',
  'consulting': 'Consulting / Strategy Session',
  'other': 'Other',
};

function readInquiries() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch {}
  return [];
}

function writeInquiries(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write work-inquiries.json:', err);
  }
}

async function sendTelegramNotification(inquiry) {
  const serviceLabel = SERVICE_LABELS[inquiry.service] || inquiry.service || 'Unknown';
  const contact = [inquiry.email, inquiry.telegram].filter(Boolean).join(' | ') || 'no contact provided';

  const text =
    `💼 NEW WORK INQUIRY\n\n` +
    `👤 ${inquiry.name}\n` +
    `🛠 ${serviceLabel}\n` +
    `💰 ${inquiry.budget || 'not specified'}\n` +
    `⏱ ${inquiry.timeline || 'not specified'}\n\n` +
    `📝 ${inquiry.project}\n\n` +
    `📬 ${contact}`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Telegram notification failed:', err);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, telegram, project, budget, timeline, service } = body;

    if (!name || !project || !budget || !service) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inquiry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      name: name.trim(),
      email: email?.trim() || '',
      telegram: telegram?.trim() || '',
      service,
      budget,
      timeline: timeline?.trim() || '',
      project: project.trim(),
    };

    // Save to file
    const inquiries = readInquiries();
    inquiries.push(inquiry);
    writeInquiries(inquiries);

    // Notify Jiggy
    await sendTelegramNotification(inquiry);

    return NextResponse.json({ success: true, id: inquiry.id });
  } catch (err) {
    console.error('POST /api/work error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  // Lightweight health check
  return NextResponse.json({ status: 'ok', endpoint: '/api/work' });
}
