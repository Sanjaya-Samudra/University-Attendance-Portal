import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {AppContext} from '../../context/AppContext.jsx'
import Swal from "sweetalert2";
import "../../styles/professor-management.css";

const ProfessorManagement = () => {
  
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

  const [subjects, setSubjects] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [search, setSearch] = useState("");
  const [isSelected, setIsSelected] = useState(false)

  const {backendUrl} = useContext(AppContext)

  const departmentSubjects = {
    CS: ["Data Structures", "Algorithms", "DBMS", "Computer Networks"],
    SE: ["Software Design", "Testing", "DevOps", "Agile Methods"],
    IS: ["Information Security", "ERP Systems", "Business Analytics", "Data Mining"],
  };

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setFormData({ ...formData, department: dept, subject: "" });
    setSubjects(departmentSubjects[dept] || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    
    try {
      
      axios.defaults.allowAbsoluteUrls = true

      const {data} = await axios.post(backendUrl + '/professor/add', {
        fullName: formData.fullName,
        designation: formData.designation,
        doj: formData.dateofjoin,
        email: formData.email,
        department: formData.department,
        uniId: formData.uniID,
        contactNum: formData.contactNumber,
        address: formData.address,
        nic: formData.nicNO 
      })

      if (data.success) {
        toast.success(data.message)
        setFormData({
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
        getAllProfessor()
      }else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }

  };

  const filteredProfessors = professors.filter(
    (prof) =>
      prof.fullName.toLowerCase().includes(search.toLowerCase()) ||
      prof.uniID.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = async (e, professor) => {

    setIsSelected(true)

    e.preventDefault()

    setFormData({
      fullName: professor.fullName,
      department: professor.department,
      subject: professor.subject,
      uniID: professor.uniId,
      designation: professor.designation,
      contactNumber: professor.contactNum,
      dateofjoin: professor.doj,
      address: professor.address,
      email: professor.email,
      nicNO: professor.nic,
      status: "Active",
    });

  }

  const closeSelected = () => {
    setIsSelected(false)
    setFormData({
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
  }

  const getAllProfessor = async () => {
    try {
      
      axios.defaults.withCredentials = true

      const {data} = await axios.get(backendUrl + '/professor/all')

      if(data.success) {

        setProfessors(data.message.lastProfessors)

      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  const handleDepartmentName = (dep) => {
    if (dep == 'ISEI') {
      return 'Information Systems Engineering & Informatics'
    }

    if (dep == 'KEC') {
      return 'Knowledge Engineering & Communication'
    }

    return 'Scientific Computing'

  }

  const handleUpdateProf = async () => {
    try {
      
      axios.defaults.allowAbsoluteUrls = true

      const {data} = await axios.put(backendUrl + '/professor/update-prof', {
        fullName: formData.fullName,
        designation: formData.designation,
        doj: formData.dateofjoin,
        email: formData.email,
        department: formData.department,
        uniId: formData.uniID,
        contactNum: formData.contactNumber,
        address: formData.address,
        nic: formData.nicNO 
      })

      if(data.success) {
        toast.success(data.message)

        setFormData({
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

        getAllProfessor()
      }else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)

    }
  }

  const deleteProf = async () => {
    try {

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      }).then( async (result) => {
        if (result.isConfirmed) {
          try {
            axios.defaults.withCredentials = true

            const {data} = await axios.delete(backendUrl + `/professor/delete/${formData.email}`)

            await getAllProfessor()

            if(data.success) {

                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success"
                });

                setFormData({
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
              
            }else{

              toast.error(data.message)
            }

          } catch (error) {
            toast.error(error.message)
          }
          
        }
      });

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getAllProfessor()
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="professor-page-header mb-6">
        <h1 className="text-3xl">Professor Management</h1>
        <div className="profile">
          <img src="/user.jpg" alt="Profile" className="w-10 h-10 rounded-full" />
          <span className="font-medium">Admin</span>
        </div>
      </div>

      {/* Themed Form */}
      <form onSubmit={handleSubmit} className="professor-form-card mb-6">
        <div className="professor-form-grid">
          <div className="prof-field">
            <input placeholder=" " name="fullName" value={formData.fullName} onChange={handleChange} className="prof-input" required />
            <label>Full Name</label>
          </div>

          <div className="prof-field">
            <select name="department" value={formData.department} onChange={handleDepartmentChange} className="prof-input" required>
              <option value="">Select Department</option>
              <option value="ISEI">Information Systems Engineering & Informatics</option>
              <option value="KEC">Knowledge Engineering & Communication</option>
              <option value="SC">Scientific Computing</option>
            </select>
            <label>Department</label>
          </div>

          <div className="prof-field">
            <select name="subject" value={formData.subject} onChange={handleChange} className="prof-input">
              <option value="">Select Subject</option>
              {subjects && subjects.length > 0 ? (
                subjects.map((s, idx) => (
                  <option key={idx} value={s}>{s}</option>
                ))
              ) : null}
            </select>
            <label>Subject</label>
          </div>

          <div className="prof-field">
            <input placeholder=" " name="uniID" value={formData.uniID} onChange={handleChange} className="prof-input" />
            <label>University ID Number</label>
          </div>

          <div className="prof-field">
            <select name="designation" value={formData.designation} onChange={handleChange} className="prof-input">
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Professor">Professor</option>
              <option value="Instructor">Instructor</option>
              <option value="Lecturer">Lecturer</option>
            </select>
            <label>Designation</label>
          </div>

          <div className="prof-field">
            <input placeholder=" " name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="prof-input" required />
            <label>Contact Number</label>
          </div>

          <div className="prof-field">
            <input placeholder=" " type="date" name="dateofjoin" value={formData.dateofjoin} onChange={handleChange} className="prof-input" required />
            <label>Date of Join</label>
          </div>

          <div className="prof-field">
            <input placeholder=" " name="address" value={formData.address} onChange={handleChange} className="prof-input" />
            <label>Address</label>
          </div>

          <div className="prof-field">
            <input placeholder=" " type="email" name="email" value={formData.email} onChange={handleChange} className="prof-input" required />
            <label>Email Address</label>
          </div>

          <div className="prof-field">
            <input placeholder=" " name="nicNO" value={formData.nicNO} onChange={handleChange} className="prof-input" required />
            <label>NIC Number</label>
          </div>

          <div className="prof-field">
            <select name="status" value={formData.status} onChange={handleChange} className="prof-input" required>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Retired">Retired</option>
              <option value="Resigned">Resigned</option>
            </select>
            <label>Status</label>
          </div>
        </div>

        <div className="professor-actions">
          <button type="submit" className="prof-btn-primary">Submit</button>
          <button type="button" className="prof-btn-ghost" onClick={() => { setFormData({ fullName: '', department: '', subject: '', uniID: '', designation: '', contactNumber: '', dateofjoin: '', address: '', email: '', nicNO: '', status: 'Active' }); setIsSelected(false); }}>Reset</button>
          {isSelected && (
            <>
              <button type="button" className="prof-btn-primary" onClick={handleUpdateProf}>Update</button>
              <button type="button" className="prof-btn-ghost" onClick={deleteProf}>Delete</button>
              <button type="button" className="prof-btn-ghost" onClick={() => closeSelected()}>Close</button>
            </>
          )}
        </div>
      </form>

      {/* Search */}
      <div className="mb-4">
        <input type="text" placeholder="Enter Professor Name or ID" value={search} onChange={(e) => setSearch(e.target.value)} className="prof-input" />
      </div>

      {/* Professor List */}
      <div className="professor-list-card">
        <div className="professor-list-header">
          <h2>Professor List</h2>
        </div>
        {filteredProfessors.length > 0 ? (
          <ul>
            {filteredProfessors.map((prof, idx) => (
              <li key={idx} className="professor-list-item" onClick={(e) => handleInputChange(e, prof)}>
                <div>
                  <span className="font-medium">{prof.fullName}</span>
                  <span className="meta ml-2">({prof.uniId})</span>
                </div>
                <div className="meta">
                  {handleDepartmentName(prof.department)} - {prof.designation}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-gray-500">No professors found</p>
        )}
      </div>
    </div>
  );
};

export default ProfessorManagement;