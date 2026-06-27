import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

function ChatWindow({ messages, isLoading, onSendMessage, onResolveDecision, onSelectSuggestion }) {
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestions = [
    {
      title: 'Analyze codebase quality',
      desc: 'Scan files, find issues and suggest performance improvements.',
      prompt: 'Can you scan my codebase and identify any bugs or areas for optimization?'
    },
    {
      title: 'Build production bundle',
      desc: 'Runs vite build and checks output bundles.',
      prompt: 'Execute a production build and report file sizes.'
    },
    {
      title: 'Generate API endpoints',
      desc: 'Creates a mock route module in Javascript.',
      prompt: 'Generate code for an Express router mapping user data endpoints.'
    },
    {
      title: 'Add a new unit test',
      desc: 'Creates test files to cover edge cases.',
      prompt: 'Write a unit test for my custom helper functions.'
    }
  ];

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-logo">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <h2 className="empty-title">Code Smarter with Otari</h2>
            <p className="empty-desc">
              I am your agentic coding companion. I can run shell tasks, rewrite modules, and orchestrate workspace setups under your authorization. Choose a suggestion or write your own prompt below!
            </p>
            <div className="suggestions-grid">
              {suggestions.map((s, index) => (
                <div 
                  key={index} 
                  className="suggestion-card"
                  onClick={() => onSelectSuggestion(s.prompt)}
                >
                  <span className="suggestion-card-title">{s.title}</span>
                  <span className="suggestion-card-desc">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                onResolveDecision={onResolveDecision} 
              />
            ))}
          </>
        )}

        {/* Typing indicator */}
        {isLoading && (
          <div className="typing-indicator-wrapper">
            <div className="typing-bubble">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default ChatWindow;
