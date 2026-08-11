import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodePulseContext } from '../context/CodePulseContext';

// Helper to calculate errors fixed by tracking reduction in errors on consecutive submissions of the same file
const calculateErrorsFixed = (subs) => {
  if (!subs || subs.length === 0) return 0;
  const files = {};
  subs.forEach(s => {
    if (!files[s.filename]) {
      files[s.filename] = [];
    }
    files[s.filename].push(s);
  });

  let errorsFixed = 0;
  Object.values(files).forEach(fileSubs => {
    // Submissions are ordered newest first. Reverse to process chronologically.
    const chronological = [...fileSubs].reverse();
    for (let i = 1; i < chronological.length; i++) {
      const prev = chronological[i - 1];
      const curr = chronological[i];
      const diff = prev.errors - curr.errors;
      if (diff > 0) {
        errorsFixed += diff;
      }
    }
  });
  return errorsFixed;
};

// Helper to calculate streak of consecutive submission days
const calculateStreak = (subs) => {
  if (!subs || subs.length === 0) return "0 days";
  const dates = subs.map(s => s.date.split(' ')[0]); // Get YYYY-MM-DD
  const uniqueDates = [...new Set(dates)].sort().reverse(); // Newest first

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If there are no submissions today or yesterday, streak is 0
  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) {
    return "0 days";
  }

  let streak = 1;
  let curr = new Date(uniqueDates[0]);
  for (let i = 1; i < uniqueDates.length; i++) {
    const nextDate = new Date(uniqueDates[i]);
    const diffTime = Math.abs(curr - nextDate);
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
      curr = nextDate;
    } else if (diffDays > 1) {
      break;
    }
  }
  return `${streak} ${streak === 1 ? 'day' : 'days'}`;
};

// Helper to determine the most common error from issues logged in submissions
const getMostCommonError = (subs) => {
  if (!subs || subs.length === 0) return "None";
  const counts = {};
  subs.forEach(sub => {
    if (sub.issues && Array.isArray(sub.issues)) {
      sub.issues.forEach(issue => {
        counts[issue.title] = (counts[issue.title] || 0) + 1;
      });
    }
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return "None";
  const errorName = sorted[0][0];
  return errorName.length > 20 ? errorName.slice(0, 18) + '...' : errorName;
};

export default function Dashboard() {
  const { user, submissions } = useContext(CodePulseContext);
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Calculate dynamic stats
  const totalSubmissions = submissions.length;
  const avgScore = totalSubmissions > 0
    ? Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / totalSubmissions)
    : 0;

  const stats = [
    { label: "Total Submissions", value: totalSubmissions, icon: "📊", color: "var(--accent-primary)" },
    { label: "Errors Fixed This Week", value: calculateErrorsFixed(submissions), icon: "⚡", color: "var(--accent-success)" },
    { label: "Current Streak", value: calculateStreak(submissions), icon: "🔥", color: "rgba(245, 158, 11, 1)" },
    { label: "Most Common Error", value: getMostCommonError(submissions), icon: "⚠️", color: "var(--accent-secondary)" },
    { label: "Improvement Score", value: `${avgScore}%`, icon: "📈", color: "var(--accent-success)" }
  ];


  const recent = submissions.slice(0, 5);

  const quickTips = [
    {
      title: "SyntaxError: Missing Colon",
      tip: "Double check your block header statements (if, for, def). In Python, they must always terminate with a colon ':' to begin a code block.",
      icon: "🔑"
    },
    {
      title: "NameError: Undefined Identifier",
      tip: "Before using a name in calculations, ensure it has been declared and assigned a value within the local function namespace.",
      icon: "🏷️"
    },
    {
      title: "IndentationError: Space Misalignment",
      tip: "Python requires uniform spaces (preferably 4 spaces) for block indentation. Mixed tabs and spaces will crash the parser.",
      icon: "📐"
    }
  ];

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{
      maxWidth: '1300px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Welcome back, <span className="glow-text-indigo" style={{ color: 'var(--accent-primary)' }}>{user?.name || "Student"}</span>. Your code is getting better.
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.9rem' }}>
            Telemetry Node CP-991A // Active Session: {todayStr}
          </p>
        </div>
      </div>

      {/* Row of 5 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="glass-panel"
            style={{
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '500' }}>{stat.label}</span>
              <span style={{ fontSize: '1.1rem' }}>{stat.icon}</span>
            </div>
            <div style={{
              fontSize: '1.6rem',
              fontWeight: '700',
              color: 'var(--text-primary)',
              textShadow: `0 0 10px rgba(255,255,255,0.05)`
            }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Two Large Feature Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Check Code Card */}
        <div
          className="glass-panel"
          style={{
            padding: '30px',
            borderLeft: '4px solid var(--accent-danger)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--accent-danger)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>WORKSPACE DIAGNOSTICS</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Check My Code</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              Paste Python code or upload your `.py` scripts. Instantly run static analysis to capture syntax errors, unused variables, and logical flaws.
            </p>
          </div>
          <button
            onClick={() => navigate('/check')}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', background: 'linear-gradient(135deg, var(--accent-danger) 0%, #dc2626 100%)', boxShadow: 'none' }}
          >
            Start Checking &rarr;
          </button>
        </div>

        {/* My Pulse Card */}
        <div
          className="glass-panel"
          style={{
            padding: '30px',
            borderLeft: '4px solid var(--accent-secondary)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ color: 'var(--accent-secondary)', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '1px' }}>ANALYTICS ENGINE</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>My Pulse</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
              View timelines detailing telemetry progress metrics, error frequency charts, weak spot practice modules, and diagnostic charts.
            </p>
          </div>
          <button
            onClick={() => navigate('/pulse')}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', background: 'linear-gradient(135deg, var(--accent-secondary) 0%, #0891b2 100%)', boxShadow: 'none' }}
          >
            View Pulse &rarr;
          </button>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Recent Submissions Log</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>Filename</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Errors</th>
                <th style={{ padding: '12px 16px' }}>Warnings</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((sub, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{sub.filename}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{sub.date}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--accent-danger)' }}>{sub.errors}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--accent-warning)' }}>{sub.warnings}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: sub.status === 'Improved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: sub.status === 'Improved' ? 'var(--accent-success)' : 'var(--accent-danger)'
                    }}>
                      {sub.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setSelectedSubmission(sub)}
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Tips Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Quick Diagnostic Tips</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {quickTips.map((tip, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', display: 'flex', gap: '16px' }}>
              <div style={{ fontSize: '1.8rem' }}>{tip.icon}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{tip.title}</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{tip.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Features Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        {/* Error Library quick redirect */}
        <div
          className="glass-panel"
          onClick={() => navigate('/learn')}
          style={{
            padding: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.01)'
          }}
        >
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>📚 Error Library Databank</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Search and filter descriptions for all 15 Python syntax and logic warnings.
            </p>
          </div>
          <span style={{ fontSize: '1.2rem', color: 'var(--accent-primary)' }}>&rarr;</span>
        </div>

        {/* Upload Mode active redirect */}
        <div
          className="glass-panel"
          onClick={() => navigate('/check', { state: { mode: 'upload' } })}
          style={{
            padding: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.01)'
          }}
        >
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>📤 Upload .py Script</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Jump straight to drag-and-drop file upload to read and analyze Python codes.
            </p>
          </div>
          <span style={{ fontSize: '1.2rem', color: 'var(--accent-secondary)' }}>&rarr;</span>
        </div>
      </div>

      {/* Modal View Submission Details */}
      {selectedSubmission && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '650px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            gap: '16px',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{selectedSubmission.filename}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Analyzed: {selectedSubmission.date}</span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedSubmission(null)}
                style={{ padding: '6px 12px' }}
              >
                Close
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--accent-danger)',
                fontWeight: '600'
              }}>
                {selectedSubmission.errors} Errors
              </span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: 'var(--accent-warning)',
                fontWeight: '600'
              }}>
                {selectedSubmission.warnings} Warnings
              </span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--accent-success)',
                fontWeight: '600'
              }}>
                Telemetry Score: {selectedSubmission.score}%
              </span>
            </div>

            {/* Code display */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <pre style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '16px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.8rem',
                overflowX: 'auto',
                color: '#e2e8f0',
                lineHeight: '1.5'
              }}>
                {selectedSubmission.code}
              </pre>

              {/* Issues list */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '10px', color: 'var(--text-secondary)' }}>Detected Anomaly Details</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedSubmission.issues.length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-success)' }}>✓ Clean build. No telemetry issues flagged.</div>
                  ) : (
                    selectedSubmission.issues.map((issue, idx) => (
                      <div key={idx} style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.01)',
                        borderLeft: `3px solid ${issue.color}`,
                        fontSize: '0.8rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong>Line {issue.line} - {issue.title}</strong>
                          <span style={{ color: issue.color, fontSize: '0.7rem', fontWeight: '600' }}>{issue.badge}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>{issue.summary}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
