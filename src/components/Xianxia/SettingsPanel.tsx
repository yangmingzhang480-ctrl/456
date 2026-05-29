import { useXianxia } from './XianxiaContext';
import { FAKE_CHARACTER } from './FakeData';
import { SettingsIcon, ChatIcon, InventoryIcon, NpcIcon } from './Icons';

export function SettingsPanel() {
  const { openSettings, openLorebooks, openPresets, openVariables } = useXianxia();

  return (
    <article id="panel-settings" className="xianxia-panel settings-panel">
      <h3 className="section-title">天道法则</h3>
      <div className="settings-grid">
        <div className="settings-card" onClick={openSettings}>
          <div className="settings-card-icon"><SettingsIcon width="1em" height="1em" /></div>
          <div className="settings-card-title">API 设置</div>
          <div className="settings-card-desc">配置主次 API、测试连通性</div>
        </div>
        <div className="settings-card" onClick={openLorebooks}>
          <div className="settings-card-icon"><InventoryIcon width="1em" height="1em" /></div>
          <div className="settings-card-title">世界书管理</div>
          <div className="settings-card-desc">导入管理世界书与条目</div>
        </div>
        <div className="settings-card" onClick={openPresets}>
          <div className="settings-card-icon"><ChatIcon width="1em" height="1em" /></div>
          <div className="settings-card-title">预设管理</div>
          <div className="settings-card-desc">调整采样参数与提示词</div>
        </div>
        <div className="settings-card" onClick={openVariables}>
          <div className="settings-card-icon"><NpcIcon width="1em" height="1em" /></div>
          <div className="settings-card-title">变量管理</div>
          <div className="settings-card-desc">编辑游戏状态变量</div>
        </div>
      </div>
      <div className="settings-character-card">
        <div className="npc-avatar" style={{ width: 56, height: 56, fontSize: 24 }}>
          {FAKE_CHARACTER.name.charAt(0)}
        </div>
        <div>
          <div className="settings-char-name">{FAKE_CHARACTER.name}</div>
          <div className="settings-char-realm">{FAKE_CHARACTER.realm} · {FAKE_CHARACTER.title}</div>
        </div>
      </div>
    </article>
  );
}
