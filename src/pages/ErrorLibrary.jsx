import React, { useContext, useState } from 'react';
import { CodePulseContext } from '../context/CodePulseContext';

export default function ErrorLibrary() {
  const { errorLibrary } = useContext(CodePulseContext);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('newbie'); // newbie, comfortable, facts

  // Filter grid list
  const filtered = errorLibrary.filter(err => {
    const matchesSearch = err.name.toLowerCase().includes(search.toLowerCase()) ||
      err.description.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || err.severity === severityFilter;
    const matchesCategory = categoryFilter === 'All' || err.category === categoryFilter;

    return matchesSearch && matchesSeverity && matchesCategory;
  });

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setActiveTab('newbie'); // reset to newbie tab on open
    }
  };

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
      {/* Page Title */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Error Library</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Explore and query comprehensive breakdowns of all 15 Python syntax warnings and anomalies.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            placeholder="Search by error name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Filter Dropdowns */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Severity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Severities</option>
              <option value="Error">Errors</option>
              <option value="Warning">Warnings</option>
            </select>
          </div>

          {/* Category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Categories</option>
              <option value="Syntax">Syntax</option>
              <option value="Style">Style</option>
              <option value="Logic">Logic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Errors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            padding: '40px 0',
            fontSize: '0.85rem'
          }}>
            No error categories match your filters.
          </div>
        ) : (
          filtered.map((err) => {
            const isExpanded = expandedId === err.id;
            return (
              <div
                key={err.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'all 0.3s'
                }}
              >
                {/* Clickable header area containing labels, title, chevron, and description */}
                <div
                  onClick={() => toggleExpand(err.id)}
                  className="error-header-clickable"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        backgroundColor: err.severity === 'Error' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: err.severity === 'Error' ? 'var(--accent-danger)' : 'var(--accent-warning)'
                      }}>
                        {err.severity.toUpperCase()}
                      </span>

                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        backgroundColor: 'rgba(99, 102, 241, 0.12)',
                        color: 'var(--accent-primary)'
                      }}>
                        {err.category.toUpperCase()}
                      </span>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {err.name}
                      </h3>
                    </div>

                    {/* Interactive Animated Caret Icon */}
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>
                    {err.description}
                  </p>
                </div>

                {/* Expanded Details section */}
                {isExpanded && (
                  <div
                    className="animate-expand-details"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '20px',
                    }}
                  >
                    {/* Explanation tabs & content */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', flexWrap: 'wrap' }}>
                      {/* Left: Code comparison block */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>CODE EXAMPLES COMPILATION</span>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flexWrap: 'wrap' }}>
                          {/* Broken */}
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-danger)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>🔴 Broken Code</span>
                            <pre style={{
                              background: 'rgba(239, 68, 68, 0.03)',
                              border: '1px solid rgba(239, 68, 68, 0.15)',
                              borderRadius: '6px',
                              padding: '12px',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.75rem',
                              color: '#cbd5e1',
                              overflowX: 'auto',
                              lineHeight: '1.4'
                            }}>
                              {err.broken}
                            </pre>
                          </div>
                          {/* Fixed */}
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: '600', display: 'block', marginBottom: '6px' }}>🟢 Fixed Code</span>
                            <pre style={{
                              background: 'rgba(16, 185, 129, 0.03)',
                              border: '1px solid rgba(16, 185, 129, 0.15)',
                              borderRadius: '6px',
                              padding: '12px',
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: '0.75rem',
                              color: '#cbd5e1',
                              overflowX: 'auto',
                              lineHeight: '1.4'
                            }}>
                              {err.fixed}
                            </pre>
                          </div>
                        </div>
                      </div>

                      {/* Right: Explanation block */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* Selector */}
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
                          ].map(tab => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              style={{
                                flex: 1,
                                padding: '6px 8px',
                                borderRadius: '4px',
                                border: 'none',
                                background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                              }}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Content text */}
                        <div style={{
                          flex: 1,
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '14px',
                          fontSize: '0.8rem',
                          lineHeight: '1.5'
                        }}>
                          {activeTab === 'newbie' && <p>{err.details.newbie}</p>}
                          {activeTab === 'comfortable' && <p>{err.details.comfortable}</p>}
                          {activeTab === 'facts' && (
                            <div>
                              <p style={{ fontWeight: '600', color: 'var(--accent-success)' }}>Fix Recommendation:</p>
                              <p style={{ marginTop: '4px' }}>{err.details.facts}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
