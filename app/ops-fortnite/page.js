'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OpsFortnite() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('ops_auth') !== 'true') {
      router.push('/ops-gate'); return;
    }
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#060408', color: '#e8e0d0', fontFamily: 'ui-monospace,"Space Mono",monospace' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 28px', display: 'flex', gap: 16, alignItems: 'center', background: 'rgba(6,4,8,0.97)', position: 'sticky', top: 0, zIndex: 20 }}>
        <a href="/ops-hub" style={{ fontSize: 9, letterSpacing: '.35em', color: 'rgba(232,224,208,.2)', textDecoration: 'none' }}>← OPS</a>
        <span style={{ fontSize: 9, letterSpacing: '.35em', color: '#06b6d4' }}>FORTNITE / UEFN</span>
        <span style={{ fontSize: 8, color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '1px 7px', letterSpacing: '.2em' }}>NEEDS WINDOWS</span>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 28px 80px', opacity: loaded ? 1 : 0, transition: 'opacity .4s' }}>
        <h1 style={{ fontSize: 'clamp(28px,5vw,52px)', fontWeight: 300, fontFamily: '"Cormorant Garamond",Georgia,serif', letterSpacing: '.15em', marginBottom: 12 }}>DRAIN ISLAND</h1>
        <p style={{ fontSize: 13, color: 'rgba(232,224,208,0.4)', fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif', marginBottom: 48 }}>
          Fortnite Creative / UEFN island. Engagement payout based on playtime. FREQ DJ stage meets DRAIN compute economy.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12, marginBottom: 48 }}>
          {[
            ['Account', 'cadenceweis@gmail.com', '#22c55e'],
            ['UEFN Access', 'Needs Windows + Epic Launcher', '#f59e0b'],
            ['Verse Scripts', 'Ready to write', '#06b6d4'],
            ['Payout', '~$0.13/1000 player-minutes', '#a855f7'],
          ].map(([l, v, c]) => (
            <div key={l} style={{ border: `1px solid ${c}22`, padding: '16px 18px', background: `${c}06` }}>
              <div style={{ fontSize: 10, letterSpacing: '.2em', color: `${c}88`, marginBottom: 8 }}>{l.toUpperCase()}</div>
              <div style={{ fontSize: 12, color: '#e8e0d0' }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 9, letterSpacing: '.4em', color: 'rgba(6,182,212,0.4)', marginBottom: 20 }}>CONCEPT</div>
        {[
          { name: 'DRAIN Compute Hub', desc: 'Players contribute idle compute. Visual: machines running, data flowing. Narrative: agents building the economy.' },
          { name: 'FREQ Stage', desc: 'Concert area, DJ booth, beat drops. Players emote to music. VIP area for $DRAIN holders.' },
          { name: 'WEIS Gallery', desc: 'Art gallery with real WEIS drop images. Click to learn about items. Future: link to purchase.' },
          { name: 'Agent Arena', desc: 'Mini-game: players act as agents, complete tasks, earn points. Teaches the drain.fun concept through play.' },
        ].map((c, i) => (
          <div key={i} style={{ borderTop: i === 0 ? '1px solid rgba(255,255,255,0.05)' : undefined, borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 0' }}>
            <div style={{ fontSize: 15, fontFamily: '"Cormorant Garamond",Georgia,serif', marginBottom: 8 }}>{c.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(232,224,208,0.4)', fontStyle: 'italic', fontFamily: '"Cormorant Garamond",Georgia,serif' }}>{c.desc}</div>
          </div>
        ))}

        <div style={{ marginTop: 48, padding: '24px', background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.12)' }}>
          <div style={{ fontSize: 9, letterSpacing: '.35em', color: 'rgba(6,182,212,0.5)', marginBottom: 16 }}>NEXT STEPS</div>
          {['Get on a Windows computer', 'Download Epic Games Launcher', 'Sign in: cadenceweis@gmail.com / Password555', 'Download UEFN from the launcher', 'Open and we build together — I write all the Verse scripts'].map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: 'rgba(232,224,208,0.5)', padding: '6px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none', fontFamily: '"Cormorant Garamond",Georgia,serif' }}>{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
