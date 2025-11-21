import axios from "axios";
import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import CustomSelect from '../../components/CustomSelect'
import '../../styles/admin-user-management.css'

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

  const fileInputRef = useRef(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)

  const handlePhotoSelect = (e) => {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    setPhotoFile(f)
    setPhotoPreview(URL.createObjectURL(f))
  }

  const handleChangePhotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

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
    <div className="aum-container">
      <div className="aum-header">
        <div>
          <div className="aum-title">Professor Profile</div>
          <div className="aum-sub">Keep your profile up to date for students</div>
        </div>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap:20, maxWidth:900, margin:'0 auto'}}>
        <aside className="profile-card" style={{width:'100%'}}>
          <div style={{display:'flex', justifyContent:'flex-end'}}>
            <div>
              <button
                type="button"
                onClick={() => setIsEditMode(!isEditMode)}
                className="aum-btn-primary"
                style={{padding:'6px 10px', fontSize:14}}
              >
                {isEditMode ? 'Viewing' : 'Edit'}
              </button>
            </div>
          </div>

          <div style={{display:'flex', gap:16, alignItems:'center', marginTop:8}}>
            <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
              <img
                src={photoPreview || profileData.photoUrl || '/user.jpg'}
                alt="Professor Photo"
                style={{width:96, height:96, borderRadius:999, objectFit:'cover', border:'3px solid var(--foc-navy)'}}
              />
              {isEditMode ? (
                <div style={{marginTop:10, display:'flex', gap:8}}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelect} style={{display:'none'}} />
                  <button type="button" onClick={handleChangePhotoClick} className="aum-btn-primary">Change</button>
                  <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(null) }} className="aum-btn-ghost">Reset</button>
                </div>
              ) : null}
            </div>

            <div>
              <div className="profile-name">{profileData.professorName}</div>
              <div className="profile-role">{profileData.designation}</div>
              <div className="profile-dept">{profileData.department ? profileData.department.replace("-", " ").toUpperCase() : ''}</div>
              <div className="profile-stats">
                <div className="profile-stat"><div className="value">{profileData.dateOfJoin || '-'}</div><div className="muted">Joined</div></div>
                <div className="profile-stat"><div className="value">{profileData.officeHours || '-'}</div><div className="muted">Office Hours</div></div>
              </div>
            </div>
          </div>

          <div style={{marginTop:16}}>
            <div className="section-title"><span className="icon">📬</span><span className="text">Contact</span></div>
            <div className="muted">{profileData.email}</div>
            <div className="muted">{profileData.phoneNumber}</div>
          </div>
        </aside>

        <main>
          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="aum-card">
            {/* Basic Information */}
            <div className="mb-6">
              <div className="section-title"><span className="icon">👤</span><span className="text">Basic Information</span></div>
              <div className="gold-underline" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{marginTop:12}}>
                <div>
                  <label className="block mb-1 font-medium">Professor ID</label>
                  <input type="text" name="professorId" value={profileData.professorId} className="aum-input" readOnly />
                </div>

            <div>
              <label className="block mb-1 font-medium">Full Name *</label>
              <input
                type="text"
                name="professorName"
                value={profileData.professorName}
                onChange={handleChange}
                disabled={!isEditMode}
                className="aum-input"
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
                  className="aum-input"
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
                className="aum-input"
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
                className="aum-input"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Department</label>
              <div className="flex gap-2">
                <CustomSelect
                  name="department"
                  value={profileData.department}
                  onChange={handleChange}
                  options={[]}
                  placeholder="Select Department"
                />
                <button type="button" className="aum-btn-ghost" style={{alignSelf:'center'}}>Request Change</button>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">Designation</label>
              <CustomSelect
                name="designation"
                value={profileData.designation}
                onChange={handleChange}
                options={[]}
                placeholder="Select Designation"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Date of Join</label>
              <input
                type="date"
                name="dateOfJoin"
                value={profileData.dateOfJoin}
                onChange={handleChange}
                disabled={!isEditMode}
                className="aum-input"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
            <div className="mb-6">
              <div className="section-title"><span className="icon">ℹ️</span><span className="text">Additional Information</span></div>
              <div className="gold-underline" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{marginTop:12}}>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Address</label>
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleChange}
                disabled={!isEditMode}
                rows="3"
                className="aum-input"
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
                className="aum-input"
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
                className="aum-input"
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
                className="aum-input"
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
                className="aum-input"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {isEditMode && (
          <div style={{display:'flex', gap:12}}>
            <button type="submit" className="aum-btn-primary">Save Changes</button>
            <button type="button" onClick={() => setIsEditMode(false)} className="aum-btn-ghost">Cancel</button>
          </div>
        )}
      </form>
    </main>
  </div>
</div>
  );
};

export default ProfessorProfile;