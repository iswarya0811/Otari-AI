import React, { useState } from 'react';

function DecisionCard({ 
  id, 
  title = 'Requested Action', 
  description = 'Otari wants to run an operation.', 
  risk = 'medium', // 'low' | 'medium' | 'critical'
  details = '', 
  status = 'pending', // 'pending' | 'approved' | 'rejected'
  onResolve 
}) {
  const [localStatus, setLocalStatus] = useState(status);

  const handleAction = (choice) => {
    setLocalStatus(choice);
    if (onResolve) {
      onResolve(id, choice);
    }
  };

  // Render status badge type
  const getRiskBadge = () => {
    switch (risk.toLowerCase()) {
      case 'critical':
        return <span className="decision-badge critical">Critical Risk</span>;
      case 'low':
        return <span className="decision-badge low">Low Risk</span>;
      case 'medium':
      default:
        return <span className="decision-badge medium">Medium Risk</span>;
    }
  };

  return (
    <div className="decision-container">
      <div className="decision-card">
        <div className="decision-header">
          <span className="decision-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {title}
          </span>
          {getRiskBadge()}
        </div>

        <p className="decision-desc">{description}</p>

        {details && (
          <div className="decision-code-diff">
            {details}
          </div>
        )}

        {localStatus === 'pending' ? (
          <div className="decision-actions">
            <button 
              className="decision-btn decision-btn-reject" 
              onClick={() => handleAction('rejected')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Reject
            </button>
            <button 
              className="decision-btn decision-btn-approve" 
              onClick={() => handleAction('approved')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Approve Execution
            </button>
          </div>
        ) : (
          <div className={`decision-status-box ${localStatus}`}>
            {localStatus === 'approved' ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span><strong>Action Approved:</strong> Task is executing in the background.</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span><strong>Action Rejected:</strong> Execution was canceled by developer.</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DecisionCard;
