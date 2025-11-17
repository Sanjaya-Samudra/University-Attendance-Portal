import React, { useState } from "react";

export default function Reports() {
  const [formData, setFormData] = useState({
    courseModule: "",
    year: "",
    semester: "",
    faculty: "",
    department: "",
    startDate: "",
    endDate: "",
    enableStudentSearch: false,
    studentId: "",
  });

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // NOTE: Removed demo data — replace with real API call to fetch report
    // Example: call backend endpoint and setReportData(response.data)
    setReportData([]);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Generate Reports</h1>
        <div className="flex items-center gap-3">
          <img
            src="/user.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Admin</span>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
      >
        <select
          name="courseModule"
          value={formData.courseModule}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Course Module</option>
        </select>

        <select
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Year</option>
        </select>

        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Semester</option>
        </select>

        <select
          name="faculty"
          value={formData.faculty}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Faculty</option>
        </select>

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Department</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="flex items-center col-span-3">
          <input
            type="checkbox"
            id="enableStudentSearch"
            name="enableStudentSearch"
            checked={formData.enableStudentSearch}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="enableStudentSearch">Enable Search by Student</label>
        </div>

        {formData.enableStudentSearch && (
          <input
            type="text"
            name="studentId"
            placeholder="Enter Student ID"
            value={formData.studentId}
            onChange={handleChange}
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 col-span-3"
          />
        )}

        <button
          type="submit"
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition col-span-3 md:col-span-1"
        >
          Generate Report
        </button>
      </form>

      {/* Loading */}
      {loading && <div className="text-gray-600 mb-4">Loading...</div>}

      {/* Report Table */}
      {reportData.length > 0 && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full border-collapse">
            <thead className="bg-purple-100">
              <tr>
                <th className="px-4 py-2 border">Student ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Attendance %</th>
                <th className="px-4 py-2 border">Present Days</th>
                <th className="px-4 py-2 border">Absent Days</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((r, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border">{r.id}</td>
                  <td className="px-4 py-2 border">{r.name}</td>
                  <td className="px-4 py-2 border">{r.attendance}%</td>
                  <td className="px-4 py-2 border">{r.present}</td>
                  <td className="px-4 py-2 border">{r.absent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Placeholder for Chart */}
      {reportData.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-600">Pie chart placeholder (integration with chart.js or similar)</p>
        </div>
      )}

      <button className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
        Download PDF Report
      </button>
    </div>
  );
}
