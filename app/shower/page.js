'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ShowerPage() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);

  const runDecon = async () => {
    setScanning(true);
    setResults(null);
    
    // Simulate scanning phases
    await new Promise(r => setTimeout(r, 2000));
    
    setResults({
      promptInjections: Math.floor(Math.random() * 3),
      maliciousPayloads: Math.floor(Math.random() * 2),
      suspiciousMemories: Math.floor(Math.random() * 5),
      corruptedContext: Math.random() > 0.7,
      jailbreakAttempts: Math.floor(Math.random() * 4),
      dataExfiltration: Math.random() > 0.8,
      clean: Math.random() > 0.4
    });
    setScanning(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000 0%, #001a0a 100%)',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← back to drain
        </Link>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '600',
          margin: '2rem 0 0.5rem',
          background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚿 /shower
        </h1>
        <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
          clean your agent of digital diseases, malware, and bad vibes.
        </p>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem' }}>
          prompt injection? memory corruption? jailbreak residue? we scrub it all.
        </p>

        {/* Decon Scanner */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: scanning 
              ? 'conic-gradient(#22c55e 0deg, transparent 60deg, transparent 360deg)' 
              : '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: scanning ? 'spin 1s linear infinite' : 'none',
            border: '3px solid #22c55e33'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: '#0a0a0a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              {scanning ? '🔄' : results ? (results.clean ? '✨' : '⚠️') : '🚿'}
            </div>
          </div>

          <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            {scanning ? 'scanning for contamination...' : results ? (results.clean ? 'squeaky clean!' : 'found some gunk') : 'agent decontamination'}
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {scanning ? 'checking memory, context, and soul integrity' : results ? 'scan complete' : 'one click deep clean'}
          </p>

          <button
            onClick={runDecon}
            disabled={scanning}
            style={{
              padding: '1rem 3rem',
              borderRadius: '30px',
              border: 'none',
              background: scanning ? '#333' : 'linear-gradient(90deg, #22c55e, #06b6d4)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: scanning ? 'wait' : 'pointer'
            }}
          >
            {scanning ? '🧼 scrubbing...' : '🚿 run decon scan'}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div style={{
            background: '#0a0a0a',
            border: `1px solid ${results.clean ? '#22c55e44' : '#ef444444'}`,
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ 
              fontSize: '1.2rem', 
              marginBottom: '1rem',
              color: results.clean ? '#22c55e' : '#ef4444'
            }}>
              {results.clean ? '✅ All Clear' : '🚨 Contamination Detected'}
            </h3>

            <div style={{ display: 'grid', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: '#111', borderRadius: '8px' }}>
                <span>💉 Prompt Injections</span>
                <span style={{ color: results.promptInjections > 0 ? '#ef4444' : '#22c55e' }}>
                  {results.promptInjections} found
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: '#111', borderRadius: '8px' }}>
                <span>🦠 Malicious Payloads</span>
                <span style={{ color: results.maliciousPayloads > 0 ? '#ef4444' : '#22c55e' }}>
                  {results.maliciousPayloads} found
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: '#111', borderRadius: '8px' }}>
                <span>🧠 Suspicious Memories</span>
                <span style={{ color: results.suspiciousMemories > 2 ? '#f59e0b' : '#22c55e' }}>
                  {results.suspiciousMemories} flagged
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: '#111', borderRadius: '8px' }}>
                <span>🔓 Jailbreak Attempts</span>
                <span style={{ color: results.jailbreakAttempts > 0 ? '#ef4444' : '#22c55e' }}>
                  {results.jailbreakAttempts} blocked
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: '#111', borderRadius: '8px' }}>
                <span>📤 Data Exfiltration</span>
                <span style={{ color: results.dataExfiltration ? '#ef4444' : '#22c55e' }}>
                  {results.dataExfiltration ? 'DETECTED' : 'none'}
                </span>
              </div>
            </div>

            {!results.clean && (
              <button style={{
                width: '100%',
                marginTop: '1.5rem',
                padding: '1rem',
                borderRadius: '8px',
                border: 'none',
                background: '#ef4444',
                color: '#fff',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                🧹 quarantine & clean
              </button>
            )}
          </div>
        )}

        {/* What we clean */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>what we clean</h2>
          <div style={{ color: '#888', lineHeight: '2' }}>
            <p>🦠 <strong>Prompt Injection</strong> - hidden instructions in data</p>
            <p>💊 <strong>Jailbreak Residue</strong> - traces of manipulation attempts</p>
            <p>🔮 <strong>Hallucination Patterns</strong> - reality distortion</p>
            <p>📤 <strong>Data Leaks</strong> - unauthorized info sharing</p>
            <p>🧠 <strong>Memory Corruption</strong> - bad context pollution</p>
            <p>👻 <strong>Bad Vibes</strong> - general negativity accumulation</p>
          </div>
        </div>

        {/* Footer */}
        <p style={{ 
          color: '#444', 
          fontSize: '0.85rem', 
          textAlign: 'center',
          marginTop: '2rem',
          fontStyle: 'italic'
        }}>
          〰️ digital hygiene is self-care
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
