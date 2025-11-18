import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import "../../styles/student-management.css";
import CustomSelect from '../../components/CustomSelect.jsx'

const StudentManagement = () => {

  //Student detail form
  const [formData, setFormData] = useState({
    full_name: "",
    year: "",
    dep_id: "",
    regi_num: "",
    contact_num: "",
    address: "",
    email: "",
    index_num: "",
    academicYear: ''
  });

  //search use state
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [saving, setSaving] = useState(false);

  // context varibles
  const {backendUrl} = useContext(AppContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add student to list (demo only)
    setSaving(true);
    setStudents([...students, formData]);
    
    try {
      
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl+'/student/add', {
        fullName: formData.full_name,
        year: formData.year,
        regiNumber: formData.regi_num,
        indexNum: formData.index_num,
        email: formData.email,
        contactNum: formData.contact_num,
        address: formData.address,
        department: formData.dep_id,
        academicYear: formData.academicYear
      });

      if(data.success) {
        toast.success(data.message)

        setFormData({
          full_name: "",
          year: "",
          dep_id: "",
          regi_num: "",
          contact_num: "",
          address: "",
          email: "",
          index_num: "",
          academicYear: ''
        });
        getAllStudents()

      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    } finally {
      setSaving(false)
    }

  };

  // const filteredStudents = students.filter(
  //   (student) =>
  //     student.fullName.toLowerCase().includes(search.toLowerCase()) ||
  //     student.regiNumber.toLowerCase().includes(search.toLowerCase())
  // );

  const getAllStudents = async () => {
    try {
      
      axios.defaults.withCredentials = true

      const {data} = await axios.get(backendUrl + '/student/getAll')

      if(data.success) {
        setStudents(data.message)
      }else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    getAllStudents();
  },[])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="student-page-header mb-6">
        <h1 className="text-3xl">Student Management</h1>
        <div className="profile">
          <img src="/user.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
          <span className="font-medium">Admin</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="student-form-card mb-6">
        <div className="student-form-grid">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input name="full_name" value={formData.full_name} onChange={handleChange} className="student-input" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Index Number</label>
            <input name="index_num" value={formData.index_num} onChange={handleChange} className="student-input" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Registration Number</label>
            <input name="regi_num" value={formData.regi_num} onChange={handleChange} className="student-input" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Department</label>
            <CustomSelect
              name="dep_id"
              value={formData.dep_id}
              onChange={handleChange}
              placeholder="Select Department"
              options={[]}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Academic Year</label>
            <CustomSelect
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              placeholder="Select Academic Year"
              options={[]}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Year</label>
            <CustomSelect
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Select Year"
              options={[]}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="student-input" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Contact Number</label>
            <input name="contact_num" value={formData.contact_num} onChange={handleChange} className="student-input" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} className="student-input" required />
          </div>
        </div>

        <div className="student-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving && <span className="spinner" />} Save Student
          </button>
          <button type="button" className="btn-ghost" onClick={() => setFormData({ full_name: '', year: '', dep_id: '', regi_num: '', contact_num: '', address: '', email: '', index_num: '', academicYear: '' })}>Reset</button>
        </div>
      </form>

      {/* Search */}
      <div className="mb-4">
        <input type="text" placeholder="Search by name or registration number..." value={search} onChange={(e) => setSearch(e.target.value)} className="student-input" />
      </div>

      {/* Student List */}
      <div className="student-list-card">
        <div className="student-list-header">
          <h2>Student List</h2>
        </div>
        {students.length > 0 ? (
          <ul>
            {students.map((student, idx) => (
              <li key={idx} className="student-list-item">
                <div>
                  <span className="font-medium">{student.fullName || student.full_name}</span>
                  <span className="meta ml-2">({student.regiNumber || student.regi_num})</span>
                </div>
                <div className="meta">
                  {student.department || student.dep_id} - Year {student.year}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-gray-500">No students found</p>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;