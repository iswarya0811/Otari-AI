import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-populate chat with demo messages to show off UI features (including Decision Card)
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'ai',
      text: 'Hello! I am Otari, your AI development assistant. I am linked to your workspace and ready to automate tasks, scan files, and manage your local builds.\n\nI noticed that your project has some uncompiled components. Would you like me to run a test compilation?',
      timestamp: '3:50 PM',
      decision: {
        id: 'dec-demo',
        title: 'Run Compile Check',
        description: 'Otari wants to run `npm run build` in the frontend directory to verify that all React functional components compile without syntax or bundle errors.',
        risk: 'low',
        details: '$ npm run build\n\n> frontend@0.0.0 build\n> vite build\n\nvite v8.1.0 building for production...\n✓ 32 modules transformed.',
        status: 'pending'
      }
    }
  ]);

  // Settings states
  const [autonomy, setAutonomy] = useState('semi');
  const [theme, setTheme] = useState('firefox-dark');
  const [analytics, setAnalytics] = useState(true);

  // Clear chat handler
  const handleClearChat = () => {
    setMessages([]);
  };

  // Toggle mobile drawer
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Resolve a decision card's choice
  const handleResolveDecision = (decisionId, status) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.decision && msg.decision.id === decisionId) {
          return {
            ...msg,
            decision: {
              ...msg.decision,
              status: status
            }
          };
        }
        return msg;
      })
    );

    // After resolving, AI sends a quick confirmation
    setIsLoading(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      let replyText = '';
      if (status === 'approved') {
        replyText = `Execution approved. I have initiated the command. The build completed successfully! Output bundle size: \`index-C4D9F8.js\` (142 KB). All routes are clean.`;
      } else {
        replyText = `Command rejected. I've canceled the build execution. Let me know if we need to modify dependencies or structure first.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai-reply-res-${Date.now()}`,
          sender: 'ai',
          text: replyText,
          timestamp: timeStr
        }
      ]);
      setIsLoading(false);
    }, 1200);
  };

  // Handle user sending a message
  const handleSendMessage = (text) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    const userMsg = {
      id: `user-msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: timeStr
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Simulate AI response response
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let responseMsg = {
        id: `ai-reply-${Date.now()}`,
        sender: 'ai',
        timestamp: replyTime
      };

      const lowerText = text.toLowerCase();

      if (lowerText.includes('scan') || lowerText.includes('analyze') || lowerText.includes('bug')) {
        responseMsg.text = `I have scanned \`src/components/\` and detected a formatting discrepancy in \`Navbar.jsx\`. Specifically, some custom icon padding values do not match your global theme tokens.\n\nI can execute a refactoring script to align all components to the new Mozilla design tokens. Shall we proceed?`;
        responseMsg.decision = {
          id: `dec-refactor-${Date.now()}`,
          title: 'Apply Token Refactor',
          description: 'Otari will run a local AST modification script to rewrite inline style bindings in Sidebar.jsx and Navbar.jsx to use CSS variables.',
          risk: 'medium',
          details: `// src/components/Navbar.jsx\n- style={{ width: '15px', height: '15px' }}\n+ className="nav-icon-sm"\n\n// src/index.css\n+ .nav-icon-sm {\n+   width: var(--icon-size-sm, 15px);\n+   height: var(--icon-size-sm, 15px);\n+ }`,
          status: 'pending'
        };
      } else if (lowerText.includes('build') || lowerText.includes('compile') || lowerText.includes('production')) {
        responseMsg.text = `Understood. I will run a production build bundle assessment to check code splitting efficiency and tree shaking optimization.`;
        responseMsg.decision = {
          id: `dec-build-${Date.now()}`,
          title: 'Run production build',
          description: 'Orchestrates frontend production compiling using vite to inspect package bundles.',
          risk: 'low',
          details: `$ npm run build\n\nvite v8.1.0 building for production...\n✓ 32 modules transformed.\ndist/index.html                  0.36 kB │ gzip: 0.25 kB\ndist/assets/index-C4D9F8.js    142.12 kB │ gzip: 44.52 kB\ndist/assets/index-B5A10A.css    12.45 kB │ gzip:  3.20 kB`,
          status: 'pending'
        };
      } else if (lowerText.includes('api') || lowerText.includes('endpoint') || lowerText.includes('express')) {
        responseMsg.text = `Here is a custom Express API endpoint mapping router that you can insert into your backend server configuration to retrieve user profile data:\n\n\`\`\`javascript\nconst express = require('express');\nconst router = express.Router();\n\n// GET /api/user/profile\nrouter.get('/profile', (req, res) => {\n  res.json({\n    username: 'guest_dev',\n    role: 'Hackathon Contributor',\n    status: 'online',\n    registeredAt: '2026-06-27T10:00:00Z'\n  });\n});\n\nmodule.exports = router;\n\`\`\`\n\nLet me know if you would like me to generate a script to create this backend file.`;
      } else if (lowerText.includes('test') || lowerText.includes('unit')) {
        responseMsg.text = `I have written a Jest/Vitest unit test module for your decision card selection handler to guarantee that approve and reject callbacks dispatch state changes correctly.`;
        responseMsg.decision = {
          id: `dec-test-${Date.now()}`,
          title: 'Write DecisionCard.test.jsx',
          description: 'Otari wants to create a unit test file `src/components/__tests__/DecisionCard.test.jsx` containing Mock interactions.',
          risk: 'low',
          details: `import { render, screen, fireEvent } from '@testing-library/react';\nimport DecisionCard from '../DecisionCard';\n\ntest('calls onResolve with approved when approve clicked', () => {\n  const handler = jest.fn();\n  render(<DecisionCard id="t1" onResolve={handler} />);\n  fireEvent.click(screen.getByText('Approve Execution'));\n  expect(handler).toHaveBeenCalledWith('t1', 'approved');\n});`,
          status: 'pending'
        };
      } else {
        responseMsg.text = `I've received your prompt: "${text}". As a local development agent, I can analyze your workspace structure, create code templates, and run compiler checks.\n\nTry asking me to "scan the codebase for bugs", "run a compilation check", or "write a unit test" to see my developer decision flows in action!`;
      }

      setMessages(prev => [...prev, responseMsg]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSelectSuggestion = (promptText) => {
    handleSendMessage(promptText);
  };

  // Render Dashboard subview
  const renderDashboard = () => (
    <div className="dashboard-view">
      <div>
        <h1 className="dashboard-title">Agent Diagnostics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time statistics of Otari AI autonomous execution rates.</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <span className="stat-label">Tasks Executed</span>
          <span className="stat-value">24</span>
          <span className="stat-trend">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            +12% this week
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Autonomy Approval Rate</span>
          <span className="stat-value">92.4%</span>
          <span className="stat-trend">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            +2.1% approval
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Build Time</span>
          <span className="stat-value">1.8s</span>
          <span className="stat-trend" style={{ color: '#ff453a' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px' }}>
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
              <polyline points="17 18 23 18 23 12" />
            </svg>
            -0.3s runtime
          </span>
        </div>
      </div>

      <div className="dashboard-chart-placeholder">
        <div className="chart-header">
          <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>Weekly Activity (Approved Executions)</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>June 2026</span>
        </div>
        <div className="chart-bars">
          {[
            { label: 'Mon', height: '40%' },
            { label: 'Tue', height: '65%' },
            { label: 'Wed', height: '25%' },
            { label: 'Thu', height: '85%' },
            { label: 'Fri', height: '95%' },
            { label: 'Sat', height: '50%' },
            { label: 'Sun', height: '10%' }
          ].map((bar, i) => (
            <div key={i} className="chart-bar-wrapper">
              <div className="chart-bar" style={{ height: bar.height }} />
              <span className="chart-bar-label">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Settings subview
  const renderSettings = () => (
    <div className="settings-view">
      <div className="settings-section">
        <h2 className="settings-section-title">Agent Settings</h2>
        
        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">Execution Autonomy</span>
            <span className="settings-desc">Choose when Otari is allowed to run shell commands automatically.</span>
          </div>
          <select 
            className="settings-control" 
            value={autonomy}
            onChange={(e) => setAutonomy(e.target.value)}
          >
            <option value="none">Manual Approval Only</option>
            <option value="semi">Semi-Autonomous (Confirm high-risk)</option>
            <option value="full">Fully Autonomous (Not recommended)</option>
          </select>
        </div>

        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">Telemetry & Analytics</span>
            <span className="settings-desc">Report execution benchmarks locally to the agent diagnostics tab.</span>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={analytics} 
              onChange={() => setAnalytics(!analytics)}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2 className="settings-section-title">Theme Customization</h2>

        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">UI Interface Theme</span>
            <span className="settings-desc">Choose between official branding styles.</span>
          </div>
          <select 
            className="settings-control"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="firefox-dark">Mozilla Deep Dark (Default)</option>
            <option value="aurora-purple">Mozilla Developer Edition (Purple)</option>
            <option value="high-contrast">High Contrast OLED Black</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      {/* Main Panel */}
      <main className="main-content">
        <Navbar 
          onToggleSidebar={handleToggleSidebar} 
          onClearChat={handleClearChat}
          activeTab={activeTab}
        />

        {/* Tab Router views */}
        {activeTab === 'chat' && (
          <ChatWindow 
            messages={messages} 
            isLoading={isLoading} 
            onSendMessage={handleSendMessage} 
            onResolveDecision={handleResolveDecision}
            onSelectSuggestion={handleSelectSuggestion}
          />
        )}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'settings' && renderSettings()}
      </main>
    </div>
  );
}

export default App;
