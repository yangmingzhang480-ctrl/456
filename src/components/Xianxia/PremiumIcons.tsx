/**
 * Premium SVG Icon Library — Dark Fantasy Xianxia Glyphs
 * Zero emoji, all hand-crafted cultivation-themed vector icons
 */
import type { SVGProps } from 'react';

function Svg({ children, className, size = 20, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}
      viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className={className} {...props}>
      {children}
    </svg>
  );
}

/* ---- Navigation Icons ---- */
export function MonitorNavIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props}><circle cx="12" cy="12" r="10"/><polygon points="12,2 22,22 2,22" stroke="none" fill="currentColor" fillOpacity="0.1"/><line x1="12" y1="6" x2="12" y2="10"/><line x1="12" y1="14" x2="12" y2="18"/><line x1="8" y1="12" x2="16" y2="12"/></Svg>;
}
export function MapNavIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props}><circle cx="9" cy="6" r="1.8"/><circle cx="17" cy="10" r="1.8"/><circle cx="7" cy="17" r="1.8"/><line x1="9" y1="6" x2="17" y2="10"/><line x1="9" y1="6" x2="7" y2="17"/><line x1="17" y1="10" x2="7" y2="17"/></Svg>;
}
export function SkillsNavIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props}><polygon points="12,2 21,21 3,21"/><line x1="12" y1="2" x2="12" y2="21"/><line x1="12" y1="9" x2="18" y2="16"/><line x1="12" y1="9" x2="6" y2="16"/></Svg>;
}
export function InventoryNavIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props}><path d="M3 5l2-3h14l2 3v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><line x1="3" y1="5" x2="21" y2="5"/><circle cx="12" cy="15" r="2.5" strokeDasharray="1 2"/></Svg>;
}
export function ChatNavIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="12" y2="13"/></Svg>;
}
export function SettingsNavIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Svg>;
}

/* ---- Utility Icons ---- */
export function PinLocationIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props} size={14}><circle cx="12" cy="9" r="3"/><path d="M12 1C6.5 1 3 5.5 3 11c0 5 9 14 9 14s9-9 9-14c0-5.5-3.5-10-9-10z"/></Svg>;
}
export function ImportIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props} size={16}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></Svg>;
}
export function BookIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props} size={16}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></Svg>;
}
export function ExportIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props} size={16}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>;
}
export function RestoreIcon(props: SVGProps<SVGSVGElement>) {
  return <Svg {...props} size={16}><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></Svg>;
}
