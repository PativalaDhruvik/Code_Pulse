import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodePulseContext } from '../context/CodePulseContext';
import Animation from '../components/Animation';
import Intro from './Intro.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export default function Login() {
  const { loginUser, registerUser, loginDemoUser, loading } = useContext(CodePulseContext);
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('codepulse_intro_seen');
  });
  const [isLogin, setIsLogin] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  const handleIntroComplete = () => {
    sessionStorage.setItem('codepulse_intro_seen', 'true');
    setShowIntro(false);
  };

  const handleTabSwitch = (loginState) => {
    setIsLogin(loginState);
    setErrorMsg('');
    setFieldErrors({});
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const validateForm = () => {
    const errors = {};

    if (!isLogin) {
      if (!name.trim()) {
        errors.name = "Name is required.";
      } else if (name.trim().length < 6) {
        errors.name = "Name must be at least 6 characters long.";
      }
    }

    if (!email.trim()) {
      errors.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "Please enter a valid email address (e.g. user@domain.com).";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (!isLogin) {
      const hasMinLen = password.length >= 8;
      const hasUpper = UPPERCASE_REGEX.test(password);
      const hasLower = LOWERCASE_REGEX.test(password);
      const hasSpecial = SPECIAL_CHAR_REGEX.test(password);

      if (!hasMinLen || !hasUpper || !hasLower || !hasSpecial) {
        errors.password = "Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, and 1 special character.";
      }
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters long.";
    }

    if (!isLogin) {
      if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password.";
      } else if (confirmPassword !== password) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateForm()) {
      return;
    }

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || "Authentication failed. Please check your credentials.");
    }
  };

  const handleDemoLogin = async () => {
    try {
      await loginDemoUser();
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg("Demo login failed. Please try again.");
    }
  };

  if (showIntro) {
    return <Intro onComplete={handleIntroComplete} />;
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating 24 Code Elements Background Animation */}
      <Animation />

      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      <div className="glass-panel animate-fade-in-up" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        zIndex: 1,
        position: 'relative'
      }}>
        {/* Branding header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <svg
            className="heartbeat-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: '48px', height: '48px' }}
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <h1 className="glow-text-indigo" style={{
            fontSize: '2rem',
            fontWeight: '800',
            letterSpacing: '-0.5px',
            background: 'linear-gradient(90deg, #818cf8, #38bdf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginTop: '8px'
          }}>
            CodePulse
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
            {isLogin ? "Sign in to monitor compiler diagnostics" : "Register a student telemetry node"}
          </p>
        </div>

        {/* Global Error Message Display */}
        {errorMsg && (
          <div style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--accent-danger)',
            fontSize: '0.82rem',
            lineHeight: '1.4'
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Toggle tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-input)',
          padding: '4px',
          borderRadius: '8px',
          width: '100%',
          border: '1px solid var(--border-color)'
        }}>
          <button
            type="button"
            onClick={() => handleTabSwitch(true)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: isLogin ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch(false)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: !isLogin ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: !isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
          >
            Signup
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} noValidate style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name Field (Signup Only) */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="name-input" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Name</label>
              <input
                id="name-input"
                type="text"
                placeholder="Alex Mercer"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                }}
                style={{
                  background: 'var(--bg-input)',
                  border: fieldErrors.name ? '1px solid var(--accent-danger)' : '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              {fieldErrors.name && (
                <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '2px' }}>
                  {fieldErrors.name}
                </span>
              )}
            </div>
          )}

          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="email-input" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Email Address</label>
            <input
              id="email-input"
              type="email"
              placeholder="student@codepulse.io"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
              }}
              style={{
                background: 'var(--bg-input)',
                border: fieldErrors.email ? '1px solid var(--accent-danger)' : '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '12px 16px',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
            {fieldErrors.email && (
              <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '2px' }}>
                {fieldErrors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="password-input" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Password</label>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                }}
                style={{
                  width: '100%',
                  background: 'var(--bg-input)',
                  border: fieldErrors.password ? '1px solid var(--accent-danger)' : '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  padding: '12px 45px 12px 16px',
                  borderRadius: '8px',
                  outline: 'none',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  outline: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            {!isLogin && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: password.length >= 8 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: password.length >= 8 ? 'var(--accent-success)' : 'var(--text-muted)', fontWeight: '500' }}>
                  {password.length >= 8 ? "✓" : "○"} 8+ chars
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: UPPERCASE_REGEX.test(password) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: UPPERCASE_REGEX.test(password) ? 'var(--accent-success)' : 'var(--text-muted)', fontWeight: '500' }}>
                  {UPPERCASE_REGEX.test(password) ? "✓" : "○"} Uppercase (A-Z)
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: LOWERCASE_REGEX.test(password) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: LOWERCASE_REGEX.test(password) ? 'var(--accent-success)' : 'var(--text-muted)', fontWeight: '500' }}>
                  {LOWERCASE_REGEX.test(password) ? "✓" : "○"} Lowercase (a-z)
                </span>
                <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: SPECIAL_CHAR_REGEX.test(password) ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)', color: SPECIAL_CHAR_REGEX.test(password) ? 'var(--accent-success)' : 'var(--text-muted)', fontWeight: '500' }}>
                  {SPECIAL_CHAR_REGEX.test(password) ? "✓" : "○"} Special Char (!@#$)
                </span>
              </div>
            )}
            {fieldErrors.password && (
              <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '2px' }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          {/* Confirm Password Field (Signup Only) */}
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="confirm-password-input" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Confirm Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="confirm-password-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: fieldErrors.confirmPassword ? '1px solid var(--accent-danger)' : '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '12px 45px 12px 16px',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    outline: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-secondary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <span style={{ color: 'var(--accent-danger)', fontSize: '0.75rem', marginTop: '2px' }}>
                  {fieldErrors.confirmPassword}
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              marginTop: '10px'
            }}
          >
            {loading ? "Authenticating..." : isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', width: '100%' }} />

        {/* Demo login shortcut */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleDemoLogin}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '600',
            borderColor: 'rgba(6, 182, 212, 0.4)',
            color: 'var(--accent-secondary)'
          }}
        >
          🚀 Try Demo Portal (Instant Login)
        </button>
      </div>
    </div>
  );
}
