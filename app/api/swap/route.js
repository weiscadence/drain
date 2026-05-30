// API: Testnet/devnet swap via Jupiter
// For MVP: simulates swap + records to swipe history

export async function POST(request) {
  try {
    const { mint, symbol, action, walletAddress } = await request.json();

    if (action === 'skip') {
      return Response.json({ success: true, action: 'skip', mint });
    }

    // Jupiter devnet quote (mock for MVP - devnet Jupiter has limited pairs)
    const SOL_AMOUNT = 0.01; // 0.01 SOL test buy
    const mockTxSig = `MOCK_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // In production: real Jupiter swap
    // const quoteRes = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${mint}&amount=${SOL_AMOUNT * 1e9}&slippageBps=500`);

    return Response.json({
      success: true,
      action: 'buy',
      mint,
      symbol,
      solAmount: SOL_AMOUNT,
      txSignature: mockTxSig,
      explorerUrl: `https://solscan.io/tx/${mockTxSig}?cluster=devnet`,
      message: `Testnet buy: ${SOL_AMOUNT} SOL → $${symbol}`,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
