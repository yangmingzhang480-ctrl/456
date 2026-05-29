import { useState, useCallback } from 'react';
import { FAKE_REALMS } from './FakeData';
import type { RealmNode } from './FakeData';

function interpolate(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

// Bézier curve path between two nodes with a slight arc
function connectionPath(from: RealmNode, to: RealmNode, index: number, total: number): string {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = (-dy / len) * 4;
  const ny = (dx / len) * 4;
  const t = total > 2 ? (index / (total - 1) - 0.5) * 2 : 0;
  const cx = midX + nx * t;
  const cy = midY + ny * t;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

export function MapPanel() {
  const [hoveredRealm, setHoveredRealm] = useState<RealmNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = useCallback((realm: RealmNode, e: React.MouseEvent) => {
    setHoveredRealm(realm);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (hoveredRealm) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  }, [hoveredRealm]);

  const sortedByY = [...FAKE_REALMS].sort((a, b) => a.y - b.y);

  return (
    <article id="panel-map" className="xianxia-panel map-panel">
      <h3 className="section-title">玄灵界舆图</h3>
      <div className="map-container" onMouseMove={handleMouseMove}>
        <svg className="map-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="corruptedGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(192,57,43,0.4)" />
              <stop offset="60%" stopColor="rgba(192,57,43,0.1)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Connections */}
          {FAKE_REALMS.map((realm) =>
            realm.connections
              .filter((targetId) => targetId > realm.id)
              .map((targetId) => {
                const target = FAKE_REALMS.find((r) => r.id === targetId);
                if (!target) return null;
                const isCorruptedPath = realm.isCorrupted || target.isCorrupted;
                const idx = realm.connections.indexOf(targetId);
                return (
                  <path
                    key={`${realm.id}-${targetId}`}
                    d={connectionPath(realm, target, idx, realm.connections.length)}
                    stroke={isCorruptedPath ? 'rgba(192,57,43,0.5)' : 'rgba(184,134,11,0.3)'}
                    strokeWidth={sortedByY.indexOf(realm) < sortedByY.length / 2 ? 0.3 : 0.2}
                    fill="none"
                    className="realm-connection"
                    strokeDasharray={isCorruptedPath ? '2 4' : '4 4'}
                  />
                );
              }),
          )}

          {/* Black sea corruption blobs */}
          {FAKE_REALMS.filter((r) => r.isCorrupted).map((realm) => (
            <circle
              key={`corrupt-${realm.id}`}
              cx={realm.x}
              cy={realm.y}
              r={8}
              fill="url(#corruptedGlow)"
              className="black-sea-overlay"
            />
          ))}

          {/* Realm nodes */}
          {sortedByY.map((realm) => (
            <g key={realm.id} className="realm-node">
              <circle
                cx={realm.x}
                cy={realm.y}
                r={realm.isCorrupted ? 3.5 : 3}
                fill={realm.isCorrupted ? '#c0392b' : '#b8860b'}
                stroke={realm.isCorrupted ? '#c0392b' : '#ffd700'}
                strokeWidth={0.5}
                filter={realm.isCorrupted ? 'none' : 'url(#glow)'}
                onMouseEnter={(e) => handleMouseEnter(realm, e)}
                onMouseLeave={() => setHoveredRealm(null)}
                style={{ cursor: 'pointer' }}
              />
              <text
                x={realm.x}
                y={realm.y + 5.5}
                textAnchor="middle"
                fill={realm.isCorrupted ? '#c0392b' : '#d4c5a9'}
                fontSize={realm.isCorrupted ? 2.5 : 2.8}
                fontFamily="var(--font-sc)"
                className="realm-label"
              >
                {realm.name}
              </text>
              {realm.isCorrupted && (
                <>
                  <line x1={realm.x - 2.5} y1={realm.y - 2.5} x2={realm.x + 2.5} y2={realm.y + 2.5} stroke="#c0392b" strokeWidth={0.3} />
                  <line x1={realm.x + 2.5} y1={realm.y - 2.5} x2={realm.x - 2.5} y2={realm.y + 2.5} stroke="#c0392b" strokeWidth={0.3} />
                </>
              )}
            </g>
          ))}

          {/* Legend */}
          <text x="5" y="95" fill="var(--text-muted)" fontSize="2" fontFamily="var(--font-sc)">■ 黑海侵蚀区</text>
          <circle cx="7" cy="91" r="1.5" fill="#c0392b" opacity="0.6" />
        </svg>

        {hoveredRealm && (
          <div
            className="realm-tooltip"
            style={{
              left: `${Math.min(tooltipPos.x + 16, typeof window !== 'undefined' ? window.innerWidth - 260 : 0)}px`,
              top: `${tooltipPos.y - 12}px`,
            }}
          >
            <div style={{ fontWeight: 700, color: hoveredRealm.isCorrupted ? '#c0392b' : 'var(--accent-gold-bright)', marginBottom: 4 }}>
              {hoveredRealm.name}
              {hoveredRealm.isCorrupted ? ' [侵蚀]' : ''}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{hoveredRealm.description}</div>
          </div>
        )}
      </div>
    </article>
  );
}
