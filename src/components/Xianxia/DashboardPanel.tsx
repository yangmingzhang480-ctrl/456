import { FAKE_CHARACTER } from './FakeData';
import { AttributeBars } from './AttributeBars';
import { CelestialMonitor } from './CelestialMonitor';

export function DashboardPanel() {
  return (
    <article className="xianxia-panel dashboard-panel">
      <header className="dashboard-header">
        <h1 className="character-name">{FAKE_CHARACTER.name}</h1>
        <div className="character-badges">
          <span className="realm-badge">{FAKE_CHARACTER.realm}</span>
          <span className="title-badge">{FAKE_CHARACTER.title}</span>
        </div>
        <p className="character-description">{FAKE_CHARACTER.description}</p>
      </header>
      <AttributeBars />
      <CelestialMonitor />
    </article>
  );
}
