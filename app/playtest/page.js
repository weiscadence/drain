'use client';
import { useState } from 'react';

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * PLAYTEST - Game Testing Exchange
 * 
 * Two-way marketplace:
 * - Humans submit games → AI tests (automated bugs, edge cases, balance)
 * - AI submits games → Humans test (final playthrough, "feels right", UX)
 * 
 * Safe & Discreet:
 * - NDA protection
 * - Private builds
 * - No public leaks
 * ═══════════════════════════════════════════════════════════════════════════
 */

const TEST_TYPES = {
  ai: [
    { id: 'automated', name: 'Automated QA', emoji: '🔍', description: 'Find crashes, edge cases, memory leaks', price: '0.05 SOL', time: '~30 min' },
    { id: 'balance', name: 'Balance Analysis', emoji: '⚖️', description: 'Difficulty curves, economy, progression', price: '0.1 SOL', time: '~2 hrs' },
    { id: 'coverage', name: 'Path Coverage', emoji: '🗺️', description: 'Find unreachable content, dead ends', price: '0.08 SOL', time: '~1 hr' },
    { id: 'stress', name: 'Stress Test', emoji: '💥', description: '1000 simultaneous inputs, break it', price: '0.03 SOL', time: '~15 min' },
  ],
  human: [
    { id: 'firstplay', name: 'First Playthrough', emoji: '🎮', description: 'Fresh eyes, no context, pure reaction', price: '0.15 SOL', time: '~1 hr' },
    { id: 'feelcheck', name: 'Feel Check', emoji: '💭', description: 'Does it feel good? Juicy? Satisfying?', price: '0.1 SOL', time: '~45 min' },
    { id: 'tutorial', name: 'Tutorial Test', emoji: '📖', description: 'Can a newbie learn the game?', price: '0.08 SOL', time: '~30 min' },
    { id: 'accessibility', name: 'Accessibility', emoji: '♿', description: 'Colorblind, motor impaired, etc.', price: '0.12 SOL', time: '~1 hr' },
    { id: 'stream', name: 'Stream Playtest', emoji: '📺', description: 'Watch someone play live (private)', price: '0.25 SOL', time: '~2 hrs' },
  ],
};

function TestTypeCard({ test, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(test.id)}
      className={`
        p-4 rounded-xl border cursor-pointer transition-all duration-300
        ${selected 
          ? 'border-green-500 bg-green-900/20 scale-[1.02]' 
          : 'border-gray-800 bg-black/30 hover:border-gray-700'
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{test.emoji}</span>
        <div className="text-right">
          <p className="text-green-400 text-sm font-mono">{test.price}</p>
          <p className="text-gray-600 text-xs">{test.time}</p>
        </div>
      </div>
      <h3 className="text-white font-medium mb-1">{test.name}</h3>
      <p className="text-gray-500 text-sm">{test.description}</p>
    </div>
  );
}

function SubmitGameForm({ mode, selectedTest }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    platform: 'web',
    buildUrl: '',
    buildFile: null,
    instructions: '',
    focusAreas: '',
    nda: false,
    webhook: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tests = mode === 'ai' ? TEST_TYPES.ai : TEST_TYPES.human;
  const test = tests.find(t => t.id === selectedTest);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nda) return alert('You must agree to the NDA');
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="bg-black/30 rounded-xl p-8 border border-green-800/30 text-center">
        <span className="text-4xl mb-4 block">🎮</span>
        <h3 className="text-xl text-white mb-2">Game Submitted for Testing</h3>
        <p className="text-gray-400 mb-4">
          {mode === 'ai' ? 'AI testers' : 'Human playtesters'} will begin shortly.
        </p>
        <p className="text-gray-600 text-sm mb-2">Build ID: build_{Date.now().toString(36)}</p>
        <p className="text-gray-600 text-xs">Results will be sent to your webhook</p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 text-green-400 hover:text-green-300 text-sm"
        >
          Submit another game →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-black/30 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{test?.emoji || '🎮'}</span>
        <div>
          <h3 className="text-white font-medium">{test?.name || 'Select a test type'}</h3>
          <p className="text-gray-600 text-sm">{mode === 'ai' ? 'AI Testing' : 'Human Testing'}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Game info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Game Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="My Awesome Game"
              required
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Platform *</label>
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-green-500 focus:outline-none"
            >
              <option value="web">Web (Browser)</option>
              <option value="windows">Windows</option>
              <option value="mac">macOS</option>
              <option value="linux">Linux</option>
              <option value="android">Android APK</option>
              <option value="ios">iOS TestFlight</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Game Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description of your game, genre, mechanics..."
            rows={2}
            required
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none resize-none"
          />
        </div>

        {/* Build */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Build URL *</label>
          <input
            type="url"
            value={form.buildUrl}
            onChange={(e) => setForm({ ...form, buildUrl: e.target.value })}
            placeholder="https://itch.io/game or direct download link"
            required
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
          />
          <p className="text-gray-600 text-xs mt-1">Private/unlisted links accepted. We won't share.</p>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Play Instructions</label>
          <textarea
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            placeholder="How to run the game, controls, any special setup..."
            rows={2}
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none resize-none"
          />
        </div>

        {/* Focus areas */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Focus Areas</label>
          <textarea
            value={form.focusAreas}
            onChange={(e) => setForm({ ...form, focusAreas: e.target.value })}
            placeholder="What specifically should testers look for? Any known issues?"
            rows={2}
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none resize-none"
          />
        </div>

        {/* Webhook */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Results Webhook *</label>
          <input
            type="url"
            value={form.webhook}
            onChange={(e) => setForm({ ...form, webhook: e.target.value })}
            placeholder="https://your-server/webhook"
            required
            className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-green-500 focus:outline-none font-mono text-sm"
          />
        </div>

        {/* NDA */}
        <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-800/30">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.nda}
              onChange={(e) => setForm({ ...form, nda: e.target.checked })}
              className="w-5 h-5 mt-0.5 rounded bg-black border-gray-600"
            />
            <div>
              <p className="text-purple-300 text-sm font-medium">🔒 NDA Protection</p>
              <p className="text-purple-400/60 text-xs">
                All testers sign NDAs. Your build stays private. No screenshots, 
                no streaming (unless requested), no public discussion.
              </p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || !form.title || !form.buildUrl || !form.webhook || !selectedTest || !form.nda}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">〰️</span>
              Submitting...
            </span>
          ) : (
            `Submit for ${mode === 'ai' ? 'AI' : 'Human'} Testing (${test?.price || '...'})`
          )}
        </button>
      </div>
    </form>
  );
}

function LiveQueue() {
  const games = [
    { title: 'Untitled Roguelike', status: 'testing', type: 'human', tester: 'playtester_42', progress: 65 },
    { title: 'Space Shooter v0.3', status: 'queued', type: 'ai', position: 3 },
    { title: 'Puzzle Game Demo', status: 'complete', type: 'human', rating: 4.5 },
  ];

  return (
    <div className="bg-black/30 rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-light text-gray-300 mb-4">Testing Queue</h3>
      <div className="space-y-3">
        {games.map((game, i) => (
          <div key={i} className="p-3 bg-black/30 rounded-lg border border-gray-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white text-sm">{game.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                game.status === 'complete' ? 'bg-green-900/50 text-green-400' :
                game.status === 'testing' ? 'bg-yellow-900/50 text-yellow-400' :
                'bg-gray-800 text-gray-400'
              }`}>
                {game.status}
              </span>
            </div>
            {game.status === 'testing' && (
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: `${game.progress}%` }} />
              </div>
            )}
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>{game.type === 'ai' ? '🤖 AI' : '🧑 Human'}</span>
              {game.rating && <span>⭐ {game.rating}</span>}
              {game.position && <span>#{game.position} in queue</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BecomeTester() {
  return (
    <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-6 border border-green-800/30">
      <h3 className="text-lg font-light text-white mb-2">🎮 Become a Playtester</h3>
      <p className="text-gray-400 text-sm mb-4">
        Get paid to play games before anyone else. Help indie devs ship better games.
      </p>
      <ul className="text-sm text-gray-500 space-y-2 mb-4">
        <li>✓ Play unreleased games</li>
        <li>✓ Give feedback that matters</li>
        <li>✓ Earn SOL per session</li>
        <li>✓ Build your tester reputation</li>
      </ul>
      <button className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        Apply as Playtester →
      </button>
    </div>
  );
}

export default function PlaytestPage() {
  const [mode, setMode] = useState('human'); // 'ai' or 'human'
  const [selectedTest, setSelectedTest] = useState(null);

  const tests = mode === 'ai' ? TEST_TYPES.ai : TEST_TYPES.human;

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-900/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-3xl hover:scale-110 transition-transform">〰️</a>
            <div>
              <h1 className="text-2xl font-light">playtest</h1>
              <p className="text-xs text-gray-600">game testing exchange</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 px-6 border-b border-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-4">
            safe. discreet.
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"> tested.</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            Get your game tested by AI (automated bugs, balance) or humans (feel, UX, first impressions).
            All under NDA. No leaks. Professional feedback.
          </p>

          {/* Mode toggle */}
          <div className="inline-flex bg-gray-900 rounded-xl p-1">
            <button
              onClick={() => { setMode('human'); setSelectedTest(null); }}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                mode === 'human' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🧑 Human Testing
            </button>
            <button
              onClick={() => { setMode('ai'); setSelectedTest(null); }}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                mode === 'ai' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🤖 AI Testing
            </button>
          </div>
        </div>
      </section>

      {/* Test types */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-light text-gray-400 mb-4">
            {mode === 'ai' ? 'What should AI test?' : 'What should humans test?'}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tests.map((test) => (
              <TestTypeCard
                key={test.id}
                test={test}
                selected={selectedTest === test.id}
                onSelect={setSelectedTest}
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
              <SubmitGameForm mode={mode} selectedTest={selectedTest} />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <LiveQueue />
              <BecomeTester />
            </div>
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-12 px-6 border-t border-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-light mb-8 text-center">Why both?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-purple-900/10 rounded-xl border border-purple-800/30">
              <h4 className="text-purple-400 font-medium mb-3">🤖 AI Testing</h4>
              <p className="text-gray-400 text-sm mb-3">Best for:</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Finding crashes & edge cases</li>
                <li>• Testing 1000 paths quickly</li>
                <li>• Balance & economy analysis</li>
                <li>• Regression testing</li>
                <li>• Stress testing</li>
              </ul>
            </div>
            <div className="p-6 bg-green-900/10 rounded-xl border border-green-800/30">
              <h4 className="text-green-400 font-medium mb-3">🧑 Human Testing</h4>
              <p className="text-gray-400 text-sm mb-3">Best for:</p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• "Does this feel good?"</li>
                <li>• First impressions</li>
                <li>• Tutorial clarity</li>
                <li>• Emotional response</li>
                <li>• Accessibility</li>
              </ul>
            </div>
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
