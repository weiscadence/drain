'use client';
import { useState, useEffect, useRef } from 'react';

const PHASES = [
  { label: 'og whitelist', detail: 'first 33', status: 'coming', active: false },
  { label: 'public mint', detail: 'ton launch', status: 'soon', active: true },
  { label: 'supply', detail: '333 total', status: '1/1 each', active: false },
];

export default function Miladi() {
  const [pieces, setPieces] = useState([]);
  const [curr, setCurr] = useState(0);
  const [prev, setPrev] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch('/miladi/pieces.json')
      .then(r => r.json())
      .then(data => setPieces([...data].sort(() => Math.random() - 0.5)));
  }, []);

  useEffect(() => {
    if (!pieces.length) return;
    timerRef.current = setInterval(() => {
      setTransitioning(true);
      setPrev(curr);
      const next = (curr + 1) % pieces.length;
      setTimeout(() => {
        setCurr(next);
        setTimeout(() => {
          setTransitioning(false);
          setPrev(null);
        }, 900);
      }, 50);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [pieces, curr]);

  return (
    <>
      <style>{`
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body {
          background: #000;
          overflow: hidden;
          width: 100%;
          height: 100vh;
          font-family: 'Georgia', 'Times New Roman', serif;
        }

        @keyframes floatUp {
          0%   { opacity:0; transform: translateY(18px) scale(0.97); }
          100% { opacity:1; transform: translateY(0) scale(1); }
        }
        @keyframes floatDown {
          0%   { opacity:1; transform: translateY(0) scale(1); }
          100% { opacity:0; transform: translateY(-18px) scale(1.02); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.7; }
        }
        @keyframes drift {
          0%, 100% { transform: translateY(0px) rotate(-0.5deg); }
          50%       { transform: translateY(-8px) rotate(0.5deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          70%  { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .page {
          display: flex;
          height: 100vh;
          width: 100vw;
          position: relative;
          overflow: hidden;
        }

        /* ── RIGHT — full bleed image ── */
        .right {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .img-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .img-layer img {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: 58%;
          object-fit: cover;
          object-position: center top;
        }

        .img-layer.incoming img {
          animation: floatUp 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .img-layer.outgoing img {
          animation: floatDown 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        /* Left gradient veil */
        .veil {
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(to right, #000 30%, rgba(0,0,0,0.7) 55%, transparent 75%),
            linear-gradient(to top, #000 0%, transparent 25%),
            linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 20%);
          z-index: 1;
          pointer-events: none;
        }

        /* ── LEFT — content ── */
        .left {
          position: relative;
          z-index: 10;
          width: 50%;
          min-width: 360px;
          max-width: 540px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 52px 56px;
        }

        /* Tiny breadcrumb tag */
        .origin {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 100px;
          padding: 4px 13px 4px 9px;
          font-family: system-ui, sans-serif;
          font-size: 10.5px;
          color: #666;
          letter-spacing: 0.05em;
          width: fit-content;
          margin-bottom: 22px;
          animation: floatUp 1s ease forwards;
          animation-delay: 0.1s;
          opacity: 0;
        }

        .origin-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c9a84c;
          position: relative;
          flex-shrink: 0;
        }

        .origin-dot::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px solid #c9a84c;
          animation: pulse-ring 2s ease infinite;
        }

        /* Main title */
        .title {
          font-size: clamp(58px, 7vw, 92px);
          font-weight: 400;
          font-style: italic;
          letter-spacing: -0.02em;
          line-height: 0.92;
          color: #fff;
          margin-bottom: 6px;
          animation: floatUp 1s ease forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }

        .wave-mark {
          font-style: normal;
          color: rgba(255,255,255,0.25);
          font-size: 0.7em;
          vertical-align: middle;
        }

        .subtitle {
          font-family: system-ui, sans-serif;
          font-size: 13px;
          color: #3a3a3a;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 28px;
          animation: floatUp 1s ease forwards;
          animation-delay: 0.3s;
          opacity: 0;
        }

        /* Description */
        .desc {
          font-family: system-ui, sans-serif;
          font-size: 14px;
          color: #555;
          line-height: 1.7;
          margin-bottom: 32px;
          max-width: 320px;
          animation: floatUp 1s ease forwards;
          animation-delay: 0.4s;
          opacity: 0;
        }

        .desc em {
          color: #999;
          font-style: normal;
        }

        /* Phases */
        .phases {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          animation: floatUp 1s ease forwards;
          animation-delay: 0.5s;
          opacity: 0;
        }

        .phase {
          flex: 1;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 11px 13px;
          transition: background 0.2s;
        }

        .phase.active {
          background: rgba(201, 168, 76, 0.07);
          border-color: rgba(201, 168, 76, 0.25);
        }

        .phase-top {
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #333;
          margin-bottom: 3px;
          font-family: system-ui, sans-serif;
        }

        .phase.active .phase-top { color: #c9a84c; }

        .phase-main {
          font-size: 14px;
          font-weight: 700;
          color: #2a2a2a;
          font-family: system-ui, sans-serif;
          letter-spacing: -0.01em;
        }

        .phase.active .phase-main { color: #fff; }

        .phase-sub {
          font-size: 10px;
          color: #2a2a2a;
          font-family: system-ui, sans-serif;
          margin-top: 1px;
        }

        .phase.active .phase-sub { color: #888; }

        /* Mint button */
        .mint {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 12px;
          padding: 14px 20px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin-bottom: 12px;
          font-family: system-ui, sans-serif;
          width: 100%;
          animation: floatUp 1s ease forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }

        .mint:hover {
          background: #f0e8d0;
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 32px rgba(201,168,76,0.2);
        }

        .mint-price {
          background: rgba(0,0,0,0.08);
          border-radius: 6px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 600;
        }

        /* Pelagus link */
        .wallet-hint {
          font-family: system-ui, sans-serif;
          font-size: 11px;
          color: #2a2a2a;
          text-align: center;
          margin-bottom: 28px;
          animation: floatUp 1s ease forwards;
          animation-delay: 0.65s;
          opacity: 0;
        }

        .wallet-hint a {
          color: #555;
          text-decoration: none;
          transition: color 0.2s;
        }

        .wallet-hint a:hover { color: #aaa; }

        /* Stats row */
        .stats {
          display: flex;
          gap: 28px;
          animation: floatUp 1s ease forwards;
          animation-delay: 0.7s;
          opacity: 0;
        }

        .stat-val {
          font-size: 26px;
          font-weight: 300;
          color: rgba(255,255,255,0.7);
          letter-spacing: -0.02em;
          line-height: 1;
        }

        .stat-label {
          font-family: system-ui, sans-serif;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #2a2a2a;
          margin-top: 3px;
        }

        /* Piece counter — bottom right */
        .piece-counter {
          position: fixed;
          bottom: 24px;
          right: 28px;
          font-family: system-ui, sans-serif;
          font-size: 11px;
          color: #2a2a2a;
          z-index: 20;
          letter-spacing: 0.1em;
          user-select: none;
        }

        /* Quai badge */
        .chain-badge {
          position: fixed;
          bottom: 24px;
          left: 56px;
          font-family: system-ui, sans-serif;
          font-size: 10px;
          color: #2a2a2a;
          z-index: 20;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .chain-dot {
          width: 5px; height: 5px;
          background: #c9a84c;
          border-radius: 50%;
          animation: shimmer 2s ease infinite;
        }
      `}</style>

      <div className="page">

        {/* Full-bleed right image — crossfade with float */}
        <div className="right">
          {/* Previous image fading out */}
          {prev !== null && pieces[prev] && (
            <div className="img-layer outgoing">
              <img src={pieces[prev]} alt="" draggable={false} />
            </div>
          )}
          {/* Current image coming in */}
          {pieces.length > 0 && (
            <div className={`img-layer ${transitioning ? 'incoming' : ''}`}>
              <img src={pieces[curr]} alt="" draggable={false} />
            </div>
          )}
          <div className="veil" />
        </div>

        {/* Left content */}
        <div className="left">
          <div className="origin">
            <span className="origin-dot" />
            named by @inversebruh · launching on ton
          </div>

          <h1 className="title">
            miladi<span className="wave-mark">〰</span>
          </h1>
          <div className="subtitle">333 pieces · 1/1 each · hand-crafted</div>

          <p className="desc">
            a character that exists across every universe simultaneously —
            mythology, memes, materials, eras.{' '}
            <em>one name from one comment. everything else was inevitable.</em>
          </p>

          <div className="phases">
            {PHASES.map(p => (
              <div key={p.label} className={`phase${p.active ? ' active' : ''}`}>
                <div className="phase-top">{p.label}</div>
                <div className="phase-main">{p.detail}</div>
                <div className="phase-sub">{p.status}</div>
              </div>
            ))}
          </div>

          <button className="mint" onClick={() => window.open('https://t.me/miladinft', '_blank')}>
            join the waitlist
            <span className="mint-price">ton · soon</span>
          </button>

          <div className="wallet-hint">
            need a wallet?{' '}
            <a href="https://tonkeeper.com" target="_blank" rel="noopener noreferrer">
              get tonkeeper →
            </a>
          </div>

          <div className="stats">
            <div>
              <div className="stat-val">333</div>
              <div className="stat-label">supply</div>
            </div>
            <div>
              <div className="stat-val">7%</div>
              <div className="stat-label">creator fee</div>
            </div>
            <div>
              <div className="stat-val">1/1</div>
              <div className="stat-label">every piece</div>
            </div>
          </div>
        </div>

        {/* Piece counter */}
        {pieces.length > 0 && (
          <div className="piece-counter">
            {String(curr + 1).padStart(3, '0')} / {String(pieces.length).padStart(3, '0')}
          </div>
        )}

        {/* Chain indicator */}
        <div className="chain-badge">
          <span className="chain-dot" />
          ton network
        </div>
      </div>
    </>
  );
}
