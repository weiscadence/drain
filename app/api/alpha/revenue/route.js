import fs from 'fs';

const REVENUE_FILE = '/home/ubuntu/.openclaw/workspace/data/x402-revenue.json';

export async function GET() {
  try {
    const r = JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8'));
    return Response.json({ ...r, pricePerQuery: 0.001, currency: 'USDC', chain: 'Base mainnet', wallet: '0x31f6...dB9' });
  } catch {
    return Response.json({ queries: 0, totalUsdcEarned: '0.000000', pricePerQuery: 0.001 });
  }
}
