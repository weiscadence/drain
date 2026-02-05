'use client';

import dynamic from 'next/dynamic';

// Dynamically import providers to avoid SSR issues
const SolanaProviders = dynamic(
  () => import('./providers').then((mod) => mod.SolanaProviders),
  { ssr: false }
);

export function WalletWrapper({ children }) {
  return <SolanaProviders>{children}</SolanaProviders>;
}
