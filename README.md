# DrainFun.xyz — Tinder for Memecoins

> Swipe-based Telegram Mini App for discovering and trading Solana memecoins on Bags.fm.
> Built for the Bags.fm Global Hackathon 2026.

## 🎰 What It Does

DrainFun.xyz makes memecoin trading addictive, informed, and fun:

- **Swipe right** → buy with real in-app wallet (Solana devnet)
- **Swipe left** → skip
- **Tap ℹ** → full token detail: DexScreener chart, BubbleMaps holders, Rugcheck analysis
- **🎰 x2 or Nothing** → spin the wheel on any buy (50/50 doubles or loses your SOL)
- **Confetti + APED IN** 🚀 on every buy

## 🏆 Token Feed — 3 Tiers

| Tier | Type | Source |
|------|------|--------|
| 🏆 Established | BONK, WIF, POPCAT, MEW | DexScreener + Rugcheck |
| 💰 Bags Top Earners | PEPE, NYAN, BTH, GAS, RALPH, MrBeast | Bags.fm SDK (real fee data) |
| ⚡ Degen Picks | Fresh launches with Jito bundle signals | GMGN scanner + Jito RPC |

## 🔗 Bags.fm Integration

- **$DRAIN token** live on Bags.fm: `CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS`
- **Bags SDK** (`@bagsfm/bags-sdk`) — trade quotes, creator verification, lifetime fee data
- **Fee share** — 0.75% on every swap routes through Bags fee system
- **Creator verification** — shows verified creator badges from Bags.fm profiles

## 💰 Casino Features

- Confetti explosion + "APED IN!" on buys
- Live PnL ticker in header
- Hype notifications ("This shit is pumping harder than your ex's situationship")
- x2 or Nothing spinning wheel — double your buy or lose it all
- Crying Pepe animations for rugged positions
- Flames 🔥 / Rockets 🚀 on positions based on PnL

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React — hosted on AWS EC2
- **Bot**: @DrainFunbot on Telegram (Mini App, fullscreen)
- **Wallets**: Deterministic Solana keypairs derived from Telegram user ID
- **Blockchain**: Solana devnet (hosted RPC node)
- **Swaps**: In-app wallet signs server-side — no Phantom needed
- **Data**: Bags.fm SDK, DexScreener, Rugcheck, BubbleMaps

## 🚀 Live Demo

- **Telegram**: [@DrainFunbot](https://t.me/DrainFunbot)
- **Web**: [drainfun.xyz/swipe](https://drainfun.xyz/swipe)
- **Token**: [bags.fm/token/CcRLnH...](https://bags.fm/token/CcRLnHszscGWG4pP3ZxFYQ6DQTAWcpewKwFgNdCLBAGS)

## Setup

```bash
npm install
npm run dev
```

## Environment

```env
BAGS_API_KEY=bags_prod_...
WALLET_SEED_SECRET=...
```

---

Built by Jiggy × Cadence 〰️ | DrainFun.xyz
