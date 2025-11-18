import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const ProfessorProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    professorId: "",
    professorName: "",
    nic: "",
    email: "",
    phoneNumber: "",
    department: "",
    designation: "",
    dateOfJoin: "",
    address: "",
    qualifications: "",
    specialization: "",
    officeHours: "Monday - Friday :",
    researchInterests: "",
  });
  const {backendUrl} = useContext(AppContext)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Save profile data
    try {

      axios.defaults.withCredentials = true
      
      const {data} = await axios.put(backendUrl + '/professor/update', {
        uniId: profileData.professorId,
        fullName: profileData.professorName,
        nic: profileData.nic,
        email: profileData.email,
        contactNum: profileData.phoneNumber,
        department: profileData.department,
        designation: profileData.designation,
        doj: profileData.dateOfJoin,
        address: profileData.address,
        qualifications: profileData.qualifications,
        specialization: profileData.specialization,
        officeHours: profileData.officeHours,
        researchInterests: profileData.researchInterests,
      })

      if (data.success) {
        toast.success(data.message)
        setIsEditMode(false);
      }else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
    
    
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      // Handle logout
      alert("Logged out successfully!");
    }
  };

  const getProData = async () => {
    try {
      
      axios.defaults.withCredentials = true

      const {data} = await axios.get(backendUrl + '/professor/get')

      if (data.success) {

        const professor = data.message

        setProfileData({
          professorId: professor.uniId ,
          professorName: `Dr. ${professor.fullName}`,
          nic: professor.nic,
          email: professor.email,
          phoneNumber: professor.contactNum,
          department: professor.department,
          designation: professor.designation,
          dateOfJoin: professor.doj,
          address: professor.address,
          qualifications: professor.qualifications,
          specialization: professor.specialization,
          officeHours: professor.officeHours,
          researchInterests: professor. researchInterests,
        })
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  const handleUpdate = async () => {
    
  }

  useEffect(() => {
    getProData()
  }, [])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700">Professor Profile Management</h1>
        <div className="flex items-center gap-3">
          <img
            src="/user.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">Professor</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          <i className="fas fa-edit mr-2"></i>
          {isEditMode ? "Cancel Edit" : "Edit Profile"}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          Logout
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        {/* Photo Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <img
              src="https://via.placeholder.com/150"
              alt="Professor Photo"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
            />
            {isEditMode && (
              <button
                type="button"
                className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition"
              >
                <i className="fas fa-camera"></i>
              </button>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{profileData.professorName}</h2>
            <p className="text-purple-600">{profileData.designation}</p>
            <p className="text-gray-600">{profileData.department.replace("-", " ").toUpperCase()}</p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
            <i className="fas fa-user mr-2"></i>
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Professor ID</label>
              <input
                type="text"
                name="professorId"
                value={profileData.professorId}
                className="w-full border px-3 py-2 rounded bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Full Name *</label>
              <input
                type="text"
                name="professorName"
                value={profileData.professorName}
                onChange={handleChange}
                disabled={!isEditMode}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">NIC Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="nic"
                  value={profileData.nic}
                  className="flex-1 border px-3 py-2 rounded bg-gray-100"
                  readOnly
                />
                <button
                  type="button"
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  Request Change
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Email Address *</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                disabled={!isEditMode}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone Number *</label>
              <input
                type="tel"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditMode}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Department</label>
              <div className="flex gap-2">
                <select
                  name="department"
                  value={profileData.department}
                  disabled={!isEditMode}
                  onChange={handleChange}
                  className="flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                >
                  <option value="">Select Department</option>
                </select>
                <button
                  type="button"
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                >
                  Request Change
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Designation</label>
              <select
                name="designation"
                value={profileData.designation}
                disabled={!isEditMode}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              >
                <option value="">Select Designation</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Date of Join</label>
              <input
                type="date"
                name="dateOfJoin"
                value={profileData.dateOfJoin}
                onChange={handleChange}
                disabled={!isEditMode}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
            <i className="fas fa-info-circle mr-2"></i>
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Address</label>
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleChange}
                disabled={!isEditMode}
                rows="3"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Qualifications</label>
              <textarea
                name="qualifications"
                value={profileData.qualifications}
                onChange={handleChange}
                disabled={!isEditMode}
                rows="2"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Specialization</label>
              <input
                type="text"
                name="specialization"
                value={profileData.specialization}
                onChange={handleChange}
                disabled={!isEditMode}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Office Hours</label>
              <input
                type="text"
                name="officeHours"
                value={profileData.officeHours}
                onChange={handleChange}
                disabled={!isEditMode}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Research Interests</label>
              <textarea
                name="researchInterests"
                value={profileData.researchInterests}
                onChange={handleChange}
                disabled={!isEditMode}
                rows="2"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {isEditMode && (
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditMode(false)}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfessorProfile;