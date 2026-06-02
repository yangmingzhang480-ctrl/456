/**
 * SillyTavern-style Slash Command System
 * Adapted from ST's QuickReplies & slash commands
 */
import { useState, useCallback, useRef, useEffect } from 'react';

export interface SlashCommand {
  cmd: string;
  label: string;
  desc: string;
  action: () => string | void;
  category: 'game' | 'system' | 'chat' | 'world';
}

interface Props {
  commands: SlashCommand[];
  onExecute: (result: string) => void;
  onClose: () => void;
}

export function SlashCommandPalette({ commands, onExecute, onClose }: Props) {
  const [filter, setFilter] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter(c =>
    !filter || c.cmd.includes(filter) || c.label.includes(filter) || c.desc.includes(filter)
  );

  useEffect(() => {
    inputRef.current?.focus();
    setSelectedIdx(0);
  }, [filter]);

  const executeSelected = useCallback(() => {
    const cmd = filtered[selectedIdx];
    if (cmd) {
      const result = cmd.action();
      if (typeof result === 'string') onExecute(result);
      onClose();
    }
  }, [filtered, selectedIdx, onExecute, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'Enter') { e.preventDefault(); executeSelected(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.length - 1)); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); return; }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [executeSelected, onClose, filtered.length]);

  const catColors: Record<string, string> = {
    game: 'var(--jade)', system: 'var(--amethyst-bright)', chat: 'var(--ice-bright)', world: 'var(--accent-gold-bright)',
  };

  return (
    <div style={{
      position:'fixed',inset:0,zIndex:300,display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:'15vh',
      background:'rgba(3,2,6,0.7)',backdropFilter:'blur(3px)',
    }} onClick={onClose}>
      <div style={{
        width:520,maxWidth:'92vw',background:'linear-gradient(175deg,var(--bg-panel),var(--bg-card))',
        border:'1px solid var(--border-gold)',borderRadius:'var(--radius-lg)',
        boxShadow:'var(--shadow-xl),var(--shadow-gold)',overflow:'hidden',
      }} onClick={e => e.stopPropagation()}>
        <div style={{padding:'12px 16px',borderBottom:'1px solid var(--border-subtle)',display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontFamily:'var(--font-mono)',fontSize:16,color:'var(--accent-gold-bright)'}}>/</span>
          <input ref={inputRef} value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="输入命令…" autoFocus
            style={{flex:1,border:'none',background:'transparent',color:'var(--text-primary)',fontSize:15,fontFamily:'var(--font-sc)',outline:'none'}} />
          <span style={{fontSize:11,color:'var(--text-muted)'}}>Esc 关闭</span>
        </div>
        <div style={{maxHeight:320,overflowY:'auto'}}>
          {filtered.length === 0 ? (
            <div style={{padding:24,textAlign:'center',color:'var(--text-muted)',fontSize:13}}>未找到匹配的命令</div>
          ) : filtered.map((c, i) => (
            <div key={c.cmd} onClick={() => { const r = c.action(); if (typeof r === 'string') onExecute(r); onClose(); }}
              style={{
                padding:'10px 16px',cursor:'pointer',display:'flex',alignItems:'center',gap:12,
                background: i === selectedIdx ? 'rgba(212,175,55,0.08)' : 'transparent',
                borderLeft: i === selectedIdx ? '2px solid var(--accent-gold-bright)' : '2px solid transparent',
                transition:'all 0.1s ease',
              }}>
              <span style={{fontFamily:'var(--font-mono)',fontSize:13,color:catColors[c.category],minWidth:80}}>{c.cmd}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,color:'var(--text-primary)'}}>{c.label}</div>
                <div style={{fontSize:11,color:'var(--text-dim)',marginTop:1}}>{c.desc}</div>
              </div>
              <span style={{fontSize:10,color:catColors[c.category],padding:'1px 6px',border:`1px solid ${catColors[c.category]}22`,borderRadius:2}}>{c.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Built-in Game Commands ---- */
export function createGameCommands(): SlashCommand[] {
  return [
    { cmd: '/status', label: '查看状态', desc: '查看当前主角团所有成员的状态信息', category:'game', action:()=>'查看所有轮回者的当前状态。' },
    { cmd: '/map', label: '查看舆图', desc: '显示当前所在位置的地图信息', category:'world', action:()=>'查看玄灵界舆图，了解当前位置。' },
    { cmd: '/bag', label: '查看纳戒', desc: '查看须弥纳戒中的物品', category:'game', action:()=>'查看须弥纳戒中存放的所有法宝与丹药。' },
    { cmd: '/skills', label: '天机缘法', desc: '查看修炼功法与神通', category:'game', action:()=>'查看当前可用的功法与神通。' },
    { cmd: '/help', label: '帮助', desc: '显示所有可用命令', category:'system', action:()=>'可用命令：/status /map /bag /skills /newchat /clear /help /retry /abort' },
    { cmd: '/newchat', label: '新对话', desc: '开启一段新的因果推演', category:'chat', action:()=>'开启新的因果推演，前世记忆将保留在变量中。' },
    { cmd: '/clear', label: '清除对话', desc: '清除当前对话记录', category:'chat', action:()=>'因果长河已被清理，轮回者将重新开始对话。' },
    { cmd: '/retry', label: '重新推演', desc: '重新生成上一次天机推演', category:'chat', action:()=>'天道逆转，重新推演上一次的因果。' },
    { cmd: '/abort', label: '中止推演', desc: '中止当前正在进行的推演', category:'system', action:()=>'天道推演已中止。' },
    { cmd: '/save', label: '保存记录', desc: '将当前对话保存到轮回秘录', category:'system', action:()=>'当前因果推演已保存至轮回秘录。' },
    { cmd: '/vars', label: '查看变量', desc: '查看游戏状态变量的当前值', category:'game', action:()=>'查看当前游戏状态中的所有变量值。' },
    { cmd: '/world', label: '世界信息', desc: '查看当前世界的法则与设定', category:'world', action:()=>'查看玄灵界的法则与当前世界状态。' },
  ];
}
