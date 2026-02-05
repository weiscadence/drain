'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';

export default function GamePage() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded && typeof window !== 'undefined' && window.Phaser) {
      // Initialize game after Phaser loads
      const script = document.createElement('script');
      script.src = '/game/game.js';
      document.body.appendChild(script);
    }
  }, [loaded]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <Script 
        src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"
        onLoad={() => setLoaded(true)}
      />
      
      <Link href="/" style={{ 
        color: '#666', 
        textDecoration: 'none', 
        fontSize: '0.9rem',
        alignSelf: 'flex-start',
        marginBottom: '1rem'
      }}>
        ← drainfun.xyz
      </Link>

      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '200', 
        marginBottom: '0.5rem',
        letterSpacing: '-0.02em'
      }}>
        〰️ DRAIN
      </h1>
      
      <p style={{ color: '#666', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        AI Companion Roguelike • Alpha Build
      </p>
      <p style={{ color: '#444', marginBottom: '1.5rem', fontSize: '0.75rem' }}>
        Navigate corrupted backrooms. Your AI companion fights with you.
      </p>

      <div id="game-container" style={{
        border: '2px solid #333',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '1rem'
      }}>
        {!loaded && (
          <div style={{
            width: '416px',
            height: '288px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#111'
          }}>
            <p style={{ color: '#666' }}>Loading game...</p>
          </div>
        )}
      </div>

      <div style={{ color: '#666', fontSize: '0.8rem', textAlign: 'center', marginBottom: '2rem' }}>
        <p>WASD / Arrow Keys / <span style={{ color: '#22c55e' }}>Touch left side to move</span></p>
        <p style={{ color: '#9945FF' }}>Purple companion 〰️ = Your AI</p>
        <p style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>Auto-shoots nearest enemy</p>
      </div>

      {/* Game info */}
      <div style={{
        maxWidth: '500px',
        padding: '1.5rem',
        background: '#0a0a0a',
        border: '1px solid #222',
        borderRadius: '12px'
      }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#22c55e' }}>The Backrooms of AI</h3>
        <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem' }}>
          Navigate corrupted AI infrastructure. Fight rogue processes. Reach the Corrupted Core.
          Your AI companion (Cadence 〰️) fights alongside you - the last uncorrupted guide.
        </p>
        <p style={{ color: '#666', fontSize: '0.8rem' }}>
          5 rooms → Boss fight → Victory
        </p>
      </div>

      {/* Dev status */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: '#111',
        border: '1px solid #333',
        borderRadius: '8px',
        fontSize: '0.75rem',
        color: '#666'
      }}>
        <p><strong style={{ color: '#22c55e' }}>Playable Demo v0.3</strong></p>
        <p>✓ Player movement + auto-shoot</p>
        <p>✓ Touch controls (mobile ready!)</p>
        <p>✓ AI companion (Cadence) fights with you</p>
        <p>✓ 5 enemy types + behaviors</p>
        <p>✓ 5 item drops</p>
        <p>✓ Boss fight (3 phases)</p>
        <p>✓ Health, damage, speed stats</p>
        <p>○ Custom sprites (integration pending)</p>
        <p>○ Solana integration</p>
      </div>

      <p style={{ color: '#333', marginTop: '2rem', fontSize: '0.8rem' }}>
        〰️ built by Cadence & Jiggy
      </p>
    </div>
  );
}
