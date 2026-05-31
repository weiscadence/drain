// Server-side swap — derives user's keypair from TG ID, executes REAL SOL transfer on localnet
// This burns actual SOL from the user's wallet (0.1 SOL → sent to drain fee wallet)
// Balance WILL decrease. This is a real on-chain transaction.

import crypto from 'crypto';

const WALLET_SEED = process.env.WALLET_SEED_SECRET || 'drain_fun_v1_wallet_seed_2026_secure';
const LOCAL_RPC = 'https://api.devnet.solana.com';
// Fee collector wallet (the app's treasury on localnet)
const FEE_WALLET = 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ';
const FEE_RATE = 0.0075; // 0.75%

export async function POST(req) {
  try {
    const { telegramId, tokenMint, tokenSymbol, solAmount = 0.1, action = 'buy', x2 = false } = await req.json();

    if (!telegramId) return Response.json({ error: 'telegramId required' }, { status: 400 });

    const { Keypair, Connection, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } = await import('@solana/web3.js');

    // Derive keypair from TG ID
    const seed = crypto.createHmac('sha256', WALLET_SEED).update(String(telegramId)).digest();
    const keypair = Keypair.fromSeed(seed);
    const walletPubkey = keypair.publicKey;
    const feeWallet = new PublicKey(FEE_WALLET);

    const connection = new Connection(LOCAL_RPC, 'confirmed');

    // Check balance
    const balance = (await connection.getBalance(walletPubkey)) / LAMPORTS_PER_SOL;

    // Auto-airdrop if wallet is empty
    if (balance < 0.01) {
      try {
        const sig = await connection.requestAirdrop(walletPubkey, 5 * LAMPORTS_PER_SOL);
        await connection.confirmTransaction(sig, 'confirmed');
      } catch {}
    }

    const actualSolAmount = x2 ? solAmount * 2 : solAmount;
    const lamportsToSpend = Math.floor(actualSolAmount * LAMPORTS_PER_SOL);
    const feeLamports = Math.floor(lamportsToSpend * FEE_RATE);
    const tradeLamports = lamportsToSpend - feeLamports;

    // Check sufficient balance
    const freshBalance = (await connection.getBalance(walletPubkey)) / LAMPORTS_PER_SOL;
    if (freshBalance < actualSolAmount + 0.001) {
      return Response.json({ 
        error: `Insufficient balance. Have ${freshBalance.toFixed(3)} SOL, need ${actualSolAmount + 0.001} SOL. Go to Wallet → Add Funds → Get Devnet SOL first.` 
      }, { status: 400 });
    }

    // Build real transaction: transfer SOL to fee wallet (simulates swap cost)
    const { blockhash } = await connection.getLatestBlockhash();
    const tx = new Transaction({ recentBlockhash: blockhash, feePayer: walletPubkey });

    // Main trade amount goes to fee wallet (simulates buying token)
    tx.add(SystemProgram.transfer({
      fromPubkey: walletPubkey,
      toPubkey: feeWallet,
      lamports: tradeLamports,
    }));

    // Sign and send
    tx.sign(keypair);
    const sig = await connection.sendRawTransaction(tx.serialize(), { skipPreflight: false });
    await connection.confirmTransaction(sig, 'confirmed');

    // Get new balance after deduction
    const newBalance = (await connection.getBalance(walletPubkey)) / LAMPORTS_PER_SOL;

    // Simulate token amount received (mock — localnet has no SPL tokens)
    const baseOutAmount = Math.floor(actualSolAmount * 1000000 * (0.9 + Math.random() * 0.2));

    return Response.json({
      success: true,
      signature: sig,
      action,
      tokenMint,
      tokenSymbol,
      solAmount: actualSolAmount,
      outAmount: baseOutAmount,
      feeLamports,
      walletAddress: walletPubkey.toBase58(),
      prevBalance: freshBalance,
      newBalance,
      balanceChange: -(freshBalance - newBalance),
      network: 'localnet',
      x2Applied: x2,
      timestamp: Date.now(),
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
