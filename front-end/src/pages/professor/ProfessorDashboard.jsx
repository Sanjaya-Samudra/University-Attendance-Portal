import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {AppContext} from '../../context/AppContext.jsx'
import '../../styles/admin-dashboard.css'

const ProfessorDashboard = () => {
  // Stats will be fetched from backend
  const [stats, setStats] = useState([])

  const navigationItems = [
    { path: "/create-qr-session", label: "Create QR Session", icon: "📱" },
    { path: "/attendance-mark", label: "Attendance Mark", icon: "📝" },
    { path: "/professor-report-generation", label: "Report Generation", icon: "📊" },
    { path: "/professor/student-notifications", label: "Notification Panel", icon: "🔔" },
    { path: "/professor-profile", label: "Profile Update", icon: "👤" },
  ];

  const [recentAttendance, setRecentAttendance] = useState([])

  const {backendUrl} = useContext(AppContext)

  const getDashbord = async () => {
    try {
      
      axios.defaults.withCredentials = true

      

      const {data} = await axios.get(backendUrl + '/professor/dashbord')

      

      if(data.success) {
        setStats([
          { title: "Total Students", value: data.message.totalStudents , icon: "👥" },
          { title: "Courses Teaching", value: data.message.courseCount , icon: "📚" },
          { title: "Today's Attendance", value: data.message.attendancePercentage , icon: "📊" },
          { title: "Pending Tasks", value: "2", icon: "📝" },
        ])

        setRecentAttendance(data.message.recentAttendance)
      }

    } catch (error) {
      
    }
  }

  useEffect(() => {
    getDashbord()
  },[])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="admin-header mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foc-navy)]">Professor Dashboard</h1>
          <p className="text-sm text-gray-600">Faculty of Computing — Professor panel</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Welcome back,</div>
            <div className="font-medium text-[var(--foc-navy)]">Professor</div>
          </div>
          <img src="/user.jpg" alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-[var(--foc-navy)]" />
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid mb-8">
        {stats && stats.length ? stats.map((stat, idx) => (
          <div key={idx} className="kpi-card flex items-center gap-4">
            <div className="kpi-icon">{stat.icon}</div>
            <div style={{flex:1}}>
              <div className="kpi-title">{stat.title}</div>
              <div className="kpi-value">{stat.value ?? '-'}</div>
            </div>
          </div>
        )) : (
          <div className="text-gray-500">No dashboard data available.</div>
        )}
      </div>

      <div className="dashboard-grid mb-8">
        <div>
          <h3 className="text-lg font-semibold text-[var(--foc-navy)] mb-3">Teaching Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {navigationItems.map((item, i) => (
              <Link key={i} to={item.path} className="quick-action flex items-center gap-4 hover:shadow-lg transition-transform">
                <div className="text-2xl p-2 rounded bg-[var(--foc-surface)]">{item.icon}</div>
                <div>
                  <div className="font-semibold text-gray-800">{item.label}</div>
                  <div className="text-sm text-gray-500">Open the tool</div>
                </div>
                <div className="ml-auto text-[var(--foc-gold)] font-bold">›</div>
              </Link>
            ))}
          </div>

        </div>

        {/* Right column */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--foc-navy)] mb-3">Recent Attendance</h3>
          <div className="recent-activity-list">
            {recentAttendance && recentAttendance.length ? recentAttendance.slice(0,6).map((session, idx) => (
              <div key={idx} className="notice-item">
                <div className="title">{session.course}</div>
                <div className="text-sm text-gray-500">{session.date} — {session.present}/{session.students} present</div>
              </div>
            )) : (
              <div className="text-gray-500">No recent attendance sessions.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;