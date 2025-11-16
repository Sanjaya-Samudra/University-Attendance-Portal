import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import "../styles/signin.css";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, setRole } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + "/auth/login", { username, password });

      if (data.success) {
        toast.success(data.message);
        setIsLoggedIn(true);
        setRole(data.role);

        if (data.role == "student") navigate("/student");
        else if (data.role == "professor") navigate("/professor");
        else if (data.role == "admin") navigate("/admin");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Login failed");
    }
  };

  const handleMicrosoftSignIn = () => {
    // Frontend-first behavior: attempt to redirect to backend Microsoft OAuth route if available.
    if (backendUrl) {
      // This endpoint can be implemented server-side later to start OAuth flow.
      window.location.href = `${backendUrl}/auth/microsoft`;
    } else {
      toast.info("Redirecting to Microsoft sign-in (placeholder)");
      // Future: integrate MSAL or direct OAuth flow on frontend.
      console.log("Microsoft sign-in invoked");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Branding / Welcome */}
        <div className="hidden lg:flex flex-col items-start justify-center brand-hero">
          <img src="/brand/university logo.png" alt="Faculty Logo" className="w-28 mb-6 object-contain" />
          <h2 className="text-2xl font-semibold text-[#002147] mb-2">Faculty of Computing</h2>
          <p className="text-gray-700 mb-4">University of Sri Jayewardenepura</p>
          <p className="text-gray-600">Sign in with your University account to access the attendance portal, course materials and notifications.</p>
        </div>

        {/* Right: Sign-in card */}
        <div className="foc-signin-card">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#002147] text-center mb-6">Sign in to your account</h1>

          <div className="space-y-4">
            <button
              onClick={handleMicrosoftSignIn}
              className="foc-ms-button w-full"
              aria-label="Sign in with Microsoft"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="8" height="8" fill="#F35325" />
                <rect x="13" y="3" width="8" height="8" fill="#81BC06" />
                <rect x="3" y="13" width="8" height="8" fill="#05A6F0" />
                <rect x="13" y="13" width="8" height="8" fill="#FFBA08" />
              </svg>
              <span className="font-medium">Sign in with Microsoft</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200"></div>
              <div className="text-sm text-gray-400">or</div>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full foc-input"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full foc-input"
                />
                <div className="mt-2 text-right">
                  <a
                    href="https://passwordreset.microsoftonline.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#002147] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full foc-submit text-center font-medium"
              >
                Sign In
              </button>
            </form>

            <div className="mt-3 text-center text-gray-600 text-sm">
              <p>
                Use your University Microsoft account to sign in. If you require access or help,
                contact <a href="mailto:info@sjp.ac.lk" className="text-[#002147] underline">Faculty IT Support</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
