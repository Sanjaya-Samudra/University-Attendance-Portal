import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
// Features and Services pages removed — imports omitted
import About from "./pages/About";
import Contact from "./pages/Contact";
import StudentManagement from "./pages/admin/StudentManagement";
import ProfessorManagement from "./pages/professormanagement";
import CourseManagement from "./pages/coursemanagement";
import Reports from "./pages/report";
import Header from "./components/header";
import Footer from "./components/footer";
import AdminSidebar from "./components/AdminSidebar";
import ProfessorSidebar from "./components/ProfessorSidebar";
import StudentSidebar from "./components/StudentSidebar";
import SignIn from "./pages/signin";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import CourseUnitManagement from "./pages/admin/CourseUnitManagement";
import AdminProfessorManagement from "./pages/admin/ProfessorManagement";
import ReportGeneration from "./pages/admin/ReportGeneration";
import ProfessorNotification from "./pages/professor/ProfessorNotification";
import ProfessorProfile from "./pages/professor/ProfessorProfile";
import ProfessorReportGeneration from "./pages/professor/ProfessorReportGeneration";
import StudentNotifications from "./pages/professor/StudentNotifications";
import StudentNotificationsPanel from "./pages/student/StudentNotifications";
import AttendanceMark from "./pages/professor/AttendanceMark";
import CreateQrSession from "./pages/qr-code-scanning/CreateQrSession";
import GeneratedQr from "./pages/qr-code-scanning/GeneratedQr";
import QrLoading from "./pages/qr-code-scanning/QrLoading";
import UpdatePassword from "./pages/UpdatePassword";
import StudentProfile from "./pages/student/StudentProfile";
import ViewAttendance from "./pages/student/ViewAttendance";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProfessorDashboard from "./pages/professor/ProfessorDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";

import "./index.css";
import { ToastContainer } from "react-toastify";

// Admin Layout with admin sidebar
function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

// Professor Layout with professor sidebar
function ProfessorLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <ProfessorSidebar />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

// Student Layout with student sidebar
function StudentLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <StudentSidebar />
        <main className="flex-1 bg-gray-50">{children}</main>
      </div>
      <Footer />
    </div>
  );
}

// Layout without sidebar (for home)
function LayoutNoSidebar({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-6 py-4 bg-gray-50">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        {/* Home page without sidebar */}
        <Route
          path="/"
          element={
            <LayoutNoSidebar>
              <Home />
            </LayoutNoSidebar>
          }
        />

        {/* Features and Services pages removed from this build */}

        {/* About page */}
        <Route
          path="/about"
          element={
            <LayoutNoSidebar>
              <About />
            </LayoutNoSidebar>
          }
        />

        {/* Contact page */}
        <Route
          path="/contact"
          element={
            <LayoutNoSidebar>
              <Contact />
            </LayoutNoSidebar>
          }
        />

        {/* Sign in page */}
        <Route
          path="/signin"
          element={
            <LayoutNoSidebar>
              <SignIn />
            </LayoutNoSidebar>
          }
        />

        {/* Update Password page */}
        <Route
          path="/update-password"
          element={
            <LayoutNoSidebar>
              <UpdatePassword />
            </LayoutNoSidebar>
          }
        />

        {/* QR Loading page (standalone) */}
        <Route path="/qr-loading/:id" element={<QrLoading />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />
        <Route
          path="/students"
          element={
            <AdminLayout>
              <StudentManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/professors"
          element={
            <AdminLayout>
              <AdminProfessorManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/courses"
          element={
            <AdminLayout>
              <CourseManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <AdminLayout>
              <Reports />
            </AdminLayout>
          }
        />
        <Route
          path="/adminuser"
          element={
            <AdminLayout>
              <AdminUserManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/course-unit-management"
          element={
            <AdminLayout>
              <CourseUnitManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/admin-professor-management"
          element={
            <AdminLayout>
              <AdminProfessorManagement />
            </AdminLayout>
          }
        />
        <Route
          path="/admin-report-generation"
          element={
            <AdminLayout>
              <ReportGeneration />
            </AdminLayout>
          }
        />

        {/* Professor Routes */}
        <Route
          path="/professor"
          element={
            <ProfessorLayout>
              <ProfessorDashboard />
            </ProfessorLayout>
          }
        />
        {/* Professor course management removed from professor routes (admin retains CourseUnitManagement) */}
        <Route
          path="/professor-notifications"
          element={
            <ProfessorLayout>
              <ProfessorNotification />
            </ProfessorLayout>
          }
        />
        <Route
          path="/professor-profile"
          element={
            <ProfessorLayout>
              <ProfessorProfile />
            </ProfessorLayout>
          }
        />
        <Route
          path="/professor-report-generation"
          element={
            <ProfessorLayout>
              <ProfessorReportGeneration />
            </ProfessorLayout>
          }
        />
        <Route
          path="/professor/student-notifications"
          element={
            <ProfessorLayout>
              <StudentNotifications />
            </ProfessorLayout>
          }
        />
        <Route
          path="/attendance-mark"
          element={
            <ProfessorLayout>
              <AttendanceMark />
            </ProfessorLayout>
          }
        />
        <Route
          path="/create-qr-session"
          element={
            <ProfessorLayout>
              <CreateQrSession />
            </ProfessorLayout>
          }
        />
        <Route
          path="/generated-qr"
          element={
            <ProfessorLayout>
              <GeneratedQr />
            </ProfessorLayout>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <StudentLayout>
              <StudentDashboard />
            </StudentLayout>
          }
        />
        <Route
          path="/student-profile"
          element={
            <StudentLayout>
              <StudentProfile />
            </StudentLayout>
          }
        />
        <Route
          path="/view-attendance"
          element={
            <StudentLayout>
              <ViewAttendance />
            </StudentLayout>
          }
        />
        <Route
          path="/student-notifications"
          element={
            <StudentLayout>
              <StudentNotificationsPanel />
            </StudentLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
