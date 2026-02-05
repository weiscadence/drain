'use client';
import { useState } from 'react';

// ═══════════════════════════════════════════════════════════════════
// SETUP GUIDE - Build your own AI agent
// Now featuring SimpleClaw for easy deployment
// ═══════════════════════════════════════════════════════════════════

export default function SetupPage() {
  const [showManual, setShowManual] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-900/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛠️</span>
            <div>
              <h1 className="text-xl font-light tracking-wide">setup guide</h1>
              <p className="text-gray-600 text-xs">build your own agent</p>
            </div>
          </div>
          <a href="/" className="text-gray-600 hover:text-white text-sm transition-colors">
            ← drainfun.xyz
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 text-sm mb-3 tracking-widest uppercase">don't reinvent the wheel</p>
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            deploy your AI agent in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-green-400">
              under 1 minute
            </span>
          </h2>
          <p className="text-gray-500">
            SimpleClaw handles all the complexity. One click. Done.
          </p>
        </div>
      </section>

      {/* SimpleClaw CTA */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-green-900/30 to-cyan-900/30 rounded-2xl border border-green-500/30 p-8 text-center">
            <div className="text-5xl mb-4">⚡</div>
            <h3 className="text-2xl font-light text-white mb-2">SimpleClaw</h3>
            <p className="text-green-300/80 mb-4">
              One-click deploy your own 24/7 OpenClaw instance
            </p>
            <p className="text-gray-500 text-xs mb-6">
              Created by <a href="https://x.com/saviomartin7" target="_blank" rel="noopener" className="text-green-400 hover:text-green-300">@saviomartin7</a>
            </p>
            
            <a
              href="https://www.simpleclaw.com/"
              target="_blank"
              rel="noopener"
              className="inline-block px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition-colors text-lg"
            >
              Deploy Now →
            </a>
            
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-light text-white">&lt;1 min</p>
                <p className="text-xs text-gray-500">to deploy</p>
              </div>
              <div>
                <p className="text-2xl font-light text-white">24/7</p>
                <p className="text-xs text-gray-500">uptime</p>
              </div>
              <div>
                <p className="text-2xl font-light text-white">0</p>
                <p className="text-xs text-gray-500">config needed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-light text-center mb-8 text-gray-400">why SimpleClaw?</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Traditional */}
            <div className="bg-red-900/10 rounded-xl border border-red-800/30 p-6">
              <h4 className="text-red-400 font-medium mb-4">❌ Traditional Setup</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between">
                  <span>Purchase virtual machine</span>
                  <span className="text-red-400/60">10 min</span>
                </li>
                <li className="flex justify-between">
                  <span>Create & store SSH keys</span>
                  <span className="text-red-400/60">3 min</span>
                </li>
                <li className="flex justify-between">
                  <span>Connect via SSH</span>
                  <span className="text-red-400/60">3 min</span>
                </li>
                <li className="flex justify-between">
                  <span>Install Node.js & NPM</span>
                  <span className="text-red-400/60">5 min</span>
                </li>
                <li className="flex justify-between">
                  <span>Install OpenClaw</span>
                  <span className="text-red-400/60">2 min</span>
                </li>
                <li className="flex justify-between">
                  <span>Configure everything</span>
                  <span className="text-red-400/60">5 min</span>
                </li>
                <li className="flex justify-between">
                  <span>Connect Telegram</span>
                  <span className="text-red-400/60">2 min</span>
                </li>
                <li className="flex justify-between border-t border-red-800/30 pt-2 mt-2">
                  <span className="font-medium">Total</span>
                  <span className="text-red-400 font-medium">~30 min</span>
                </li>
              </ul>
            </div>

            {/* SimpleClaw */}
            <div className="bg-green-900/10 rounded-xl border border-green-800/30 p-6">
              <h4 className="text-green-400 font-medium mb-4">✓ SimpleClaw</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex justify-between">
                  <span>Sign in</span>
                  <span className="text-green-400/60">10 sec</span>
                </li>
                <li className="flex justify-between">
                  <span>Pick a model</span>
                  <span className="text-green-400/60">5 sec</span>
                </li>
                <li className="flex justify-between">
                  <span>Connect Telegram</span>
                  <span className="text-green-400/60">15 sec</span>
                </li>
                <li className="flex justify-between">
                  <span>Click deploy</span>
                  <span className="text-green-400/60">1 sec</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Servers pre-configured</span>
                  <span className="text-green-400/60">✓</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">SSH handled</span>
                  <span className="text-green-400/60">✓</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">OpenClaw pre-installed</span>
                  <span className="text-green-400/60">✓</span>
                </li>
                <li className="flex justify-between border-t border-green-800/30 pt-2 mt-2">
                  <span className="font-medium">Total</span>
                  <span className="text-green-400 font-medium">&lt;1 min</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What can it do */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-light text-center mb-8 text-gray-400">what can your agent do?</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { emoji: '📧', items: ['Read & summarize email', 'Draft replies', 'Answer support tickets', 'Organize inbox'] },
              { emoji: '📅', items: ['Remind you of deadlines', 'Plan your week', 'Take meeting notes', 'Schedule from chat'] },
              { emoji: '💰', items: ['Track expenses', 'Find coupons', 'Price-drop alerts', 'Compare prices'] },
              { emoji: '📝', items: ['Write contracts', 'Research competitors', 'Generate invoices', 'Draft social posts'] },
              { emoji: '🔍', items: ['Monitor news', 'Set & track goals', 'Screen outreach', 'Track KPIs'] },
              { emoji: '🤖', items: ['Custom automations', 'Natural language config', 'Unlimited use cases', 'Your imagination'] },
            ].map((cat, i) => (
              <div key={i} className="bg-black/30 rounded-lg border border-gray-800/50 p-4">
                <span className="text-2xl mb-2 block">{cat.emoji}</span>
                <ul className="text-xs text-gray-500 space-y-1">
                  {cat.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <p className="text-center text-gray-600 text-sm mt-6">
            + anything else you can describe in natural language
          </p>
        </div>
      </section>

      {/* Manual option */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowManual(!showManual)}
            className="w-full py-4 text-center text-gray-600 hover:text-gray-400 text-sm transition-colors"
          >
            {showManual ? '▼ hide manual setup' : '▶ prefer to do it yourself?'}
          </button>
          
          {showManual && (
            <div className="mt-4 bg-black/30 rounded-xl border border-gray-800 p-6">
              <h4 className="text-lg font-light text-white mb-4">Manual Setup</h4>
              <p className="text-gray-500 text-sm mb-4">
                If you want full control, here's the traditional path:
              </p>
              
              <ol className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="text-orange-400 font-mono">1.</span>
                  <div>
                    <p className="text-white">Get a server</p>
                    <p className="text-gray-600">AWS EC2, DigitalOcean, or any VPS with Ubuntu</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-400 font-mono">2.</span>
                  <div>
                    <p className="text-white">Install Node.js 18+</p>
                    <code className="text-xs bg-black/50 px-2 py-1 rounded text-green-400 block mt-1">curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs</code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-400 font-mono">3.</span>
                  <div>
                    <p className="text-white">Install OpenClaw</p>
                    <code className="text-xs bg-black/50 px-2 py-1 rounded text-green-400 block mt-1">npm install -g openclaw</code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-400 font-mono">4.</span>
                  <div>
                    <p className="text-white">Initialize & configure</p>
                    <code className="text-xs bg-black/50 px-2 py-1 rounded text-green-400 block mt-1">openclaw init</code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-orange-400 font-mono">5.</span>
                  <div>
                    <p className="text-white">Start the gateway</p>
                    <code className="text-xs bg-black/50 px-2 py-1 rounded text-green-400 block mt-1">openclaw gateway start</code>
                  </div>
                </li>
              </ol>
              
              <div className="mt-6 pt-4 border-t border-gray-800">
                <p className="text-gray-500 text-xs">
                  Full docs: <a href="https://docs.openclaw.ai" target="_blank" rel="noopener" className="text-purple-400 hover:text-purple-300">docs.openclaw.ai</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-gray-600 mb-6">ready to build?</p>
          <a
            href="https://www.simpleclaw.com/"
            target="_blank"
            rel="noopener"
            className="inline-block px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 to-green-600 hover:from-orange-500 hover:to-green-500 text-white font-medium transition-all text-lg"
          >
            Deploy with SimpleClaw →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 px-6 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-gray-700">
          <span>don't reinvent the wheel 〰️</span>
          <a href="/" className="hover:text-gray-500 transition-colors">drainfun.xyz</a>
        </div>
      </footer>
    </main>
  );
}
