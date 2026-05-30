'use client';
import { useState, useEffect } from 'react';

export default function ClipsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/clips').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  const queue = data?.queue || [];
  const stats = data?.stats || {};
  const logs = data?.recent_log || [];
  const goodClips = queue.filter(c => c.file_size_mb > 1);

  return (
    <div style={{minHeight:'100vh',background:'#080808',color:'#fff',fontFamily:'monospace',padding:'32px 24px',maxWidth:'960px',margin:'0 auto'}}>
      
      <div style={{marginBottom:'28px'}}>
        <h1 style={{fontSize:'20px',fontWeight:'700',margin:0}}>〰️ clips</h1>
        <p style={{color:'#444',fontSize:'12px',margin:'4px 0 0'}}>iShowSpeed · Kai Cenat · MrBeast — vertical shorts pipeline</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px',marginBottom:'28px'}}>
        {[
          {l:'ready', v:stats.ready??0, c:'#00ff88'},
          {l:'uploaded', v:stats.uploaded??0, c:'#888'},
          {l:'processed today', v:stats.processed_today??0, c:'#fff'},
          {l:'disk used', v:stats.disk_mb?`${stats.disk_mb}MB`:'—', c:'#555'},
        ].map(s => (
          <div key={s.l} style={{background:'#111',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'14px'}}>
            <div style={{fontSize:'20px',fontWeight:'700',color:s.c}}>{s.v}</div>
            <div style={{fontSize:'11px',color:'#444',marginTop:'3px'}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Video grid */}
      {goodClips.length === 0 ? (
        <div style={{background:'#0d0d0d',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'40px',textAlign:'center',color:'#333'}}>
          pipeline runs at midnight + noon UTC — check back then
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px',marginBottom:'28px'}}>
          {goodClips.map(clip => {
            const clipId = clip.path?.split('/').pop()?.replace('.mp4','');
            return (
              <div key={clip.id} style={{background:'#0d0d0d',border:'1px solid #1a1a1a',borderRadius:'12px',overflow:'hidden'}}>
                <video
                  controls
                  playsInline
                  style={{width:'100%',aspectRatio:'9/16',background:'#000',display:'block'}}
                  src={`/api/clips/${clipId}`}
                />
                <div style={{padding:'12px'}}>
                  <div style={{fontSize:'12px',fontWeight:'600',marginBottom:'4px'}}>{clip.source_channel}</div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',color:'#444'}}>
                    <span>{clip.file_size_mb}MB</span>
                    <a 
                      href={`/api/clips/${clipId}`} 
                      download={`${clip.source_channel}-short.mp4`}
                      style={{color:'#00ff88',textDecoration:'none'}}
                    >
                      ↓ download
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log */}
      <div>
        <div style={{fontSize:'11px',color:'#333',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px'}}>pipeline log</div>
        <div style={{background:'#0a0a0a',border:'1px solid #1a1a1a',borderRadius:'10px',padding:'14px',maxHeight:'200px',overflowY:'auto'}}>
          {logs.slice(0,30).map((l,i) => (
            <div key={i} style={{fontSize:'11px',lineHeight:'1.6',color:l.includes('✅')?'#00ff88':l.includes('Error')||l.includes('failed')?'#ff4444':'#333'}}>{l}</div>
          ))}
        </div>
      </div>

    </div>
  );
}
