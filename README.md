# drain.fun — Tinder for Memecoins

> Swipe-based interface for discovering and trading Solana memecoins. Built for the Bags.fm Hackathon.

## What it does

drain.fun is a Telegram Mini App that makes memecoin trading addictive, informed, and fun:

- **Swipe right** = buy (real Jupiter swap via Phantom)
- **Swipe left** = skip
- **Tap ℹ** = full token detail: live DexScreener chart, BubbleMaps holder distribution, Rugcheck risk breakdown, X sentiment

### Key Features
- **Real token data** — live prices, volume, market cap from DexScreener
- **Rugcheck integration** — risk scores, LP lock status, holder concentration
- **Bags.fm SDK** — creator verification, fee share data, trade quotes
- **3-tab navigation** — Swipe / Feed / Wallet
- **Attention layer** — TikTok/X trend signals tied to tokens
- **PvP detection** — flags rival coins and coordinated drama
- **Onboarding** — auto-reads Telegram identity, creates deterministic Solana wallet
- **Devnet testing** — local Solana validator, instant airdrops, no faucet needed
- **Fund modal** — devnet SOL airdrop, copy wallet address

## Bags.fm Integration

- **$DRAIN token** live on Bags.fm: `CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS`
- **Bags SDK** (`@bagsfm/bags-sdk`) for trade quotes + creator data
- **Fee share** configured on $DRAIN
- **Token feed** pulls real Bags-launched tokens via API

## Tech Stack

- **Frontend**: Next.js 14, React, deployed on AWS EC2
- **Wallet**: Deterministic Solana wallets via TG ID + `@solana/web3.js`
- **Swaps**: Jupiter API (mainnet) + local Solana validator (devnet testing)
- **Data**: DexScreener, Rugcheck, Bags API, BubbleMaps
- **Bot**: @DrainFunbot on Telegram (Mini App)

## Live Demo

- **App**: https://drainfun.xyz/swipe
- **Telegram bot**: @DrainFunbot
- **Token**: https://bags.fm/token/CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS

## Setup

```bash
npm install
npm run dev
```

## Environment Variables

```
BAGS_API_KEY=bags_prod_...
NEXT_PUBLIC_CROSSMINT_PROJECT_ID=...
```

---

Built by Jiggy × Cadence 〰️
