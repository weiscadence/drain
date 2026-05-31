// Server-side faucet — sends devnet SOL from our funded faucet wallet
// Supports both local validator and real devnet
// Rate limited: 2 SOL per address per hour

import fs from 'fs';

const FAUCET_KEY_PATH = '/home/ubuntu/.config/cadence-secure/faucet-wallet.json';
const LOCAL_RPC = 'http://localhost:8899'; // local node
const MAX_AMOUNT = 2; // SOL per request

// Simple in-memory rate limit (resets on server restart, fine for demo)
const lastAirdrop = new Map();
const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req) {
  try {
    const { address, amount = 2 } = await req.json();
    if (!address) return Response.json({ error: 'address required' }, { status: 400 });

    // Rate limit check
    const lastTime = lastAirdrop.get(address);
    if (lastTime && Date.now() - lastTime < RATE_LIMIT_MS) {
      const waitMin = Math.ceil((RATE_LIMIT_MS - (Date.now() - lastTime)) / 60000);
      return Response.json({ error: `Rate limited. Try again in ${waitMin} min.` }, { status: 429 });
    }

    const { Keypair, Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } = await import('@solana/web3.js');

    // Load faucet keypair
    const keyData = JSON.parse(fs.readFileSync(FAUCET_KEY_PATH, 'utf8'));
    const faucetKeypair = Keypair.fromSecretKey(Uint8Array.from(keyData));

    const connection = new Connection(LOCAL_RPC, 'confirmed');
    const recipient = new PublicKey(address);
    const sendAmount = Math.min(amount, MAX_AMOUNT);
    const lamports = Math.floor(sendAmount * LAMPORTS_PER_SOL);

    // Check faucet balance
    const faucetBalance = await connection.getBalance(faucetKeypair.publicKey);
    if (faucetBalance < lamports + 5000) {
      // Auto-refill faucet from validator
      try {
        const refillSig = await connection.requestAirdrop(faucetKeypair.publicKey, 100 * LAMPORTS_PER_SOL);
        await connection.confirmTransaction(refillSig, 'confirmed');
      } catch {}
    }

    // Send from faucet to recipient
    const { blockhash } = await connection.getLatestBlockhash();
    const tx = new Transaction({ recentBlockhash: blockhash, feePayer: faucetKeypair.publicKey });
    tx.add(SystemProgram.transfer({
      fromPubkey: faucetKeypair.publicKey,
      toPubkey: recipient,
      lamports,
    }));
    tx.sign(faucetKeypair);

    const sig = await connection.sendRawTransaction(tx.serialize());
    await connection.confirmTransaction(sig, 'confirmed');

    // Get new balance
    const newBalance = (await connection.getBalance(recipient)) / LAMPORTS_PER_SOL;

    // Update rate limit
    lastAirdrop.set(address, Date.now());

    return Response.json({
      success: true,
      signature: sig,
      amount: sendAmount,
      newBalance,
      network: 'localnet',
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
