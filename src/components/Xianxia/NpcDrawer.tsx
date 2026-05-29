import { useCallback, useEffect } from 'react';
import type { NpcData } from './FakeData';

interface NpcDrawerProps {
  npc: NpcData;
  onClose: () => void;
}

export function NpcDrawer({ npc, onClose }: NpcDrawerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <div className="npc-drawer-overlay" onClick={onClose} />
      <aside className="npc-drawer">
        <div className="npc-drawer-header">
          <h2 className="npc-drawer-name">{npc.name}</h2>
          <button className="npc-drawer-close" onClick={onClose}>收起</button>
        </div>
        <div className="npc-drawer-field">
          <div className="npc-drawer-field-label">身份</div>
          <div className="npc-drawer-field-value">{npc.title}</div>
        </div>
        <div className="npc-drawer-field">
          <div className="npc-drawer-field-label">关系</div>
          <div className="npc-drawer-field-value">{npc.relationship}</div>
        </div>
        <div className="npc-drawer-field">
          <div className="npc-drawer-field-label">修为境界</div>
          <div className="npc-drawer-field-value">{npc.cultivationRealm}</div>
        </div>
        <div className="npc-drawer-field">
          <div className="npc-drawer-field-label">外貌描述</div>
          <div className="npc-drawer-field-value">{npc.appearance}</div>
        </div>
        <div className="npc-drawer-field">
          <div className="npc-drawer-field-label">因果往事</div>
          <div className="npc-drawer-field-value">{npc.backstory}</div>
        </div>

        <div className="npc-bar-row" style={{ marginBottom: 6 }}>
          <span className="npc-bar-label">好感度</span>
          <div className="npc-bar">
            <div
              className="npc-bar-fill"
              style={{
                width: `${npc.affinity}%`,
                background: `linear-gradient(90deg, #2ecc71, ${npc.affinity > 70 ? '#ffd700' : '#e67e22'})`,
              }}
            />
          </div>
          <span className="npc-bar-value">{npc.affinity}</span>
        </div>
        <div className="npc-bar-row">
          <span className="npc-bar-label">忠诚度</span>
          <div className="npc-bar">
            <div
              className="npc-bar-fill"
              style={{
                width: `${npc.loyalty}%`,
                background: `linear-gradient(90deg, #2ecc71, ${npc.loyalty > 70 ? '#ffd700' : '#c44'})`,
              }}
            />
          </div>
          <span className="npc-bar-value">{npc.loyalty}</span>
        </div>

        <blockquote className="npc-drawer-quote">{npc.quote}</blockquote>
      </aside>
    </>
  );
}
