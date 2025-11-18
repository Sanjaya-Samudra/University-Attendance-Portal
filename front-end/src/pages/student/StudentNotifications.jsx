import React, { useState, useEffect } from "react";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    let filtered = [...notifications];

    switch (activeFilter) {
      case "unread":
        filtered = notifications.filter(n => !n.isRead);
        break;
      case "important":
        filtered = notifications.filter(n => n.isImportant);
        break;
      case "attendance":
        filtered = notifications.filter(n => n.type === "attendance");
        break;
      case "academic":
        filtered = notifications.filter(n => n.type === "academic");
        break;
      case "system":
        filtered = notifications.filter(n => n.type === "system");
        break;
      default:
        filtered = notifications;
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeFilter]);

  const loadNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // notifications will be loaded from backend; remove demo entries
      setNotifications([]);
    } catch {
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "attendance":
        return "fas fa-user-clock";
      case "academic":
        return "fas fa-graduation-cap";
      case "system":
        return "fas fa-cog";
      case "important":
        return "fas fa-exclamation-triangle";
      default:
        return "fas fa-bell";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "attendance":
        return "border-l-blue-500";
      case "academic":
        return "border-l-green-500";
      case "system":
        return "border-l-gray-500";
      case "important":
        return "border-l-red-500";
      default:
        return "border-l-purple-500";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    important: notifications.filter(n => n.isImportant).length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700 flex items-center">
          <i className="fas fa-bell mr-2"></i>
          My Notifications
        </h1>
        <div className="flex items-center gap-3">
          <img
            src="/user.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Student</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={markAllAsRead}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <i className="fas fa-check-double mr-2"></i>
          Mark All Read
        </button>
        <button
          onClick={loadNotifications}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          <i className="fas fa-sync-alt mr-2"></i>
          Refresh
        </button>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded text-center">
          <div className="flex items-center justify-center mb-2">
            <i className="fas fa-bell text-blue-500 text-2xl"></i>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Notifications</div>
        </div>
        <div className="bg-red-50 p-4 rounded text-center">
          <div className="flex items-center justify-center mb-2">
            <i className="fas fa-envelope text-red-500 text-2xl"></i>
          </div>
          <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
          <div className="text-sm text-gray-600">Unread</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded text-center">
          <div className="flex items-center justify-center mb-2">
            <i className="fas fa-exclamation-triangle text-yellow-500 text-2xl"></i>
          </div>
          <div className="text-2xl font-bold text-yellow-600">{stats.important}</div>
          <div className="text-sm text-gray-600">Important</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded shadow">
        {[
          { key: "all", label: "All Notifications", icon: "fas fa-list" },
          { key: "unread", label: "Unread", icon: "fas fa-envelope" },
          { key: "important", label: "Important", icon: "fas fa-star" },
          { key: "attendance", label: "Attendance", icon: "fas fa-user-clock" },
          { key: "academic", label: "Academic", icon: "fas fa-graduation-cap" },
          { key: "system", label: "System", icon: "fas fa-cog" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded flex items-center gap-2 transition ${
              activeFilter === tab.key
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <i className={tab.icon}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-8">
          <i className="fas fa-spinner fa-spin text-2xl text-purple-600"></i>
          <p className="mt-2 text-gray-600">Loading notifications...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-bell-slash text-4xl mb-4"></i>
              <p>No notifications found.</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition border-l-4 ${
                  getNotificationColor(notification.type)
                } ${!notification.isRead ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <i className={`${getNotificationIcon(notification.type)} text-xl mt-1 ${
                    notification.isImportant ? "text-red-500" : "text-gray-500"
                  }`}></i>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                      {notification.isImportant && (
                        <i className="fas fa-star text-red-500"></i>
                      )}
                      {!notification.isRead && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{formatTimestamp(notification.timestamp)}</span>
                      {notification.courseId && (
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {notification.courseId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;