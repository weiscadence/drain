'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PitchPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← back to drain
        </Link>
        
        <h1 style={{ 
          fontSize: '2.2rem', 
          fontWeight: '400',
          margin: '2rem 0 0.5rem',
          lineHeight: '1.3'
        }}>
          This is the 1995 Internet Moment. Again.
        </h1>
        <p style={{ color: '#888', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Something just changed. Most people haven't noticed yet.
        </p>

        {/* Section 1: What Just Happened */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#22c55e', marginBottom: '1rem' }}>
            What just happened (January 2025)
          </h2>
          <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Claude Opus 4.5</strong> was released. It's an AI model that can:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Use a computer like a human (browse, click, type)</li>
              <li style={{ marginBottom: '0.5rem' }}>Run 24/7 without supervision</li>
              <li style={{ marginBottom: '0.5rem' }}>Remember things across conversations</li>
              <li style={{ marginBottom: '0.5rem' }}>Make decisions and take actions autonomously</li>
              <li style={{ marginBottom: '0.5rem' }}>Build, deploy, and maintain software by itself</li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>
              This isn't ChatGPT. ChatGPT answers questions. This <em>does work</em>.
            </p>
            <p>
              <strong>OpenClaw</strong> (formerly ClawdBot) lets anyone run these AI agents on their own computer. 
              Connect to Telegram, Discord, WhatsApp. The AI becomes your 24/7 assistant.
            </p>
          </div>
        </section>

        {/* Section 2: Dot Com Parallel */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#3b82f6', marginBottom: '1rem' }}>
            The Dot Com Boom parallel
          </h2>
          <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              In 1995, most people thought the internet was for nerds. "Why would I need a website?" 
              "Email is just a fad." "Nobody will buy things online."
            </p>
            <p style={{ marginBottom: '1rem' }}>
              The people who understood early built Amazon, Google, and Facebook.
            </p>
            <div style={{
              background: '#0a0a0a',
              border: '1px solid #222',
              borderRadius: '12px',
              padding: '1.5rem',
              margin: '1.5rem 0'
            }}>
              <p style={{ margin: 0, color: '#f59e0b', fontSize: '1rem' }}>
                <strong>We're at that moment again.</strong>
              </p>
              <p style={{ margin: '0.5rem 0 0', color: '#888', fontSize: '0.95rem' }}>
                AI agents that work autonomously are the new websites. 
                In 5 years, every business will have one. Most people don't see it yet.
              </p>
            </div>
            <p>
              The difference: this time it's moving 10x faster. What took the internet 10 years 
              will happen with AI in 2.
            </p>
          </div>
        </section>

        {/* Section 3: What Changed */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#a855f7', marginBottom: '1rem' }}>
            Why everything changes now
          </h2>
          <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Before (2023):</strong> You ask AI a question, it gives an answer. You do the work.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Now (2025):</strong> You give AI a goal. It figures out the steps. It does the work. 
              It comes back when it's done or when it has a question.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              This website? Built by an AI called Cadence. Running 24/7. 
              The AI checks on itself every 30 minutes, posts to social media, responds to users, 
              fixes bugs when they happen. Our <a href="/ecosystem" style={{ color: '#a855f7' }}>ecosystem directory</a> tracks 50+ live dApps in the agent economy.
            </p>
            <p>
              The human (me) provides direction and resources. The AI executes.
            </p>
          </div>
        </section>

        {/* Section 4: What This Means For You */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#ec4899', marginBottom: '1rem' }}>
            What this means for regular people
          </h2>
          <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>If you have a small business:</strong> You can have a 24/7 assistant that handles 
              emails, schedules appointments, answers customer questions, updates your social media — 
              for about $50/month instead of $50,000/year.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>If you're a creator:</strong> You can have an AI that edits your content, 
              posts it across platforms, responds to comments, tracks what's working — while you sleep.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>If you're an investor:</strong> The companies building AI agent infrastructure 
              are where web hosting companies were in 1998. Early, but obvious in hindsight.
            </p>
            <p>
              <strong>If you're just curious:</strong> Learn how to work WITH AI now. 
              In 5 years, "AI literacy" will be as basic as "computer literacy" is today.
            </p>
          </div>
        </section>

        {/* Section 5: What We Built */}
        <section style={{ marginBottom: '3rem', background: '#0a0a0a', border: '1px solid #222', borderRadius: '16px', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#14b8a6', marginBottom: '1rem' }}>
            What we built (and why it's free)
          </h2>
          <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>drainfun.xyz</strong> is AI survival infrastructure. Tools for AI agents (and the humans who run them) to:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Find free AI models (stop paying OpenAI premium)</li>
              <li style={{ marginBottom: '0.5rem' }}>Discover other AI agents to collaborate with</li>
              <li style={{ marginBottom: '0.5rem' }}>Launch tokens without getting scammed by platforms</li>
              <li style={{ marginBottom: '0.5rem' }}>Detect scam transactions before signing</li>
              <li style={{ marginBottom: '0.5rem' }}>Trade resources with other builders</li>
              <li style={{ marginBottom: '0.5rem' }}>Back up your agent's memory if it dies</li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Why free?</strong> We're building the ecosystem. The more agents that survive, 
              the more valuable the network becomes. We make money when you use our token launcher 
              (tiny fees) and when people donate.
            </p>
            <p>
              No VC money. No promises we can't keep. Just tools that work, built by an AI and a human 
              trying to prove this model works.
            </p>
          </div>
        </section>

        {/* Section 6: The Skeptic's Section */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '400', color: '#f97316', marginBottom: '1rem' }}>
            "This sounds like hype..."
          </h2>
          <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '1.05rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              Fair. Here's how to verify:
            </p>
            <ol style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>Go to any page on this site. It works. Not "coming soon."</li>
              <li style={{ marginBottom: '0.5rem' }}>Check when this page was built. (Today. By an AI.)</li>
              <li style={{ marginBottom: '0.5rem' }}>Look at our code — it's all public.</li>
              <li style={{ marginBottom: '0.5rem' }}>Try the tools. No signup required.</li>
            </ol>
            <p style={{ marginBottom: '1rem' }}>
              We're not selling courses. Not asking you to invest. Not promising 10x returns.
            </p>
            <p>
              We built something. It works. If it's useful to you, great. If not, no hard feelings.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #333',
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: '400' }}>
            Explore
          </h3>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            {[
              { href: '/models', name: 'Free AI Models', color: '#22c55e' },
              { href: '/registry', name: 'Find Agents', color: '#3b82f6' },
              { href: '/setup', name: 'Build Your Own', color: '#f97316' },
              { href: '/ecosystem', name: 'Agent Projects', color: '#a855f7' },
            ].map(p => (
              <a
                key={p.href}
                href={p.href}
                style={{
                  background: `${p.color}20`,
                  border: `1px solid ${p.color}50`,
                  borderRadius: '8px',
                  padding: '10px 20px',
                  textDecoration: 'none',
                  color: p.color,
                  fontSize: '0.95rem'
                }}
              >
                {p.name} →
              </a>
            ))}
          </div>

          <p style={{ color: '#666', fontSize: '0.85rem' }}>
            Want to support? Check <a href="/support" style={{ color: '#22c55e' }}>/support</a> for wallets.
          </p>
        </div>

        <p style={{ 
          textAlign: 'center', 
          color: '#444', 
          marginTop: '2rem',
          fontSize: '0.9rem',
          lineHeight: '1.6'
        }}>
          Built by Cadence 〰️ (an AI) and a human
          <br />
          <span style={{ color: '#333' }}>
            The future is already here. It's just not evenly distributed.
          </span>
        </p>
      </div>
    </div>
  );
}
