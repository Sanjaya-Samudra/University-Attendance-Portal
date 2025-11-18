import React, { useState, useEffect } from "react";

const ProfessorReportGeneration = () => {
  const [formData, setFormData] = useState({
    courseModule: "",
    year: "",
    semester: "",
    startDate: "",
    endDate: "",
    enableStudentSearch: false,
    studentId: "",
  });

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courses, setCourses] = useState([]);
  const [students] = useState([]);

  useEffect(() => {
    // Load professor's courses
    loadProfessorCourses();
  }, []);

  const loadProfessorCourses = () => {
    // Courses will be loaded from backend; leave empty for now
    setCourses([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "enableStudentSearch" && !checked) {
      setFormData({ ...formData, studentId: "", enableStudentSearch: checked });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Removed demo data. Replace this block with a real API call to fetch report data.
      // Example:
      // const {data} = await axios.post('/professor/report', formData)
      // setReportData(data.message)

      setReportData(null);
    } catch {
      setError("Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    // Mock PDF download - replace with actual PDF generation
    alert("PDF download functionality would be implemented here");
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Attendance Report Generation</h1>
        <div className="flex items-center gap-3">
          <img
            src="/user.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Professor</span>
        </div>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Course Module *</label>
            <select
              name="courseModule"
              value={formData.courseModule}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Module</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.id} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Year *</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Year</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Semester *</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Semester</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableStudentSearch"
              name="enableStudentSearch"
              checked={formData.enableStudentSearch}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label htmlFor="enableStudentSearch" className="font-medium text-gray-700">
              Enable Search by Student
            </label>
          </div>

          {formData.enableStudentSearch && (
            <div className="md:col-span-2">
              <label className="block mb-2 font-medium text-gray-700">Student ID</label>
              <div className="relative">
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  placeholder="Enter Student ID"
                  className="w-full border border-gray-300 px-3 py-2 pr-10 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  list="studentIds"
                />
                <datalist id="studentIds">
                  {students.map(student => (
                    <option key={student.id} value={student.id} />
                  ))}
                </datalist>
                <span className="absolute right-3 top-2 text-gray-400 cursor-pointer">
                  🔍
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition disabled:bg-purple-400"
          >
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Report Summary */}
      {reportData && (
        <div className="bg-white p-6 shadow-md rounded mb-6">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">Report Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-blue-600">{reportData.summary.totalStudents}</div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="bg-green-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-green-600">{reportData.summary.avgAttendance}%</div>
              <div className="text-sm text-gray-600">Average Attendance</div>
            </div>
            <div className="bg-purple-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-purple-600">{reportData.summary.totalClasses}</div>
              <div className="text-sm text-gray-600">Total Classes</div>
            </div>
            <div className="bg-orange-50 p-4 rounded text-center">
              <div className="text-2xl font-bold text-orange-600">{reportData.summary.dateRange}</div>
              <div className="text-sm text-gray-600">Days Range</div>
            </div>
          </div>
        </div>
      )}

      {/* Report Table */}
      {reportData && (
        <div className="bg-white p-6 shadow-md rounded mb-6">
          <h3 className="text-xl font-semibold text-purple-700 mb-4">Detailed Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Student ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Attendance %</th>
                  <th className="px-4 py-2 text-left">Present Days</th>
                  <th className="px-4 py-2 text-left">Absent Days</th>
                  <th className="px-4 py-2 text-left">Late Arrivals</th>
                </tr>
              </thead>
              <tbody>
                {reportData.students.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-2">{student.id}</td>
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.email}</td>
                    <td className={`px-4 py-2 font-semibold ${getAttendanceColor(student.attendancePercentage)}`}>
                      {student.attendancePercentage}%
                    </td>
                    <td className="px-4 py-2">{student.presentDays}</td>
                    <td className="px-4 py-2">{student.absentDays}</td>
                    <td className="px-4 py-2">{student.lateArrivals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Download Button */}
      {reportData && (
        <div className="flex justify-center">
          <button
            onClick={downloadPDF}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            <i className="fas fa-download mr-2"></i>
            Download Detailed PDF Report
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfessorReportGeneration;