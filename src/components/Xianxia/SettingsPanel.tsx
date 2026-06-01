import { useState, useRef } from 'react';
import { useXianxia } from './XianxiaContext';
import { FAKE_CHARACTER } from './FakeData';
import { SettingsIcon, ChatIcon, InventoryIcon, NpcIcon } from './Icons';
import { ImportIcon, BookIcon, ExportIcon, RestoreIcon } from './PremiumIcons';
import { usePremiumToast } from './ToastSystem';
import { PremiumModal } from './PremiumDrawer';

export function SettingsPanel() {
  const { openSettings, openLorebooks, openPresets, openVariables } = useXianxia();
  const { showToast } = usePremiumToast();
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        const name = data.name || '未命名';
        const count = data.entries ? (Array.isArray(data.entries) ? data.entries.length : Object.keys(data.entries).length) : 0;
        setImportStatus({ type: 'success', msg: `✓ 「${name}」导入成功 — ${count || '?'} 条数据` });
        showToast('success', '导入成功', `「${name}」已加入天道法则`);
      } catch (err) {
        setImportStatus({ type: 'error', msg: `✘ 解析失败：${(err as Error).message}` });
        showToast('danger', '导入失败', (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExport = () => {
    const data = { version: '3.0.0', name: '玄灵界·元极天 数据备份', exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `玄灵界·元极天_${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
    showToast('success', '导出成功', '天道法则已导出为 JSON 文件');
  };

  return (
    <section className="xianxia-panel" aria-label="天道法则">
      <header className="panel-header">
        <h1 className="panel-title"><span className="panel-title-decoration" />天道法则</h1>
        <p className="panel-subtitle">调御天地灵气，设定因果运行之法则</p>
      </header>

      <div className="section-heading-premium">系统配置</div>
      <div className="settings-grid">
        <div className="settings-card" onClick={openSettings} id="settings-card-api">
          <div className="settings-card-icon"><SettingsIcon width="1em" height="1em" /></div>
          <div className="settings-card-title">API 设置</div>
          <div className="settings-card-desc">配置天道连接、测试连通性</div>
        </div>
        <div className="settings-card" onClick={openLorebooks} id="settings-card-lorebook">
          <div className="settings-card-icon"><BookIcon /></div>
          <div className="settings-card-title">世界书管理</div>
          <div className="settings-card-desc">导入管理世界法则条目</div>
        </div>
        <div className="settings-card" onClick={openPresets} id="settings-card-preset">
          <div className="settings-card-icon"><ChatIcon width="1em" height="1em" /></div>
          <div className="settings-card-title">预设管理</div>
          <div className="settings-card-desc">调整推理参数与提示词</div>
        </div>
        <div className="settings-card" onClick={openVariables} id="settings-card-vars">
          <div className="settings-card-icon"><NpcIcon width="1em" height="1em" /></div>
          <div className="settings-card-title">变量管理</div>
          <div className="settings-card-desc">编辑游戏状态变量</div>
        </div>
      </div>

      <div className="section-heading-premium">数据导入 / 导出</div>
      <div style={{ maxWidth: 660, marginBottom: 36 }}>
        <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.8 }}>
          导入 SillyTavern 兼容的 JSON 格式预设文件，包括世界书（Lorebook）、角色卡、对话预设（Chat Preset）或完整备份包。
        </p>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} id="import-file-input" onChange={handleImport} />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn-premium btn-premium--primary" id="btn-import-preset" onClick={() => fileRef.current?.click()}>
            <ImportIcon /> 导入 JSON 预设
          </button>
          <button className="btn-premium" id="btn-export-data" onClick={handleExport}>
            <ExportIcon /> 导出当前数据
          </button>
        </div>
        {importStatus && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: 13,
            border: `1px solid ${importStatus.type === 'success' ? 'rgba(46,204,113,0.2)' : 'rgba(192,57,43,0.2)'}`,
            background: importStatus.type === 'success' ? 'rgba(46,204,113,0.05)' : 'rgba(192,57,43,0.05)',
            color: importStatus.type === 'success' ? 'var(--jade)' : 'var(--blood-red-bright)' }}>
            {importStatus.msg}
          </div>
        )}
      </div>

      <div className="section-heading-premium">世界重置</div>
      <div style={{ maxWidth: 660 }}>
        <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 14, lineHeight: 1.8 }}>
          重置将清空所有本地数据（包括已导入的世界书、预设、对话记录），恢复为初始玄灵界数据。此操作不可撤销。
        </p>
        <button className="btn-premium btn-premium--danger" id="btn-reset-world" onClick={() => setShowResetModal(true)}>
          <RestoreIcon /> 重置天道法则
        </button>
      </div>

      <div className="settings-character-card" style={{ marginTop: 32 }}>
        <div className="npc-avatar" style={{ width: 56, height: 56, fontSize: 24 }}>{FAKE_CHARACTER.name.charAt(0)}</div>
        <div>
          <div className="settings-char-name">{FAKE_CHARACTER.name}</div>
          <div className="settings-char-realm">{FAKE_CHARACTER.realm} · {FAKE_CHARACTER.title}</div>
        </div>
      </div>

      <PremiumModal open={showResetModal} onClose={() => setShowResetModal(false)} title="重置天道法则">
        <p style={{ color: 'var(--blood-red-bright)', marginBottom: 16 }}>此操作将清除所有本地数据。此操作不可撤销。</p>
        <p style={{ color: 'var(--text-dim)', marginBottom: 20 }}>重置后将恢复为初始的玄灵界数据。</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-premium btn-premium--danger" id="btn-confirm-reset" onClick={() => { setShowResetModal(false); showToast('info', '天道重置', '天地法则已回归原初状态'); }}>
            确认重置
          </button>
          <button className="btn-premium" id="btn-cancel-reset" onClick={() => setShowResetModal(false)}>取消</button>
        </div>
      </PremiumModal>
    </section>
  );
}
