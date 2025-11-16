import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import feather from "feather-icons";
import logo from "../assets/logo.jpg";
import "../styles/header.css";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Header() {

  const [style, setStyle] = useState('hidden md:inline-block');

  // Re-render feather icons after component mounts
  useEffect(() => {
    feather.replace();
  }, []);

  const {isLoggedIn, backendUrl,setIsLoggedIn, isLogged} = useContext(AppContext)

  const navigate = useNavigate()
  // CTA button uses `.cta-btn` for styling; `style` only controls responsive visibility.

  const onHandleClick = async (e) => {
    if(isLoggedIn) {
      
      const {data} = await axios.post(backendUrl + '/auth/logout')
      
      if(data.success) {
        setIsLoggedIn(false)
        toast.success(data.message)
        navigate('/')
      }else {
        toast.error(data.message)
      }


    }else {
      navigate('/signin')
    }
  }

  useEffect(() => {
    isLogged();
  }, [])

  return (
    <header className="faculty-header flex justify-between items-center px-6 py-4 sticky top-0 z-50">
      {/* Logo + Title */}
      <Link to="/" className="brand hover:opacity-95 transition-opacity duration-150">
        <img
          src="/brand/university logo.png"
          alt="Faculty of Computing Logo"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = logo; }}
        />
        <div>
          <h1>Faculty of Computing</h1>
          <div className="subtitle">Attendance Tracking Portal</div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex gap-8 font-medium items-center">
        <Link to="/" className="flex items-center gap-2">
          <i data-feather="home" className="w-4 h-4"></i> Home
        </Link>
        <Link to="/about" className="flex items-center gap-2">
          <i data-feather="info" className="w-4 h-4"></i> About
        </Link>
        <Link to="/contact" className="flex items-center gap-2">
          <i data-feather="mail" className="w-4 h-4"></i> Contact
        </Link>
      </nav>

      {/* Buttons */}
      <div className="flex items-center gap-4">
        <button className={`cta-btn ${style}`} onClick={(e) => {onHandleClick(e)}}>
          {isLoggedIn ? 'Logout' : 'Get Started'}
        </button>

        <button className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" aria-label="menu">
          <i data-feather="menu" className="w-5 h-5 text-gray-700"></i>
        </button>
      </div>
    </header>
  );
}

export default Header;