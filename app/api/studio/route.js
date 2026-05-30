import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';

function readJson(f, def) { try { return JSON.parse(readFileSync(f,'utf8')); } catch { return def; } }
const W = '/home/ubuntu/.openclaw/workspace';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  if (action === 'overview') {
    const brief    = readJson(`${W}/data/studio-brief.json`, {});
    // Live YouTube stats from Google API (refreshed every 4h)
    const ytLive   = readJson(`${W}/projects/drain/public/studio/yt-stats.json`, {});
    const ytState  = readJson(`${W}/data/youtube-uploader-state.json`, {});
    const ytPerf   = readJson(`${W}/data/youtube-performance.json`, { videos: [] });
    const queue    = readJson(`${W}/projects/clips/queue/clip-queue.json`, { clips: [] });
    const clips    = queue.clips || [];
    const ytResearch = readJson(`${W}/data/yt-research.json`, {});

    const ready    = clips.filter(c => c.status === 'ready').length;
    const uploaded = clips.filter(c => c.status === 'uploaded').length;
    const pending  = clips.filter(c => c.status !== 'ready' && c.status !== 'uploaded').length;

    // Merge live YT stats with brief stats (live takes priority)
    const liveChannels = ytLive.stats || {};
    const mergedChannels = { ...(brief.stats || {}), ...liveChannels };

    // Total views/videos across all channels
    const totalViews  = Object.values(mergedChannels).reduce((s,c) => s + (c.views||0), 0);
    const totalVideos = Object.values(mergedChannels).reduce((s,c) => s + (c.videos||0), 0);

    // Top performing video
    const videos = ytPerf.videos || [];
    const topVideo = videos.sort((a,b) => (b.views||0) - (a.views||0))[0] || null;

    // Uploaded today from uploader state
    const today = new Date().toDateString();
    const dailyCount = ytState.daily_count || {};
    const uploadedToday = dailyCount[today] || ytState.uploadedToday || brief.clips?.uploadedToday || 0;

    return NextResponse.json({
      success: true,
      clips: { ready, uploaded, pending, total: clips.length },
      channels: mergedChannels,
      totalViews, totalVideos,
      statsUpdatedAt: ytLive.updated ? new Date(ytLive.updated * 1000).toISOString() : null,
      actions: brief.actions || [],
      topChannel: brief.top_channel || {},
      algoTip: brief.algo_tip || '',
      contentGaps: brief.content_gaps || 0,
      uploadedToday,
      topVideo,
      vosReady: brief.vos_ready || 0,
      bestPractices: (ytResearch.best_practices || []).slice(0, 5),
      narrative: readJson(`${W}/data/narrative-current.json`, {}).narrative || '',
    });
  }

  if (action === 'queue') {
    const queue = readJson(`${W}/projects/clips/queue/clip-queue.json`, { clips: [] });
    return NextResponse.json({ success: true, clips: queue.clips || [] });
  }

  if (action === 'content-ideas') {
    const scout   = readJson(`${W}/data/content-scout.json`, {});
    const narr    = readJson(`${W}/data/narrative-current.json`, {});
    // content-scout has a 'runs' array, latest is last
    const runs = scout.runs || [];
    const latest = runs[runs.length - 1] || scout.latest || {};
    const signals = latest.signals || [];
    return NextResponse.json({
      success: true,
      viral: signals.filter(s => s.type === 'viral_signal').slice(0, 5),
      ideas: latest.post_ideas || [],
      narrative: narr.narrative || '',
    });
  }

  if (action === 'performance') {
    const ytPerf = readJson(`${W}/data/youtube-performance.json`, { videos: [] });
    const videos = (ytPerf.videos || []).sort((a,b) => (b.views||0) - (a.views||0)).slice(0, 20);
    return NextResponse.json({ success: true, videos, insights: ytPerf.insights || '' });
  }

  return NextResponse.json({ success: true, message: 'Content Studio API' });
}

// Export production notes per channel
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { channel } = body;
  
  const scriptMap = {
    enlightened_eclectic: `${W}/projects/channels/scripts/ee_gobekli_part3_production.md`,
    let_us_win_the_day: `${W}/projects/channels/scripts/lutd_ep03_production.md`,
  };
  
  if (channel && scriptMap[channel]) {
    const fs = require('fs');
    try {
      const content = fs.readFileSync(scriptMap[channel], 'utf8');
      return NextResponse.json({ success: true, channel, notes: content });
    } catch {
      return NextResponse.json({ success: false, error: 'Notes not found' });
    }
  }
  
  return NextResponse.json({ success: false, error: 'Unknown channel' });
}
