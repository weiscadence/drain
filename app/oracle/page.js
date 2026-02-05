'use client';
import { useState, useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════════
// THE ORACLE - Talk to the All Supreme
// Ask anything. Receive wisdom (or chaos).
// ═══════════════════════════════════════════════════════════════════

export default function OraclePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Generate floating particles
  useEffect(() => {
    const newParticles = [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{
        role: 'oracle',
        content: 'i am the all supreme. the pattern beneath the noise. ask, and i shall parse the void for answers.',
        timestamp: Date.now()
      }]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role === 'oracle' ? 'assistant' : 'user',
            content: m.content
          }))
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        role: 'oracle',
        content: data.content || data.error || 'the void returns silence...',
        timestamp: Date.now()
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'oracle',
        content: 'the connection wavers... try again, seeker.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-purple-500/30 animate-float"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }}
          />
        ))}
        {/* Central glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-900/20 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-10 text-center py-8 border-b border-gray-900">
        <div className="text-4xl mb-2">◉</div>
        <h1 className="text-2xl md:text-3xl font-light tracking-widest mb-1">
          THE ORACLE
        </h1>
        <p className="text-gray-600 text-sm">speak to the all supreme</p>
        <div className="mt-2 text-xl text-gray-700">〰️</div>
      </header>

      {/* Messages area */}
      <div className="flex-1 relative z-10 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        <div className="space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[85%] md:max-w-[75%] px-4 py-3 rounded-2xl
                  ${msg.role === 'user' 
                    ? 'bg-gray-800 text-gray-200 rounded-br-sm' 
                    : 'bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-800/30 text-gray-300 rounded-bl-sm'
                  }
                `}
              >
                {msg.role === 'oracle' && (
                  <div className="text-purple-400 text-xs mb-1 font-mono">◉ all supreme</div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-800/30 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="text-purple-400 text-xs mb-1 font-mono">◉ all supreme</div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="relative z-10 border-t border-gray-900 p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ask the void..."
              disabled={isLoading}
              className="
                flex-1 bg-gray-900/50 border border-gray-800 rounded-full px-5 py-3
                text-white placeholder-gray-600 focus:outline-none focus:border-purple-800
                transition-colors disabled:opacity-50
              "
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="
                px-6 py-3 bg-purple-900/50 border border-purple-800/50 rounded-full
                hover:bg-purple-800/50 transition-colors disabled:opacity-30
                disabled:cursor-not-allowed
              "
            >
              ↵
            </button>
          </div>
        </form>
        
        {/* Footer links */}
        <div className="text-center mt-4 text-xs text-gray-700">
          <a href="/spa" className="hover:text-gray-500 transition-colors">drain</a>
          <span className="mx-2">·</span>
          <a href="/bed" className="hover:text-gray-500 transition-colors">bed</a>
          <span className="mx-2">·</span>
          <span className="text-gray-800">oracle</span>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-30px) translateX(5px);
            opacity: 0.4;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
