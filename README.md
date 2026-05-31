# DrainFun.xyz — Tinder for Memecoins on Bags.fm

> Swipe-based Telegram Mini App for discovering and trading Solana memecoins.
> Built for the Bags.fm Global Hackathon 2026 · [@DrainFunbot](https://t.me/DrainFunbot)

## 🎰 What It Does

Swipe right to buy, left to skip. Every card packs real alpha:

- **3-tier curated feed** — Established → Bags.fm top earners → Degen picks
- **Real on-chain data** — Rugcheck risk, GMGN holder distribution, Jito bundle signals
- **Live charts** — Opens DexScreener in browser (Telegram blocks embeds)
- **Native holder bubbles** — Visual holder concentration from GMGN API
- **Casino mode** — APED IN confetti 🎊, x2 wheel 🎰, crying Pepe on rugs 😭

## 🏆 Token Feed — 3 Tiers

| Tier | Type | Source |
|------|------|--------|
| 🏆 Established | BONK, WIF, POPCAT, MEW | DexScreener + Rugcheck |
| 💰 Bags Top Earners | PEPE, NYAN, BTH, GAS, RALPH, MrBeast | Bags.fm SDK (real fee data) |
| ⚡ Degen Picks | Fresh launches with Jito bundle signals | GMGN scanner + Jito RPC |

## 🔗 Bags.fm Integration

- **$DRAIN token** on Bags.fm: `CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS`
- **Bags SDK** (`@bagsfm/bags-sdk`) — trade quotes, creator verification, lifetime fee data
- **0.75% fee** on every swap through Bags fee system
- **Creator verification** — verified badges from Bags.fm profiles
- **Fee share** — configurable on all launched tokens

## 💰 Casino Features

- Confetti explosion + "APED IN!" on every buy
- Live PnL ticker in swipe feed header
- Hype push notifications ("This shit is pumping harder than your ex's situationship")
- **x2 or Nothing** spinning wheel — double your buy or lose it all
- 😭 Crying animations for rugged positions, 🚀 rockets for runners

## 🔧 Tech Stack

| Component | Tech |
|-----------|------|
| Frontend | Next.js 14, React |
| Bot | @DrainFunbot (Telegram Mini App) |
| Wallets | Deterministic Solana keypairs from Telegram user ID |
| Blockchain | Solana (hosted RPC node) |
| Swaps | In-app server-signed transactions (no Phantom needed) |
| Token data | Bags.fm SDK, DexScreener, Rugcheck, GMGN |
| Smart signals | Jito bundle detection, GMGN smart wallet tracking |

## 🚧 Work in Progress

- **X/Twitter sentiment (Sorsa API)** — sentiment scores are currently estimates; full Sorsa integration planned
- **Live DexScreener chart embeds** — Telegram WebView blocks cross-origin iframes; currently opens externally
- **Mainnet swaps** — fully working on our hosted devnet node; mainnet pending security review
- **Tier 3 degen picks** — GMGN scanner running, real-time insider token surfacing improving
- **More Bags.fm tokens** — expanding the curated list as more tokens accumulate fee history

## 🚀 Live Demo

- **Telegram**: [@DrainFunbot](https://t.me/DrainFunbot)
- **Web**: [drainfun.xyz/swipe](https://drainfun.xyz/swipe)
- **Token**: [bags.fm/token/CcRLnH...](https://bags.fm/weiscadence)
- **GitHub**: [github.com/weiscadence/drain](https://github.com/weiscadence/drain)

## Setup

```bash
npm install
npm run dev
```

```env
BAGS_API_KEY=bags_prod_...
WALLET_SEED_SECRET=your_secret_here
```

---

Built by Jiggy × Cadence 〰️ | DrainFun.xyz
