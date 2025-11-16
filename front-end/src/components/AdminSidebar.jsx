import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import feather from "feather-icons";

function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64);

  // prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    // ensure feather icons render after mount/open
    try { feather.replace(); } catch (e) { /* ignore */ }
    return () => { document.body.style.overflow = "auto" };
  }, [open]);

  // measure header height so drawer sits below it (adaptive)
  useEffect(() => {
    function updateHeaderHeight() {
      const headerEl = document.querySelector('header');
      const h = headerEl ? headerEl.offsetHeight : 64;
      setHeaderHeight(h);
    }
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  const items = [
    { to: "/admin", label: "Dashboard", icon: "home" },
    { to: "/students", label: "Student Management", icon: "book" },
    { to: "/admin-professor-management", label: "Professor Management", icon: "users" },
    { to: "/course-unit-management", label: "Course Unit Management", icon: "user" },
    { to: "/admin-report-generation", label: "Report Generation", icon: "bar-chart-2" },
    { to: "/adminuser", label: "Admin User Management", icon: "settings" },
  ];

  const navItems = (
    <nav className="flex flex-col gap-2 mt-6 px-2">
      {items.map((it) => (
        <Link
          key={it.to}
          to={it.to}
          onClick={() => setOpen(false)}
          className="sidebar-item flex items-center gap-3 p-3 rounded-lg hover:bg-[#f2f6ff] transition-colors duration-200 hover:shadow-sm text-gray-700 hover:text-[#002147]"
        >
          <span className="sidebar-icon transition-transform duration-200">
            <i data-feather={it.icon} className="w-5 h-5"></i>
          </span>
          <span className="font-medium">{it.label}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 bg-white/90 backdrop-blur-md p-4 h-screen sticky top-0 shadow-lg border-r border-gray-200">
        {navItems}
      </aside>

      {/* Mobile: floating hamburger */}
      <div className="md:hidden">
        <button
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="fixed left-4 z-60 bg-white/90 p-2 rounded-lg shadow-md border border-gray-200 cursor-pointer"
          style={{ top: `${headerHeight + 8}px` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6h16M4 12h16M4 18h16" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Drawer overlay */}
        <div className={`fixed inset-0 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100 z-60' : 'opacity-0 z-40'}`} onClick={() => setOpen(false)}></div>

          <aside
            className={`fixed left-0 w-72 bg-white p-4 transform transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto pb-12`}
            style={{ top: `${headerHeight}px`, height: `calc(100vh - ${headerHeight}px)`, WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain', zIndex: 70 }}
            role="dialog"
            aria-modal="true"
          >
            {navItems}
          </aside>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;