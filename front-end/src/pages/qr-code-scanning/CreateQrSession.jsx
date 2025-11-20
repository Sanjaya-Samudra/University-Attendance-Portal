import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import '../../styles/admin-user-management.css'
import '../../styles/report-generation.css'
import CustomSelect from '../../components/CustomSelect'

const CreateQrSession = () => {
  const [formData, setFormData] = useState({
    courseId: "",
    lectureTitle: "",
    qrValidTime: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const {backendUrl} = useContext(AppContext)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      
      axios.defaults.withCredentials = true

      const {data} = await axios.post(backendUrl + '/session/add', {
        courseId: formData.courseId,
        title: formData.lectureTitle,
        date: formData.date,
        validTime: formData.qrValidTime * 60 * 1000 // To milisecond
      })
      
      if (data.success) {
        toast.success(data.message)

        navigate("/generated-qr", {
          state: {
            sessionData: formData,
            qrCode: "sample-qr-code-data", // In real app, this would be generated,
            sessionId: data.sessionId
          }
        });

      }else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }

  };

  const getCourses = async () => {
    try {
      
      const {data} = await axios.get(backendUrl + '/course/get-prof')

      if(data.success) {
        setCourses(data.message)
      }else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleStillInSession = async () => {
    try {
      
      axios.defaults.withCredentials = true

      const {data} = await axios.get(backendUrl + '/session/get-active-session')

      if(data.success) {
        console.log(data.message)
        const session = data.message

        const newFormData = {
          courseId: session.courseId._id,
          lectureTitle: session.title,
          qrValidTime:
            Math.floor((session.validTimeExpireAt - Date.now()) / (1000 * 60)) < 0
              ? 0
              : Math.floor((session.validTimeExpireAt - Date.now()) / (1000 * 60)),
          date: session.date,
        };

        if(newFormData) {
          navigate("/generated-qr", {
          state: {
            sessionData: newFormData,
            qrCode: "sample-qr-code-data", // In real app, this would be generated,
            sessionId: session._id
          }
        });
        }
        
        
      }else {
        console.log(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    handleStillInSession()
    getCourses()
  }, [])
  
  return (
    <div className="aum-container">
      <div className="aum-header">
        <div>
          <div className="aum-title">Create Attendance Session</div>
          <div className="aum-sub">Generate QR codes for student attendance</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Welcome back,</div>
            <div className="font-medium text-[var(--foc-navy)]">Professor</div>
          </div>
          <img src="/user.jpg" alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-[var(--foc-navy)]" />
        </div>
      </div>

      <div className="aum-grid">
        <div className="aum-card">
          <h3 className="aum-list-title">Instructions</h3>
          <div className="aum-empty">
            <ul className="muted">
              <li>• Select the course for which you want to create an attendance session</li>
              <li>• Enter a descriptive lecture title</li>
              <li>• Set how long the QR code should remain valid (in minutes)</li>
              <li>• Choose the date for the session</li>
              <li>• Click "Generate QR Code" to create the attendance session</li>
            </ul>
          </div>
        </div>

        <div className="aum-card max-w-2xl mx-auto">
          <h2 className="aum-list-title mb-4">Session Details</h2>
          <form onSubmit={handleSubmit} className="aum-form">
            <div>
              <label className="aum-label">Course</label>
              {
                (() => {
                  const courseOptions = courses.map(c => ({ value: c._id, label: `${c.name} (${c.code})` }))
                  return (
                    <CustomSelect
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      options={courseOptions}
                      placeholder="Select Course"
                    />
                  )
                })()
              }
            </div>

            <div className="aum-row">
              <div>
                <label className="aum-label">Lecture Title</label>
                <input type="text" name="lectureTitle" value={formData.lectureTitle} onChange={handleChange} placeholder="Enter lecture title" className="aum-input" required />
              </div>
              <div>
                <label className="aum-label">QR Valid Time (minutes)</label>
                <input type="number" name="qrValidTime" value={formData.qrValidTime} onChange={handleChange} placeholder="15" min="1" max="120" className="aum-input" required />
              </div>
            </div>

            <div>
              <label className="aum-label">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="aum-input" required />
            </div>

            <div className="aum-actions">
              <button type="submit" className="aum-btn-primary" disabled={loading}>{loading ? 'Generating...' : 'Generate QR Code'}</button>
              <button type="button" onClick={() => navigate('/professor')} className="aum-btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQrSession;