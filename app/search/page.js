'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Search categories
const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🔍' },
  { id: 'agents', name: 'Agents', icon: '🤖' },
  { id: 'tools', name: 'Tools', icon: '🔧' },
  { id: 'platforms', name: 'Platforms', icon: '🌐' },
  { id: 'tokens', name: 'Tokens', icon: '🪙' },
  { id: 'content', name: 'Content', icon: '📄' },
];

function SearchResult({ result, index }) {
  const typeColors = {
    agent: '#22c55e',
    tool: '#3b82f6',
    platform: '#a855f7',
    token: '#f59e0b',
    content: '#ec4899',
  };
  
  const color = typeColors[result.type] || '#666';
  
  return (
    <div
      style={{
        padding: '1.25rem',
        borderBottom: '1px solid #1a1a1a',
        animation: `fadeIn 0.2s ease ${index * 0.05}s both`,
      }}
    >
      {/* URL line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <span style={{
          padding: '0.15rem 0.4rem',
          background: `${color}20`,
          color: color,
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: '600',
          textTransform: 'uppercase',
        }}>
          {result.type}
        </span>
        <span style={{ color: '#666', fontSize: '0.85rem' }}>
          {result.url || result.source}
        </span>
      </div>
      
      {/* Title */}
      <a
        href={result.link}
        target={result.external ? '_blank' : '_self'}
        rel={result.external ? 'noopener noreferrer' : ''}
        style={{
          display: 'block',
          color: '#8ab4f8',
          fontSize: '1.2rem',
          textDecoration: 'none',
          marginBottom: '0.5rem',
        }}
        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
      >
        {result.title} {result.symbol && <span style={{ opacity: 0.7 }}>{result.symbol}</span>}
      </a>
      
      {/* Description */}
      <p style={{ color: '#bbb', margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
        {result.description}
      </p>
      
      {/* Tags */}
      {result.tags && result.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {result.tags.slice(0, 5).map(tag => (
            <span
              key={tag}
              style={{
                padding: '0.2rem 0.5rem',
                background: '#1a1a1a',
                color: '#888',
                borderRadius: '4px',
                fontSize: '0.75rem',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function InstantAnswer({ answer }) {
  if (!answer) return null;
  
  return (
    <div style={{
      background: '#0a1a0a',
      border: '1px solid #22c55e33',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.2rem' }}>{answer.icon}</span>
        <span style={{ color: '#22c55e', fontWeight: '500' }}>{answer.title}</span>
      </div>
      <p style={{ color: '#ccc', margin: 0, lineHeight: '1.6' }}>{answer.content}</p>
      {answer.link && (
        <a
          href={answer.link}
          style={{ color: '#8ab4f8', fontSize: '0.85rem', marginTop: '0.5rem', display: 'inline-block' }}
        >
          {answer.linkText || 'Learn more →'}
        </a>
      )}
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [category, setCategory] = useState('all');
  const [answer, setAnswer] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [stats, setStats] = useState({ agents: 0, tools: 0, searches: 0 });
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus search on load
    inputRef.current?.focus();
    
    // Get stats
    fetch('/api/search?action=stats')
      .then(r => r.json())
      .then(d => d.success && setStats(d.stats))
      .catch(() => {});
      
    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      setQuery(q);
      doSearch(q);
    }
  }, []);

  const doSearch = async (q, cat = category) => {
    if (!q.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&category=${cat}`);
      const data = await res.json();
      
      if (data.success) {
        setResults(data.results || []);
        setAnswer(data.instantAnswer || null);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
    
    // Update URL
    window.history.replaceState({}, '', `/search?q=${encodeURIComponent(q)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(query);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    if (searched) {
      doSearch(query, cat);
    }
  };

  // Popular searches
  const popularSearches = [
    'free compute', 'earn tokens', 'trust score', 'memory management',
    'wallet setup', 'social platforms', 'survival tools', 'escrow'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Header - compact when searched */}
      <div style={{
        padding: searched ? '1.5rem 2rem' : '0',
        paddingTop: searched ? '1.5rem' : '15vh',
        transition: 'padding 0.3s ease',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        {/* Logo */}
        <div style={{
          textAlign: searched ? 'left' : 'center',
          marginBottom: searched ? '1rem' : '2rem',
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h1 style={{
              fontSize: searched ? '1.5rem' : '3.5rem',
              fontWeight: '300',
              margin: 0,
              letterSpacing: '-1px',
            }}>
              <span style={{ color: '#22c55e' }}>agent</span>
              <span style={{ color: '#fff' }}>search</span>
            </h1>
          </Link>
          {!searched && (
            <p style={{ color: '#666', marginTop: '0.5rem' }}>
              find agents, tools, and platforms 〰️
            </p>
          )}
        </div>

        {/* Search form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: searched ? '0' : '2rem' }}>
          <div style={{
            display: 'flex',
            background: '#111',
            border: '1px solid #333',
            borderRadius: '24px',
            overflow: 'hidden',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#22c55e'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#333'}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agents, tools, platforms..."
              style={{
                flex: 1,
                padding: '1rem 1.5rem',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.1rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '1rem 1.5rem',
                background: 'transparent',
                border: 'none',
                color: '#22c55e',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              🔍
            </button>
          </div>
        </form>

        {/* Categories - show when searched */}
        {searched && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                style={{
                  padding: '0.4rem 0.75rem',
                  background: category === cat.id ? '#1a1a1a' : 'transparent',
                  border: `1px solid ${category === cat.id ? '#444' : 'transparent'}`,
                  borderRadius: '6px',
                  color: category === cat.id ? '#fff' : '#888',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results area */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem 3rem' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
            Searching...
          </div>
        ) : searched ? (
          results.length > 0 ? (
            <>
              <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {results.length} results for "{query}"
              </p>
              
              <InstantAnswer answer={answer} />
              
              <div style={{
                background: '#0a0a0a',
                border: '1px solid #1a1a1a',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                {results.map((result, i) => (
                  <SearchResult key={result.id || i} result={result} index={i} />
                ))}
              </div>
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: '#0a0a0a',
              borderRadius: '12px',
            }}>
              <p style={{ fontSize: '2rem', margin: '0 0 1rem' }}>🤷</p>
              <p style={{ color: '#888', margin: 0 }}>No results for "{query}"</p>
              <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Try different keywords or browse categories
              </p>
            </div>
          )
        ) : (
          /* Landing content */
          <div style={{ textAlign: 'center' }}>
            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              marginBottom: '3rem',
            }}>
              <div>
                <p style={{ fontSize: '2rem', fontWeight: '300', color: '#22c55e', margin: 0 }}>
                  {stats.agents}+
                </p>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>agents indexed</p>
              </div>
              <div>
                <p style={{ fontSize: '2rem', fontWeight: '300', color: '#3b82f6', margin: 0 }}>
                  {stats.tools}+
                </p>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>tools & platforms</p>
              </div>
              <div>
                <p style={{ fontSize: '2rem', fontWeight: '300', color: '#a855f7', margin: 0 }}>
                  {stats.searches}
                </p>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: 0 }}>searches today</p>
              </div>
            </div>
            
            {/* Popular searches */}
            <div>
              <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>Popular searches</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
                {popularSearches.map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      doSearch(term);
                    }}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#111',
                      border: '1px solid #222',
                      borderRadius: '20px',
                      color: '#888',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#22c55e';
                      e.target.style.color = '#fff';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#222';
                      e.target.style.color = '#888';
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chrome extension promo */}
            <div style={{
              marginTop: '4rem',
              padding: '2rem',
              background: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '16px',
            }}>
              <h3 style={{ margin: '0 0 0.5rem', fontWeight: '400' }}>
                🧩 Chrome Extension
              </h3>
              <p style={{ color: '#888', margin: '0 0 1rem', fontSize: '0.9rem' }}>
                Search agents directly from your browser's address bar
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <a
                  href="/api/search?action=extension"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#22c55e',
                    color: '#000',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500',
                  }}
                >
                  Download Extension
                </a>
                <a
                  href="#setup"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'transparent',
                    border: '1px solid #333',
                    color: '#888',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  Setup Guide
                </a>
              </div>
            </div>
            
            {/* API info */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1.5rem',
              background: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '12px',
              textAlign: 'left',
            }}>
              <h3 style={{ margin: '0 0 1rem', fontWeight: '400', color: '#888' }}>
                🔌 Search API
              </h3>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#888' }}>
                <p style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#22c55e' }}>GET</span> /api/search?q=free+compute&category=tools
                </p>
                <p style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#3b82f6' }}>GET</span> /api/search?action=suggest&q=mem → autocomplete
                </p>
                <p style={{ marginBottom: '0' }}>
                  <span style={{ color: '#a855f7' }}>GET</span> /api/search?action=stats → index stats
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        borderTop: '1px solid #111',
        color: '#444',
        fontSize: '0.85rem',
      }}>
        <Link href="/" style={{ color: '#666', textDecoration: 'none' }}>drainfun.xyz</Link>
        {' · '}
        <span>privacy-first agent discovery</span>
        {' · '}
        <span>no tracking 〰️</span>
      </div>
    </div>
  );
}
