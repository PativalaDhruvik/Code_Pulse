import React, { useContext, useState } from 'react';
import { CodePulseContext } from '../context/CodePulseContext';

export default function History() {
  const { submissions } = useContext(CodePulseContext);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('all'); // all, 7days, 30days
  const [selectedSub, setSelectedSub] = useState(null);

  // Apply filters
  const filtered = submissions.filter(sub => {
    const matchesSearch = sub.filename.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;

    let matchesDate = true;
    const subDateObj = new Date(sub.date.replace(' ', 'T') + ':00'); // parse date
    const now = new Date();

    if (dateFilter === '7days') {
      const diffTime = Math.abs(now - subDateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      matchesDate = diffDays <= 7;
    } else if (dateFilter === '30days') {
      const diffTime = Math.abs(now - subDateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      matchesDate = diffDays <= 30;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

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
      <div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Submission History</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Browse, filter, and review logs from past static code checking operations.
        </p>
      </div>

      {/* Filter Bar */}
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
            placeholder="Search by filename..."
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

        {/* Filters Selects */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              <option value="All">All Statuses</option>
              <option value="Improved">Improved</option>
              <option value="Needs Work">Needs Work</option>
            </select>
          </div>

          {/* Date Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Date Range:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
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
              <option value="all">All Dates</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Listing */}
      <div className="glass-panel" style={{ padding: '20px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {filtered.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            padding: '40px 0'
          }}>
            No submissions match the active filters.
          </div>
        ) : (
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px' }}>#</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Filename</th>
                  <th style={{ padding: '12px 16px' }}>Errors</th>
                  <th style={{ padding: '12px 16px' }}>Warnings</th>
                  <th style={{ padding: '12px 16px' }}>Telemetry Score</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, idx) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                      {filtered.length - idx}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{sub.date}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{sub.filename}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--accent-danger)' }}>{sub.errors}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--accent-warning)' }}>{sub.warnings}</td>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{sub.score}%</td>
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
                        onClick={() => setSelectedSub(sub)}
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
        )}
      </div>

      {/* Slide Drawer Detail Viewer Modal */}
      {selectedSub && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 1000
        }}>
          {/* Drawer Panel */}
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            height: '100%',
            borderRadius: '0px',
            borderTop: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{selectedSub.filename}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Logged: {selectedSub.date}</span>
              </div>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedSub(null)}
                style={{ padding: '6px 12px' }}
              >
                Close Drawer
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--accent-danger)',
                fontWeight: '600'
              }}>
                {selectedSub.errors} Errors
              </span>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                color: 'var(--accent-warning)',
                fontWeight: '600'
              }}>
                {selectedSub.warnings} Warnings
              </span>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.72rem',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--accent-success)',
                fontWeight: '600'
              }}>
                Score: {selectedSub.score}%
              </span>
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />

            {/* Code Box */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>SUBMITTED SOURCE</h4>
              <pre style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '16px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.78rem',
                overflowX: 'auto',
                color: '#d4d4d4',
                lineHeight: '1.5',
                maxHeight: '280px'
              }}>
                {selectedSub.code}
              </pre>
            </div>

            {/* Issues Explanations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>DETECTED COMPILER ISSUES</h4>
              {selectedSub.issues.length === 0 ? (
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-success)' }}>✓ Clean build. No diagnostic issues.</div>
              ) : (
                selectedSub.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.01)',
                      borderLeft: `4px solid ${issue.color}`,
                      border: '1px solid var(--border-color)',
                      borderLeftColor: issue.color,
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong>Line {issue.line} - {issue.title}</strong>
                      <span style={{ color: issue.color, fontWeight: '700' }}>{issue.badge}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{issue.summary}</p>
                    
                    <div style={{
                      marginTop: '10px',
                      padding: '8px 12px',
                      background: 'var(--bg-input)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      lineHeight: '1.4'
                    }}>
                      <span style={{ color: 'var(--text-muted)' }}>Explanation: </span>
                      {issue.details.newbie}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
