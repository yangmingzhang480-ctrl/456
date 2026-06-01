import { useState } from 'react';

export function ThinkingFold({ text, mode }: { text: string; mode: 'fold' | 'hide' | 'inline' }) {
  const [open, setOpen] = useState(false);
  if (!text || mode === 'hide') return null;
  if (mode === 'inline') {
    return (
      <div className="thinking-fold">
        <div className="content">{text}</div>
      </div>
    );
  }
  return (
    <div className="thinking-fold">
      <summary onClick={() => setOpen(o => !o)} style={{ listStyle: 'none' }}>
        {open ? '▾' : '▸'} 神识推演
      </summary>
      {open && <div className="content">{text}</div>}
    </div>
  );
}
