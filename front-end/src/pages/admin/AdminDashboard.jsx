import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import "../../styles/admin-dashboard.css";

const AdminDashboard = () => {
  // Stats come from backend. Start null to represent not-yet-fetched state.
  const [stats, setStats]= useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const {backendUrl} = useContext(AppContext)

  const navigationItems = [
    { path: "/students", label: "Student Management", icon: "👥" },
    { path: "/admin-professor-management", label: "Professor Management", icon: "👨‍🏫" },
    { path: "/course-unit-management", label: "Course Unit Management", icon: "📚" },
    { path: "/admin-report-generation", label: "Report Generation", icon: "📊" },
    { path: "/adminuser", label: "Admin User Management", icon: "⚙️" },
  ];

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        axios.defaults.withCredentials = true
        const { data } = await axios.get(backendUrl + '/admin/dashboard')
        if (data.success) {
          setStats([
            { title: "Total Students", value: data.message?.totalStudents, icon: "👥" },
            { title: "Total Professors", value: data.message?.totalProfessors, icon: "👨‍🏫" },
            { title: "Today's Attendance", value: `${data.message?.attendancePercentage}%`, icon: "📊" },
            { title: "Active Courses", value: data.message?.activeCourses, icon: "📚" }
          ])
          if (Array.isArray(data.message?.recentActivity)) {
            setRecentActivity(data.message.recentActivity.map(item => ({ title: item.title || item.message || '', meta: item.meta || item.time || '' })));
          }
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [backendUrl])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="admin-header mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foc-navy)]">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Faculty of Computing — University of Sri Jayewardenepura</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Welcome back,</div>
            <div className="font-medium text-[var(--foc-navy)]">Admin</div>
          </div>
          <img src="/user.jpg" alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-[var(--foc-navy)]" />
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="kpi-card flex items-center gap-4">
              <div className="kpi-icon skeleton-block" />
              <div style={{flex:1}}>
                <div className="kpi-title skeleton-line" />
                <div className="kpi-value skeleton-line short" />
              </div>
            </div>
          ))
        ) : (
          (stats && stats.length) ? stats.map((stat, idx) => (
            <div key={idx} className="kpi-card flex items-center gap-4">
              <div className="kpi-icon">{stat.icon}</div>
              <div>
                <div className="kpi-title">{stat.title}</div>
                <div className="kpi-value">{stat.value ?? '-'}</div>
              </div>
            </div>
          )) : (
            <div className="text-gray-500">No dashboard data available.</div>
          )
        )}
      </div>

      <div className="dashboard-grid mb-8">
        <div>
          <h3 className="text-lg font-semibold text-[var(--foc-navy)] mb-3">Management Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {navigationItems.map((item, i) => (
              <Link key={i} to={item.path} className="quick-action flex items-center gap-4 hover:shadow-lg transition-transform">
                <div className="text-2xl p-2 rounded bg-[var(--foc-surface)]">{item.icon}</div>
                <div>
                  <div className="font-semibold text-gray-800">{item.label}</div>
                  <div className="text-sm text-gray-500">Open management panel</div>
                </div>
                <div className="ml-auto text-[var(--foc-gold)] font-bold">›</div>
              </Link>
            ))}
          </div>

        </div>

        {/* Right column */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--foc-navy)] mb-3">Recent Activity</h3>
          <div className="recent-activity-list">
            {recentActivity.slice(0, 6).map((act, idx) => (
              <div key={idx} className="notice-item">
                <div className="title">{act.title}</div>
                <div className="text-sm text-gray-500">{act.meta}</div>
              </div>
            ))}
            {recentActivity.length > 6 && (
              <div className="text-center mt-2">
                <Link to="/admin-report-generation" className="text-sm font-medium text-[var(--foc-navy)]">View all activity</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;