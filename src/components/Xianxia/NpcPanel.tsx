import { useState } from 'react';
import { FAKE_NPCS } from './FakeData';
import { NpcDrawer } from './NpcDrawer';
import type { NpcData } from './FakeData';

function NpcAvatar({ npc }: { npc: NpcData }) {
  const ch = npc.name.charAt(0);
  return (
    <div className="npc-avatar">{ch}</div>
  );
}

const RELATIONSHIP_COLORS: Record<string, string> = {
  '道侣': 'background: rgba(231, 76, 96, 0.15); color: #e74c6f; border: 1px solid rgba(231, 76, 96, 0.3);',
  '发小': 'background: rgba(52, 152, 219, 0.15); color: #5dade2; border: 1px solid rgba(52, 152, 219, 0.3);',
  '宿敌': 'background: rgba(231, 76, 60, 0.15); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.3);',
  '盟友': 'background: rgba(46, 204, 113, 0.15); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.3);',
  '契约灵兽': 'background: rgba(155, 89, 182, 0.15); color: #c39bdb; border: 1px solid rgba(155, 89, 182, 0.3);',
};

export function NpcPanel() {
  const [selectedNpc, setSelectedNpc] = useState<NpcData | null>(null);

  return (
    <article id="panel-npc" className="xianxia-panel npc-panel">
      <h3 className="section-title">因果缘法</h3>
      <div className="npc-list">
        {FAKE_NPCS.map((npc) => (
          <div key={npc.id} className="npc-card" onClick={() => setSelectedNpc(npc)}>
            <NpcAvatar npc={npc} />
            <div className="npc-info">
              <div className="npc-name">{npc.name}</div>
              <div className="npc-title-text">{npc.title}</div>
              <span
                className="npc-relationship"
                style={RELATIONSHIP_COLORS[npc.relationship] ? undefined : {}}
                dangerouslySetInnerHTML={{ __html: '' }}
              />
              <span
                className="npc-relationship"
                style={{
                  ...(RELATIONSHIP_COLORS[npc.relationship]
                    ? (Object.fromEntries(
                        RELATIONSHIP_COLORS[npc.relationship]
                          .split(';')
                          .filter(Boolean)
                          .map((s) => s.split(':').map((x) => x.trim())),
                      ) as Record<string, string>)
                    : {}),
                  display: 'inline-block',
                  marginTop: 4,
                }}
              >
                {npc.relationship}
              </span>
            </div>
            <div className="npc-bars">
              <div className="npc-bar-row">
                <span className="npc-bar-label">好感</span>
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
                <span className="npc-bar-label">忠诚</span>
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
            </div>
          </div>
        ))}
      </div>
      {selectedNpc && <NpcDrawer npc={selectedNpc} onClose={() => setSelectedNpc(null)} />}
    </article>
  );
}
