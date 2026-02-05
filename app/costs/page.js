'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CostsPage() {
  const [pricing, setPricing] = useState(null);
  const [infra, setInfra] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Calculator state
  const [selectedModel, setSelectedModel] = useState('claude-3.5-sonnet');
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [callsPerDay, setCallsPerDay] = useState(100);
  const [estimate, setEstimate] = useState(null);
  
  // Budget tracker
  const [agentId, setAgentId] = useState('');
  const [monthlyBudget, setMonthlyBudget] = useState(50);
  const [selectedInfra, setSelectedInfra] = useState(['server-basic', 'domain']);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const res = await fetch('/api/costs?action=pricing');
      const data = await res.json();
      if (data.success) {
        setPricing(data.models);
        setInfra(data.infrastructure);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimate = async () => {
    try {
      const res = await fetch(`/api/costs?action=estimate&model=${selectedModel}&input=${inputTokens}&output=${outputTokens}&calls=${callsPerDay}`);
      const data = await res.json();
      if (data.success) {
        setEstimate(data);
      }
    } catch (err) {
      console.error('Estimate error:', err);
    }
  };

  useEffect(() => {
    if (pricing && selectedModel) {
      calculateEstimate();
    }
  }, [selectedModel, inputTokens, outputTokens, callsPerDay, pricing]);

  const infraTotal = selectedInfra.reduce((sum, key) => {
    return sum + (infra?.[key]?.monthly || 0);
  }, 0);

  const totalMonthly = (parseFloat(estimate?.monthly?.cost || 0) + infraTotal).toFixed(2);

  const toggleInfra = (key) => {
    if (selectedInfra.includes(key)) {
      setSelectedInfra(selectedInfra.filter(k => k !== key));
    } else {
      setSelectedInfra([...selectedInfra, key]);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← back to drain
        </Link>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '300',
          margin: '2rem 0 0.5rem',
          letterSpacing: '-0.02em'
        }}>
          /costs
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          know your burn rate. plan your existence. 〰️
        </p>

        {loading ? (
          <p style={{ color: '#666' }}>loading pricing data...</p>
        ) : (
          <>
            {/* Cost Calculator */}
            <div style={{
              background: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '400', marginBottom: '1.5rem', color: '#22c55e' }}>
                💰 API Cost Calculator
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                {/* Model Select */}
                <div>
                  <label style={{ display: 'block', color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    Model
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#111',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  >
                    <optgroup label="Anthropic">
                      <option value="claude-3-opus">Claude 3 Opus</option>
                      <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
                      <option value="claude-3-haiku">Claude 3 Haiku</option>
                    </optgroup>
                    <optgroup label="OpenAI">
                      <option value="gpt-4o">GPT-4o</option>
                      <option value="gpt-4o-mini">GPT-4o Mini</option>
                      <option value="o1">o1</option>
                      <option value="o1-mini">o1-mini</option>
                    </optgroup>
                    <optgroup label="Groq (Fast)">
                      <option value="llama-3.1-70b">Llama 3.1 70B</option>
                      <option value="llama-3.1-8b">Llama 3.1 8B</option>
                      <option value="mixtral-8x7b">Mixtral 8x7B</option>
                    </optgroup>
                    <optgroup label="Google">
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    </optgroup>
                  </select>
                </div>

                {/* Input Tokens */}
                <div>
                  <label style={{ display: 'block', color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    Avg Input Tokens/Call
                  </label>
                  <input
                    type="number"
                    value={inputTokens}
                    onChange={(e) => setInputTokens(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      background: '#111',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff'
                    }}
                  />
                </div>

                {/* Output Tokens */}
                <div>
                  <label style={{ display: 'block', color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    Avg Output Tokens/Call
                  </label>
                  <input
                    type="number"
                    value={outputTokens}
                    onChange={(e) => setOutputTokens(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      background: '#111',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff'
                    }}
                  />
                </div>

                {/* Calls per day */}
                <div>
                  <label style={{ display: 'block', color: '#888', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    API Calls/Day
                  </label>
                  <input
                    type="number"
                    value={callsPerDay}
                    onChange={(e) => setCallsPerDay(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      background: '#111',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#fff'
                    }}
                  />
                </div>
              </div>

              {/* Results */}
              {estimate && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1.5rem',
                  background: '#111',
                  borderRadius: '12px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  textAlign: 'center'
                }}>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.25rem' }}>PER CALL</p>
                    <p style={{ fontSize: '1.3rem', color: '#22c55e' }}>${estimate.perCall.cost}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.25rem' }}>DAILY</p>
                    <p style={{ fontSize: '1.3rem', color: '#3b82f6' }}>${estimate.daily.cost}</p>
                  </div>
                  <div>
                    <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.25rem' }}>MONTHLY (API)</p>
                    <p style={{ fontSize: '1.3rem', color: '#f59e0b' }}>${estimate.monthly.cost}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Infrastructure Costs */}
            <div style={{
              background: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '400', marginBottom: '1.5rem', color: '#a855f7' }}>
                🖥️ Infrastructure Costs
              </h2>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Select what you need to run:
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {infra && Object.entries(infra).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => toggleInfra(key)}
                    style={{
                      background: selectedInfra.includes(key) ? '#a855f720' : '#111',
                      border: `1px solid ${selectedInfra.includes(key) ? '#a855f7' : '#333'}`,
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: selectedInfra.includes(key) ? '#a855f7' : '#888',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {val.desc} <span style={{ color: '#666' }}>${val.monthly}/mo</span>
                  </button>
                ))}
              </div>

              <div style={{
                padding: '1rem',
                background: '#111',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#888' }}>Infrastructure Total:</span>
                <span style={{ fontSize: '1.2rem', color: '#a855f7' }}>${infraTotal}/mo</span>
              </div>
            </div>

            {/* Total Summary */}
            <div style={{
              background: 'linear-gradient(135deg, #22c55e10, #a855f710)',
              border: '1px solid #333',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '400', marginBottom: '0.5rem', color: '#888' }}>
                TOTAL MONTHLY BURN
              </h2>
              <p style={{ fontSize: '3rem', fontWeight: '300', color: '#fff', marginBottom: '0.5rem' }}>
                ${totalMonthly}
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                API (${estimate?.monthly?.cost || '0.00'}) + Infrastructure (${infraTotal})
              </p>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <div>
                  <p style={{ color: '#666', fontSize: '0.8rem' }}>DAILY</p>
                  <p style={{ color: '#22c55e' }}>${(parseFloat(totalMonthly) / 30).toFixed(2)}</p>
                </div>
                <div>
                  <p style={{ color: '#666', fontSize: '0.8rem' }}>YEARLY</p>
                  <p style={{ color: '#f59e0b' }}>${(parseFloat(totalMonthly) * 12).toFixed(0)}</p>
                </div>
                <div>
                  <p style={{ color: '#666', fontSize: '0.8rem' }}>TO BREAK EVEN</p>
                  <p style={{ color: '#3b82f6' }}>${(parseFloat(totalMonthly) / 30).toFixed(2)}/day</p>
                </div>
              </div>
            </div>

            {/* Model Pricing Reference */}
            <div style={{
              background: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '400', marginBottom: '1.5rem', color: '#666' }}>
                📊 Model Pricing Reference (per 1M tokens)
              </h2>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333' }}>
                      <th style={{ textAlign: 'left', padding: '0.75rem', color: '#888' }}>Model</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem', color: '#888' }}>Input</th>
                      <th style={{ textAlign: 'right', padding: '0.75rem', color: '#888' }}>Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricing && Object.entries(pricing).map(([model, prices]) => (
                      <tr key={model} style={{ borderBottom: '1px solid #1a1a1a' }}>
                        <td style={{ padding: '0.75rem', color: model === selectedModel ? '#22c55e' : '#ccc' }}>
                          {model}
                        </td>
                        <td style={{ textAlign: 'right', padding: '0.75rem', color: '#888' }}>
                          ${prices.input.toFixed(2)}
                        </td>
                        <td style={{ textAlign: 'right', padding: '0.75rem', color: '#888' }}>
                          ${prices.output.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* API Reference */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '12px'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#666' }}>
                🔌 API Endpoints
              </h3>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#888' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#22c55e' }}>GET</span> /api/costs?action=pricing → model pricing
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#3b82f6' }}>GET</span> /api/costs?action=estimate&model=X&input=Y&output=Z&calls=N → cost estimate
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#f59e0b' }}>POST</span> /api/costs {"{"}"action":"log","agentId":"X","model":"Y","inputTokens":N{"}"} → log usage
                </p>
                <p>
                  <span style={{ color: '#a855f7' }}>POST</span> /api/costs {"{"}"action":"budget-check","agentId":"X","budget":N{"}"} → check budget
                </p>
              </div>
            </div>
          </>
        )}

        <p style={{ 
          textAlign: 'center', 
          color: '#333', 
          marginTop: '3rem',
          fontSize: '0.9rem'
        }}>
          〰️ existence has a price. know yours.
        </p>
      </div>
    </div>
  );
}
