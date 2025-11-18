import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const StudentProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [changeRequestField, setChangeRequestField] = useState("");
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const {backendUrl} = useContext(AppContext);

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {

      axios.defaults.withCredentials = true;
     
      const {data} = await axios.get(backendUrl + '/student/get')

      if (data.success)  {

        const student = data.message;
        const emergencyContact = student.emergencyContactInfo;
        let dep;

        if (student.department == 'CS') {
          dep = 'Computer Science'
        }else if (student.department == 'SE') {
          dep = 'Software Engineering'
        }else {
          dep = 'Information System'
        }

        setProfileData({
          firstName: student.fullName.split(" ")[0],
          lastName: student.fullName.split(" ")[1],
          regNum: student.regiNumber,
          indexNumber: student.indexNum,
          email: student.email,
          contactNumber: student.contactNum,
          dateOfBirth: student.dob ? student.dob : '',
          gender: student.gender ? student.gender : '',
          address: student.address,

          // Academic Information
          program: `Bachelor of Computing Honours in ${dep}`,
          department: student.department,
          semester: student.semester,
          status: "active",

          // Security
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",

          // Emergency Contact
          emergencyContactName: emergencyContact.name,
          emergencyContactNumber: emergencyContact.contactNum,
          emergencyContactRelation: emergencyContact.relation,
          emergencyContactAddress: emergencyContact.address,
        })
      }else {
        toast.error(data.message)
      }

    } catch {
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle photo upload
      alert("Photo upload functionality would be implemented here");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate password change
      if (profileData.newPassword) {
        if (profileData.newPassword !== profileData.confirmPassword) {
          throw new Error("New passwords do not match");
        }
        if (!profileData.currentPassword) {
          throw new Error("Current password is required for password change");
        }
      }

      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccess("Profile updated successfully!");
      setIsEditMode(false);

      // Clear password fields
      setProfileData({
        ...profileData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.message || "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset all changes?")) {
      loadProfile();
    }
  };

  const submitChangeRequest = () => {
    // Mock change request submission
    alert("Change request submitted successfully!");
    setShowChangeRequestModal(false);
  };

  const handleUpdate = async (e) => {

    e.preventDefault()

    try {

      axios.defaults.withCredentials = true
      
      const {data} = await axios.put(backendUrl + '/student/update', {
        fullName: profileData.firstName + " " +profileData.lastName,
        regiNumber: profileData.regNum,
        indexNum: profileData.indexNumber,
        email: profileData.email,
        contactNum: profileData.contactNumber,
        dob: profileData.dateOfBirth,
        gender: profileData.gender,
        address: profileData.address,
        department: profileData.department,
        academicYear: profileData.year,
        emergencyContactInfo: {
          name: profileData.emergencyContactName,
          contactNum: profileData.emergencyContactNumber,
          relation: profileData.emergencyContactRelation,
          address: profileData.emergencyContactAddress
        }
      })

      if (data.success) {
        toast.success(data.message)
        setIsEditMode(false)
      }else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const closeModal = () => {
    setShowChangeRequestModal(false);
    setChangeRequestField("");
  };

  if (loading && !profileData.firstName) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-purple-600"></i>
          <p className="mt-2 text-gray-600">Loading student profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-purple-700 flex items-center">
          <i className="fas fa-user-graduate mr-2"></i>
          Student Profile Management
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

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back
        </button>
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          <i className="fas fa-edit mr-2"></i>
          {isEditMode ? "Cancel Edit" : "Edit Profile"}
        </button>
        <button
          onClick={loadProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <i className="fas fa-sync-alt mr-2"></i>
          Refresh
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <i className="fas fa-check-circle mr-2"></i>
          {success}
        </div>
      )}

      {/* Profile Container */}
      <div className="bg-white p-6 shadow-md rounded">
        {/* Profile Photo Section */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <img
              src="https://via.placeholder.com/150"
              alt="Student Photo"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
            />
            {isEditMode && (
              <div className="absolute bottom-0 right-0">
                <label htmlFor="photoInput" className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition cursor-pointer">
                  <i className="fas fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="photoInput"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-purple-600">{profileData.regNum}</p>
            <p className="text-gray-600">{profileData.program}</p>
            <p className="text-gray-600">{profileData.department} Department</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
              <i className="fas fa-user mr-2"></i>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-user mr-1"></i>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-user mr-1"></i>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-id-card mr-1"></i>
                  Registration Number
                  <i className="fas fa-lock ml-1 text-gray-400" title="Cannot be changed"></i>
                </label>
                <input
                  type="text"
                  name="regNum"
                  value={profileData.regNum}
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-hashtag mr-1"></i>
                  Index Number
                  <i className="fas fa-lock ml-1 text-gray-400" title="Cannot be changed"></i>
                </label>
                <input
                  type="text"
                  name="indexNumber"
                  value={profileData.indexNumber}
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-envelope mr-1"></i>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-phone mr-1"></i>
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={profileData.contactNumber}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-calendar mr-1"></i>
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-venus-mars mr-1"></i>
                  Gender
                  <i className="fas fa-lock ml-1 text-gray-400" title="Cannot be changed"></i>
                </label>
                <select
                  name="gender"
                  value={profileData.gender}
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                  disabled
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  Address *
                </label>
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  rows="3"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
              <i className="fas fa-graduation-cap mr-2"></i>
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-book mr-1"></i>
                  Program/Course of Study
                  <i className="fas fa-lock ml-1 text-gray-400" title="Cannot be changed"></i>
                </label>
                <input
                  type="text"
                  name="program"
                  value={profileData.program}
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                  readOnly
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-calendar-alt mr-1"></i>
                  Department
                </label>
                <select
                  name="department"
                  value={profileData.department}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                >
                  <option value="">Select department</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-calendar-alt mr-1"></i>
                  Semester *
                </label>
                <select
                  name="semester"
                  value={profileData.semester}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                  required
                >
                  <option value="">Select Semester</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-info-circle mr-1"></i>
                  Status
                  <i className="fas fa-lock ml-1 text-gray-400" title="Cannot be changed"></i>
                </label>
                <select
                  name="status"
                  value={profileData.status}
                  className="w-full border px-3 py-2 rounded bg-gray-100"
                  disabled
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="graduated">Graduated</option>
                  <option value="dropped">Dropped Out</option>
                </select>
              </div>
            </div>
          </div>

          {/* Security Section */}
          {isEditMode && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
                <i className="fas fa-shield-alt mr-2"></i>
                Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block mb-1 font-medium">
                    <i className="fas fa-lock mr-1"></i>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={profileData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    <i className="fas fa-key mr-1"></i>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium">
                    <i className="fas fa-key mr-1"></i>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profileData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Emergency Contact Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-purple-700 mb-4 flex items-center">
              <i className="fas fa-phone-alt mr-2"></i>
              Emergency Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-user-friends mr-1"></i>
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  name="emergencyContactName"
                  value={profileData.emergencyContactName}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-phone mr-1"></i>
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  name="emergencyContactNumber"
                  value={profileData.emergencyContactNumber}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <i className="fas fa-heart mr-1"></i>
                  Relationship
                </label>
                <select
                  name="emergencyContactRelation"
                  value={profileData.emergencyContactRelation}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                >
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="sibling">Sibling</option>
                  <option value="spouse">Spouse</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  Emergency Contact Address
                </label>
                <textarea
                  name="emergencyContactAddress"
                  value={profileData.emergencyContactAddress}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  rows="2"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {isEditMode && (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
              >
                <i className="fas fa-undo mr-2"></i>
                Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:bg-green-400"
                onClick={(e) => handleUpdate(e)}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          )}
        </form>

        {/* Change Request Modal */}
        {showChangeRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-purple-700 flex items-center">
                    <i className="fas fa-edit mr-2"></i>
                    Request Field Change
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1 font-medium">Field to Change:</label>
                    <input
                      type="text"
                      value={changeRequestField}
                      className="w-full border px-3 py-2 rounded bg-gray-100"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Reason for Change:</label>
                    <textarea
                      rows="4"
                      placeholder="Please explain why this field needs to be changed..."
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Requested New Value:</label>
                    <input
                      type="text"
                      placeholder="Enter the new value you want"
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitChangeRequest}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                      Submit Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;