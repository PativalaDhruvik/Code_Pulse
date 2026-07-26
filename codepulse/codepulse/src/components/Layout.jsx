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
      {/* Top Navbar */}
      <nav className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        margin: '20px 20px 0 20px',
        height: '70px',
        position: 'relative',
        zIndex: 100
      }}>
        {/* Brand logo & name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          margin: '10px 20px 0 20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 99
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

      {/* Page Content Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
