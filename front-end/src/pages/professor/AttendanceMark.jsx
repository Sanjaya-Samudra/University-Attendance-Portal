import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import CustomSelect from '../../components/CustomSelect'
import '../../styles/admin-user-management.css'
import '../../styles/report-generation.css'

const AttendanceMark = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {backendUrl} = useContext(AppContext)

  useEffect(() => {
    loadProfessorCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadStudentsForCourse(selectedCourse);
    }
  }, [selectedCourse]);

  const loadProfessorCourses = async () => {
    try {
      // Mock API call - replace with actual API

      axios.defaults.withCredentials = true

      const {data} = await axios.get(backendUrl + '/professor/get-attendance');

      if(data.success) {
        setCourses(data.message);
      }

      
    } catch {
      setError("Failed to load courses. Please try again.");
    }
  };

  const loadStudentsForCourse = async (courseId) => {
    try {

      axios.defaults.withCredentials = true
      
      const {data} = await axios.get(backendUrl + `/professor/get-attendance-not-approval/${selectedCourse}`)

      if (data.success) {
        setStudents(data.message)
        
      }else {
        setError(data.message)
      }
    } catch {
      setError("Failed to load students. Please try again.");
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAllPresent = () => {
    const allPresent = {};
    students.forEach(student => {
      allPresent[student.id] = "present";
    });
    setAttendanceData(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent = {};
    students.forEach(student => {
      allAbsent[student.id] = "absent";
    });
    setAttendanceData(allAbsent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      setError("Please select a course.");
      return;
    }

    saveAttendance()

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset form
      setSelectedCourse("");
      setStudents([]);
      setAttendanceData({});
    } catch {
      setError("Failed to save attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "late":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const saveAttendance = async () => {
    try {
      
      axios.defaults.withCredentials = true

      const {data} = await axios.post(backendUrl + '/professor/save-attend', {sessionId: selectedCourse})

      if(data.success) {
        toast.success(data.message)
        loadProfessorCourses()
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="aum-container">
      {/* Header */}
      <div className="aum-header" style={{marginBottom:12}}>
        <div>
          <div className="aum-title"><i className="fas fa-user-check mr-2"></i>Mark Attendance</div>
          <div className="aum-sub">Record student attendance for your sessions</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-500">Welcome back,</div>
            <div className="font-medium text-[var(--foc-navy)]">Professor</div>
          </div>
          <img src="/user.jpg" alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-[var(--foc-navy)]" />
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="aum-card" style={{borderLeft:'4px solid #ef4444', marginBottom:12}}>
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {success && (
        <div className="aum-card" style={{borderLeft:'4px solid #10b981', marginBottom:12}}>
          <div className="text-green-700">{success}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="aum-card">
        {/* Course Selection */}
        <div className="mb-6">
          <label className="aum-label">
            <i className="fas fa-book mr-1"></i>
            Select Course *
          </label>
          {
            (() => {
              const courseOptions = courses.map(c => ({ value: c._id || c.id, label: `${c.courseCode ?? c.code ?? ''} ${c.title ?? c.name} ${c.date ? `(${c.date})` : ''}` }))
              return (
                <CustomSelect
                  name="selectedCourse"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  options={courseOptions}
                  placeholder="Choose a course..."
                />
              )
            })()
          }
        </div>

        {/* Bulk Actions */}
        {students.length > 0 && (
          <div className="mb-6">
            <label className="aum-label">Bulk Actions</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={markAllPresent}
                className="aum-btn-primary"
              >
                <i className="fas fa-check mr-2"></i>
                Mark All Present
              </button>
              <button
                type="button"
                onClick={markAllAbsent}
                className="aum-btn-ghost"
                style={{borderColor:'rgba(239,68,68,0.08)', color:'#ef4444'}}
              >
                <i className="fas fa-times mr-2"></i>
                Mark All Absent
              </button>
            </div>
          </div>
        )}

        {/* Students List */}
        {students.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--foc-navy)] mb-4">
              Mark Attendance for {courses.find(c => (c._id || c.id) === selectedCourse)?.title || courses.find(c => (c._id || c.id) === selectedCourse)?.name}
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {students.map(student => (
                <div key={student.studentId._id} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId._id}`}
                      alt={student.studentId.fullName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{student.studentId.fullName}</div>
                      <div className="text-sm text-gray-600">{student.studentId.regiNumber}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAttendanceChange(student.studentId._id, 'present')}
                      className={`px-3 py-1 rounded text-sm font-medium capitalize transition ${getStatusColor(attendanceData[student.studentId._id] || student.status)}`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendanceChange(student.studentId._id, 'absent')}
                      className={`px-3 py-1 rounded text-sm font-medium capitalize transition ${getStatusColor(attendanceData[student.studentId._id] || student.status)}`}
                    >
                      Absent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAttendanceChange(student.studentId._id, 'late')}
                      className={`px-3 py-1 rounded text-sm font-medium capitalize transition ${getStatusColor(attendanceData[student.studentId._id] || student.status)}`}
                    >
                      Late
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {students.length > 0 && (
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="aum-btn-primary"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Saving Attendance...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Save Attendance
                </>
              )}
            </button>
          </div>
        )}

        {/* No Course Selected Message */}
        {!selectedCourse && (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-book text-4xl mb-4"></i>
            <p>Please select a course to start marking attendance.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AttendanceMark;