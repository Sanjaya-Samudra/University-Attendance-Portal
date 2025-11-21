import { Link } from "react-router-dom";

function ProfessorSidebar() {
  return (
    <aside className="hidden md:block w-64 bg-white/80 backdrop-blur-md p-4 h-screen sticky top-0 shadow-lg border-r border-gray-200">
      <nav className="flex flex-col gap-2 mt-6">
        <Link to="/professor" className="sidebar-item flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 hover:shadow-sm text-gray-700 hover:text-purple-700">
          <span className="sidebar-icon transition-transform duration-200">
            <i data-feather="home" className="w-5 h-5"></i>
          </span>
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link to="/create-qr-session" className="sidebar-item flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 hover:shadow-sm text-gray-700 hover:text-purple-700">
          <span className="sidebar-icon transition-transform duration-200">
            <i data-feather="smartphone" className="w-5 h-5"></i>
          </span>
          <span className="font-medium">Create QR Session</span>
        </Link>
        {/* Course Management removed for professor users */}
        <Link to="/attendance-mark" className="sidebar-item flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 hover:shadow-sm text-gray-700 hover:text-purple-700">
          <span className="sidebar-icon transition-transform duration-200">
            <i data-feather="check-circle" className="w-5 h-5"></i>
          </span>
          <span className="font-medium">Mark Attendance</span>
        </Link>
        <Link to="/professor-report-generation" className="sidebar-item flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 hover:shadow-sm text-gray-700 hover:text-purple-700">
          <span className="sidebar-icon transition-transform duration-200">
            <i data-feather="bar-chart-2" className="w-5 h-5"></i>
          </span>
          <span className="font-medium">Reports</span>
        </Link>
        <Link to="/professor-profile" className="sidebar-item flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 hover:shadow-sm text-gray-700 hover:text-purple-700 mt-4">
          <span className="sidebar-icon transition-transform duration-200">
            <i data-feather="user" className="w-5 h-5"></i>
          </span>
          <span className="font-medium">Profile</span>
        </Link>
        <Link to="/professor-notifications" className="sidebar-item flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors duration-200 hover:shadow-sm text-gray-700 hover:text-purple-700">
          <span className="sidebar-icon transition-transform duration-200">
            <i data-feather="bell" className="w-5 h-5"></i>
          </span>
          <span className="font-medium">Notifications</span>
        </Link>
      </nav>
    </aside>
  );
}

export default ProfessorSidebar;