import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const QUEUE_FILE = '/home/ubuntu/.openclaw/workspace/projects/clips/queue/clip-queue.json';
const PROCESSED_DIR = '/home/ubuntu/.openclaw/workspace/projects/clips/processed';
const LOG_FILE = '/home/ubuntu/.openclaw/workspace/data/logs/clip-pipeline.log';

export async function GET() {
  try {
    // Load queue
    let queue = [];
    try {
      const q = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
      queue = q.clips || [];
    } catch {}

    // Stats
    let diskBytes = 0;
    let processedToday = 0;
    const today = new Date().toDateString();
    try {
      const files = fs.readdirSync(PROCESSED_DIR);
      for (const f of files) {
        const stat = fs.statSync(path.join(PROCESSED_DIR, f));
        diskBytes += stat.size;
        if (new Date(stat.mtime).toDateString() === today) processedToday++;
      }
    } catch {}

    // Recent log lines
    let recent_log = [];
    try {
      const logContent = fs.readFileSync(LOG_FILE, 'utf8');
      recent_log = logContent.trim().split('\n').slice(-50).reverse();
    } catch {}

    const stats = {
      ready: queue.filter(c => c.status === 'ready').length,
      uploaded: queue.filter(c => c.status === 'uploaded').length,
      processed_today: processedToday,
      disk_mb: Math.round(diskBytes / 1024 / 1024),
    };

    return NextResponse.json({ queue, stats, recent_log });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
