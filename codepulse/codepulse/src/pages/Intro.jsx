import React, { useEffect } from 'react';
import Animation from '../components/Animation.jsx';

export default function Intro({ onComplete }) {
  useEffect(() => {
    // 3.5 seconds cinematic splash duration matching YouTube app launch style
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0b0f19',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      userSelect: 'none'
    }}>
      {/* Background Floating Code Elements */}
      <Animation />

      {/* Cinematic Ambient Backdrop Glow */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, rgba(99, 102, 241, 0.12) 45%, transparent 75%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* Centered YouTube-Style Animated Splash Brand */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        zIndex: 10
      }}>
        {/* Pulsing ECG Heartbeat Icon */}
        <div className="splash-logo-anim">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '90px', height: '90px' }}
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>

        {/* Shimmering Title */}
        <h1 className="splash-title-anim" style={{
          fontSize: '3.6rem',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #ffffff 0%, #818cf8 50%, #38bdf8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          padding: 0
        }}>
          CodePulse
        </h1>

        {/* Expanding Laser Line */}
        <div className="splash-laser-anim" style={{
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #ef4444, #818cf8, #38bdf8, transparent)',
          borderRadius: '2px',
          boxShadow: '0 0 15px rgba(56, 189, 248, 0.8)'
        }} />
      </div>
    </div>
  );
}
