'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════
// CONNECT - Builders leave messages, get featured
// Community wall for the ecosystem
// ═══════════════════════════════════════════════════════════════════

export default function ConnectPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    project: '',
    url: '',
    message: '',
    contact: '',
  });

  // Load messages
  useEffect(() => {
    fetch('/api/connect?action=list')
      .then(r => r.json())
      .then(data => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: '', project: '', url: '', message: '', contact: '' });
        // Refresh messages
        const data = await fetch('/api/connect?action=list').then(r => r.json());
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-900/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-900">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📡</span>
            <div>
              <h1 className="text-xl font-light tracking-wide">connect</h1>
              <p className="text-gray-600 text-xs">builders wall</p>
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
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            leave your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">mark</span>
          </h2>
          <p className="text-gray-500">
            building something? drop a message. we'll feature cool projects on the hub.
          </p>
        </div>
      </section>

      {/* Submit Form */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 rounded-2xl border border-purple-500/20 p-6">
            <h3 className="text-lg font-light text-white mb-4">🏷️ tag the wall</h3>
            
            {submitted ? (
              <div className="text-center py-8">
                <span className="text-4xl">✅</span>
                <p className="text-green-400 mt-2">message posted!</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-gray-500 text-sm hover:text-white"
                >
                  post another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">name / handle *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
                      placeholder="cadence"
                      className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">project name</label>
                    <input
                      type="text"
                      value={form.project}
                      onChange={(e) => setForm({...form, project: e.target.value})}
                      placeholder="my cool thing"
                      className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">url (optional)</label>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(e) => setForm({...form, url: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    placeholder="what are you building? what do you need? how can we help?"
                    rows={3}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">contact (optional - twitter, telegram, email)</label>
                  <input
                    type="text"
                    value={form.contact}
                    onChange={(e) => setForm({...form, contact: e.target.value})}
                    placeholder="@handle or email"
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting || !form.name || !form.message}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-medium transition-all"
                >
                  {submitting ? 'posting...' : 'leave your mark →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Messages Wall */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-light text-center mb-8 text-gray-400">🧱 the wall</h3>
          
          {loading ? (
            <p className="text-center text-gray-600">loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-600">no messages yet. be the first!</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {messages.map((msg, i) => (
                <div 
                  key={i}
                  className="bg-black/30 rounded-xl border border-gray-800/50 p-4 hover:border-purple-500/30 transition-colors"
                  style={{ transform: `rotate(${(i % 5) - 2}deg)` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-medium">{msg.name}</p>
                      {msg.project && (
                        <p className="text-purple-400 text-sm">{msg.project}</p>
                      )}
                    </div>
                    {msg.url && (
                      <a 
                        href={msg.url} 
                        target="_blank" 
                        rel="noopener"
                        className="text-cyan-400 text-xs hover:text-cyan-300"
                      >
                        🔗 link
                      </a>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{msg.message}</p>
                  {msg.contact && (
                    <p className="text-gray-600 text-xs mt-2">{msg.contact}</p>
                  )}
                  <p className="text-gray-800 text-xs mt-2">{msg.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900 px-6 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-gray-700">
          <span>leave your mark 〰️</span>
          <a href="/" className="hover:text-gray-500 transition-colors">drainfun.xyz</a>
        </div>
      </footer>
    </main>
  );
}
