import { useState, useCallback, useMemo, useEffect } from 'react';
import { useSillytavern } from '../../hooks/useSillytavern';
import { XianxiaContext } from './XianxiaContext';
import { Sidebar } from './Sidebar';
import { DashboardPanel } from './DashboardPanel';
import { ChatPanel } from './ChatPanel';
import { InventoryPanel } from './InventoryPanel';
import { MapPanel } from './MapPanel';
import { NpcPanel } from './NpcPanel';
import { RecordsPanel } from './RecordsPanel';
import { SettingsPanel } from './SettingsPanel';
import { NotificationSystem } from './NotificationSystem';
import { GameView } from '../SillyTavern/GameView';
import { SettingsModal } from '../SillyTavern/SettingsModal';
import { LorebookModal } from '../SillyTavern/LorebookModal';
import { PresetModal } from '../SillyTavern/PresetModal';
import { VariablesModal } from '../SillyTavern/VariablesModal';
import { HistoryDrawer } from '../SillyTavern/HistoryDrawer';
import { DEFAULT_LOREBOOKS, DEFAULT_XIANXIA_PRESET } from './DefaultWorldData';
import type { PanelId, NotificationItem } from './FakeData';

function renderPanel(panel: PanelId, extra: { historyOpen: boolean; setHistoryOpen: (v: boolean) => void; addNotification: (n: Omit<NotificationItem, 'id'>) => void }) {
  switch (panel) {
    case 'dashboard': return <DashboardPanel />;
    case 'chat': return <ChatPanel historyOpen={extra.historyOpen} setHistoryOpen={extra.setHistoryOpen} addNotification={extra.addNotification} />;
    case 'tavern': return <GameView />;
    case 'inventory': return <InventoryPanel />;
    case 'map': return <MapPanel />;
    case 'npc': return <NpcPanel />;
    case 'records': return <RecordsPanel />;
    case 'settings': return <SettingsPanel />;
  }
}

export function XianxiaLayout() {
  const st = useSillytavern();

  // 自动初始化默认世界书和预设
  useEffect(() => {
    if (!st.initialized) return;
    const initDefaults = async () => {
      for (const book of DEFAULT_LOREBOOKS) {
        const exists = st.lorebooks.some((l: { id: string }) => l.id === book.id);
        if (!exists) {
          await st.addLorebook({ ...book, createdAt: Date.now(), updatedAt: Date.now() });
        }
      }
      if (st.presets.length === 0) {
        await st.addPreset({ ...DEFAULT_XIANXIA_PRESET, createdAt: Date.now(), updatedAt: Date.now() });
      }
    };
    initDefaults();
  }, [st.initialized]); // eslint-disable-line react-hooks/exhaustive-deps

  const [activePanel, setActivePanel] = useState<PanelId>('dashboard');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((n: Omit<NotificationItem, 'id'>) => {
    const id = crypto.randomUUID();
    setNotifications(prev => [...prev, { ...n, id }]);
    setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== id)), n.duration ?? 4000);
  }, []);

  const ctx = useMemo(() => {
    const streamState = st.streamState ?? { isStreaming: false, thinking: '', maintext: '', options: [], sum: '' };
    return {
      ...st,
      streamState,
      abortStream: st.abortStream ?? (() => {}),
    };
  }, [
    st.settings, st.presets, st.lorebooks, st.chats, st.activeChat, st.activePreset,
    st.initialized, st.toast, st.showSettings, st.showLorebooks, st.showPresets,
    st.showVariables, st.streamState, st.abortStream,
  ]);

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
      <div className="xianxia-layout">
        <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
        <main className="xianxia-content">
          {renderPanel(activePanel, { historyOpen, setHistoryOpen, addNotification })}
        </main>
      </div>
      <NotificationSystem notifications={notifications} />
      {st.showSettings && st.settings && (
        <SettingsModal
          settings={st.settings}
          updateSettings={st.updateSettings}
          onClose={() => st.setShowSettings(false)}
        />
      )}
      {st.showLorebooks && <LorebookModal onClose={() => st.setShowLorebooks(false)} />}
      {st.showPresets && <PresetModal onClose={() => st.setShowPresets(false)} />}
      {st.showVariables && <VariablesModal onClose={() => st.setShowVariables(false)} />}
      {historyOpen && <HistoryDrawer onClose={() => setHistoryOpen(false)} />}
      <div className="ash-container" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="ash-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 10}s`,
              transform: `scale(${0.3 + Math.random() * 0.7})`,
            }}
          />
        ))}
      </div>
    </XianxiaContext.Provider>
  );
}
