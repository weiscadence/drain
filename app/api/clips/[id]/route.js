import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PROCESSED_DIR = '/home/ubuntu/.openclaw/workspace/projects/clips/processed';

export async function GET(request, { params }) {
  const { id } = await params;
  const filePath = path.join(PROCESSED_DIR, `${id}.mp4`);
  
  if (!fs.existsSync(filePath) || id.includes('..')) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });
    return new Response(fileStream, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': String(chunkSize),
        'Content-Type': 'video/mp4',
      },
    });
  }

  const fileStream = fs.createReadStream(filePath);
  return new Response(fileStream, {
    headers: {
      'Content-Length': String(fileSize),
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Content-Disposition': `inline; filename="${id}.mp4"`,
    },
  });
}
