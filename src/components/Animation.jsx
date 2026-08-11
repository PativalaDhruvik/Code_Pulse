import React from 'react';

const FLOATING_ITEMS = [
  { text: 'def', top: '10%', left: '8%', size: '1.2rem', color: '#818cf8', opacity: 0.2, duration: '16s', delay: '0s' },
  { text: 'SyntaxError', top: '18%', left: '82%', size: '0.95rem', color: '#ef4444', opacity: 0.18, duration: '22s', delay: '-3s' },
  { text: '{ }', top: '75%', left: '12%', size: '1.4rem', color: '#38bdf8', opacity: 0.15, duration: '19s', delay: '-5s' },
  { text: '</>', top: '82%', left: '85%', size: '1.3rem', color: '#818cf8', opacity: 0.22, duration: '24s', delay: '-2s' },
  { text: 'import os', top: '28%', left: '15%', size: '0.85rem', color: '#34d399', opacity: 0.15, duration: '20s', delay: '-7s' },
  { text: 'return True', top: '65%', left: '78%', size: '0.9rem', color: '#fbbf24', opacity: 0.17, duration: '17s', delay: '-4s' },
  { text: 'lambda x:', top: '45%', left: '6%', size: '0.9rem', color: '#c084fc', opacity: 0.18, duration: '25s', delay: '-1s' },
  { text: 'print()', top: '35%', left: '88%', size: '1.1rem', color: '#38bdf8', opacity: 0.16, duration: '21s', delay: '-8s' },
  { text: 'if __name__:', top: '88%', left: '25%', size: '0.85rem', color: '#818cf8', opacity: 0.15, duration: '26s', delay: '-6s' },
  { text: 'try / except', top: '12%', left: '68%', size: '0.9rem', color: '#fbbf24', opacity: 0.18, duration: '18s', delay: '-9s' },
  { text: '!= None', top: '55%', left: '92%', size: '0.9rem', color: '#ef4444', opacity: 0.14, duration: '23s', delay: '-2s' },
  { text: 'IndentationError', top: '92%', left: '65%', size: '0.85rem', color: '#ef4444', opacity: 0.16, duration: '27s', delay: '-11s' },
  { text: '[ ]', top: '60%', left: '4%', size: '1.2rem', color: '#34d399', opacity: 0.17, duration: '19s', delay: '-4s' },
  { text: 'async / await', top: '5%', left: '35%', size: '0.95rem', color: '#c084fc', opacity: 0.19, duration: '22s', delay: '-10s' },
  { text: 'raise ValueError', top: '70%', left: '2%', size: '0.8rem', color: '#ef4444', opacity: 0.15, duration: '24s', delay: '-3s' },
  { text: '010101', top: '40%', left: '76%', size: '0.8rem', color: '#64748b', opacity: 0.12, duration: '28s', delay: '-12s' },
  { text: 'NameError', top: '50%', left: '18%', size: '0.85rem', color: '#fbbf24', opacity: 0.15, duration: '20s', delay: '-6s' },
  { text: 'yield data', top: '80%', left: '48%', size: '0.85rem', color: '#34d399', opacity: 0.16, duration: '21s', delay: '-8s' },
  { text: '== True', top: '22%', left: '48%', size: '0.85rem', color: '#38bdf8', opacity: 0.14, duration: '17s', delay: '-5s' },
  { text: 'assert val', top: '95%', left: '10%', size: '0.8rem', color: '#818cf8', opacity: 0.15, duration: '23s', delay: '-13s' },
  { text: '# CodePulse', top: '8%', left: '90%', size: '0.85rem', color: '#38bdf8', opacity: 0.16, duration: '25s', delay: '-7s' },
  { text: 'TypeError', top: '30%', left: '3%', size: '0.85rem', color: '#ef4444', opacity: 0.17, duration: '19s', delay: '-2s' },
  { text: 'self.telemetry', top: '85%', left: '92%', size: '0.8rem', color: '#c084fc', opacity: 0.15, duration: '26s', delay: '-9s' },
  { text: 'while loop:', top: '3%', left: '18%', size: '0.85rem', color: '#fbbf24', opacity: 0.16, duration: '22s', delay: '-4s' }
];

export default function Animation() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0
    }}>
      {/* Radial gradient background highlights */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
        filter: 'blur(40px)'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
        filter: 'blur(50px)'
      }} />

      {/* Floating 24 Code Elements */}
      {FLOATING_ITEMS.map((item, index) => (
        <span
          key={index}
          className="floating-element"
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            color: item.color,
            opacity: item.opacity,
            '--float-duration': item.duration,
            '--float-delay': item.delay
          }}
        >
          {item.text}
        </span>
      ))}
    </div>
  );
}
