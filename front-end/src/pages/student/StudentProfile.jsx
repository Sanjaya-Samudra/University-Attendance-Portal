import axios from "axios";
import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import CustomSelect from "../../components/CustomSelect";

const StudentProfile = () => {
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profile, setProfile] = useState({});
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [changeRequestField, setChangeRequestField] = useState("");
  const [editKey, setEditKey] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${backendUrl}/student/get`);
      if (res.data && res.data.success) {
        const s = res.data.message;
        const emergency = s.emergencyContactInfo || {};
        const deptLabel = s.department === "CS" ? "Computer Science" : s.department === "SE" ? "Software Engineering" : "Information Systems";

        setProfile({
          firstName: (s.fullName || "").split(" ")[0] || "",
          lastName: (s.fullName || "").split(" ")[1] || "",
          regNum: s.regiNumber || "",
          indexNumber: s.indexNum || "",
          email: s.email || "",
          contactNumber: s.contactNum || "",
          dateOfBirth: s.dob || "",
          gender: s.gender || "",
          address: s.address || "",
          program: `Bachelor of Computing Honours in ${deptLabel}`,
          department: s.department || "",
          semester: s.semester || "",
          status: s.status || "active",
          avatar: s.avatar || "",
          emergencyContactName: emergency.name || "",
          emergencyContactNumber: emergency.contactNum || "",
          emergencyContactRelation: emergency.relation || "",
          emergencyContactAddress: emergency.address || "",
        });
        // clear any selected local preview when loading fresh profile
        setSelectedPhotoFile(null);
        setPreviewUrl("");
      } else {
        toast.error((res.data && res.data.message) || "Failed to load profile");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSelect = ({ target: { name, value } }) => {
    setProfile((p) => ({ ...p, [name]: value }));
  };

  // Option lists — when editing we intentionally hide options (showing 'No options')
  const departmentOptions = isEditMode ? [] : [{ value: "CS", label: "Computer Science" }, { value: "SE", label: "Software Engineering" }, { value: "IS", label: "Information Systems" }];
  const semesterOptions = isEditMode ? [] : [{ value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }];
  const relationOptions = isEditMode ? [] : [{ value: "parent", label: "Parent" }, { value: "guardian", label: "Guardian" }, { value: "sibling", label: "Sibling" }, { value: "spouse", label: "Spouse" }, { value: "friend", label: "Friend" }, { value: "other", label: "Other" }];

  // Enter edit mode and clear dropdowns that should be re-selected by the user
  const enterEditMode = () => {
    setIsEditMode(true);
    // clear dropdown values and bump key to force remount of CustomSelects
    setProfile((p) => ({
      ...p,
      department: "",
      semester: "",
      emergencyContactRelation: "",
    }));
    setEditKey((k) => k + 1);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // If a new photo was selected, upload it first and include its URL in the payload
      let avatarUrl = profile.avatar || "";
      if (selectedPhotoFile) {
        const uploaded = await uploadPhoto(selectedPhotoFile);
        if (uploaded) avatarUrl = uploaded;
      }
      axios.defaults.withCredentials = true;
      const payload = {
        fullName: `${profile.firstName} ${profile.lastName}`.trim(),
        regiNumber: profile.regNum,
        indexNum: profile.indexNumber,
        email: profile.email,
        contactNum: profile.contactNumber,
        dob: profile.dateOfBirth,
        gender: profile.gender,
        address: profile.address,
        department: profile.department,
        semester: profile.semester,
        emergencyContactInfo: {
          name: profile.emergencyContactName,
          contactNum: profile.emergencyContactNumber,
          relation: profile.emergencyContactRelation,
          address: profile.emergencyContactAddress,
        },
        avatar: avatarUrl,
      };
      const res = await axios.put(`${backendUrl}/student/update`, payload);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "Profile updated");
        setIsEditMode(false);
        loadProfile();
      } else {
        toast.error((res.data && res.data.message) || "Update failed");
      }
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Photo selection, preview and upload helpers
  const fileInputRef = useRef(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handlePhotoSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setSelectedPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    toast.info("Photo selected: " + file.name);
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const uploadPhoto = async (file) => {
    try {
      const form = new FormData();
      form.append("avatar", file);
      axios.defaults.withCredentials = true;
      const r = await axios.post(`${backendUrl}/student/upload-avatar`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (r.data && r.data.success) {
        // backend should return the avatar URL in `avatarUrl` or `message`
        return r.data.avatarUrl || r.data.message || "";
      }
      toast.error((r.data && r.data.message) || "Photo upload failed");
    } catch (err) {
      toast.error(err.message || "Photo upload failed");
    }
    return null;
  };

  const uploadNow = async () => {
    if (!selectedPhotoFile) {
      toast.info("No photo selected");
      return;
    }
    setLoading(true);
    try {
      const url = await uploadPhoto(selectedPhotoFile);
      if (url) {
        // update local profile immediately and clear selection
        setProfile((p) => ({ ...p, avatar: url }));
        setSelectedPhotoFile(null);
        setPreviewUrl("");
        toast.success("Photo uploaded");
        // reload profile to ensure server-side values are synced
        loadProfile();
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset all changes?")) {
      loadProfile();
      setIsEditMode(false);
      setSelectedPhotoFile(null);
      setPreviewUrl("");
    }
  };

  const submitChangeRequest = () => {
    // placeholder for submitting a change request to admins
    toast.success("Change request submitted successfully!");
    setShowChangeRequestModal(false);
    setChangeRequestField("");
  };

  const closeModal = () => {
    setShowChangeRequestModal(false);
    setChangeRequestField("");
  };

  if (loading && !profile.firstName) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-2xl" style={{ color: "var(--foc-navy)" }}></i>
          <p className="mt-2 text-gray-600">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--foc-navy)" }}>
            Student Profile
          </h1>
          <p className="text-sm text-gray-600">Manage your academic and contact details</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={previewUrl || profile.avatar || "/user.jpg"}
              alt="avatar"
              className="w-12 h-12 rounded-full border-2 object-cover"
              style={{ borderColor: "var(--foc-gold)" }}
            />
            {isEditMode && (
              <>
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="absolute -bottom-1 -right-1 bg-foc-navy text-white p-1 rounded-full"
                  aria-label="Change profile photo"
                >
                  <i className="fas fa-camera"></i>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelected} className="hidden" />
              </>
            )}
          </div>
          <div className="text-right">
            <div className="font-medium">Student</div>
            <div className="text-sm text-gray-600">{profile.regNum}</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Profile Details</div>
          <div className="flex gap-3">
            <button onClick={() => { if (!isEditMode) enterEditMode(); else setIsEditMode(false); }} className={`aum-btn-primary`}>
              <i className="fas fa-edit mr-2"></i>
              {isEditMode ? "Cancel" : "Edit"}
            </button>
            <button onClick={loadProfile} className="aum-btn-ghost">Refresh</button>
          </div>
        </div>

        <form onSubmit={handleSave}>
          {/* Profile photo upload section */}
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <div>
                <img src={previewUrl || profile.avatar || "/user.jpg"} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor: "var(--foc-gold)" }} />
              </div>
              <div className="flex-1">
                <div className="font-medium">Profile Photo</div>
                <div className="text-sm text-gray-600">Upload a clear headshot for your profile.</div>
                <div className="mt-2 flex items-center gap-2">
                  <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} className="aum-btn-ghost">Choose file</button>
                  {selectedPhotoFile && (
                    <>
                      <button type="button" onClick={async () => { await uploadNow(); }} className="aum-btn-primary">Upload now</button>
                      <button type="button" onClick={() => { setSelectedPhotoFile(null); setPreviewUrl(""); }} className="aum-btn-ghost">Cancel</button>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelected} className="hidden" />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">First name</label>
              <input name="firstName" value={profile.firstName || ""} onChange={handleChange} className="aum-input" disabled={!isEditMode} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Last name</label>
              <input name="lastName" value={profile.lastName || ""} onChange={handleChange} className="aum-input" disabled={!isEditMode} />
            </div>

            <div>
              <label className="block mb-1 font-medium">Registration number</label>
              <input name="regNum" value={profile.regNum || ""} className="aum-input disabled" readOnly />
            </div>
            <div>
              <label className="block mb-1 font-medium">Index number</label>
              <input name="indexNumber" value={profile.indexNumber || ""} className="aum-input disabled" readOnly />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input name="email" value={profile.email || ""} onChange={handleChange} className="aum-input" disabled={!isEditMode} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input name="contactNumber" value={profile.contactNumber || ""} onChange={handleChange} className="aum-input" disabled={!isEditMode} />
            </div>

            <div>
              <label className="block mb-1 font-medium">Department</label>
              {isEditMode ? (
                <CustomSelect key={`department-${editKey}`} placeholder="Please select department" name="department" value={profile.department} onChange={handleSelect} options={departmentOptions} />
              ) : (
                <input value={profile.department || ""} className="aum-input disabled" readOnly />
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Semester</label>
              {isEditMode ? (
                <CustomSelect key={`semester-${editKey}`} placeholder="Please select semester" name="semester" value={profile.semester} onChange={handleSelect} options={semesterOptions} />
              ) : (
                <input value={profile.semester || ""} className="aum-input disabled" readOnly />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Address</label>
              <textarea name="address" value={profile.address || ""} onChange={handleChange} className="aum-input" disabled={!isEditMode} rows={3} />
            </div>

            <div className="md:col-span-2">
              <h4 className="font-semibold mt-2">Emergency contact</h4>
            </div>

            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input name="emergencyContactName" value={profile.emergencyContactName || ""} onChange={handleChange} className="aum-input" disabled={!isEditMode} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input name="emergencyContactNumber" value={profile.emergencyContactNumber || ""} onChange={handleChange} className="aum-input" disabled={!isEditMode} />
            </div>

            <div>
              <label className="block mb-1 font-medium">Relationship</label>
              {isEditMode ? (
                <CustomSelect key={`relation-${editKey}`} placeholder="Please select relation" name="emergencyContactRelation" value={profile.emergencyContactRelation} onChange={handleSelect} options={relationOptions} />
              ) : (
                <input value={profile.emergencyContactRelation || ""} className="aum-input disabled" readOnly />
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Emergency address</label>
              <textarea name="emergencyContactAddress" value={profile.emergencyContactAddress || ""} onChange={handleChange} className="aum-input" disabled={!isEditMode} rows={2} />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            {isEditMode ? (
              <>
                <button type="button" onClick={resetForm} className="aum-btn-ghost">Reset</button>
                <button type="submit" className="aum-btn-primary">{loading ? "Saving…" : "Save changes"}</button>
              </>
            ) : (
              <button type="button" onClick={() => enterEditMode()} className="aum-btn-primary">Edit profile</button>
            )}
          </div>
        </form>
        {/* Change Request Modal */}
        {showChangeRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-foc-navy flex items-center">
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
                      onChange={(e) => setChangeRequestField(e.target.value)}
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
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Requested New Value:</label>
                    <input
                      type="text"
                      placeholder="Enter the new value you want"
                      className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                      className="bg-foc-navy text-white px-4 py-2 rounded hover:opacity-90 transition"
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
