import { FAKE_INVENTORY } from './FakeData';

const GRADE_CLASS: Record<string, string> = {
  '圣阶·封印': 'card-premium-grade--saint',
  '帝阶·残篇': 'card-premium-grade--emperor',
  '天阶·下品': 'card-premium-grade--heaven',
  '天阶·中品': 'card-premium-grade--heaven',
  '天阶·上品': 'card-premium-grade--heaven',
  '地阶·极品': 'card-premium-grade--earth',
  '地阶·中品': 'card-premium-grade--earth',
  '玄阶·上品': 'card-premium-grade--mystic',
};

const TYPE_LABELS: Record<string, string> = {
  '完整': '消耗品', '残破': '法宝残片', '微损': '剑诀', '封印': '圣器',
};

export function InventoryPanel() {
  const items = FAKE_INVENTORY.map((item, i) => {
    const types = ['法器', '法宝残片', '功法', '丹药', '剑诀', '圣器', '法器'];
    return { ...item, typeLabel: types[i % types.length] };
  });

  if (items.length === 0) {
    return (
      <section className="xianxia-panel" aria-label="须弥纳戒">
        <header className="panel-header">
          <h1 className="panel-title"><span className="panel-title-decoration" />须弥纳戒</h1>
          <p className="panel-subtitle">咫尺纳须弥，芥子藏乾坤</p>
        </header>
        <div className="empty-state-premium">
          <div className="empty-state-premium-icon">◇</div>
          <div className="empty-state-premium-text">空间法则已被污染</div>
          <div className="empty-state-premium-desc">须弥纳戒被黑海禁制锁死，暂无法开启</div>
        </div>
      </section>
    );
  }

  return (
    <section className="xianxia-panel" aria-label="须弥纳戒">
      <header className="panel-header">
        <h1 className="panel-title"><span className="panel-title-decoration" />须弥纳戒</h1>
        <p className="panel-subtitle">{items.length} 件法宝，尽在其中</p>
      </header>
      <div className="card-grid-premium">
        {items.map(item => (
          <article key={item.id} id={`inv-${item.id}`} className="card-premium">
            <div className="card-premium-corner" />
            <div className="card-premium-name">{item.name}</div>
            <span className={`card-premium-grade ${GRADE_CLASS[item.grade] || ''}`}>{item.grade}</span>
            <div className="card-premium-desc">{item.description}</div>
            <span className="card-premium-type">{item.typeLabel}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
