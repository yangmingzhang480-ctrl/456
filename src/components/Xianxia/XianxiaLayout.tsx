import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSillytavern } from '../../hooks/useSillytavern';
import { XianxiaContext } from './XianxiaContext';
import { AbyssBackground } from './AbyssBackground';
import { ToastProvider, usePremiumToast } from './ToastSystem';
import { PremiumDrawer } from './PremiumDrawer';
import { MonitorPanel, CharacterDrawerContent, type CharacterProfile } from './MonitorPanel';
import { CharacterInventoryPanel, ALL_CHAR_DATA } from './CharacterInventoryPanel';
import { DualMapPanel, type RealmNode, type SceneLocation, type CharPosition } from './DualMapPanel';
import { Sidebar } from './Sidebar';
import { ChatPanel } from './ChatPanel';
import { InventoryPanel } from './InventoryPanel';
import { NpcPanel } from './NpcPanel';
import { RecordsPanel } from './RecordsPanel';
import { SettingsPanel } from './SettingsPanel';
import { GameView } from '../SillyTavern/GameView';
import { SettingsModal } from '../SillyTavern/SettingsModal';
import { LorebookModal } from '../SillyTavern/LorebookModal';
import { PresetModal } from '../SillyTavern/PresetModal';
import { VariablesModal } from '../SillyTavern/VariablesModal';
import { HistoryDrawer } from '../SillyTavern/HistoryDrawer';
import { DEFAULT_LOREBOOKS, DEFAULT_XIANXIA_PRESET } from './DefaultWorldData';
import type { PanelId } from './FakeData';

/* ---- World data for maps ---- */
const REALMS: RealmNode[] = [
  { id:'r1',name:'大日天',x:55,y:15,desc:'诸天万界之中心，太阳星所在。万千法则起源之地，仙家共尊。',connections:['r2','r3','r4'],corrupted:false },
  { id:'r2',name:'大赤天',x:20,y:30,desc:'赤色荒原无边无际。已被黑海异族攻破第二重天关。',connections:['r1','r5'],corrupted:true },
  { id:'r3',name:'太初天',x:84,y:24,desc:'生灵繁盛的古老天域。传闻太初天深处有一株世界之树。',connections:['r1','r6'],corrupted:false },
  { id:'r4',name:'钧霄天',x:80,y:54,desc:'天机阁所在。推演天象、洞察万物，诸天情报交汇之地。',connections:['r1','r7'],corrupted:false },
  { id:'r5',name:'苍莽天',x:18,y:56,desc:'蛮荒凶兽横行之地。已部分被黑海吞噬。',connections:['r2','r7'],corrupted:true },
  { id:'r6',name:'元极天',x:52,y:70,desc:'万法归宗之地。上古大能遗迹遍布，太古神山镇守此天。',connections:['r3','r7'],corrupted:false },
  { id:'r7',name:'黑海侵蚀区',x:48,y:42,desc:'黑海正在吞噬的中心漩涡。时间流速异常，空间裂缝四布。',connections:['r4','r5','r6'],corrupted:true },
];

const SCENES: SceneLocation[] = [
  { id:'loc1',name:'荒骨城',x:320,y:320,type:'city',desc:'黑海边缘唯一的人类据点。以远古巨兽骨骸筑城。' },
  { id:'loc2',name:'黑海裂隙',x:580,y:260,type:'rift',desc:'黑海中深不见底的裂隙，黑海异族涌出的主要通道。' },
  { id:'loc3',name:'太虚剑碑',x:200,y:380,type:'ruin',desc:'太虚剑宗先祖留下的剑道传承石碑。' },
  { id:'loc4',name:'血影沼泽',x:460,y:420,type:'danger',desc:'血影老人藏匿的沼泽地带，终日血雾弥漫。' },
  { id:'loc5',name:'太古神山',x:140,y:180,type:'sacred',desc:'比九天更古老的圣山，护山结界牢不可破。' },
];

const CHAR_POSITIONS: Record<string, CharPosition> = {
  luxingyao: { realmId:'r7',sx:320,sy:320 },
  limingyuan: { realmId:'r6',sx:200,sy:380 },
  yexilan: { realmId:'r7',sx:580,sy:260 },
  chulingshuang: { realmId:'r4',sx:460,sy:420 },
};

const CHARACTERS: CharacterProfile[] = [
  { id:'luxingyao',name:'陆星遥',title:'太虚剑宗·真传',realm:'紫府境·三重',avatarClass:'gold',tokenColor:'gold',location:'荒骨城·外城区',pastLife:'九世轮回者，前世为上古剑仙',isDanger:false,stats:[{key:'肉身',value:78,max:100,cssClass:'stat-fill--gold'},{key:'灵力',value:92,max:100,cssClass:'stat-fill--amethyst'},{key:'神识',value:85,max:100,cssClass:'stat-fill--ice'},{key:'道心',value:60,max:100,cssClass:'stat-fill--gold-warm'},{key:'精血',value:45,max:100,cssClass:'stat-fill--blood'},{key:'气运',value:70,max:100,cssClass:'stat-fill--jade'}] },
  { id:'limingyuan',name:'李明远',title:'太虚剑宗·外门长老',realm:'金丹境·七重',avatarClass:'jade',tokenColor:'jade',location:'太虚山脉·山门',pastLife:'前世为护山灵兽',isDanger:false,stats:[{key:'肉身',value:95,max:100,cssClass:'stat-fill--gold'},{key:'灵力',value:55,max:100,cssClass:'stat-fill--amethyst'},{key:'神识',value:40,max:100,cssClass:'stat-fill--ice'},{key:'道心',value:88,max:100,cssClass:'stat-fill--gold-warm'},{key:'精血',value:72,max:100,cssClass:'stat-fill--blood'},{key:'气运',value:50,max:100,cssClass:'stat-fill--jade'}] },
  { id:'yexilan',name:'叶汐澜',title:'太虚剑宗·真传首席',realm:'紫府境·九重',avatarClass:'ice',tokenColor:'ice',location:'黑海裂隙·第三层',pastLife:'前世为冰魄仙尊',isDanger:true,stats:[{key:'肉身',value:30,max:100,cssClass:'stat-fill--gold'},{key:'灵力',value:98,max:100,cssClass:'stat-fill--amethyst'},{key:'神识',value:92,max:100,cssClass:'stat-fill--ice'},{key:'道心',value:95,max:100,cssClass:'stat-fill--gold-warm'},{key:'精血',value:18,max:100,cssClass:'stat-fill--blood'},{key:'气运',value:40,max:100,cssClass:'stat-fill--jade'}] },
  { id:'chulingshuang',name:'楚凌霜',title:'散修·剑道天才',realm:'金丹境·九重',avatarClass:'amethyst',tokenColor:'amethyst',location:'钧霄天·天机阁',pastLife:'前世为弑神之刃',isDanger:false,stats:[{key:'肉身',value:65,max:100,cssClass:'stat-fill--gold'},{key:'灵力',value:75,max:100,cssClass:'stat-fill--amethyst'},{key:'神识',value:58,max:100,cssClass:'stat-fill--ice'},{key:'道心',value:42,max:100,cssClass:'stat-fill--gold-warm'},{key:'精血',value:80,max:100,cssClass:'stat-fill--blood'},{key:'气运',value:88,max:100,cssClass:'stat-fill--jade'}] },
];

function renderPanel(panel: PanelId, extra: { historyOpen: boolean; setHistoryOpen: (v: boolean) => void; onOpenDrawer: (c: React.ReactNode) => void; }) {
  switch (panel) {
    case 'dashboard': return <MonitorPanel characters={CHARACTERS} onSelect={c => extra.onOpenDrawer(<CharacterDrawerContent char={c} />)} />;
    case 'characters': return <CharacterInventoryPanel characters={ALL_CHAR_DATA} />;
    case 'chat': return <ChatPanel historyOpen={extra.historyOpen} setHistoryOpen={extra.setHistoryOpen} addNotification={() => {}} />;
    case 'tavern': return <GameView />;
    case 'inventory': return <InventoryPanel />;
    case 'map': return (
      <DualMapPanel realms={REALMS} scenes={SCENES} charPositions={CHAR_POSITIONS}
        characters={CHARACTERS.map(c => ({ id: c.id, name: c.name, tokenColor: c.tokenColor, realm: c.realm }))}
        onRealmClick={id => { const r = REALMS.find(x => x.id === id); if (r) extra.onOpenDrawer(<div><h2 style={{fontFamily:'var(--font-sc)',fontSize:22,fontWeight:900,color:'var(--accent-gold-bright)',marginBottom:8}}>{r.name}</h2><p style={{color:r.corrupted?'var(--blood-red-bright)':'var(--text-dim)',lineHeight:1.9}}>{r.corrupted && '⚠ 此天域已被黑海侵蚀 — '}{r.desc}</p></div>); }}
        onSceneClick={id => { const s = SCENES.find(x => x.id === id); if (s) extra.onOpenDrawer(<div><h2 style={{fontFamily:'var(--font-sc)',fontSize:22,fontWeight:900,color:'var(--accent-gold-bright)',marginBottom:8}}>{s.name}</h2><p style={{color:'var(--text-dim)',lineHeight:1.9}}>{s.desc}</p></div>); }}
        onCharClick={id => { const c = CHARACTERS.find(x => x.id === id); if (c) extra.onOpenDrawer(<CharacterDrawerContent char={c} />); }}
      />
    );
    case 'npc': return <NpcPanel />;
    case 'records': return <RecordsPanel />;
    case 'settings': return <SettingsPanel />;
  }
}

function LayoutInner() {
  const st = useSillytavern();
  const { showToast } = usePremiumToast();

  useEffect(() => {
    if (!st.initialized) return;
    (async () => {
      for (const book of DEFAULT_LOREBOOKS) {
        if (!st.lorebooks.some((l: { id: string }) => l.id === book.id)) {
          await st.addLorebook({ ...book, createdAt: Date.now(), updatedAt: Date.now() });
        }
      }
      if (st.presets.length === 0) {
        await st.addPreset({ ...DEFAULT_XIANXIA_PRESET, createdAt: Date.now(), updatedAt: Date.now() });
      }
    })();
  }, [st.initialized]);

  const [activePanel, setActivePanel] = useState<PanelId>('dashboard');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);

  const openDrawer = useCallback((content: React.ReactNode) => {
    setDrawerContent(content); setDrawerOpen(true);
  }, []);

  const ctx = useMemo(() => {
    const streamState = st.streamState ?? { isStreaming: false, thinking: '', maintext: '', options: [], sum: '' };
    return { ...st, streamState, abortStream: st.abortStream ?? (() => {}), };
  }, [st.settings, st.presets, st.lorebooks, st.chats, st.activeChat, st.activePreset, st.initialized, st.toast, st.showSettings, st.showLorebooks, st.showPresets, st.showVariables, st.streamState, st.abortStream]);

  if (!st.initialized) {
    return (
      <div className="loading-screen">
        <div className="loading-cultivation">
          <div className="loading-spinner" />
          <div className="loading-text">天道推演中…</div>
          <div className="loading-subtext">数据正在从因果长河中加载</div>
        </div>
      </div>
    );
  }

  return (
    <XianxiaContext.Provider value={ctx}>
      <AbyssBackground />
      <div className="xianxia-layout">
        <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
        <main className="xianxia-content">
          {renderPanel(activePanel, { historyOpen, setHistoryOpen, onOpenDrawer: openDrawer })}
        </main>
      </div>
      <PremiumDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </PremiumDrawer>
      {st.showSettings && st.settings && <SettingsModal settings={st.settings} updateSettings={st.updateSettings} onClose={() => st.setShowSettings(false)} />}
      {st.showLorebooks && <LorebookModal onClose={() => st.setShowLorebooks(false)} />}
      {st.showPresets && <PresetModal onClose={() => st.setShowPresets(false)} />}
      {st.showVariables && <VariablesModal onClose={() => st.setShowVariables(false)} />}
      {historyOpen && <HistoryDrawer onClose={() => setHistoryOpen(false)} />}
    </XianxiaContext.Provider>
  );
}

export function XianxiaLayout() {
  return (
    <ToastProvider>
      <LayoutInner />
    </ToastProvider>
  );
}
