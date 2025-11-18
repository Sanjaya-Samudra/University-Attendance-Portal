import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import {AppContext} from '../../context/AppContext.jsx'
import { toast } from "react-toastify";

const ViewAttendance = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const {backendUrl} = useContext(AppContext)

  useEffect(() => {
    loadAttendanceData();
  }, []);

  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredData(attendanceData);
      return;
    }

    // Filter by date range if provided
    const filtered = attendanceData.map(course => ({
      ...course,
      attendanceRecords: course.attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
          return recordDate >= start && recordDate <= end;
        } else if (start) {
          return recordDate >= start;
        } else if (end) {
          return recordDate <= end;
        }
        return true;
      }),
    }));

    setFilteredData(filtered);
  }, [attendanceData, startDate, endDate]);

  const loadAttendanceData = async () => {
    setLoading(true);
    setError("");

    try {

      // Attendance data will be loaded from backend; remove mock/demo entries

      axios.defaults.withCredentials = true

      const {data} = await axios.get(backendUrl + '/student/view-attend')
      
      if (data.success) {
        setAttendanceData(data.message)
      }else {
        toast.error(data.message)
      }

      // setAttendanceData(mockData);
    } catch {
      setError("Failed to load attendance data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    // Filtering happens automatically when dates change
  };

  const viewCourseDetails = (course) => {
    setSelectedCourse(course);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedCourse(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Good":
        return "text-green-600 bg-green-100";
      case "Average":
        return "text-yellow-600 bg-yellow-100";
      case "Low":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 85) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getRecordStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "text-green-600 bg-green-50";
      case "Late":
        return "text-yellow-600 bg-yellow-50";
      case "Absent":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const stats = {
    totalCourses: filteredData.length,
    avgAttendance: filteredData.length > 0
      ? (filteredData.reduce((sum, course) => sum + course.attendancePercentage, 0) / filteredData.length).toFixed(1)
      : 0,
    totalDays: filteredData.reduce((sum, course) => sum + course.totalClasses, 0),
    lowAttendanceCourses: filteredData.filter(course => course.attendancePercentage < 75).length,
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700 flex items-center">
          <i className="fas fa-calendar-check mr-2"></i>
          View Attendance
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

      {/* Date Range Filter */}
      <div className="bg-white p-6 shadow-md rounded mb-6">
        <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
          <i className="fas fa-calendar-alt mr-2"></i>
          Select Date Range
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block mb-2 font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <button
              onClick={applyFilter}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
            >
              <i className="fas fa-filter mr-2"></i>
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center py-8">
          <i className="fas fa-spinner fa-spin text-2xl text-purple-600"></i>
          <p className="mt-2 text-gray-600">Loading attendance data...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {/* Courses Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredData.map(course => (
            <div key={course.id} className="bg-white p-6 shadow-md rounded hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                  <p className="text-sm text-gray-600">{course.instructor}</p>
                  <p className="text-xs text-gray-500">Course ID: {course.id}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(course.status)}`}>
                  {course.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Attendance:</span>
                  <span className={`font-semibold ${getAttendanceColor(course.attendancePercentage)}`}>
                    {course.attendancePercentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Classes Attended:</span>
                  <span className="font-semibold">{course.attendedClasses}/{course.totalClasses}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Attendance:</span>
                  <span className="text-sm">{course.lastAttendance}</span>
                </div>
              </div>

              <button
                onClick={() => viewCourseDetails(course)}
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
              >
                <i className="fas fa-eye mr-2"></i>
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Overall Statistics */}
      {!loading && !error && (
        <div className="bg-white p-6 shadow-md rounded">
          <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
            <i className="fas fa-chart-pie mr-2"></i>
            Overall Attendance Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded text-center">
              <div className="flex items-center justify-center mb-2">
                <i className="fas fa-graduation-cap text-blue-500 text-2xl"></i>
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
              <div className="text-sm text-gray-600">Total Courses</div>
            </div>
            <div className="bg-green-50 p-4 rounded text-center">
              <div className="flex items-center justify-center mb-2">
                <i className="fas fa-check-circle text-green-500 text-2xl"></i>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.avgAttendance}%</div>
              <div className="text-sm text-gray-600">Average Attendance</div>
            </div>
            <div className="bg-purple-50 p-4 rounded text-center">
              <div className="flex items-center justify-center mb-2">
                <i className="fas fa-calendar-day text-purple-500 text-2xl"></i>
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalDays}</div>
              <div className="text-sm text-gray-600">Total Conducted Days</div>
            </div>
            <div className="bg-red-50 p-4 rounded text-center">
              <div className="flex items-center justify-center mb-2">
                <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.lowAttendanceCourses}</div>
              <div className="text-sm text-gray-600">Low Attendance Courses</div>
            </div>
          </div>
        </div>
      )}

      {/* Course Details Modal */}
      {showDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-purple-700">{selectedCourse.name}</h3>
                  <p className="text-gray-600">{selectedCourse.instructor}</p>
                  <p className="text-sm text-gray-500">Course ID: {selectedCourse.id}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {/* Course Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded text-center">
                  <div className="text-lg font-semibold text-gray-800">{selectedCourse.attendancePercentage}%</div>
                  <div className="text-sm text-gray-600">Overall Attendance</div>
                </div>
                <div className="bg-gray-50 p-4 rounded text-center">
                  <div className="text-lg font-semibold text-gray-800">{selectedCourse.attendedClasses}/{selectedCourse.totalClasses}</div>
                  <div className="text-sm text-gray-600">Classes Attended</div>
                </div>
                <div className="bg-gray-50 p-4 rounded text-center">
                  <div className={`text-lg font-semibold ${getStatusColor(selectedCourse.status)}`}>
                    {selectedCourse.status}
                  </div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>

              {/* Attendance Records */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Recent Attendance Records</h4>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCourse.attendanceRecords.map((record, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="px-4 py-2">{record.date}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRecordStatusColor(record.status)}`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">{record.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;