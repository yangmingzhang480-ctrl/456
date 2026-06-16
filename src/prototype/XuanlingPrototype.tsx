import { useMemo, useState } from 'react';
import {
  characters,
  inventory,
  macroNodes,
  microNodes,
  records,
  settingRows,
  skills,
  tavernLorebooks,
  tavernOutput,
  tavernPreset,
  tavernVariables,
  type CharacterProfile,
  type InventoryItem,
  type MapNode,
  type RecordItem,
  type SkillNode,
} from './xuanlingData';
import {
  IconArray,
  IconBell,
  IconChevron,
  IconCity,
  IconClose,
  IconInventory,
  IconMap,
  IconRebirth,
  IconRelic,
  IconRift,
  IconSacred,
  IconScroll,
  IconSettings,
  IconSkill,
  IconToken,
  IconWarning,
} from './XuanlingIcons';

type PanelId = 'status' | 'tavern' | 'map' | 'skills' | 'inventory' | 'records' | 'settings';
type MapMode = 'macro' | 'micro';
type ModalState =
  | { type: 'node'; item: MapNode }
  | { type: 'skill'; item: SkillNode }
  | { type: 'item'; item: InventoryItem }
  | { type: 'record'; item: RecordItem }
  | null;

type ToastItem = { id: number; title: string; body: string; tone: 'info' | 'warning' | 'danger' };

type TavernOutputState = typeof tavernOutput;
type TavernVariableState = typeof tavernVariables;
type GameGenerateResponse = { ok: boolean; source: 'llm' | 'fallback'; output: TavernOutputState; worldState: { variables: TavernVariableState }; session: { id: string; updatedAt: number } };

const navItems: Array<{ id: PanelId; label: string; desc: string; Icon: typeof IconRebirth }> = [
  { id: 'status', label: '轮回者状态', desc: '四主角监控', Icon: IconRebirth },
  { id: 'tavern', label: '酒馆主控', desc: '角色卡与世界书', Icon: IconBell },
  { id: 'map', label: '玄灵舆图', desc: '双轨战略图', Icon: IconMap },
  { id: 'skills', label: '天机缘法', desc: '修行技能树', Icon: IconSkill },
  { id: 'inventory', label: '须弥纳戒', desc: '法宝与残卷', Icon: IconInventory },
  { id: 'records', label: '因果卷宗', desc: '轮回情报', Icon: IconScroll },
  { id: 'settings', label: '天道设置', desc: '推演参数', Icon: IconSettings },
];

function nodeIcon(kind: MapNode['kind']) {
  if (kind === 'city') return IconCity;
  if (kind === 'rift') return IconRift;
  if (kind === 'relic') return IconRelic;
  if (kind === 'sacred' || kind === 'sun') return IconSacred;
  if (kind === 'danger') return IconWarning;
  return IconArray;
}


function HeroScene() {
  return (
    <section className="xl-hero-scene" aria-labelledby="hero-scene-title">
      <div className="xl-hero-scene__image" aria-hidden="true" />
      <div className="xl-hero-scene__content">
        <p className="xl-kicker">SILLYTAVERN RPG 主控台</p>
        <h3 id="hero-scene-title">玄灵界·元极天</h3>
        <p>四名轮回者在黑海侵蚀下分散行动，玩家通过酒馆化主控台调度角色卡、世界书、变量、技能树与战术舆图，驱动 LLM 进行下一幕推演。</p>
        <div className="xl-hero-scene__chips" aria-label="酒馆化能力">
          <span>角色卡</span><span>世界书</span><span>结构化选项</span><span>变量状态</span><span>分支推演</span>
        </div>
      </div>
    </section>
  );
}

function InkTerrain({ mode }: { mode: MapMode }) {
  if (mode === 'macro') {
    return (
      <svg className="xl-ink-terrain" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="xl-ink-blur"><feGaussianBlur stdDeviation="7" /></filter>
          <linearGradient id="xl-realm-wash" x1="0" x2="1"><stop stopColor="#d8c7a0" stopOpacity=".16"/><stop offset="1" stopColor="#526074" stopOpacity=".08"/></linearGradient>
        </defs>
        <path className="wash" d="M40 420C160 260 260 300 340 180C450 30 580 120 660 230C740 338 880 250 970 390V620H40Z" />
        <path className="mountain" d="M20 470C120 330 200 390 300 250C420 80 560 170 630 280C700 390 860 330 980 450" />
        <path className="cloud" d="M90 170C210 110 310 140 420 105C570 58 700 105 850 78" />
        <path className="cloud cloud-2" d="M130 520C280 470 390 510 520 455C660 398 790 430 930 374" />
        <path className="blacksea" d="M0 390C170 430 250 360 390 410C520 458 620 382 760 440C850 478 940 470 1000 430V620H0Z" />
      </svg>
    );
  }
  return (
    <svg className="xl-ink-terrain" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
      <defs><filter id="xl-river-blur"><feGaussianBlur stdDeviation="4" /></filter></defs>
      <path className="wash" d="M0 470C130 400 190 450 280 340C390 205 520 230 610 330C710 440 830 360 1000 470V620H0Z" />
      <path className="ridge" d="M70 340C150 210 250 250 330 130C420 0 550 90 610 190C700 330 830 250 950 350" />
      <path className="river" d="M780 0C700 120 730 220 640 310C535 415 380 370 270 500C220 558 210 600 205 620" />
      <path className="city-wall" d="M250 385h170v80H250zM280 355h35v30M355 345h38v40" />
      <path className="rift-mark" d="M705 130l-55 135 66-27-42 150 105-202-72 31 42-87Z" />
      <path className="forest" d="M105 445c30-72 68-72 98 0M140 455c22-52 48-52 70 0M835 435c24-62 62-62 88 0" />
    </svg>
  );
}

export default function XuanlingPrototype() {
  const [activePanel, setActivePanel] = useState<PanelId>('status');
  const [mapMode, setMapMode] = useState<MapMode>('macro');
  const [drawerCharacter, setDrawerCharacter] = useState<CharacterProfile | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [recordTab, setRecordTab] = useState<'全部' | '轮回秘录' | '侵蚀情报' | '据点纪要' | '天机缘法'>('全部');
  const [tavernInput, setTavernInput] = useState('前往黑海裂隙第三层，尝试拉回叶汐澜的神识锚点。');
  const [toasts, setToasts] = useState<ToastItem[]>([
    { id: 1, title: '黑海潮汐预警', body: '元极天边境出现第三次暗潮回卷，请优先查看玄灵舆图。', tone: 'warning' },
  ]);

  const showToast = (title: string, body: string, tone: ToastItem['tone'] = 'info') => {
    const toast = { id: Date.now(), title, body, tone };
    setToasts((prev) => [...prev.slice(-2), toast]);
    window.setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== toast.id)), 4200);
  };

  const activeTitle = navItems.find((x) => x.id === activePanel)?.label ?? '轮回者状态';

  return (
    <div className="xl-shell">
      <div className="xl-bg" aria-hidden="true">
        <div className="xl-bg__scales" />
        <div className="xl-bg__embers" />
        <div className="xl-bg__mist" />
      </div>

      <nav className="xl-sidebar" aria-label="玄灵界全局导航">
        <header className="xl-brand">
          <div className="xl-brand__mark" aria-hidden="true"><IconArray /></div>
          <div>
            <p className="xl-brand__eyebrow">XUANLING TERMINAL</p>
            <h1>玄灵界</h1>
            <span>元极天轮回终端</span>
          </div>
        </header>
        <ul className="xl-nav-list">
          {navItems.map(({ id, label, desc, Icon }) => (
            <li key={id}>
              <button
                id={`nav-${id}`}
                className={`xl-nav-button ${activePanel === id ? 'is-active' : ''}`}
                type="button"
                onClick={() => setActivePanel(id)}
                aria-current={activePanel === id ? 'page' : undefined}
              >
                <Icon className="xl-icon" />
                <span><strong>{label}</strong><small>{desc}</small></span>
              </button>
            </li>
          ))}
        </ul>
        <aside className="xl-sidebar-alert" aria-label="当前危机摘要">
          <IconWarning className="xl-icon" />
          <strong>黑海侵蚀率 67%</strong>
          <span>叶汐澜与楚凌霜处于高风险链路。</span>
          <button id="btn-sidebar-warning-toast" type="button" onClick={() => showToast('天道警戒', '裂隙回声正在索引主角团命格，建议切换至玄灵舆图。', 'danger')}>查看警戒</button>
        </aside>
      </nav>

      <main className="xl-main" id="xuanling-main">
        <header className="xl-topbar">
          <div>
            <p className="xl-kicker">LLM 动态推演原型</p>
            <h2>{activeTitle}</h2>
          </div>
          <div className="xl-topbar__status" role="status" aria-live="polite">
            <span>轮回序列：第九次</span>
            <span>当前位置：元极天</span>
            <span className="is-danger">裂隙警戒：极高</span>
          </div>
        </header>

        {activePanel === 'status' && <HeroScene />}
        {activePanel === 'status' && <StatusPanel onOpenCharacter={setDrawerCharacter} onWarn={showToast} />}
        {activePanel === 'tavern' && <TavernPanel input={tavernInput} setInput={setTavernInput} onToast={showToast} />}
        {activePanel === 'map' && <MapPanel mode={mapMode} setMode={setMapMode} onOpenNode={(item) => setModal({ type: 'node', item })} />}
        {activePanel === 'skills' && <SkillPanel onOpenSkill={(item) => setModal({ type: 'skill', item })} />}
        {activePanel === 'inventory' && <InventoryPanel onOpenItem={(item) => setModal({ type: 'item', item })} />}
        {activePanel === 'records' && <RecordsPanel tab={recordTab} setTab={setRecordTab} onOpenRecord={(item) => setModal({ type: 'record', item })} />}
        {activePanel === 'settings' && <SettingsPanel onToast={showToast} />}
      </main>

      <ToastStack items={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((x) => x.id !== id))} />
      {drawerCharacter && <CharacterDrawer character={drawerCharacter} onClose={() => setDrawerCharacter(null)} />}
      {modal && <DetailModal modal={modal} onClose={() => setModal(null)} onToast={showToast} />}
    </div>
  );
}

function StatusPanel({ onOpenCharacter, onWarn }: { onOpenCharacter: (c: CharacterProfile) => void; onWarn: (title: string, body: string, tone: ToastItem['tone']) => void }) {
  return (
    <section className="xl-panel xl-status-panel" aria-labelledby="status-panel-title">
      <div className="xl-section-heading">
        <p>四象轮回监控</p>
        <h3 id="status-panel-title">主角团生命线与命格偏移</h3>
      </div>
      <div className="xl-character-grid">
        {characters.map((char) => (
          <article key={char.id} className={`xl-character-card ${char.status !== '稳定' ? 'is-risk' : ''}`} style={{ '--seal-color': char.color } as React.CSSProperties}>
            <button id={`btn-character-${char.id}`} className="xl-card-hit" type="button" onClick={() => onOpenCharacter(char)} aria-label={`查看${char.name}详情`} />
            <header className="xl-character-card__header">
              <div className="xl-seal" aria-hidden="true">{char.seal}</div>
              <div>
                <h4>{char.name}</h4>
                <p>{char.title}</p>
              </div>
              <span className={`xl-status-chip ${char.status !== '稳定' ? 'is-danger' : ''}`}>{char.status}</span>
            </header>
            <figure className="xl-character-portrait">
              <img src={char.portrait.src} alt={`${char.name}人物立绘`} style={{ objectPosition: char.portrait.position, transform: `scale(${char.portrait.scale})` }} />
              <figcaption>{char.name} · {char.cultivation}</figcaption>
            </figure>
            <dl className="xl-meta-list">
              <div><dt>前世宿命</dt><dd>{char.fate}</dd></div>
              <div><dt>当前境界</dt><dd>{char.realm}</dd></div>
              <div><dt>所在地</dt><dd>{char.location}</dd></div>
            </dl>
            <div className="xl-attrs" aria-label={`${char.name}六维属性`}>
              {char.attributes.map((attr) => (
                <div className="xl-attr" key={attr.key}>
                  <span>{attr.key}</span>
                  <div className="xl-attr__bar"><i className={`tone-${attr.tone}`} style={{ width: `${(attr.value / attr.max) * 100}%` }} /></div>
                  <em>{attr.value}</em>
                </div>
              ))}
            </div>
            <section className="xl-card-cultivation" aria-label={`${char.name}功法技能与物品`}>
              <strong>{char.cultivation}</strong>
              <div>{char.combatSkills.map((skill) => <span key={skill}>{skill}</span>)}</div>
              <div>{char.bagItems.map((item) => <em key={item}>{item}</em>)}</div>
            </section>
            <footer>
              <p>{char.quote}</p>
              {char.status !== '稳定' && (
                <button id={`btn-character-warning-${char.id}`} type="button" className="xl-inline-warning" onClick={(event) => { event.stopPropagation(); onWarn(`${char.name}状态异常`, char.risk, 'danger'); }}>
                  <IconWarning className="xl-icon" /> 危险链路
                </button>
              )}
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function MapPanel({ mode, setMode, onOpenNode }: { mode: MapMode; setMode: (m: MapMode) => void; onOpenNode: (n: MapNode) => void }) {
  const nodes = mode === 'macro' ? macroNodes : microNodes;
  const title = mode === 'macro' ? '大千界域图' : '现世战略图';
  return (
    <section className="xl-panel xl-map-panel" aria-labelledby="map-panel-title">
      <div className="xl-section-heading xl-map-heading">
        <div>
          <p>双轨舆图系统</p>
          <h3 id="map-panel-title">{title}</h3>
        </div>
        <div className="xl-segmented" role="tablist" aria-label="地图层级切换">
          <button id="btn-map-mode-macro" type="button" className={mode === 'macro' ? 'is-active' : ''} onClick={() => setMode('macro')}>大千界域</button>
          <button id="btn-map-mode-micro" type="button" className={mode === 'micro' ? 'is-active' : ''} onClick={() => setMode('micro')}>现世战略</button>
        </div>
      </div>
      <div className={`xl-map-stage is-${mode}`}>
        <svg className="xl-star-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 12 21 31 47 44 78 28 52 70 21 31" />
          <path d="M34 58 70 38 58 73 24 72 18 28" />
        </svg>
        <div className="xl-map-watermark">{mode === 'macro' ? '诸天星轨' : '荒骨战局'}</div>
        {nodes.map((node) => {
          const Icon = nodeIcon(node.kind);
          return (
            <button
              key={node.id}
              id={`btn-map-node-${node.id}`}
              type="button"
              className={`xl-map-node kind-${node.kind}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => onOpenNode(node)}
              aria-label={`查看据点${node.name}`}
            >
              <Icon className="xl-map-node__icon" />
              <span>{node.name}</span>
              {node.characters.map((name, index) => {
                const char = characters.find((x) => x.name === name);
                return <i key={name} className="xl-token" style={{ '--token-color': char?.color ?? '#d4af37', '--token-index': index } as React.CSSProperties}>{char?.seal ?? name.slice(0, 1)}</i>;
              })}
            </button>
          );
        })}
      </div>
      <aside className="xl-map-legend" aria-label="地图说明">
        <span><IconArray className="xl-icon" /> 阵法界域</span>
        <span><IconCity className="xl-icon" /> 人族据点</span>
        <span><IconRift className="xl-icon" /> 黑海裂隙</span>
        <span><IconToken className="xl-icon" /> 主角令牌</span>
      </aside>
    </section>
  );
}

function SkillPanel({ onOpenSkill }: { onOpenSkill: (s: SkillNode) => void }) {
  return (
    <section className="xl-panel" aria-labelledby="skills-panel-title">
      <div className="xl-section-heading"><p>天机缘法</p><h3 id="skills-panel-title">主角团修行技能树</h3></div>
      <div className="xl-skill-board">
        <svg className="xl-skill-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M16 34 C30 18, 48 18, 64 34 S74 54, 82 66"/><path d="M37 62 C44 50, 54 46, 64 34"/></svg>
        {skills.map((skill) => (
          <button key={skill.id} id={`btn-skill-${skill.id}`} className="xl-skill-node" style={{ left: `${skill.x}%`, top: `${skill.y}%` }} type="button" onClick={() => onOpenSkill(skill)}>
            <IconSkill className="xl-icon" />
            <strong>{skill.name}</strong>
            <span>{skill.owner}</span>
            <i style={{ width: `${skill.progress}%` }} />
          </button>
        ))}
      </div>
    </section>
  );
}

function InventoryPanel({ onOpenItem }: { onOpenItem: (item: InventoryItem) => void }) {
  return (
    <section className="xl-panel" aria-labelledby="inventory-panel-title">
      <div className="xl-section-heading"><p>须弥纳戒</p><h3 id="inventory-panel-title">法宝、残卷与战略物资</h3></div>
      <div className="xl-inventory-grid">
        {inventory.map((item) => (
          <article key={item.id} className="xl-inventory-card">
            <button id={`btn-inventory-${item.id}`} className="xl-card-hit" type="button" onClick={() => onOpenItem(item)} aria-label={`查看${item.name}`} />
            <IconInventory className="xl-icon" />
            <h4>{item.name}</h4>
            <p>{item.desc}</p>
            <footer><span>{item.type}</span><strong>{item.grade}</strong><em>{item.state}</em></footer>
          </article>
        ))}
      </div>
      <aside className="xl-empty-lore">空间法则已被污染，纳戒深层格位暂被禁制锁死。</aside>
    </section>
  );
}

function RecordsPanel({ tab, setTab, onOpenRecord }: { tab: string; setTab: (tab: any) => void; onOpenRecord: (item: RecordItem) => void }) {
  const tabs = ['全部', '轮回秘录', '侵蚀情报', '据点纪要', '天机缘法'];
  const filtered = tab === '全部' ? records : records.filter((record) => record.category === tab);
  return (
    <section className="xl-panel" aria-labelledby="records-panel-title">
      <div className="xl-section-heading"><p>因果卷宗</p><h3 id="records-panel-title">轮回记录与世界线扰动</h3></div>
      <div className="xl-record-tabs" role="tablist" aria-label="卷宗分类">
        {tabs.map((name) => <button id={`btn-record-tab-${name}`} type="button" key={name} className={tab === name ? 'is-active' : ''} onClick={() => setTab(name)}>{name}</button>)}
      </div>
      <div className="xl-record-list">
        {filtered.map((record) => (
          <article key={record.id} className={`xl-record-card tone-${record.severity}`}>
            <button id={`btn-record-${record.id}`} className="xl-card-hit" type="button" onClick={() => onOpenRecord(record)} aria-label={`查看${record.title}`} />
            <span>{record.category}</span>
            <h4>{record.title}</h4>
            <p>{record.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function TavernPanel({ input, setInput, onToast }: { input: string; setInput: (value: string) => void; onToast: (title: string, body: string, tone: ToastItem['tone']) => void }) {
  const [output, setOutput] = useState<TavernOutputState>(tavernOutput);
  const [variables, setVariables] = useState<TavernVariableState>(tavernVariables);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendSource, setBackendSource] = useState<'llm' | 'fallback' | 'idle'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string>('尚未写入');

  const generateNext = async () => {
    if (!input.trim() || isGenerating) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/game/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, sessionId }),
      });
      const data = await response.json() as Partial<GameGenerateResponse> & { error?: string; detail?: string };
      if (!response.ok || !data.output || !data.worldState || !data.session || !data.source) {
        throw new Error(data.error || data.detail || '后端推演失败');
      }
      setOutput(data.output);
      setVariables(data.worldState.variables);
      setSessionId(data.session.id);
      setBackendSource(data.source);
      setLastSavedAt(new Date(data.session.updatedAt).toLocaleString('zh-CN'));
      onToast(data.source === 'llm' ? 'API 推演完成' : '本地回退推演完成', `存档已写入 data/chats/${data.session.id}.json`, data.source === 'llm' ? 'info' : 'warning');
    } catch (error) {
      onToast('推演接口异常', (error as Error).message, 'danger');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="xl-panel xl-tavern-panel" aria-labelledby="tavern-panel-title">
      <div className="xl-section-heading xl-tavern-heading">
        <div>
          <p>SillyTavern GameView</p>
          <h3 id="tavern-panel-title">酒馆化推演主控台</h3>
        </div>
        <div className="xl-tavern-preset" aria-label="当前预设">
          <span>{tavernPreset.mode}</span>
          <strong>{tavernPreset.name}</strong>
          <em className={`xl-api-status is-${backendSource}`}>{backendSource === 'llm' ? 'API 已接入' : backendSource === 'fallback' ? '本地数据库回退' : '等待后端连接'}</em>
        </div>
      </div>

      <div className="xl-tavern-grid">
        <aside className="xl-tavern-side" aria-label="角色卡与世界书">
          <article className="xl-tavern-card xl-tavern-card--character">
            <p className="xl-kicker">Character Cards</p>
            <h4>轮回者角色卡</h4>
            <div className="xl-tavern-roster">
              {characters.map((char) => (
                <button
                  id={`btn-tavern-character-${char.id}`}
                  key={char.id}
                  type="button"
                  onClick={() => onToast(`${char.name}角色卡`, `${char.cultivation}、${char.realm}、当前位置：${char.location}`, char.status === '稳定' ? 'info' : 'warning')}
                  style={{ '--token-color': char.color } as React.CSSProperties}
                >
                  <i>{char.seal}</i><span>{char.name}</span><em>{char.status}</em>
                </button>
              ))}
            </div>
          </article>

          <article className="xl-tavern-card">
            <p className="xl-kicker">Lorebooks</p>
            <h4>激活世界书</h4>
            <div className="xl-lorebook-list">
              {tavernLorebooks.map((book) => (
                <button id={`btn-lorebook-${book.id}`} key={book.id} type="button" onClick={() => onToast(book.name, book.content, 'info')}>
                  <strong>{book.name}</strong>
                  <span>触发词：{book.trigger}</span>
                  <em>优先级 {book.priority}</em>
                </button>
              ))}
            </div>
          </article>
        </aside>

        <section className="xl-tavern-output" aria-label="LLM 推演输出">
          <div className="xl-output-toolbar">
            {tavernPreset.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <article className="xl-output-block tone-thinking">
            <span className="xl-tag-label">thinking</span>
            <p>{output.thinking}</p>
          </article>
          <article className="xl-output-block tone-maintext">
            <span className="xl-tag-label">maintext</span>
            <p>{output.maintext}</p>
          </article>
          <article className="xl-output-block tone-option">
            <span className="xl-tag-label">option</span>
            <div className="xl-option-list">
              {output.options.map((option, index) => (
                <button id={`btn-tavern-option-${index + 1}`} key={option} type="button" onClick={() => { setInput(option); onToast('选项已写入输入框', option, 'warning'); }}>
                  <IconChevron className="xl-icon" />{option}
                </button>
              ))}
            </div>
          </article>
          <div className="xl-output-bottom">
            <article className="xl-output-block tone-sum"><span className="xl-tag-label">sum</span><p>{output.sum}</p></article>
            <article className="xl-output-block tone-vars"><span className="xl-tag-label">vars</span>{output.vars.map((item) => <code key={item}>{item}</code>)}</article>
          </div>
        </section>

        <aside className="xl-tavern-command" aria-label="玩家输入与变量">
          <article className="xl-tavern-card">
            <p className="xl-kicker">Prompt Composer</p>
            <h4>玩家指令</h4>
            <textarea id="input-tavern-command" value={input} onChange={(event) => setInput(event.target.value)} aria-label="玩家推演指令" />
            <div className="xl-command-actions">
              <button id="btn-tavern-send" type="button" disabled={isGenerating} onClick={generateNext}>{isGenerating ? '推演中' : '生成下一幕'}</button>
              <button id="btn-tavern-branch" type="button" onClick={() => onToast('分支推演', sessionId ? `当前存档：${sessionId}` : '首次生成后将自动创建后端存档。', 'warning')}>分支推演</button>
              <button id="btn-tavern-rollback" type="button" onClick={() => onToast('回滚上一层', '后端已具备存档文件，下一步可接入按消息截断的回滚接口。', 'danger')}>回滚上一层</button>
            </div>
            <p className="xl-save-line">存档：{sessionId ?? '待创建'} · 最近写入：{lastSavedAt}</p>
          </article>

          <article className="xl-tavern-card">
            <p className="xl-kicker">Variables</p>
            <h4>世界变量快照</h4>
            <div className="xl-variable-grid">
              {variables.map((item) => (
                <div key={item.id} className={`tone-${item.tone}`}>
                  <span>{item.name}</span><strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}

function SettingsPanel({ onToast }: { onToast: (title: string, body: string, tone: ToastItem['tone']) => void }) {
  return (
    <section className="xl-panel" aria-labelledby="settings-panel-title">
      <div className="xl-section-heading"><p>天道设置</p><h3 id="settings-panel-title">纯前端推演参数原型</h3></div>
      <div className="xl-settings-grid">
        {settingRows.map((row) => (
          <article key={row.id} className="xl-setting-row">
            <header><h4>{row.name}</h4><strong>{row.value}</strong></header>
            <p>{row.desc}</p>
            <button id={`btn-${row.id}`} type="button" onClick={() => onToast(row.name, '此处为前端原型控制项，后续可接入真实 LLM 配置。', 'info')}>试验切换</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function CharacterDrawer({ character, onClose }: { character: CharacterProfile; onClose: () => void }) {
  return (
    <aside className="xl-drawer" aria-label={`${character.name}角色详情`}>
      <button id="btn-close-character-drawer" className="xl-close" type="button" onClick={onClose} aria-label="关闭角色详情"><IconClose /></button>
      <figure className="xl-drawer-portrait">
        <img src={character.portrait.src} alt={`${character.name}人物立绘`} style={{ objectPosition: character.portrait.position, transform: `scale(${character.portrait.scale})` }} />
      </figure>
      <div className="xl-drawer__seal" style={{ color: character.color }}>{character.seal}</div>
      <p className="xl-kicker">轮回者详情</p>
      <h3>{character.name}</h3>
      <strong>{character.realm} · {character.location}</strong>
      <p>{character.quote}</p>
      <section><h4>前世宿命</h4><p>{character.fate}</p></section>
      <section><h4>风险链路</h4><p>{character.risk}</p></section>
      <section><h4>所修功法</h4><p>{character.cultivation}</p></section>
      <section><h4>已显技能</h4>{character.combatSkills.map((skill) => <span className="xl-bond" key={skill}>{skill}</span>)}</section>
      <section><h4>随身物品</h4>{character.bagItems.map((item) => <span className="xl-bond xl-bond--item" key={item}>{item}</span>)}</section>
      <section><h4>近期因果</h4>{character.bonds.map((bond) => <span className="xl-bond" key={bond}>{bond}</span>)}</section>
    </aside>
  );
}

function DetailModal({ modal, onClose, onToast }: { modal: NonNullable<ModalState>; onClose: () => void; onToast: (title: string, body: string, tone: ToastItem['tone']) => void }) {
  const title = modal.type === 'record' ? modal.item.title : modal.item.name;
  return (
    <div className="xl-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="xl-modal" role="dialog" aria-modal="true" aria-labelledby="xl-modal-title">
        <button id="btn-close-detail-modal" className="xl-close" type="button" onClick={onClose} aria-label="关闭详情"><IconClose /></button>
        <p className="xl-kicker">天道卷宗详情</p>
        <h3 id="xl-modal-title">{title}</h3>
        {'desc' in modal.item && <p>{modal.item.desc}</p>}
        {'body' in modal.item && <p>{modal.item.body}</p>}
        {'threat' in modal.item && <dl><div><dt>威胁等级</dt><dd>{modal.item.threat}</dd></div><div><dt>驻留角色</dt><dd>{modal.item.characters.length ? modal.item.characters.join('、') : '暂无主角驻留'}</dd></div></dl>}
        {'actions' in modal.item && <div className="xl-action-list">{modal.item.actions.map((action) => <button id={`btn-modal-action-${modal.item.id}-${action}`} type="button" key={action} onClick={() => onToast(action, '推演指令已写入前端通知队列，等待后续 LLM 接入。', 'warning')}><IconChevron className="xl-icon" />{action}</button>)}</div>}
        {'progress' in modal.item && <div className="xl-modal-progress"><span>修行进度</span><i style={{ width: `${modal.item.progress}%` }} /></div>}
        {'state' in modal.item && <dl><div><dt>品阶</dt><dd>{modal.item.grade}</dd></div><div><dt>状态</dt><dd>{modal.item.state}</dd></div></dl>}
      </section>
    </div>
  );
}

function ToastStack({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: number) => void }) {
  return (
    <aside className="xl-toast-stack" aria-live="polite" aria-label="前端通知">
      {items.map((toast) => (
        <article key={toast.id} className={`xl-toast tone-${toast.tone}`}>
          <IconBell className="xl-icon" />
          <div><strong>{toast.title}</strong><p>{toast.body}</p></div>
          <button id={`btn-dismiss-toast-${toast.id}`} type="button" onClick={() => onDismiss(toast.id)} aria-label="关闭通知"><IconClose /></button>
        </article>
      ))}
    </aside>
  );
}

