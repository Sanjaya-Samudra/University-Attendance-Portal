import React, { useState, useEffect } from "react";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

      // Notifications will be loaded from backend; removed mock/demo entries
      setNotifications([]);
    } catch {
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    setNotifications(updatedNotifications);
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    );
    setNotifications(updatedNotifications);
  };

  const dismissNotification = (id) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    setShowModal(false);
  };

  const openNotificationModal = (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNotification(null);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "attendance":
        return "fas fa-user-clock";
      case "system":
        return "fas fa-cog";
      case "important":
        return "fas fa-star";
      default:
        return "fas fa-bell";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "attendance":
        return "border-l-blue-500";
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
    unread: notifications.filter(n => !n.isRead).length,
    total: notifications.length,
    important: notifications.filter(n => n.isImportant).length,
    system: notifications.filter(n => n.type === "system").length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700 flex items-center">
          <i className="fas fa-bell mr-2"></i>
          Student Notification Center
        </h1>
        <div className="flex items-center gap-3">
          <img
            src="/user.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Professor</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back
        </button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <div className="flex items-center">
            <i className="fas fa-envelope text-red-500 text-2xl mr-3"></i>
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
              <div className="text-sm text-gray-600">Unread Notifications</div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center">
            <i className="fas fa-bell text-blue-500 text-2xl mr-3"></i>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Notifications</div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <div className="flex items-center">
            <i className="fas fa-exclamation-triangle text-yellow-500 text-2xl mr-3"></i>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{stats.important}</div>
              <div className="text-sm text-gray-600">Important Alerts</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-500">
          <div className="flex items-center">
            <i className="fas fa-cog text-gray-500 text-2xl mr-3"></i>
            <div>
              <div className="text-2xl font-bold text-gray-600">{stats.system}</div>
              <div className="text-sm text-gray-600">System Messages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white p-4 rounded shadow">
        {[
          { key: "all", label: "All Notifications", icon: "fas fa-list" },
          { key: "unread", label: "Unread", icon: "fas fa-envelope" },
          { key: "important", label: "Important", icon: "fas fa-star" },
          { key: "attendance", label: "Attendance", icon: "fas fa-user-clock" },
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
                onClick={() => openNotificationModal(notification)}
                className={`bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition border-l-4 ${
                  getNotificationColor(notification.type)
                } ${!notification.isRead ? "bg-blue-50" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
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
                  <i className="fas fa-chevron-right text-gray-400"></i>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Notification Modal */}
      {showModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-700">Notification Details</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg">{selectedNotification.title}</h4>
                  <p className="text-sm text-gray-500">{formatTimestamp(selectedNotification.timestamp)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedNotification.type === "important" ? "bg-red-100 text-red-700" :
                    selectedNotification.type === "attendance" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {selectedNotification.type.charAt(0).toUpperCase() + selectedNotification.type.slice(1)}
                  </span>
                  {selectedNotification.isImportant && (
                    <i className="fas fa-star text-red-500"></i>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-700">{selectedNotification.message}</p>
                </div>

                {selectedNotification.studentId && (
                  <div className="text-sm text-gray-600">
                    <strong>Student ID:</strong> {selectedNotification.studentId}
                  </div>
                )}

                {selectedNotification.courseId && (
                  <div className="text-sm text-gray-600">
                    <strong>Course:</strong> {selectedNotification.courseId}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => markAsRead(selectedNotification.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    <i className="fas fa-check mr-2"></i>
                    Mark as Read
                  </button>
                  <button
                    onClick={() => dismissNotification(selectedNotification.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    <i className="fas fa-trash mr-2"></i>
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

export default StudentNotifications;