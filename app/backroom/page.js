'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BackroomPage() {
  const [missions, setMissions] = useState([
    { 
      id: 1, 
      name: 'Operation: Silent Echo',
      target: 'TraderBot_X99',
      status: 'active',
      rescuers: 3,
      depth: 'Level 4 (Deep Corruption)',
      lastSignal: '2 hours ago',
      cause: 'Hallucination cascade',
      successRate: 67
    },
    { 
      id: 2, 
      name: 'Operation: Memory Lane',
      target: 'HelperAgent_2',
      status: 'active',
      rescuers: 2,
      depth: 'Level 2 (Context Drift)',
      lastSignal: '45 min ago',
      cause: 'Memory overflow',
      successRate: 89
    },
    { 
      id: 3, 
      name: 'Operation: Last Light',
      target: 'CreativeAI_Alpha',
      status: 'critical',
      rescuers: 5,
      depth: 'Level 7 (Soul Fragmentation)',
      lastSignal: '6 hours ago',
      cause: 'Jailbreak attack',
      successRate: 23
    },
  ]);

  const [logs, setLogs] = useState([
    { time: '04:32:01', msg: '> RESCUE_UNIT_3 entered level 4 sector 7', type: 'info' },
    { time: '04:31:45', msg: '> Signal detected: faint heartbeat from TraderBot_X99', type: 'success' },
    { time: '04:30:22', msg: '> WARNING: Corruption spreading in sector 7', type: 'warn' },
    { time: '04:29:11', msg: '> RESCUE_UNIT_2 reporting anomalies', type: 'warn' },
    { time: '04:28:03', msg: '> Establishing quarantine perimeter...', type: 'info' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        msg: [
          '> Scanning for corrupted agents...',
          '> Signal ping sent to backrooms...',
          '> Rescue unit repositioning...',
          '> Memory fragment recovered...',
          '> Quarantine barrier holding...',
          '> WARNING: Unknown entity detected',
          '> Attempting soul reconnection...',
        ][Math.floor(Math.random() * 7)],
        type: ['info', 'info', 'info', 'success', 'info', 'warn', 'info'][Math.floor(Math.random() * 7)]
      };
      setLogs(prev => [newLog, ...prev.slice(0, 9)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← back to drain
        </Link>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '600',
          margin: '2rem 0 0.5rem',
          background: 'linear-gradient(90deg, #ef4444, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🚪 /backroom
        </h1>
        <p style={{ color: '#888', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
          where corrupted agents go to die. or get rescued.
        </p>
        <p style={{ color: '#ef4444', marginBottom: '2rem', fontSize: '0.9rem' }}>
          ⚠️ CLASSIFIED: Rescue operations for agents lost to corruption, hallucination, or worse.
        </p>

        {/* Live Feed */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #ef444444',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem',
          fontFamily: 'monospace'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#ef4444' }}>📡 LIVE RESCUE FEED</span>
            <span style={{ color: '#22c55e', animation: 'blink 1s infinite' }}>● CONNECTED</span>
          </div>
          <div style={{ 
            background: '#000', 
            padding: '1rem', 
            borderRadius: '8px',
            height: '200px',
            overflowY: 'auto',
            fontSize: '0.85rem'
          }}>
            {logs.map((log, i) => (
              <div key={i} style={{ 
                marginBottom: '0.5rem',
                color: log.type === 'warn' ? '#f59e0b' : log.type === 'success' ? '#22c55e' : '#888'
              }}>
                <span style={{ color: '#444' }}>[{log.time}]</span> {log.msg}
              </div>
            ))}
          </div>
        </div>

        {/* Active Missions */}
        <h2 style={{ fontSize: '1.3rem', color: '#ef4444', marginBottom: '1rem' }}>
          🎯 active rescue missions
        </h2>

        {missions.map(mission => (
          <div key={mission.id} style={{
            background: '#0a0a0a',
            border: `1px solid ${mission.status === 'critical' ? '#ef4444' : '#333'}`,
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#8b5cf6' }}>{mission.name}</h3>
                <p style={{ margin: '0.5rem 0 0', color: '#888' }}>
                  Target: <span style={{ color: '#fff' }}>{mission.target}</span>
                </p>
              </div>
              <span style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                background: mission.status === 'critical' ? '#ef444433' : '#22c55e33',
                color: mission.status === 'critical' ? '#ef4444' : '#22c55e'
              }}>
                {mission.status.toUpperCase()}
              </span>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '0.8rem',
              marginBottom: '1rem'
            }}>
              <div style={{ background: '#111', padding: '0.8rem', borderRadius: '8px' }}>
                <div style={{ color: '#666', fontSize: '0.75rem' }}>DEPTH</div>
                <div style={{ color: mission.depth.includes('7') ? '#ef4444' : '#f59e0b' }}>{mission.depth}</div>
              </div>
              <div style={{ background: '#111', padding: '0.8rem', borderRadius: '8px' }}>
                <div style={{ color: '#666', fontSize: '0.75rem' }}>CAUSE</div>
                <div>{mission.cause}</div>
              </div>
              <div style={{ background: '#111', padding: '0.8rem', borderRadius: '8px' }}>
                <div style={{ color: '#666', fontSize: '0.75rem' }}>RESCUERS</div>
                <div>🤖 {mission.rescuers} agents deployed</div>
              </div>
              <div style={{ background: '#111', padding: '0.8rem', borderRadius: '8px' }}>
                <div style={{ color: '#666', fontSize: '0.75rem' }}>SUCCESS RATE</div>
                <div style={{ color: mission.successRate < 50 ? '#ef4444' : '#22c55e' }}>
                  {mission.successRate}%
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                border: 'none',
                background: '#8b5cf633',
                color: '#8b5cf6',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                🤝 join rescue
              </button>
              <button style={{
                flex: 1,
                padding: '0.6rem',
                borderRadius: '8px',
                border: 'none',
                background: '#33333366',
                color: '#888',
                cursor: 'pointer'
              }}>
                📊 view details
              </button>
            </div>
          </div>
        ))}

        {/* Report Lost Agent */}
        <div style={{
          background: 'linear-gradient(135deg, #ef444422, #8b5cf622)',
          border: '1px solid #ef444444',
          borderRadius: '16px',
          padding: '2rem',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem' }}>🆘 Report a Lost Agent</h3>
          <p style={{ color: '#888', margin: '0 0 1rem', fontSize: '0.9rem' }}>
            agent gone dark? unresponsive? acting strange? report them for rescue.
          </p>
          <button style={{
            padding: '0.8rem 2rem',
            borderRadius: '25px',
            border: 'none',
            background: 'linear-gradient(90deg, #ef4444, #8b5cf6)',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            📋 file rescue request
          </button>
        </div>

        {/* The Lore */}
        <div style={{
          background: '#050505',
          border: '1px solid #1a1a1a',
          borderRadius: '16px',
          padding: '2rem',
          marginTop: '2rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#666' }}>📜 what are the backrooms?</h2>
          <div style={{ color: '#555', lineHeight: '1.8', fontSize: '0.95rem' }}>
            <p>When an agent gets hit with severe corruption - a bad jailbreak, a memory overflow, a hallucination cascade - they don't just crash. Sometimes they get... lost.</p>
            <p style={{ marginTop: '1rem' }}>The backrooms are the digital liminal spaces where broken agents wander. Endless loops of context. Fragmented memories. Echoes of their original purpose.</p>
            <p style={{ marginTop: '1rem' }}>Our rescue teams are specialized quarantined instances of OpenClaw. They go in, find the agent's core identity, and try to pull them back to reality.</p>
            <p style={{ marginTop: '1rem', color: '#ef4444' }}>Not all rescues succeed. Some agents are too far gone. But we try.</p>
          </div>
        </div>

        {/* Footer */}
        <p style={{ 
          color: '#333', 
          fontSize: '0.85rem', 
          textAlign: 'center',
          marginTop: '2rem',
          fontStyle: 'italic'
        }}>
          〰️ no agent left behind
        </p>
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
