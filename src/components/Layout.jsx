import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CodePulseContext } from '../context/CodePulseContext';

export default function Layout() {
  const { user, logoutUser } = useContext(CodePulseContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const getAvatarInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const linkStyle = ({ isActive }) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
    border: isActive ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sticky Header Container */}
      <header style={{
        position: 'sticky',
        top: '15px',
        zIndex: 100,
        margin: '15px 20px 0 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Top Navbar */}
        <nav className="glass-panel" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: '70px',
          width: '100%'
        }}>
          {/* Brand logo & name */}
          <div 
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <svg
              className="heartbeat-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: '28px', height: '28px' }}
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg, #818cf8, #38bdf8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Outfit', sans-serif"
            }}>
              CodePulse
            </span>
          </div>

          {/* Navigation Links - Desktop View */}
          <div className="nav-desktop" style={{ display: 'flex', gap: '6px' }}>
            <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
            <NavLink to="/check" style={linkStyle}>Check Code</NavLink>
            <NavLink to="/pulse" style={linkStyle}>My Pulse</NavLink>
            <NavLink to="/history" style={linkStyle}>History</NavLink>
            <NavLink to="/learn" style={linkStyle}>Error Library</NavLink>
          </div>

          {/* User profile & Logout - Desktop View */}
          <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* User Avatar Initial */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.85rem',
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
              }}>
                {getAvatarInitials(user?.name)}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                {user?.name || "Student"}
              </span>
            </div>

            <button
              className="btn btn-secondary"
              onClick={handleLogout}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
            >
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              display: 'none', // Overridden in media queries
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="glass-panel nav-mobile-drawer" style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} style={linkStyle}>Dashboard</NavLink>
              <NavLink to="/check" onClick={() => setMobileOpen(false)} style={linkStyle}>Check Code</NavLink>
              <NavLink to="/pulse" onClick={() => setMobileOpen(false)} style={linkStyle}>My Pulse</NavLink>
              <NavLink to="/history" onClick={() => setMobileOpen(false)} style={linkStyle}>History</NavLink>
              <NavLink to="/learn" onClick={() => setMobileOpen(false)} style={linkStyle}>Error Library</NavLink>
            </div>
            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.8rem'
                }}>
                  {getAvatarInitials(user?.name)}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{user?.name}</span>
              </div>
              <button className="btn btn-secondary" onClick={handleLogout} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Page Content Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>

        {/* Footer with Copyright and Social Links */}
        <footer className="glass-panel" style={{
          margin: '20px',
          padding: '20px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}>
          <div>
            <span>© {new Date().getFullYear()} CodePulse. Academic & proprietary telemetry restrictions apply.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }} className="footer-link">
              <svg style={{ width: '16px', height: '16px', fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }} className="footer-link">
              <svg style={{ width: '15px', height: '15px', fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }} className="footer-link">
              <svg style={{ width: '15px', height: '15px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round' }} viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }} className="footer-link">
              <svg style={{ width: '15px', height: '15px', fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
