import React, { useState, useCallback, createContext, useContext, type ReactNode } from 'react';

type ToastType = 'success' | 'warning' | 'danger' | 'info';

interface ToastItem { id: string; type: ToastType; title: string; message: string; fading: boolean; }

interface ToastCtx { showToast: (type: ToastType, title: string, message: string) => void; }

const ToastContext = createContext<ToastCtx>({ showToast: () => {} });
export const usePremiumToast = () => useContext(ToastContext);

const ICON_MAP: Record<ToastType, React.ReactNode> = {
  success: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="7 12 11 16 17 8"/></svg>,
  warning: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e67e22" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  danger: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  info: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 8"/></svg>,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, type, title, message, fading: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, fading: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 400);
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-premium-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast-premium toast-premium--${t.type}${t.fading ? ' toast-premium--fade-out' : ''}`}>
            <div className="toast-premium-icon">{ICON_MAP[t.type]}</div>
            <div className="toast-premium-content">
              <div className="toast-premium-title">{t.title}</div>
              <div className="toast-premium-message">{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
