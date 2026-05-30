'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function RevealContent() {
  const params = useSearchParams();
  const id = parseInt(params.get('id') || '1');
  const [pieces, setPieces] = useState([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    fetch('/miladi/pieces.json')
      .then(r => r.json())
      .then(data => {
        setPieces(data);
        setTimeout(() => setRevealed(true), 600);
      });
  }, []);

  const piece = pieces[id - 1] || pieces[0];

  return (
    <div style={{
      minHeight: '100vh', background: '#050206',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'ui-monospace,monospace', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(100,50,200,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>

      <div style={{ fontSize: 9, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.2)', marginBottom: 20, opacity: revealed ? 1 : 0, transition: 'opacity 0.5s 0.3s' }}>
        MILADI #{String(id).padStart(3, '0')} / 333
      </div>

      {piece && (
        <div style={{
          width: 320, height: 320, borderRadius: 4, overflow: 'hidden',
          boxShadow: revealed ? '0 0 60px rgba(120,60,255,0.4), 0 0 120px rgba(120,60,255,0.15)' : 'none',
          transform: `scale(${revealed ? 1 : 0.85})`,
          opacity: revealed ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          <img src={piece} alt={`Miladi #${id}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ marginTop: 32, textAlign: 'center', opacity: revealed ? 1 : 0, transition: 'opacity 0.5s 1s' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
          33 QUAI · 333 TOTAL · 1/1 TRAITS
        </div>
        <a href="/miladi" style={{
          display: 'inline-block',
          background: 'rgba(120,60,255,0.15)',
          border: '1px solid rgba(120,60,255,0.5)',
          color: 'rgba(180,140,255,0.9)',
          padding: '12px 32px', fontSize: 10, letterSpacing: '0.3em',
          textDecoration: 'none',
        }}>MINT NOW →</a>
      </div>

      <div style={{ marginTop: 20, fontSize: 9, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.1)', opacity: revealed ? 1 : 0, transition: 'opacity 0.5s 1.5s' }}>
        drainfun.xyz/miladi
      </div>
    </div>
  );
}

export default function MiladiReveal() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#050206' }} />}>
      <RevealContent />
    </Suspense>
  );
}
