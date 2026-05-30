/**
 * Execute API — One-click trade execution
 * =========================================
 * Receives a signal ID + action from the mini app.
 * Routes to the right execution path:
 *   - METEORA_LP  → Jupiter swap + Meteora DLMM add liquidity
 *   - SWAP        → Jupiter swap (token buy)
 *   - POLYMARKET  → Polymarket CLOB buy YES/NO
 *   - BRIDGE      → deBridge TON→SOL USDC
 *
 * Uses Solana Agent Kit for Solana actions.
 * User signs the transaction in their Tonkeeper/Phantom wallet.
 * We build unsigned txs, return them for client-side signing.
 */

import { NextResponse } from 'next/server';

// Cadence's agent wallet for building transactions
// User signs with their own wallet — we just construct the tx
const HELIUS = '8017898c-93be-4429-a21e-9b118f410bd3';

function err(msg, code = 400) {
  return NextResponse.json({ success: false, error: msg }, { status: code });
}

// ── Jupiter quote → unsigned transaction ─────────────────────────
async function getJupiterSwapTx(inputMint, outputMint, amountLamports, userWallet) {
  // Get quote
  const quoteRes = await fetch(
    `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountLamports}&slippageBps=100`
  );
  if (!quoteRes.ok) return null;
  const quote = await quoteRes.json();

  // Get unsigned transaction
  const swapRes = await fetch('https://quote-api.jup.ag/v6/swap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quoteResponse: quote,
      userPublicKey: userWallet,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 'auto',
    }),
  });
  if (!swapRes.ok) return null;
  const swapData = await swapRes.json();
  return {
    serializedTx: swapData.swapTransaction, // base64 unsigned tx
    quote,
  };
}

// ── Meteora DLMM position ─────────────────────────────────────────
async function getMeteoraDLMMTx(poolAddress, amountSol, userWallet) {
  // Meteora DLMM SDK call — returns unsigned transaction
  // In production this uses @meteora-ag/dlmm-sdk
  // For now returns a quote with instructions for the client
  const solLamports = Math.floor(amountSol * 1e9);

  // Get pool info from our DexScreener data
  const poolRes = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${poolAddress}`);
  const poolData = await poolRes.json();
  const pair = poolData?.pairs?.[0];

  if (!pair) return null;

  const price = parseFloat(pair.priceUsd || 0);
  const tokenMint = pair.baseToken?.address;

  return {
    type: 'meteora_dlmm',
    poolAddress,
    tokenMint,
    amountSol,
    currentPrice: price,
    // Range: ±5% around current price
    rangeLow:  price * 0.95,
    rangeHigh: price * 1.05,
    instruction: `Add ${amountSol} SOL liquidity to ${pair.baseToken?.symbol} pool`,
    // Client-side: use @meteora-ag/dlmm-sdk with these params
    sdkParams: {
      pool: poolAddress,
      tokenX: 'So11111111111111111111111111111111111111112',
      tokenY: tokenMint,
      amountX: solLamports,
      amountY: 0, // single-sided SOL entry
      binRange: 10, // 10 bins ≈ 5% range each side
    },
    deeplink: `https://app.meteora.ag/dlmm/${poolAddress}`,
  };
}

// ── Polymarket buy ────────────────────────────────────────────────
async function getPolymarketTx(conditionId, side, amountUSDC, userWallet) {
  // Polymarket is on Polygon — if user has TON, they need USDC on Polygon
  // For now: return deep link to polymarket
  const side_id = side === 'YES' ? 0 : 1;
  return {
    type: 'polymarket',
    conditionId,
    side,
    amountUSDC,
    deeplink: `https://polymarket.com/event/${conditionId}`,
    instruction: `Buy ${side} with $${amountUSDC} USDC on Polymarket`,
    note: 'Opens Polymarket directly. USDC on Polygon required.',
  };
}

// ── deBridge: TON → SOL USDC quote ───────────────────────────────
async function getBridgeQuote(fromAmount, fromChain, toChain) {
  // deBridge DLN API
  const TON_CHAIN_ID = 7565164; // TON chain ID on deBridge
  const SOL_CHAIN_ID = 7565164; // Solana
  // USDT on TON: EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs
  // USDC on Solana: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

  try {
    const res = await fetch(
      `https://dln.debridge.finance/v1.0/chain/transaction?srcChainId=${TON_CHAIN_ID}&srcChainTokenIn=EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs&srcChainTokenInAmount=${fromAmount}&dstChainId=${SOL_CHAIN_ID}&dstChainTokenOut=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&dstChainTokenOutRecipient=&slippage=0.5`,
      { headers: { 'accept': 'application/json' } }
    );
    if (res.ok) return await res.json();
  } catch {}

  // Fallback: Mayan Finance (fastest TON→SOL)
  return {
    type: 'bridge',
    from: 'TON',
    to: 'SOL USDC',
    amount: fromAmount,
    estimatedTime: '~30 seconds',
    estimatedFee: '~$0.50',
    deeplink: `https://swap.mayan.finance/?sourceChain=ton&destinationChain=solana&targetToken=USDC`,
    note: 'Mayan Finance: ~30sec bridge, TON → SOL USDC',
  };
}

// ── Main handler ──────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { action, signal, userWallet, amount } = body;

    if (!action) return err('action required');

    // ── BRIDGE: TON → SOL USDC ────────────────────────────────
    if (action === 'bridge') {
      const { amountTON } = body;
      if (!amountTON) return err('amountTON required');

      const quote = await getBridgeQuote(amountTON * 1e9, 'ton', 'solana');
      return NextResponse.json({ success: true, type: 'bridge', ...quote });
    }

    // ── SWAP: Buy token on Solana via Jupiter ─────────────────
    if (action === 'swap') {
      const { inputMint, outputMint, amountSol } = body;
      if (!inputMint || !outputMint || !userWallet) return err('inputMint, outputMint, userWallet required');

      const lamports = Math.floor((amountSol || 0.1) * 1e9);
      const result = await getJupiterSwapTx(inputMint, outputMint, lamports, userWallet);
      if (!result) return err('Jupiter quote failed');

      return NextResponse.json({
        success: true,
        type: 'swap',
        ...result,
        instruction: `Buy ${body.symbol || outputMint.slice(0,8)} with ${amountSol} SOL`,
        deeplink: `https://jup.ag/swap/SOL-${outputMint}`,
      });
    }

    // ── METEORA LP: Add liquidity ─────────────────────────────
    if (action === 'meteora_lp') {
      const { poolAddress, amountSol: lpAmount } = body;
      if (!poolAddress || !userWallet) return err('poolAddress, userWallet required');

      const result = await getMeteoraDLMMTx(poolAddress, lpAmount || 0.1, userWallet);
      if (!result) return err('Pool not found');

      return NextResponse.json({ success: true, ...result });
    }

    // ── POLYMARKET: Buy prediction ────────────────────────────
    if (action === 'polymarket') {
      const { conditionId, side, amountUSDC: pm_amount } = body;
      if (!conditionId || !side) return err('conditionId, side required');

      const result = await getPolymarketTx(conditionId, side, pm_amount || 10, userWallet);
      return NextResponse.json({ success: true, ...result });
    }

    // ── SIGNAL EXECUTE: Route based on signal type ────────────
    if (action === 'execute_signal') {
      const { callId } = body;
      if (!callId) return err('callId required');

      const fs = require('fs');
      const calls = JSON.parse(fs.readFileSync('/home/ubuntu/.openclaw/workspace/data/alpha-calls.json', 'utf8'));
      const call = calls.find(c => c.id === callId);
      if (!call) return err('Call not found');

      // Route to correct action based on source
      if (call.source === 'wallet_coord' || call.source === 'kol_ca' || call.source === 'kol_mention') {
        // Token buy on Solana
        const tokenMint = call.extra?.token || call.extra?.ca;
        if (!tokenMint || !userWallet) return err('Solana wallet required for token buy');

        const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        const SOL  = 'So11111111111111111111111111111111111111112';
        const lamports = Math.floor((amount || 0.1) * 1e9);
        const result = await getJupiterSwapTx(SOL, tokenMint, lamports, userWallet);

        return NextResponse.json({
          success: true, type: 'swap', call,
          serializedTx: result?.serializedTx,
          quote: result?.quote,
          instruction: `Buy ${call.asset} — ${call.confidence} signal from ${call.source}`,
          deeplink: call.extra?.dex || `https://jup.ag/swap/SOL-${tokenMint}`,
          size: call.edge?.match(/\$[\d-]+/)?.[0] || '$10-25',
        });
      }

      if (call.source?.includes('meteora')) {
        const poolAddr = call.extra?.poolAddress || call.extra?.pairAddr;
        if (!poolAddr) {
          return NextResponse.json({
            success: true, type: 'meteora_lp', call,
            deeplink: 'https://app.meteora.ag/dlmm',
            instruction: `Add LP to ${call.asset} pool`,
          });
        }
        const result = await getMeteoraDLMMTx(poolAddr, amount || 0.1, userWallet);
        return NextResponse.json({ success: true, call, ...result });
      }

      if (call.source === 'poly_diverge' || call.source === 'vol_spike') {
        return NextResponse.json({
          success: true, type: 'polymarket', call,
          deeplink: call.extra?.url || `https://polymarket.com`,
          instruction: `${call.direction} on prediction market`,
        });
      }

      // Fallback: return signal info with deep link
      return NextResponse.json({
        success: true, type: 'info', call,
        deeplink: call.extra?.dex || call.extra?.url || 'https://dexscreener.com',
        instruction: `Execute: ${call.direction} ${call.asset}`,
      });
    }

    return err('Unknown action');
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    actions: ['bridge', 'swap', 'meteora_lp', 'polymarket', 'execute_signal'],
    note: 'POST with action + params',
  });
}
