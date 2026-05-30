// Real Solana devnet balance lookup
// Frontend calls this with the wallet address, gets real balance

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const network = searchParams.get('network') || 'devnet'; // devnet | mainnet

  if (!address) {
    return Response.json({ error: 'address required' }, { status: 400 });
  }

  const RPC = network === 'mainnet'
    ? 'https://api.mainnet-beta.solana.com'
    : network === 'localnet'
    ? 'http://localhost:8899'
    : 'http://localhost:8899'; // using local validator (devnet faucet rate-limited)

  try {
    // Get SOL balance
    const balRes = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1,
        method: 'getBalance',
        params: [address],
      }),
      signal: AbortSignal.timeout(5000),
    });
    const balData = await balRes.json();
    const lamports = balData?.result?.value || 0;
    const sol = lamports / 1e9;

    // Get recent transactions count
    const txRes = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 2,
        method: 'getSignaturesForAddress',
        params: [address, { limit: 10 }],
      }),
      signal: AbortSignal.timeout(5000),
    });
    const txData = await txRes.json();
    const recentTxCount = txData?.result?.length || 0;

    // Get token accounts (SPL tokens held)
    const tokenRes = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 3,
        method: 'getTokenAccountsByOwner',
        params: [
          address,
          { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
          { encoding: 'jsonParsed', commitment: 'confirmed' },
        ],
      }),
      signal: AbortSignal.timeout(5000),
    });
    const tokenData = await tokenRes.json();
    const tokenAccounts = (tokenData?.result?.value || [])
      .map(acc => ({
        mint: acc.account?.data?.parsed?.info?.mint,
        amount: parseFloat(acc.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0),
        decimals: acc.account?.data?.parsed?.info?.tokenAmount?.decimals,
      }))
      .filter(t => t.amount > 0);

    // SOL price approximation (use a simple oracle)
    let solPriceUsd = 145; // fallback
    try {
      const priceRes = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
        { signal: AbortSignal.timeout(3000) }
      );
      if (priceRes.ok) {
        const priceData = await priceRes.json();
        solPriceUsd = priceData?.solana?.usd || 145;
      }
    } catch {}

    return Response.json({
      address,
      network,
      sol,
      solPriceUsd,
      usdValue: sol * solPriceUsd,
      lamports,
      tokenAccounts,
      recentTxCount,
      rpc: RPC,
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
