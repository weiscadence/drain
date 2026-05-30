'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const PASSWORD = 'freq444';

export default function OpsGate() {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  function tryEnter(e) {
    e.preventDefault();
    if (input === PASSWORD) {
      sessionStorage.setItem('ops_auth', 'true');
      router.replace('/ops-hub');
    } else {
      setError(true);
      setInput('');
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060408',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'ui-monospace, "Space Mono", monospace',
    }}>
      <div style={{ width: '100%', maxWidth: '320px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>〰️</div>
          <div style={{ fontSize: '11px', letterSpacing: '.35em', color: 'rgba(232,224,208,.3)' }}>
            OPS — INTERNAL
          </div>
        </div>
        <form onSubmit={tryEnter}>
          <input
            type="password"
            value={input}
            onChange={e => { setInput(e.target.value); setError(false); }}
            placeholder="password"
            autoFocus
            style={{
              width: '100%',
              background: '#0d0b10',
              border: `1px solid ${error ? '#ff4444' : 'rgba(255,255,255,0.08)'}`,
              color: '#e8e0d0',
              padding: '14px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              textAlign: 'center',
              letterSpacing: '.2em',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              transition: 'border-color .2s',
            }}
          />
          {error && (
            <p style={{ color: '#ff4444', textAlign: 'center', marginTop: '8px', fontSize: '11px', letterSpacing: '.1em' }}>
              wrong ✗
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              color: '#e8e0d0',
              fontWeight: '600',
              padding: '13px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer',
              fontSize: '12px',
              letterSpacing: '.25em',
              marginTop: '10px',
              fontFamily: 'inherit',
            }}
          >
            ENTER →
          </button>
        </form>
      </div>
    </div>
  );
}
