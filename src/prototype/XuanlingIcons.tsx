import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Svg({ children, title, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} {...props}>
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

export function IconRebirth(props: IconProps) {
  return <Svg {...props}><path d="M12 2.5c3.8 2.1 6.1 5.1 6.1 8.6 0 4.2-2.8 7.6-6.1 10.4C8.7 18.7 5.9 15.3 5.9 11.1c0-3.5 2.3-6.5 6.1-8.6Z"/><path d="M12 6.6v10.1M8.3 10.8h7.4M9.2 14.2h5.6"/></Svg>;
}

export function IconMap(props: IconProps) {
  return <Svg {...props}><path d="M3.5 5.2 8.2 3l7.6 2.5 4.7-2.1v15.4L15.8 21 8.2 18.5l-4.7 2.1V5.2Z"/><path d="M8.2 3v15.5M15.8 5.5V21"/></Svg>;
}

export function IconSkill(props: IconProps) {
  return <Svg {...props}><path d="M12 3l2.2 5.1 5.3.5-4 3.6 1.2 5.2L12 14.6l-4.7 2.8 1.2-5.2-4-3.6 5.3-.5L12 3Z"/><path d="M12 8.5v3.8M10.1 10.4h3.8"/></Svg>;
}

export function IconInventory(props: IconProps) {
  return <Svg {...props}><path d="M5 8h14l-1.1 11H6.1L5 8Z"/><path d="M8.5 8V6.7A3.5 3.5 0 0 1 12 3.2a3.5 3.5 0 0 1 3.5 3.5V8"/><path d="M8.2 12h7.6M9 15.5h6"/></Svg>;
}

export function IconScroll(props: IconProps) {
  return <Svg {...props}><path d="M6.5 4h10A2.5 2.5 0 0 1 19 6.5V17a3 3 0 0 1-3 3H6.5A2.5 2.5 0 0 1 4 17.5V6.5A2.5 2.5 0 0 1 6.5 4Z"/><path d="M7.5 8h9M7.5 12h7M7.5 16h5"/></Svg>;
}

export function IconSettings(props: IconProps) {
  return <Svg {...props}><path d="M12 8.2A3.8 3.8 0 1 0 12 15.8 3.8 3.8 0 0 0 12 8.2Z"/><path d="M12 2.8v3M12 18.2v3M4.2 6.1l2.1 2.1M17.7 15.8l2.1 2.1M2.8 12h3M18.2 12h3M4.2 17.9l2.1-2.1M17.7 8.2l2.1-2.1"/></Svg>;
}

export function IconWarning(props: IconProps) {
  return <Svg {...props}><path d="M12 3.2 21 19H3L12 3.2Z"/><path d="M12 8.5v5.2M12 17h.1"/></Svg>;
}

export function IconClose(props: IconProps) {
  return <Svg {...props}><path d="M6 6l12 12M18 6 6 18"/></Svg>;
}

export function IconChevron(props: IconProps) {
  return <Svg {...props}><path d="m9 5 7 7-7 7"/></Svg>;
}

export function IconArray(props: IconProps) {
  return <Svg {...props}><circle cx="12" cy="12" r="7.5"/><path d="M12 4.5v15M4.5 12h15M6.7 6.7l10.6 10.6M17.3 6.7 6.7 17.3"/><circle cx="12" cy="12" r="2.2"/></Svg>;
}

export function IconCity(props: IconProps) {
  return <Svg {...props}><path d="M4 20V8l4-2 4 2 4-2 4 2v12H4Z"/><path d="M7 20v-5h3v5M14 20v-5h3v5M7 10h2M11 10h2M15 10h2"/></Svg>;
}

export function IconRift(props: IconProps) {
  return <Svg {...props}><path d="M13.5 2.8 8.2 9.7l4.4 1.1-2.1 10.4 5.4-7.9-4.1-1.1 1.7-9.4Z"/><path d="M5.2 5.7c-1.7 2.1-2.2 4.5-1.4 7.1M18.8 18.3c1.7-2.1 2.2-4.5 1.4-7.1"/></Svg>;
}

export function IconRelic(props: IconProps) {
  return <Svg {...props}><path d="M8 21h8l-1-15-3-3-3 3-1 15Z"/><path d="M9 8h6M9.4 13h5.2M10 17h4"/></Svg>;
}

export function IconSacred(props: IconProps) {
  return <Svg {...props}><path d="M12 3 4 20h16L12 3Z"/><path d="M8.5 20 12 11l3.5 9M9.7 8.5h4.6"/></Svg>;
}

export function IconToken(props: IconProps) {
  return <Svg {...props}><path d="M12 2.8 19.2 7v10L12 21.2 4.8 17V7L12 2.8Z"/><path d="M12 7v10M8.4 9.1h7.2M8.4 14.9h7.2"/></Svg>;
}

export function IconBell(props: IconProps) {
  return <Svg {...props}><path d="M6.5 10.5a5.5 5.5 0 0 1 11 0v4.2l2 2.8h-15l2-2.8v-4.2Z"/><path d="M9.8 19.3a2.4 2.4 0 0 0 4.4 0"/></Svg>;
}
