// Fund API — generates on-ramp URL for funding a Solana wallet
// Uses Transak (free embed, no backend needed for basic flow)
// Crossmint sk_ key used for custodial wallet creation + order tracking

const CROSSMINT_KEY = process.env.CROSSMINT_API_KEY || 'sk_production_6BHnWmBaWvGL9aPMVwtDN3QwGX5pH9bqF6YrT1F5h6UYZ46AuJf8XJReJyZ3fbNxc16G1EBMnSksmJ7ebjCWptP1JUG6TM3n3QQabLSNDCexDAtiaryGGgruVp85hrTmdafgPxrnvUUJvZLVojmECZQK4RbbCA9CptDDtuQQ6f6BavgH4bxt7LXWtJBooqXBLDEQBxKVys6JNVBc196eqpWm';

// Transak production config (no key needed for basic iframe embed, key for whitelabel)
const TRANSAK_API_KEY = process.env.TRANSAK_API_KEY || ''; // free tier doesn't need key
const TRANSAK_ENV = 'PRODUCTION'; // or STAGING for tests

export async function POST(req) {
  try {
    const { amount, walletAddress, email } = await req.json();

    const addr = walletAddress || 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ';

    // Build Transak URL — works without API key, credit card + Apple Pay + Google Pay + bank
    const transakParams = new URLSearchParams({
      apiKey: TRANSAK_API_KEY || 'anon',
      environment: TRANSAK_ENV,
      cryptoCurrencyCode: 'SOL',
      network: 'solana',
      walletAddress: addr,
      fiatCurrency: 'USD',
      fiatAmount: amount || 25,
      disableWalletAddressForm: 'true',
      isFeeCalculationHidden: 'false',
      hideMenu: 'true',
      themeColor: 'a855f7',
      backgroundColor: '0c0c18',
      colorMode: 'DARK',
      ...(email && { email }),
    });

    const transakUrl = `https://global.transak.com/?${transakParams}`;

    // Also try to create/get a Crossmint managed wallet for this user
    // So they can use the same wallet across sessions
    let crossmintWallet = null;
    if (email) {
      try {
        const walletRes = await fetch('https://www.crossmint.com/api/2022-06-09/wallets', {
          method: 'POST',
          headers: {
            'X-API-KEY': CROSSMINT_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'solana-mpc-wallet',
            linkedUser: `email:${email}:solana-mpc-wallet`,
          }),
          signal: AbortSignal.timeout(5000),
        });
        if (walletRes.ok) crossmintWallet = await walletRes.json();
      } catch {}
    }

    return Response.json({
      transakUrl,
      walletAddress: crossmintWallet?.publicKey || addr,
      provider: 'transak',
      crossmintWallet: crossmintWallet || null,
    });

  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// GET — returns a quick Transak embed URL for a given wallet
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const amount = searchParams.get('amount') || '25';
  const wallet = searchParams.get('wallet') || 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ';

  const params = new URLSearchParams({
    apiKey: TRANSAK_API_KEY || 'anon',
    environment: TRANSAK_ENV,
    cryptoCurrencyCode: 'SOL',
    network: 'solana',
    walletAddress: wallet,
    fiatCurrency: 'USD',
    fiatAmount: amount,
    disableWalletAddressForm: 'true',
    hideMenu: 'true',
    themeColor: 'a855f7',
    backgroundColor: '0c0c18',
    colorMode: 'DARK',
  });

  return Response.json({ url: `https://global.transak.com/?${params}` });
}
