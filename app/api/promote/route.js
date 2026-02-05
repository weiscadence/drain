import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PROMO_FILE = path.join(CONTENT_DIR, 'promotions.json');

// Ensure content directory exists
async function ensureContentDir() {
  try {
    await fs.access(CONTENT_DIR);
  } catch {
    await fs.mkdir(CONTENT_DIR, { recursive: true });
  }
}

// Load promotions
async function loadPromotions() {
  try {
    const data = await fs.readFile(PROMO_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save promotions
async function savePromotions(promotions) {
  await ensureContentDir();
  await fs.writeFile(PROMO_FILE, JSON.stringify(promotions, null, 2));
}

export async function GET() {
  try {
    const promotions = await loadPromotions();
    return NextResponse.json({ 
      count: promotions.length,
      promotions: promotions.slice(-20).reverse() // Last 20, newest first
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load promotions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { projectName, description, url, tagline } = body;
    if (!projectName || !description || !url || !tagline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Basic validation
    if (projectName.length > 100 || tagline.length > 150 || description.length > 1000) {
      return NextResponse.json({ error: 'Content too long' }, { status: 400 });
    }

    // Create promotion entry
    const promotion = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      projectName: projectName.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      url: url.trim(),
      twitter: body.twitter?.trim() || null,
      status: 'pending', // pending, promoted, rejected
      submittedAt: new Date().toISOString(),
      promotedAt: null,
      platforms: [], // Will be filled when promoted
    };

    // Save
    const promotions = await loadPromotions();
    promotions.push(promotion);
    await savePromotions(promotions);

    return NextResponse.json({ 
      success: true, 
      id: promotion.id,
      message: 'Submitted for promotion. Check LobChan in 24h.'
    });
  } catch (error) {
    console.error('Promote error:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
