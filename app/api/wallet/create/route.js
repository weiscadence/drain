// Real Solana devnet wallet creation tied to Telegram ID
// Deterministic keypair — same TG ID always gets same wallet
// Secret seed stored server-side, never exposed to client

import crypto from 'crypto';

// This secret seeds the deterministic wallet derivation
// In production: load from env var WALLET_SEED_SECRET
const WALLET_SEED = process.env.WALLET_SEED_SECRET || 'drain_fun_v1_wallet_seed_2026_secure';

export async function POST(req) {
  try {
    const { telegramId, username } = await req.json();

    if (!telegramId) {
      return Response.json({ error: 'telegramId required' }, { status: 400 });
    }

    // Derive deterministic 32-byte seed from telegram ID + app secret
    // This means: same user always gets same wallet, no storage needed
    const seed = crypto
      .createHmac('sha256', WALLET_SEED)
      .update(String(telegramId))
      .digest();

    // Generate keypair from seed using dynamic import (browser-compatible)
    const { Keypair } = await import('@solana/web3.js');
    const keypair = Keypair.fromSeed(seed);
    const publicKey = keypair.publicKey.toBase58();

    // Fund the wallet with devnet SOL automatically
    let airdropSig = null;
    let balance = 0;

    try {
      // Try to get current balance first
      const balRes = await fetch('https://api.devnet.solana.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1,
          method: 'getBalance',
          params: [publicKey],
        }),
        signal: AbortSignal.timeout(5000),
      });
      const balData = await balRes.json();
      balance = (balData?.result?.value || 0) / 1e9;
    } catch {}

    // Airdrop 2 SOL if balance is low
    if (balance < 0.5) {
      const DEVNET_RPCS = [
        'http://localhost:8899', // local validator - unlimited, instant
        'https://api.devnet.solana.com',
      ];
      for (const rpc of DEVNET_RPCS) {
        try {
          const res = await fetch(rpc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0', id: 1,
              method: 'requestAirdrop',
              params: [publicKey, 2_000_000_000], // 2 SOL
            }),
            signal: AbortSignal.timeout(8000),
          });
          const data = await res.json();
          if (data.result) { airdropSig = data.result; break; }
        } catch { continue; }
      }
    }

    return Response.json({
      address: publicKey,
      network: 'devnet',
      balance,
      airdropSig,
      airdropSent: !!airdropSig,
      source: 'deterministic-tg',
      telegramId: String(telegramId),
      // NOTE: private key is NEVER returned to client
      // wallet is always re-derivable from telegramId + server secret
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
