import React from 'react';

function Navbar({ onToggleSidebar, onClearChat, activeTab }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        {/* Toggle Sidebar Button (Mobile only) */}
        <button className="menu-toggle" onClick={onToggleSidebar} aria-label="Toggle Navigation Sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px' }}>
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="navbar-title-container">
          <span className="navbar-title">
            {activeTab === 'chat' && 'AI Assistant'}
            {activeTab === 'dashboard' && 'Analytics Dashboard'}
            {activeTab === 'settings' && 'Workspace Settings'}
          </span>
          <div className="status-badge">
            <span className="status-dot" />
            <span>Online</span>
          </div>
        </div>
      </div>

      <div className="navbar-actions">
        {activeTab === 'chat' && (
          <button className="nav-btn" onClick={onClearChat} title="Clear conversation history">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px' }}>
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>Reset Chat</span>
          </button>
        )}
        <button className="nav-btn nav-btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px' }}>
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span>Share</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
