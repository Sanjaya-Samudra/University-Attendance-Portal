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

  const getNotificationStyle = (type) => {
    // Return inline style fragments matching FoC theme (navy/gold/soft)
    switch (type) {
      case "attendance":
        return { borderColor: 'rgba(0,33,71,0.12)', iconColor: 'var(--foc-navy)' };
      case "academic":
        return { borderColor: 'rgba(255,209,0,0.12)', iconColor: 'var(--foc-gold)' };
      case "system":
        return { borderColor: 'rgba(107,114,128,0.12)', iconColor: '#6b7280' };
      case "important":
        return { borderColor: 'rgba(239,68,68,0.12)', iconColor: '#ef4444' };
      default:
        return { borderColor: 'rgba(0,33,71,0.08)', iconColor: 'var(--foc-navy)' };
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
    <div className="aum-container" style={{minHeight: '100vh', padding:'24px'}}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <i className="fas fa-bell" style={{color:'var(--foc-navy)',fontSize:22}}></i>
          <h1 className="aum-title">My Notifications</h1>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <img src="/user.jpg" alt="Profile" className="profile-avatar" style={{width:40,height:40}} />
          <span className="muted">Student</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{display:'flex',gap:12,marginBottom:18}}>
        <button onClick={markAllAsRead} className="aum-btn-ghost">
          <i className="fas fa-check-double mr-2"></i>
          Mark All Read
        </button>
        <button onClick={loadNotifications} className="aum-btn-primary">
          <i className="fas fa-sync-alt mr-2"></i>
          Refresh
        </button>
      </div>

      {/* Notification Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:18}}>
        <div className="aum-card" style={{textAlign:'center'}}>
          <div style={{fontSize:20,color:'var(--foc-navy)',marginBottom:6}}><i className="fas fa-bell"></i></div>
          <div className="aum-kpi-value">{stats.total}</div>
          <div className="muted">Total Notifications</div>
        </div>
        <div className="aum-card" style={{textAlign:'center'}}>
          <div style={{fontSize:20,color:'#ef4444',marginBottom:6}}><i className="fas fa-envelope"></i></div>
          <div className="aum-kpi-value">{stats.unread}</div>
          <div className="muted">Unread</div>
        </div>
        <div className="aum-card" style={{textAlign:'center'}}>
          <div style={{fontSize:20,color:'var(--foc-gold)',marginBottom:6}}><i className="fas fa-exclamation-triangle"></i></div>
          <div className="aum-kpi-value">{stats.important}</div>
          <div className="muted">Important</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="aum-card" style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:18}}>
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
            className={activeFilter === tab.key ? 'aum-btn-primary' : 'aum-btn-ghost'}
          >
            <i className={tab.icon} style={{marginRight:8}}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div style={{textAlign:'center',padding:'40px 0'}}>
          <i className="fas fa-spinner fa-spin" style={{fontSize:22,color:'var(--foc-navy)'}}></i>
          <p className="muted" style={{marginTop:8}}>Loading notifications...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="aum-card" style={{borderLeft:'4px solid #ef4444',marginBottom:18}}>
          <i className="fas fa-exclamation-triangle" style={{marginRight:8}}></i>
          {error}
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {filteredNotifications.length === 0 ? (
            <div style={{textAlign:'center',padding:'48px 0'}} className="muted">
              <i className="fas fa-bell-slash" style={{fontSize:36,display:'block',marginBottom:10,color:'var(--foc-navy)'}}></i>
              <p>No notifications found.</p>
            </div>
          ) : (
            filteredNotifications.map(notification => {
              const style = getNotificationStyle(notification.type);
              return (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className="aum-card"
                  style={{cursor:'pointer',display:'flex',gap:12,alignItems:'flex-start',borderLeft:`4px solid ${style.borderColor}`,background:!notification.isRead ? 'rgba(0,33,71,0.03)' : 'transparent'}}
                >
                  <div style={{fontSize:18,color: notification.isImportant ? '#ef4444' : style.iconColor,marginTop:4}}>
                    <i className={`${getNotificationIcon(notification.type)}`}></i>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <h3 className="aum-list-title">{notification.title}</h3>
                      {notification.isImportant && (
                        <span className="aum-badge" style={{background:'#fee2e2',color:'#ef4444'}}>Important</span>
                      )}
                      {!notification.isRead && (
                        <span className="aum-badge" style={{background:'var(--foc-navy)',color:'#fff'}}>New</span>
                      )}
                    </div>
                    <p className="muted" style={{marginBottom:8}}>{notification.message}</p>
                    <div style={{display:'flex',gap:12,alignItems:'center'}} className="muted">
                      <span>{formatTimestamp(notification.timestamp)}</span>
                      {notification.courseId && (
                        <span className="aum-badge" style={{background:'rgba(0,33,71,0.06)',color:'var(--foc-navy)'}}>{notification.courseId}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default StudentNotifications;