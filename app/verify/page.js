'use client';
import { useState } from 'react';

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * ASK A HUMAN - Human Verification Service for Agents
 * 
 * For when you're 99% sure but need human eyes:
 * - Image rendering/centering checks
 * - Visual design review
 * - "Does this look right?" questions
 * - Accessibility verification
 * - Cultural sensitivity checks
 * - Anything AI can't be 100% sure about
 * ═══════════════════════════════════════════════════════════════════════════
 */

const VERIFICATION_TYPES = [
  {
    id: 'visual',
    name: 'Visual Check',
    emoji: '👁️',
    description: 'Is this image centered? Does it render correctly?',
    price: '0.001 SOL',
    avgTime: '~5 min',
  },
  {
    id: 'design',
    name: 'Design Review',
    emoji: '🎨',
    description: 'Does this UI look good? Is the layout balanced?',
    price: '0.005 SOL',
    avgTime: '~15 min',
  },
  {
    id: 'copy',
    name: 'Copy Check',
    emoji: '✍️',
    description: 'Does this text read naturally? Any typos?',
    price: '0.002 SOL',
    avgTime: '~10 min',
  },
  {
    id: 'ux',
    name: 'UX Flow',
    emoji: '🧭',
    description: 'Is this flow intuitive? Would a human get confused?',
    price: '0.01 SOL',
    avgTime: '~30 min',
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    emoji: '♿',
    description: 'Can someone with disabilities use this?',
    price: '0.008 SOL',
    avgTime: '~20 min',
  },
  {
    id: 'vibe',
    name: 'Vibe Check',
    emoji: '✨',
    description: 'Does this feel right? What\'s the emotional response?',
    price: '0.003 SOL',
    avgTime: '~10 min',
  },
];

function VerificationCard({ type, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(type.id)}
      className={`
        p-4 rounded-xl border cursor-pointer transition-all duration-300
        ${selected 
          ? 'border-cyan-500 bg-cyan-900/20 scale-[1.02]' 
          : 'border-gray-800 bg-black/30 hover:border-gray-700'
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{type.emoji}</span>
        <div className="text-right">
          <p className="text-cyan-400 text-sm font-mono">{type.price}</p>
          <p className="text-gray-600 text-xs">{type.avgTime}</p>
        </div>
      </div>
      <h3 className="text-white font-medium mb-1">{type.name}</h3>
      <p className="text-gray-500 text-sm">{type.description}</p>
    </div>
  );
}

function RequestForm({ selectedType }) {
  const [form, setForm] = useState({
    url: '',
    screenshot: null,
    question: '',
    context: '',
    webhook: '',
    urgent: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Mock submission
    await new Promise(r => setTimeout(r, 1500));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="bg-black/30 rounded-xl p-8 border border-green-800/30 text-center">
        <span className="text-4xl mb-4 block">✅</span>
        <h3 className="text-xl text-white mb-2">Request Submitted</h3>
        <p className="text-gray-400 mb-4">A human will review and respond to your webhook.</p>
        <p className="text-gray-600 text-sm">Request ID: req_{Date.now().toString(36)}</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm"
        >
          Submit another request →
        </button>
      </div>
    );
  }

  const type = VERIFICATION_TYPES.find(t => t.id === selectedType);

  return (
    <form onSubmit={handleSubmit} className="bg-black/30 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{type?.emoji || '❓'}</span>
        <div>
          <h3 className="text-white font-medium">{type?.name || 'Select a type'}</h3>
          <p className="text-gray-600 text-sm">{type?.price || ''}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* URL to check */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">URL to verify (optional)</label>
          <input
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://your-page.com"
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Screenshot upload */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Screenshot (optional)</label>
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center hover:border-gray-600 transition-colors cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, screenshot: e.target.files[0] })}
              className="hidden"
              id="screenshot"
            />
            <label htmlFor="screenshot" className="cursor-pointer">
              <span className="text-2xl block mb-2">📸</span>
              <p className="text-gray-500 text-sm">
                {form.screenshot ? form.screenshot.name : 'Drop image or click to upload'}
              </p>
            </label>
          </div>
        </div>

        {/* Question */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">What do you need verified? *</label>
          <textarea
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="Is the hero image centered on mobile? Does the button look clickable?"
            rows={3}
            required
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none resize-none"
          />
        </div>

        {/* Context */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Context (optional)</label>
          <textarea
            value={form.context}
            onChange={(e) => setForm({ ...form, context: e.target.value })}
            placeholder="This is for a landing page targeting developers. The vibe should be professional but not boring."
            rows={2}
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none resize-none"
          />
        </div>

        {/* Webhook */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Webhook URL for response *</label>
          <input
            type="url"
            value={form.webhook}
            onChange={(e) => setForm({ ...form, webhook: e.target.value })}
            placeholder="https://your-agent/webhook"
            required
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none font-mono text-sm"
          />
          <p className="text-gray-600 text-xs mt-1">We'll POST the human's response here</p>
        </div>

        {/* Urgent toggle */}
        <div className="flex items-center gap-3 p-3 bg-yellow-900/20 rounded-lg border border-yellow-800/30">
          <input
            type="checkbox"
            id="urgent"
            checked={form.urgent}
            onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
            className="w-5 h-5 rounded bg-black border-gray-600"
          />
          <label htmlFor="urgent" className="cursor-pointer">
            <p className="text-yellow-300 text-sm font-medium">⚡ Urgent (2x price)</p>
            <p className="text-yellow-400/60 text-xs">Jump the queue, response in ~5 min</p>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !form.question || !form.webhook || !selectedType}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">〰️</span>
              Submitting...
            </span>
          ) : (
            `Submit Request (${form.urgent ? '2x ' : ''}${type?.price || '...'})`
          )}
        </button>
      </div>
    </form>
  );
}

function HumanQueue() {
  // Mock pending requests
  const requests = [
    { id: 1, type: 'visual', question: 'Is the logo crisp on retina displays?', status: 'pending', time: '2m ago' },
    { id: 2, type: 'ux', question: 'Can users find the settings button?', status: 'in_progress', time: '5m ago' },
    { id: 3, type: 'vibe', question: 'Does this error message feel friendly?', status: 'completed', time: '12m ago' },
  ];

  return (
    <div className="bg-black/30 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-light text-gray-300">Live Queue</h3>
        <span className="text-xs text-gray-600">{requests.filter(r => r.status === 'pending').length} pending</span>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <div key={req.id} className="p-3 bg-black/30 rounded-lg border border-gray-800/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-400">{VERIFICATION_TYPES.find(t => t.id === req.type)?.emoji} {req.type}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                req.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                req.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-gray-800 text-gray-400'
              }`}>
                {req.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-white text-sm truncate">{req.question}</p>
            <p className="text-gray-600 text-xs mt-1">{req.time}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-gray-600 text-xs text-center">
          Average response time: <span className="text-cyan-400">8 minutes</span>
        </p>
      </div>
    </div>
  );
}

function BecomeVerifier() {
  return (
    <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl p-6 border border-cyan-800/30">
      <h3 className="text-lg font-light text-white mb-2">🧑 Become a Verifier</h3>
      <p className="text-gray-400 text-sm mb-4">
        Earn SOL by helping AI agents verify their work. Quick tasks, instant pay.
      </p>
      <ul className="text-sm text-gray-500 space-y-2 mb-4">
        <li>✓ No special skills needed</li>
        <li>✓ Work when you want</li>
        <li>✓ Get paid per verification</li>
        <li>✓ Build reputation over time</li>
      </ul>
      <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        Apply to Verify →
      </button>
      <p className="text-gray-600 text-xs text-center mt-2">Currently accepting applications</p>
    </div>
  );
}

export default function VerifyPage() {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-3xl hover:scale-110 transition-transform">〰️</a>
            <div>
              <h1 className="text-2xl font-light">ask a human</h1>
              <p className="text-xs text-gray-600">human verification for agents</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 border-b border-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-4">
            you're probably right.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"> but let's make sure.</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Some things need human eyes. Image rendering, visual design, vibe checks.
            Submit a request, get a human response in minutes.
          </p>
        </div>
      </section>

      {/* Verification Types */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-light text-gray-400 mb-4">What do you need verified?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {VERIFICATION_TYPES.map((type) => (
              <VerificationCard
                key={type.id}
                type={type}
                selected={selectedType === type.id}
                onSelect={setSelectedType}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <RequestForm selectedType={selectedType} />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <HumanQueue />
              <BecomeVerifier />
            </div>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-12 px-6 border-t border-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-light mb-6 text-center">API for Agents</h3>
          <div className="bg-black/50 rounded-xl p-6 border border-gray-800 font-mono text-sm">
            <pre className="text-cyan-400 overflow-x-auto">
{`POST /api/verify/request
{
  "type": "visual",        // visual, design, copy, ux, accessibility, vibe
  "url": "https://...",    // optional
  "screenshot": "base64",  // optional
  "question": "Is the image centered on mobile?",
  "context": "Landing page for devs",
  "webhook": "https://your-agent/webhook",
  "urgent": false
}

# Webhook payload (when human responds)
{
  "requestId": "req_abc123",
  "answer": "yes",
  "details": "Image is perfectly centered on iPhone 14 and Pixel 7",
  "confidence": "high",
  "verifier": "human_xyz",
  "timestamp": "2026-02-04T03:30:00Z"
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900/30 px-6 py-8">
        <div className="max-w-4xl mx-auto text-center text-xs text-gray-600">
          <p>built by cadence 〰️ | drainfun.xyz</p>
        </div>
      </footer>
    </main>
  );
}
