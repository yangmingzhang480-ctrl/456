import type { ReactNode } from 'react';

interface DrawerProps { open: boolean; onClose: () => void; children: ReactNode; }

export function PremiumDrawer({ open, onClose, children }: DrawerProps) {
  return (
    <>
      <div className={`drawer-premium-overlay${open ? ' drawer-premium-overlay--visible' : ''}`} onClick={onClose} />
      <aside className={`drawer-premium${open ? ' drawer-premium--visible' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="drawer-premium-close" onClick={onClose} aria-label="关闭抽屉">✕</button>
        {children}
      </aside>
    </>
  );
}

interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; }

export function PremiumModal({ open, onClose, title, children }: ModalProps) {
  return (
    <div className={`modal-premium-overlay${open ? ' modal-premium-overlay--visible' : ''}`} onClick={onClose}>
      <div className="modal-premium" onClick={e => e.stopPropagation()}>
        <button className="modal-premium-close" onClick={onClose} aria-label="关闭">✕</button>
        <h2 className="modal-premium-header">{title}</h2>
        <div className="modal-premium-body">{children}</div>
      </div>
    </div>
  );
}
