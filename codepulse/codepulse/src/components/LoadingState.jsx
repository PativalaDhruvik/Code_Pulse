import React, { useState, useEffect } from 'react';

const MESSAGES = [
  "SYNCHRONIZING TELEMETRY NODES...",
  "PARSING AST SYNTAX TREE & SCOPE...",
  "GEMINI AI ENGINE ANOMALY SCAN...",
  "COMPILING COMPILER DIAGNOSTICS..."
];

export default function LoadingState({ message }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  const currentMessage = message || MESSAGES[msgIndex];

  return (
    <div className="glass-panel animate-fade-in-up" style={{
      padding: '36px 24px',
      minHeight: '220px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(6, 182, 212, 0.12)'
    }}>
      {/* Background ambient radial glow */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 75%)',
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      {/* Futuristic Dual Ring & Heartbeat Icon Loader */}
      <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Outer Counter-Rotating Dashed Ring */}
        <div
          className="animate-reverse-spin"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px dashed rgba(6, 182, 212, 0.4)'
          }}
        />

        {/* Inner Fast Dual Spinning Arc */}
        <div
          className="animate-dual-spin"
          style={{
            position: 'absolute',
            inset: '6px',
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: 'var(--accent-secondary)',
            borderBottomColor: 'var(--accent-primary)',
            filter: 'drop-shadow(0 0 8px var(--accent-secondary))'
          }}
        />

        {/* Center Heartbeat ECG Pulse */}
        <svg
          className="heartbeat-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: '26px', height: '26px', zIndex: 2 }}
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>

      {/* Terminal Loading Text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 2 }}>
        <div style={{
          fontSize: '0.85rem',
          fontWeight: '700',
          color: 'var(--accent-secondary)',
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: '1px',
          textShadow: '0 0 10px var(--accent-secondary-glow)'
        }}>
          {currentMessage}
          <span className="cursor-blink" />
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Performing real-time static compilation & Gemini 3.5 Flash telemetry checks
        </span>
      </div>

      {/* Animated Laser Progress Sweep Bar */}
      <div style={{
        width: '280px',
        height: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '2px',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid var(--border-color)',
        marginTop: '4px'
      }}>
        <div
          className="animate-radar-sweep"
          style={{
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '120px',
            background: 'linear-gradient(90deg, transparent, #06b6d4, #818cf8, transparent)',
            borderRadius: '2px',
            boxShadow: '0 0 10px var(--accent-secondary)'
          }}
        />
      </div>
    </div>
  );
}
