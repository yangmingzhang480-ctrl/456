import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useXianxia } from './XianxiaContext';
import { MessageBubble } from './MessageBubble';
import { SlashCommandPalette, createGameCommands } from './SlashCommands';
import type { NotificationItem } from './FakeData';

interface ChatPanelProps {
  historyOpen: boolean; setHistoryOpen: (v: boolean) => void;
  addNotification: (n: Omit<NotificationItem, 'id'>) => void;
}

const QUICK_ACTIONS = [
  { id:'qa1', label:'状态', cmd:'/status', icon:'◈' },
  { id:'qa2', label:'舆图', cmd:'/map', icon:'◎' },
  { id:'qa3', label:'纳戒', cmd:'/bag', icon:'◇' },
  { id:'qa4', label:'功法', cmd:'/skills', icon:'△' },
  { id:'qa5', label:'变量', cmd:'/vars', icon:'⬡' },
  { id:'qa6', label:'新对话', cmd:'/newchat', icon:'⊹' },
  { id:'qa7', label:'重演', cmd:'/retry', icon:'⟳' },
];

export function ChatPanel({ historyOpen: _h, setHistoryOpen, addNotification }: ChatPanelProps) {
  const { activeChat, chats, streamState, sendGameMessage, regenerateLast, openSettings, openLorebooks, openPresets, openVariables, selectChat, createChat } = useXianxia();
  const [input, setInput] = useState('');
  const [showSlash, setShowSlash] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isStreaming = streamState.isStreaming;
  const [lastSum, setLastSum] = useState<string | null>(null);
  const slashCmds = useMemo(() => createGameCommands(), []);

  const lastAssistant = useMemo(() => [...(activeChat?.messages ?? [])].reverse().find(m => m.role === 'assistant'), [activeChat]);

  useEffect(() => {
    const sum = isStreaming ? streamState.sum : (lastAssistant?.parsed?.sum ?? null);
    if (!isStreaming && sum && sum !== lastSum) { setLastSum(sum); addNotification({ type:'divine', title:'天机感悟', message:sum, duration:5000 }); }
  }, [isStreaming, streamState.sum, lastAssistant?.parsed?.sum, lastSum, addNotification]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }); }, [activeChat?.messages?.length, streamState.maintext]);

  const display = isStreaming ? streamState : { thinking: lastAssistant?.parsed?.thinking ?? '', maintext: lastAssistant?.parsed?.maintext ?? lastAssistant?.content ?? '', options: lastAssistant?.parsed?.options ?? [], sum: lastAssistant?.parsed?.sum ?? '' };

  const handleSubmit = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim(); if (!msg || isStreaming) return; setInput(''); setShowSlash(false);
    if (!activeChat) await createChat('天机推演');
    try { await sendGameMessage(msg); } catch { addNotification({ type:'warning', title:'天道阻隔', message:'API 连接失败，请检查天道法则中的设置。' }); }
  }, [input, isStreaming, activeChat, createChat, sendGameMessage, addNotification]);

  const handleOptionPick = useCallback(async (text: string) => {
    if (isStreaming) return; if (!activeChat) await createChat('天机推演');
    try { await sendGameMessage(text); } catch { addNotification({ type:'warning', title:'天道阻隔', message:'API 连接失败。' }); }
  }, [isStreaming, activeChat, createChat, sendGameMessage, addNotification]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value; setInput(v);
    if (v === '/') setShowSlash(true);
    else if (showSlash && !v.startsWith('/')) setShowSlash(false);
  }, [showSlash]);

  const handleSlashResult = useCallback((result: string) => { setInput(result); setShowSlash(false); inputRef.current?.focus(); }, []);
  const handleNewChat = useCallback(async () => { await createChat('天机推演'); setLastSum(null); }, [createChat]);

  const handleQuickAction = useCallback((cmd: string) => {
    if (cmd === '/newchat') { handleNewChat(); return; }
    if (cmd === '/retry') { setLastSum(null); regenerateLast(); return; }
    setInput(cmd); inputRef.current?.focus();
  }, [handleNewChat, regenerateLast]);

  return (
    <div className="xianxia-panel chat-panel" style={{ display:'flex',flexDirection:'column',height:'calc(100vh - 72px)' }}>
      {/* Header toolbar */}
      <header className="chat-header" style={{ display:'flex',gap:8,alignItems:'center',padding:'8px 0 12px',borderBottom:'1px solid var(--border-subtle)',marginBottom:4,flexWrap:'wrap' }}>
        <select id="chat-selector" value={activeChat?.id ?? ''} onChange={e => e.target.value && selectChat(e.target.value)}
          style={{ minWidth:180,padding:'6px 10px',fontSize:13,background:'var(--bg-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-md)',color:'var(--text-primary)',fontFamily:'var(--font-sc)' }}>
          {chats.length === 0 && <option value="">尚无对话</option>}
          {chats.map(c => <option key={c.id} value={c.id}>{c.name} ({c.messages.length})</option>)}
        </select>
        <button id="btn-new-chat" className="btn-premium btn-premium--primary" onClick={handleNewChat} style={{fontSize:12}}>新对话</button>
        <div style={{ flex:1 }} />
        <button id="btn-open-lorebooks" className="btn-premium" onClick={openLorebooks} style={{fontSize:12}}>世界书</button>
        <button id="btn-open-presets" className="btn-premium" onClick={openPresets} style={{fontSize:12}}>预设</button>
        <button id="btn-open-vars" className="btn-premium" onClick={openVariables} style={{fontSize:12}}>变量</button>
        <button id="btn-open-settings" className="btn-premium" onClick={openSettings} style={{fontSize:12}}>设置</button>
        <button id="btn-open-history" className="btn-premium" onClick={() => setHistoryOpen(true)} style={{fontSize:12}}>历史</button>
        <button id="btn-regenerate" className="btn-premium" onClick={() => { setLastSum(null); regenerateLast(); }} disabled={!lastAssistant || isStreaming} style={{fontSize:12}}>重演</button>
      </header>

      {/* Quick action bar */}
      <div style={{ display:'flex',gap:4,padding:'4px 0 8px',flexWrap:'wrap' }}>
        {QUICK_ACTIONS.map(qa => (
          <button key={qa.id} id={`qa-${qa.id}`} className="btn-premium" style={{fontSize:11,padding:'4px 10px',gap:4}}
            onClick={() => handleQuickAction(qa.cmd)} title={qa.cmd}>
            <span style={{fontSize:13}}>{qa.icon}</span> {qa.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="chat-messages" style={{ flex:1,overflowY:'auto',padding:'12px 0' }}>
        {(!activeChat || activeChat.messages.length === 0) && !isStreaming && (
          <div className="chat-empty">叩问天机，感应因果…<br/><span style={{fontSize:12,opacity:0.5}}>输入 / 唤出天机命令</span></div>
        )}
        {activeChat?.messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        {isStreaming && streamState.maintext && (
          <MessageBubble message={{ id:'streaming',role:'assistant',content:streamState.maintext,timestamp:Date.now(),parsed:{ thinking:streamState.thinking,maintext:streamState.maintext,options:[],sum:'',varsRaw:'',varsCommands:{merge:{}},unknown:{} } }} isStreaming />
        )}
        {isStreaming && (
          <div className="streaming-premium"><div className="streaming-premium-dot" /><div className="streaming-premium-dot" /><div className="streaming-premium-dot" /><span style={{marginLeft:8,fontSize:12,color:'var(--text-dim)'}}>天道推演中…</span></div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Options */}
      {display.options && display.options.length > 0 && !isStreaming && (
        <div className="chat-premium-options">
          {display.options.map((opt: string, i: number) => (
            <button key={i} className="chat-premium-option-btn" onClick={() => handleOptionPick(opt)}>[{i + 1}] {opt}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-area" style={{padding:'12px 0',borderTop:'1px solid var(--border-subtle)'}}>
        <div style={{flex:1,position:'relative'}}>
          <textarea ref={inputRef} id="input-llm-chat" className="chat-input" value={input}
            onChange={handleInputChange}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
              if (e.key === 'Escape' && showSlash) { setShowSlash(false); e.preventDefault(); }
            }}
            disabled={isStreaming} placeholder="叩问天机…（Enter 发送 / / 唤出命令）" rows={2} />
        </div>
        <button id="btn-submit-divine" className="btn-premium btn-premium--primary" onClick={() => handleSubmit()} disabled={isStreaming || !input.trim()}>叩问天机</button>
      </div>

      {/* Slash command palette */}
      {showSlash && <SlashCommandPalette commands={slashCmds} onExecute={handleSlashResult} onClose={() => setShowSlash(false)} />}
    </div>
  );
}
