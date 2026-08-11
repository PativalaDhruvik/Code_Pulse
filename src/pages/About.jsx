import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Animation from '../components/Animation';

export default function About() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { icon: '🔍', title: 'Real Error Detection', desc: 'Powered by Python ast, flake8 and pylint. Not AI guesses — real compiler analysis.' },
    { icon: '📚', title: '3-Level Explanations', desc: 'New to this, Comfortable, or Just the facts. Same error, three depths — you choose.' },
    { icon: '📈', title: 'Personal Pulse Dashboard', desc: 'Track your error count over time. See exactly which mistakes keep coming back.' },
   
    { icon: '📖', title: 'Error Library', desc: 'Browse all 19 error types with examples, explanations and fix guides.' },
    { icon: '📤', title: 'Upload .py Files', desc: 'Drag and drop your Python files directly. No copy-paste needed.' },
  ];

  const steps = [
    { num: '01', title: 'Paste or Upload', desc: 'Paste your Python code or drag and drop a .py file directly into the editor.' },
    { num: '02', title: 'Get Instant Analysis', desc: 'Our 4-layer detection engine finds every error and explains it in plain English.' },
    { num: '03', title: 'Track Your Progress', desc: 'Every submission is saved. Watch your Pulse dashboard improve over time.' },
  ];

  const stats = [
    { value: '19', label: 'Error Types Detected' },
    { value: '3', label: 'Explanation Levels' },
    { value: '100%', label: 'Free to Use' },
    { value: '2', label: 'Detection Layers' },
  ];

  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Background Floating Code Animation */}
      <Animation />

      {/* FIXED NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 36px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: scrollY > 40 ? 'rgba(11, 15, 25, 0.85)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrollY > 40 ? 'blur(16px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid var(--border-color)' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Logo Branding */}
        <div 
          onClick={() => navigate('/')} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <svg
            className="heartbeat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-danger)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '28px', height: '28px' }}
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
            Code<span style={{ color: 'var(--accent-primary)' }}>Pulse</span>
          </span>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button
            onClick={() => scrollToSection('features')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('how')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
          >
            How it Works
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
            style={{
              padding: '8px 20px', borderRadius: 8,
              fontSize: '0.9rem', fontWeight: 600,
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '120px 24px 80px', textAlign: 'center',
        position: 'relative', zIndex: 1,
        background: 'radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.05) 45%, transparent 75%)',
      }}>
        {/* Logo mark */}
        <div style={{ marginBottom: 24 }}>
          <svg
            className="heartbeat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-danger)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '56px', height: '56px' }}
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 20,
          background: 'rgba(99, 102, 241, 0.12)', border: '1px solid var(--border-glow)',
          fontSize: '0.85rem', color: '#a5b4fc', marginBottom: 24, fontWeight: 600,
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.15)',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-danger)',
            display: 'inline-block', boxShadow: '0 0 6px var(--accent-danger)'
          }}></span>
          Built for 2nd Year CS Students
        </div>

        {/* Original Title */}
        <h1 style={{
          fontSize: 'clamp(40px, 7vw, 80px)',
          fontWeight: 800,
          letterSpacing: -2,
          lineHeight: 1.1,
          marginBottom: 24,
          background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          CodePulse
        </h1>

        {/* Original Subtitles */}
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          color: 'var(--text-secondary)', maxWidth: 600, lineHeight: 1.6, marginBottom: 16,
        }}>
          The only Python error detector that explains mistakes
          <span style={{ color: 'var(--text-primary)' }}> at your level</span> — and tracks
          <span style={{ color: 'var(--text-primary)' }}> how you improve</span> over time.
        </p>

        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 40 }}>
          Powered by real Python analysis — not AI guessing.
        </p>

        {/* Call-to-action buttons */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
            style={{
              padding: '14px 32px', borderRadius: 10,
              fontSize: '1rem', fontWeight: 600,
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            Get Started Free →
          </button>
          <button
            onClick={() => scrollToSection('how')}
            className="btn btn-secondary"
            style={{
              padding: '14px 32px', borderRadius: 10,
              fontSize: '1rem', fontWeight: 500,
            }}
          >
            See How It Works
          </button>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          textAlign: 'center', fontSize: 36, fontWeight: 700,
          marginBottom: 48, letterSpacing: -0.5, color: 'var(--text-primary)',
        }}>
          Why do students struggle with code errors?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {[
            { icon: '😤', title: 'Errors are cryptic', desc: 'A NameError message tells you nothing. You stare at it for hours not knowing where to even start.' },
            { icon: '📉', title: 'No sense of progress', desc: 'You fix one bug today and have no idea if you are actually improving or repeating the same mistakes.' },
          ].map((card, i) => (
            <div key={i} className="glass-panel" style={{ padding: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{card.icon}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)' }}>{card.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          textAlign: 'center', fontSize: 36, fontWeight: 700,
          marginBottom: 12, letterSpacing: -0.5, color: 'var(--text-primary)',
        }}>
          Everything you need to write better Python
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 48, fontSize: 16 }}>
          Six powerful features working together to make you a better developer
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="glass-panel" style={{
              padding: 28,
              transition: 'all 0.3s ease',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{
        padding: '80px 24px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1,
      }}>
        <h2 style={{
          textAlign: 'center', fontSize: 36, fontWeight: 700,
          marginBottom: 48, letterSpacing: -0.5, color: 'var(--text-primary)',
        }}>
          How it works
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
          {steps.map((step, i) => (
            <div key={i} className="glass-panel" style={{ textAlign: 'center', padding: '36px 28px', position: 'relative' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid var(--border-glow)',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 18, fontWeight: 800, color: 'var(--accent-primary)',
              }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{
        padding: '60px 24px', margin: '40px 0',
        background: 'rgba(19, 26, 43, 0.6)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24, textAlign: 'center',
        }}>
          {stats.map((s, i) => (
            <div key={i}>
              <div className="glow-text-indigo" style={{
                fontSize: 42, fontWeight: 800, color: 'var(--accent-primary)',
                letterSpacing: -1,
              }}>{s.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding: '100px 24px', textAlign: 'center',
        maxWidth: 900, margin: '0 auto 40px',
        position: 'relative', zIndex: 1,
      }}>
        <div className="glass-panel" style={{
          padding: '60px 32px',
          background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, var(--bg-card) 100%)',
          border: '1px solid var(--border-glow)',
        }}>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800,
            letterSpacing: -1, marginBottom: 16, color: 'var(--text-primary)',
          }}>
            Ready to write better Python?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 18, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
            Join students who use CodePulse to debug faster and improve over time.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
            style={{
              padding: '16px 40px', borderRadius: 12,
              fontSize: 18, fontWeight: 700,
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
            }}
          >
            Start Checking Your Code →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '24px 36px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 1,
        background: 'var(--bg-primary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg
            className="heartbeat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-danger)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '20px', height: '20px' }}
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: 15 }}>
            Code<span style={{ color: 'var(--accent-primary)' }}>Pulse</span>
          </span>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Built for students, by students
        </span>
      </footer>
    </div>
  );
}
