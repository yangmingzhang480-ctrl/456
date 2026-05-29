import { FAKE_WORLD_STATE } from './FakeData';

export function CelestialMonitor() {
  const cl = FAKE_WORLD_STATE.corruptionLevel;

  return (
    <div className="celestial-monitor">
      <h3 className="monitor-title">天道监控台</h3>
      <div className="monitor-grid">
        <div className="monitor-row">
          <span className="monitor-label">天地坐标</span>
          <span className="monitor-value">{FAKE_WORLD_STATE.coordinates}</span>
        </div>
        <div className="monitor-row">
          <span className="monitor-label">天时</span>
          <span className="monitor-value">
            {FAKE_WORLD_STATE.dayPhase} · 剩余{FAKE_WORLD_STATE.remainingDaylight}
          </span>
        </div>
        <div className="monitor-row">
          <span className="monitor-label">灵力潮汐</span>
          <span className="monitor-value">{FAKE_WORLD_STATE.spiritTide}</span>
        </div>
        <div className="monitor-row">
          <span className="monitor-label">黑海侵蚀度</span>
          <span className="monitor-value" style={{ marginBottom: 6, fontFamily: 'var(--font-mono)' }}>
            {cl}%
          </span>
          <div className="corruption-bar">
            <div className="corruption-indicator" style={{ width: `${100 - cl}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
