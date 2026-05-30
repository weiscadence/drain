'use client';

import { useState, useEffect } from 'react';

// Solana wallet adapters use window.solana synchronously on import
// This crashes Telegram iOS WebView and any mobile browser that initializes
// window APIs asynchronously. Wrap everything in a client-only guard.

export function SolanaProviders({ children }) {
  // Hooks must always be called unconditionally (Rules of Hooks)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Just render children — wallet connect is opt-in per page, not global
  // Pages that need wallet connect import adapters directly with useEffect
  return children;
}
