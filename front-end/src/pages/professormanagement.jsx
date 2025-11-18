import React, { useState } from "react";

const ProfessorForm = () => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    subject: "",
    uniID: "",
    designation: "",
    contactNumber: "",
    dateofjoin: "",
    address: "",
    email: "",
    nicNO: "",
    status: "Active",
  });

  const departmentSubjects = {
    CS: ["Data Structures", "Algorithms", "DBMS"],
    SE: ["Software Design", "Testing", "DevOps"],
    IS: ["Information Security", "ERP Systems", "Business Analytics"],
  };

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setSubjects(departmentSubjects[dept] || []);
    setFormData({ ...formData, department: dept, subject: "" });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    // backend submit logic here
    alert("Professor data submitted (check console for details)");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Professor Management</h1>
        <div className="flex items-center gap-3">
          <img
            src="/user.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Admin</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* University ID */}
          <div>
            <label className="block mb-1 font-medium">University ID</label>
            <input
              type="text"
              name="uniID"
              value={formData.uniID}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block mb-1 font-medium">Department</label>
            <select
              name="department"
              required
              value={formData.department}
              onChange={handleDepartmentChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Department</option>
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block mb-1 font-medium">Subject</label>
            <select
              name="subject"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Subject</option>
              {subjects.map((sub, index) => (
                <option key={index} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="block mb-1 font-medium">Designation</label>
            <input
              type="text"
              name="designation"
              required
              value={formData.designation}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="block mb-1 font-medium">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              required
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Date of Join */}
          <div>
            <label className="block mb-1 font-medium">Date of Join</label>
            <input
              type="date"
              name="dateofjoin"
              required
              value={formData.dateofjoin}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* NIC */}
          <div>
            <label className="block mb-1 font-medium">NIC Number</label>
            <input
              type="text"
              name="nicNO"
              required
              value={formData.nicNO}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">Status</label>
            <select
              name="status"
              required
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Retired">Retired</option>
              <option value="Resigned">Resigned</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex gap-3 justify-center mt-4">
            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
            >
              Update
            </button>
            <button
              type="button"
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </form>

        {/* Search and Table */}
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search Professor..."
            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <table className="w-full border-collapse border border-gray-300 text-left">
            <thead className="bg-purple-100">
              <tr>
                <th className="border px-3 py-2">Uni ID</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Department</th>
                <th className="border px-3 py-2">Subject</th>
                <th className="border px-3 py-2">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">00001</td>
                <td className="border px-3 py-2">John Doe</td>
                <td className="border px-3 py-2">CS</td>
                <td className="border px-3 py-2">DBMS</td>
                <td className="border px-3 py-2">john@example.com</td>
              </tr>
              <tr>
                <td className="border px-3 py-2">00002</td>
                <td className="border px-3 py-2">Jane Smith</td>
                <td className="border px-3 py-2">SE</td>
                <td className="border px-3 py-2">Testing</td>
                <td className="border px-3 py-2">jane@example.com</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProfessorForm;
