import type { PanelId } from './FakeData';
import { DashboardIcon, ChatIcon, TavernIcon, InventoryIcon, MapIcon, NpcIcon, RecordsIcon, SettingsIcon } from './Icons';
import { MonitorNavIcon, MapNavIcon, SkillsNavIcon, InventoryNavIcon, ChatNavIcon, SettingsNavIcon } from './PremiumIcons';

interface SidebarProps {
  activePanel: PanelId;
  onPanelChange: (id: PanelId) => void;
}

interface NavItem {
  id: PanelId;
  label: string;
  Icon: typeof DashboardIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: '轮回监控台', Icon: MonitorNavIcon },
  { id: 'characters', label: '轮回者详情', Icon: DashboardIcon },
  { id: 'map', label: '玄灵双轨舆图', Icon: MapNavIcon },
  { id: 'chat', label: '天机推演', Icon: ChatNavIcon },
  { id: 'tavern', label: '酒馆模式', Icon: TavernIcon },
  { id: 'inventory', label: '须弥纳戒', Icon: InventoryNavIcon },
  { id: 'npc', label: '因果缘法', Icon: NpcIcon },
  { id: 'records', label: '轮回秘录', Icon: RecordsIcon },
  { id: 'settings', label: '天道法则', Icon: SettingsNavIcon },
];

export function Sidebar({ activePanel, onPanelChange }: SidebarProps) {
  return (
    <nav className="xianxia-sidebar" aria-label="主菜单">
      <div className="sidebar-header">
        <span className="sidebar-title">玄灵</span>
        <span className="sidebar-subtitle">元极天</span>
      </div>
      <div className="sidebar-divider" />
      <ul className="sidebar-nav">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <li key={id}>
            <button
              id={`nav-${id}`}
              className={`sidebar-item${activePanel === id ? ' sidebar-item--active' : ''}`}
              onClick={() => onPanelChange(id)}
              title={label}
            >
              <Icon className="sidebar-icon" />
              <span className="sidebar-label">{label}</span>
              {activePanel === id && <span className="sidebar-active-indicator" />}
            </button>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        <div className="sidebar-divider" />
        <div className="sidebar-version">元极 · 轮回</div>
      </div>
    </nav>
  );
}
