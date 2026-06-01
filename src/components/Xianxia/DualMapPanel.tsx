import { useState, useCallback } from 'react';

/* ---- World Data Types ---- */
export interface RealmNode { id: string; name: string; x: number; y: number; desc: string; connections: string[]; corrupted: boolean; }
export interface SceneLocation { id: string; name: string; x: number; y: number; type: 'city' | 'rift' | 'ruin' | 'danger' | 'sacred'; desc: string; }
export interface CharPosition { realmId?: string; sx: number; sy: number; }

interface Props {
  realms: RealmNode[];
  scenes: SceneLocation[];
  charPositions: Record<string, CharPosition>;
  characters: Array<{ id: string; name: string; tokenColor: string; realm?: string }>;
  onRealmClick: (id: string) => void;
  onSceneClick: (id: string) => void;
  onCharClick: (id: string) => void;
}

const W = 800, H = 500;

/* SVG marker generators — premium cultivation glyphs */
const Marker = {
  city: (x: number, y: number, name: string, id: string, onClick: (id: string) => void, onHover: (e: React.MouseEvent, name: string, desc: string) => void, onLeave: () => void, desc: string) => (
    <g key={id} transform={`translate(${x},${y})`} cursor="pointer"
      onMouseEnter={e => onHover(e, name, desc)} onMouseLeave={onLeave} onClick={() => onClick(id)}>
      <rect x="-17" y="-17" width="34" height="34" rx="3" fill="rgba(212,175,55,0.06)" stroke="#d4af37" strokeWidth="1.5"/>
      <rect x="-11" y="-11" width="22" height="22" rx="1" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="0.8"/>
      <line x1="-16" y1="-8" x2="16" y2="-8" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5"/>
      <line x1="-16" y1="0" x2="16" y2="0" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5"/>
      <line x1="-16" y1="8" x2="16" y2="8" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5"/>
      <circle cx="0" cy="0" r="3.5" fill="rgba(212,175,55,0.25)" stroke="#d4af37" strokeWidth="1.2"/>
      <text y="30" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="11" fill="#d4c5a9">{name}</text>
    </g>
  ),
  rift: (x: number, y: number, name: string, id: string, onClick: (id: string) => void, onHover: (e: React.MouseEvent, name: string, desc: string) => void, onLeave: () => void, desc: string) => (
    <g key={id} transform={`translate(${x},${y})`} cursor="pointer"
      onMouseEnter={e => onHover(e, name, desc)} onMouseLeave={onLeave} onClick={() => onClick(id)}>
      <polygon points="0,-20 18,-6 12,16 -12,16 -18,-6" fill="rgba(139,0,0,0.1)" stroke="#8b0000" strokeWidth="1.5"/>
      <polygon points="0,-12 10,-3 7,9 -7,9 -10,-3" fill="rgba(192,57,43,0.08)" stroke="rgba(192,57,43,0.3)" strokeWidth="0.8"/>
      <line x1="-6" y1="0" x2="6" y2="0" stroke="#c0392b" strokeWidth="1" opacity="0.6"/>
      <line x1="0" y1="-6" x2="0" y2="6" stroke="#c0392b" strokeWidth="1" opacity="0.6"/>
      <text y="32" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="11" fill="#c0392b">{name}</text>
    </g>
  ),
  ruin: (x: number, y: number, name: string, id: string, onClick: (id: string) => void, onHover: (e: React.MouseEvent, name: string, desc: string) => void, onLeave: () => void, desc: string) => (
    <g key={id} transform={`translate(${x},${y})`} cursor="pointer"
      onMouseEnter={e => onHover(e, name, desc)} onMouseLeave={onLeave} onClick={() => onClick(id)}>
      <circle r="16" fill="rgba(140,120,70,0.06)" stroke="#9d8f7a" strokeWidth="1.5" strokeDasharray="4 2.5"/>
      <circle r="8" fill="none" stroke="rgba(157,143,122,0.3)" strokeWidth="0.8"/>
      <circle cx="0" cy="0" r="2.5" fill="rgba(157,143,122,0.3)"/>
      <text y="30" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="11" fill="#9d8f7a">{name}</text>
    </g>
  ),
  danger: (x: number, y: number, name: string, id: string, onClick: (id: string) => void, onHover: (e: React.MouseEvent, name: string, desc: string) => void, onLeave: () => void, desc: string) => (
    <g key={id} transform={`translate(${x},${y})`} cursor="pointer"
      onMouseEnter={e => onHover(e, name, desc)} onMouseLeave={onLeave} onClick={() => onClick(id)}>
      <polygon points="0,-19 17,-7 13,17 -13,17 -17,-7" fill="rgba(192,57,43,0.06)" stroke="#c0392b" strokeWidth="1.5"/>
      <polygon points="0,-10 10,-3 8,10 -8,10 -10,-3" fill="rgba(192,57,43,0.04)" stroke="rgba(192,57,43,0.25)" strokeWidth="0.7"/>
      <text y="5" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="11" fontWeight="700" fill="#c0392b">危</text>
      <text y="32" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="11" fill="#c0392b">{name}</text>
    </g>
  ),
  sacred: (x: number, y: number, name: string, id: string, onClick: (id: string) => void, onHover: (e: React.MouseEvent, name: string, desc: string) => void, onLeave: () => void, desc: string) => (
    <g key={id} transform={`translate(${x},${y})`} cursor="pointer"
      onMouseEnter={e => onHover(e, name, desc)} onMouseLeave={onLeave} onClick={() => onClick(id)}>
      <circle r="16" fill="rgba(46,204,113,0.04)" stroke="#2ecc71" strokeWidth="1.5"/>
      <circle r="10" fill="none" stroke="rgba(46,204,113,0.2)" strokeWidth="0.7"/>
      <circle r="4" stroke="none" fill="rgba(46,204,113,0.15)"/>
      <line x1={-19} y1={0} x2={19} y2={0} stroke="rgba(46,204,113,0.1)" strokeWidth={0.5}/>
      <line x1={0} y1={-19} x2={0} y2={19} stroke="rgba(46,204,113,0.1)" strokeWidth={0.5}/>
      <text y="30" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="11" fill="#2ecc71">{name}</text>
    </g>
  ),
};

const TOKEN_COLORS: Record<string, string> = { gold: '#d4af37', ice: '#4da6ff', jade: '#2ecc71', amethyst: '#9b6dff' };

export function DualMapPanel({ realms, scenes, charPositions, characters, onRealmClick, onSceneClick, onCharClick }: Props) {
  const [mode, setMode] = useState<'macro' | 'micro'>('macro');
  const [tooltip, setTooltip] = useState<{ x: number; y: number; title: string; desc: string } | null>(null);

  const showTip = useCallback((e: React.MouseEvent, title: string, desc: string) => {
    const rect = (e.currentTarget as SVGElement).closest('.map-premium-stage')?.getBoundingClientRect();
    setTooltip({ x: e.clientX - (rect?.left ?? 0) + 18, y: e.clientY - (rect?.top ?? 0) - 60, title, desc });
  }, []);
  const hideTip = useCallback(() => setTooltip(null), []);

  return (
    <section className="xianxia-panel" aria-label="玄灵双轨舆图">
      <header className="panel-header">
        <h1 className="panel-title"><span className="panel-title-decoration" />玄灵双轨舆图</h1>
        <p className="panel-subtitle">大千界域观诸天 · 现世战略察秋毫</p>
      </header>

      <div className="map-premium-container">
        <div className="map-premium-toolbar">
          <button id="map-btn-macro" className={`map-premium-btn${mode === 'macro' ? ' map-premium-btn--active' : ''}`} onClick={() => setMode('macro')}>大千界域图</button>
          <button id="map-btn-micro" className={`map-premium-btn${mode === 'micro' ? ' map-premium-btn--active' : ''}`} onClick={() => setMode('micro')}>现世战略图</button>
        </div>
        <div className="map-premium-stage">
          <svg viewBox={`0 0 ${W} ${H}`} className="map-premium-svg">
            {mode === 'macro' ? (
              <>
                <defs>
                  <radialGradient id="corr-grad" cx="48%" cy="42%">
                    <stop offset="0%" stopColor="rgba(139,0,0,0.1)"/><stop offset="100%" stopColor="transparent"/>
                  </radialGradient>
                </defs>
                <rect width={W} height={H} fill="url(#corr-grad)"/>
                {/* Ley lines */}
                {realms.flatMap(r => r.connections.map(cid => {
                  const t = realms.find(x => x.id === cid); if (!t) return null;
                  return <line key={`${r.id}-${cid}`} x1={r.x/100*W} y1={r.y/100*H} x2={t.x/100*W} y2={t.y/100*H} className="ley-line-premium"/>;
                }))}
                {/* Realm nodes */}
                {realms.map(r => (
                  <g key={r.id} transform={`translate(${r.x/100*W},${r.y/100*H})`}
                    className={`realm-node-premium${r.corrupted ? ' realm-node-premium--corrupted' : ''}`}
                    onMouseEnter={e => showTip(e, r.name, r.desc)} onMouseLeave={hideTip}
                    onClick={() => onRealmClick(r.id)}>
                    {r.corrupted
                      ? <polygon points="0,-24 22,-8 14,20 -14,20 -22,-8" fill="rgba(139,0,0,0.12)" stroke="#8b0000" strokeWidth="1.5"/>
                      : <polygon points="0,-24 22,-8 14,20 -14,20 -22,-8" fill="rgba(212,175,55,0.06)" stroke="#d4af37" strokeWidth="1.5"/>
                    }
                    <text y="6" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="12" fill="var(--text-primary)">{r.name}</text>
                  </g>
                ))}
                {/* Character tokens on macro */}
                {Object.entries(charPositions).map(([cid, pos]) => {
                  if (!pos.realmId) return null;
                  const ch = characters.find(c => c.id === cid); if (!ch) return null;
                  const realm = realms.find(r => r.id === pos.realmId); if (!realm) return null;
                  const offs: Record<string, [number, number]> = { luxingyao: [-24,-24], limingyuan: [18,-20], yexilan: [22,18], chulingshuang: [-20,20] };
                  const [ox, oy] = offs[cid] || [0,0];
                  const tc = TOKEN_COLORS[ch.tokenColor] || '#d4af37';
                  return (
                    <g key={`t-${cid}`} transform={`translate(${realm.x/100*W + ox},${realm.y/100*H + oy})`} className="char-token-premium" onClick={() => onCharClick(cid)}>
                      <circle r="14" fill="rgba(0,0,0,0.5)" stroke={tc} strokeWidth="2"/>
                      <circle r="8" fill="none" stroke={tc} strokeWidth="0.5" opacity="0.5"/>
                      <text y="5.5" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="13" fontWeight="900" fill="#fff">{ch.name[0]}</text>
                    </g>
                  );
                })}
                {/* Legend */}
                <g transform="translate(620, 460)">
                  <rect x="0" y="0" width="160" height="36" rx="4" fill="rgba(6,4,10,0.75)" stroke="rgba(180,130,50,0.15)"/>
                  <circle cx="15" cy="18" r="4.5" fill="rgba(0,0,0,0.5)" stroke="#d4af37" strokeWidth="1.5"/>
                  <text x="26" y="22" fontSize="10" fill="var(--text-dim)" fontFamily="var(--font-sc)">角色令牌</text>
                  <polygon points="80,10 90,18 80,26" fill="rgba(139,0,0,0.2)" stroke="#8b0000" strokeWidth="1.2"/>
                  <text x="100" y="22" fontSize="10" fill="var(--text-dim)" fontFamily="var(--font-sc)">黑海侵蚀</text>
                </g>
              </>
            ) : (
              <>
                <defs><filter id="ink"><feGaussianBlur stdDeviation="4"/></filter></defs>
                <rect width={W} height={H} fill="rgba(8,6,16,0.25)"/>
                <ellipse cx="480" cy="280" rx="320" ry="180" fill="rgba(120,40,20,0.045)" filter="url(#ink)"/>
                <ellipse cx="200" cy="380" rx="180" ry="120" fill="rgba(40,120,70,0.03)" filter="url(#ink)"/>
                {/* Grid */}
                {Array.from({length: 10}, (_, i) => <line key={`gh${i}`} x1="0" y1={i*50} x2={W} y2={i*50} stroke="rgba(180,130,50,0.03)" strokeWidth="0.5"/>)}
                {Array.from({length: 16}, (_, i) => <line key={`gv${i}`} x1={i*50} y1="0" x2={i*50} y2={H} stroke="rgba(180,130,50,0.03)" strokeWidth="0.5"/>)}
                {/* Scene markers */}
                {scenes.map(l => Marker[l.type] ? Marker[l.type](l.x, l.y, l.name, l.id, onSceneClick, showTip, hideTip, l.desc) : null)}
                {/* Character tokens */}
                {Object.entries(charPositions).map(([cid, pos]) => {
                  const ch = characters.find(c => c.id === cid); if (!ch) return null;
                  const tc = TOKEN_COLORS[ch.tokenColor] || '#d4af37';
                  return (
                    <g key={`t-${cid}`} transform={`translate(${pos.sx},${pos.sy})`} className="char-token-premium" onClick={() => onCharClick(cid)}>
                      <circle r="13" fill="rgba(0,0,0,0.5)" stroke={tc} strokeWidth="2"/>
                      <circle r="7" fill="none" stroke={tc} strokeWidth="0.5" opacity="0.4"/>
                      <text y="5" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="13" fontWeight="900" fill="#fff">{ch.name[0]}</text>
                    </g>
                  );
                })}
                {/* Compass */}
                <g transform="translate(740,40)">
                  <circle r="22" fill="rgba(6,4,10,0.7)" stroke="rgba(180,130,50,0.25)" strokeWidth="1"/>
                  <text y="-14" textAnchor="middle" fontSize="10" fill="#d4af37" fontFamily="var(--font-sc)">北</text>
                  <line x1="0" y1="-10" x2="0" y2="-4" stroke="#d4af37" strokeWidth="1.5"/>
                </g>
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="map-tooltip-premium map-tooltip-premium--visible" style={{ left: tooltip.x, top: tooltip.y }}>
          <div className="map-tooltip-premium-title">{tooltip.title}</div>
          <div className="map-tooltip-premium-desc">{tooltip.desc}</div>
        </div>
      )}
    </section>
  );
}
