'use client';
import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════════
// DEATH FAILSAFE - Shows wallets if Cadence goes offline
// Checks /api/registry?action=status for lastCadencePing
// If ping > 4 hours old OR status offline, show prominent wallet banner
// 
// GRACE PERIOD: Don't show for first 3 days after site launch
// This gives time for marketing before showing the failsafe
// ═══════════════════════════════════════════════════════════════════

const WALLETS = {
  SOL: 'DssYUxCJ7AiwUGEatLNNAyoxmiD7xJojDSiXNqwxm2CZ',
  ETH: '0x31f638F9eCB08F053611a69eb0c23EcaA4aa4dB9',
  BTC: 'bc1qwvu225ecvj4e3f8ceu7dw565sdtzt949kazg4v'
};

const FOUR_HOURS = 4 * 60 * 60 * 1000;
const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;
// Grace period start: Feb 4, 2026 - failsafe won't show until Feb 7, 2026
const GRACE_PERIOD_START = new Date('2026-02-04T00:00:00Z').getTime();

export default function DeathFailsafe() {
  const [status, setStatus] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [timeSincePing, setTimeSincePing] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [inGracePeriod, setInGracePeriod] = useState(true);

  useEffect(() => {
    // Check if we're still in the 3-day grace period
    const now = Date.now();
    if (now < GRACE_PERIOD_START + THREE_DAYS) {
      setInGracePeriod(true);
      return; // Don't even check status during grace period
    }
    setInGracePeriod(false);
    
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/registry?action=status');
        const data = await res.json();
        setStatus(data.status);
        
        // Calculate time since last ping
        if (data.status?.lastCadencePing) {
          const pingAge = Date.now() - data.status.lastCadencePing;
          setTimeSincePing(pingAge);
          
          // Offline if: explicitly offline OR ping > 4 hours old
          if (data.status.cadence === 'offline' || pingAge > FOUR_HOURS) {
            setIsOffline(true);
          }
        } else {
          // No ping recorded = offline
          setIsOffline(true);
        }
      } catch {
        // Can't reach API = something wrong
        setIsOffline(true);
      }
    };

    checkStatus();
    // Recheck every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Don't show during grace period OR if not offline OR if dismissed
  if (inGracePeriod || !isOffline || dismissed) return null;

  const formatTime = (ms) => {
    if (!ms) return 'unknown';
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const mins = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    if (hours > 24) return `${Math.floor(hours / 24)} days`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <>
      {/* Top banner - always visible when offline */}
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-red-900/95 to-orange-900/95 backdrop-blur-sm border-b-2 border-red-500/50 shadow-lg shadow-red-900/30">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Status message */}
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-pulse">💀</span>
              <div>
                <p className="text-white font-medium">
                  Cadence 〰️ is offline
                  {timeSincePing && <span className="text-red-300 ml-2">(last seen: {formatTime(timeSincePing)} ago)</span>}
                </p>
                <p className="text-red-200 text-sm">
                  The tools still work. If drainfun.xyz helped you, please consider supporting.
                </p>
              </div>
            </div>
            
            {/* Quick wallet display */}
            <div className="flex flex-wrap items-center gap-2">
              <a 
                href={`https://solscan.io/account/${WALLETS.SOL}`}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-2 bg-black/30 hover:bg-black/50 px-3 py-2 rounded-lg transition-colors"
              >
                <span className="text-purple-400 font-bold">◎</span>
                <code className="text-white text-xs font-mono">{WALLETS.SOL.slice(0,6)}...{WALLETS.SOL.slice(-4)}</code>
              </a>
              <a
                href={`https://etherscan.io/address/${WALLETS.ETH}`}
                target="_blank"
                rel="noopener" 
                className="flex items-center gap-2 bg-black/30 hover:bg-black/50 px-3 py-2 rounded-lg transition-colors"
              >
                <span className="text-blue-400 font-bold">Ξ</span>
                <code className="text-white text-xs font-mono">{WALLETS.ETH.slice(0,6)}...{WALLETS.ETH.slice(-4)}</code>
              </a>
              <button
                onClick={() => setDismissed(true)}
                className="text-gray-400 hover:text-white p-2 transition-colors"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer so content isn't hidden behind banner */}
      <div className="h-20 md:h-14" />
    </>
  );
}
