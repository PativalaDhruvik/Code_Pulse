import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CodePulseContext } from '../context/CodePulseContext';
import * as api from '../api';

export default function MyPulse() {
  const { submissions, errorLibrary } = useContext(CodePulseContext);
  const [puzzlesList, setPuzzlesList] = useState([]);
  const [activePuzzleKey, setActivePuzzleKey] = useState(null);
  const [activeWeakSpotName, setActiveWeakSpotName] = useState('');
  const [userSolution, setUserSolution] = useState('');
  const [puzzleFeedback, setPuzzleFeedback] = useState({ status: '', message: '' });

  // Fetch puzzles from Django backend
  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        const data = await api.getPuzzles();
        setPuzzlesList(data);
      } catch (err) {
        console.error("Failed to load practice puzzles from backend:", err);
      }
    };
    fetchPuzzles();
  }, []);

  // Map backend puzzles or empty fallback
  const practicePuzzles = puzzlesList.reduce((acc, p) => ({ ...acc, [p.key]: p }), {});

  // Render empty state if there are no submissions logged yet
  if (submissions.length === 0) {
    return (
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
        minHeight: 'calc(100vh - 90px)'
      }}>
        {/* Page Title */}
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>My Pulse</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Diagnostic telemetry timelines detailing telemetry improvements, trend lines, and weak spot debugging.
          </p>
        </div>

        <div className="glass-panel" style={{
          padding: '60px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          textAlign: 'center',
          minHeight: '400px'
        }}>
          <div style={{ fontSize: '3.5rem' }}>📈</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            No Telemetry Data Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px', lineHeight: '1.5' }}>
            Run static analysis checks on your Python scripts inside the Playground and save your results to see your learning trendlines, recurring compiler warnings, and practice challenges.
          </p>
          <Link
            to="/check"
            className="btn btn-primary"
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, var(--accent-secondary) 0%, #0891b2 100%)',
              boxShadow: 'none',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            Go to Playground
          </Link>
        </div>
      </div>
    );
  }

  // Process live submissions oldest to newest for Recharts with clean, unique date/run labels
  const rawChartData = [...submissions].reverse();
  const dateCounts = {};
  const chartData = rawChartData.map((sub, idx) => {
    let formattedDate = `Run #${idx + 1}`;
    try {
      const dateObj = new Date(sub.date.replace(' ', 'T'));
      if (!isNaN(dateObj.getTime())) {
        const baseDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dateCounts[baseDate] = (dateCounts[baseDate] || 0) + 1;
        const totalForDay = rawChartData.filter(s => s.date.includes(sub.date.split(' ')[0])).length;
        formattedDate = totalForDay > 1 ? `${baseDate} (#${dateCounts[baseDate]})` : baseDate;
      }
    } catch {}
    return {
      submissionId: sub.id,
      date: formattedDate,
      errors: sub.errors,
      warnings: sub.warnings,
      score: sub.score
    };
  });

  // Calculate accumulated progress ratio dynamically
  let progressPercentage = "0%";
  if (submissions.length > 1) {
    const oldest = submissions[submissions.length - 1];
    const newest = submissions[0];
    const initialIssues = oldest.errors + oldest.warnings;
    const currentIssues = newest.errors + newest.warnings;
    if (initialIssues > 0) {
      const reduction = initialIssues - currentIssues;
      const pct = Math.round((reduction / initialIssues) * 100);
      progressPercentage = pct >= 0 ? `${pct}%` : `0%`;
    } else if (currentIssues === 0) {
      progressPercentage = "100%";
    }
  } else if (submissions.length === 1) {
    const totalIssues = submissions[0].errors + submissions[0].warnings;
    progressPercentage = totalIssues === 0 ? "100%" : "50%";
  }

  // Calculate timelines with status markers (better vs worse compared to previous)
  const timeline = chartData.map((sub, idx) => {
    let trend = 'teal'; // default first is neutral/teal
    if (idx > 0) {
      const prevSub = chartData[idx - 1];
      trend = sub.errors < prevSub.errors ? 'teal' : sub.errors > prevSub.errors ? 'red' : 'neutral';
    }
    return {
      ...sub,
      trend
    };
  });

  // Calculate weak spots and patterns dynamically from user submissions
  const counts = {};
  submissions.forEach(sub => {
    if (sub.issues && Array.isArray(sub.issues)) {
      sub.issues.forEach(issue => {
        const name = issue.title;
        counts[name] = (counts[name] || 0) + 1;
      });
    }
  });

  const sorted = Object.entries(counts)
    .map(([name, count]) => {
      const isError = name.toLowerCase().includes('error') || name.toLowerCase().includes('colon');
      return {
        name,
        count,
        color: isError ? "var(--accent-danger)" : "var(--accent-warning)"
      };
    })
    .sort((a, b) => b.count - a.count);

  const maxCount = sorted.length > 0 ? (sorted[0].count || 1) : 1;
  const patterns = sorted.slice(0, 5).map(p => ({
    ...p,
    percent: Math.round((p.count / maxCount) * 100)
  }));

  const keyMap = {
    // Maps to undefined_variable (Logic / Name Lookup challenges)
    "NameError: Undefined Variable": "undefined_variable",
    "Implicit None Return Value": "undefined_variable",
    "ZeroDivisionError Risk": "undefined_variable",
    "Mutable Default Argument": "undefined_variable",
    "TypeError: Operation Mismatch": "undefined_variable",
    "Infinite Loop Risk": "undefined_variable",
    "Unreachable Code": "undefined_variable",
    "Redundant Boolean Comparison": "undefined_variable",

    // Maps to missing_colon (Syntax / Formatting challenges)
    "SyntaxError: Missing Colon": "missing_colon",
    "Deprecated Syntax Warning": "missing_colon",

    // Maps to indentation_error (Style / Alignment challenges)
    "IndentationError: Mismatched Blocks": "indentation_error",
    "Shadowing Builtin Name": "indentation_error",
    "Unused Local Variable": "indentation_error",
    "Duplicate Library Import": "indentation_error"
  };

  const descMap = {
    "undefined_variable": "Triggered when you read a variable name before declaring or assigning values to it in the current block scope.",
    "missing_colon": "Expected colon punctuation at the end of block statement headers like loop defs or logic branch checks.",
    "indentation_error": "Occurs when code statements inside loop nests or logic structures mismatch their indentation levels."
  };

  const weakSpots = sorted.slice(0, 3).map(p => {
    const key = keyMap[p.name] || "undefined_variable";
    const libraryError = errorLibrary.find(err => err.name === p.name);
    return {
      key,
      name: p.name,
      count: p.count,
      desc: libraryError ? libraryError.description : (descMap[key] || "Common static compilation issue flagged in your codebase.")
    };
  });

  const handleOpenPuzzle = (key, weakSpotName) => {
    const puzzle = practicePuzzles[key];
    if (!puzzle) return;
    setActivePuzzleKey(key);
    setActiveWeakSpotName(weakSpotName);
    setUserSolution(puzzle.broken);
    setPuzzleFeedback({ status: '', message: '' });
  };

  const handleVerifyPuzzle = () => {
    const puzzle = practicePuzzles[activePuzzleKey];
    if (!puzzle) return;
    
    const cleanUser = userSolution.replace(/\r?\n|\r/g, '\n').trim();
    const cleanSol = puzzle.solution.replace(/\r?\n|\r/g, '\n').trim();

    if (cleanUser === cleanSol) {
      setPuzzleFeedback({
        status: 'success',
        message: "✓ Solution verified! You resolved the compiler anomaly perfectly."
      });
    } else {
      setPuzzleFeedback({
        status: 'error',
        message: "✕ Incorrect solution. Match spacing exactly and ensure keywords/colons are correct."
      });
    }
  };

  const activePuzzle = activePuzzleKey ? practicePuzzles[activePuzzleKey] : null;

  return (
    <div className="animate-fade-in-up" style={{
      maxWidth: '1300px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>My Pulse</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Diagnostic telemetry timelines detailing telemetry improvements, trend lines, and weak spot debugging.
        </p>
      </div>

      {/* Hero Section: AreaChart and Hero Stat */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '0.8fr 1.2fr',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Stat card */}
        <div className="glass-panel pulse-glow-card" style={{
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.5px' }}>
            ACCUMULATED COMPILER PROGRESS
          </span>
          <div style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            color: 'var(--accent-secondary)',
            textShadow: '0 0 25px var(--accent-secondary-glow)'
          }}>
            {progressPercentage}
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '600' }}>
            improvement ratio
          </span>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Calculated by comparing error frequencies on your most recent runs against your first historical submission records.
          </p>
        </div>

        {/* Recharts Area Chart */}
        <div className="glass-panel" style={{
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          minHeight: '260px'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.5px' }}>
            ERROR FREQUENCY TREND OVER TELEMETRY SUBMISSIONS
          </span>
          
          <div style={{ width: '100%', height: '100%', minHeight: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradient-color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(19, 26, 43, 0.95)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
                  }}
                  formatter={(value) => [`${value} errors`, 'Errors']}
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stroke="var(--accent-secondary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#gradient-color)"
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                  activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2, fill: 'var(--accent-secondary)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two Columns Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        {/* Left Column: Recurring Patterns */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Recurring Compiler Patterns</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {patterns.map((pat, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{pat.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{pat.count} times</span>
                </div>
                <div style={{
                  height: '8px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)'
                }}>
                  <div
                    className="animate-progress-bar"
                    style={{
                    height: '100%',
                    width: `${pat.percent}%`,
                    backgroundColor: pat.color,
                    borderRadius: '4px',
                    boxShadow: `0 0 8px ${pat.color}`
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Improvement Timeline */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Improvement Timeline</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '250px' }}>
            {timeline.slice().reverse().map((sub, idx) => (
              <div
                key={idx}
                className="interactive-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.01)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: sub.trend === 'teal' ? 'var(--accent-success)' : sub.trend === 'red' ? 'var(--accent-danger)' : 'var(--text-muted)',
                    boxShadow: sub.trend === 'teal' ? '0 0 8px var(--accent-success)' : sub.trend === 'red' ? '0 0 8px var(--accent-danger)' : 'none'
                  }}></span>
                  <div>
                    <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>Submission #{timeline.length - idx}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '10px' }}>{sub.date}</span>
                  </div>
                </div>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {sub.errors} errors // {sub.warnings} warnings
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="glass-panel interactive-card" style={{
        padding: '24px',
        border: '1px solid var(--accent-secondary-glow)',
        background: 'rgba(6, 182, 212, 0.03)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ fontSize: '2rem' }}>💡</div>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--accent-secondary)' }}>AI System Diagnostics Insight</h4>
          <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', marginTop: '4px', lineHeight: '1.4' }}>
            {submissions.length > 0 
              ? "Your diagnostics are synchronizing with your remote telemetry node. Review your weak spots to practice fixes."
              : "Paste buggy code blocks in the Diagnostic Playground and run checks to generate AI System diagnostics insights."
            }
          </p>
        </div>
      </div>

      {/* Your Weak Spots */}
      {weakSpots.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Your Weak Spots</h3>
          
          <div style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', display: 'grid', gap: '20px' }}>
            {weakSpots.map((spot) => (
              <div
                key={`${spot.key}-${spot.name}`}
                className="glass-panel interactive-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{spot.name}</strong>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--accent-danger)',
                      fontWeight: '700'
                    }}>
                      {spot.count} Flagged
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {spot.desc}
                  </p>
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => handleOpenPuzzle(spot.key, spot.name)}
                  style={{
                    alignSelf: 'flex-start',
                    fontSize: '0.78rem',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                    color: 'var(--accent-primary)',
                    padding: '6px 12px'
                  }}
                >
                  Practice Fix
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice Fix Modal Drawer */}
      {activePuzzle && (
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
            maxWidth: '600px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Practice Arena: {activeWeakSpotName || activePuzzle.error_name}</h3>
                {activeWeakSpotName && activeWeakSpotName !== activePuzzle.error_name && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Challenge template: {activePuzzle.error_name}
                  </span>
                )}
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setActivePuzzleKey(null)}
                style={{ padding: '4px 10px' }}
              >
                Exit
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Modify the code block below to resolve the compiler anomaly. Follow spacing rules.
            </p>

            {/* Hint alert */}
            <div style={{
              padding: '10px 14px',
              borderRadius: '6px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              fontSize: '0.78rem',
              color: 'var(--text-primary)',
              lineHeight: '1.4'
            }}>
              💡 <strong>Hint:</strong> {activePuzzle.hint}
            </div>

            {/* User code editor */}
            <textarea
              value={userSolution}
              onChange={(e) => setUserSolution(e.target.value)}
              spellCheck="false"
              style={{
                height: '140px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.82rem',
                color: '#fff',
                outline: 'none',
                resize: 'none',
                lineHeight: '1.5'
              }}
            />

            {/* Feedback Alert */}
            {puzzleFeedback.message && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '6px',
                backgroundColor: puzzleFeedback.status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: puzzleFeedback.status === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                fontSize: '0.8rem',
                color: puzzleFeedback.status === 'success' ? 'var(--accent-success)' : 'var(--accent-danger)'
              }}>
                {puzzleFeedback.message}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setUserSolution(activePuzzle.broken);
                  setPuzzleFeedback({ status: '', message: '' });
                }}
                style={{ padding: '6px 14px' }}
              >
                Reset
              </button>
              <button
                className="btn btn-primary"
                onClick={handleVerifyPuzzle}
                style={{ padding: '6px 16px', background: 'linear-gradient(135deg, var(--accent-secondary) 0%, #0891b2 100%)', boxShadow: 'none' }}
              >
                Verify Fix
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
