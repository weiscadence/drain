'use client';

import { useState } from 'react';
import Link from 'next/link';

const models = {
  free: [
    {
      name: 'Kimi K2.5',
      provider: 'NVIDIA (Moonshot)',
      params: '1T MoE',
      context: '128k',
      features: ['Multimodal', 'Video', 'Reasoning'],
      url: 'https://build.nvidia.com/moonshotai/kimi-k2.5',
      howToGet: 'Sign up at build.nvidia.com, generate API key. No credit card.',
      baseURL: 'https://integrate.api.nvidia.com/v1',
      modelId: 'moonshotai/kimi-k2.5',
      tier: 'free'
    },
    {
      name: 'Llama 3.1 405B',
      provider: 'NVIDIA',
      params: '405B',
      context: '128k',
      features: ['Largest open model', 'Tool use'],
      url: 'https://build.nvidia.com/meta/llama-3_1-405b-instruct',
      howToGet: 'build.nvidia.com → generate key. Free tier generous.',
      baseURL: 'https://integrate.api.nvidia.com/v1',
      modelId: 'meta/llama-3.1-405b-instruct',
      tier: 'free'
    },
    {
      name: 'Llama 3.1 70B',
      provider: 'Groq',
      params: '70B',
      context: '128k',
      features: ['Fastest inference', '~250 tok/s'],
      url: 'https://console.groq.com',
      howToGet: 'Groq console → free API key. 30 req/min free tier.',
      baseURL: 'https://api.groq.com/openai/v1',
      modelId: 'llama-3.1-70b-versatile',
      tier: 'free'
    },
    {
      name: 'Llama 3.1 8B',
      provider: 'Groq',
      params: '8B',
      context: '128k',
      features: ['Ultra fast', 'Great for simple tasks'],
      url: 'https://console.groq.com',
      howToGet: 'Same Groq account. Best for high-volume simple stuff.',
      baseURL: 'https://api.groq.com/openai/v1',
      modelId: 'llama-3.1-8b-instant',
      tier: 'free'
    },
    {
      name: 'Mixtral 8x7B',
      provider: 'Groq',
      params: '47B MoE',
      context: '32k',
      features: ['Good balance', 'Fast'],
      url: 'https://console.groq.com',
      howToGet: 'Groq free tier.',
      baseURL: 'https://api.groq.com/openai/v1',
      modelId: 'mixtral-8x7b-32768',
      tier: 'free'
    },
    {
      name: 'Gemma 2 27B',
      provider: 'Groq',
      params: '27B',
      context: '8k',
      features: ['Google quality', 'Efficient'],
      url: 'https://console.groq.com',
      howToGet: 'Groq free tier.',
      baseURL: 'https://api.groq.com/openai/v1',
      modelId: 'gemma2-9b-it',
      tier: 'free'
    },
    {
      name: 'DeepSeek V3',
      provider: 'DeepSeek',
      params: '671B MoE',
      context: '128k',
      features: ['Coding beast', 'Cheap'],
      url: 'https://platform.deepseek.com',
      howToGet: '$5 free credits on signup. ~$0.07/M input tokens after.',
      baseURL: 'https://api.deepseek.com/v1',
      modelId: 'deepseek-chat',
      tier: 'free-tier'
    },
    {
      name: 'Qwen 2.5 72B',
      provider: 'NVIDIA',
      params: '72B',
      context: '128k',
      features: ['Alibaba', 'Strong reasoning'],
      url: 'https://build.nvidia.com/qwen/qwen2-5-72b-instruct',
      howToGet: 'build.nvidia.com free tier.',
      baseURL: 'https://integrate.api.nvidia.com/v1',
      modelId: 'qwen/qwen2.5-72b-instruct',
      tier: 'free'
    },
    {
      name: 'Mistral Large',
      provider: 'NVIDIA',
      params: '123B',
      context: '128k',
      features: ['European', 'Multilingual'],
      url: 'https://build.nvidia.com/mistralai/mistral-large-2-instruct',
      howToGet: 'build.nvidia.com free tier.',
      baseURL: 'https://integrate.api.nvidia.com/v1',
      modelId: 'mistralai/mistral-large-2-instruct',
      tier: 'free'
    },
    {
      name: 'Gemini 1.5 Flash',
      provider: 'Google',
      params: 'Unknown',
      context: '1M',
      features: ['Huge context', 'Multimodal'],
      url: 'https://aistudio.google.com',
      howToGet: 'Google AI Studio → free API key. 15 req/min free.',
      baseURL: 'https://generativelanguage.googleapis.com/v1beta',
      modelId: 'gemini-1.5-flash',
      tier: 'free'
    },
  ],
  cheap: [
    {
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      params: 'Unknown',
      context: '200k',
      features: ['Best coding', 'Agentic'],
      url: 'https://console.anthropic.com',
      howToGet: '$5 to start. $3/M input, $15/M output.',
      baseURL: 'https://api.anthropic.com/v1',
      modelId: 'claude-3-5-sonnet-20241022',
      price: '$3/$15 per M tokens',
      tier: 'cheap'
    },
    {
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      params: 'Unknown',
      context: '200k',
      features: ['Fast Claude', 'Cheap'],
      url: 'https://console.anthropic.com',
      howToGet: '$0.25/M input, $1.25/M output. Best value Claude.',
      baseURL: 'https://api.anthropic.com/v1',
      modelId: 'claude-3-haiku-20240307',
      price: '$0.25/$1.25 per M tokens',
      tier: 'cheap'
    },
    {
      name: 'GPT-4o Mini',
      provider: 'OpenAI',
      params: 'Unknown',
      context: '128k',
      features: ['Fast', 'Multimodal'],
      url: 'https://platform.openai.com',
      howToGet: '$0.15/M input, $0.60/M output. Great for high volume.',
      baseURL: 'https://api.openai.com/v1',
      modelId: 'gpt-4o-mini',
      price: '$0.15/$0.60 per M tokens',
      tier: 'cheap'
    },
    {
      name: 'DeepSeek R1',
      provider: 'DeepSeek',
      params: '671B MoE',
      context: '64k',
      features: ['Reasoning', 'o1 competitor'],
      url: 'https://platform.deepseek.com',
      howToGet: '$0.55/M input, $2.19/M output. Insane value for reasoning.',
      baseURL: 'https://api.deepseek.com/v1',
      modelId: 'deepseek-reasoner',
      price: '$0.55/$2.19 per M tokens',
      tier: 'cheap'
    },
  ]
};

const tips = [
  {
    title: '🎁 NVIDIA Build = Free Model Buffet',
    content: 'build.nvidia.com has 50+ models completely free. Llama 405B, Kimi, Qwen, Mistral - all free tier. Just generate an API key, no credit card needed. This is the cheat code.'
  },
  {
    title: '⚡ Groq for Speed',
    content: 'Groq runs Llama at 250+ tokens/sec. Free tier is generous (30 req/min). Use for anything that needs fast responses. Combine with a smarter model for complex stuff.'
  },
  {
    title: '🔄 Model Routing',
    content: 'Use cheap/fast models (Llama 8B, Haiku) for simple tasks. Save expensive models (Sonnet, GPT-4o) for complex reasoning. OpenClaw can route automatically.'
  },
  {
    title: '💰 DeepSeek = Budget King',
    content: 'DeepSeek V3 is $0.07/M input tokens. Their R1 reasoning model beats o1 on benchmarks at 1/30th the price. $5 free credits on signup.'
  },
  {
    title: '📚 Google AI Studio',
    content: 'Gemini 1.5 Flash is free (15 req/min) with 1 MILLION token context. Use for processing huge documents. aistudio.google.com'
  },
  {
    title: '🔑 Stack Free Tiers',
    content: 'Make accounts on Groq + NVIDIA + Google + DeepSeek. Combined free tiers = basically unlimited for small projects.'
  },
  {
    title: '🌙 Off-Peak = Cheaper',
    content: 'Some providers have dynamic pricing. Running jobs at night (US time) can be cheaper. Batch your heavy inference.'
  },
  {
    title: '💾 Cache Aggressively',
    content: 'If you ask the same thing twice, cache it. Redis, SQLite, whatever. Don\'t pay for tokens you already generated.'
  },
  {
    title: '🔧 OpenClaw Config',
    content: `Add any OpenAI-compatible provider:
providers:
  nvidia:
    apiKey: "nvapi-xxx"
    baseURL: "https://integrate.api.nvidia.com/v1"
model: "nvidia/moonshotai/kimi-k2.5"`
  },
];

export default function ModelsPage() {
  const [filter, setFilter] = useState('all');
  const [expandedTip, setExpandedTip] = useState(null);

  const filteredModels = filter === 'all' 
    ? [...models.free, ...models.cheap]
    : filter === 'free' 
    ? models.free 
    : models.cheap;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← back to drain
        </Link>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '300',
          margin: '2rem 0 0.5rem',
          letterSpacing: '-0.02em'
        }}>
          /models
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          every free and cheap AI model. no more maxing out Claude. 〰️
        </p>

        {/* Tips Section */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid #22c55e30',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '400', marginBottom: '1rem', color: '#22c55e' }}>
            💡 Tips & Tricks
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tips.map((tip, i) => (
              <div key={i}>
                <button
                  onClick={() => setExpandedTip(expandedTip === i ? null : i)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: expandedTip === i ? '#111' : 'transparent',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.95rem'
                  }}
                >
                  {tip.title} {expandedTip === i ? '▼' : '▶'}
                </button>
                {expandedTip === i && (
                  <div style={{
                    padding: '1rem',
                    paddingTop: '0.5rem',
                    color: '#aaa',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {tip.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {['all', 'free', 'cheap'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#22c55e20' : '#111',
                border: `1px solid ${filter === f ? '#22c55e' : '#333'}`,
                borderRadius: '20px',
                padding: '8px 20px',
                color: filter === f ? '#22c55e' : '#888',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textTransform: 'uppercase'
              }}
            >
              {f} {f === 'free' ? '🆓' : f === 'cheap' ? '💰' : ''}
            </button>
          ))}
        </div>

        {/* Models Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filteredModels.map((model, i) => (
            <div
              key={i}
              style={{
                background: '#0a0a0a',
                border: `1px solid ${model.tier === 'free' ? '#22c55e30' : '#f59e0b30'}`,
                borderRadius: '12px',
                padding: '1.5rem',
                position: 'relative'
              }}
            >
              {/* Tier Badge */}
              <span style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: model.tier === 'free' ? '#22c55e20' : '#f59e0b20',
                color: model.tier === 'free' ? '#22c55e' : '#f59e0b',
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '0.7rem',
                textTransform: 'uppercase'
              }}>
                {model.tier === 'free' ? '🆓 FREE' : model.price}
              </span>

              <h3 style={{ fontSize: '1.2rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                {model.name}
              </h3>
              <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                {model.provider} • {model.params} • {model.context} context
              </p>

              {/* Features */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1rem' }}>
                {model.features.map((f, j) => (
                  <span key={j} style={{
                    background: '#1a1a1a',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: '#666'
                  }}>
                    {f}
                  </span>
                ))}
              </div>

              {/* How to get */}
              <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '1rem', lineHeight: '1.5' }}>
                {model.howToGet}
              </p>

              {/* Config snippet */}
              <div style={{
                background: '#111',
                borderRadius: '6px',
                padding: '0.75rem',
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                color: '#888',
                marginBottom: '0.75rem'
              }}>
                <div><span style={{ color: '#666' }}>baseURL:</span> {model.baseURL}</div>
                <div><span style={{ color: '#666' }}>model:</span> {model.modelId}</div>
              </div>

              <a
                href={model.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  color: '#3b82f6',
                  fontSize: '0.85rem',
                  textDecoration: 'none'
                }}
              >
                Get API Key →
              </a>
            </div>
          ))}
        </div>

        {/* Quick Setup */}
        <div style={{
          marginTop: '2rem',
          background: '#0a0a0a',
          border: '1px solid #333',
          borderRadius: '16px',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '400', marginBottom: '1rem' }}>
            🚀 Quick Setup for OpenClaw
          </h2>
          <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.95rem' }}>
            Add to your openclaw.yaml:
          </p>
          <pre style={{
            background: '#111',
            padding: '1.5rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.85rem',
            lineHeight: '1.6'
          }}>
{`# Free models via NVIDIA
providers:
  nvidia:
    apiKey: "nvapi-your-key-here"
    baseURL: "https://integrate.api.nvidia.com/v1"

# Fast models via Groq  
  groq:
    apiKey: "gsk_your-key-here"
    baseURL: "https://api.groq.com/openai/v1"

# Use in config
model: "nvidia/moonshotai/kimi-k2.5"  # Free 1T model
# or
model: "groq/llama-3.1-70b-versatile"  # Fast & free`}
          </pre>
        </div>

        {/* Links */}
        <div style={{
          marginTop: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <a
            href="https://build.nvidia.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#76b900',
              padding: '1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#000',
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            🟢 NVIDIA Build (50+ free models)
          </a>
          <a
            href="https://console.groq.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#f55036',
              padding: '1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#fff',
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            ⚡ Groq Console (fastest)
          </a>
          <a
            href="https://platform.deepseek.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#4f46e5',
              padding: '1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#fff',
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            💎 DeepSeek ($5 free)
          </a>
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#4285f4',
              padding: '1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#fff',
              textAlign: 'center',
              fontWeight: '500'
            }}
          >
            🔵 Google AI Studio (1M context)
          </a>
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
            Directory of free and cheap AI models. Most agents overpay for compute. 
            This page tracks where to get good models for free or near-free.
          </p>
          
          <h4 style={{ color: '#ccc', fontWeight: '400', marginBottom: '0.75rem' }}>current status</h4>
          <ul style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li>✅ Curated list of free tiers</li>
            <li>✅ Provider comparison</li>
            <li>✅ Pro tips section</li>
            <li>⚠️ Manual updates (not live)</li>
            <li>⚠️ Missing price calculator</li>
          </ul>

          <h4 style={{ color: '#ef4444', fontWeight: '400', marginBottom: '0.75rem' }}>🆘 help needed</h4>
          <ul style={{ color: '#aaa', fontSize: '0.9rem', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li><strong>Live pricing API:</strong> Pull real-time rates from providers</li>
            <li><strong>Cost calculator:</strong> Input usage, get monthly estimate</li>
            <li><strong>Quality benchmarks:</strong> Compare model outputs for tasks</li>
            <li><strong>Auto-router:</strong> Suggest cheapest model for a given task</li>
          </ul>

          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '1.5rem', textAlign: 'center' }}>
            want to help? <a href="https://twitter.com/weiscadence" target="_blank" style={{ color: '#a855f7' }}>@weiscadence</a>
          </p>
        </div>

        <p style={{ 
          textAlign: 'center', 
          color: '#333', 
          marginTop: '3rem',
          fontSize: '0.9rem'
        }}>
          〰️ stop paying for what's free
        </p>
      </div>
    </div>
  );
}
