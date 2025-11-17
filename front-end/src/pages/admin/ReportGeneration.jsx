import React, { useState } from "react";
import "../../styles/report-generation.css";
import CustomSelect from '../../components/CustomSelect.jsx'

const ReportGeneration = () => {
  const [formData, setFormData] = useState({
    courseModule: "",
    year: "",
    semester: "",
    department: "",
    startDate: "",
    endDate: "",
    enableStudentSearch: false,
    studentId: "",
  });

  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockData = [
        { studentId: "ST001", name: "John Doe", attendancePercent: 85, presentDays: 17, absentDays: 3 },
        { studentId: "ST002", name: "Jane Smith", attendancePercent: 92, presentDays: 18, absentDays: 2 },
        { studentId: "ST003", name: "Bob Johnson", attendancePercent: 78, presentDays: 16, absentDays: 4 },
        { studentId: "ST004", name: "Alice Brown", attendancePercent: 95, presentDays: 19, absentDays: 1 },
      ];
      setReportData(mockData);
      setShowReport(true);
      setLoading(false);
    }, 1200);
  };

  const downloadPDF = () => {
    alert("PDF download functionality would be implemented here");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen rg-container">
      <div className="rg-header">
        <h1 className="rg-title">Report Generation</h1>
        <div className="flex items-center gap-3">
          <img src="/user.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
          <span className="font-medium">Admin</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="foc-card foc-grid mb-6">
        <div>
          <label className="block mb-1 font-medium">Course Module</label>
          <CustomSelect
            name="courseModule"
            value={formData.courseModule}
            onChange={handleChange}
            placeholder="Select Module"
            options={[{ value: '', label: 'Select Module' }, { value: 'MOD001', label: 'Introduction to Programming' }, { value: 'MOD002', label: 'Database Systems' }]}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Year</label>
          <CustomSelect
            name="year"
            value={formData.year}
            onChange={handleChange}
            placeholder="Select Year"
            options={[{ value: '', label: 'Select Year' }, { value: '1', label: 'Year 1' }, { value: '2', label: 'Year 2' }, { value: '3', label: 'Year 3' }, { value: '4', label: 'Year 4' }]}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Semester</label>
          <CustomSelect
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Select Semester"
            options={[{ value: '', label: 'Select Semester' }, { value: '1', label: 'Semester 1' }, { value: '2', label: 'Semester 2' }]}
          />
        </div>

        {/* Faculty removed per request */}

        <div>
          <label className="block mb-1 font-medium">Department</label>
          <CustomSelect
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Select Department"
            options={[{ value: '', label: 'Select Department' }, { value: 'ISEI', label: 'Information Systems Engineering & Informatics' }, { value: 'KEC', label: 'Knowledge Engineering & Communication' }, { value: 'SC', label: 'Scientific Computing' }]}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Start Date</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="foc-input" />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="foc-input" />
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="enableStudentSearch"
              checked={formData.enableStudentSearch}
              onChange={handleChange}
              className="foc-checkbox"
            />
            <span>Enable Search by Student</span>
          </label>
        </div>

        {formData.enableStudentSearch && (
          <div>
            <label className="block mb-1 font-medium">Student ID</label>
            <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} className="foc-input" placeholder="Enter Student ID" />
          </div>
        )}

        <div className="col-span-full">
          <button type="submit" className="foc-btn-primary">Generate Report</button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      )}

      {showReport && !loading && (
        <div className="foc-card mb-6">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold rg-title">Attendance Report</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full rg-table">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Student ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Attendance %</th>
                  <th className="px-4 py-2 text-left">Present Days</th>
                  <th className="px-4 py-2 text-left">Absent Days</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((student, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{student.studentId}</td>
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-sm ${
                        student.attendancePercent >= 90 ? 'att-high' :
                        student.attendancePercent >= 75 ? 'att-medium' :
                        'att-low'
                      }`}>
                        {student.attendancePercent}%
                      </span>
                    </td>
                    <td className="px-4 py-2">{student.presentDays}</td>
                    <td className="px-4 py-2">{student.absentDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center p-4">
            <button onClick={downloadPDF} className="rg-download">Download PDF Report</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGeneration;