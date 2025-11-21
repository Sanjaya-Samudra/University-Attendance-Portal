import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import '../../styles/admin-user-management.css'

const StudentDashboard = () => {
  const [stats, setStats] = useState([]);
  const [studentInfo, setStudentInfo] = useState({ name: '', dept: '', avatar: '/user.jpg', courses: 0 });

  const [recentAttendance, setRecentAttendance] = useState([]);

  // navigation items removed (not used in this layout)

  const { backendUrl } = useContext(AppContext);

  const getTheData = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(backendUrl + '/student/dashboard');
      if (data.success) {
        const newStats = [];
        if (data.message?.attendanceRate) newStats.push({ title: 'Attendance Rate', value: data.message.attendanceRate, icon: '📊' });
        if (data.message?.totalClasses) newStats.push({ title: 'Total Classes', value: String(data.message.totalClasses), icon: '📚' });
        if (data.message?.presentDays) newStats.push({ title: 'Present Days', value: String(data.message.presentDays), icon: '✅' });
        if (data.message?.absentDays) newStats.push({ title: 'Absent Days', value: String(data.message.absentDays), icon: '❌' });
        setStats(newStats);

        setRecentAttendance(data.message.recentAttendance || []);

        // populate student info if available
        const student = data.message.student || data.message.profile || {};
        setStudentInfo({
          name: student.name || student.fullName || data.message.studentName || '',
          dept: student.department || student.dept || data.message.department || '',
          avatar: student.avatar || student.photo || data.message.avatar || '/user.jpg',
          courses: data.message.courseCount || student.courseCount || student.courses || 0,
        });
      } else {
        toast.error(data.message || 'Failed to load dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load dashboard');
      console.error(error);
    }
  };

  useEffect(() => {
    getTheData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derive numeric attendance for progress bar
  const attendancePercent = (() => {
    const raw = stats[0]?.value ?? '';
    const n = parseInt(String(raw).replace('%',''));
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
  })();

  return (
    <div className="aum-container">
      <style>{` 
        .sd-layout{ display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 900px) { .sd-layout{ grid-template-columns: 1fr 320px; align-items:start } }
        .kpi-grid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(180px,1fr)); gap:16px }
      `}</style>
      <div className="aum-header">
        <div>
          <div className="aum-title">Student Dashboard</div>
          <div className="aum-sub">Faculty of Computing — Student panel</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div style={{textAlign:'right'}} className="muted">
            <div style={{fontSize:12}}>Welcome back,</div>
            <div style={{fontWeight:700,color:'var(--foc-navy)'}}>Student</div>
          </div>
          <img src="/user.jpg" alt="profile" className="profile-avatar" style={{width:48,height:48}} />
        </div>
      </div>

      <div className="sd-layout">
        {/* Main column */}
        <div>
          <div className="kpi-grid" style={{marginBottom:18}}>
            {stats.map((s, i) => (
              <div key={i} className="aum-card" style={{padding:14,display:'flex',gap:12,alignItems:'center'}}>
                <div style={{width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:10,background:'rgba(0,33,71,0.06)',color:'var(--foc-navy)',fontSize:18}}>{s.icon}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:'var(--foc-muted)'}}>{s.title}</div>
                  <div style={{fontSize:18,fontWeight:800,color:'var(--foc-navy)'}}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="aum-card" style={{marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div style={{fontWeight:800,color:'var(--foc-navy)'}}>Attendance Progress</div>
              <div style={{fontSize:13,color:'var(--foc-muted)'}}>{attendancePercent}%</div>
            </div>
            <div style={{height:12,background:'#eef2ff',borderRadius:8,overflow:'hidden'}}>
              <div style={{width:`${attendancePercent}%`,height:'100%',background:'linear-gradient(90deg,var(--foc-gold), rgba(255,209,0,0.8))'}} />
            </div>
            <div className="muted" style={{marginTop:10,fontSize:13}}>Keep attending to maintain your score.</div>
          </div>

          <div className="aum-card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div style={{fontWeight:800,color:'var(--foc-navy)'}}>Recent Attendance</div>
              <div className="aum-badge">Latest</div>
            </div>
            <div style={{overflowX:'auto'}}>
              <table className="w-full" style={{borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{borderBottom:'1px solid rgba(2,17,50,0.06)'}}>
                    <th className="muted" style={{textAlign:'left',padding:'10px 8px'}}>Course</th>
                    <th className="muted" style={{textAlign:'left',padding:'10px 8px'}}>Status</th>
                    <th className="muted" style={{textAlign:'left',padding:'10px 8px'}}>Date</th>
                    <th className="muted" style={{textAlign:'left',padding:'10px 8px'}}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttendance && recentAttendance.length ? recentAttendance.slice(0,8).map((r, idx) => (
                    <tr key={idx} style={{borderBottom:'1px solid rgba(2,17,50,0.04)'}}>
                      <td style={{padding:'10px 8px'}}>{r.courseId?.code ?? r.course}</td>
                      <td style={{padding:'10px 8px'}}>
                        <span style={{padding:'6px 10px',borderRadius:999,background: r.status === 'present' ? '#ecfdf5' : '#fff1f2',color: r.status === 'present' ? '#059669' : '#dc2626',fontWeight:700,fontSize:13}}>
                          {r.status === 'present' ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td style={{padding:'10px 8px'}}>{r.date}</td>
                      <td style={{padding:'10px 8px'}}>{r.time}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="aum-empty">No recent attendance available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <aside>
          <div className="aum-card" style={{textAlign:'center'}}>
            <img src={studentInfo.avatar || '/user.jpg'} alt="avatar" className="profile-avatar" style={{width:96,height:96,margin:'0 auto 10px'}} />
              <div style={{fontWeight:800,color:'var(--foc-navy)',fontSize:16}}>{studentInfo.name || 'Student'}</div>
              <div className="muted" style={{marginBottom:12}}>{studentInfo.dept || ''}</div>
            <div style={{display:'flex',gap:8,justifyContent:'center'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontWeight:800,color:'var(--foc-navy)'}}>{attendancePercent}%</div>
                <div className="muted" style={{fontSize:12}}>Attendance</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontWeight:800,color:'var(--foc-navy)'}}>{studentInfo.courses || '-'}</div>
                <div className="muted" style={{fontSize:12}}>Courses</div>
              </div>
            </div>
          </div>

          <div className="aum-card" style={{marginTop:12}}>
            <div style={{fontWeight:800,color:'var(--foc-navy)',marginBottom:8}}>Quick Actions</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              <Link to="/view-attendance" className="aum-btn-primary" style={{justifyContent:'center'}}>View Report</Link>
              <Link to="/student-notifications" className="aum-btn-primary" style={{justifyContent:'center'}}>Notifications</Link>
              <Link to="/student-profile" className="aum-btn-ghost" style={{justifyContent:'center'}}>Edit Profile</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StudentDashboard;