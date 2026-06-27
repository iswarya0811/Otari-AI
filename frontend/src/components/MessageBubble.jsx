import React from 'react';
import DecisionCard from './DecisionCard';

function MessageBubble({ message, onResolveDecision }) {
  const { sender, text, timestamp, decision } = message;
  const isAi = sender === 'ai';

  // Helper to parse simple markdown formatting like code blocks and inline code
  const renderMessageContent = (content) => {
    if (!content) return null;

    // Simple code block regex parser (```code```)
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const codeLines = part.slice(3, -3).trim().split('\n');
        let language = 'javascript';
        let code = part.slice(3, -3).trim();

        if (codeLines.length > 1 && !codeLines[0].includes(' ') && codeLines[0].length < 15) {
          language = codeLines[0];
          code = codeLines.slice(1).join('\n');
        }

        return (
          <pre key={index}>
            <code className={`language-${language}`}>{code}</code>
          </pre>
        );
      } else {
        // Parse inline code elements (`code`)
        const inlineParts = part.split(/(`[^`\n]+`)/g);
        return (
          <p key={index}>
            {inlineParts.map((subPart, subIndex) => {
              if (subPart.startsWith('`') && subPart.endsWith('`')) {
                return <code key={subIndex}>{subPart.slice(1, -1)}</code>;
              }
              return subPart;
            })}
          </p>
        );
      }
    });
  };

  return (
    <div className={`message-wrapper ${sender}`}>
      <div className={`message-avatar ${sender}`}>
        {isAi ? (
          // AI Robot SVG icon
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4M8 15h.01M16 15h.01" />
          </svg>
        ) : (
          // Developer Profile SVG icon
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )}
      </div>

      <div className="message-bubble">
        <div className="message-meta">
          <span>{isAi ? 'Otari AI' : 'You'}</span>
          <span>•</span>
          <span>{timestamp}</span>
        </div>

        <div className="message-body">
          {renderMessageContent(text)}
        </div>

        {/* If message includes a decision request, render DecisionCard */}
        {isAi && decision && (
          <DecisionCard 
            id={decision.id}
            title={decision.title}
            description={decision.description}
            risk={decision.risk}
            details={decision.details}
            status={decision.status}
            onResolve={onResolveDecision}
          />
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
