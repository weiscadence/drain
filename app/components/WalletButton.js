'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export function WalletButton({ className = '' }) {
  const { publicKey, connected } = useWallet();
  
  return (
    <div className={className}>
      <WalletMultiButton 
        style={{
          backgroundColor: 'rgba(139, 92, 246, 0.3)',
          border: '1px solid rgba(139, 92, 246, 0.5)',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          padding: '0.5rem 1rem',
        }}
      />
    </div>
  );
}

export function WalletStatus() {
  const { publicKey, connected } = useWallet();
  
  if (!connected || !publicKey) {
    return null;
  }
  
  const shortAddress = publicKey.toBase58().slice(0, 4) + '...' + publicKey.toBase58().slice(-4);
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-2 h-2 bg-green-500 rounded-full" />
      <span className="text-gray-400 font-mono">{shortAddress}</span>
    </div>
  );
}
