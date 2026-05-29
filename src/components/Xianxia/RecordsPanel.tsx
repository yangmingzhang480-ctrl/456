import { FAKE_RECORDS } from './FakeData';

export function RecordsPanel() {
  return (
    <article id="panel-records" className="xianxia-panel records-panel">
      <h3 className="section-title">轮回秘录</h3>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 32, fontStyle: 'italic' }}>
        每一次死亡转生，灵魂深处都会留下无法磨灭的道纹。这些残缺的记忆碎片，是逆天改命唯一的线索。
      </p>
      <div className="record-scroll">
        {FAKE_RECORDS.map((rec) => (
          <div key={rec.id} className="record-entry">
            <div className="record-number-badge">{rec.deathNumber}</div>
            <div className="record-cause">第{rec.deathNumber}世 · 陨落于 {rec.cause}</div>
            <div className="record-insight">悟道：{rec.insight}</div>
            <div className="record-fragments">
              {rec.memoryFragments.map((frag, i) => (
                <div key={i} className="record-fragment">{frag}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
