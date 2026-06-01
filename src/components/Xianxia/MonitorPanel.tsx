import { PinLocationIcon } from './PremiumIcons';
import type { ChatMessage, ChatSession } from '../../sillytavern/types';

export interface CharacterStat { key: string; value: number; max: number; cssClass: string; }
export interface CharacterProfile {
  id: string; name: string; title: string; realm: string;
  avatarClass: string; tokenColor: string;
  location: string; pastLife: string; isDanger: boolean; stats: CharacterStat[];
}

interface Props {
  characters: CharacterProfile[];
  onSelect: (char: CharacterProfile) => void;
}

export function MonitorPanel({ characters, onSelect }: Props) {
  return (
    <section className="xianxia-panel" aria-label="轮回监控台">
      <header className="panel-header">
        <h1 className="panel-title"><span className="panel-title-decoration" />轮回监控台</h1>
        <p className="panel-subtitle">四名轮回者的因果缘法，尽在此间</p>
      </header>

      <div className="monitor-grid-premium">
        {characters.map(c => (
          <article key={c.id}
            id={`char-card-${c.id}`}
            className={`char-card-premium${c.isDanger ? ' char-card-premium--danger' : ''}`}
            onClick={() => onSelect(c)}
          >
            {c.isDanger && <span className="char-card-danger-badge-premium">危</span>}
            <div className={`char-card-avatar-premium char-card-avatar--${c.avatarClass}`}>
              {c.name[0]}
            </div>
            <div className="char-card-name-premium">{c.name}</div>
            <div className="char-card-role-premium">{c.title}</div>
            <div className="char-card-loc-premium">
              <PinLocationIcon /> {c.location}
            </div>
            <div className="char-card-past-premium">{c.pastLife}</div>
            <div className="stat-list-premium">
              {c.stats.map(s => (
                <div className="stat-row-premium" key={s.key}>
                  <span className="stat-label-premium">{s.key}</span>
                  <div className="stat-track-premium">
                    <div className={`stat-fill-premium ${s.cssClass}`} style={{ width: `${s.value}%` }} />
                  </div>
                  <span className="stat-val-premium">{s.value}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="section-heading-premium">天道残缺 · 劫起劫灭</div>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 2, maxWidth: 800 }}>
        诸天万界陷入无尽战火，黑海异族自深渊涌出。四位身负前世宿命的轮回者——
        <strong style={{ color: 'var(--accent-gold-bright)' }}>陆星遥</strong>、{' '}
        <strong style={{ color: 'var(--jade)' }}>李明远</strong>、{' '}
        <strong style={{ color: 'var(--ice-bright)' }}>叶汐澜</strong>、{' '}
        <strong style={{ color: 'var(--amethyst-bright)' }}>楚凌霜</strong>
        ——在命运的洪流中相遇。九世轮回的真相，黑海的起源，元极天深处通往仙界的古路……一切答案，皆等待揭晓。
      </p>
    </section>
  );
}

/* ---- Character Card Drawer Content ---- */
export function CharacterDrawerContent({ char }: { char: CharacterProfile }) {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div className={`char-card-avatar-premium char-card-avatar--${char.avatarClass}`}
          style={{ width: 72, height: 72, fontSize: 32, margin: '0 auto 12px' }}>
          {char.name[0]}
        </div>
        <h2 style={{ fontFamily: 'var(--font-sc)', fontSize: 24, fontWeight: 900, color: 'var(--accent-gold-bright)', letterSpacing: '0.08em' }}>
          {char.name}
        </h2>
        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>{char.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <PinLocationIcon /> {char.location}
        </div>
      </div>
      <div className="section-heading-premium">前世宿命</div>
      <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.9, marginBottom: 20, fontStyle: 'italic' }}>
        {char.pastLife}
      </p>
      <div className="section-heading-premium">当前境界</div>
      <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 20 }}>{char.realm}</p>
      <div className="section-heading-premium">六维属性</div>
      {char.stats.map(s => (
        <div className="stat-row-premium" key={s.key} style={{ marginBottom: 10 }}>
          <span className="stat-label-premium">{s.key}</span>
          <div className="stat-track-premium">
            <div className={`stat-fill-premium ${s.cssClass}`} style={{ width: `${s.value}%` }} />
          </div>
          <span className="stat-val-premium">{s.value}</span>
        </div>
      ))}
      {char.isDanger && (
        <div style={{ marginTop: 16, padding: 14, border: '1px solid var(--blood-red)', borderRadius: 'var(--radius-md)', background: 'rgba(192,57,43,0.06)', color: 'var(--blood-red-bright)', fontSize: 13, textAlign: 'center', letterSpacing: '0.06em', lineHeight: 1.6 }}>
          状态危急 — 精血严重不足，需立即援助。建议派遣至少两名金丹境以上修士前往该坐标。
        </div>
      )}
    </>
  );
}
