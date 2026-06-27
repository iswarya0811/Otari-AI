import React, { useState, useRef, useEffect } from 'react';

function ChatInput({ onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize height of textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight - 6, 200)}px`;
    }
  }, [input]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    // Send message on Enter without shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSend} className="input-box-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Ask Otari AI to generate files, run tests, or configure scripts..."
          rows="1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!input.trim() || isLoading}
          title="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
      <div className="input-subtext">
        Otari AI can run commands, edit files, and build projects. Executions require developer approval.
      </div>
    </div>
  );
}

export default ChatInput;
