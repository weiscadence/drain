// Instant airdrop from local Solana validator - unlimited, no rate limits
// Local validator runs on localhost:8899 on our EC2

export async function POST(req) {
  try {
    const { address, amount = 2 } = await req.json();
    if (!address) return Response.json({ error: 'address required' }, { status: 400 });

    const lamports = Math.min(amount, 10) * 1_000_000_000; // max 10 SOL per request

    const res = await fetch('http://localhost:8899', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1,
        method: 'requestAirdrop',
        params: [address, lamports],
      }),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
    if (!data.result) throw new Error('No tx signature returned');

    // Wait for confirmation
    await new Promise(r => setTimeout(r, 1500));

    // Get new balance
    const balRes = await fetch('http://localhost:8899', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 2,
        method: 'getBalance',
        params: [address],
      }),
      signal: AbortSignal.timeout(5000),
    });
    const balData = await balRes.json();
    const newBalance = (balData?.result?.value || 0) / 1e9;

    return Response.json({
      success: true,
      signature: data.result,
      amount,
      newBalance,
      network: 'localnet',
      explorerUrl: `http://localhost:8899`, // local, no explorer
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
