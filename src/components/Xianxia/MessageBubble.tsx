import { useState } from 'react';
import type { ChatMessage } from '../../sillytavern/types';
import { useXianxia } from './XianxiaContext';

interface MessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const { jumpToFloor, rollbackTo } = useXianxia();
  const [showActions, setShowActions] = useState(false);

  if (message.role === 'system') return null;

  const isUser = message.role === 'user';
  const parsed = message.parsed;

  const displayContent = isUser
    ? message.content
    : (parsed?.maintext || message.content);

  const hasThinking = parsed?.thinking && parsed.thinking.trim().length > 0;

  return (
    <div
      className={`ink-bubble ${isUser ? 'ink-bubble--user' : 'ink-bubble--assistant'}${isStreaming ? ' ink-bubble--streaming' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isUser && hasThinking && (
        <details className="thinking-fold" open={false}>
          <summary>神识推演</summary>
          <div className="content">{parsed!.thinking}</div>
        </details>
      )}
      <div className={isStreaming ? 'streaming-cursor' : ''}>
        {displayContent}
      </div>
      {showActions && !isStreaming && !isUser && (
        <div className="bubble-actions">
          <button onClick={() => jumpToFloor(message.id)}>回溯至此</button>
          <button onClick={() => rollbackTo(message.id)}>截断后文</button>
        </div>
      )}
      {showActions && !isStreaming && isUser && (
        <div className="bubble-actions">
          <button onClick={() => rollbackTo(message.id)}>从此重演</button>
        </div>
      )}
    </div>
  );
}
