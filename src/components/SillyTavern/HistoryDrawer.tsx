import { useSillytavern } from '../../hooks/useSillytavern';

export function HistoryDrawer({ onClose }: { onClose: () => void }) {
  const st = useSillytavern();
  const messages = st.activeChat?.messages ?? [];

  return (
    <div className="st-history-overlay" onClick={onClose}>
      <aside className="st-history-panel" onClick={e => e.stopPropagation()}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-sc)', fontSize: 18, color: 'var(--accent-gold-bright)', letterSpacing: '0.08em' }}>
            📜 因果长河
          </h2>
          <button onClick={onClose} style={{ fontSize: 18, padding: '4px 10px' }}>×</button>
        </header>
        <div className="st-history-list">
          {messages.map((m, i) => {
            const summary = m.role === 'assistant'
              ? (m.parsed?.maintext ?? m.content).slice(0, 60)
              : m.content.slice(0, 60);
            return (
              <div key={m.id} className="st-history-item">
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                  #{i} · {m.role === 'user' ? '你' : '天机'} · {new Date(m.timestamp).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{summary}…</div>
                <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                  <button onClick={() => { st.jumpToFloor(m.id); onClose(); }}>⤴ 回溯</button>
                  <button onClick={() => { const t = prompt('编辑内容', m.content); if (t != null) st.editMessage(m.id, t); }}>✎ 编辑</button>
                  <button onClick={() => st.rollbackTo(m.id)}>✕ 截断</button>
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>
              尚无线索，叩问天机以开启因果…
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
