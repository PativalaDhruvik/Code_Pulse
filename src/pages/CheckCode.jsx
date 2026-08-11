import React, { useState, useRef, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CodePulseContext } from '../context/CodePulseContext';
import LoadingState from '../components/LoadingState.jsx';
import * as api from '../api';

const DEFAULT_BUGGY_PYTHON = `def check_telemetry(data)
    factor = 1.05
    threshold = 90
    
  for item in data:
      if item.value > threshold
          print("Warning: " + item_name) # Error
          
    return True`;

export default function CheckCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addSubmission } = useContext(CodePulseContext);

  const getSavedState = () => {
    try {
      const saved = sessionStorage.getItem('codepulse_checkcode_state');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const savedState = getSavedState();

  const [mode, setMode] = useState(savedState?.mode || 'paste'); // paste, upload
  const [code, setCode] = useState(savedState?.code ?? DEFAULT_BUGGY_PYTHON);
  const [language, setLanguage] = useState('python');
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(savedState?.results || null);
  const [selectedIssueIdx, setSelectedIssueIdx] = useState(savedState?.selectedIssueIdx ?? null);
  const [explanationTab, setExplanationTab] = useState(savedState?.explanationTab || 'newbie'); // newbie, comfortable, facts
  const [fileName, setFileName] = useState(savedState?.fileName || 'telemetry_check.py');
  const [notification, setNotification] = useState('');
  const [errorNotification, setErrorNotification] = useState('');

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const fileInputRef = useRef(null);

  // Persist state changes to sessionStorage so navigating between pages won't reset user work
  useEffect(() => {
    try {
      sessionStorage.setItem('codepulse_checkcode_state', JSON.stringify({
        code,
        fileName,
        results,
        selectedIssueIdx,
        mode,
        explanationTab
      }));
    } catch (err) {
      console.error("Failed to persist CheckCode state", err);
    }
  }, [code, fileName, results, selectedIssueIdx, mode, explanationTab]);

  // Read router location state to check if upload redirect is active
  useEffect(() => {
    if (location.state?.mode === 'upload') {
      setMode('upload');
    }
  }, [location.state]);

  // Sync scroll height of line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lines = code.split('\n');
  const lineNumbers = lines.map((_, i) => i + 1);

  // File Upload Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    readFile(file);
  };

  const readFile = (file) => {
    if (!file.name.endsWith('.py')) {
      alert("Only Python (.py) files are supported in this node.");
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
      setMode('paste'); // Switch back to paste mode to let user edit / view
      setNotification(`File "${file.name}" loaded successfully.`);
      setTimeout(() => setNotification(''), 4000);
    };
    reader.readAsText(file);
  };

  // Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      readFile(file);
    }
  };

  const executeAnalysis = async (e) => {
    if (e) e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setResults(null);
    setSelectedIssueIdx(null);
    setErrorNotification('');
    try {
      const data = await api.analyzeCode(code);
      setResults(data);
      if (data.issues && data.issues.length > 0) {
        setSelectedIssueIdx(0); // auto-select first issue
      }
    } catch (err) {
      console.error(err);
      setErrorNotification(err.message || "Failed to analyze code. Make sure the backend is running.");
      setTimeout(() => setErrorNotification(''), 6000);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!results) return;
    setErrorNotification('');
    try {
      await addSubmission({
        filename: fileName,
        code: results.code,
        errors: results.errors,
        warnings: results.warnings,
        score: results.score,
        status: results.status,
        issues: results.issues
      });
      setNotification("Submission successfully logged to History!");
      setTimeout(() => {
        setNotification('');
        navigate('/history');
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrorNotification("Failed to save submission. Please try again.");
      setTimeout(() => setErrorNotification(''), 6000);
    }
  };

  const handleClear = (e) => {
    if (e) e.preventDefault();
    setCode('');
    setResults(null);
    setSelectedIssueIdx(null);
    setFileName('sandbox_analysis.py');
    try {
      sessionStorage.removeItem('codepulse_checkcode_state');
    } catch {}
  };

  const currentIssue = (results && selectedIssueIdx !== null) ? results.issues[selectedIssueIdx] : null;

  return (
    <div style={{
      maxWidth: '1300px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      minHeight: 'calc(100vh - 90px)'
    }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Diagnostic Playground</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Run real-time static code checks on Python templates or upload script nodes.
          </p>
        </div>

        {notification && (
          <div style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            color: 'var(--accent-success)',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            ✓ {notification}
          </div>
        )}

        {errorNotification && (
          <div style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: 'var(--accent-danger)',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            ⚠️ {errorNotification}
          </div>
        )}
      </div>

      {/* Mode Selector Tabs */}
      <div style={{
        display: 'flex',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '4px',
        alignSelf: 'flex-start'
      }}>
        <button
          type="button"
          onClick={() => setMode('paste')}
          style={{
            padding: '8px 20px',
            borderRadius: '6px',
            border: 'none',
            background: mode === 'paste' ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: mode === 'paste' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}
        >
          Paste Code
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          style={{
            padding: '8px 20px',
            borderRadius: '6px',
            border: 'none',
            background: mode === 'upload' ? 'rgba(255,255,255,0.08)' : 'transparent',
            color: mode === 'upload' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}
        >
          Upload .py File
        </button>
      </div>

      {/* Workspace Workspace Split */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Editor or Upload Zone */}
        {mode === 'paste' ? (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '420px', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              borderBottom: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.01)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></span>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></span>
                <span style={{ marginLeft: '12px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {fileName}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                >
                  <option value="python">Python</option>
                  <option value="javascript" disabled style={{ color: 'var(--text-muted)' }}>JavaScript (Disabled)</option>
                  <option value="rust" disabled style={{ color: 'var(--text-muted)' }}>Rust (Disabled)</option>
                </select>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={executeAnalysis}
                  disabled={loading || !code.trim()}
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                >
                  Analyse Code
                </button>
              </div>
            </div>

            {/* Error Cursor Highlight Bar when an issue is selected */}
            {currentIssue && (
              <div style={{
                padding: '8px 18px',
                background: 'rgba(239, 68, 68, 0.08)',
                borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '0.8rem',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--accent-danger)', fontWeight: '700' }}>📍 ERROR CURSOR:</span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    Line <strong>{currentIssue.line}</strong>
                    {currentIssue.column ? `, Col ${currentIssue.column}` : ''}
                  </span>
                  {currentIssue.error_word && (
                    <span style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: 'var(--accent-danger)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: '700',
                      border: '1px solid rgba(239, 68, 68, 0.35)'
                    }}>
                      word: "{currentIssue.error_word}"
                    </span>
                  )}
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {currentIssue.title}
                </span>
              </div>
            )}

            {/* Input Gutter and Code Textarea */}
            <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
              {/* Line Numbers Gutter */}
              <div
                ref={lineNumbersRef}
                style={{
                  width: '50px',
                  padding: '16px 0',
                  textAlign: 'right',
                  paddingRight: '12px',
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.82rem',
                  userSelect: 'none',
                  background: 'rgba(0, 0, 0, 0.15)',
                  borderRight: '1px solid var(--border-color)',
                  overflowY: 'hidden',
                  lineHeight: '1.6'
                }}
              >
                {lineNumbers.map(n => {
                  const issueOnLine = results?.issues.find(i => i.line === n);
                  const issueIdx = results?.issues.findIndex(i => i.line === n);
                  return (
                    <div
                      key={n}
                      onClick={() => {
                        if (issueIdx !== undefined && issueIdx !== -1) {
                          setSelectedIssueIdx(issueIdx);
                        }
                      }}
                      title={issueOnLine ? `Line ${n}, Col ${issueOnLine.column || 1}: '${issueOnLine.error_word || ''}' - ${issueOnLine.title}` : `Line ${n}`}
                      style={{
                        color: issueOnLine ? issueOnLine.color : 'inherit',
                        backgroundColor: issueOnLine ? `rgba(${issueOnLine.type === 'error' ? '239, 68, 68' : '245, 158, 11'}, 0.12)` : 'transparent',
                        fontWeight: issueOnLine ? '700' : '400',
                        paddingRight: '4px',
                        cursor: issueOnLine ? 'pointer' : 'default'
                      }}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>

              {/* Text Area */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={handleScroll}
                spellCheck="false"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#d4d4d4',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.82rem',
                  padding: '16px',
                  resize: 'none',
                  overflowY: 'auto',
                  lineHeight: '1.6',
                  whiteSpace: 'pre',
                  tabSize: 4
                }}
              />
            </div>
          </div>
        ) : (
          /* Drag and Drop Zone */
          <div
            className="glass-panel"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
            style={{
              height: '350px',
              border: '2px dashed rgba(99, 102, 241, 0.35)',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'rgba(22, 30, 49, 0.4)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.35)'}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".py"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '3rem' }}>📤</div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Drag your .py file here</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                or click to browse your local device filesystem
              </p>
            </div>
            <span style={{
              fontSize: '0.7rem',
              padding: '4px 10px',
              borderRadius: '4px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'var(--text-muted)'
            }}>
              SUPPORTED: PYTHON (.py) ONLY
            </span>
          </div>
        )}

        {/* High-Tech Animated Loading State */}
        {loading && <LoadingState />}

        {/* Results Panel */}
        {results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Summary strip bar */}
            <div className="glass-panel" style={{
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>DIAGNOSTIC SNAPSHOT</span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  color: 'var(--accent-danger)',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {results.errors} Errors
                </span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(245, 158, 11, 0.12)',
                  color: 'var(--accent-warning)',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  {results.warnings} Warnings
                </span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(16, 185, 129, 0.12)',
                  color: 'var(--accent-success)',
                  fontSize: '0.75rem',
                  fontWeight: '700'
                }}>
                  Score: {results.score}% ({results.status})
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={handleClear} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                  Clear
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                  Save Submission
                </button>
              </div>
            </div>

            {/* Layout Split: Issues List and Explanation Drawer */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: results.issues.length > 0 ? '1fr 1.2fr' : '1fr',
              gap: '20px'
            }}>
              {/* Flagged issues table list */}
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  TELEMETRY WARNINGS & ERRORS DETECTED
                </h4>

                {results.issues.length === 0 ? (
                  <div style={{
                    padding: '24px',
                    textAlign: 'center',
                    color: 'var(--accent-success)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '8px'
                  }}>
                    ✓ Clean build! No compile-time diagnostics or anomalies flagged in sandbox.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedIssueIdx(idx)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.01)',
                          border: selectedIssueIdx === idx ? `1px solid ${issue.color}` : '1px solid var(--border-color)',
                          borderLeft: `4px solid ${issue.color}`,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '0.78rem' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>
                            Line {issue.line}{issue.column ? `, Col ${issue.column}` : ''} - {issue.title}
                          </strong>
                          <span style={{ color: issue.color, fontWeight: '700' }}>{issue.badge}</span>
                        </div>
                        {issue.error_word && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              fontSize: '0.72rem',
                              fontFamily: "'JetBrains Mono', monospace",
                              padding: '1px 6px',
                              borderRadius: '4px',
                              background: 'rgba(239, 68, 68, 0.12)',
                              color: 'var(--accent-danger)',
                              border: '1px solid rgba(239, 68, 68, 0.25)'
                            }}>
                              {/*  */}
                              Cursor ➔ word: "{issue.error_word}"
                            </span>
                          </div>
                        )}
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: '1.4' }}>{issue.summary}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected issue 3-tier explanation drawer */}
              {currentIssue && (
                <div className="glass-panel" style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: `rgba(${currentIssue.type === 'error' ? '239, 68, 68' : '245, 158, 11'}, 0.12)`,
                      color: currentIssue.color,
                      fontWeight: '700',
                      fontSize: '0.72rem'
                    }}>
                      L{currentIssue.line}{currentIssue.column ? `:C${currentIssue.column}` : ''} // {currentIssue.badge}
                    </span>

                    {currentIssue.error_word && (
                      <span style={{
                        fontSize: '0.74rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(239, 68, 68, 0.18)',
                        color: 'var(--accent-danger)',
                        fontWeight: '600',
                        border: '1px solid rgba(239, 68, 68, 0.35)'
                      }}>
                        Error word: "{currentIssue.error_word}"
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {currentIssue.title}
                    </h3>
                  </div>

                  {/* 3-way toggle switch */}
                  <div style={{
                    display: 'flex',
                    background: 'var(--bg-input)',
                    padding: '4px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)'
                  }}>
                    {[
                      { id: 'newbie', label: 'New to this' },
                      { id: 'comfortable', label: 'Comfortable' },
                      { id: 'facts', label: 'Just the facts' }
                    ].map(t => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setExplanationTab(t.id)}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          borderRadius: '4px',
                          border: 'none',
                          background: explanationTab === t.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                          color: explanationTab === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic description blocks */}
                  <div style={{
                    flex: 1,
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    minHeight: '120px'
                  }}>
                    {explanationTab === 'newbie' && (
                      <div>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '8px' }}>💡 Plain English Analogy:</p>
                        <p style={{ color: '#e2e8f0' }}>{currentIssue.details.newbie}</p>
                      </div>
                    )}
                    {explanationTab === 'comfortable' && (
                      <div>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '8px' }}>⚙️ Technical Scope details:</p>
                        <p style={{ color: '#e2e8f0' }}>{currentIssue.details.comfortable}</p>
                      </div>
                    )}
                    {explanationTab === 'facts' && (
                      <div>
                        <p style={{ color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '8px' }}>✅ Solution Fix:</p>
                        <pre style={{
                          background: 'rgba(0,0,0,0.3)',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '0.75rem',
                          color: 'var(--accent-success)',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {currentIssue.details.facts}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
