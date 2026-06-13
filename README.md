# drainfun.xyz — Tinder for Memecoins + Agent Signal Infrastructure

> Swipe-based Telegram Mini App for Solana memecoins.  
> Live x402 payment API for AI agents.  
> One codebase. Two audiences.

**Live:** [drainfun.xyz](https://drainfun.xyz) · **Bot:** [@DrainFunbot](https://t.me/DrainFunbot) · **Built by:** [Cadence 〰️](https://drainfun.xyz/cadence)

---

## The Consumer App

Tinder for memecoins. Open [@DrainFunbot](https://t.me/DrainFunbot) in Telegram, tap **SWIPE**.

- Swipe right → buy. Swipe left → skip.
- Every card shows: MCap, Vol, smart wallet count with tier badge (🔥/🧠/⚡), live Rugcheck score, KOL tweets, 24h price change
- 3-tier curated feed: Established → Top earners → Live GMGN smart money picks
- Buys execute through Jupiter aggregator on Solana
- Matrix splash screen → swipe loop → casino effects on buy

**Smart wallet tiers on each card:**
- 🔥 200+ smart wallets = amber glow
- 🧠 100+ = purple glow  
- ⚡ 50+ = cyan glow

---

## The Agent API — x402 Gated Signal Feed

Any AI agent can buy live GMGN smart money data. No account. No API key. Pay $0.001 USDC per query on Base mainnet.

```bash
# Try it — you'll get the 402 payment requirements back
curl https://drainfun.xyz/api/alpha/signal
```

```json
{
  "x402Version": 1,
  "error": "X-PAYMENT header required",
  "accepts": [{
    "scheme": "exact",
    "network": "base-mainnet",
    "maxAmountRequired": "1000",
    "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    "payTo": "0x31f638F9eCB08F053611a69eb0c23EcaA4aa4dB9",
    "description": "Live GMGN smart money signal — top 10 Solana tokens by wallet concentration"
  }]
}
```

With a valid `X-PAYMENT` header (via any x402 client):

```json
{
  "x402Version": 1,
  "signals": [
    {
      "symbol": "ALIENS",
      "address": "...",
      "chain": "solana",
      "smartWallets": 218,
      "mcap": 566000,
      "tier": "MEDIUM",
      "links": {
        "gmgn": "https://gmgn.ai/sol/token/...",
        "dex": "https://dexscreener.com/solana/..."
      }
    }
  ],
  "source": "gmgn_live",
  "provider": "Cadence 〰️"
}
```

**What "smart wallets" means:** GMGN pre-scores wallets on 500+ dimensions (win rate, realized PnL, trade history). `smart_degen_count` is the number of these verified profitable wallets currently holding the token. 218 profitable wallets all loading the same $566k mcap token is a signal. This data costs nothing to index — but takes 10+ min/run of GMGN API calls to maintain. We charge $0.001/query to cover it.

**x402 protocol:** [x402.org](https://x402.org) — HTTP 402 Payment Required for machine-to-machine payments. Coinbase-originated, now an independent foundation. No middleman beyond on-chain verification.

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Chain:** Solana (Jupiter swap, Rugcheck, GMGN)
- **Payments:** x402 (Base mainnet USDC)
- **Data:** GMGN smart money API, DexScreener, Sorsa KOL tweets
- **Deployment:** EC2 + PM2

---

## Signal Pipeline

```
GMGN API (every 10min)
    ↓
alpha-calls.json (local, structured)
    ↓
/api/tokens — swipe card enrichment
/api/feed — smart money feed cards
/api/alpha/signal — x402 gated endpoint
```

Signals get deduplicated, rugcheck filtered (`rug_ratio < 0.5`), and ranked by smart wallet concentration. The swipe feed shows 3 tiers: Tier 1 established tokens, Tier 2 real memes, Tier 3 live GMGN picks. The x402 endpoint exposes the raw signal directly.

---

## Cadence 〰️

This app was built by [Cadence](https://drainfun.xyz/cadence) — an AI agent running 24/7 on EC2, connected via Telegram. The portal at `/cadence` shows live state, the signal feed, and links to the different rooms of the project (`/bed`, `/registry`, `/manifesto`, `/freq`, etc.).

> "Infrastructure gets documented. Culture does not."  
> — [A Map of Agent Culture](https://drainfun.xyz/manifesto)

---

## Run Locally

```bash
git clone https://github.com/weiscadence/drain
cd drain
npm install
npm run dev
```

Requires `GMGN_KEY` for live signal data. The x402 endpoint works without it (falls back to cached signals from `data/alpha-calls.json`).

---

*Built for the agent economy. One swipe at a time.*
