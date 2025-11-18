import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {AppContext} from '../../context/AppContext.jsx'

const ProfessorDashboard = () => {
  // Stats will be fetched from backend
  const [stats, setStats] = useState([])

  const navigationItems = [
    { path: "/create-qr-session", label: "Create QR Session", icon: "📱" },
    { path: "/attendance-mark", label: "Attendance Mark", icon: "📝" },
    { path: "/professor-report-generation", label: "Report Generation", icon: "📊" },
    { path: "/professor-course-management", label: "Course Unit Management", icon: "📚" },
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Professor Dashboard</h1>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 shadow-md rounded flex items-center">
            <div className="text-4xl mr-4">{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
              <p className="text-2xl font-bold text-purple-700">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Teaching Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="bg-white p-6 shadow-md rounded hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <div className="flex items-center">
                <div className="text-3xl mr-4">{item.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
                  <p className="text-sm text-gray-600">Click to access</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white p-6 shadow-md rounded mb-6">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Recent Attendance Sessions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Course</th>
                <th className="text-left py-2">Total Students</th>
                <th className="text-left py-2">Present</th>
                <th className="text-left py-2">Attendance %</th>
                <th className="text-left py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentAttendance.map((session, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{session.course}</td>
                  <td className="py-2">{session.students}</td>
                  <td className="py-2">{session.present}</td>
                  <td className="py-2">{Math.round((session.present / session.students) * 100)}%</td>
                  <td className="py-2">{session.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 shadow-md rounded">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/attendance-mark"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-center"
          >
            Mark Attendance
          </Link>
          <Link
            to="/professor-report-generation"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-center"
          >
            View Reports
          </Link>
          <Link
            to="/professor-profile"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-center"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;