import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useXianxia } from './XianxiaContext';
import { MessageBubble } from './MessageBubble';
import type { NotificationItem } from './FakeData';

interface ChatPanelProps {
  historyOpen: boolean;
  setHistoryOpen: (v: boolean) => void;
  addNotification: (n: Omit<NotificationItem, 'id'>) => void;
}

export function ChatPanel({ historyOpen: _historyOpen, setHistoryOpen, addNotification }: ChatPanelProps) {
  const {
    activeChat, chats, streamState, sendGameMessage,
    regenerateLast, openSettings, openLorebooks, openPresets, openVariables,
    selectChat, createChat,
  } = useXianxia();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isStreaming = streamState.isStreaming;
  const [lastSum, setLastSum] = useState<string | null>(null);

  const lastAssistant = useMemo(
    () => [...(activeChat?.messages ?? [])].reverse().find(m => m.role === 'assistant'),
    [activeChat],
  );

  useEffect(() => {
    const sum = isStreaming ? streamState.sum : (lastAssistant?.parsed?.sum ?? null);
    if (!isStreaming && sum && sum !== lastSum) {
      setLastSum(sum);
      addNotification({
        type: 'divine',
        title: '天机感悟',
        message: sum,
        duration: 5000,
      });
    }
  }, [isStreaming, streamState.sum, lastAssistant?.parsed?.sum, lastSum, addNotification]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length, streamState.maintext]);

  const display = isStreaming
    ? streamState
    : {
        thinking: lastAssistant?.parsed?.thinking ?? '',
        maintext: lastAssistant?.parsed?.maintext ?? lastAssistant?.content ?? '',
        options: lastAssistant?.parsed?.options ?? [],
        sum: lastAssistant?.parsed?.sum ?? '',
      };

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isStreaming) return;
    const text = input.trim();
    setInput('');
    if (!activeChat) {
      await createChat('天机推演');
    }
    try {
      await sendGameMessage(text);
    } catch {
      addNotification({ type: 'warning', title: '天道阻隔', message: 'API 连接失败，请检查天道法则中的设置。' });
    }
  }, [input, isStreaming, activeChat, createChat, sendGameMessage, addNotification]);

  const handleOptionPick = useCallback(async (text: string) => {
    if (isStreaming) return;
    if (!activeChat) {
      await createChat('天机推演');
    }
    try {
      await sendGameMessage(text);
    } catch {
      addNotification({ type: 'warning', title: '天道阻隔', message: 'API 连接失败，请检查天道法则中的设置。' });
    }
  }, [isStreaming, activeChat, createChat, sendGameMessage, addNotification]);

  const handleNewChat = useCallback(async () => {
    await createChat('天机推演');
    setLastSum(null);
  }, [createChat]);

  return (
    <div className="xianxia-panel chat-panel">
      <header className="chat-header">
        <select
          id="chat-selector"
          value={activeChat?.id ?? ''}
          onChange={(e) => e.target.value && selectChat(e.target.value)}
          style={{ minWidth: 200, padding: '6px 10px', fontSize: 13 }}
        >
          {chats.length === 0 && <option value="">尚无对话</option>}
          {chats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.messages.length} 条消息)
            </option>
          ))}
        </select>
        <button id="btn-new-chat" onClick={handleNewChat}>新对话</button>
        <div style={{ flex: 1 }} />
        <button id="btn-open-settings" onClick={openSettings}>天道法则</button>
        <button id="btn-open-lorebooks" onClick={openLorebooks}>世界书</button>
        <button id="btn-open-presets" onClick={openPresets}>预设</button>
        <button id="btn-open-variables" onClick={openVariables}>变量</button>
        <button id="btn-open-history" onClick={() => setHistoryOpen(true)}>历史</button>
        <button
          id="btn-regenerate"
          onClick={() => { setLastSum(null); regenerateLast(); }}
          disabled={!lastAssistant || isStreaming}
        >
          重演
        </button>
      </header>

      <div className="chat-messages">
        {(!activeChat || activeChat.messages.length === 0) && !isStreaming && (
          <div className="chat-empty">叩问天机，感应因果…</div>
        )}
        {activeChat?.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isStreaming && streamState.maintext && (
          <MessageBubble
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamState.maintext,
              timestamp: Date.now(),
              parsed: { thinking: streamState.thinking, maintext: streamState.maintext, options: [], sum: '', varsRaw: '', varsCommands: { merge: {} }, unknown: {} },
            }}
            isStreaming
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {display.options && display.options.length > 0 && !isStreaming && (
        <div className="chat-options">
          {display.options.map((opt, i) => (
            <button
              key={i}
              className="option-button"
              onClick={() => handleOptionPick(opt)}
            >
              [{i + 1}] {opt}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input-area">
        <div className="divine-input-wrapper">
          <textarea
            id="input-llm-chat"
            className="divine-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isStreaming}
            placeholder="叩问天机…"
            rows={2}
          />
          <button
            id="btn-submit-divine"
            className="divine-submit"
            onClick={handleSubmit}
            disabled={isStreaming || !input.trim()}
          >
            叩问天机
          </button>
        </div>
      </div>
    </div>
  );
}
