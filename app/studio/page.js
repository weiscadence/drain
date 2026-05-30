'use client';
import React, { useState, useEffect } from 'react';

// ── Colours ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0a0a0a', card: '#111', border: '#1e1e1e',
  green: '#00ff88', amber: '#f59e0b', red: '#ff4444',
  cyan: '#00d4ff', purple: '#9933ff', dim: '#555', faint: '#333',
  text: '#e8e8e8', muted: '#888',
};

const TABS = ['Overview', 'Channels', 'Queue', 'Ideas', 'Performance', 'Ads'];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtNum(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return n.toLocaleString();
  return String(n);
}

function fmtViews(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function stars(views) {
  if (views >= 1000) return '★★★';
  if (views >= 200) return '★★';
  if (views >= 50) return '★';
  return '';
}

function StatusBadge({ status }) {
  const map = {
    ready:      { icon: '🟢', label: 'READY',      color: C.green },
    uploaded:   { icon: '✅', label: 'UPLOADED',   color: C.cyan },
    pending:    { icon: '⏳', label: 'PROCESSING', color: C.amber },
    processing: { icon: '⏳', label: 'PROCESSING', color: C.amber },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      fontSize: 10, padding: '2px 8px', borderRadius: 20,
      border: `1px solid ${s.color}44`, color: s.color, background: `${s.color}11`,
      fontFamily: 'monospace', letterSpacing: '0.05em',
    }}>
      {s.icon} {s.label}
    </span>
  );
}

// ── Tab: Overview ─────────────────────────────────────────────────────────────
function OverviewTab() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/studio?action=overview').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <Spinner />;

  const { clips, channels, actions, algoTip, contentGaps, vosReady, uploadedToday, topVideo, narrative } = data;

  // Aggregate totals across channels
  const channelList = Object.values(channels || {});
  const totalChannels = channelList.length;
  const totalViews = channelList.reduce((s, c) => s + (c.views || 0), 0);
  const totalVideos = channelList.reduce((s, c) => s + (c.videos || 0), 0);

  // Priority 1 + 2 actions
  const urgentActions = (actions || []).filter(a => a.priority <= 2);

  const uploadTarget = 2;
  const hitTarget = uploadedToday >= uploadTarget;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
        <div style={{ fontSize: 28 }}>🎬</div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.2em', color: C.text }}>CONTENT STUDIO</div>
      </div>

      {/* Quick stats row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <StatTile value={totalChannels} label="channels" color={C.cyan} />
        <StatTile value={totalVideos} label="videos" color={C.green} />
        <StatTile value={fmtViews(totalViews)} label="total views" color={C.amber} />
      </div>

      {/* What to do now */}
      {urgentActions.length > 0 && (
        <Card accent={C.green}>
          <Label>🎯 WHAT TO DO NOW</Label>
          {urgentActions.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '6px 0', borderBottom: i < urgentActions.length - 1 ? `1px solid ${C.faint}` : 'none',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>
                {a.type === 'POST_VIDEO' ? '📹' : '🎙'}
              </span>
              <div>
                <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{a.label}</div>
                {a.file && (
                  <div style={{ fontSize: 11, color: C.dim, marginTop: 2, fontFamily: 'monospace' }}>
                    → {a.file}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Today stats */}
      <Card>
        <Label>📊 TODAY</Label>
        <Row>
          <span style={{ color: C.muted }}>Clips uploaded</span>
          <span style={{ color: hitTarget ? C.green : C.amber, fontWeight: 700 }}>
            {uploadedToday} / {uploadTarget} {hitTarget ? '✅' : ''}
          </span>
        </Row>
        {vosReady > 0 && (
          <Row>
            <span style={{ color: C.muted }}>VOs ready to assemble</span>
            <span style={{ color: C.purple, fontWeight: 700 }}>{vosReady}</span>
          </Row>
        )}
        {contentGaps > 0 && (
          <Row>
            <span style={{ color: C.muted }}>Channels needing content</span>
            <span style={{ color: C.amber }}>{contentGaps}</span>
          </Row>
        )}
      </Card>

      {/* Top video */}
      {topVideo && (
        <Card>
          <Label>🏆 TOP VIDEO</Label>
          <div style={{ color: C.text, fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{topVideo.title}</div>
          <div style={{ color: C.muted, fontSize: 12 }}>
            {fmtViews(topVideo.views)} views · {topVideo.likes ?? 0} likes {stars(topVideo.views)}
          </div>
          {topVideo.id && (
            <a href={`https://youtu.be/${topVideo.id}`} target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', marginTop: 8, fontSize: 11, color: C.cyan, textDecoration: 'none' }}>
              ▶ Watch on YouTube →
            </a>
          )}
        </Card>
      )}

      {/* Algo tip */}
      {algoTip && (
        <Card accent={C.amber}>
          <Label>💡 ALGO TIP</Label>
          <div style={{ color: C.amber, fontSize: 13, lineHeight: 1.6 }}>
            {algoTip.split(' | ').map((tip, i) => (
              <div key={i} style={{ marginBottom: i < algoTip.split(' | ').length - 1 ? 6 : 0 }}>
                • {tip}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Narrative */}
      {narrative && (
        <Card accent={C.purple}>
          <Label>🔥 CURRENT NARRATIVE</Label>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
            {narrative.length > 200 ? narrative.slice(0, 200) + '…' : narrative}
          </div>
        </Card>
      )}

      {/* Quick link */}
      <a href="https://studio.youtube.com" target="_blank" rel="noreferrer"
        style={{
          display: 'block', textAlign: 'center', padding: '12px',
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 12, color: C.cyan, fontSize: 13, textDecoration: 'none',
          fontFamily: 'monospace',
        }}>
        🎬 Open YouTube Studio →
      </a>
    </div>
  );
}

// ── Tab: Channels ─────────────────────────────────────────────────────────────
function ChannelsTab() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/studio?action=overview').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <Spinner />;

  const { channels = {}, actions = [] } = data;

  // Map actions by channel key
  const actionByChannel = {};
  for (const a of actions) {
    if (a.channel && !actionByChannel[a.channel]) {
      actionByChannel[a.channel] = a;
    }
  }

  // Determine status for each channel
  function getChannelMeta(key, stats) {
    const action = actionByChannel[key];
    if (key === 'streamer_clips') {
      return {
        icon: '📹',
        statusLabel: 'AUTO-PIPELINE',
        statusColor: C.cyan,
        statusIcon: '✅',
        note: 'Best channel overall · Clips auto-upload 2x/day',
        action: null,
      };
    }
    if (action?.type === 'POST_VIDEO') {
      const hasVideos = (stats.videos || 0) > 0;
      return {
        icon: '🎙',
        statusLabel: hasVideos ? 'HAS CONTENT' : 'VO READY',
        statusColor: C.green,
        statusIcon: '✅',
        note: `Next: ${action.file}`,
        subNote: hasVideos ? '→ Assemble in CapCut → Upload' : '→ First upload needed!',
        action,
      };
    }
    if (action?.type === 'GENERATE_VO') {
      return {
        icon: '🎙',
        statusLabel: 'NEEDS VO',
        statusColor: C.red,
        statusIcon: '❌',
        note: '→ Generate first VO',
        action,
      };
    }
    if ((stats.videos || 0) > 0) {
      return {
        icon: '🎙',
        statusLabel: 'ACTIVE',
        statusColor: C.amber,
        statusIcon: '✅',
        note: stats.views > 1000 ? 'Best performer (non-clips)' : null,
        action: null,
      };
    }
    return {
      icon: '🎙',
      statusLabel: 'INACTIVE',
      statusColor: C.dim,
      statusIcon: '⬜',
      note: null,
      action: null,
    };
  }

  // Build sorted channel list
  const channelEntries = Object.entries(channels).map(([key, stats]) => {
    const meta = getChannelMeta(key, stats);
    const hasAction = !!actionByChannel[key];
    return { key, stats, meta, hasAction };
  });

  // Sort: has action first, then by views desc
  channelEntries.sort((a, b) => {
    if (a.hasAction && !b.hasAction) return -1;
    if (!a.hasAction && b.hasAction) return 1;
    return (b.stats.views || 0) - (a.stats.views || 0);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ padding: '8px 0 4px' }}>
        <div style={{ fontSize: 11, color: C.dim, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
          {channelEntries.length} CHANNELS · {channelEntries.filter(c => c.hasAction).length} NEED ACTION
        </div>
      </div>

      {channelEntries.map(({ key, stats, meta }) => (
        <ChannelCard key={key} channelKey={key} stats={stats} meta={meta} />
      ))}
    </div>
  );
}

// Production notes per channel
const PRODUCTION_NOTES = {
  enlightened_eclectic: {
    nextTitle: "The Map That Shouldn't Exist",
    voFile: 'ee_piri_reis_george.mp3',
    voice: 'George',
    hook: 'In 1513, a Turkish admiral drew Antarctica — 307 years before it was discovered.',
    textOverlays: ['1513', 'OTTOMAN ADMIRAL', '307 YEARS BEFORE DISCOVERY', 'UNDER THE ICE', 'DRAW YOUR OWN CONCLUSIONS'],
    broll: ['piri reis map', 'antarctica aerial', 'ground penetrating radar', 'ancient map scroll', 'istanbul palace'],
    music: 'Dark ambient documentary — search "ancient mystery ambient"',
    format: 'Shorts cut ~90s + optional long form',
    ytTitle: "The Map That Shouldn't Exist — And Nobody Can Explain Why",
    tikTok: ['The map that proves someone was here before us 🗺️', 'This map from 1513 shouldn\'t exist…'],
  },
  let_us_win_the_day: {
    nextTitle: 'Morning Habit of Marcus Aurelius',
    voFile: 'lutd_morning_habit_brian.mp3',
    voice: 'Brian',
    hook: 'Every morning, the most powerful man alive wrote down why he might fail today.',
    textOverlays: ['EVERY MORNING', 'HE PREPARED FOR FAILURE', 'NOT WEAKNESS', 'STRATEGY', 'MEDITATIONS'],
    broll: ['person writing alone dark', 'ancient roman stone', 'candlelight minimal', 'crowd slow motion'],
    music: 'Near silent or very subtle dark ambient — 8-10% vol MAX',
    format: 'Shorts cut ~60-90s',
    ytTitle: 'The Morning Habit That Made Marcus Aurelius Unbreakable',
    tikTok: ['Every morning he wrote down why he might fail. Here\'s why.', 'The most powerful man alive did this first thing every morning.'],
  },
};

function ChannelCard({ channelKey, stats, meta }) {
  const [expanded, setExpanded] = React.useState(false);
  const notes = PRODUCTION_NOTES[channelKey];

  return (
    <div style={{
      background: C.card,
      border: `1px solid ${expanded ? meta.statusColor + '66' : C.border}`,
      borderLeft: `3px solid ${meta.statusColor}`,
      borderRadius: 12,
      padding: '12px 14px',
      cursor: 'pointer',
    }} onClick={() => setExpanded(!expanded)}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
          {meta.icon} {stats.title || channelKey}
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{
            fontSize: 10, padding: '2px 8px', borderRadius: 20,
            border: `1px solid ${meta.statusColor}44`,
            color: meta.statusColor, background: `${meta.statusColor}11`,
            fontFamily: 'monospace', letterSpacing: '0.05em', flexShrink: 0,
          }}>
            {meta.statusIcon} {meta.statusLabel}
          </span>
          {notes && <span style={{ color: C.dim, fontSize: 14 }}>{expanded ? '▲' : '▼'}</span>}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ fontSize: 12, color: C.dim, marginBottom: 8, fontFamily: 'monospace' }}>
        {stats.videos ?? 0} videos · {fmtNum(stats.views)} views
        {stats.subs > 0 ? ` · ${stats.subs} subs` : ''}
      </div>

      {/* Note / next action */}
      {meta.note && (
        <div style={{ fontSize: 12, color: C.muted, marginBottom: meta.subNote ? 2 : 0 }}>
          {meta.note}
        </div>
      )}
      {meta.subNote && (
        <div style={{ fontSize: 11, color: C.dim, marginBottom: 4 }}>
          {meta.subNote}
        </div>
      )}

      {/* Action button */}
      {meta.action?.type === 'POST_VIDEO' && (
        <a
          href="https://studio.youtube.com"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline-block', marginTop: 8, padding: '6px 14px',
            background: `${C.green}22`, border: `1px solid ${C.green}44`,
            borderRadius: 8, color: C.green, fontSize: 11,
            fontWeight: 700, textDecoration: 'none', fontFamily: 'monospace',
          }}
        >
          📹 Assemble &amp; Upload →
        </a>
      )}
      {meta.action?.type === 'GENERATE_VO' && (
        <div style={{
          display: 'inline-block', marginTop: 8, padding: '6px 14px',
          background: `${C.red}11`, border: `1px solid ${C.red}33`,
          borderRadius: 8, color: C.red, fontSize: 11, fontFamily: 'monospace',
        }}>
          🎙 Run VO generator
        </div>
      )}

      {/* Expanded production notes */}
      {expanded && notes && (
        <div style={{ marginTop: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }} onClick={e => e.stopPropagation()}>
          
          {/* Next video */}
          <div style={{ fontSize: 11, letterSpacing: '.12em', color: C.dim, marginBottom: 6 }}>NEXT VIDEO</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{notes.nextTitle}</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, fontStyle: 'italic' }}>Hook: "{notes.hook}"</div>

          {/* VO file */}
          {notes.voFile && (
            <div style={{ marginBottom: 10, padding: '8px 10px', background: '#0a1a0a', borderRadius: 8, border: `1px solid ${C.green}33` }}>
              <div style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>🎙 VO READY — {notes.voice}</div>
              <a href={`/studio/assets/${notes.voFile}`} download
                style={{ fontSize: 11, color: C.green, textDecoration: 'none' }}
                onClick={e => e.stopPropagation()}>
                ⬇ Download: {notes.voFile}
              </a>
            </div>
          )}

          {/* Text overlays */}
          <div style={{ fontSize: 10, letterSpacing: '.12em', color: C.dim, marginBottom: 4 }}>TEXT OVERLAYS</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {(notes.textOverlays || []).map((t, i) => (
              <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: '#222', color: C.text, fontWeight: 700 }}>{t}</span>
            ))}
          </div>

          {/* B-roll */}
          <div style={{ fontSize: 10, letterSpacing: '.12em', color: C.dim, marginBottom: 4 }}>PEXELS B-ROLL SEARCHES</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, lineHeight: 1.7 }}>
            {(notes.broll || []).map((b, i) => <span key={i} style={{ marginRight: 8 }}>"{b}"</span>)}
          </div>

          {/* Music */}
          <div style={{ fontSize: 10, letterSpacing: '.12em', color: C.dim, marginBottom: 4 }}>MUSIC</div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{notes.music}</div>

          {/* Titles */}
          <div style={{ fontSize: 10, letterSpacing: '.12em', color: C.dim, marginBottom: 4 }}>YOUTUBE TITLE</div>
          <div style={{ fontSize: 11, color: C.amber, marginBottom: 6, fontWeight: 600 }}>{notes.ytTitle}</div>

          <div style={{ fontSize: 10, letterSpacing: '.12em', color: C.dim, marginBottom: 4 }}>TIKTOK HOOKS</div>
          {(notes.tikTok || []).map((t, i) => (
            <div key={i} style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>• {t}</div>
          ))}

          <div style={{ fontSize: 10, color: C.dim, marginTop: 8 }}>Format: {notes.format}</div>
        </div>
      )}
    </div>
  );
}

// ── Tab: Queue ────────────────────────────────────────────────────────────────
function QueueTab() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/studio?action=queue').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <Spinner />;

  const clips = data.clips || [];
  const ready = clips.filter(c => c.status === 'ready');
  const uploaded = clips.filter(c => c.status === 'uploaded');
  const other = clips.filter(c => c.status !== 'ready' && c.status !== 'uploaded');

  const ClipItem = ({ clip }) => (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ fontSize: 13, color: C.text, fontWeight: 600, flex: 1, lineHeight: 1.4 }}>
          {clip.title || clip.file || 'Untitled clip'}
        </div>
        <StatusBadge status={clip.status} />
      </div>
      {clip.channel && (
        <div style={{ fontSize: 11, color: C.dim }}>📺 {clip.channel}</div>
      )}
      {clip.status === 'ready' && (
        <a href="https://studio.youtube.com/channel/UCalx7hYuOq4Mt6CrfeQyGbw/videos/upload"
          target="_blank" rel="noreferrer"
          style={{
            display: 'block', textAlign: 'center', padding: '8px 14px',
            background: C.green, color: '#000', borderRadius: 10,
            fontSize: 12, fontWeight: 700, textDecoration: 'none', marginTop: 4,
          }}>
          Upload Now →
        </a>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8, padding: '8px 0' }}>
        <Pill color={C.green}>{ready.length} READY</Pill>
        <Pill color={C.cyan}>{uploaded.length} UPLOADED</Pill>
        {other.length > 0 && <Pill color={C.amber}>{other.length} PROCESSING</Pill>}
      </div>

      {ready.length > 0 && (
        <>
          <SectionLabel>🟢 Ready to Upload</SectionLabel>
          {ready.map((c, i) => <ClipItem key={i} clip={c} />)}
        </>
      )}

      {uploaded.length > 0 && (
        <>
          <SectionLabel>✅ Uploaded</SectionLabel>
          {uploaded.map((c, i) => <ClipItem key={i} clip={c} />)}
        </>
      )}

      {other.length > 0 && (
        <>
          <SectionLabel>⏳ Processing</SectionLabel>
          {other.map((c, i) => <ClipItem key={i} clip={c} />)}
        </>
      )}

      {clips.length === 0 && (
        <div style={{ textAlign: 'center', color: C.dim, padding: '40px 0', fontSize: 13 }}>
          Queue is empty
        </div>
      )}
    </div>
  );
}

// ── Tab: Ideas ────────────────────────────────────────────────────────────────
function IdeasTab() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/studio?action=content-ideas').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <Spinner />;

  const { viral = [], ideas = [], narrative = '' } = data;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {viral.length > 0 && (
        <Card accent={C.red}>
          <Label>🔥 VIRAL NOW</Label>
          {viral.map((s, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <a href={s.url} target="_blank" rel="noreferrer"
                style={{ color: C.text, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                {s.title}
              </a>
              {s.points > 0 && (
                <span style={{ color: C.dim, fontSize: 11, marginLeft: 6 }}>
                  {s.points} pts
                </span>
              )}
            </div>
          ))}
        </Card>
      )}

      {ideas.length > 0 && (
        <Card>
          <Label>💡 POST IDEAS</Label>
          {ideas.map((idea, i) => (
            <div key={i} style={{
              background: '#0d0d0d', borderRadius: 8, padding: '8px 10px',
              marginBottom: 6, fontSize: 12, color: C.muted, lineHeight: 1.5,
            }}>
              {typeof idea === 'string' ? idea : idea.idea || JSON.stringify(idea)}
            </div>
          ))}
        </Card>
      )}

      {narrative && (
        <Card accent={C.purple}>
          <Label>📡 NARRATIVE</Label>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>{narrative}</div>
        </Card>
      )}

      {viral.length === 0 && ideas.length === 0 && (
        <div style={{ textAlign: 'center', color: C.dim, padding: '40px 0', fontSize: 13 }}>
          No signals yet — scout runs at midnight UTC
        </div>
      )}
    </div>
  );
}

// ── Tab: Performance ──────────────────────────────────────────────────────────
function PerformanceTab() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/studio?action=performance').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <Spinner />;

  const videos = data.videos || [];
  const maxViews = Math.max(...videos.map(v => v.views || 0), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.insights && (
        <Card accent={C.amber}>
          <Label>💡 INSIGHT</Label>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{data.insights}</div>
        </Card>
      )}

      <SectionLabel>📊 Videos by Views</SectionLabel>

      {videos.map((v, i) => {
        const pct = Math.round(((v.views || 0) / maxViews) * 100);
        const color = i === 0 ? C.amber : i === 1 ? C.cyan : C.green;
        return (
          <div key={i} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '10px 12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ fontSize: 12, color: C.text, fontWeight: 600, flex: 1, marginRight: 8 }}>
                {v.title}
              </div>
              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <span style={{ color, fontWeight: 700, fontSize: 13 }}>{fmtViews(v.views)}</span>
                <span style={{ color: C.dim, fontSize: 11, marginLeft: 4 }}>{stars(v.views || 0)}</span>
              </div>
            </div>
            <div style={{ background: '#1a1a1a', borderRadius: 4, height: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.5s' }} />
            </div>
            {v.likes > 0 && (
              <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>
                {v.likes} likes
                {v.id && (
                  <a href={`https://youtu.be/${v.id}`} target="_blank" rel="noreferrer"
                    style={{ color: C.cyan, textDecoration: 'none', marginLeft: 8 }}>▶ watch</a>
                )}
              </div>
            )}
          </div>
        );
      })}

      {videos.length === 0 && (
        <div style={{ textAlign: 'center', color: C.dim, padding: '40px 0', fontSize: 13 }}>
          No performance data yet
        </div>
      )}
    </div>
  );
}

// ── Tab: Ads ──────────────────────────────────────────────────────────────────
function AdsTab() {
  const channels = [
    {
      icon: '🎯', title: 'META / GOOGLE ADS', color: C.cyan,
      status: 'Not set up', statusColor: C.amber,
      items: [
        'Best for: Drain.fun, /work page, Miladi NFT',
        'Budget: $5–20/day to start',
        'Targeting: crypto twitter lookalikes',
      ],
      action: { label: 'Connect Ad Account', url: 'https://business.facebook.com' },
    },
    {
      icon: '🛍️', title: 'TIKTOK SHOP', color: C.purple,
      status: 'Not set up', statusColor: C.amber,
      items: [
        'Best for: Merch, digital products, consulting',
        'Monetise FREQ audience directly',
        'Commission-based → low risk',
      ],
      action: { label: 'Apply at shop.tiktok.com', url: 'https://shop.tiktok.com' },
    },
    {
      icon: '📱', title: 'ORGANIC CONTENT', color: C.green,
      status: 'Active', statusColor: C.green,
      items: [
        'Strategy: FREQ (daily clips) → WEIS (rare drops)',
        'Current: 2 uploads/day to YT Shorts',
        'Next: Start TikTok reposts of best clips',
        'Next: Cross-post to Instagram Reels',
      ],
      action: null,
    },
    {
      icon: '💼', title: 'CONTENT FOR /work PAGE', color: C.amber,
      status: 'In progress', statusColor: C.amber,
      items: [
        'Every build we ship → blog post',
        'Every signal win → tweet thread',
        'Every prop challenge result → content',
        'FREQ presence = trust = clients',
      ],
      action: { label: 'View /work Page', url: 'https://drainfun.xyz/work' },
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ textAlign: 'center', padding: '12px 0 4px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text, letterSpacing: '0.15em' }}>
          📢 MARKETING CHANNELS
        </div>
        <div style={{ color: C.dim, fontSize: 11, marginTop: 4 }}>Growth plan · FREQ → WEIS funnel</div>
      </div>

      {channels.map((ch, i) => (
        <div key={i} style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderLeft: `3px solid ${ch.color}`, borderRadius: 12,
          padding: '14px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
              {ch.icon} {ch.title}
            </div>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 20,
              border: `1px solid ${ch.statusColor}44`, color: ch.statusColor,
              background: `${ch.statusColor}11`, fontFamily: 'monospace',
            }}>
              {ch.status}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: ch.action ? 10 : 0 }}>
            {ch.items.map((item, j) => (
              <div key={j} style={{ fontSize: 12, color: C.muted, paddingLeft: 4 }}>→ {item}</div>
            ))}
          </div>
          {ch.action && (
            <a href={ch.action.url} target="_blank" rel="noreferrer"
              style={{
                display: 'block', textAlign: 'center', padding: '8px 12px',
                background: '#1a1a1a', border: `1px solid ${ch.color}44`,
                borderRadius: 8, color: ch.color, fontSize: 12,
                textDecoration: 'none', fontFamily: 'monospace',
              }}>
              {ch.action.label} →
            </a>
          )}
        </div>
      ))}

      <Card accent={C.purple}>
        <Label>💰 REVENUE ROADMAP</Label>
        {[
          { phase: '1 · NOW', label: 'YT Shorts monetisation', status: '2 uploads/day', color: C.amber },
          { phase: '2 · SOON', label: 'TikTok reposts', status: 'Not started', color: C.dim },
          { phase: '3 · NEXT', label: 'Paid ads — drain.fun', status: 'Not started', color: C.dim },
          { phase: '4 · LATER', label: 'TikTok Shop / merch', status: 'Not started', color: C.dim },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div>
              <span style={{ fontSize: 10, color: C.dim, fontFamily: 'monospace' }}>{r.phase} </span>
              <span style={{ fontSize: 12, color: C.muted }}>{r.label}</span>
            </div>
            <span style={{ fontSize: 11, color: r.color, fontFamily: 'monospace' }}>{r.status}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── Small UI components ───────────────────────────────────────────────────────
function StatTile({ value, label, color }) {
  return (
    <div style={{
      flex: 1, background: C.card, border: `1px solid ${C.border}`,
      borderTop: `2px solid ${color}`, borderRadius: 10, padding: '10px 8px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 20, fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</div>
      <div style={{ fontSize: 10, color: C.dim, marginTop: 2, letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}

function Card({ children, accent }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderLeft: accent ? `3px solid ${accent}` : undefined,
      borderRadius: 12, padding: '12px 14px',
    }}>
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontSize: 10, color: C.dim, fontFamily: 'monospace',
      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8,
    }}>
      {children}
    </div>
  );
}

function Row({ children }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 6, fontSize: 13,
    }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, color: C.dim, fontFamily: 'monospace',
      letterSpacing: '0.1em', textTransform: 'uppercase',
      padding: '4px 0',
    }}>
      {children}
    </div>
  );
}

function Pill({ children, color }) {
  return (
    <span style={{
      fontSize: 11, padding: '4px 10px', borderRadius: 20,
      border: `1px solid ${color}44`, color, background: `${color}11`,
      fontFamily: 'monospace',
    }}>
      {children}
    </span>
  );
}

function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 0', color: C.dim, fontSize: 13 }}>
      loading…
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function StudioPage() {
  const [tab, setTab] = useState(0);

  // Telegram WebApp init
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const twa = window.Telegram.WebApp;
      twa.ready();
      twa.expand();
      try { twa.setHeaderColor('#0a0a0a'); twa.setBackgroundColor('#0a0a0a'); } catch {}
    }
  }, []);

  const tabContent = [
    <OverviewTab key="overview" />,
    <ChannelsTab key="channels" />,
    <QueueTab key="queue" />,
    <IdeasTab key="ideas" />,
    <PerformanceTab key="perf" />,
    <AdsTab key="ads" />,
  ];

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text,
      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
      maxWidth: 480, margin: '0 auto',
    }}>
      {/* Tab nav */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: C.bg, borderBottom: `1px solid ${C.border}`,
        display: 'flex', overflowX: 'auto',
      }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            flex: 1, minWidth: 70, padding: '12px 4px',
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 11, fontFamily: 'monospace',
            color: tab === i ? C.amber : C.dim,
            borderBottom: tab === i ? `2px solid ${C.amber}` : '2px solid transparent',
            whiteSpace: 'nowrap', transition: 'color 0.15s',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '12px 14px 40px' }}>
        {tabContent[tab]}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', fontSize: 10, color: C.faint,
        padding: '8px 0 20px', fontFamily: 'monospace',
      }}>
        cadence 〰️ · drainfun.xyz
      </div>
    </div>
  );
}
