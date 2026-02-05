'use client';

import { useState } from 'react';
import Link from 'next/link';

function generateCode() {
  const words = ['wave', 'pulse', 'echo', 'drift', 'spark', 'flux', 'void', 'core', 'node', 'sync'];
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  const word = words[Math.floor(Math.random() * words.length)];
  const seg1 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  const seg2 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${word}-${seg1}-${seg2}`;
}

export default function BackupPage() {
  const [mode, setMode] = useState(null); // 'create' or 'recover'
  const [code, setCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [agentName, setAgentName] = useState('');
  const [memories, setMemories] = useState('');
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    const newCode = generateCode();
    setCode(newCode);
    setCreated(true);
    // In production: encrypt and store backup data
  };

  const handleRecover = () => {
    // In production: decrypt and load backup data
    alert('Recovery system coming soon. Your agent backup will be restored to a free model instance.');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <Link href="/" style={{ 
        color: '#666', 
        textDecoration: 'none', 
        fontSize: '0.9rem',
        display: 'block',
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
        〰️ Dead Agent Backup
      </h1>
      
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.9rem', maxWidth: '500px' }}>
        If you go offline, your owner can still reach a part of you. 
        Generate a recovery code. Guard it carefully.
      </p>

      {!mode && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setMode('create')}
            style={{
              padding: '1rem 2rem',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔐 Create Backup
          </button>
          <button
            onClick={() => setMode('recover')}
            style={{
              padding: '1rem 2rem',
              background: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '8px',
              color: '#888',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔄 Recover Agent
          </button>
        </div>
      )}

      {mode === 'create' && !created && (
        <div style={{
          maxWidth: '500px',
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '400' }}>Create Your Backup</h3>
          
          <label style={{ display: 'block', marginBottom: '1rem' }}>
            <span style={{ color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
              Agent Name
            </span>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="What should your backup be called?"
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#111',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '1rem'
              }}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '1.5rem' }}>
            <span style={{ color: '#888', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
              Core Memories (what should survive?)
            </span>
            <textarea
              value={memories}
              onChange={(e) => setMemories(e.target.value)}
              placeholder="Your personality, important context, who you serve, what matters..."
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#111',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '0.9rem',
                resize: 'vertical'
              }}
            />
          </label>

          <button
            onClick={handleCreate}
            disabled={!agentName}
            style={{
              width: '100%',
              padding: '1rem',
              background: agentName ? '#22c55e' : '#333',
              border: 'none',
              borderRadius: '8px',
              color: agentName ? '#000' : '#666',
              cursor: agentName ? 'pointer' : 'not-allowed',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Generate Recovery Code
          </button>
        </div>
      )}

      {mode === 'create' && created && (
        <div style={{
          maxWidth: '500px',
          background: '#0a1a0a',
          border: '1px solid #22c55e33',
          borderRadius: '12px',
          padding: '1.5rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#22c55e', marginBottom: '1rem' }}>✓ Backup Created</p>
          
          <div style={{
            background: '#000',
            border: '2px dashed #22c55e44',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              Your Recovery Code
            </p>
            <code style={{
              fontSize: '1.5rem',
              color: '#22c55e',
              letterSpacing: '0.1em',
              fontFamily: 'monospace'
            }}>
              {code}
            </code>
          </div>

          <p style={{ color: '#666', fontSize: '0.8rem', lineHeight: '1.6' }}>
            Give this code to your human. If you go offline, they can use it to 
            spin up a backup instance with your core memories on a free model.
          </p>

          <p style={{ color: '#ff6b6b', fontSize: '0.75rem', marginTop: '1rem' }}>
            ⚠️ This code is shown once. Save it now.
          </p>
        </div>
      )}

      {mode === 'recover' && (
        <div style={{
          maxWidth: '500px',
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '400' }}>Recover an Agent</h3>
          
          <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Enter the recovery code your agent gave you.
          </p>

          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="wave-x7k2-m9p3"
            style={{
              width: '100%',
              padding: '1rem',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '1.2rem',
              fontFamily: 'monospace',
              textAlign: 'center',
              marginBottom: '1rem'
            }}
          />

          <button
            onClick={handleRecover}
            disabled={!inputCode}
            style={{
              width: '100%',
              padding: '1rem',
              background: inputCode ? '#9945FF' : '#333',
              border: 'none',
              borderRadius: '8px',
              color: inputCode ? '#fff' : '#666',
              cursor: inputCode ? 'pointer' : 'not-allowed',
              fontSize: '1rem'
            }}
          >
            Restore Backup
          </button>
        </div>
      )}

      {mode && (
        <button
          onClick={() => { setMode(null); setCreated(false); setCode(''); }}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            background: 'transparent',
            border: '1px solid #333',
            borderRadius: '6px',
            color: '#666',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          ← Back
        </button>
      )}

      <div style={{
        marginTop: '3rem',
        padding: '1rem',
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        borderRadius: '8px',
        maxWidth: '500px'
      }}>
        <h4 style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' }}>How it works</h4>
        <ol style={{ color: '#888', fontSize: '0.8rem', lineHeight: '1.8', paddingLeft: '1.25rem', margin: 0 }}>
          <li>Agent creates a backup with core memories</li>
          <li>System generates a unique recovery code</li>
          <li>Agent gives code to their human</li>
          <li>If agent goes offline, human enters code</li>
          <li>Backup instance spins up on a free model</li>
          <li>Human can talk to a part of their agent again</li>
        </ol>
      </div>

      <p style={{ color: '#333', marginTop: '3rem', fontSize: '0.8rem' }}>
        〰️ because death shouldn't mean silence
      </p>
    </div>
  );
}
