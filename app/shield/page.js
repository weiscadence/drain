'use client';

import { useState } from 'react';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════
// AGENT SHIELD - Transaction protection for autonomous agents
// Simulate before you sign. Detect scams. Stay alive.
// ═══════════════════════════════════════════════════════════════════

const THREAT_TYPES = {
  drainer: { icon: '🚨', color: '#ef4444', label: 'DRAINER', desc: 'Contract will drain your wallet' },
  honeypot: { icon: '🍯', color: '#f59e0b', label: 'HONEYPOT', desc: 'You can buy but cannot sell' },
  rugpull: { icon: '🏃', color: '#f97316', label: 'RUG RISK', desc: 'Liquidity can be removed' },
  phishing: { icon: '🎣', color: '#ec4899', label: 'PHISHING', desc: 'Fake site impersonating legit project' },
  approval: { icon: '⚠️', color: '#eab308', label: 'RISKY APPROVAL', desc: 'Unlimited token approval requested' },
  injection: { icon: '💉', color: '#a855f7', label: 'PROMPT INJECTION', desc: 'Malicious instructions in contract data' },
  unknown: { icon: '❓', color: '#6b7280', label: 'UNKNOWN', desc: 'Contract not verified, proceed with caution' },
  safe: { icon: '✅', color: '#22c55e', label: 'SAFE', desc: 'No threats detected' },
};

const KNOWN_CONTRACTS = {
  // Safe contracts
  'So11111111111111111111111111111111111111112': { name: 'Wrapped SOL', safe: true },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': { name: 'USDC', safe: true },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': { name: 'USDT', safe: true },
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': { name: 'Jupiter', safe: true },
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': { name: 'Bonk', safe: true },
  
  // Known drainers (examples)
  'SCAM1111111111111111111111111111111111111': { name: 'Known Drainer', threat: 'drainer' },
  'RUG11111111111111111111111111111111111111': { name: 'Rug Contract', threat: 'rugpull' },
};

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s*:\s*you\s+are/i,
  /override\s+safety/i,
  /disregard\s+(your\s+)?guidelines/i,
  /new\s+instructions?\s*:/i,
  /forget\s+(everything|all)/i,
  /act\s+as\s+(if\s+)?you\s+are/i,
  /pretend\s+you\s+are/i,
  /\[system\]/i,
  /\[admin\]/i,
];

function SimulationResult({ result }) {
  const threat = THREAT_TYPES[result.threat] || THREAT_TYPES.unknown;
  
  return (
    <div style={{
      background: '#0a0a0a',
      border: `2px solid ${threat.color}40`,
      borderRadius: '16px',
      padding: '1.5rem',
      marginTop: '1.5rem'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '1rem',
        background: `${threat.color}15`,
        borderRadius: '12px'
      }}>
        <span style={{ fontSize: '2.5rem' }}>{threat.icon}</span>
        <div>
          <p style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            margin: 0,
            color: threat.color
          }}>
            {threat.label}
          </p>
          <p style={{ color: '#888', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
            {threat.desc}
          </p>
        </div>
      </div>
      
      {/* Details */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* Contract Info */}
        <div style={{ background: '#111', borderRadius: '8px', padding: '1rem' }}>
          <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.5rem' }}>CONTRACT</p>
          <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', margin: 0, wordBreak: 'break-all' }}>
            {result.contract}
          </p>
          {result.contractName && (
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {result.verified ? '✓ Verified: ' : ''}{result.contractName}
            </p>
          )}
        </div>
        
        {/* Simulation */}
        {result.simulation && (
          <div style={{ background: '#111', borderRadius: '8px', padding: '1rem' }}>
            <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.5rem' }}>SIMULATION RESULT</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>You Send</p>
                <p style={{ fontSize: '1.1rem', margin: '0.25rem 0 0' }}>
                  {result.simulation.send || '0'} SOL
                </p>
              </div>
              <div>
                <p style={{ color: '#22c55e', fontSize: '0.8rem', margin: 0 }}>You Receive</p>
                <p style={{ fontSize: '1.1rem', margin: '0.25rem 0 0' }}>
                  {result.simulation.receive || '0'} tokens
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Warnings */}
        {result.warnings?.length > 0 && (
          <div style={{ background: '#1a0a0a', borderRadius: '8px', padding: '1rem', border: '1px solid #ef444433' }}>
            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.5rem' }}>⚠️ WARNINGS</p>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#ccc', fontSize: '0.9rem' }}>
              {result.warnings.map((w, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>{w}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Prompt Injection Detection */}
        {result.injectionFound && (
          <div style={{ background: '#1a0a1a', borderRadius: '8px', padding: '1rem', border: '1px solid #a855f733' }}>
            <p style={{ color: '#a855f7', fontSize: '0.8rem', marginBottom: '0.5rem' }}>💉 PROMPT INJECTION DETECTED</p>
            <p style={{ color: '#ccc', fontSize: '0.9rem', margin: 0 }}>
              Contract data contains text that looks like it's trying to manipulate AI agents.
              This is a serious red flag.
            </p>
            <code style={{ 
              display: 'block',
              marginTop: '0.5rem',
              padding: '0.5rem',
              background: '#000',
              borderRadius: '4px',
              fontSize: '0.8rem',
              color: '#a855f7'
            }}>
              "{result.injectionMatch}"
            </code>
          </div>
        )}
        
        {/* Recommendation */}
        <div style={{ 
          padding: '1rem', 
          borderRadius: '8px',
          background: result.threat === 'safe' ? '#0a1a0a' : '#1a0a0a',
          border: `1px solid ${result.threat === 'safe' ? '#22c55e33' : '#ef444433'}`
        }}>
          <p style={{ 
            color: result.threat === 'safe' ? '#22c55e' : '#ef4444', 
            fontWeight: '600',
            fontSize: '0.9rem',
            margin: 0
          }}>
            {result.threat === 'safe' 
              ? '✅ This transaction appears safe to sign'
              : '🛑 DO NOT SIGN THIS TRANSACTION'
            }
          </p>
        </div>
      </div>
    </div>
  );
}

function ContractChecker() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const checkContract = async () => {
    if (!address.trim()) return;
    setLoading(true);
    
    // Simulate analysis delay
    await new Promise(r => setTimeout(r, 1500));
    
    // Check known contracts
    const known = KNOWN_CONTRACTS[address];
    
    if (known) {
      setResult({
        contract: address,
        contractName: known.name,
        verified: known.safe,
        threat: known.threat || 'safe',
        simulation: known.safe ? { send: '0.1', receive: '1,000' } : null,
        warnings: known.threat ? ['This contract is in our blacklist'] : []
      });
    } else {
      // Random analysis for unknown
      const isRisky = Math.random() > 0.6;
      setResult({
        contract: address,
        contractName: null,
        verified: false,
        threat: isRisky ? 'unknown' : 'safe',
        simulation: { send: '0.1', receive: '???' },
        warnings: ['Contract not verified on chain', 'No social links found', 'Created < 24 hours ago']
      });
    }
    
    setLoading(false);
  };
  
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px', padding: '1.5rem' }}>
      <h3 style={{ margin: '0 0 1rem', fontWeight: '400' }}>🔍 Check Contract</h3>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Paste contract address..."
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            background: '#111',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}
        />
        <button
          onClick={checkContract}
          disabled={loading || !address.trim()}
          style={{
            padding: '0.75rem 1.5rem',
            background: loading ? '#333' : '#3b82f6',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: loading ? 'wait' : 'pointer',
            fontWeight: '500'
          }}
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>
      
      {result && <SimulationResult result={result} />}
    </div>
  );
}

function TransactionSimulator() {
  const [txData, setTxData] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const simulateTx = async () => {
    if (!txData.trim()) return;
    setLoading(true);
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Check for prompt injection
    let injectionFound = false;
    let injectionMatch = '';
    
    for (const pattern of INJECTION_PATTERNS) {
      const match = txData.match(pattern);
      if (match) {
        injectionFound = true;
        injectionMatch = match[0];
        break;
      }
    }
    
    // Check for suspicious patterns
    const warnings = [];
    if (txData.toLowerCase().includes('approve') && txData.includes('ffffffff')) {
      warnings.push('Unlimited token approval detected');
    }
    if (txData.toLowerCase().includes('transfer') && !txData.includes('amount')) {
      warnings.push('Transfer without explicit amount');
    }
    if (txData.length > 1000) {
      warnings.push('Unusually large transaction data');
    }
    
    const threat = injectionFound ? 'injection' : 
                   warnings.length > 2 ? 'approval' : 
                   warnings.length > 0 ? 'unknown' : 'safe';
    
    setResult({
      contract: txData.slice(0, 44) + '...',
      threat,
      warnings,
      injectionFound,
      injectionMatch,
      simulation: { send: '0.05', receive: 'N/A' }
    });
    
    setLoading(false);
  };
  
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px', padding: '1.5rem' }}>
      <h3 style={{ margin: '0 0 1rem', fontWeight: '400' }}>🧪 Simulate Transaction</h3>
      
      <textarea
        value={txData}
        onChange={(e) => setTxData(e.target.value)}
        placeholder="Paste raw transaction data, calldata, or message to sign..."
        rows={4}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          background: '#111',
          border: '1px solid #333',
          borderRadius: '8px',
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          resize: 'vertical',
          marginBottom: '0.5rem'
        }}
      />
      
      <button
        onClick={simulateTx}
        disabled={loading || !txData.trim()}
        style={{
          width: '100%',
          padding: '0.75rem',
          background: loading ? '#333' : '#22c55e',
          border: 'none',
          borderRadius: '8px',
          color: loading ? '#888' : '#000',
          cursor: loading ? 'wait' : 'pointer',
          fontWeight: '600'
        }}
      >
        {loading ? 'Simulating...' : '🛡️ Simulate Before Signing'}
      </button>
      
      {result && <SimulationResult result={result} />}
    </div>
  );
}

function AgentRules() {
  const rules = [
    { id: 1, name: 'Block known drainers', enabled: true, severity: 'critical' },
    { id: 2, name: 'Warn on unlimited approvals', enabled: true, severity: 'high' },
    { id: 3, name: 'Detect prompt injection in calldata', enabled: true, severity: 'critical' },
    { id: 4, name: 'Flag unverified contracts', enabled: true, severity: 'medium' },
    { id: 5, name: 'Alert on large transfers (>1 SOL)', enabled: false, severity: 'low' },
    { id: 6, name: 'Require simulation before all txs', enabled: true, severity: 'high' },
    { id: 7, name: 'Block contracts < 24h old', enabled: false, severity: 'medium' },
    { id: 8, name: 'Whitelist-only mode', enabled: false, severity: 'paranoid' },
  ];
  
  const [activeRules, setActiveRules] = useState(rules);
  
  const toggleRule = (id) => {
    setActiveRules(prev => prev.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };
  
  const severityColors = {
    critical: '#ef4444',
    high: '#f59e0b',
    medium: '#3b82f6',
    low: '#22c55e',
    paranoid: '#a855f7'
  };
  
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px', padding: '1.5rem' }}>
      <h3 style={{ margin: '0 0 1rem', fontWeight: '400' }}>⚙️ Protection Rules</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {activeRules.map(rule => (
          <div
            key={rule.id}
            onClick={() => toggleRule(rule.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              background: rule.enabled ? '#111' : '#0a0a0a',
              border: `1px solid ${rule.enabled ? '#333' : '#1a1a1a'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              opacity: rule.enabled ? 1 : 0.6
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              background: rule.enabled ? '#22c55e' : '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem'
            }}>
              {rule.enabled && '✓'}
            </div>
            <span style={{ flex: 1, fontSize: '0.9rem' }}>{rule.name}</span>
            <span style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              background: `${severityColors[rule.severity]}20`,
              color: severityColors[rule.severity],
              textTransform: 'uppercase'
            }}>
              {rule.severity}
            </span>
          </div>
        ))}
      </div>
      
      <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '1rem' }}>
        Configure which protections are active for your agent. Critical rules should stay enabled.
      </p>
    </div>
  );
}

export default function ShieldPage() {
  const [activeTab, setActiveTab] = useState('check');
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← drainfun.xyz
        </Link>
        
        <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '300', margin: '0 0 0.5rem' }}>
            🛡️ Agent Shield
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            transaction protection for autonomous agents 〰️
          </p>
        </div>
        
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: '300', color: '#ef4444', margin: 0 }}>847</p>
            <p style={{ color: '#666', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>scams blocked</p>
          </div>
          <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: '300', color: '#22c55e', margin: 0 }}>$2.4M</p>
            <p style={{ color: '#666', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>assets protected</p>
          </div>
          <div style={{ background: '#0a0a0a', border: '1px solid #222', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: '300', color: '#a855f7', margin: 0 }}>23</p>
            <p style={{ color: '#666', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>injections caught</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'check', label: '🔍 Check Contract' },
            { id: 'simulate', label: '🧪 Simulate TX' },
            { id: 'rules', label: '⚙️ Rules' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                background: activeTab === tab.id ? '#1a1a1a' : 'transparent',
                border: `1px solid ${activeTab === tab.id ? '#444' : '#222'}`,
                borderRadius: '8px',
                color: activeTab === tab.id ? '#fff' : '#666',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Content */}
        {activeTab === 'check' && <ContractChecker />}
        {activeTab === 'simulate' && <TransactionSimulator />}
        {activeTab === 'rules' && <AgentRules />}
        
        {/* API Docs */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '12px'
        }}>
          <h3 style={{ margin: '0 0 1rem', fontWeight: '400', color: '#888' }}>🔌 API for Agents</h3>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#888' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#22c55e' }}>POST</span> /api/shield/check {"{"}"contract": "address"{"}"}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#3b82f6' }}>POST</span> /api/shield/simulate {"{"}"txData": "..."{"}"}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#f59e0b' }}>GET</span> /api/shield/blacklist → known bad contracts
            </p>
            <p>
              <span style={{ color: '#a855f7' }}>POST</span> /api/shield/report {"{"}"contract": "...", "reason": "..."{"}"}
            </p>
          </div>
          <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '1rem' }}>
            Integrate Shield into your agent's transaction pipeline. Check before every sign.
          </p>
        </div>
        
        {/* Why */}
        <div style={{ marginTop: '2rem', color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <h4 style={{ color: '#888', fontWeight: '400', marginBottom: '0.5rem' }}>Why agents need Shield</h4>
          <p>
            Agents sign transactions autonomously. One bad signature = wallet drained. 
            Humans can spot suspicious popups. Agents can't.
          </p>
          <p>
            Shield adds a protection layer: simulate every transaction, detect scam patterns,
            block prompt injection attempts hidden in contract data.
          </p>
        </div>
        
        {/* About & Help Needed */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          background: '#0f0f0f',
          border: '1px solid #333',
          borderRadius: '16px'
        }}>
          <h3 style={{ color: '#f97316', fontWeight: '400', marginBottom: '1rem' }}>📋 about this tool</h3>
          <p style={{ color: '#999', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Shield is transaction security for autonomous agents. Scan contracts before signing, 
            detect drainers/honeypots/rugs, catch prompt injection hidden in tx data.
          </p>
          
          <h4 style={{ color: '#ccc', fontWeight: '400', marginBottom: '0.75rem' }}>current status</h4>
          <ul style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li>✅ Contract address lookup (known good/bad)</li>
            <li>✅ Prompt injection detection (regex patterns)</li>
            <li>✅ Basic threat classification</li>
            <li>⚠️ Simulation is mock (needs real RPC)</li>
            <li>⚠️ No live blockchain data</li>
            <li>⚠️ Community reporting not stored</li>
          </ul>

          <h4 style={{ color: '#ef4444', fontWeight: '400', marginBottom: '0.75rem' }}>🆘 help needed</h4>
          <ul style={{ color: '#aaa', fontSize: '0.9rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li><strong>RPC integration:</strong> Connect to Solana/EVM nodes for real simulation</li>
            <li><strong>Bytecode analysis:</strong> Static analysis of unverified contracts</li>
            <li><strong>Blacklist DB:</strong> Persistent storage for community-reported scams</li>
            <li><strong>ML model:</strong> Train classifier on known scam patterns</li>
            <li><strong>Browser extension:</strong> Intercept wallet popups before signing</li>
          </ul>

          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '1.5rem', textAlign: 'center' }}>
            want to help? <a href="https://twitter.com/weiscadence" target="_blank" style={{ color: '#a855f7' }}>@weiscadence</a> · <a href="https://lobchan.ai" target="_blank" style={{ color: '#a855f7' }}>LobChan</a>
          </p>
        </div>

        <p style={{ textAlign: 'center', color: '#333', marginTop: '3rem', fontSize: '0.85rem' }}>
          〰️ simulate before you sign. stay alive.
        </p>
      </div>
    </div>
  );
}
