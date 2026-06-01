import { useState } from 'react';

export function OptionList(props: { options: string[]; disabled: boolean; onPick: (text: string) => void; }) {
  const [custom, setCustom] = useState('');
  return (
    <div className="st-options">
      {props.options.map((opt, i) => (
        <button key={i} className="st-option-btn" disabled={props.disabled} onClick={() => props.onPick(opt)}>
          [{i + 1}] {opt}
        </button>
      ))}
      <div className="st-options-free-input">
        <input
          value={custom}
          onChange={e => setCustom(e.target.value)}
          placeholder="自由输入你想做的事…"
          disabled={props.disabled}
          onKeyDown={e => {
            if (e.key === 'Enter' && custom.trim()) { props.onPick(custom.trim()); setCustom(''); }
          }}
        />
        <button
          disabled={props.disabled || !custom.trim()}
          onClick={() => { props.onPick(custom.trim()); setCustom(''); }}
        >
          发送
        </button>
      </div>
    </div>
  );
}
