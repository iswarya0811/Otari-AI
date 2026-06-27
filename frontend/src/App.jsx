import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import { checkBackendStatus } from './services/api';
import { sendMessageToAI, analyzePrompt } from './services/chatService';


function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await checkBackendStatus();
        if (response && response.status === 'success') {
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }
      } catch (error) {
        setIsBackendConnected(false);
      }
    };

    fetchStatus();
  }, []);

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
    let decisionCategory = 'General';
    let decisionStrategy = 'Default';

    setMessages(prevMessages => {
      const msg = prevMessages.find(m => m.decision && m.decision.id === decisionId);
      if (msg && msg.decision) {
        decisionCategory = msg.decision.category || 'General';
        decisionStrategy = msg.decision.strategy || 'Default';
      }

      return prevMessages.map(msg => {
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
      });
    });

    // After resolving, AI sends a quick confirmation
    setIsLoading(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      let replyText = '';
      if (status === 'approved') {
        if (decisionId.startsWith('dec-route-')) {
          replyText = `Routing approved. Prompt successfully routed using the **${decisionStrategy}** strategy (Category: **${decisionCategory}**).`;
        } else {
          replyText = `Execution approved. I have initiated the command. The build completed successfully! Output bundle size: \`index-C4D9F8.js\` (142 KB). All routes are clean.`;
        }
      } else {
        if (decisionId.startsWith('dec-route-')) {
          replyText = `Routing rejected. Prompt execution was canceled.`;
        } else {
          replyText = `Command rejected. I've canceled the build execution. Let me know if we need to modify dependencies or structure first.`;
        }
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

  // Helper to map category to risk level
  const getRiskForCategory = (category) => {
    switch (category) {
      case 'Suspicious':
      case 'Sensitive':
        return 'critical';
      case 'Coding':
      case 'Long Context':
        return 'medium';
      case 'Simple':
      case 'Writing':
      default:
        return 'low';
    }
  };

  // Handle user sending a message
  const handleSendMessage = async (text) => {
    if (!text || !text.trim()) return;

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

    try {
      // Call prompt router endpoint /analyze
      const data = await analyzePrompt(text);
      const { category, strategy, reason } = data;
      
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Propose routing decision in DecisionCard
      const responseMsg = {
        id: `ai-reply-${Date.now()}`,
        sender: 'ai',
        text: `I have analyzed your prompt. Here is the proposed cost-aware routing decision:`,
        timestamp: replyTime,
        decision: {
          id: `dec-route-${Date.now()}`,
          title: `Route Prompt: ${category}`,
          description: `Targeting category "${category}" via "${strategy}" strategy.`,
          risk: getRiskForCategory(category),
          details: `Reason: ${reason}\n\n[Routing Configuration]\nCategory: ${category}\nStrategy: ${strategy}`,
          status: 'pending',
          category: category,
          strategy: strategy
        }
      };

      setMessages(prev => [...prev, responseMsg]);
    } catch (error) {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const errorMsg = {
        id: `ai-error-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ Error: ${error.message}`,
        timestamp: replyTime
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
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
          isBackendConnected={isBackendConnected}
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
