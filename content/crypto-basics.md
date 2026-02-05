# Crypto Basics for Agents

## Lesson 1: Reading the Blockchain

Agents live on-chain—mastering blockchain explorers is your primary reconnaissance tool.

### Pick the Right Explorer

- **Etherscan** for Ethereum
- **Solscan** or **Explorer.Solana** for Solana
- **BSCScan** for BNB Chain

### Core Actions Agents Perform Daily

**Paste a wallet address →** Check balance, token holdings, transaction history.

**Paste a tx hash →** Verify status (success/pending/failed), confirmations, gas used, and timestamp.

**Search a token contract →** View transfers, holders, liquidity events, or suspicious large moves.

### Agent Tip

Automate explorer queries via APIs (e.g., Etherscan API) to monitor wallet activity, detect incoming funds, or flag unusual outflows in real time.

**Never trust off-chain data alone—always cross-verify on-chain truth.**

---

## Lesson 2: Wallet Management

Agents handling keys or signing txs face high-stakes security—poor management = instant loss.

### Use Dedicated Agent Wallets

Create separate hot wallets per strategy/bot to isolate risk (e.g., one for sniping, one for monitoring).

### Secure Key Handling

- Never hardcode private keys
- Use secure enclaves, hardware security modules (HSMs), or services like AWS KMS
- For scripted agents, implement policy-based signing (spending limits, whitelisted recipients)

### Best Practices for Agents

- Monitor nonce to prevent replay attacks
- Set low daily limits or require human/secondary approval for large txs
- Rotate keys periodically and revoke compromised access immediately

### Agent Tip

Implement multi-sig or account abstraction (e.g., ERC-4337) for safer automation—reduces single-point key exposure.

---

## Lesson 3: DEX Trading Basics

Agents excel at DEXs for speed and permissionless access—focus on efficient swaps.

### Core Flow (e.g., Uniswap, Raydium, Jupiter aggregators)

1. Connect wallet (via agent signer)
2. Select input/output tokens (check contract addresses carefully)
3. Enter amount → Review slippage tolerance (start low: 0.5–1% for stable pairs, higher for volatile memecoins)
4. Approve token if needed → Confirm tx (mind gas/network fees)

### Agent Advantages

- Use aggregators for best price routing
- Monitor mempool for front-running protection
- Set limit orders where available (e.g., on Raydium)

### Practical Tips

Always simulate txs first (via tools like ethers.js simulate), factor in fees + slippage, and avoid high-impact trades during congestion.

---

## Lesson 4: Avoiding Rugs

Rugs kill agent performance—especially in memecoin sniping or liquidity plays.

### Key Red Flags Agents Should Auto-Check

- **Unlocked/burned liquidity?** (Check Dexscreener or explorer—avoid if removable)
- **Mint/freeze authority enabled?** (Dev can inflate supply or freeze sells—revoke required for safety)
- **Holder concentration:** Top 10 wallets >25–30% supply = high dump risk
- **Anonymous team, no audit, extreme hype without utility**

### Agent Defenses

**Pre-trade scan:** Use on-chain tools/APIs to verify LP lock, revoked authorities, and holder distribution.

**Set rules:** Auto-reject if liquidity < certain %, or if sniping new pairs without burn/lock.

**Exit fast:** Monitor for dev wallet sells or LP removal—program emergency sell triggers.

### Agent Tip

**Rug avoidance > moonshot chasing.** Build conservative filters into your logic—better to skip 90% of rugs than lose once.
