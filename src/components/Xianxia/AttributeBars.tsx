import { FAKE_ATTRIBUTES } from './FakeData';

export function AttributeBars() {
  return (
    <div className="attributes-section">
      <h3 className="section-title">本命灵枢</h3>
      {FAKE_ATTRIBUTES.map((attr) => (
        <div key={attr.key} className="attr-row">
          <span className="attr-label">{attr.label}</span>
          <div className="attr-bar">
            <div
              className="attr-bar-fill"
              style={{
                width: `${(attr.value / attr.max) * 100}%`,
                background: `linear-gradient(90deg, ${attr.gradientFrom}, ${attr.gradientTo})`,
              }}
            />
          </div>
          <span className="attr-value">
            {attr.value}
            <span className="attr-slash">/{attr.max}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
