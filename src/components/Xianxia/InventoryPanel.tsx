import { FAKE_INVENTORY } from './FakeData';

const CONDITION_CLASS: Record<string, string> = {
  '完整': 'item-condition--full',
  '残破': 'item-condition--broken',
  '微损': 'item-condition--damaged',
  '封印': 'item-condition--sealed',
};

export function InventoryPanel() {
  return (
    <article id="panel-inventory" className="xianxia-panel inventory-panel">
      <h3 className="section-title">储物须弥</h3>
      <div className="item-grid">
        {FAKE_INVENTORY.map((item) => (
          <div key={item.id} className="item-card">
            <h4 className="item-name">{item.name}</h4>
            <div className="item-meta">
              <span className="item-grade">{item.grade}</span>
              <span className={`item-condition ${CONDITION_CLASS[item.condition]}`}>
                {item.condition}
              </span>
            </div>
            <p className="item-description">{item.description}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
