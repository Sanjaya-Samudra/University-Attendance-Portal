import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function Home() {
  const { isLoggedIn, role } = useContext(AppContext);
  const navigate = useNavigate();

  const goToDashboard = () => {
    if (!isLoggedIn) return navigate('/signin');
    if (role === 'student') return navigate('/student');
    if (role === 'professor') return navigate('/professor');
    if (role === 'admin') return navigate('/admin');
    return navigate('/');
  }

  return (
    <main className="min-h-screen bg-gray-50 text-slate-800">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Hero */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147]">Faculty of Computing</h2>
            <p className="mt-2 text-lg text-gray-600">University of Sri Jayewardenepura</p>
            <p className="mt-6 text-base text-gray-700 leading-relaxed">
              A secure, university-grade attendance tracking portal tailored for
              students, professors and administrators. Record attendance, generate
              reports and get actionable insights — designed to meet academic needs.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to={isLoggedIn ? '#' : '/signin'}
                onClick={(e) => { if (isLoggedIn) { e.preventDefault(); goToDashboard(); } }}
                className="inline-flex items-center gap-3 bg-[#ffd100] text-[#002147] font-semibold px-5 py-3 rounded-lg shadow-md hover:bg-[#ffd400] transition"
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Login'}
              </Link>

              <button
                onClick={() => navigate('/about')}
                className="px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Illustration / image - show university logo */}
          <div className="flex justify-center md:justify-end">
            <img src="/brand/university logo.png" alt="University logo" className="w-56 h-56 object-contain rounded-lg shadow-lg bg-white p-4" onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src='/user.jpg'}} />
          </div>
        </div>

        {/* Features */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="p-6 bg-white border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#002147]">Accurate Attendance</h3>
            <p className="mt-2 text-sm text-gray-600">Mark attendance quickly and accurately using QR-sessions and professor tools.</p>
          </article>

          <article className="p-6 bg-white border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#002147]">Reports & Analytics</h3>
            <p className="mt-2 text-sm text-gray-600">Generate class-wise and student-wise attendance reports for audits and reviews.</p>
          </article>

          <article className="p-6 bg-white border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-[#002147]">Secure & Role-based</h3>
            <p className="mt-2 text-sm text-gray-600">Permissions for students, professors and administrators to protect academic data.</p>
          </article>
        </section>
      </section>
    </main>
  );
}

export default Home;
