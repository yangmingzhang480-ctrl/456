import type { NotificationItem } from './FakeData';

interface NotificationSystemProps {
  notifications: NotificationItem[];
}

export function NotificationSystem({ notifications }: NotificationSystemProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-overlay" role="alert" aria-live="polite">
      {notifications.map((n) => (
        <div key={n.id} className={`notification-item notification-item--${n.type}`}>
          <div className="notification-title">{n.title}</div>
          <div className="notification-message">{n.message}</div>
        </div>
      ))}
    </div>
  );
}
