import React, { useState } from "react";

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
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "alert": return "⚠️";
      case "system": return "🔧";
      default: return "📧";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "alert": return "text-red-600 bg-red-50";
      case "system": return "text-blue-600 bg-blue-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Professor Notifications</h1>
        <div className="flex items-center gap-3">
          <img
            src="/user.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Professor</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 shadow-md rounded flex items-center">
          <div className="text-3xl mr-4">📧</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Unread</h3>
            <p className="text-2xl font-bold text-purple-700">{unreadCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 shadow-md rounded flex items-center">
          <div className="text-3xl mr-4">🔔</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Total</h3>
            <p className="text-2xl font-bold text-purple-700">{totalCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 shadow-md rounded flex items-center">
          <div className="text-3xl mr-4">⚠️</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Alerts</h3>
            <p className="text-2xl font-bold text-purple-700">{alertCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 shadow-md rounded flex items-center">
          <div className="text-3xl mr-4">🔧</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">System</h3>
            <p className="text-2xl font-bold text-purple-700">{systemCount}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={markAllAsRead}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Mark All Read
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["all", "unread", "important", "system"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded capitalize ${
              filter === tab
                ? "bg-purple-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            } transition`}
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
              className={`bg-white p-4 shadow-md rounded cursor-pointer hover:shadow-lg transition ${
                !notification.isRead ? "border-l-4 border-purple-500" : ""
              }`}
              onClick={() => setSelectedNotification(notification)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                    <h3 className={`font-semibold ${!notification.isRead ? "text-purple-700" : "text-gray-700"}`}>
                      {notification.subject}
                    </h3>
                    {notification.isImportant && (
                      <span className="text-yellow-500">⭐</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-xs ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                    <span className="text-gray-500 text-sm">{notification.timestamp}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="text-purple-600 hover:text-purple-800 text-sm"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notification.id);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-700">Notification Details</h2>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedNotification.subject}</h3>
                  <p className="text-sm text-gray-500">{selectedNotification.timestamp}</p>
                </div>
                <div className={`inline-block px-2 py-1 rounded text-sm ${getTypeColor(selectedNotification.type)}`}>
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
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => {
                      dismissNotification(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
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