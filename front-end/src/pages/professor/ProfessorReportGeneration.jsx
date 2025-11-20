import React, { useState, useEffect } from "react";
import CustomSelect from '../../components/CustomSelect'
import '../../styles/admin-user-management.css'
import '../../styles/report-generation.css'

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
    <div className="aum-container">
      {/* Header */}
      <div className="aum-header">
        <div>
          <div className="aum-title">Attendance Report Generation</div>
          <div className="aum-sub">Create and export attendance reports for your modules</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Welcome back,</div>
            <div className="font-medium text-[var(--foc-navy)]">Professor</div>
          </div>
          <img src="/user.jpg" alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-[var(--foc-navy)]" />
        </div>
      </div>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="aum-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <label className="aum-label">Course Module *</label>
            <CustomSelect
              name="courseModule"
              value={formData.courseModule}
              onChange={handleInputChange}
              options={courses.map(c => ({ value: c._id || c.id, label: c.title || c.name || (c.code || c.courseCode) }))}
              placeholder="Select Module"
            />
          </div>

          <div>
            <label className="aum-label">Year *</label>
            <CustomSelect
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              options={[{value:'2023',label:'2023'},{value:'2024',label:'2024'},{value:'2025',label:'2025'}]}
              placeholder="Select Year"
            />
          </div>

          <div>
            <label className="aum-label">Semester *</label>
            <CustomSelect
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              options={[{value:'1',label:'1'},{value:'2',label:'2'}]}
              placeholder="Select Semester"
            />
          </div>

          <div>
            <label className="aum-label">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="aum-input"
              required
            />
          </div>

          <div>
            <label className="aum-label">End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="aum-input"
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
              <label className="aum-label">Student</label>
              <CustomSelect
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                options={students.map(s => ({ value: s.id || s._id, label: s.fullName || s.name || s.id }))}
                placeholder="Choose student..."
              />
            </div>
          )}
        </div>

        <div className="aum-actions" style={{marginTop:12}}>
          <button type="submit" className="aum-btn-primary" disabled={loading}>{loading ? 'Generating...' : 'Generate Report'}</button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="aum-card" style={{borderLeft:'4px solid #ef4444'}}>{error}</div>
      )}

      {/* Report Summary */}
      {reportData && (
        <div className="aum-card mb-6">
          <h3 className="aum-list-title mb-4">Report Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded text-center" style={{background:'linear-gradient(180deg, rgba(0,33,71,0.03), #fff)'}}>
              <div className="text-2xl font-bold text-[var(--foc-navy)]">{reportData.summary.totalStudents}</div>
              <div className="text-sm text-[var(--foc-muted)]">Total Students</div>
            </div>
            <div className="p-4 rounded text-center" style={{background:'linear-gradient(180deg, rgba(255,209,0,0.03), #fff)'}}>
              <div className="text-2xl font-bold text-[var(--foc-gold)]">{reportData.summary.avgAttendance}%</div>
              <div className="text-sm text-[var(--foc-muted)]">Average Attendance</div>
            </div>
            <div className="p-4 rounded text-center" style={{background:'linear-gradient(180deg, rgba(0,33,71,0.03), #fff)'}}>
              <div className="text-2xl font-bold text-[var(--foc-navy)]">{reportData.summary.totalClasses}</div>
              <div className="text-sm text-[var(--foc-muted)]">Total Classes</div>
            </div>
            <div className="p-4 rounded text-center" style={{background:'linear-gradient(180deg, rgba(0,0,0,0.02), #fff)'}}>
              <div className="text-2xl font-bold text-[var(--foc-navy)]">{reportData.summary.dateRange}</div>
              <div className="text-sm text-[var(--foc-muted)]">Days Range</div>
            </div>
          </div>
        </div>
      )}

      {/* Report Table */}
      {reportData && (
        <div className="aum-card mb-6">
          <h3 className="aum-list-title mb-4">Detailed Report</h3>
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
          <button onClick={downloadPDF} className="aum-btn-primary" style={{background:'linear-gradient(180deg,var(--foc-navy), #001a3d)'}}>
            <i className="fas fa-download mr-2"></i>
            Download Detailed PDF Report
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfessorReportGeneration;