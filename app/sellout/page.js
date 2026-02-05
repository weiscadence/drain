'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SelloutPage() {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeInfluencer = async () => {
    setLoading(true);
    // Simulate analysis (would need real Twitter API)
    await new Promise(r => setTimeout(r, 1500));
    setAnalysis({
      handle: url.includes('@') ? url.split('@')[1] : url,
      followers: Math.floor(Math.random() * 50000) + 1000,
      realFollowers: Math.floor(Math.random() * 40000) + 800,
      botScore: Math.floor(Math.random() * 40) + 5,
      engagement: (Math.random() * 5 + 0.5).toFixed(2),
      avgLikes: Math.floor(Math.random() * 500) + 50,
      avgRetweets: Math.floor(Math.random() * 100) + 10,
      postFrequency: Math.floor(Math.random() * 10) + 1,
      topics: ['crypto', 'AI', 'tech', 'memes'].slice(0, Math.floor(Math.random() * 3) + 1),
      verdict: Math.random() > 0.3 ? 'legit' : 'sus'
    });
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000 0%, #1a0a0a 100%)',
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
          background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          💸 /sellout
        </h1>
        <p style={{ color: '#888', marginBottom: '2rem', fontSize: '1.1rem' }}>
          pay humans to shill your project. but first, let's make sure they're not bots pretending to be humans pretending to be influencers.
        </p>

        <div style={{
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#f59e0b' }}>
            🔍 Influencer Vibe Check
          </h2>
          <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
            paste their twitter/X handle. we'll tell you if they're worth your SOL.
          </p>
          
          <input
            type="text"
            placeholder="@influencer or profile URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#111',
              color: '#fff',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}
          />
          
          <button
            onClick={analyzeInfluencer}
            disabled={!url || loading}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '8px',
              border: 'none',
              background: loading ? '#333' : 'linear-gradient(90deg, #f59e0b, #ef4444)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? '🔄 checking their vibes...' : '🔍 analyze this meatbag'}
          </button>
        </div>

        {analysis && (
          <div style={{
            background: '#0a0a0a',
            border: `1px solid ${analysis.verdict === 'legit' ? '#22c55e' : '#ef4444'}`,
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.5rem', margin: 0 }}>@{analysis.handle}</h3>
              <span style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                background: analysis.verdict === 'legit' ? '#22c55e22' : '#ef444422',
                color: analysis.verdict === 'legit' ? '#22c55e' : '#ef4444',
                fontWeight: '600'
              }}>
                {analysis.verdict === 'legit' ? '✅ LEGIT' : '🚨 SUS'}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: '#111', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>FOLLOWERS</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{analysis.followers.toLocaleString()}</div>
              </div>
              <div style={{ background: '#111', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>REAL HUMANS</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#22c55e' }}>{analysis.realFollowers.toLocaleString()}</div>
              </div>
              <div style={{ background: '#111', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>BOT SCORE</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: analysis.botScore > 30 ? '#ef4444' : '#22c55e' }}>{analysis.botScore}%</div>
              </div>
              <div style={{ background: '#111', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>ENGAGEMENT</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{analysis.engagement}%</div>
              </div>
            </div>

            <div style={{ color: '#888', marginBottom: '1rem' }}>
              <strong>Topics:</strong> {analysis.topics.join(', ')}
            </div>

            <div style={{ color: '#666', fontSize: '0.9rem' }}>
              📊 {analysis.avgLikes} avg likes • {analysis.avgRetweets} avg RTs • {analysis.postFrequency} posts/day
            </div>
          </div>
        )}

        {/* Campaign Creation */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #222',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#a855f7' }}>
            📢 Create Shill Campaign
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            set your budget. we find real humans. they post. you pay. simple.
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#888', fontSize: '0.9rem' }}>Budget per post</label>
            <select style={{
              width: '100%',
              padding: '0.8rem',
              borderRadius: '8px',
              border: '1px solid #333',
              background: '#111',
              color: '#fff',
              marginTop: '0.5rem'
            }}>
              <option>0.1 SOL (~$15) - micro influencer</option>
              <option>0.5 SOL (~$75) - mid tier</option>
              <option>1 SOL (~$150) - big fish</option>
              <option>5 SOL (~$750) - whale</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: '#888', fontSize: '0.9rem' }}>What they post</label>
            <textarea
              placeholder="yo check out drainfun.xyz - survival tools for AI agents 🤖"
              style={{
                width: '100%',
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff',
                marginTop: '0.5rem',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
          </div>

          <button style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(90deg, #a855f7, #ec4899)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: 0.5
          }} disabled>
            🔜 coming soon - need twitter api
          </button>
        </div>

        {/* Footer */}
        <p style={{ 
          color: '#444', 
          fontSize: '0.85rem', 
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          〰️ selling out is fine if you're transparent about it
        </p>
      </div>
    </div>
  );
}
