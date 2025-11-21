import React, { useState } from "react";
import '../../styles/admin-user-management.css'

const ProfessorNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const [filter, setFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.isRead;
    if (filter === "important") return notification.isImportant;
    if (filter === "system") return notification.type === "system";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalCount = notifications.length;
  const alertCount = notifications.filter((n) => n.type === "alert").length;
  const systemCount = notifications.filter((n) => n.type === "system").length;

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "alert":
        return "⚠️";
      case "system":
        return "🔧";
      default:
        return "📧";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "alert":
        return "text-red-600 bg-red-50";
      case "system":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="aum-container">
      {/* Header */}
      <div className="aum-header">
        <div>
          <div className="aum-title">Professor Notifications</div>
          <div className="aum-sub">Latest messages and system alerts</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="aum-card flex items-center">
          <div className="aum-badge" style={{ marginRight: 12 }}>📧</div>
          <div>
            <h3 className="aum-list-title">Unread</h3>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--foc-navy)' }}>{unreadCount}</p>
          </div>
        </div>
        <div className="aum-card flex items-center">
          <div className="aum-badge" style={{ marginRight: 12 }}>🔔</div>
          <div>
            <h3 className="aum-list-title">Total</h3>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--foc-navy)' }}>{totalCount}</p>
          </div>
        </div>
        <div className="aum-card flex items-center">
          <div className="aum-badge" style={{ marginRight: 12 }}>⚠️</div>
          <div>
            <h3 className="aum-list-title">Alerts</h3>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--foc-navy)' }}>{alertCount}</p>
          </div>
        </div>
        <div className="aum-card flex items-center">
          <div className="aum-badge" style={{ marginRight: 12 }}>🔧</div>
          <div>
            <h3 className="aum-list-title">System</h3>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--foc-navy)' }}>{systemCount}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="aum-actions" style={{ marginBottom: 18 }}>
        <button onClick={markAllAsRead} className="aum-btn-primary">Mark All Read</button>
        <button onClick={() => window.location.reload()} className="aum-btn-ghost">Refresh</button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["all", "unread", "important", "system"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={filter === tab ? 'aum-btn-primary' : 'aum-btn-ghost'}
            style={{ textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`aum-card cursor-pointer transition`}
              style={!notification.isRead ? { borderLeft: '4px solid var(--foc-gold)' } : {}}
              onClick={() => setSelectedNotification(notification)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="aum-badge" style={{ padding: '6px 8px' }}>{getTypeIcon(notification.type)}</div>
                    <h3 className={`font-semibold ${!notification.isRead ? "text-[var(--foc-navy)]" : "text-gray-700"}`}>
                      {notification.subject}
                    </h3>
                    {notification.isImportant && (
                      <span style={{ color: 'var(--foc-gold)' }}>⭐</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                  <div className="flex items-center gap-4">
                    <div className="aum-badge" style={{ background: 'transparent', padding: 0 }}>{notification.type}</div>
                    <span className="text-gray-500 text-sm">{notification.timestamp}</span>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      style={{ color: 'var(--foc-navy)', fontSize: 13 }}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notification.id);
                    }}
                    style={{ color: '#DC2626', fontSize: 13 }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No notifications found</p>
          </div>
        )}
      </div>

      {/* Notification Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="aum-card max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold" style={{ color: 'var(--foc-navy)' }}>Notification Details</h2>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="aum-btn-ghost"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedNotification.subject}</h3>
                  <p className="text-sm text-gray-500">{selectedNotification.timestamp}</p>
                </div>
                <div className={`inline-block px-2 py-1 rounded text-sm`} style={{ background: 'transparent' }}>
                  {selectedNotification.type}
                </div>
                <p className="text-gray-700">{selectedNotification.message}</p>
                <div className="flex gap-4 pt-4">
                  {!selectedNotification.isRead && (
                    <button
                      onClick={() => {
                        markAsRead(selectedNotification.id);
                        setSelectedNotification({ ...selectedNotification, isRead: true });
                      }}
                      className="aum-btn-primary"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => {
                      dismissNotification(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                    className="aum-btn-ghost"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessorNotification;