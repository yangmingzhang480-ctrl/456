import { useState, useCallback, useRef, useEffect } from 'react';

export interface RealmNode { id: string; name: string; x: number; y: number; desc: string; connections: string[]; corrupted: boolean; }
export interface SceneLocation { id: string; name: string; x: number; y: number; type: 'city' | 'rift' | 'ruin' | 'danger' | 'sacred'; desc: string; }
export interface CharPosition { realmId?: string; sx: number; sy: number; }

interface Props {
  realms: RealmNode[]; scenes: SceneLocation[];
  charPositions: Record<string, CharPosition>;
  characters: Array<{ id: string; name: string; tokenColor: string; }>;
  onRealmClick: (id: string) => void; onSceneClick: (id: string) => void; onCharClick: (id: string) => void;
}

const W = 1600, H = 1000;
const TOKEN_COLORS: Record<string, string> = { gold: '#d4af37', ice: '#4da6ff', jade: '#2ecc71', amethyst: '#9b6dff' };
const TOKEN_OFFSETS: Record<string, [number, number]> = { luxingyao: [-48,-48], limingyuan: [36,-40], yexilan: [44,36], chulingshuang: [-40,40] };

/* ---- Qingming-style marker generators ---- */
function CityMarker({ x, y, name, desc, onClick }: { x:number;y:number;name:string;desc:string;onClick:()=>void}) {
  return (
    <g transform={`translate(${x},${y})`} cursor="pointer" onClick={onClick}>
      <rect x="-22" y="-22" width="44" height="44" rx="4" fill="rgba(212,175,55,0.04)" stroke="#d4af37" strokeWidth="1.2"/>
      <rect x="-16" y="-16" width="32" height="32" rx="2" fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="0.6"/>
      {/* Roof lines — ancient Chinese architecture */}
      <line x1="-20" y1="-14" x2="0" y2="-22" stroke="rgba(212,175,55,0.25)" strokeWidth="0.8"/>
      <line x1="0" y1="-22" x2="20" y2="-14" stroke="rgba(212,175,55,0.25)" strokeWidth="0.8"/>
      <line x1="-10" y1="-8" x2="0" y2="-14" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5"/>
      <line x1="0" y1="-14" x2="10" y2="-8" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5"/>
      {/* Gate */}
      <rect x="-4" y="-2" width="8" height="12" rx="1" fill="rgba(212,175,55,0.08)" stroke="rgba(212,175,55,0.3)" strokeWidth="0.6"/>
      <circle cx="0" cy="4" r="2" fill="rgba(212,175,55,0.2)"/>
      <text y="36" textAnchor="middle" className="qingming-label" fontSize="10">{name}</text>
    </g>
  );
}

function RiftMarker({ x, y, name, desc, onClick }: { x:number;y:number;name:string;desc:string;onClick:()=>void}) {
  return (
    <g transform={`translate(${x},${y})`} cursor="pointer" onClick={onClick}>
      <polygon points="0,-24 20,-8 14,18 -14,18 -20,-8" fill="rgba(139,0,0,0.08)" stroke="#8b0000" strokeWidth="1.2"/>
      <polygon points="0,-14 12,-5 9,10 -9,10 -12,-5" fill="rgba(192,57,43,0.05)" stroke="rgba(192,57,43,0.2)" strokeWidth="0.6"/>
      <line x1="-8" y1="0" x2="8" y2="0" stroke="#c0392b" strokeWidth="0.8" opacity="0.5"/>
      <line x1="0" y1="-8" x2="0" y2="8" stroke="#c0392b" strokeWidth="0.8" opacity="0.5"/>
      {/* Cracked lines radiating */}
      <line x1="-6" y1="-6" x2="-12" y2="-12" stroke="rgba(192,57,43,0.15)" strokeWidth="0.5"/>
      <line x1="6" y1="6" x2="12" y2="12" stroke="rgba(192,57,43,0.15)" strokeWidth="0.5"/>
      <text y="34" textAnchor="middle" className="qingming-label" fontSize="10" fill="#8b3a3a">{name}</text>
    </g>
  );
}

function RuinMarker({ x, y, name, desc, onClick }: { x:number;y:number;name:string;desc:string;onClick:()=>void}) {
  return (
    <g transform={`translate(${x},${y})`} cursor="pointer" onClick={onClick}>
      <circle r="18" fill="rgba(140,120,70,0.04)" stroke="#9d8f7a" strokeWidth="1.2" strokeDasharray="5 3"/>
      <circle r="10" fill="none" stroke="rgba(157,143,122,0.2)" strokeWidth="0.6"/>
      {/* Broken pillar shapes */}
      <rect x="-3" y="-14" width="6" height="10" rx="1" fill="none" stroke="rgba(157,143,122,0.15)" strokeWidth="0.5"/>
      <rect x="-3" y="4" width="6" height="10" rx="1" fill="none" stroke="rgba(157,143,122,0.15)" strokeWidth="0.5"/>
      <circle cx="0" cy="-1" r="2.5" fill="rgba(157,143,122,0.2)"/>
      <text y="34" textAnchor="middle" className="qingming-label" fontSize="10">{name}</text>
    </g>
  );
}

function DangerMarker({ x, y, name, desc, onClick }: { x:number;y:number;name:string;desc:string;onClick:()=>void}) {
  return (
    <g transform={`translate(${x},${y})`} cursor="pointer" onClick={onClick}>
      <polygon points="0,-22 20,-8 15,20 -15,20 -20,-8" fill="rgba(192,57,43,0.04)" stroke="#c0392b" strokeWidth="1.2"/>
      <polygon points="0,-12 12,-5 9,12 -9,12 -12,-5" fill="rgba(192,57,43,0.03)" stroke="rgba(192,57,43,0.18)" strokeWidth="0.5"/>
      <text y="5" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="12" fontWeight="700" fill="#c0392b">危</text>
      <text y="36" textAnchor="middle" className="qingming-label" fontSize="10" fill="#8b3a3a">{name}</text>
    </g>
  );
}

function SacredMarker({ x, y, name, desc, onClick }: { x:number;y:number;name:string;desc:string;onClick:()=>void}) {
  return (
    <g transform={`translate(${x},${y})`} cursor="pointer" onClick={onClick}>
      <circle r="18" fill="rgba(46,204,113,0.03)" stroke="#2ecc71" strokeWidth="1.2"/>
      <circle r="12" fill="none" stroke="rgba(46,204,113,0.15)" strokeWidth="0.6"/>
      <circle r="5" fill="rgba(46,204,113,0.08)" stroke="none"/>
      {/* Cross star */}
      <line x1={-22} y1={0} x2={22} y2={0} stroke="rgba(46,204,113,0.08)" strokeWidth={0.5}/>
      <line x1={0} y1={-22} x2={0} y2={22} stroke="rgba(46,204,113,0.08)" strokeWidth={0.5}/>
      <text y="34" textAnchor="middle" className="qingming-label" fontSize="10" fill="#2e6b3c">{name}</text>
    </g>
  );
}

const MARKERS: Record<string, React.FC<{x:number;y:number;name:string;desc:string;onClick:()=>void}>> = {
  city: CityMarker, rift: RiftMarker, ruin: RuinMarker, danger: DangerMarker, sacred: SacredMarker,
};

export function DualMapPanel({ realms, scenes, charPositions, characters, onRealmClick, onSceneClick, onCharClick }: Props) {
  const [mode, setMode] = useState<'macro' | 'micro'>('macro');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<{ x: number; y: number; title: string; desc: string } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const showTip = useCallback((e: React.MouseEvent, title: string, desc: string) => {
    setTooltip({ x: e.clientX + 18, y: e.clientY - 60, title, desc });
  }, []);
  const hideTip = useCallback(() => setTooltip(null), []);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.3, 3));
  const handleZoomOut = () => setZoom(z => { const nz = z - 0.3; return nz < 0.5 ? 0.5 : nz; });
  const handleZoomReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (mode !== 'micro') return;
    setDragging(true); setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    (e.target as HTMLElement).style.cursor = 'grabbing';
  }, [mode, pan]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);
  const handleMouseUp = useCallback(() => { setDragging(false); }, []);

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
          {mode === 'micro' && <span style={{marginLeft:'auto',fontSize:12,color:'var(--text-muted)',display:'flex',alignItems:'center',gap:6}}>
            拖拽移动 · 滚轮缩放 · {Math.round(zoom * 100)}%
          </span>}
        </div>
        <div ref={stageRef} className="map-premium-stage"
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          onWheel={mode === 'micro' ? (e => { e.preventDefault(); setZoom(z => Math.max(0.5, Math.min(3, z - e.deltaY * 0.001))); }) : undefined}
          style={{ overflow: 'hidden', cursor: mode === 'micro' ? (dragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="map-premium-svg"
            style={mode === 'micro' ? { transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' } : undefined}>
            {mode === 'macro' ? (
              <>
                <defs>
                  <radialGradient id="corr-grad" cx="48%" cy="42%"><stop offset="0%" stopColor="rgba(139,0,0,0.08)"/><stop offset="100%" stopColor="transparent"/></radialGradient>
                </defs>
                <rect width={W} height={H} fill="url(#corr-grad)"/>
                {realms.flatMap(r => r.connections.map(cid => {
                  const t = realms.find(x => x.id === cid); if (!t) return null;
                  return <line key={`${r.id}-${cid}`} x1={r.x/100*W} y1={r.y/100*H} x2={t.x/100*W} y2={t.y/100*H} className="ley-line-premium"/>;
                }))}
                {realms.map(r => (
                  <g key={r.id} transform={`translate(${r.x/100*W},${r.y/100*H})`}
                    className={`realm-node-premium${r.corrupted ? ' realm-node-premium--corrupted' : ''}`}
                    onMouseEnter={e => showTip(e, r.name, r.desc)} onMouseLeave={hideTip}
                    onClick={() => onRealmClick(r.id)}>
                    {r.corrupted
                      ? <polygon points="0,-28 24,-10 16,22 -16,22 -24,-10" fill="rgba(139,0,0,0.1)" stroke="#8b0000" strokeWidth="1.3"/>
                      : <polygon points="0,-28 24,-10 16,22 -16,22 -24,-10" fill="rgba(212,175,55,0.05)" stroke="#d4af37" strokeWidth="1.3"/>
                    }
                    <text y="6" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="11" fill="var(--text-primary)">{r.name}</text>
                  </g>
                ))}
                {Object.entries(charPositions).map(([cid, pos]) => {
                  if (!pos.realmId) return null;
                  const ch = characters.find(c => c.id === cid); if (!ch) return null;
                  const realm = realms.find(r => r.id === pos.realmId); if (!realm) return null;
                  const [ox, oy] = TOKEN_OFFSETS[cid] || [0,0];
                  const tc = TOKEN_COLORS[ch.tokenColor] || '#d4af37';
                  return (
                    <g key={`t-${cid}`} transform={`translate(${realm.x/100*W + ox},${realm.y/100*H + oy})`} className="char-token-premium" onClick={() => onCharClick(cid)}>
                      <circle r="15" fill="rgba(0,0,0,0.55)" stroke={tc} strokeWidth="2"/>
                      <circle r="9" fill="none" stroke={tc} strokeWidth="0.5" opacity="0.4"/>
                      <text y="6" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="14" fontWeight="900" fill="#fff">{ch.name[0]}</text>
                    </g>
                  );
                })}
                <g transform="translate(1380,930)">
                  <rect x="0" y="0" width="200" height="52" rx="4" fill="rgba(6,4,10,0.8)" stroke="rgba(180,130,50,0.15)"/>
                  <circle cx="18" cy="26" r="5" fill="rgba(0,0,0,0.5)" stroke="#d4af37" strokeWidth="1.5"/><text x="30" y="30" fontSize="11" fill="var(--text-dim)" fontFamily="var(--font-sc)">角色令牌</text>
                  <polygon points="100,14 110,26 100,38" fill="rgba(139,0,0,0.25)" stroke="#8b0000" strokeWidth="1.2"/><text x="120" y="30" fontSize="11" fill="var(--text-dim)" fontFamily="var(--font-sc)">黑海侵蚀</text>
                </g>
              </>
            ) : (
              <>
                <defs>
                  <filter id="ink-blur-heavy"><feGaussianBlur stdDeviation="8"/></filter>
                  <filter id="ink-blur-light"><feGaussianBlur stdDeviation="3"/></filter>
                  <linearGradient id="scroll-fade-top" y1="0" y2="1"><stop offset="0%" stopColor="rgba(6,4,10,0.3)"/><stop offset="100%" stopColor="transparent"/></linearGradient>
                </defs>
                {/* Qingming scroll base — aged silk tone */}
                <rect width={W} height={H} fill="#e8dcc8" opacity="0.06"/>
                <rect width={W} height={H} fill="url(#scroll-fade-top)"/>

                {/* Ink wash mountains — far background */}
                <ellipse cx="300" cy="700" rx="500" ry="180" className="ink-wash-mountain"/>
                <ellipse cx="900" cy="650" rx="450" ry="200" className="ink-wash-mountain"/>
                <ellipse cx="1300" cy="720" rx="400" ry="150" className="ink-wash-mountain"/>

                {/* Ink wash water / mist */}
                <ellipse cx="500" cy="500" rx="600" ry="120" className="ink-wash-water"/>
                <ellipse cx="1100" cy="450" rx="500" ry="100" className="ink-wash-water"/>

                {/* Trees — scattered ink dots */}
                {Array.from({length: 60}, (_, i) => (
                  <circle key={`tree-${i}`} cx={20 + Math.random() * 1550} cy={400 + Math.random() * 550} r={3 + Math.random() * 6} className="ink-wash-tree"/>
                ))}

                {/* Ancient road / path */}
                <path d="M100,800 Q300,700 500,650 Q700,600 900,580 Q1100,560 1300,500 Q1500,450 1550,420" fill="none" stroke="rgba(180,150,100,0.1)" strokeWidth="2" strokeDasharray="8 12"/>

                {/* Grid — subtle */}
                {Array.from({length:12}, (_, i) => (<line key={`gh${i}`} x1="0" y1={i*83} x2={W} y2={i*83} stroke="rgba(180,130,50,0.02)" strokeWidth="0.5"/>))}
                {Array.from({length:20}, (_, i) => (<line key={`gv${i}`} x1={i*80} y1="0" x2={i*80} y2={H} stroke="rgba(180,130,50,0.02)" strokeWidth="0.5"/>))}

                {/* Location markers — Qingming style */}
                {scenes.map(l => {
                  const M = MARKERS[l.type];
                  return M ? <M key={l.id} x={l.x} y={l.y} name={l.name} desc={l.desc} onClick={() => onSceneClick(l.id)} /> : null;
                })}

                {/* Character tokens */}
                {Object.entries(charPositions).map(([cid, pos]) => {
                  const ch = characters.find(c => c.id === cid); if (!ch) return null;
                  const tc = TOKEN_COLORS[ch.tokenColor] || '#d4af37';
                  return (
                    <g key={`t-${cid}`} transform={`translate(${pos.sx},${pos.sy})`} className="char-token-premium" onClick={() => onCharClick(cid)}>
                      <circle r="14" fill="rgba(0,0,0,0.55)" stroke={tc} strokeWidth="2"/>
                      <circle r="8" fill="none" stroke={tc} strokeWidth="0.5" opacity="0.4"/>
                      <text y="5.5" textAnchor="middle" fontFamily="var(--font-sc)" fontSize="14" fontWeight="900" fill="#fff">{ch.name[0]}</text>
                    </g>
                  );
                })}

                {/* Compass — Qingming style */}
                <g transform="translate(1520,60)">
                  <circle r="26" fill="rgba(232,220,200,0.15)" stroke="rgba(180,150,100,0.3)" strokeWidth="1.2"/>
                  <text y="-18" textAnchor="middle" fontSize="11" fill="#8b7355" fontFamily="var(--font-sc)">北</text>
                  <text y="34" textAnchor="middle" fontSize="11" fill="#8b7355" fontFamily="var(--font-sc)">南</text>
                  <text x="-34" y="5" textAnchor="middle" fontSize="11" fill="#8b7355" fontFamily="var(--font-sc)">西</text>
                  <text x="34" y="5" textAnchor="middle" fontSize="11" fill="#8b7355" fontFamily="var(--font-sc)">东</text>
                  <line x1="0" y1="-12" x2="0" y2="-6" stroke="#8b7355" strokeWidth="1.5"/>
                </g>
              </>
            )}
          </svg>
        </div>
        {/* Zoom controls */}
        {mode === 'micro' && (
          <div className="map-zoom-controls">
            <button className="map-zoom-btn" id="map-zoom-in" onClick={handleZoomIn} title="放大">+</button>
            <button className="map-zoom-btn" id="map-zoom-out" onClick={handleZoomOut} title="缩小">−</button>
            <button className="map-zoom-btn" id="map-zoom-reset" onClick={handleZoomReset} title="重置" style={{fontSize:11}}>⟲</button>
          </div>
        )}
      </div>

      {tooltip && (
        <div className="map-tooltip-premium map-tooltip-premium--visible" style={{ position: 'fixed', left: tooltip.x, top: tooltip.y, zIndex: 200 }}>
          <div className="map-tooltip-premium-title">{tooltip.title}</div>
          <div className="map-tooltip-premium-desc">{tooltip.desc}</div>
        </div>
      )}
    </section>
  );
}
